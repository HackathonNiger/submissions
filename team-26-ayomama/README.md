# Ayomama: Maternal Health & Community Platform

Ayomama is a comprehensive mobile application designed to empower expectant and new mothers with vital health information, personalized care, and a supportive community. It connects mothers with healthcare professionals and leverages AI to provide actionable insights, ensuring a healthier and more confident motherhood journey. Built with a robust Node.js backend and a modern React Native frontend, Ayomama is your digital companion for an exceptional maternal experience.

## Installation

To get the Ayomama platform running locally, follow these steps:

✨ **Prerequisites**:

- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (local or cloud instance)
- Expo CLI (install globally: `npm install -g expo-cli`)

🚀 **Backend Setup**:

```bash
# Clone the repository
git clone https://github.com/Ayomama-Health-Project/submissions.git
cd submissions/Backend-Ayomama

# Install backend dependencies
npm install

# Start the backend server in development mode
npm run dev
# Or in production mode
# npm start
```

📱 **Frontend Setup**:

```bash
# Navigate to the frontend directory
cd ../Frontend-Ayomama

# Install frontend dependencies
npm install

# The Frontend uses environment variables configured via Expo.
# Ensure your `EXPO_PUBLIC_API_BASE_URL` is set in your environment or `app.json`
# to point to your backend (e.g., `http://localhost:3000`).

