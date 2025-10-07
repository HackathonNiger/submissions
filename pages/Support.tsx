
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SpinnerIcon } from '../components/icons';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => (
    <details className="py-3 border-b border-slate-200 dark:border-slate-700/50">
        <summary className="font-semibold cursor-pointer text-text-light dark:text-text-dark">{question}</summary>
        <p className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">{answer}</p>
    </details>
);

const Support: React.FC = () => {
    const [query, setQuery] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGetAnswer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setAiResponse('');
        setError('');

        try {
            // This requires the API_KEY environment variable to be set.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const systemInstruction = `You are Finn, a friendly and helpful AI support assistant for FinXchange, a digital wallet app. Your goal is to provide clear, concise, and accurate answers to user questions. Use the following FAQ as your primary knowledge base. If the user's question is not covered, provide a general, helpful response and suggest they contact human support for complex issues. Do not ask for personal information.

**FAQ:**
Q: How do I reset my transaction PIN?
A: To reset your PIN, go to the Profile page, select 'Security', and then tap on 'Reset PIN'. An OTP will be sent to your registered phone number to verify your identity.

Q: Why is my transaction pending?
A: A pending transaction usually means it is still being processed. Most transactions complete within a few minutes. If it remains pending for over an hour, please contact customer support.

Q: How can I fund my wallet?
A: You can fund your wallet via a bank transfer to your unique wallet account number or by using a debit card on the 'Deposit' screen.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: query,
                config: {
                    systemInstruction,
                }
            });
            
            setAiResponse(response.text);

        } catch (err) {
            console.error(err);
            setError("Sorry, I'm having trouble connecting right now. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-6">Support</h1>
            
            <div className="bg-card-light dark:bg-card-dark p-5 rounded-xl shadow-sm mb-6">
                <h2 className="text-lg font-bold text-text-light dark:text-text-dark mb-3">Get Instant Help</h2>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4">
                    Ask our AI assistant, Finn, for quick answers to your questions.
                </p>
                <form onSubmit={handleGetAnswer}>
                    <div className="mb-4">
                        <textarea 
                            id="ai-query" 
                            rows={3} 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask about transactions, PIN reset, or anything else..."
                            className="w-full p-3 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" 
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center disabled:bg-slate-400"
                    >
                        {isLoading ? <SpinnerIcon /> : 'Get Answer'}
                    </button>
                </form>

                {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

                {aiResponse && (
                    <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white font-bold">F</div>
                            <p className="text-sm text-text-light dark:text-text-dark whitespace-pre-wrap">{aiResponse}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-card-light dark:bg-card-dark p-5 rounded-xl shadow-sm mb-6">
                <h2 className="text-lg font-bold text-text-light dark:text-text-dark mb-3">Frequently Asked Questions</h2>
                <FAQItem
                    question="How do I reset my transaction PIN?"
                    answer="To reset your PIN, go to the Profile page, select 'Security', and then tap on 'Reset PIN'. An OTP will be sent to your registered phone number to verify your identity."
                />
                <FAQItem
                    question="Why is my transaction pending?"
                    answer="A pending transaction usually means it is still being processed. Most transactions complete within a few minutes. If it remains pending for over an hour, please contact customer support."
                />
                <FAQItem
                    question="How can I fund my wallet?"
                    answer="You can fund your wallet via a bank transfer to your unique wallet account number or by using a debit card on the 'Deposit' screen."
                />
            </div>

            <div className="bg-card-light dark:bg-card-dark p-5 rounded-xl shadow-sm">
                <h2 className="text-lg font-bold text-text-light dark:text-text-dark mb-3">Still Need Help? File a Complaint</h2>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4">
                    If our AI assistant or FAQ couldn't help, please file a complaint and our team will get back to you shortly.
                </p>
                <form onSubmit={(e) => { e.preventDefault(); alert('Complaint submitted successfully!'); }}>
                    <div className="mb-4">
                        <label htmlFor="subject" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Subject</label>
                        <input type="text" id="subject" className="w-full h-11 px-3 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="message" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Message</label>
                        <textarea id="message" rows={4} className="w-full p-3 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" required></textarea>
                    </div>
                    <button type="submit" className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
                        Submit Complaint
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Support;
