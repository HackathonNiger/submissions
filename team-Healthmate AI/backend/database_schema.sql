-- Healthmate AI Database Schema for Supabase
-- This schema supports conversation history, user sessions, and follow-up questions

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions table: Tracks conversation sessions
CREATE TABLE sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id VARCHAR(255), -- Optional user identifier (can be anonymous)
    session_type VARCHAR(50) NOT NULL DEFAULT 'chat', -- 'chat', 'symptom_checker', 'triage'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb -- Store session-specific data
);

-- Conversations table: Stores individual messages and responses
CREATE TABLE conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'health', -- 'health', 'symptom', 'followup', 'triage'
    metadata JSONB DEFAULT '{}'::jsonb, -- Store symptoms, language, confidence scores, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Follow-up questions table: Store generated follow-up questions for sessions
CREATE TABLE followup_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    is_asked BOOLEAN DEFAULT false, -- Track if question was actually asked
    priority INTEGER DEFAULT 1, -- Priority ranking for question relevance
    question_type VARCHAR(50) DEFAULT 'general', -- 'symptom', 'duration', 'severity', 'general'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table: Optional user information for personalized experience
CREATE TABLE user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    preferred_language VARCHAR(10) DEFAULT 'en', -- Language preference
    emergency_contact JSONB, -- Emergency contact information
    medical_conditions JSONB DEFAULT '[]'::jsonb, -- Known medical conditions
    allergies JSONB DEFAULT '[]'::jsonb, -- Known allergies
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health insights table: Store analysis results and recommendations
CREATE TABLE health_insights (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    symptoms JSONB DEFAULT '[]'::jsonb, -- Extracted symptoms
    recommendations JSONB DEFAULT '[]'::jsonb, -- AI recommendations
    urgency_level VARCHAR(20) DEFAULT 'low', -- 'low', 'medium', 'high', 'emergency'
    confidence_score FLOAT DEFAULT 0.0, -- AI confidence in analysis
    requires_followup BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_created_at ON sessions(created_at DESC);
CREATE INDEX idx_sessions_type ON sessions(session_type);

CREATE INDEX idx_conversations_session_id ON conversations(session_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX idx_conversations_message_type ON conversations(message_type);

CREATE INDEX idx_followup_session_id ON followup_questions(session_id);
CREATE INDEX idx_followup_is_asked ON followup_questions(is_asked);

CREATE INDEX idx_health_insights_session_id ON health_insights(session_id);
CREATE INDEX idx_health_insights_urgency ON health_insights(urgency_level);

-- RLS (Row Level Security) policies for data protection
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE followup_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_insights ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for basic chat functionality
-- In production, you may want to restrict this further

-- Sessions policies
CREATE POLICY "Allow anonymous session creation" ON sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow session read access" ON sessions
    FOR SELECT USING (true);

CREATE POLICY "Allow session updates" ON sessions
    FOR UPDATE USING (true);

-- Conversations policies  
CREATE POLICY "Allow conversation creation" ON conversations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow conversation read access" ON conversations
    FOR SELECT USING (true);

-- Follow-up questions policies
CREATE POLICY "Allow followup creation" ON followup_questions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow followup read access" ON followup_questions
    FOR SELECT USING (true);

CREATE POLICY "Allow followup updates" ON followup_questions
    FOR UPDATE USING (true);

-- Health insights policies
CREATE POLICY "Allow health insights creation" ON health_insights
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow health insights read access" ON health_insights
    FOR SELECT USING (true);

-- User profiles policies (more restrictive)
CREATE POLICY "Allow user profile creation" ON user_profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow user profile read access" ON user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Allow user profile updates" ON user_profiles
    FOR UPDATE USING (true);

-- Functions for automated tasks

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update timestamps
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up old sessions (run periodically)
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete sessions older than 30 days that are not active
    DELETE FROM sessions 
    WHERE created_at < NOW() - INTERVAL '30 days' 
    AND is_active = false;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing (optional)
-- INSERT INTO sessions (user_id, session_type) VALUES 
--     ('test_user_1', 'chat'),
--     ('test_user_2', 'symptom_checker');

-- Notes for setup:
-- 1. Run this schema in your Supabase SQL editor
-- 2. Set up environment variables in your backend:
--    - SUPABASE_URL=your_supabase_project_url
--    - SUPABASE_ANON_KEY=your_supabase_anon_key
-- 3. Consider setting up periodic cleanup job for old sessions
-- 4. Monitor RLS policies based on your security requirements