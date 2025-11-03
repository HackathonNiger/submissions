import os
import sys
import importlib.util
import logging  # Add this import
import re
from typing import List, Dict, Any
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI
import httpx

# Load health analysis service module
file_path = os.path.join(os.path.dirname(__file__), 'services', 'health_analysis_service.py')
spec = importlib.util.spec_from_file_location("health_analysis_service", file_path)
health_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(health_module)

# Get the functions and variables from the loaded module
process_user_message = health_module.process_user_message
SUPPORTED_LANGUAGES = health_module.SUPPORTED_LANGUAGES
generate_health_facts = health_module.generate_health_facts

# Load translation service module directly
translation_file_path = os.path.join(os.path.dirname(__file__), 'services', 'translation_service.py')
translation_spec = importlib.util.spec_from_file_location("translation_service", translation_file_path)
translation_module = importlib.util.module_from_spec(translation_spec)
translation_spec.loader.exec_module(translation_module)

# Get translation functions
translate_to_language = translation_module.translate_to_language
translate_to_english = translation_module.translate_to_english

# Load database service module
database_file_path = os.path.join(os.path.dirname(__file__), 'services', 'database_service.py')
database_spec = importlib.util.spec_from_file_location("database_service", database_file_path)
database_module = importlib.util.module_from_spec(database_spec)
database_spec.loader.exec_module(database_module)

# Get database service class and create instance
DatabaseService = database_module.DatabaseService
db_service = DatabaseService()

# Configure logging for the app
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("healthmate.log"),
        logging.StreamHandler()
    ]
)

# Create logger for this module
logger = logging.getLogger("healthmate")

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure CORS to allow requests from both local and deployed frontend
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",  # Next.js frontend
            "http://127.0.0.1:3000",  # Next.js frontend
            "http://localhost:5000",
            "http://127.0.0.1:5000",
            "http://localhost:5500",
            "http://127.0.0.1:5500",
            # Frontend URLs - both with and without trailing slash
            "https://cjid-hackathon-healthmate-ai.vercel.app",
            "https://cjid-hackathon-healthmate-ai.vercel.app/",
            "https://cjid-healthmate-ai-2-poct.vercel.app",
            "https://frontend-use.vercel.app",
            "http://127.0.0.1:19999",
            "http://10.204.0.208:19999",
            "http://127.0.0.1:10000",
            "http://10.204.201.13:10000",
            "http://10.204.138.100:10000",
            "https://cjid-healthmate-ai-2.onrender.com"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "supports_credentials": False
    }
})

@app.route('/api/health/analyze', methods=['POST'])
def analyze_health_query():
    """
    Endpoint to analyze health queries in multiple languages with database support
    
    Expects JSON with: {
        "message": "User's health concern in any supported language",
        "session_id": "optional session identifier",
        "user_id": "optional user identifier"
    }
    """
    if not request.is_json:
        return jsonify({
            'success': False,
            'error': 'Request must be JSON'
        }), 400
    
    data = request.json
    
    if not data or 'message' not in data:
        return jsonify({
            'success': False,
            'error': 'No message provided'
        }), 400
    
    user_message = data['message']
    session_id = data.get('session_id')
    user_id = data.get('user_id')
    
    try:
        # Process the health message
        result = process_user_message(user_message)
        
        # If database is available, save the conversation
        if db_service.is_connected():
            # Create session if not provided
            if not session_id:
                session_id = db_service.create_session_sync(
                    user_id=user_id,
                    session_type="symptom_checker"
                )
            
            # Save the conversation
            if session_id and result.get('success'):
                message_id = db_service.save_message_sync(
                    session_id=session_id,
                    message=user_message,
                    response=result.get('response', ''),
                    message_type="health",
                    metadata={
                        'language': result.get('language', 'en'),
                        'confidence': result.get('confidence'),
                        'translated': result.get('translated', False)
                    }
                )
                
                # Add session info to response
                result['session_id'] = session_id
                result['message_id'] = message_id
        
        return jsonify(result)
        
    except Exception as e:
        logging.error(f"Error in health analysis with database: {e}")
        # Fallback to basic analysis without database
        result = process_user_message(user_message)
        return jsonify(result)

@app.route('/api/health/languages', methods=['GET'])
def get_supported_languages():
    """Endpoint to retrieve all supported languages"""
    return jsonify({
        'success': True,
        'supported_languages': SUPPORTED_LANGUAGES
    })

