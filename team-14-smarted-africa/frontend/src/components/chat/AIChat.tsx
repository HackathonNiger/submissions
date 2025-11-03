import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { translations } from '../../utils/translations';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose, currentLanguage }) => {
  const [messages, setMessages] = useState<{ id: number; text: string; sender: 'user' | 'ai' }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        text: translations[currentLanguage as keyof typeof translations]?.chatWelcome || "Hello! I'm SmartEd AI assistant. How can I help you today?",
        sender: 'ai'
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentLanguage, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        translations[currentLanguage as keyof typeof translations]?.chatResponse1 || "I understand your question. Let me help you with that!",
        translations[currentLanguage as keyof typeof translations]?.chatResponse2 || "That's a great question! Here's what I can tell you...",
        translations[currentLanguage as keyof typeof translations]?.chatResponse3 || "I'm here to help! Is there anything else you'd like to know?"
      ];
      
      const aiMessage = { 
        id: Date.now() + 1, 
        text: responses[Math.floor(Math.random() * responses.length)], 
        sender: 'ai' 
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 w-full max-w-md" ref={chatContainerRef}>
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Bot className="w-5 h-5 mr-2" />
            <span className="font-semibold">
              {translations[currentLanguage as keyof typeof translations]?.chatTitle || "SmartEd AI Assistant"}
            </span>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-3 rounded-lg max-w-xs ${
                message.sender === 'user' 
                  ? 'bg-green-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}>
                {message.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="text-left">
              <div className="inline-block p-3 bg-white text-gray-800 border border-gray-200 rounded-lg rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSend} className="p-4 border-t border-gray-200 flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={translations[currentLanguage as keyof typeof translations]?.chatPlaceholder || "Type your message..."}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-green-600 text-white px-4 py-2 rounded-r-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;