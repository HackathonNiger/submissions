'use client';

import React, { useState, useEffect } from 'react';
import { History, Calendar, MessageCircle, Trash2, Search } from '@/components/icons';
import { ChatMessage } from '@/types';
import { generateUniqueId } from '@/lib/utils';

interface ChatSession {
  id: string;
  title: string;
  date: string;
  messages: ChatMessage[];
  summary: string;
}

export default function ChatHistoryPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load chat history from localStorage
    const loadChatHistory = () => {
      try {
        const savedSessions = localStorage.getItem('healthmate_chat_sessions');
        if (savedSessions) {
          const parsedSessions = JSON.parse(savedSessions);
          setSessions(parsedSessions);
        } else {
          // Generate sample data for demonstration
          generateSampleSessions();
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        generateSampleSessions();
      }
    };

    const generateSampleSessions = () => {
      const sampleSessions: ChatSession[] = [
        {
          id: generateUniqueId(),
          title: 'Headache and Fever',
          date: '2024-01-15',
          summary: 'Discussed symptoms of headache, fever, and body aches. Recommended rest and hydration.',
          messages: [
            { 
              id: '1', 
              content: 'I have a headache and fever', 
              text: 'I have a headache and fever', 
              isUser: true, 
              timestamp: Date.now() 
            },
            { 
              id: '2', 
              content: 'I understand you are experiencing a headache and fever. These are common symptoms that can be caused by various conditions...', 
              text: 'I understand you are experiencing a headache and fever. These are common symptoms that can be caused by various conditions...', 
              isUser: false, 
              timestamp: Date.now() 
            }
          ]
        },
        {
          id: generateUniqueId(),
          title: 'Stomach Pain',
          date: '2024-01-12',
          summary: 'Patient reported abdominal pain after meals. Suggested dietary changes.',
          messages: [
            { 
              id: '1', 
              content: 'I have stomach pain after eating', 
              text: 'I have stomach pain after eating', 
              isUser: true, 
              timestamp: Date.now() 
            },
            { 
              id: '2', 
              content: 'Stomach pain after eating can be related to several factors...', 
              text: 'Stomach pain after eating can be related to several factors...', 
              isUser: false, 
              timestamp: Date.now() 
            }
          ]
        }
      ];
      setSessions(sampleSessions);
      localStorage.setItem('healthmate_chat_sessions', JSON.stringify(sampleSessions));
    };

    loadChatHistory();
  }, []);

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    setSessions(updatedSessions);
    localStorage.setItem('healthmate_chat_sessions', JSON.stringify(updatedSessions));
    
    if (selectedSession && selectedSession.id === sessionId) {
      setSelectedSession(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <History className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chat History</h1>
              <p className="text-gray-600">Review your previous health consultations</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your chat history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Conversations ({filteredSessions.length})</span>
                </h2>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredSessions.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No conversations found</p>
                  </div>
                ) : (
                  filteredSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                        selectedSession?.id === session.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 text-sm truncate flex-1">
                          {session.title}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSession(session.id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors duration-200 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(session.date)}</span>
                      </div>
                      
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {session.summary}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
              {selectedSession ? (
                <>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedSession.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(selectedSession.date)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {selectedSession.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.isUser
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.text || message.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center text-gray-500">
                    <History className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a Conversation
                    </h3>
                    <p className="text-gray-600">
                      Choose a conversation from the left to view its details
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}