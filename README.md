# 🗣️ UweTalk: Indigenous Language Translation Platform

**UweTalk** is a modern web application designed to bridge language barriers by providing seamless translation services for Nigeria's indigenous languages. Built with a React frontend and FastAPI backend, it offers real-time translation with voice support for Hausa, Yoruba, Igbo, and other Nigerian languages.

## 🌟 What is UweTalk?

UweTalk is a comprehensive translation platform that enables:
- **Real-time text translation** between English and Nigerian indigenous languages
- **Voice-to-text conversion** using OpenAI Whisper for speech input
- **Text-to-speech output** for audio feedback
- **Modern web interface** built with React and Tailwind CSS
- **RESTful API** for integration with other applications
- **Supabase integration** for data management and authentication

## 🚀 Key Features

- 🎤 **Voice Input**: Record audio and convert to text for translation
- 🔊 **Audio Output**: Listen to translated text in native languages
- 🌐 **Multi-language Support**: Currently supports Hausa, with plans for Yoruba, Igbo, and more
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔌 **API Integration**: RESTful API for developers to integrate translation services
- 🎨 **Modern UI**: Clean, intuitive interface built with shadcn/ui components

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **Supabase** for backend services

### Backend
- **FastAPI** for the REST API
- **OpenAI Whisper** for speech-to-text
- **Transformers** for translation models
- **PyTorch** for machine learning inference
- **Uvicorn** as ASGI server

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/Ip-Tec/uwe-talk.git
cd uwe-talk
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run the backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install Node.js dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your backend URL

# Start the development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🗂️ Project Structure

```
uwe-talk/
├── 📁 backend/                    # FastAPI backend
│   ├── 📁 routers/               # API route handlers
│   │   └── translate.py         # Translation endpoints
│   ├── 📁 services/              # Business logic
│   │   └── ai_models.py         # AI model services
│   ├── 📁 utils/                 # Utility functions
│   │   ├── auth.py              # Authentication helpers
│   │   └── file_helpers.py      # File processing utilities
│   ├── 📁 train/                 # Model training scripts
│   │   └── train_whisper.py     # Whisper model training
│   ├── main.py                   # FastAPI application entry point
│   ├── requirements.txt          # Python dependencies
│   └── utils_audio.py           # Audio processing utilities
│
├── 📁 frontend/                   # React frontend
│   ├── 📁 src/
│   │   ├── 📁 components/        # React components
│   │   │   ├── 📁 ui/           # Reusable UI components
│   │   │   └── Navigation.tsx   # Main navigation
│   │   ├── 📁 pages/            # Page components
│   │   │   ├── Index.tsx        # Home page
│   │   │   ├── Translate.tsx    # Translation interface
│   │   │   ├── Api.tsx          # API documentation
│   │   │   └── Admin.tsx        # Admin panel
│   │   ├── 📁 hooks/            # Custom React hooks
│   │   ├── 📁 integrations/     # External service integrations
│   │   │   └── 📁 supabase/    # Supabase client setup
│   │   └── 📁 lib/              # Utility functions
│   ├── 📁 supabase/             # Supabase configuration
│   │   ├── 📁 functions/        # Edge functions
│   │   └── 📁 migrations/      # Database migrations
│   ├── package.json             # Node.js dependencies
│   └── vite.config.ts           # Vite configuration
│
├── 📄 config.yaml               # Hugging Face Spaces configuration
├── 📄 requirements.txt          # Root Python dependencies
├── 📄 LICENSE                   # MIT License
├── 📄 CODE_OF_CONDUCT.md       # Community guidelines
├── 📄 CONTRIBUTING.md          # Contribution guidelines
└── 📄 legal_&_confidentiality.md # Legal disclaimers
```

## 🚀 Quick Start

1. **Clone and setup** the project as described above
2. **Start the backend** server on port 8000
3. **Start the frontend** development server on port 5173
4. **Open your browser** to http://localhost:5173
5. **Try translating** some English text to Hausa!

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
HOST=0.0.0.0
PORT=8000
WHISPER_MODEL=small
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

#### Frontend (.env.local)
```env
VITE_BACKEND_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📚 API Documentation

The backend provides a RESTful API with the following endpoints:

- `POST /translate/` - Translate text between languages
- `GET /` - Health check endpoint

Visit http://localhost:8000/docs for interactive API documentation.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Setting up the development environment
- Code style and conventions
- Submitting pull requests
- Reporting issues

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 **Email**: [Otakhor Peter](otakhorpeter@gmail.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/Ip-Tec/uwe-talk/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Ip-Tec/uwe-talk/discussions)

---

**Built with ❤️ for Nigeria's linguistic diversity**
