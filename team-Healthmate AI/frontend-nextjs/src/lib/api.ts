import { config } from './config';
import { HealthResponse, TriageResponse, AwarenessContent } from '@/types';

class APIClient {
  private baseUrl: string;
  private triageUrl: string;

  constructor() {
    this.baseUrl = config.apiBaseUrl;
    this.triageUrl = config.triageApiUrl;
    
    // Debug logging
    if (typeof window !== 'undefined') {
      console.log('API Client initialized with:', {
        baseUrl: this.baseUrl,
        hostname: window.location.hostname,
        port: window.location.port
      });
    }
  }

  private async fetchWithErrorHandling<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      console.log('Making API request to:', url);
      console.log('Request options:', options);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        mode: 'cors', // Explicitly set CORS mode
      });

      console.log('API response status:', response.status);
      console.log('API response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('API response data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      if (error instanceof TypeError && error.message.includes('CORS')) {
        console.error('CORS error detected. Check backend CORS configuration.');
      }
      throw error;
    }
  }

  // Health Analysis API
  async analyzeHealth(message: string, sessionId?: string, userId?: string): Promise<HealthResponse> {
    const body: any = { message };
    if (sessionId) body.session_id = sessionId;
    if (userId) body.user_id = userId;

    return this.fetchWithErrorHandling<HealthResponse>(`${this.baseUrl}/api/health/analyze`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async getSupportedLanguages(): Promise<{ success: boolean; languages: Record<string, string> }> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/health/languages`);
  }

  async generateHealthFacts(category?: string, count: number = 5): Promise<{ success: boolean; facts: AwarenessContent[] }> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('count', count.toString());
    
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/health/facts?${params}`);
  }

  async getAwarenessContent(category?: string, count: number = 3): Promise<{ success: boolean; content: AwarenessContent[] }> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('count', count.toString());
    
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/health/awareness/content?${params}`);
  }

  async getCategories(): Promise<{ success: boolean; categories: string[] }> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/health/awareness/categories`);
  }

  async translateAwarenessContent(content: AwarenessContent[], targetLanguage: string): Promise<{ success: boolean; translated_content: AwarenessContent[] }> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/translate/awareness`, {
      method: 'POST',
      body: JSON.stringify({
        content: content,
        target_language: targetLanguage
      }),
    });
  }

  async getRandomAwarenessContent(count: number = 9): Promise<{ success: boolean; content: AwarenessContent[] }> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/health/awareness/random?count=${count}`);
  }

  // Conversational Chat API
  async sendChatMessage(message: string, sessionId?: string, userId?: string, language?: string): Promise<{
    success: boolean;
    response?: string;
    follow_up_questions?: string[];
    session_id?: string;
    needs_more_info?: boolean;
    conversation_mode?: string;
    detected_language?: string;
    original_message?: string;
    error?: string;
  }> {
    const body: any = { message };
    if (sessionId) body.session_id = sessionId;
    if (userId) body.user_id = userId;
    if (language) body.language = language;

    return this.fetchWithErrorHandling(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Triage API
  async triageAnalysis(message: string, threadId?: string): Promise<TriageResponse> {
    const body: any = { message };
    if (threadId) body.thread_id = threadId;

    return this.fetchWithErrorHandling<TriageResponse>(`${this.triageUrl}/api/triage`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async createTriageThread(): Promise<{ thread_id: string }> {
    return this.fetchWithErrorHandling(`${this.triageUrl}/api/thread`, {
      method: 'POST',
    });
  }

  // Database/Session Management API
  async createSession(sessionType: string = 'chat', userId?: string): Promise<{ success: boolean; session_id?: string }> {
    const body: any = { session_type: sessionType };
    if (userId) body.user_id = userId;

    return this.fetchWithErrorHandling(`${this.baseUrl}/api/sessions`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async getConversationHistory(sessionId: string, limit: number = 10): Promise<{
    success: boolean;
    session_id: string;
    history: Array<{
      id: string;
      user_message: string;
      ai_response: string;
      message_type: string;
      metadata: any;
      created_at: string;
    }>;
    count: number;
  }> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());

    return this.fetchWithErrorHandling(`${this.baseUrl}/api/sessions/${sessionId}/history?${params}`);
  }

  async getFollowupQuestions(sessionId: string): Promise<{
    success: boolean;
    session_id: string;
    followup_questions: string[];
  }> {
    return this.fetchWithErrorHandling(`${this.baseUrl}/api/sessions/${sessionId}/followup`);
  }

  async getRecentSessions(userId?: string, limit: number = 5): Promise<{
    success: boolean;
    sessions: Array<{
      id: string;
      user_id?: string;
      session_type: string;
      is_active: boolean;
      created_at: string;
      updated_at: string;
      metadata: any;
    }>;
  }> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (userId) params.append('user_id', userId);

    return this.fetchWithErrorHandling(`${this.baseUrl}/api/sessions/recent?${params}`);
  }
}

export const apiClient = new APIClient();