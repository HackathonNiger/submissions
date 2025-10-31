# HealthMate AI - API Documentation

## Base URL
- Development: `http://localhost:5000`
- Production: `https://your-production-url.com` (Update with your deployment URL)

## Authentication
Currently, the API does not require authentication. Future versions may implement API key authentication.

## Response Format
All endpoints return responses in JSON format. Success responses include a `success: true` field, while error responses include `success: false` and an `error` message.

## Endpoints

### 1. Analyze Health Query
Analyzes a health concern in any supported language and returns a helpful response.

**Endpoint**: `/api/health/analyze`  
**Method**: POST  
**Content-Type**: application/json

**Request Body**:
```json
{
  "message": "I have a headache and fever for two days"
}
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "detected_language": "English",
  "language_code": "en",
  "original_text": "I have a headache and fever for two days",
  "english_translation": null,
  "health_analysis": {
    "symptoms": ["headache", "fever"],
    "body_parts": [],
    "time_expressions": ["two days"],
    "medications": []
  },
  "response": "I'm sorry to hear you've been experiencing a headache and fever for two days. These symptoms could indicate a viral infection like the flu or common cold. It's important to rest, stay hydrated, and consider taking over-the-counter fever reducers like acetaminophen if appropriate. If your fever is high (above 101°F/38.3°C), persists longer than 3 days, or you develop additional symptoms like severe headache, stiff neck, or difficulty breathing, please seek medical attention promptly. Would you like more specific advice about managing these symptoms?"
}
```

**Error Response (400 Bad Request)**:
```json
{
  "success": false,
  "error": "No message provided"
}
```

**Error Response (500 Internal Server Error)**:
```json
{
  "success": false,
  "error": "An unexpected error occurred during processing"
}
```

### 2. Get Supported Languages
Returns the list of languages supported by the API.

**Endpoint**: `/api/health/languages`  
**Method**: GET

**Success Response (200 OK)**:
```json
{
  "success": true,
  "supported_languages": {
    "en": "English",
    "ig": "Igbo",
    "yo": "Yoruba",
    "ha": "Hausa",
    "pcm": "Nigerian Pidgin"
  }
}
```

### 3. Health Check
Simple endpoint to verify the API is running.

**Endpoint**: `/api/health`  
**Method**: GET

**Success Response (200 OK)**:
```json
{
  "status": "healthy",
  "service": "HealthMate AI API"
}
```

### 4. Get Health Facts
Retrieves health facts about a specified topic.

**Endpoint**: `/api/health/facts`  
**Method**: GET  
**Query Parameters**:
- `topic` (optional): The health topic to get facts about (default: "general health")
- `count` (optional): Number of facts to retrieve (default: 3, max: 5)

**Success Response (200 OK)**:
```json
{
  "success": true,
  "topic": "nutrition",
  "facts": [
    {
      "title": "Protein Importance",
      "description": "Proteins are essential nutrients for the human body. They are one of the building blocks of body tissue and can also serve as a fuel source."
    },
    {
      "title": "Fiber Benefits",
      "description": "A high-fiber diet may help reduce the risk of obesity, heart disease, and diabetes. Women should try to eat at least 21 to 25 grams of fiber a day, while men should aim for 30 to 38 grams a day."
    },
    {
      "title": "Hydration Facts",
      "description": "Water is your body's principal chemical component and makes up about 50% to 70% of your body weight. Your body depends on water to survive."
    }
  ]
}
```

### 5. Get Awareness Categories
Retrieves available health awareness categories.

**Endpoint**: `/api/health/awareness/categories`  
**Method**: GET

**Success Response (200 OK)**:
```json
{
  "success": true,
  "categories": [
    "Nutrition",
    "Mental Health",
    "Exercise",
    "Preventive Care",
    "Child Health"
  ]
}
```

### 6. Get Category Content
Retrieves health awareness content for a specific category.

