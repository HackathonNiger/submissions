# 🌍 Gani — Bilingual AI Voice Assistant (English & Hausa)

**Gani** is an intelligent, bilingual voice assistant designed to enable **natural, expressive, and culturally aware communication** between humans and machines.  
It speaks **Hausa** and **English**, blending **local context with modern AI technology**.

---

## 🧠 Overview

Gani is divided into two main parts:

| Component                         | Description                                                                                                                               |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend (`/ganibot`)**         | Built with **Next.js**, **TypeScript**, and **TailwindCSS**. Handles the user interface, authentication, and real-time voice interaction. |
| **Backend (`/hausa-tts-server`)** | A **Flask-based** API that converts Hausa text into speech using a pretrained **CLEAR-Global Hausa TTS** model.                           |

Together, they create a seamless bilingual AI experience — Gani doesn’t just understand you, **Gani speaks your language.**

---

## 🧩 Project Architecture

```
gani/
├── ganibot/                # Frontend (Next.js + TypeScript + TailwindCSS)
│   ├── src/
│   ├── public/
│   ├── README.md           # Frontend setup guide
│   └── ...
│
├── hausa-tts-server/       # Backend (Flask Hausa TTS API)
│   ├── app.py
│   ├── routes/
│   ├── model/
│   ├── requirements.txt
│   ├── README.md           # Backend setup guide
│   └── ...
│
└── README.md               # General project overview (you are here)
|
|
|
|____demo                   # Demo files and screenshots
```

---

## 🧰 Tech Stack

| Category           | Tools                                 |
| ------------------ | ------------------------------------- |
| Frontend Framework | Next.js 15                            |
| Frontend Language  | TypeScript                            |
| Styling            | TailwindCSS                           |
| Authentication     | NextAuth.js (Google & GitHub)         |
| Backend Framework  | Flask (Python)                        |
| AI Model           | CLEAR-Global Hausa TTS (Hugging Face) |
| API Communication  | REST (JSON over HTTP)                 |

---

## 🛠️ Setting Up the Project Locally

Follow these steps to get **Gani** running on your local machine.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/gani.git
cd gani
```

---

### 2️⃣ Setup the Backend (`/hausa-tts-server`)

Navigate into the backend directory:

```bash
cd hausa-tts-server
```

Follow the full setup instructions in:

> 📘 [hausa-tts-server/README.md](./hausa-tts-server/README.md)

In summary:

```bash
python -m venv venv
source venv/bin/activate  # (or venv\Scripts\activate on Windows)
pip install -r requirements.txt
flask run
```

This will start the backend server at:

```
http://127.0.0.1:5000
```

---

### 3️⃣ Setup the Frontend (`/ganibot`)

In a new terminal, navigate to the frontend:

```bash
cd ../ganibot
```

Follow the full setup instructions in:

> 📘 [ganibot/README.md](./ganibot/README.md)

In summary:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Make sure your `.env.local` includes:

```bash
BACKEND_HAUSA_AUDIO_SERVER_URL="http://127.0.0.1:5000/api/tts"
```

Then, open:

```
http://localhost:3000
```

---

## 🔗 Connecting Frontend & Backend

The frontend communicates with the Flask backend through this route:

```
POST /api/tts
```

To test integration:

1. Run the Flask backend.
2. Run the Next.js frontend.
3. Speak or type in Hausa — Gani will generate spoken responses using the backend’s TTS engine.

---

## 🧭 Directory Summary

| Directory           | Description                                                 |
| ------------------- | ----------------------------------------------------------- |
| `/ganibot`          | Frontend — Bilingual chat interface built with Next.js.     |
| `/hausa-tts-server` | Backend — Hausa TTS Flask API.                              |
| `/public`           | Frontend static assets (icons, voices, demo media).         |
| `.env.local`        | Environment variables for frontend (NextAuth, Gemini, etc). |

---

## 🪄 Example Interaction

| Input (User)         | Output (Gani)         |
| -------------------- | --------------------- |
| “Ina kwana?”         | Audio: “Lafiya lau!”  |
| “What is your name?” | Audio: “Sunana Gani.” |

---

## 💡 Future Vision

- Real-time speech recognition for Hausa and English.
- Natural accent synthesis for localized speech.
- Offline support for basic conversations.
- Persistent conversation history.
- Customizable voice personalities.

---

## 🩵 Authors

| Name            | Role                                                       | GitHub                                         |
| --------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| **Ayomide**     | Mathematician · Web Developer · Visionary Educator         | [@mide2020-16](https://github.com/mide2020-16) |
| **Ayanfeoluwa** | Creative Developer · DSA Enthusiast · Full Stack Developer | [@ogayanfe](https://github.com/ogayanfe)       |

> “Building intelligent systems that speak with purpose.”

---

## 📜 License

This project uses the **CLEAR-Global Hausa TTS model** and is open for research and educational use.  
Please review the respective model and dependency licenses before deployment.

---

## 🎬 Demo

Check out Gani in action — showcasing its **bilingual voice interaction**, **responsive interface**, and **smart settings panel** on both desktop and mobile.

> (Insert video or GIF demo link here)
