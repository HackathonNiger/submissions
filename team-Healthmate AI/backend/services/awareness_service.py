import os
import json
import time
import logging
from datetime import datetime, timedelta
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("healthmate.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("healthmate_awareness")

# OpenAI configuration
openai.api_key = os.getenv("OPENAI_API_KEY")

# Simple in-memory cache
_content_cache = {}
_cache_expiry = {}
CACHE_DURATION = 24 * 60 * 60  # 24 hours in seconds

# Health categories
HEALTH_CATEGORIES = [
    "Nutrition", "Exercise", "Mental Health", "Sleep", "Preventive Care",
    "Common Illnesses", "First Aid", "Chronic Conditions", "Women's Health",
    "Men's Health", "Children's Health", "Elderly Care"
]

# Fallback content for when API fails
FALLBACK_CONTENT = {
    "Nutrition": [
        {
            "title": "Importance of Hydration",
            "content": "Drinking adequate water is essential for overall health. Aim for 8 glasses daily, and more during hot weather or physical activity. Water helps transport nutrients, regulate body temperature, and remove waste. Dehydration can cause headaches, fatigue, and reduced cognitive function.",
            "category": "Nutrition",
            "color": "#4CAF50",
            "citations": [
                {
                    "title": "WHO: Water, Sanitation and Health",
                    "url": "https://www.who.int/health-topics/water-sanitation-and-hygiene"
                },
                {
                    "title": "CDC: Water & Nutrition",
                    "url": "https://www.cdc.gov/healthywater/drinking/nutrition/index.html"
                }
            ]
        },
        {
            "title": "The Importance of Balanced Diet",
            "content": "A balanced diet provides essential nutrients needed for good health. Include fruits, vegetables, whole grains, lean proteins, and healthy fats in your daily meals. Aim for variety and moderation to ensure you get all necessary vitamins and minerals. Proper nutrition supports immune function, energy levels, and overall wellbeing.",
            "category": "Nutrition",
            "color": "#4CAF50"
        },
        {
            "title": "Hydration and Health",
            "content": "Drinking enough water is crucial for bodily functions. Aim for 8 glasses daily, more during hot weather or physical activity. Water helps regulate body temperature, lubricate joints, and transport nutrients. Signs of dehydration include headaches, fatigue, and dark urine. Make water your primary beverage for optimal health.",
            "category": "Nutrition",
            "color": "#4CAF50"
        }
    ],
    "Exercise": [
        {
            "title": "Benefits of Regular Physical Activity",
            "content": "Regular exercise improves cardiovascular health, strengthens muscles, and enhances mood. Aim for at least 150 minutes of moderate activity weekly. Even short walks provide benefits. Find activities you enjoy to make exercise sustainable. Remember to include both cardio and strength training for balanced fitness.",
            "category": "Exercise",
            "color": "#2196F3"
        }
    ],
    "Mental Health": [
        {
            "title": "Managing Stress Effectively",
            "content": "Chronic stress impacts both mental and physical health. Practice stress management through deep breathing, meditation, or gentle movement. Regular exercise and adequate sleep also help reduce stress levels. Don't hesitate to seek professional support when needed. Remember that managing stress is an essential part of overall health.",
            "category": "Mental Health",
            "color": "#9C27B0"
        }
    ],
    "Sleep": [
        {
            "title": "Importance of Quality Sleep",
            "content": "Quality sleep is essential for cognitive function, immune health, and emotional wellbeing. Adults should aim for 7-9 hours nightly. Establish a regular sleep schedule and create a restful environment. Limit screen time before bed and avoid caffeine in the afternoon. Consistent sleep habits contribute significantly to overall health.",
            "category": "Sleep",
            "color": "#673AB7"
        }
    ],
    "Preventive Care": [
        {
            "title": "Regular Health Screenings",
            "content": "Preventive screenings help detect health issues early when they're most treatable. Schedule regular check-ups with your healthcare provider. Common screenings include blood pressure, cholesterol, and cancer screenings appropriate for your age and risk factors. Staying current with vaccinations is also an important aspect of preventive healthcare.",
            "category": "Preventive Care",
            "color": "#00BCD4"
        }
    ]
}

# Initialize fallback content for remaining categories
for category in HEALTH_CATEGORIES:
    if category not in FALLBACK_CONTENT:
        FALLBACK_CONTENT[category] = [{
            "title": f"Important {category} Tips",
            "content": f"Taking care of your {category.lower()} is essential for overall wellbeing. Regular attention to this aspect of health can prevent problems and improve quality of life. Consult healthcare professionals for personalized advice regarding {category.lower()}.",
            "category": category,
            "color": "#FF9800"
        }]

# Log initialization status after all variables are defined
logger.info("Awareness service initialized successfully")
logger.info(f"OpenAI API key present: {'Yes' if os.getenv('OPENAI_API_KEY') else 'No'}")
logger.info(f"Available categories: {len(HEALTH_CATEGORIES)}")
logger.info(f"Fallback content categories: {len(FALLBACK_CONTENT)}")

def get_color_for_category(category):
    """Return a consistent color for each category"""
    colors = {
        "Nutrition": "#4CAF50",      # Green
        "Exercise": "#2196F3",       # Blue
        "Mental Health": "#9C27B0",  # Purple
        "Sleep": "#673AB7",          # Deep Purple
        "Preventive Care": "#00BCD4", # Cyan
        "Common Illnesses": "#FF5722", # Deep Orange
        "First Aid": "#F44336",      # Red
        "Chronic Conditions": "#795548", # Brown
        "Women's Health": "#E91E63", # Pink
        "Men's Health": "#3F51B5",   # Indigo
        "Children's Health": "#FFEB3B", # Yellow
        "Elderly Care": "#607D8B"    # Blue Grey
    }
    return colors.get(category, "#FF9800")  # Default to amber if category not found

def generate_awareness_content(category, count=3):
    """Generate health awareness content using OpenAI with robust fallbacks"""
    cache_key = f"{category}_{count}"
    
    # Check cache first
    if cache_key in _content_cache and datetime.now() < _cache_expiry.get(cache_key, datetime.now()):
        logger.info(f"Returning cached content for {category}")
        return _content_cache[cache_key]
    
    # Return fallback content immediately if no OpenAI API key
    if not os.getenv("OPENAI_API_KEY") or not os.getenv("OPENAI_API_KEY").strip():
        logger.warning(f"No OpenAI API key found, using fallback content for {category}")
        return get_fallback_content(category, count)
    
    try:
        # Initialize OpenAI client with increased timeout
        client = openai.OpenAI(
            api_key=os.getenv("OPENAI_API_KEY"),
            timeout=30  # Increased timeout to 30 seconds
        )
        
        # Simplified prompt for faster generation
        prompt = f"""
        Create {count} short health tips about {category}. Each tip should have:
        - A clear title (3-6 words)
        - Brief, practical advice (50-80 words)
        - 1-2 trusted source citations
        
        Return as JSON array: [{{"title": "...", "content": "...", "citations": [{{"title": "...", "url": "..."}}]}}]
        """
        
        # Call the OpenAI API with timeout handling
        start_time = time.time()
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a health educator. Always respond with valid JSON format. Keep content concise and practical."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=800,  # Reduced tokens for faster response
            temperature=0.7
        )
        elapsed_time = time.time() - start_time
        logger.info(f"OpenAI API call for {category} took {elapsed_time:.2f} seconds")
        
        # Parse the response with better error handling
        try:
            response_content = json.loads(response.choices[0].message.content)
        except json.JSONDecodeError as je:
            logger.error(f"JSON decode error for {category}: {str(je)}")
            return get_fallback_content(category, count)
        
        # Extract articles from response
        articles = extract_articles_from_response(response_content)
        
        if not articles:
            logger.warning(f"No articles found in OpenAI response for {category}")
            return get_fallback_content(category, count)
        
        # Format the articles with category and color
        formatted_articles = []
        for article in articles[:count]:  # Ensure we don't exceed requested count
            formatted_articles.append({
                "title": article.get("title", f"{category} Tips"),
                "content": article.get("content", f"Important information about {category.lower()}."),
                "category": category,
                "color": get_color_for_category(category),
                "citations": article.get("citations", [])
            })
        
        # Cache the results if we got valid content
        if formatted_articles:
            _content_cache[cache_key] = formatted_articles
            _cache_expiry[cache_key] = datetime.now() + timedelta(seconds=CACHE_DURATION)
            return formatted_articles
        else:
            return get_fallback_content(category, count)
        
    except openai.APITimeoutError as te:
        logger.error(f"OpenAI API timeout for {category}: {str(te)}")
        return get_fallback_content(category, count)
    except openai.RateLimitError as re:
        logger.error(f"OpenAI API rate limit for {category}: {str(re)}")
        return get_fallback_content(category, count)
    except Exception as e:
        logger.error(f"Error generating awareness content for {category}: {str(e)}")
        return get_fallback_content(category, count)

