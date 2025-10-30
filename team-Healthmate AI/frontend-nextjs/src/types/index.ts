// Type definitions for HealthMate AI

export interface HealthAnalysis {
  symptoms: string[];
  body_parts: string[];
  time_expressions: string[];
  medications: string[];
}

export interface Citation {
  title: string;
  url: string;
}

export interface HealthResponse {
  success: boolean;
  detected_language?: string;
  language_code?: string;
  original_text?: string;
  english_translation?: string | null;
  health_analysis?: HealthAnalysis;
  response?: string;
  error?: string;
  citations?: Citation[];
}

export interface ChatMessage {
  id: string;
  content: string;
  text?: string;
  isUser: boolean;
  timestamp: Date | number;
  language?: string;
  citations?: Citation[];
}

export interface TriageResponse {
  success: boolean;
  analysis?: {
    urgency_level: 'low' | 'medium' | 'high' | 'critical';
    confidence_score: number;
    summary: string;
    next_steps: string[];
    emergency_warning?: string;
  };
  response?: string;
  error?: string;
}

export interface AwarenessContent {
  title: string;
  content: string;
  category: string;
  color: string;
  citations?: Citation[];
}

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  isActive?: boolean;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}