@app.route('/api/health', methods=['GET', 'OPTIONS'])
def health_check():
    """Simple health check endpoint to verify API is running"""
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response
    
    return jsonify({
        'status': 'healthy',
        'service': 'HealthMate AI API',
        'cors_origins': [
            'https://cjid-hackathon-healthmate-ai.vercel.app',
            'http://localhost:3000'
        ]
    })

@app.route('/api/health/facts', methods=['GET'])
def get_health_facts():
    """Endpoint to generate random health facts using OpenAI"""
    # Get query parameters
    topic = request.args.get('topic', 'general health')
    count = min(int(request.args.get('count', 3)), 5)  # Reduce default to 3, max to 5
    
    try:
        # Get the health facts with a timeout
        facts = generate_health_facts(topic, count)
        
        return jsonify({
            'success': True,
            'topic': topic,
            'facts': facts
        })
        
    except Exception as e:
        # Return some default facts if API fails
        default_facts = [
            {
                "title": "Stay Hydrated",
                "description": "Drinking adequate water is essential for overall health, helping maintain body temperature and remove waste."
            },
            {
                "title": "Sleep Matters",
                "description": "Adults need 7-9 hours of quality sleep per night for optimal cognitive function and physical health."
            },
            {
                "title": "Regular Exercise",
                "description": "Just 30 minutes of moderate activity daily can significantly improve heart health and mental wellbeing."
            }
        ]
        
        return jsonify({
            'success': True,
            'topic': topic,
            'facts': default_facts,
            'note': 'Using default facts due to API timeout'
        })

# Load awareness service module directly from file
awareness_file_path = os.path.join(os.path.dirname(__file__), 'services', 'awareness_service.py')
awareness_spec = importlib.util.spec_from_file_location("awareness_service", awareness_file_path)
awareness_module = importlib.util.module_from_spec(awareness_spec)
awareness_spec.loader.exec_module(awareness_module)

# Get functions from the awareness module
generate_awareness_content = awareness_module.generate_awareness_content
get_all_categories = awareness_module.get_all_categories
get_random_awareness_content = awareness_module.get_random_awareness_content

@app.route('/api/health/awareness/categories', methods=['GET'])
def get_awareness_categories():
    """Endpoint to get all health awareness categories"""
    try:
        categories = get_all_categories()
        return jsonify({
            'success': True,
            'categories': categories
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health/awareness/content', methods=['GET'])
def get_category_content():
    """Endpoint to get awareness content for a specific category"""
    try:
        category = request.args.get('category', 'Nutrition')
        count = min(int(request.args.get('count', 3)), 3)  # Limit to 3 max to prevent timeouts
        
        # Validate category
        if category not in get_all_categories():
            category = 'Nutrition'  # Default fallback
        
        logger.info(f"Generating awareness content for category: {category}, count: {count}")
        
        content = generate_awareness_content(category, count)
        
        if not content:
            logger.warning(f"No content generated for {category}, using fallback")
            # This should not happen due to fallback in the service, but extra safety
            content = [{
                "title": f"{category} Health Tips",
                "content": f"Important information about {category.lower()} for better health.",
                "category": category,
                "color": "#FF9800"
            }]
        
        return jsonify({
            'success': True,
            'category': category,
            'content': content
        })
    except Exception as e:
        logger.error(f"Error in get_category_content: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Unable to generate content at this time. Please try again later.',
            'content': []
        }), 500

@app.route('/api/health/awareness/random', methods=['GET'])
def get_random_content():
    """Endpoint to get random awareness content across categories"""
    try:
        count = min(int(request.args.get('count', 5)), 6)  # Limit to 6 max to prevent timeouts
        
        logger.info(f"Generating random awareness content, count: {count}")
        
        content = get_random_awareness_content(count)
        
        if not content:
            logger.warning("No random content generated, using emergency fallback")
            # Emergency fallback content
            content = [{
                "title": "Health Tips",
                "content": "Maintaining a healthy lifestyle includes proper nutrition, regular exercise, adequate sleep, and stress management.",
                "category": "General Health",
                "color": "#4CAF50"
            }]
        
        return jsonify({
            'success': True,
            'content': content
        })
    except Exception as e:
        logger.error(f"Error in get_random_content: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Unable to generate content at this time. Please try again later.',
            'content': []
        }), 500