def extract_articles_from_response(response_content):
    """Extract articles array from OpenAI response with multiple fallback strategies"""
    if isinstance(response_content, list):
        return response_content
    
    if isinstance(response_content, dict):
        # Try common keys that might contain the articles
        for key in ["articles", "tips", "content", "data", "items"]:
            if key in response_content and isinstance(response_content[key], list):
                return response_content[key]
        
        # If no list found, try to find the first list value
        for value in response_content.values():
            if isinstance(value, list) and len(value) > 0:
                return value
    
    return []

def get_fallback_content(category, count=3):
    """Get fallback content with proper formatting"""
    base_content = FALLBACK_CONTENT.get(category, FALLBACK_CONTENT.get("Nutrition", []))
    
    # Duplicate content if we need more than available
    result = []
    for i in range(count):
        if i < len(base_content):
            result.append(base_content[i])
        else:
            # Create variation of first item
            first_item = base_content[0] if base_content else {
                "title": f"{category} Health Tips",
                "content": f"Maintaining good {category.lower()} habits is essential for overall health and wellbeing.",
                "category": category,
                "color": get_color_for_category(category),
                "citations": []
            }
            
            variation = first_item.copy()
            variation["title"] = f"{category} Tip #{i+1}"
            result.append(variation)
    
    return result

