# Vitalink - Healthcare Management Platform

A comprehensive healthcare management platform built with React, TypeScript, and Vite that connects patients and doctors through an intuitive web interface. Vitalink enables seamless health monitoring, patient management, and AI-powered health insights.

## 🌟 Features

### For Patients

- **Personal Dashboard**: View vital signs, health metrics, and recent readings
- **AI Health Suggestions**: Receive personalized health recommendations powered by Google Gemini AI
- **Mental Health Chatbot**: Access 24/7 mental health support through an integrated chatbot
- **Vital Monitoring**: Track heart rate, blood pressure, temperature, and blood sugar levels
- **Profile Management**: Update personal information and preferences
- **Emergency Contacts**: Manage emergency contact information

### For Doctors

- **Patient Management**: View and manage all assigned patients
- **Detailed Patient Analytics**: Analyze patient vital trends with comprehensive charts and metrics
- **Clinical Summary**: Get AI-generated clinical insights and recommendations
- **Patient Details**: Access complete patient information, medical history, and vital readings
- **Hospital Information**: Manage hospital/clinic details and professional credentials
- **Settings Management**: Update professional information and license details

### Core Features

- **Role-Based Authentication**: Secure login system with role-based access (Patient/Doctor)
- **Responsive Design**: Fully responsive interface that works on all devices
- **Real-time Data**: Live vital sign monitoring and updates
- **Data Persistence**: User data stored in localStorage for offline access
- **Modern UI**: Built with Radix UI components and Tailwind CSS for a professional look

## 🚀 Tech Stack

### Frontend

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Framer Motion** - Smooth animations and transitions
- **React Query** - Data fetching and caching
- **Recharts** - Data visualization and charts
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form management
- **Zod** - Schema validation

### AI & Services

- **Google Gemini AI** - AI-powered health suggestions and chatbot
- **Vital Service** - Simulated vital sign data service

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
vitalink-frontend/
├── public/                    # Static assets
│   └── vite.svg              # Vite logo
├── src/
│   ├── assets/               # Images and static data
│   │   ├── images/           # Image files
│   │   └── data/             # Static data files
│   ├── components/           # Reusable UI components
│   │   ├── sections/         # Page sections
│   │   │   ├── doctors/      # Doctor-specific components
│   │   │   │   ├── dashboard_components/  # Dashboard widgets
│   │   │   │   ├── AnalyticsPage.tsx      # Analytics page
│   │   │   │   ├── Dashboard.tsx          # Doctor dashboard
│   │   │   │   ├── DoctorSettingsPage.tsx # Settings page
│   │   │   │   ├── PatientDetails.tsx     # Patient detail view
│   │   │   │   └── PatientsPage.tsx       # Patients list
│   │   │   └── patient/       # Patient-specific components
│   │   │       ├── chat_components/       # Chatbot components
│   │   │       ├── dashboard_components/  # Dashboard widgets
│   │   │       ├── Dashboard.tsx          # Patient dashboard
│   │   │       └── PatientSettingsPage.tsx # Settings page
│   │   ├── sidebars/          # Navigation sidebars
│   │   │   ├── DoctorSidebar.tsx          # Doctor navigation
│   │   │   └── PatientSidebar.tsx         # Patient navigation
│   │   └── ui/                # UI component library
│   ├── contexts/             # React contexts
│   │   ├── PatientsContext.tsx            # Patient data context
│   │   └── UserContext.tsx                # User authentication context
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── pages/                # Page components
│   │   ├── DoctorDashboard.tsx            # Doctor dashboard page
│   │   ├── LandingPage.tsx                # Landing/home page
│   │   ├── LoginPage.tsx                  # Login page
│   │   ├── PageNotFound.tsx               # 404 page
│   │   ├── PatientDashboard.tsx           # Patient dashboard page
│   │   └── SignupPage.tsx                 # Signup page
│   ├── routes/               # Routing configuration
│   │   └── AppRouter.tsx                  # Main router
│   └── services/             # External service integrations
│       ├── gemini.ts                      # Google Gemini AI service
│       └── vitalService.ts                # Vital sign data service
├── index.html               # Main HTML file
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.mts          # Vite configuration
└── vercel.json              # Vercel deployment configuration
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd vitalink-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   - The application uses Google Gemini AI for health suggestions
   - Ensure you have a valid Gemini API key (configured in services/gemini.ts)

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Build for production**

   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 📱 Usage

### Getting Started

1. Visit the landing page at `http://localhost:5173`
2. Choose to sign up as either a Patient or Doctor
3. Complete the registration form
4. Log in with your credentials
5. Access your role-specific dashboard

### Patient Workflow

1. **Dashboard**: View your vital signs and health metrics
2. **Chat**: Use the mental health chatbot for support
3. **Settings**: Update your profile and emergency contacts

### Doctor Workflow

1. **Dashboard**: Overview of patients and hospital information
2. **Patients**: View patient list and detailed information
3. **Analytics**: Analyze patient vital trends and clinical data
4. **Settings**: Manage professional credentials and hospital details

## 🔧 Configuration

### Vercel Deployment

The application is configured for deployment on Vercel with SPA routing:

```json
{
  "version": 2,
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Environment Variables

Create a `.env` file for sensitive configurations:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 🎨 Design System

### Colors

- **Primary**: Blue tones for healthcare trust
- **Accent**: Red for alerts and heart/health themes
- **Neutral**: Gray scale for text and backgrounds

### Typography

- **Font Family**: System fonts for optimal performance
- **Sizes**: Responsive text scaling
- **Weights**: Various font weights for hierarchy

### Components

- **Radix UI**: Accessible, customizable components
- **Tailwind CSS**: Utility classes for rapid styling
- **Responsive**: Mobile-first design approach

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for type safety
- Follow ESLint configuration
- Write descriptive commit messages
- Test components thoroughly
- Maintain responsive design principles

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI** for the excellent component library
- **Tailwind CSS** for the utility-first CSS framework
- **Google Gemini AI** for AI-powered health insights
- **React Community** for the amazing ecosystem

## 📞 Support

For support, email support@vitalink.com or create an issue in the repository.

---

**Built with ❤️ for better healthcare management**