# Add this new endpoint for translating awareness content
@app.route('/api/translate/awareness', methods=['POST'])
def translate_awareness_content():
    """Endpoint to translate awareness content to a specific language"""
    try:
        if not request.is_json:
            return jsonify({
                'success': False,
                'error': 'Request must be JSON'
            }), 400
        
        data = request.json
        
        if not data or 'content' not in data or 'target_language' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing required fields (content, target_language)'
            }), 400
        
        content = data['content']
        target_language = data['target_language']
        
        # If already English and requesting English, just return the content
        if target_language == 'en':
            return jsonify({
                'success': True,
                'translated_content': content
            })
        
        # Initialize translated content with same structure as original
        translated_content = []
        
        # Translate each content item
        for item in content:
            try:
                # Translate title, content AND category
                translated_title = translate_to_language(item['title'], target_language)
                translated_body = translate_to_language(item['content'], target_language)
                translated_category = translate_to_language(item['category'], target_language)
                
                # Create translated version of the item
                translated_item = item.copy()
                translated_item['title'] = translated_title
                translated_item['content'] = translated_body
                translated_item['category'] = translated_category  # Add this line
                translated_item['original_language'] = 'en'
                translated_item['translated'] = True
                
                translated_content.append(translated_item)
            except Exception as e:
                # If translation fails for an item, use the original
                item['translated'] = False
                translated_content.append(item)
                logging.error(f"Error translating content: {str(e)}")
        
        return jsonify({
            'success': True,
            'translated_content': translated_content
        })
        
    except Exception as e:
        logging.error(f"Error in translation endpoint: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/', methods=['GET'])
def root():
    """Root endpoint for basic connectivity test"""
    return jsonify({
        'message': 'HealthMate AI Backend is running!',
        'version': '1.0.0',
        'status': 'healthy'
    })

# Database endpoints
@app.route('/api/sessions', methods=['POST'])
def create_new_session():
    """Create a new conversation session"""
    if not db_service.is_connected():
        return jsonify({
            'success': False,
            'error': 'Database not available'
        }), 503
    
    data = request.json or {}
    user_id = data.get('user_id')
    session_type = data.get('session_type', 'chat')
    
    session_id = db_service.create_session_sync(user_id=user_id, session_type=session_type)
    
    if session_id:
        return jsonify({
            'success': True,
            'session_id': session_id
        })
    else:
        return jsonify({
            'success': False,
            'error': 'Failed to create session'
        }), 500

@app.route('/api/sessions/<session_id>/history', methods=['GET'])
def get_conversation_history(session_id):
    """Get conversation history for a session"""
    if not db_service.is_connected():
        return jsonify({
            'success': False,
            'error': 'Database not available'
        }), 503
    
    try:
        # Get limit from query parameters
        limit = min(int(request.args.get('limit', 10)), 50)  # Max 50 messages
        
        # Use synchronous version
        history = db_service.get_conversation_history_sync(session_id, limit)
        
        return jsonify({
            'success': True,
            'session_id': session_id,
            'history': history,
            'count': len(history)
        })
        
    except Exception as e:
        logging.error(f"Error getting conversation history: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve conversation history'
        }), 500

@app.route('/api/sessions/<session_id>/followup', methods=['GET'])
def get_followup_questions(session_id):
    """Generate follow-up questions for a session"""
    if not db_service.is_connected():
        return jsonify({
            'success': False,
            'error': 'Database not available'
        }), 503
    
    try:
        # Get recent conversation history (sync version)
        history = db_service.get_conversation_history_sync(session_id, 3)
        
        if not history:
            return jsonify({
                'success': True,
                'session_id': session_id,
                'followup_questions': []
            })
        
        # Generate basic follow-up questions based on recent messages
        followup_questions = []
        last_message = history[-1] if history else None
        
        if last_message:
            user_message = last_message.get("user_message", "").lower()
            
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
            
            # General follow-ups for new conversations
            if len(history) == 1:
                followup_questions.extend([
                    "Are there any other symptoms you're experiencing?",
                    "When did these symptoms first start?",
                    "Have you taken any medication for this?"
                ])
        
        # Remove duplicates and limit to 3
        unique_questions = list(dict.fromkeys(followup_questions))[:3]
        
        return jsonify({
            'success': True,
            'session_id': session_id,
            'followup_questions': unique_questions
        })
        
    except Exception as e:
        logging.error(f"Error generating follow-up questions: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to generate follow-up questions'
        }), 500


