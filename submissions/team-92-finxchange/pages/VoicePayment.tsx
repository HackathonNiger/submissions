
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, FunctionDeclaration, Type, Modality, LiveSession, LiveServerMessage, Blob } from '@google/genai';
import { VoiceIcon, SpinnerIcon } from '../components/icons';
// FIX: import getBankList and Bank type, remove non-existent 'banks' export
import { resolveAccountNumber, getBankList, Bank } from '../../services/bankApi';
import { AuthorizationModal } from '../../layouts/ServicePageLayout';


// --- Helper Functions for Audio Processing ---

function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}


function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}

// --- Component Types ---
type Step = 'idle' | 'listening' | 'verifying' | 'confirming';
type TransactionType = 'Transfer' | 'Airtime' | 'Data' | null;

interface ConfirmationDetails {
    type: TransactionType;
    details: Record<string, string | number>;
    rawArgs: any;
}

// --- Confirmation Modal Component ---
const ConfirmationModal: React.FC<{
    details: ConfirmationDetails;
    onConfirm: () => void;
    onCancel: () => void;
}> = ({ details, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-sm">
                <div className="p-6">
                    <h2 className="text-center text-2xl font-bold mb-4 text-text-light dark:text-text-dark">Confirm {details.type}</h2>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl space-y-2 text-left mb-6">
                        {Object.entries(details.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-baseline">
                                <span className="text-text-muted-light dark:text-text-muted-dark text-sm">{key}:</span>
                                <span className={`font-semibold text-text-light dark:text-text-dark text-right ${key === 'Amount' ? 'text-xl text-primary' : 'text-md'}`}>{value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 p-3 bg-slate-200 dark:bg-slate-700 rounded-lg text-center">
                        <p className="font-semibold text-sm text-text-light dark:text-text-dark">Say "Yes" to confirm or "No" to cancel.</p>
                        <div className="flex items-center justify-center space-x-1.5 mt-2">
                            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"></div>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <button onClick={onCancel} className="w-full h-12 bg-slate-200 dark:bg-slate-600 text-text-light dark:text-text-dark text-lg font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                            Cancel
                        </button>
                        <button onClick={onConfirm} className="w-full h-12 bg-primary text-white text-lg font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const VoicePayment: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('idle');
    const [statusMessage, setStatusMessage] = useState('Tap to start a voice payment.');
    const [confirmationDetails, setConfirmationDetails] = useState<ConfirmationDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [userTranscription, setUserTranscription] = useState('');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    // ADD: state for banks list
    const [banks, setBanks] = useState<Bank[]>([]);

    // --- Refs for Audio and Session Management ---
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const sources = useRef(new Set<AudioBufferSourceNode>());
    const nextStartTime = useRef(0);
    const outputNode = useRef<GainNode | null>(null);

    // ADD: fetch bank list on component mount
    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const bankList = await getBankList();
                setBanks(bankList);
            } catch (err) {
                console.error("Failed to fetch bank list", err);
                setError("Could not load bank data. Transfers might fail.");
            }
        };
        fetchBanks();
    }, []);


    // --- Gemini Function Declarations ---
    const transferFunctionDeclaration: FunctionDeclaration = {
        name: 'initiateTransfer',
        description: 'Initiates a bank transfer with the specified amount, recipient account number, and bank name.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                amount: { type: Type.NUMBER, description: 'The amount of money to send.' },
                accountNumber: { type: Type.STRING, description: 'The 10-digit bank account number of the recipient.' },
                bankName: { type: Type.STRING, description: 'The name of the recipient\'s bank.' },
            },
            required: ['amount', 'accountNumber', 'bankName'],
        },
    };

    const buyAirtimeFunctionDeclaration: FunctionDeclaration = {
        name: 'buyAirtime',
        description: 'Buys mobile airtime for a specific phone number.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                amount: { type: Type.NUMBER, description: 'The amount of airtime to buy.' },
                phoneNumber: { type: Type.STRING, description: 'The 11-digit phone number to receive the airtime.' },
                network: { type: Type.STRING, description: 'The mobile network provider, e.g., MTN, Glo, Airtel, 9mobile.' },
            },
            required: ['amount', 'phoneNumber', 'network'],
        },
    };

    const buyDataFunctionDeclaration: FunctionDeclaration = {
        name: 'buyData',
        description: 'Buys a mobile data bundle for a specific phone number.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                amount: { type: Type.NUMBER, description: 'The price of the data plan to buy. e.g., 1000 for a 1000 naira plan.' },
                phoneNumber: { type: Type.STRING, description: 'The 11-digit phone number to receive the data.' },
                network: { type: Type.STRING, description: 'The mobile network provider, e.g., MTN, Glo, Airtel, 9mobile.' },
            },
            required: ['amount', 'phoneNumber', 'network'],
        },
    };
    
    const confirmTransactionDeclaration: FunctionDeclaration = {
        name: 'confirmTransaction',
        description: 'Call this function ONLY when the user verbally agrees (e.g., says "yes", "confirm", "proceed") to the transaction details you have just presented. This is the final step before authorization.',
        parameters: {
            type: Type.OBJECT,
            properties: {},
        }
    };
    
    const cancelTransactionDeclaration: FunctionDeclaration = {
        name: 'cancelTransaction',
        description: 'Call this function ONLY when the user verbally disagrees (e.g., says "no", "cancel", "stop") with the transaction details you have just presented.',
        parameters: {
            type: Type.OBJECT,
            properties: {},
        }
    };

    // --- Core Functions ---
    const stopSession = useCallback(() => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            inputAudioContextRef.current.close();
        }
        setStep('idle');
    }, []);

    const handleToggleListen = async () => {
        if (step !== 'idle') {
            stopSession();
            setStatusMessage('Tap to start a voice payment.');
            return;
        }

        setStep('listening');
        setStatusMessage('Listening...');
        setError(null);
        setConfirmationDetails(null);
        setUserTranscription('');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            if (!outputAudioContextRef.current) {
                outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                outputNode.current = outputAudioContextRef.current.createGain();
            }

            const source = inputAudioContextRef.current.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;

            const systemInstruction = `You are a voice payment assistant for FinXchange. Your process is a strict two-stage flow.

**Stage 1: Gather Information**
- Your primary goal is to collect all necessary details for one of three transactions: transfer, airtime, or data.
- You must ask clarifying questions until you have all required parameters for one of these functions: 'initiateTransfer', 'buyAirtime', or 'buyData'.
- Once all parameters for a single transaction are gathered, call the corresponding function immediately.
- DO NOT ask for user confirmation during this stage.

**Stage 2: Final Confirmation**
- This stage begins only after the system sends you a tool response containing verified transaction details.
- At this point, your ONLY task is to get a final "yes" or "no" from the user.
- First, clearly state the verified details back to the user.
- Then, ask a direct confirmation question like "Is this correct?" or "Should I proceed with this payment?".
- If the user responds positively (e.g., "yes", "correct", "proceed"), you MUST call the 'confirmTransaction' function immediately and without any parameters.
- If the user responds negatively (e.g., "no", "cancel", "stop"), you MUST call the 'cancelTransaction' function immediately and without any parameters.
- CRITICAL: Once in Stage 2, you are in a locked confirmation state. You are forbidden from calling 'initiateTransfer', 'buyAirtime', or 'buyData' again. Your only valid actions are to call 'confirmTransaction' or 'cancelTransaction'. Do not ask any other questions.`;

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => console.log('Session opened'),
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle user transcription
                        if (message.serverContent?.inputTranscription) {
                            setUserTranscription(prev => prev + message.serverContent.inputTranscription.text);
                        }
                        // Handle model audio output
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current && outputNode.current) {
                            nextStartTime.current = Math.max(nextStartTime.current, outputAudioContextRef.current.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
                            const sourceNode = outputAudioContextRef.current.createBufferSource();
                            sourceNode.buffer = audioBuffer;
                            sourceNode.connect(outputNode.current);
                            outputNode.current.connect(outputAudioContextRef.current.destination);
                            sourceNode.addEventListener('ended', () => { sources.current.delete(sourceNode); });
                            sourceNode.start(nextStartTime.current);
                            nextStartTime.current += audioBuffer.duration;
                            sources.current.add(sourceNode);
                        }
                        // Handle function calls from the model
                        if (message.toolCall?.functionCalls) {
                            for (const fc of message.toolCall.functionCalls) {
                                await handleFunctionCall(fc);
                            }
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        setError('An error occurred. Please try again.');
                        stopSession();
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('Session closed');
                        if (step !== 'confirming' && step !== 'verifying') {
                            setStep('idle');
                            setStatusMessage('Session ended. Tap to start again.');
                        }
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    tools: [{ functionDeclarations: [transferFunctionDeclaration, buyAirtimeFunctionDeclaration, buyDataFunctionDeclaration, confirmTransactionDeclaration, cancelTransactionDeclaration] }],
                    systemInstruction,
                },
            });
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                sessionPromiseRef.current?.then((session) => {
                    session.sendRealtimeInput({ media: pcmBlob });
                });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current.destination);

        } catch (err) {
            console.error(err);
            setError('Could not access the microphone or initialize the AI service.');
            setStep('idle');
            setStatusMessage('Error. Please check permissions and try again.');
        }
    };
    
    const handleFunctionCall = async (fc: {id: string, name: string, args: any}) => {
        const session = await sessionPromiseRef.current;
        if (!session) return;
        
        switch (fc.name) {
            case 'initiateTransfer':
                // ADD: check if banks are loaded
                if (banks.length === 0) {
                    setError("Bank list is not available. Cannot proceed with transfer.");
                    stopSession();
                    session.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: "I am unable to proceed because the list of banks is currently unavailable. Please try again in a moment." } } });
                    return;
                }
                setStep('verifying');
                setStatusMessage(`Verifying details...`);
                const { amount, accountNumber, bankName } = fc.args;
                const bank = banks.find(b => b.name.toLowerCase().includes(bankName.toLowerCase()));
                if (!bank) {
                    setError(`Bank "${bankName}" not found.`);
                    stopSession();
                    return;
                }
                try {
                    const { accountName } = await resolveAccountNumber({ accountNumber, bankCode: bank.code });
                    setConfirmationDetails({ 
                        type: 'Transfer',
                        details: {
                            'Amount': `₦${amount.toLocaleString()}`,
                            'To': accountName,
                            'Bank': bank.name,
                            'Account': accountNumber
                        },
                        rawArgs: fc.args
                    });
                    setStep('confirming');
                    setStatusMessage(`Please confirm by speaking, or use the buttons below.`);
                    session.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: `Successfully verified account holder as ${accountName}. Awaiting user confirmation.` } } });
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Could not verify account.');
                    stopSession();
                }
                break;
            
            case 'buyAirtime': {
                setStep('verifying');
                setStatusMessage(`Verifying details...`);
                const { amount, phoneNumber, network } = fc.args;
                setConfirmationDetails({
                    type: 'Airtime',
                    details: {
                        'Service': 'Airtime Purchase',
                        'Amount': `₦${amount.toLocaleString()}`,
                        'For': phoneNumber,
                        'Network': network
                    },
                    rawArgs: fc.args
                });
                setStep('confirming');
                setStatusMessage(`Please confirm by speaking, or use the buttons below.`);
                session.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: `Details for airtime purchase are ready. Awaiting user confirmation.` } } });
                break;
            }

            case 'buyData': {
                setStep('verifying');
                setStatusMessage(`Verifying details...`);
                const { amount, phoneNumber, network } = fc.args;
                setConfirmationDetails({
                    type: 'Data',
                    details: {
                        'Service': 'Data Purchase',
                        'Plan': `₦${amount.toLocaleString()} Plan`,
                        'For': phoneNumber,
                        'Network': network
                    },
                    rawArgs: fc.args
                });
                setStep('confirming');
                setStatusMessage(`Please confirm by speaking, or use the buttons below.`);
                session.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: `Details for data purchase are ready. Awaiting user confirmation.` } } });
                break;
            }

            case 'confirmTransaction':
                handleConfirmPayment();
                break;

            case 'cancelTransaction':
                handleCancelPayment();
                break;
        }
    };

    const handleConfirmPayment = () => {
        if (!confirmationDetails) return;
        stopSession();
        setIsAuthModalOpen(true);
    };

    const executeFinalTransaction = () => {
        setIsAuthModalOpen(false);
        if (!confirmationDetails) return;

        let successState = {};
        const { type, details } = confirmationDetails;

        switch (type) {
            case 'Transfer':
                successState = {
                    title: 'Transfer Successful!',
                    message: `You have successfully sent ${details['Amount']} to ${details['To']} (${details['Bank']}).`,
                    primaryActionText: 'Done', primaryActionRoute: '/app/dashboard'
                };
                break;
            case 'Airtime':
                successState = {
                    title: 'Airtime Purchase Successful!',
                    message: `You have successfully purchased ${details['Amount']} airtime for ${details['For']}.`,
                    primaryActionText: 'Done', primaryActionRoute: '/app/dashboard'
                };
                break;
            case 'Data':
                 successState = {
                    title: 'Data Purchase Successful!',
                    message: `You have successfully purchased a ${details['Plan']} for ${details['For']}.`,
                    primaryActionText: 'Done', primaryActionRoute: '/app/dashboard'
                };
                break;
        }

        navigate('/success', {
            state: { ...successState, secondaryActionText: 'Make Another Voice Payment', secondaryActionRoute: '/app/voice-payment' },
            replace: true
        });
    };
    
    const handleCancelPayment = () => {
        stopSession();
        setConfirmationDetails(null);
        setUserTranscription('');
        setStatusMessage('Transaction cancelled. Tap to start a new payment.');
    };

    useEffect(() => {
        return () => { stopSession(); };
    }, [stopSession]);

    const renderContent = () => {
        switch(step) {
            case 'verifying':
                 return (
                    <div className="text-center animate-fade-in flex flex-col items-center">
                        <SpinnerIcon className="w-24 h-24 text-primary mx-auto" />
                        <p className="mt-8 text-lg font-semibold text-text-light dark:text-text-dark">{statusMessage}</p>
                         {userTranscription && (
                             <p className="mt-2 text-md text-text-muted-light dark:text-text-muted-dark italic max-w-sm">"{userTranscription}"</p>
                         )}
                    </div>
                );
            
            case 'confirming':
                // The modal is now handling the UI. Show a background state.
                return (
                    <div className="text-center flex flex-col items-center justify-center opacity-50">
                        <div className="relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 bg-primary text-white">
                            <span><VoiceIcon /></span>
                        </div>
                        <p className="mt-8 text-lg font-semibold text-text-light dark:text-text-dark">Awaiting Confirmation...</p>
                    </div>
                );

            case 'listening':
            case 'idle':
            default:
                return (
                    <div className="text-center flex flex-col items-center justify-center">
                        <button 
                            onClick={handleToggleListen}
                            aria-label={step === 'listening' ? 'Stop listening' : 'Start listening'}
                            className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl group ${step === 'listening' ? 'bg-red-500 text-white' : 'bg-primary text-white'}`}
                        >
                            <span className="transform group-hover:scale-110 transition-transform"><VoiceIcon /></span>
                            {step === 'idle' && <span className="absolute inset-0 rounded-full bg-primary opacity-50 animate-ping-slow group-hover:animate-ping"></span>}
                            {step === 'listening' && (
                                <>
                                    <span className="absolute h-full w-full rounded-full bg-red-400/80 animate-ripple-1"></span>
                                    <span className="absolute h-full w-full rounded-full bg-red-400/80 animate-ripple-2"></span>
                                </>
                            )}
                        </button>
                        <p className="mt-8 text-lg font-semibold text-text-light dark:text-text-dark whitespace-pre-wrap min-h-[28px]">{statusMessage}</p>
                        {userTranscription ? (
                             <p className="mt-2 text-md text-text-muted-light dark:text-text-muted-dark italic max-w-sm">"{userTranscription}"</p>
                        ) : (
                           step === 'idle' && <p className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">e.g., "Buy 1000 airtime for..."</p>
                        )}
                        {error && <p className="mt-4 text-red-500 font-semibold">{error}</p>}
                    </div>
                );
        }
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center h-full p-4 bg-background-light dark:bg-background-dark">
                {renderContent()}
                <style>{`
                    @keyframes ping-slow {
                      75%, 100% {
                        transform: scale(1.5);
                        opacity: 0;
                      }
                    }
                    .animate-ping-slow {
                      animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                    }
                    @keyframes ripple {
                      0% { transform: scale(.8); opacity: 1; }
                      100% { transform: scale(2.4); opacity: 0; }
                    }
                    .animate-ripple-1 { animation: ripple 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
                    .animate-ripple-2 { animation: ripple 1.5s cubic-bezier(0, 0, 0.2, 1) infinite 0.5s; }
                    @keyframes fade-in {
                      from { opacity: 0; transform: translateY(10px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.5s ease-out forwards;
                    }
                `}</style>
            </div>
            {step === 'confirming' && confirmationDetails && (
                <ConfirmationModal
                    details={confirmationDetails}
                    onConfirm={handleConfirmPayment}
                    onCancel={handleCancelPayment}
                />
            )}
            {confirmationDetails && (
                <AuthorizationModal
                    isOpen={isAuthModalOpen}
                    onClose={() => {
                        setIsAuthModalOpen(false);
                        handleCancelPayment();
                    }}
                    onConfirm={executeFinalTransaction}
                    title={`Authorize ${confirmationDetails.type}`}
                    details={confirmationDetails.details}
                />
            )}
        </>
    );
};

export default VoicePayment;