# Start the Expo development server
npx expo start
```

Follow the instructions in your terminal to run the application on a simulator or physical device.

## Usage

Once both the backend and frontend servers are running, you can interact with the Ayomama platform through its mobile interface:

- **Mother User**:

  1.  **Onboarding & Registration**: Upon first launch, new users can select 'Mother' and register with their details. The app guides them through setting up language preferences, personal information, and emergency contacts.
  2.  **Dashboard**: Access a personalized dashboard with baby development insights, a daily checklist for wellness, vitals overview, upcoming visit reminders, and quick access to emergency contacts.
  3.  **Smart Chat**: Engage with 'Favour', the AI assistant, for maternal health advice, pregnancy tips, and emotional support.
  4.  **Appointments**: Schedule and view antenatal visits, receive reminders, and get directions to hospitals.
  5.  **Community**: Connect with other mothers, share experiences, ask questions, and offer support.
  6.  **Profile**: Manage personal settings, language, security, and notification preferences.

- **Healthcare Worker (CHW) User**:
  1.  **Registration & Login**: Community Health Workers (CHWs) can create a dedicated account and provide their facility details.
  2.  **Dashboard**: Access a comprehensive dashboard to monitor assigned patients, view risky distributions, and track weekly visit progress.
  3.  **Patient Management**: Add new patients and log their visit details including pregnancy stage, medication, risk status, and medical history.
  4.  **Patient Information**: View detailed information for each mother under care, including vitals and medication lists.

## Features

- **Secure User Authentication**: Robust authentication system for both mothers and healthcare workers, including password reset functionality.
- **Personalized AI Chatbot (Favour)**: An empathetic and knowledgeable AI assistant powered by Groq, offering real-time maternal health guidance in multiple local languages.
- **Antenatal Vitals Tracking**: Enables mothers to record essential health vitals, receiving AI-generated feedback.
- **Appointment Scheduling & Reminders**: Users can schedule hospital visits and receive automated SMS (via Twilio) and email (via Nodemailer) reminders.
- **Nearby Hospital Locator**: Integrates with OpenStreetMap (via Overpass API) and OpenCage Geocoding to find nearby hospitals.
- **Community Health Worker (CHW) Module**: A dedicated portal for CHWs to manage patient profiles, log visits, and monitor patient health statuses.
- **Multi-language Support**: Features dynamic text translation for key UI elements, supporting English, Hausa, Yoruba, and Igbo (via Microsoft Azure Translator).
- **Interactive Daily Checklists**: Helps mothers track essential daily routines like medication, hydration, and exercise.
- **Baby Development Milestones**: Provides weekly insights into baby growth and relevant tips for mothers.
- **Emergency Contact System**: Quick access to emergency contacts and a "tap to alert" feature.
- **Wellness Activities**: Curated content for prenatal yoga, breathing exercises, meditation, and sleep stories.
- **Nutrition Tracking**: Offers meal suggestions and dietary information categorized by breakfast, lunch, and dinner.

## Technologies Used

| Category      | Technology                                                                                                                                                                                                 | Purpose                                            |
| :------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------- |
| **Backend**   | [![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)                                                                                   | JavaScript runtime environment                     |
|               | [![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)                                                                            | Web framework for API development                  |
|               | [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)                                                                                | NoSQL database for data storage                    |
|               | [![Mongoose](https://img.shields.io/badge/Mongoose-800000?style=flat&logo=mongoose&logoColor=white)](https://mongoosejs.com/)                                                                              | MongoDB object data modeling (ODM) for Node.js     |
|               | [![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)                                                                                           | Secure authentication token generation             |
|               | [![Groq](https://img.shields.io/badge/Groq-000000?style=flat&logo=groq&logoColor=white)](https://groq.com/)                                                                                                | AI model for the chatbot functionality             |
|               | [![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=flat&logo=twilio&logoColor=white)](https://www.twilio.com/)                                                                                    | SMS notifications for reminders                    |
|               | [![Nodemailer](https://img.shields.io/badge/Nodemailer-2A585F?style=flat&logo=nodemailer&logoColor=white)](https://nodemailer.com/)                                                                        | Email notifications for reminders and OTPs         |
|               | [![OpenCage Geocoding](https://img.shields.io/badge/OpenCage%20Geocoding-007FFF?style=flat&logo=openstreetmap&logoColor=white)](https://opencagedata.com/)                                                 | Geocoding and reverse geocoding services           |
|               | [![Overpass API](https://img.shields.io/badge/Overpass%20API-4A2D4A?style=flat&logo=openstreetmap&logoColor=white)](https://wiki.openstreetmap.org/wiki/Overpass_API)                                      | Querying OpenStreetMap data for nearby hospitals   |
|               | [![Node-Cron](https://img.shields.io/badge/Node--Cron-FFD166?style=flat&logo=npm&logoColor=white)](https://www.npmjs.com/package/node-cron)                                                                | Task scheduling for automated reminders            |
| **Frontend**  | [![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=flat&logo=react&logoColor=white)](https://reactnative.dev/)                                                                        | Cross-platform mobile application framework        |
|               | [![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)                                                                                                | Universal application development for React Native |
|               | [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)                                                                  | Utility-first CSS framework for styling            |
|               | [![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat&logo=zustand&logoColor=white)](https://zustand-bear.github.io/)                                                                         | Lightweight state management for React Native      |
|               | [![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white)](https://axios-http.com/)                                                                                       | Promise-based HTTP client for API requests         |
|               | [![React Native Async Storage](https://img.shields.io/badge/Async%20Storage-F0DB4F?style=flat&logo=react&logoColor=black)](https://react-native-async-storage.github.io/async-storage/)                    | Persistent key-value storage for React Native      |
| **Dev Tools** | [![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)](https://git-scm.com/)                                                                                                | Version control system                             |
|               | [![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)](https://eslint.org/)                                                                                        | Code linting for quality and consistency           |
|               | [![Prettier](https://img.shields.io/badge/Prettier-F7BA3E?style=flat&logo=prettier&logoColor=white)](https://prettier.io/)                                                                                 | Code formatter for consistent style                |
| **External**  | [![Microsoft Azure Translator](https://img.shields.io/badge/Azure%20Translator-0078D4?style=flat&logo=azuredevops&logoColor=white)](https://azure.microsoft.com/en-us/products/ai-services/ai-translator/) | Multi-language translation for UI text             |

---

# Ayomama Backend API

## Overview

The Ayomama Backend API is a robust server-side application built with Node.js and Express.js, providing the core functionalities for the Ayomama maternal health platform. It leverages MongoDB for persistent data storage, integrates with a Groq AI model for conversational features, and uses external services like Twilio and Nodemailer for critical notifications.

## Features

- **User Authentication**: Secure registration, login, logout, and password reset functionalities for both mothers and Community Health Workers (CHWs) using JWT.
- **User Profile Management**: Allows users to update personal information, emergency contacts, and language preferences.
- **Antenatal Vitals Tracking**: Enables mothers to record essential health vitals, receiving AI-powered feedback.
- **AI Chatbot**: Provides an intelligent conversational agent powered by Groq for maternal health guidance and support.
- **Hospital Location Service**: Identifies nearby hospitals using OpenCage Geocoding and Overpass API data.
- **Appointment Scheduling**: Manages the scheduling, retrieval, updating, and deletion of appointments for mothers.
- **Automated Reminders**: Utilizes node-cron, Twilio, and Nodemailer to send timely SMS and email reminders for upcoming appointments.
- **CHW Management**: Supports Community Health Worker registration and profile updates.
- **Patient Management**: Enables CHWs to assign patients and log detailed patient visit information.

## Getting Started

### Installation

To set up the Ayomama Backend API locally, follow these steps:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Ayomama-Health-Project/submissions.git
    cd submissions/Backend-Ayomama
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment Variables**:
    Create a `.env` file in the `Backend-Ayomama` directory and populate it with the required variables as shown in the `Environment Variables` section below.
4.  **Start the Server**:
    ```bash
    # For development (with nodemon for auto-restart)
    npm run dev
    # For production
    # npm start
    ```
    The API server will typically run on `http://localhost:3000`.

### Environment Variables

All required environment variables for the backend must be defined in a `.env` file in the root of the `Backend-Ayomama` directory:

- `MONGO_URI`: MongoDB connection string.
  - Example: `mongodb+srv://user:password@cluster.mongodb.net/ayomama_db?retryWrites=true&w=majority`