@app.route('/api/chat', methods=['POST'])
def conversational_chat():
    """
    Conversational chat endpoint with multilingual support
    Detects user language, translates to English for processing, then translates back
    """
    if not request.json or 'message' not in request.json:
        return jsonify({
            'success': False,
            'error': 'No message provided'
        }), 400
    
    data = request.json
    user_message = data['message']
    session_id = data.get('session_id')
    user_id = data.get('user_id')
    preferred_language = data.get('language', 'auto')  # Language preference
    
    try:
        # Language detection and translation
        original_message = user_message
        detected_language = 'en'
        
        # If not English or auto-detect enabled, handle translation
        if preferred_language == 'auto':
            try:
                from services import translation_service
                if hasattr(translation_service, 'detect_language'):
                    detected_language = translation_service.detect_language(user_message)
                    if detected_language != 'en':
                        user_message = translation_service.translate_to_english(user_message, detected_language)
                        logging.info(f"Translated from {detected_language}: {original_message} -> {user_message}")
            except Exception as e:
                logging.warning(f"Translation detection failed, using original message: {e}")
        elif preferred_language != 'en':
            try:
                from services import translation_service
                detected_language = preferred_language
                if hasattr(translation_service, 'translate_to_english'):
                    user_message = translation_service.translate_to_english(user_message, preferred_language)
                    logging.info(f"Translated from {preferred_language}: {original_message} -> {user_message}")
            except Exception as e:
                logging.warning(f"Translation failed, using original message: {e}")
        
        # Create or get session
        if not session_id and db_service.is_connected():
            session_id = db_service.create_session_sync(
                user_id=user_id,
                session_type="chat"
            )
        
        # Get conversation history if available
        conversation_history = []
        if session_id and db_service.is_connected():
            history = db_service.get_conversation_history_sync(session_id, 5)
            conversation_history = history if history else []
        
        # Generate conversational response (in English)
        chat_response = generate_conversational_response(user_message, conversation_history)
        
        # Translate response back to user's language if needed
        if chat_response.get('success') and detected_language != 'en':
            try:
                from services import translation_service
                if hasattr(translation_service, 'translate_to_language'):
                    # Translate the main response
                    original_response = chat_response['response']
                    chat_response['response'] = translation_service.translate_to_language(
                        original_response, detected_language
                    )
                    
                    # Translate follow-up questions
                    if chat_response.get('follow_up_questions'):
                        translated_questions = []
                        for question in chat_response['follow_up_questions']:
                            translated_q = translation_service.translate_to_language(question, detected_language)
                            translated_questions.append(translated_q)
                        chat_response['follow_up_questions'] = translated_questions
                    
                    logging.info(f"Translated response back to {detected_language}")
            except Exception as e:
                logging.warning(f"Response translation failed, using English: {e}")
        
        # Save conversation to database (save both original and translated)
        if session_id and db_service.is_connected() and chat_response.get('success'):
            db_service.save_message_sync(
                session_id=session_id,
                message=original_message,  # Save original message
                response=chat_response.get('response', ''),
                message_type="chat",
                metadata={
                    'follow_up_questions': chat_response.get('follow_up_questions', []),
                    'needs_more_info': chat_response.get('needs_more_info', False),
                    'detected_language': detected_language,
                    'translated_message': user_message if detected_language != 'en' else None
                }
            )
        
        # Add language and session info to response
        chat_response['detected_language'] = detected_language
        chat_response['original_message'] = original_message
        if session_id:
            chat_response['session_id'] = session_id
        
        return jsonify(chat_response)
    
    except Exception as e:
        logging.error(f"Error in conversational chat: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to process chat message'
        }), 500


