# smartEd: AI-Powered Learning Tool

## 1. Context
**smartEd** is an AI-powered learning tool built for students, learners, and educational institutions.  
The project's goal is to provide access to examination preparation resources for individuals with limited study materials, helping them learn efficiently and compete on a global scale.

---

## 2. Technology Stack
The application is built using a simple Machine Learning model on the following stack:

- **Python**
- **FastAPI**
- **OpenAI API** (key stored in environment variables)

---

## 3. Project Folder Structure
```
smartEd/
├── smarted-africa/
└── openai_api.py
```

---

## 4. Key Code Snippets

### Application Initialization
```python
from fastapi import FastAPI
from openai import OpenAI
import os

app = FastAPI()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
```

### Request Body Model
The request data is structured using a Pydantic BaseModel:
```python
from pydantic import BaseModel

class Query(BaseModel):
    text: str
```

### `/ask` Endpoint
This endpoint handles POST requests using the `gpt-40-mini` model to generate responses.
```python
@app.post("/ask")
def ask_ai_post(query: Query):
    response = client.chat.completions.create(
        model="gpt-40-mini",
        messages=[
            # ... message structure goes here ...
        ]
    )
    return {"answer": response.choices[0].message.content}
```

### Example Response
```json
{
  "answer": "Okay, I go use pidgin to respond to your questions. How I fit help you today?"
}
```

---

## 5. Running the Demo
To run the application locally using **Uvicorn**, execute the following command:

```bash
uvicorn smarted-africa.openai_api:app --reload
```

Once the server is running, open your browser and go to:
```
http://127.0.0.1:8000/docs
```

This will open the interactive FastAPI documentation where you can test the `/ask` endpoint.

---

## 6. Next Steps
- Provide more data to train and fine-tune the AI model.
- Expand response generation capabilities.
- Develop a front-end interface for users.

---

## 7. License
This project is open-source and available for educational and research use.

---

## 8. Author
**Chinemeze Njoku**  
📧 chinemezenjoku@gmail.com  
🇳🇬 Nigeria