- `JWT_SECRET`: Secret key for signing JWT tokens.
  - Example: `your_jwt_secret_key_here_should_be_long_and_random`
- `EMAIL_HOST`: SMTP host for Nodemailer.
  - Example: `smtp.ethereal.email` (for testing) or your service provider's host.
- `EMAIL_PORT`: SMTP port for Nodemailer.
  - Example: `587`
- `EMAIL_SECURE`: `true` if your SMTP uses SSL/TLS (port 465), `false` otherwise (port 587 with STARTTLS).
  - Example: `false`
- `EMAIL_USER`: Email account username for sending emails.
  - Example: `your_email@example.com`
- `EMAIL_PASS`: Email account password for sending emails.
  - Example: `your_email_password`
- `ACCOUNT_SID`: Twilio Account SID.
  - Example: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- `AUTH_TOKEN`: Twilio Auth Token.
  - Example: `your_twilio_auth_token_xxxxxxxxxxxxx`
- `TWILIO_PHONE_NUMBER`: Your Twilio phone number.
  - Example: `+1501712266`
- `GROQ_API_KEY`: API key for Groq AI services.
  - Example: `gsk_xxxxxxxxxxxxxxxxxxxxxx`
- `OPENCAGE_API_KEY`: API key for OpenCage Geocoding.
  - Example: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## API Documentation

### Base URL

The base URL for all API endpoints is `http://localhost:3000/api` (or your deployed backend URL).

### Endpoints

Refer to [Backend-Ayomama README](Backend-Ayomama/README.md)

---

## Contributing

We welcome contributions from the community to make Ayomama even better! To contribute:

1.  🍴 **Fork the Repository**: Create your own fork of the project.
2.  🌟 **Clone Your Fork**: Clone your forked repository to your local machine.
3.  🌿 **Create a New Branch**: Create a new branch for your feature or bug fix (e.g., `feature/add-chatbot-translation` or `fix/login-bug`).
4.  💻 **Make Your Changes**: Implement your changes and commit them with clear, concise messages.
5.  ✅ **Test Your Changes**: Ensure your changes are well-tested and do not introduce new issues.
6.  ⬆️ **Push to Your Fork**: Push your branch to your forked repository.
7.  📝 **Open a Pull Request**: Submit a pull request to the main repository, describing your changes and their purpose.

Please ensure your code adheres to the project's coding standards.

## License

This project is licensed under the [MIT License](LICENSE).

## Author Info

**Ayomama Health Project Team**

Feel free to connect with the team behind this project:

- **Twitter**: [Ayomama Twitter](https://x.com/Ayomama_ng)
- **Instagram**: [Ayomama Instagram](https://www.instagram.com/ayomama_ng/)
- **YouTube**: [Ayomama YouTube](https://www.youtube.com/@Ayomamahealth)

## Additional Resources

Here are additional materials and resources related to the **Ayomama** project:

 **Documentation & Project Files**

- **Project Summary:** [View Document](https://docs.google.com/document/d/1l9OhcXAjV15V6e5QTsNUHoEDvsRrwOXy5sepsaHn2UQ/edit?usp=drive_link)
- **Product Requirements Document (PRD):** [View PRD](https://docs.google.com/document/d/1vO0pCvpRAn2wrz_pXwkWLXXxcftnRzM-0ZMgLbQAugk/edit?usp=drive_link)
- **Pitch/Slide Deck:** [View Slides](https://docs.google.com/presentation/d/18P62i1KGUuxjClzlbg_AinAL7gYJ1PXd/edit?usp=drive_link&ouid=107403678784985362840&rtpof=true&sd=true)
- **Demo Video:** [Watch Demo](https://drive.google.com/file/d/1ZOFWRE7vblLyQAfUfJ12KZrRWKJKQ3W6/view?usp=drive_link)

 **Design Prototypes (Figma)**

- **Ayomama Patient Prototype:** [Open Figma](https://www.figma.com/proto/AIMQcTmaMor0FdMJHowwhq/Ayomama?node-id=571-2444&starting-point-node-id=450%3A240&locale=en)
-  **Ayomama CHW Prototype:** [Open Figma](https://www.figma.com/proto/AIMQcTmaMor0FdMJHowwhq/Ayomama?node-id=988-497&starting-point-node-id=959%3A551&locale=en)

 **Full Project Reference Document:**  
[Access Here](https://docs.google.com/document/d/1jQESUe1WIV9f-qyKiA3Otlog_5Csbl8F6MsBHsOR9cM/edit?tab=t.0)

---

## Badges

[![Backend: Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Frontend: React Native](https://img.shields.io/badge/Frontend-React_Native-61DAFB?style=flat&logo=react&logoColor=white)](https://reactnative.dev/)
[![Database: MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![AI: Groq](https://img.shields.io/badge/AI-Groq-000000?style=flat&logo=groq&logoColor=white)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](Backend-Ayomama/LICENSE)