def generate_conversational_response(message: str, conversation_history: List[Dict]):
    """
    Generate a conversational response like a health practitioner would
    Shorter responses with follow-up questions to gather more information
    """
    try:
        # Extract symptoms from current message using Azure health analysis
        from services.health_analysis_service import analyze_with_azure_health
        try:
            health_info = analyze_with_azure_health(message)
        except Exception as e:
            logging.warning(f"Health analysis failed, using empty info: {e}")
            health_info = {
                'symptoms': [],
                'body_parts': [],
                'time_expressions': [],
                'medications': []
            }
        
        # Build context from conversation history
        context = ""
        if conversation_history:
            recent_messages = conversation_history[-3:]  # Last 3 exchanges
            for msg in recent_messages:
                context += f"Patient: {msg.get('user_message', '')}\n"
                context += f"Assistant: {msg.get('ai_response', '')}\n"
        
        # Create conversational prompt
        prompt = f"""
        You are a conversational health assistant having a chat with someone about their health concerns. 
        Your role is similar to a triage nurse or health practitioner doing an initial assessment.
        
        Current message: "{message}"
        
        Previous conversation context:
        {context}
        
        Extracted health information from current message:
        - Symptoms: {health_info.get('symptoms', health_info.get('entities', {}).get('symptoms', []))}
        - Body parts: {health_info.get('body_parts', health_info.get('entities', {}).get('body_parts', []))}
        - Duration: {health_info.get('time_expressions', health_info.get('entities', {}).get('time_expressions', []))}
        - Medications: {health_info.get('medications', health_info.get('entities', {}).get('medications', []))}
        
        Provide a conversational response that:
        
        1. Acknowledges what they've shared briefly and empathetically
        2. If this is initial information, provide a SHORT (2-3 sentences) general response about what their symptoms might indicate
        3. Ask 1-2 specific follow-up questions that a health practitioner would ask to gather more information:
           - Duration: "How long have you been experiencing this?"
           - Severity: "On a scale of 1-10, how severe is the [symptom]?"
           - Triggers: "What seems to make it better or worse?"
           - Associated symptoms: "Are you experiencing any other symptoms?"
           - Medical history: "Have you had anything like this before?"
           - Medications: "Have you taken anything for this?"
           - Daily activities: "Is this affecting your daily activities?"
        
        4. Keep the tone conversational and caring, like talking to someone in person
        5. Don't provide detailed medical advice in chat mode - save that for when you have enough information
        6. If they've provided comprehensive information, then give more detailed guidance
        
        Response format should be natural conversation, not numbered points.
        End with your follow-up questions naturally integrated into the conversation.
        """
        
        # Generate response using OpenAI
        http_client = httpx.Client(proxies=None)
        client = OpenAI(
            api_key=os.getenv("OPENAI_API_KEY"),
            http_client=http_client
        )
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a conversational health assistant. Keep responses concise and ask relevant follow-up questions to gather information like a health practitioner would."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,  # Keep responses shorter for chat
            temperature=0.7
        )
        
        assistant_response = response.choices[0].message.content.strip()
        
        # Extract follow-up questions from the response
        follow_up_questions = extract_follow_up_questions(assistant_response, health_info)
        
        return {
            'success': True,
            'response': assistant_response,
            'follow_up_questions': follow_up_questions,
            'needs_more_info': len(conversation_history) < 3,  # Need more info if conversation is short
            'conversation_mode': 'chat'
        }
        
    except Exception as e:
        logging.error(f"Error generating conversational response: {e}")
        return {
            'success': False,
            'error': str(e)
        }


def extract_follow_up_questions(response_text: str, health_info: Dict) -> List[str]:
    """Extract follow-up questions from response or generate based on symptoms"""
    
    # Try to extract questions from the response text
    questions = re.findall(r'[.!?]\s*([^.!?]*\?)', response_text)
    
    if questions:
        return [q.strip() + '?' for q in questions if q.strip()][:3]
    
    # Generate questions based on symptoms if none found in response
    follow_ups = []
    symptoms = health_info.get('symptoms', health_info.get('entities', {}).get('symptoms', []))
    
    if symptoms:
        symptom_text = ' '.join(str(s) for s in symptoms).lower()
        if any(word in symptom_text for word in ['pain', 'ache', 'hurt']):
            follow_ups.append("How would you rate the pain from 1-10?")
            follow_ups.append("What makes the pain better or worse?")
        
        if any(word in symptom_text for word in ['fever', 'temperature']):
            follow_ups.append("Have you checked your temperature?")
            follow_ups.append("Any chills or sweating?")
        
        if any(word in symptom_text for word in ['cough', 'throat']):
            follow_ups.append("Is it a dry cough or producing mucus?")
        
        time_expressions = health_info.get('time_expressions', health_info.get('entities', {}).get('time_expressions', []))
        if not time_expressions:
            follow_ups.append("How long have you been experiencing this?")
    
    return follow_ups[:2]  # Limit to 2 questions


@app.route('/api/sessions/recent', methods=['GET'])
def get_recent_sessions():
    """Get recent sessions"""
    if not db_service.is_connected():
        return jsonify({
            'success': False,
            'error': 'Database not available'
        }), 503
    
    try:
        limit = min(int(request.args.get('limit', 5)), 20)  # Max 20 sessions
        user_id = request.args.get('user_id')
        
        query = db_service.supabase.table("sessions").select("*")
        
        if user_id:
            query = query.eq("user_id", user_id)
            
        result = query.order("created_at", desc=True).limit(limit).execute()
        
        return jsonify({
            'success': True,
            'sessions': result.data if result.data else []
        })
        
    except Exception as e:
        logging.error(f"Error getting recent sessions: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve recent sessions'
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    # Use debug=True during development, set to False for production
    app.run(host='0.0.0.0', port=port, debug=True)