def get_all_categories():
    """Return list of all health categories"""
    return HEALTH_CATEGORIES

def get_random_awareness_content(count=5):
    """Get random awareness content across categories with optimized performance"""
    import random
    
    result = []
    
    # Limit the count to prevent excessive API calls
    safe_count = min(count, 6)  # Maximum 6 items to prevent timeouts
    
    # First, try to get content from cache
    cached_content = []
    available_categories = []
    
    for category in HEALTH_CATEGORIES:
        cache_key = f"{category}_1"
        if cache_key in _content_cache and datetime.now() < _cache_expiry.get(cache_key, datetime.now()):
            cached_content.extend(_content_cache[cache_key])
        else:
            available_categories.append(category)
    
    # If we have enough cached content, use it
    if len(cached_content) >= safe_count:
        return random.sample(cached_content, safe_count)
    
    # Otherwise, generate content for a limited number of categories
    categories_to_generate = random.sample(available_categories, min(3, len(available_categories)))
    
    # Add any cached content first
    result.extend(cached_content)
    
    # Generate content for remaining categories (max 3 to prevent timeouts)
    for category in categories_to_generate:
        if len(result) >= safe_count:
            break
            
        try:
            # Get just one article per category for variety
            content = generate_awareness_content(category, count=1)
            if content:
                result.extend(content)
        except Exception as e:
            logger.error(f"Error getting random content for {category}: {str(e)}")
            # Add fallback content
            fallback = get_fallback_content(category, 1)
            result.extend(fallback)
    
    # If we still don't have enough content, fill with fallback
    while len(result) < safe_count:
        random_category = random.choice(HEALTH_CATEGORIES)
        fallback = get_fallback_content(random_category, 1)
        result.extend(fallback)
    
    # Return the requested amount
    return result[:safe_count]

# For testing purposes
if __name__ == "__main__":
    print("Testing awareness content generation...")
    for category in ["Nutrition", "Exercise", "Mental Health"]:
        content = generate_awareness_content(category, 2)
        print(f"\n=== {category} ===")
        for article in content:
            print(f"Title: {article['title']}")
            print(f"Content: {article['content'][:50]}...")
