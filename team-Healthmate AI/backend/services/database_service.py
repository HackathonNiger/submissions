"""
Database service for Healthmate AI using Supabase
Handles conversation history, sessions, and follow-up questions
"""
import os
import logging
import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

class DatabaseService:
    def __init__(self):
        """Initialize Supabase client"""
        self.url = os.getenv("SUPABASE_URL", "https://rsirslqkdawfaroeajzr.supabase.co")
        self.anon_key = os.getenv("SUPABASE_ANON_KEY")
        
        if not self.anon_key:
            logger.warning("Supabase credentials not found. Database features will be disabled.")
            self.supabase = None
            return
            
        try:
            self.supabase: Client = create_client(self.url, self.anon_key)
            logger.info("Supabase client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Supabase client: {e}")
            self.supabase = None
    
    def is_connected(self) -> bool:
        """Check if database is connected"""
        return self.supabase is not None
    
    # Session Management
    def create_session_sync(self, user_id: Optional[str] = None, session_type: str = "chat") -> Optional[str]:
        """
        Create a new conversation session (synchronous version)
        
        Args:
            user_id: Optional user identifier
            session_type: Type of session ('chat', 'symptom_checker', 'triage')
            
        Returns:
            session_id if successful, None otherwise
        """
        if not self.supabase:
            return None
            
        try:
            session_data = {
                "user_id": user_id,
                "session_type": session_type,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "is_active": True,
                "metadata": {}
            }
            
            result = self.supabase.table("sessions").insert(session_data).execute()
            
            if result.data:
                session_id = result.data[0]["id"]
                logger.info(f"Created new session: {session_id}")
                return session_id
            return None
            
        except Exception as e:
            logger.error(f"Error creating session: {e}")
            return None
    
    async def create_session(self, user_id: Optional[str] = None, session_type: str = "chat") -> Optional[str]:
        """
        Create a new conversation session
        
        Args:
            user_id: Optional user identifier
            session_type: Type of session ('chat', 'symptom_checker', 'triage')
            
        Returns:
            session_id if successful, None otherwise
        """
        if not self.supabase:
            return None
            
        try:
            session_data = {
                "user_id": user_id,
                "session_type": session_type,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "is_active": True,
                "metadata": {}
            }
            
            result = self.supabase.table("sessions").insert(session_data).execute()
            
            if result.data:
                session_id = result.data[0]["id"]
                logger.info(f"Created new session: {session_id}")
                return session_id
            return None
            
        except Exception as e:
            logger.error(f"Error creating session: {e}")
            return None
    
    async def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get session details by ID"""
        if not self.supabase:
            return None
            
        try:
            result = self.supabase.table("sessions").select("*").eq("id", session_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Error getting session {session_id}: {e}")
            return None
    
    async def update_session(self, session_id: str, updates: Dict[str, Any]) -> bool:
        """Update session metadata"""
        if not self.supabase:
            return False
            
        try:
            updates["updated_at"] = datetime.now(timezone.utc).isoformat()
            result = self.supabase.table("sessions").update(updates).eq("id", session_id).execute()
            return len(result.data) > 0
        except Exception as e:
            logger.error(f"Error updating session {session_id}: {e}")
            return False
    
    # Conversation Management
    def save_message_sync(self, session_id: str, message: str, response: str, 
                         message_type: str = "health", metadata: Optional[Dict] = None) -> Optional[str]:
        """
        Save a conversation message and response (synchronous version)
        
        Args:
            session_id: Session identifier
            message: User's message
            response: AI's response
            message_type: Type of message ('health', 'symptom', 'followup')
            metadata: Additional data (symptoms, language, etc.)
            
        Returns:
            message_id if successful, None otherwise
        """
        if not self.supabase:
            return None
            
        try:
            message_data = {
                "session_id": session_id,
                "user_message": message,
                "ai_response": response,
                "message_type": message_type,
                "metadata": metadata or {},
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            
            result = self.supabase.table("conversations").insert(message_data).execute()
            
            if result.data:
                message_id = result.data[0]["id"]
                logger.info(f"Saved message to session {session_id}")
                return message_id
            return None
            
        except Exception as e:
            logger.error(f"Error saving message: {e}")
            return None
    
    async def save_message(self, session_id: str, message: str, response: str, 
                          message_type: str = "health", metadata: Optional[Dict] = None) -> Optional[str]:
        """
        Save a conversation message and response
        
        Args:
            session_id: Session identifier
            message: User's message
            response: AI's response
            message_type: Type of message ('health', 'symptom', 'followup')
            metadata: Additional data (symptoms, language, etc.)
            
        Returns:
            message_id if successful, None otherwise
        """
        if not self.supabase:
            return None
            
        try:
            message_data = {
                "session_id": session_id,
                "user_message": message,
                "ai_response": response,
                "message_type": message_type,
                "metadata": metadata or {},
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            
            result = self.supabase.table("conversations").insert(message_data).execute()
            
            if result.data:
                message_id = result.data[0]["id"]
                logger.info(f"Saved message to session {session_id}")
                return message_id
            return None
            
        except Exception as e:
            logger.error(f"Error saving message: {e}")
            return None
    
    async def get_conversation_history(self, session_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get conversation history for a session
        
        Args:
            session_id: Session identifier
            limit: Maximum number of messages to retrieve
            
        Returns:
            List of conversation messages
        """
        if not self.supabase:
            return []
            
        try:
            result = (self.supabase.table("conversations")
                     .select("*")
                     .eq("session_id", session_id)
                     .order("created_at", desc=True)
                     .limit(limit)
                     .execute())
            
            # Reverse to get chronological order
            return list(reversed(result.data)) if result.data else []
            
        except Exception as e:
            logger.error(f"Error getting conversation history: {e}")
            return []
    
    def get_conversation_history_sync(self, session_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get conversation history for a session (synchronous version)
        
        Args:
            session_id: Session identifier
            limit: Maximum number of messages to retrieve
            
        Returns:
            List of conversation messages
        """
        if not self.supabase:
            return []
            
        try:
            result = (self.supabase.table("conversations")
                     .select("*")
                     .eq("session_id", session_id)
                     .order("created_at", desc=True)
                     .limit(limit)
                     .execute())
            
            # Reverse to get chronological order
            return list(reversed(result.data)) if result.data else []
            
        except Exception as e:
            logger.error(f"Error getting conversation history: {e}")
            return []
    
    async def get_recent_sessions(self, user_id: Optional[str] = None, limit: int = 5) -> List[Dict[str, Any]]:
        """Get recent sessions for a user or globally"""
        if not self.supabase:
            return []
            
        try:
            query = self.supabase.table("sessions").select("*")
            
            if user_id:
                query = query.eq("user_id", user_id)
                
            result = query.order("created_at", desc=True).limit(limit).execute()
            return result.data if result.data else []
            
        except Exception as e:
            logger.error(f"Error getting recent sessions: {e}")
            return []
    
    # Follow-up Questions
    async def generate_followup_questions(self, session_id: str) -> List[str]:
        """
        Generate intelligent follow-up questions based on conversation history
        
        Args:
            session_id: Session identifier
            
        Returns:
            List of suggested follow-up questions
        """
        if not self.supabase:
            return []
            
        try:
            # Get recent conversation history
            history = await self.get_conversation_history(session_id, limit=3)
            
            if not history:
                return []
            
            # Analyze the conversation to generate relevant follow-ups
            last_message = history[-1] if history else None
            
            if not last_message:
                return []
            
            # Basic follow-up questions based on message type and content
            followup_questions = []
            
            user_message = last_message.get("user_message", "").lower()
            message_type = last_message.get("message_type", "")
            
            # Symptom-based follow-ups
            if any(symptom in user_message for symptom in ["pain", "ache", "hurt", "sore"]):
                followup_questions.extend([
                    "How long have you been experiencing this pain?",
                    "On a scale of 1-10, how would you rate the pain?",
                    "What makes the pain better or worse?"
                ])
            
            if any(symptom in user_message for symptom in ["fever", "temperature", "hot", "chills"]):
                followup_questions.extend([
                    "Have you taken your temperature?",
                    "Are you experiencing any other symptoms along with the fever?",
                    "How long have you had the fever?"
                ])
            
            if any(symptom in user_message for symptom in ["cough", "throat", "chest"]):
                followup_questions.extend([
                    "Is it a dry cough or are you bringing up mucus?",
                    "Do you have any chest pain or difficulty breathing?",
                    "How long have you had the cough?"
                ])
            
            # General follow-ups
            if len(history) == 1:  # First interaction
                followup_questions.extend([
                    "Are there any other symptoms you're experiencing?",
                    "When did these symptoms first start?",
                    "Have you taken any medication for this?"
                ])
            
            # Remove duplicates and limit
            unique_questions = list(dict.fromkeys(followup_questions))
            return unique_questions[:3]  # Return max 3 questions
            
        except Exception as e:
            logger.error(f"Error generating follow-up questions: {e}")
            return []
    
    # Analytics and Insights
    async def get_session_summary(self, session_id: str) -> Dict[str, Any]:
        """Get a summary of the session including key symptoms and topics"""
        if not self.supabase:
            return {}
            
        try:
            session = await self.get_session(session_id)
            history = await self.get_conversation_history(session_id)
            
            if not session or not history:
                return {}
            
            # Extract key information
            symptoms_mentioned = set()
            topics_discussed = set()
            
            for message in history:
                user_msg = message.get("user_message", "").lower()
                metadata = message.get("metadata", {})
                
                # Extract symptoms from metadata if available
                if "symptoms" in metadata:
                    symptoms_mentioned.update(metadata["symptoms"])
                
                # Simple keyword extraction for common health topics
                health_keywords = [
                    "headache", "fever", "cough", "pain", "nausea", "fatigue",
                    "dizziness", "chest", "throat", "stomach", "back", "joint"
                ]
                
                for keyword in health_keywords:
                    if keyword in user_msg:
                        symptoms_mentioned.add(keyword)
            
            return {
                "session_id": session_id,
                "session_type": session.get("session_type"),
                "message_count": len(history),
                "symptoms_mentioned": list(symptoms_mentioned),
                "created_at": session.get("created_at"),
                "duration_minutes": self._calculate_session_duration(history),
                "last_activity": history[-1].get("created_at") if history else None
            }
            
        except Exception as e:
            logger.error(f"Error getting session summary: {e}")
            return {}
    
    def _calculate_session_duration(self, history: List[Dict]) -> int:
        """Calculate session duration in minutes"""
        if len(history) < 2:
            return 0
            
        try:
            start_time = datetime.fromisoformat(history[0]["created_at"].replace("Z", "+00:00"))
            end_time = datetime.fromisoformat(history[-1]["created_at"].replace("Z", "+00:00"))
            duration = end_time - start_time
            return int(duration.total_seconds() / 60)
        except:
            return 0

# Global database service instance
db_service = DatabaseService()