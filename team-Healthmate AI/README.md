# HealthMate AI 🩺🤖

**Your Intelligent Healthcare Companion**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0+-black.svg)](https://nextjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)](https://flask.palletsprojects.com/)

**Live Demo:** [https://cjid-hackathon-healthmate-ai.vercel.app](https://cjid-hackathon-healthmate-ai.vercel.app)

## 📖 Overview

**HealthMate AI** is a comprehensive AI-powered healthcare assistant that provides intelligent symptom analysis, health awareness content, and personalized health guidance. Built with cutting-edge AI technology, it serves as a bridge between users and healthcare information, promoting early health awareness and supporting informed health decisions.

### 🎯 Mission
To democratize healthcare information access by providing reliable, AI-powered health guidance that encourages users to make informed decisions about their health while emphasizing the importance of professional medical consultation.

### 🌟 Why HealthMate AI?
- **Accessible**: Available 24/7 with multilingual support
- **Intelligent**: Powered by OpenAI GPT-4 and Azure Health Analytics
- **Comprehensive**: Symptom analysis, health chat, and awareness content
- **Safe**: Emphasizes professional medical consultation for serious conditions
- **Privacy-Focused**: Secure data handling with conversation history

## 🔑 Key Features

### 🤖 AI-Powered Health Chat
- Interactive conversational interface for health queries
- Context-aware responses with conversation history
- Multi-language support (English, Igbo, Yoruba, Hausa, Pidgin)
- Follow-up questions for better understanding

### � Intelligent Symptom Analysis
- Advanced symptom recognition using Azure Health Analytics
- Risk assessment and severity evaluation
- Personalized health recommendations
- Emergency situation detection with triage support

### 📚 Health Awareness Hub
- Dynamically generated health articles across 12+ categories
- Evidence-based content with citations
- Culturally relevant health tips
- Preventive care guidance

### 🗂️ Conversation Management
- Persistent conversation history
- Session-based interactions
- Follow-up question suggestions
- Health assessment tracking

### 🌐 Multilingual Support
- Native support for Nigerian languages
- Real-time translation capabilities
- Cultural context awareness
- Localized health content

## 🏗️ Architecture

### Frontend (Next.js)
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: React hooks and context
- **API Integration**: Custom API client with error handling

### Backend (Flask)
- **Framework**: Flask with Python 3.8+
- **AI Services**: OpenAI GPT-4, Azure Health Analytics
- **Database**: Supabase (PostgreSQL)
- **Translation**: Azure Translator Service
- **Authentication**: Session-based with UUID tracking

### Database Schema
- **Sessions**: User conversation sessions
- **Conversations**: Message history and AI responses
- **Health Assessments**: Symptom analysis records
- **Follow-up Questions**: Intelligent question suggestions

## 🚀 Tech Stack

### Frontend Technologies
- **Next.js 14**: React framework with SSR/SSG support
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: Modern state management
- **Lucide Icons**: Beautiful, customizable icons

### Backend Technologies
- **Flask**: Lightweight Python web framework
- **OpenAI API**: GPT-4o-mini for intelligent responses
- **Azure Health Analytics**: Medical entity recognition
- **Azure Translator**: Multi-language support
- **Supabase**: Database and real-time features
- **python-dotenv**: Environment variable management

### DevOps & Deployment
- **Vercel**: Frontend deployment and hosting
- **Docker**: Containerization support
- **GitHub Actions**: CI/CD pipeline
- **Environment Management**: Secure API key handling

## 🛠️ Quick Start

### Prerequisites
- **Node.js 18+** and npm/yarn
- **Python 3.8+** and pip
- **API Keys**: OpenAI, Azure, Supabase accounts

### 1. Clone the Repository
```bash
git clone https://github.com/Techdee1/CJID-HACKATHON-Healthmate-AI.git
cd CJID-HACKATHON-Healthmate-AI
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your API keys to .env file
python app.py
```

### 3. Frontend Setup
```bash
cd frontend-nextjs
npm install
npm run dev
```

### 4. Access the Application
- **Frontend**: https://cjid-hackathon-healthmate-ai.vercel.app
- **Backend API**: https://healthmate-ai-vxcl.onrender.com
- **API Documentation**: https://healthmate-ai-vxcl.onrender.com/api/health

## � Project Structure

```
CJID-HACKATHON-Healthmate-AI/
├── backend/                    # Flask backend application
│   ├── services/              # AI and external service integrations
│   │   ├── health_analysis_service.py
│   │   ├── awareness_service.py
│   │   ├── translation_service.py
│   │   └── database_service.py
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   └── database_schema.sql    # Database schema
├── frontend-nextjs/           # Next.js frontend application
│   ├── src/
│   │   ├── pages/            # Application pages
│   │   ├── components/       # Reusable UI components
│   │   ├── lib/             # Utility functions and API client
│   │   └── types/           # TypeScript type definitions
│   ├── package.json         # Node.js dependencies
│   └── next.config.js       # Next.js configuration
├── frontend/                 # Legacy HTML/CSS/JS frontend
├── triage-call/             # Emergency triage service
└── docs/                    # Documentation and guides
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Azure Services
AZURE_HEALTH_KEY=your_azure_health_key
AZURE_HEALTH_ENDPOINT=your_azure_health_endpoint
AZURE_TRANSLATOR_KEY=your_azure_translator_key
AZURE_TRANSLATOR_ENDPOINT=your_azure_translator_endpoint
AZURE_TRANSLATOR_REGION=your_azure_region

# Supabase Database
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
```

#### Frontend (next.config.js)
```javascript
module.exports = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://127.0.0.1:5000',
    TRIAGE_API_URL: process.env.TRIAGE_API_URL || 'https://triagecall.vercel.app'
  }
}
```

## 📚 API Documentation

### Health Analysis Endpoints

#### POST /api/health/analyze
Analyze user symptoms and provide health guidance.

**Request:**
```json
{
  "message": "I have a headache and fever",
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "response": "AI-generated health guidance...",
  "health_analysis": {
    "symptoms": ["headache", "fever"],
    "body_parts": ["head"],
    "severity_level": "medium"
  },
  "session_id": "uuid-session-id",
  "detected_language": "English"
}
```

#### GET /api/health/awareness/categories
Get available health awareness categories.

#### GET /api/health/awareness/content
Get health awareness content for a specific category.

### Session Management Endpoints

#### POST /api/sessions
Create a new conversation session.

#### GET /api/sessions/{session_id}/history
Retrieve conversation history for a session.

#### GET /api/sessions/{session_id}/followup
Get intelligent follow-up questions for a session.

## 🔐 Security & Privacy

### Data Protection
- **Encryption**: All API communications use HTTPS
- **Session Management**: UUID-based session tracking
- **Data Minimization**: Only necessary health data is stored
- **Retention Policy**: Conversations expire after 30 days

### Compliance
- **HIPAA Awareness**: Designed with healthcare privacy principles
- **GDPR Compliance**: User data rights and deletion capabilities
- **Medical Disclaimer**: Clear limitations and professional consultation encouragement

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest tests/
python test_api.py  # API integration tests
```

### Frontend Testing
```bash
cd frontend-nextjs
npm test
npm run test:e2e  # End-to-end tests
```

### Manual Testing
1. **Health Chat**: Test conversation flow and AI responses
2. **Symptom Analysis**: Verify symptom recognition and recommendations
3. **Awareness Content**: Check content generation and categorization
4. **Multi-language**: Test translation accuracy and cultural relevance

## 🚀 Deployment

### Production Deployment

#### Frontend (Vercel)
```bash
# Deploy to Vercel
vercel --prod

# Configure environment variables in Vercel dashboard
# API_BASE_URL=https://your-backend-domain.com
```

#### Backend (Docker)
```bash
# Build Docker image
docker build -t healthmate-backend .

# Run container
docker run -p 5000:5000 --env-file .env healthmate-backend
```

#### Database (Supabase)
```sql
-- Execute database schema
psql -h your-supabase-host -d postgres -f database_schema.sql
```

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- **Python**: Follow PEP 8 standards
- **TypeScript/JavaScript**: Use Prettier and ESLint
- **Documentation**: Update README for new features

## 📈 Roadmap

### Version 2.1 (Q1 2025)
- [ ] Voice input/output capabilities
- [ ] Mobile application (React Native)
- [ ] Advanced health tracking
- [ ] Integration with wearable devices

### Version 2.2 (Q2 2025)
- [ ] Telemedicine integration
- [ ] Community health forums
- [ ] Appointment scheduling
- [ ] Health record management

### Version 3.0 (Q3 2025)
- [ ] Machine learning health predictions
- [ ] Personalized health plans
- [ ] Healthcare provider network
- [ ] Insurance integration

## 📊 Performance Metrics

- **Response Time**: < 2 seconds for health analysis
- **Accuracy**: 85%+ symptom recognition rate
- **Availability**: 99.9% uptime target
- **Languages**: 5 supported languages
- **Categories**: 12+ health awareness topics

## 🆘 Support & Help

### Documentation
- [API Documentation](API_DOCS.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guidelines](CONTRIBUTING.md)

### Community
- **Issues**: [GitHub Issues](https://github.com/Techdee1/CJID-HACKATHON-Healthmate-AI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Techdee1/CJID-HACKATHON-Healthmate-AI/discussions)
- **Email**: healthmate.ai.support@gmail.com

### Emergency
For medical emergencies, always contact your local emergency services immediately. HealthMate AI is not a substitute for professional medical care.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing advanced language models
- **Microsoft Azure** for health analytics and translation services
- **Supabase** for database and backend services
- **Vercel** for seamless deployment and hosting
- **CJID Hackathon** for inspiring this project
- **Nigerian Healthcare Community** for cultural insights and feedback

## 📞 Contact

**HealthMate AI Team**
- **Development Lead**: [Techdee1](https://github.com/Techdee1)
- **Email**: healthmate.ai.support@gmail.com
- **Website**: [https://cjid-hackathon-healthmate-ai.vercel.app](https://cjid-hackathon-healthmate-ai.vercel.app)

---

**⚠️ Medical Disclaimer**: HealthMate AI provides general health information and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.

**Made with ❤️ for better healthcare accessibility**

### 📦 Installation

1. **Create and activate a virtual environment**

   ```bash
   python -m venv venv
   ```

   **For Windows:**

   ```bash
   venv\Scripts\activate
   ```

   **For macOS/Linux:**

   ```bash
   source venv/bin/activate
   ```

2. **Install dependencies**

   ```bash
   pip install -r ../requirements.txt
   ```

3. **Set up environment variables**
   Create a `.env` file in the project root (one level up from the `backend` folder), based on `.env.example`. Add your OpenAI and Azure API keys.

4. **Run the Python backend**

   ```bash
   python app.py
   ```

---

## 🌐 Frontend Setup

1. Navigate to the `frontend` folder:

   ```bash
   cd frontend
   ```

2. Open the project with **Live Server** (e.g., using VS Code Live Server extension) or any local static server tool.

> Make sure the backend (`app.py`) is running before you interact with the frontend. The frontend communicates with the AI server for processing health queries.

---

## 💡 Contributing

Contributions are welcome!
Feel free to fork the repo and submit a pull request. For major changes, open an issue first to discuss your proposal.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