**Endpoint**: `/api/health/awareness/content`  
**Method**: GET  
**Query Parameters**:
- `category` (optional): The health category (default: "Nutrition")
- `count` (optional): Number of content items to retrieve (default: 3, max: 5)

**Success Response (200 OK)**:
```json
{
  "success": true,
  "category": "Nutrition",
  "content": [
    {
      "title": "The Importance of Balanced Diet",
      "category": "Nutrition",
      "content": "A balanced diet provides your body with the nutrients it needs to function correctly. To get the proper nutrition from your diet, you should consume the majority of your daily calories in fresh fruits, fresh vegetables, whole grains, legumes, nuts, and lean proteins."
    },
    {
      "title": "Hydration Basics",
      "category": "Nutrition",
      "content": "Staying hydrated is crucial for health and well-being, but many people don't consume enough fluids each day. Around 60% of the body is made up of water, and around 71% of the planet's surface is covered by water."
    }
  ]
}
```

### 7. Get Random Awareness Content
Retrieves random health awareness content across categories.

**Endpoint**: `/api/health/awareness/random`  
**Method**: GET  
**Query Parameters**:
- `count` (optional): Number of content items to retrieve (default: 5, max: 10)

**Success Response (200 OK)**:
```json
{
  "success": true,
  "content": [
    {
      "title": "Managing Stress",
      "category": "Mental Health",
      "content": "Effective stress management helps you break the hold stress has on your life, so you can be happier, healthier, and more productive. The ultimate goal is a balanced life, with time for work, relationships, relaxation, and fun—and the resilience to hold up under pressure and meet challenges head on."
    },
    {
      "title": "Benefits of Regular Exercise",
      "category": "Exercise",
      "content": "Regular physical activity can improve your muscle strength and boost your endurance. Exercise delivers oxygen and nutrients to your tissues and helps your cardiovascular system work more efficiently."
    }
  ]
}
```

### 8. Translate Awareness Content
Translates awareness content to a specific language.

**Endpoint**: `/api/translate/awareness`  
**Method**: POST  
**Content-Type**: application/json  
**Request Body**:
```json
{
  "content": [
    {
      "title": "Managing Stress",
      "category": "Mental Health",
      "content": "Effective stress management helps you break the hold stress has on your life, so you can be happier, healthier, and more productive."
    }
  ],
  "target_language": "yo"
}
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "translated_content": [
    {
      "title": "Iṣakoso Wahala",
      "category": "Ilera Opolo",
      "content": "Iṣakoso wahala ti o munadoko le ran ẹ lọwọ lati fa idiwọ ti wahala ni lori igbesi aye rẹ, ki o le jẹ eniyan ti o ni ayọ, ilera, ati alailorukọ. Ete ikehin ni igbesi aye ti o ni iwontunwonsi, pẹlu akoko fun iṣẹ, awọn ibasepo, isinmi, ati igbadun—ati agbara lati duro labẹ ipa ati koju awọn ipenija ojukorojuu.",
      "original_language": "en",
      "translated": true
    }
  ]
}
```

## Example Usage

### JavaScript Fetch Example
```javascript
// Example: Analyzing a health concern
async function analyzeHealthConcern(message) {
  try {
    const response = await fetch('http://localhost:5000/api/health/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Display the AI response to the user
      console.log(data.response);
    } else {
      // Handle error
      console.error(data.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Example: Getting health facts
async function getHealthFacts(topic = 'nutrition', count = 3) {
  try {
    const response = await fetch(`http://localhost:5000/api/health/facts?topic=${topic}&count=${count}`);
    const data = await response.json();
    
    if (data.success) {
      // Process and display health facts
      data.facts.forEach(fact => {
        console.log(`${fact.title}: ${fact.description}`);
      });
    } else {
      console.error(data.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}
```

## Notes
- The API automatically detects the language of the input text
- If the input is not in English, the system translates it, processes it, and translates the response back to the original language
- The `health_analysis` section is provided for information/debugging purposes - frontend applications typically only need to display the `response` field to users
- All endpoints have rate limiting of 60 requests per minute per IP address to prevent abuse
