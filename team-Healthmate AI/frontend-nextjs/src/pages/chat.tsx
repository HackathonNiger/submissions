'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Phone, AlertTriangle } from '@/components/icons';
import { apiClient } from '@/lib/api';
import { ChatMessage, TriageResponse } from '@/types';
import { generateUniqueId } from '@/lib/utils';

interface ChatResponse {
  success: boolean;
  response: string;
  follow_up_questions?: string[];
  session_id?: string;
  needs_more_info?: boolean;
  conversation_mode?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [needsMoreInfo, setNeedsMoreInfo] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('auto');
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Language options
  const languageOptions = [
    { code: 'auto', name: 'Auto-detect', flag: '🌐' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
    { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
    { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with a welcome message
    const welcomeMessages = {
      'auto': "Hello! I'm your health assistant. Tell me about any symptoms or health concerns you have, and I'll ask some follow-up questions to better understand your situation.",
      'en': "Hello! I'm your health assistant. Tell me about any symptoms or health concerns you have, and I'll ask some follow-up questions to better understand your situation.",
      'yo': "Pẹlẹ o! Emi ni oluranlowo ilera yin. Sọ fun mi nipa awọn ami-aisan tabi awọn ifiyesi ilera ti o ni, emi yoo si beere awọn ibeere miiran lati loye ipo yin daradara.",
      'ha': "Sannu! Ni mai taimakon lafiya ne. Gaya mani game da alamun cututtuka da ke damun ku, zan yi tambayoyi don in fahimci halin ku sosai.",
      'ig': "Ndewo! Abụ m onye na-enyere gị aka n'ihe gbasara ahụike. Gwa m maka ihe ọ bụla na-eme gị ma ọ bụ nsogbu ahụike ị nwere, m ga-ajụkwa ajụjụ ndị ọzọ iji ghọta ọnọdụ gị nke ọma.",
      'zh': "您好！我是您的健康助手。请告诉我您的任何症状或健康问题，我会问一些后续问题以更好地了解您的情况。",
      'fr': "Bonjour ! Je suis votre assistant santé. Parlez-moi de vos symptômes ou préoccupations de santé, et je poserai des questions de suivi pour mieux comprendre votre situation.",
      'es': "¡Hola! Soy tu asistente de salud. Cuéntame sobre cualquier síntoma o preocupación de salud que tengas, y haré preguntas de seguimiento para entender mejor tu situación.",
      'ar': "مرحباً! أنا مساعدك الصحي. أخبرني عن أي أعراض أو مخاوف صحية لديك، وسأطرح أسئلة متابعة لفهم حالتك بشكل أفضل."
    };
    
    const welcomeMessage = welcomeMessages[selectedLanguage as keyof typeof welcomeMessages] || welcomeMessages['en'];
    addMessage(welcomeMessage, false);
  }, [selectedLanguage]); // Re-run when language changes

  const addMessage = (content: string, isUser: boolean, citations?: any[]) => {
    const newMessage: ChatMessage = {
      id: generateUniqueId(),
      content,
      isUser,
      timestamp: new Date(),
      citations
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage(userMessage, true);
    setIsLoading(true);

    try {
      console.log('Sending message to conversational chat:', userMessage);
      console.log('Selected language:', selectedLanguage);
      
      const chatResponse = await apiClient.sendChatMessage(
        userMessage, 
        sessionId, 
        undefined, // userId 
        selectedLanguage
      );
      
      console.log('Chat response received:', chatResponse);
      
      if (chatResponse.success && chatResponse.response) {
        // Add the AI response
        addMessage(chatResponse.response, false);
        
        // Update session info
        if (chatResponse.session_id && !sessionId) {
          setSessionId(chatResponse.session_id);
        }
        
        // Update detected language info
        if (chatResponse.detected_language) {
          setDetectedLanguage(chatResponse.detected_language);
        }
        
        // Update follow-up questions
        if (chatResponse.follow_up_questions && chatResponse.follow_up_questions.length > 0) {
          setFollowUpQuestions(chatResponse.follow_up_questions);
        } else {
          setFollowUpQuestions([]);
        }
        
        // Update needs more info flag
        setNeedsMoreInfo(chatResponse.needs_more_info || false);
        
      } else {
        throw new Error(chatResponse.error || 'Chat failed');
      }
    } catch (error) {
      console.error('Chat error:', error);
      addMessage('Sorry, I encountered an error. Please try again. Error: ' + error, false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getPromptSuggestions = () => {
    const suggestions = {
      'auto': [
        "I have a headache and fever",
        "Chest pain when breathing", 
        "Stomach ache after eating",
        "Persistent cough for days",
        "Difficulty sleeping lately",
        "Joint pain in morning"
      ],
      'en': [
        "I have a headache and fever",
        "Chest pain when breathing", 
        "Stomach ache after eating",
        "Persistent cough for days",
        "Difficulty sleeping lately",
        "Joint pain in morning"
      ],
      'yo': [
        "Mo ni ori dun ati iba",
        "Ese aya nigba ti mo n mi",
        "Inu dun leyin jije",
        "Mo ti n ko fun ojo pupọ",
        "O soro fun mi lati sun",
        "Egun mi n dun ni owurọ"
      ],
      'ha': [
        "Ina da ciwo kai da zazzabi",
        "Ciwon kirji lokacin numfashi",
        "Ciwon ciki bayan cin abinci",
        "Tari da ya daɗe",
        "Wahalar barci kwanan nan",
        "Ciwon gaba da safe"
      ],
      'ig': [
        "Enwere m isi ọwụwa na ahụ ọkụ",
        "Mgbu obi mgbe m na-eku ume",
        "Mgbu afọ mgbe m richara nri",
        "Ụkwara na-adịgide ruo ọtụtụ ụbọchị",
        "Ihi ụra siri ike n'oge na-adịbeghị anya",
        "Mgbu nkwonkwo n'ụtụtụ"
      ],
      'zh': [
        "我头痛发烧",
        "呼吸时胸痛",
        "饭后胃痛", 
        "持续咳嗽好几天了",
        "最近睡眠困难",
        "早上关节疼痛"
      ],
      'fr': [
        "J'ai mal à la tête et de la fièvre",
        "Douleur thoracique en respirant",
        "Mal d'estomac après avoir mangé",
        "Toux persistante depuis des jours",
        "Difficulté à dormir récemment",
        "Douleurs articulaires le matin"
      ],
      'es': [
        "Tengo dolor de cabeza y fiebre",
        "Dolor en el pecho al respirar",
        "Dolor de estómago después de comer",
        "Tos persistente por días",
        "Dificultad para dormir últimamente",
        "Dolor en las articulaciones por la mañana"
      ],
      'ar': [
        "أعاني من صداع وحمى",
        "ألم في الصدر عند التنفس",
        "ألم في المعدة بعد الأكل",
        "سعال مستمر لأيام",
        "صعوبة في النوم مؤخراً",
        "ألم في المفاصل في الصباح"
      ]
    };
    
    return suggestions[selectedLanguage as keyof typeof suggestions] || suggestions['en'];
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  const renderFollowUpQuestions = () => {
    if (followUpQuestions.length === 0) return null;

    return (
      <div className="p-4 bg-blue-50 border-t border-blue-200">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Quick responses:</h4>
        <div className="flex flex-wrap gap-2">
          {followUpQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => {
                setInputValue(question);
                inputRef.current?.focus();
              }}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        {/* Language Selector */}
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">Language:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {languageOptions.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            {detectedLanguage && detectedLanguage !== 'en' && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Detected: {languageOptions.find(l => l.code === detectedLanguage)?.name || detectedLanguage}
              </span>
            )}
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center space-x-2">
            {sessionId && (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                Session Active
              </span>
            )}
          </div>
        </div>

        {/* Welcome Section */}
        {messages.length === 1 && ( // Changed from === 0 to === 1 to account for welcome message
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              HealthMate AI Chat
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Describe your symptoms and get AI-powered health insights in your preferred language. 
              Remember, this is not a substitute for professional medical advice.
            </p>
            
            {/* Prompt Suggestions */}
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Try asking about:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getPromptSuggestions().map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="p-3 text-left bg-white rounded-lg shadow-sm border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="space-y-4 mb-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.isUser
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {!message.isUser && (
                    <Bot className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  )}
                  {message.isUser && (
                    <User className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={`${message.isUser ? 'text-white' : 'text-gray-900'} whitespace-pre-wrap`}>
                      {message.content}
                    </p>
                    {/* Show language indicator for translated messages */}
                    {detectedLanguage && detectedLanguage !== 'en' && !message.isUser && (
                      <div className="mt-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                        Translated from {languageOptions.find(l => l.code === detectedLanguage)?.name || detectedLanguage}
                      </div>
                    )}
                    <div className="mt-2 text-xs opacity-70">
                      {typeof message.timestamp === 'number' 
                        ? new Date(message.timestamp).toLocaleTimeString()
                        : new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-primary" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Follow-up Questions */}
        {renderFollowUpQuestions()}

        {/* Input Area */}
        <div className="sticky bottom-4 bg-white rounded-lg border border-gray-200 shadow-lg">
          <div className="flex items-center p-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms..."
              className="flex-1 p-3 border-none outline-none text-gray-900 placeholder-gray-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="p-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}