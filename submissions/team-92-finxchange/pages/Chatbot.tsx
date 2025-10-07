import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { SendIcon } from '../components/icons';

// Define message structure
interface Message {
    text: string;
    isUser: boolean;
}

// Reusable ChatMessage component
const ChatMessage: React.FC<{ message: string; isUser?: boolean }> = ({ message, isUser }) => (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white font-bold">F</div>}
        <div className={`max-w-xs md:max-w-md p-3 rounded-xl ${isUser ? 'bg-primary text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-700 text-text-light dark:text-text-dark rounded-bl-none'}`}>
            <p className="text-sm whitespace-pre-wrap">{message}</p>
        </div>
    </div>
);

// Bot typing indicator
const TypingIndicator: React.FC = () => (
    <div className="flex items-end gap-2 justify-start">
        <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white font-bold">F</div>
        <div className="max-w-xs md:max-w-md p-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-text-light dark:text-text-dark rounded-bl-none">
            <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            </div>
        </div>
    </div>
);


const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hello! I'm Finn, the FinXchange AI assistant. How can I help you today? You can ask me about transactions, fees, or how to use a feature.", isUser: false }
    ]);
    const [input, setInput] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const chatSession = useMemo<Chat | null>(() => {
        try {
            // This requires the API_KEY environment variable to be set.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            return ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: "You are a friendly and helpful AI assistant for FinXchange, a digital wallet app. Your name is Finn. You can answer questions about the app's features (like transfers, bill payments, savings, loans, virtual cards), help with transaction queries, and provide general financial advice. Do not ask for personal information like PINs or passwords. Keep your answers concise and easy to understand. Format your responses with markdown where appropriate (e.g., using bullet points or bold text).",
                }
            });
        } catch (e) {
            console.error(e);
            setError("Failed to initialize the AI chat service. Please check your API key configuration.");
            return null;
        }
    }, []);

    useEffect(() => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }, [messages, isBotTyping]);
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isBotTyping || !chatSession) return;

        const userMessage: Message = { text: input.trim(), isUser: true };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsBotTyping(true);
        setError(null);

        try {
            const responseStream = await chatSession.sendMessageStream({ message: userMessage.text });
            
            let botResponse = '';
            setMessages(prev => [...prev, { text: '', isUser: false }]); // Add placeholder for bot message

            for await (const chunk of responseStream) {
                botResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = botResponse;
                    return newMessages;
                });
            }

        } catch (err) {
            console.error(err);
            const errorMessage = "Sorry, I'm having trouble connecting right now. Please try again later.";
             setMessages(prev => [...prev, { text: errorMessage, isUser: false }]);
        } finally {
            setIsBotTyping(false);
        }
    };


    return (
        <div className="flex flex-col h-full">
            <div ref={chatContainerRef} className="p-4 flex-1 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
                    ))}
                    {isBotTyping && <TypingIndicator />}
                    {error && (
                        <div className="text-center text-sm text-red-500 p-2">
                           {error}
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 bg-card-light dark:bg-card-dark border-t border-slate-100 dark:border-slate-700/50">
                <form onSubmit={handleSendMessage} className="relative">
                    <input 
                        type="text"
                        placeholder={error ? "Chat is unavailable" : "Type your message..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isBotTyping || !!error}
                        className="w-full h-12 pl-4 pr-12 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-full focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                    />
                    <button 
                        type="submit" 
                        disabled={isBotTyping || !input.trim() || !!error}
                        aria-label="Send message"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-primary text-white rounded-full disabled:bg-slate-400"
                    >
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
