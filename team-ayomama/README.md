# Ayomama: Maternal Health & Community Platform 💖

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

# Create a .env file based on .env.example (see Environment Variables section below)
cp .env.example .env

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

#### `POST /api/auth/register`

User registration.
**Request**:

```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "SecurePassword123"
}
```

**Response**:

```json
{
  "message": "User registered successfully",
  "success": true,
  "data": {
    "_id": "65f0e3e3b3c3d3e3f3a3b3c3",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "preferredLanguages": "en",
    "createdAt": "2024-03-12T10:00:00.000Z",
    "updatedAt": "2024-03-12T10:00:00.000Z"
  }
}
```

**Errors**:

- `400 Bad Request`: "name, email and password are required"
- `409 Conflict`: "User already exists"
- `500 Internal Server Error`: "Internal server error"

#### `POST /api/auth/login`

User login and JWT token issuance.
**Request**:

```json
{
  "email": "jane.doe@example.com",
  "password": "SecurePassword123"
}
```

**Response**:

```json
{
  "message": "Login successful",
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYwZTMxYzI0ZGI5YTI1M2M1YjE3NzgiLCJpYXQiOjE2Nzk2NzI5NjAsImV4cCI6MTY3OTY3NjU2MH0.example_jwt_token"
}
```

**Errors**:

- `400 Bad Request`: "email and password are required"
- `401 Unauthorized`: "Invalid email or password"
- `500 Internal Server Error`: "Internal server error"

#### `POST /api/auth/logout`

Logs out the current authenticated user by clearing the JWT token cookie. Requires authentication.
**Request**: (None - JWT token expected in cookie or Authorization header)
**Response**:

```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Errors**:

- `401 Unauthorized`: "No token Provided"
- `500 Internal Server Error`: "Internal server error"

#### `POST /api/auth/reset`

Initiates password reset by sending an OTP to the user's email.
**Request**:

```json
{
  "email": "jane.doe@example.com"
}
```

**Response**:

```json
{
  "message": "OTP sent to email",
  "success": true
}
```

**Errors**:

- `404 Not Found`: "User not found"
- `500 Internal Server Error`: "Internal server error"

#### `POST /api/auth/verify`

Verifies the OTP and resets the user's password.
**Request**:

```json
{
  "email": "jane.doe@example.com",
  "otp": "1234",
  "newPassword": "NewSecurePassword456"
}
```

**Response**:

```json
{
  "message": "Password reset successful",
  "success": true
}
```

**Errors**:

- `404 Not Found`: "User not found"
- `400 Bad Request`: "Invalid OTP" or "OTP expired"
- `500 Internal Server Error`: "Internal server error"

#### `GET /api/user`

Retrieves the profile of the current authenticated user. Requires authentication.
**Request**: (None - JWT token expected in cookie or Authorization header)
**Response**:

```json
{
  "message": "User found",
  "success": true,
  "data": {
    "_id": "65f0e3e3b3c3d3e3f3a3b3c3",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "08012345678",
    "address": "123 Main St, City",
    "lastPeriodDate": "2024-02-15T00:00:00.000Z",
    "preferredLanguages": "en",
    "contact": "08012345678",
    "emergencyContact": [
      {
        "name": "John Doe",
        "phone": "08011223344",
        "relationship": "spouse",
        "_id": "65f0e3e3b3c3d3e3f3a3b3c4"
      }
    ],
    "createdAt": "2024-03-12T10:00:00.000Z",
    "updatedAt": "2024-03-12T10:00:00.000Z"
  }
}
```

**Errors**:

- `401 Unauthorized`: "Unauthorized" or "Token expired or invalid"
- `404 Not Found`: "User not found"
- `500 Internal Server Error`: "Internal server error"

#### `PUT /api/user/update-language`

Updates the preferred language of the current authenticated user. Requires authentication.
**Request**:

```json
{
  "preferredLanguages": "yo"
}
```

**Response**:

```json
{
  "message": "Language preference updated",
  "success": true,
  "data": {
    "_id": "65f0e3e3b3c3d3e3f3a3b3c3",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "preferredLanguages": "yo",
    "createdAt": "2024-03-12T10:00:00.000Z",
    "updatedAt": "2024-03-12T10:00:00.000Z"
  }
}
```

**Errors**:

- `401 Unauthorized`: "Unauthorized" or "Token expired or invalid"
- `500 Internal Server Error`: "Internal server error"

#### `PUT /api/user/profile-info`

Updates general profile information for the current authenticated user. Requires authentication.
**Request**:

```json
{
  "name": "Jane Smith",
  "address": "456 Oak Ave, Town",
  "lastPeriodDate": "2024-03-01T00:00:00.000Z",
  "contact": "08098765432",
  "emergencyContact": [
    {
      "name": "Alice Smith",
      "phone": "09011223344",
      "email": "alice.smith@example.com",
      "relationship": "sister"
    }
  ]
}
```

**Response**:

```json
{
  "message": "Profile updated",
  "success": true,
  "data": {
    "_id": "65f0e3e3b3c3d3e3f3a3b3c3",
    "name": "Jane Smith",
    "email": "jane.doe@example.com",
    "address": "456 Oak Ave, Town",
    "contact": "08098765432",
    "lastPeriodDate": "2024-03-01T00:00:00.000Z",
    "emergencyContact": [
      {
        "name": "Alice Smith",
        "phone": "09011223344",
        "email": "alice.smith@example.com",
        "relationship": "sister",
        "_id": "65f0e3e3b3c3d3e3f3a3b3c5"
      }
    ],
    "preferredLanguages": "en",
    "createdAt": "2024-03-12T10:00:00.000Z",
    "updatedAt": "2024-03-12T10:30:00.000Z"
  }
}
```

**Errors**:

- `401 Unauthorized`: "Unauthorized" or "Token expired or invalid"
- `500 Internal Server Error`: "Internal server error"

#### `GET /api/user/emergency-contact`

Retrieves the emergency contacts for the current authenticated user. Requires authentication.
**Request**: (None - JWT token expected in cookie or Authorization header)
**Response**:

```json
{
  "message": "Emergency contact for user",
  "success": true,
  "data": [
    {
      "name": "Alice Smith",
      "phone": "09011223344",
      "email": "alice.smith@example.com",
      "relationship": "sister",
      "_id": "65f0e3e3b3c3d3e3f3a3b3c5"
    }
  ]
}
```

**Errors**:

- `401 Unauthorized`: "Unauthorized" or "Token expired or invalid"
- `404 Not Found`: "User not found"
- `500 Internal Server Error`: "Internal server error"

#### `POST /api/antenatal`

Records new antenatal vital updates for the current authenticated user. Requires authentication.
**Request**:

```json
{
  "bloodPressure": "120/80",
  "temperature": 37.0,
  "weight": 65.5,
  "bloodLevel": 12.5,
  "prescribedDrugs": "Folic Acid, Iron Tablets",
  "drugsToAvoid": "Aspirin, Alcohol",
  "date": "2024-03-12T10:00:00.000Z"
}
```

**Response**:

```json
{
  "message": "Antenatal update saved successfully",
  "data": {
    "_id": "65f0e3e3b3c3d3e3f3a3b3c6",
    "userId": "65f0e3e3b3c3d3e3f3a3b3c3",
    "bloodPressure": "120/80",
    "temperature": 37,
    "weight": 65.5,
    "bloodLevel": 12.5,
    "prescribedDrugs": "Folic Acid, Iron Tablets",
    "drugsToAvoid": "Aspirin, Alcohol",
    "date": "2024-03-12T10:00:00.000Z",
    "aiFeedback": "Hello Jane! Your vitals look great today! 😊 Keep up the good work by taking your Folic Acid, Iron Tablets, and remember to avoid Aspirin, Alcohol. 💕",
    "createdAt": "2024-03-12T10:45:00.000Z",
    "updatedAt": "2024-03-12T10:45:00.000Z"
  }
}
```

**Errors**:

- `400 Bad Request`: "All fields are required"
- `401 Unauthorized`: "Unauthorized" or "Token expired or invalid"
- `500 Internal Server Error`: "Server error"

#### `POST /api/chat`

Sends a message to the AI chatbot and receives a response. Requires authentication.
**Request**:

```json
{
  "content": "What should I eat during my first trimester?"
}
```

**Response**:

```json
{
  "success": true,
  "reply": "Hi Mama! During your first trimester, focusing on nutrient-dense foods is key for your baby's development. Try incorporating plenty of fruits, vegetables, lean proteins like chicken and beans, and whole grains. Don't forget to stay hydrated! 💧 If you have specific dietary concerns, please consult a doctor. 💕"
}
```

_(Note: In production, this endpoint supports Server-Sent Events (SSE) for streamed responses. The above is an example of a non-streamed JSON response.)_
**Errors**:

- `400 Bad Request`: "Message is required"
- `401 Unauthorized`: "Unauthorized" or "Token expired or invalid"
- `500 Internal Server Error`: "Failed to process message" or internal server error details

#### `POST /api/hospitals`

Finds nearby hospitals based on provided coordinates. Requires authentication.
**Request**:

```json
{
  "latitude": 6.5244,
  "longitude": 3.3792,
  "radius": 5000
}
```

**Response**:

```json
{
  "success": true,
  "message": "Nearby hospitals fetched successfully",
  "userLocation": "Lagos, Nigeria",
  "totalHospitals": 3,
  "data": [
    {
      "id": 12345,
      "name": "General Hospital Lagos",
      "lat": 6.455,
      "lon": 3.39,
      "address": "Broad Street, Lagos Island, Lagos, Nigeria",
      "tags": {
        "amenity": "hospital",
        "name": "General Hospital Lagos",
        "healthcare": "hospital"
      }
    }
  ]
}
```

**Errors**:

- `400 Bad Request`: "Missing coordinates"
- `401 Unauthorized`: "Unauthorized" or "Token expired or invalid"
- `500 Internal Server Error`: "Error fetching hospitals"

#### `POST /api/auth_chw/register_chw`

Registers a new Community Health Worker (CHW).
**Request**:

```json
{
  "email": "chw.grace@example.com",
  "password": "SecureCHWPassword123"
}
```

**Response**:

```json
{
  "message": "User successfully registered",
  "success": true,
  "data": {
    "_id": "65f0e3e3b3c3d3e3f3a3b3c7",
    "email": "chw.grace@example.com",
    "fullName": "",
    "createdAt": "2024-03-12T11:00:00.000Z",
    "updatedAt": "2024-03-12T11:00:00.000Z"
  }
}
```

**Errors**:

- `400 Bad Request`: "Input you name, email or password" or "This user already exist"
- `500 Internal Server Error`: "Internal server error"

#### `POST /api/auth_chw/login_chw`

Logs in a Community Health Worker (CHW) and issues a JWT token.
**Request**:

```json
{
  "email": "chw.grace@example.com",
  "password": "SecureCHWPassword123"
}
```

**Response**:

```json
{
  "message": "logged in successfully",
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYwZTMxYzI0ZGI5YTI1M2M1YjE3NzgiLCJpYXQiOjE2Nzk2NzI5NjAsImV4cCI6MTY3OTY3NjU2MH0.example_chw_jwt_token"
}
```

**Errors**:

- `400 Bad Request`: "email and password are required"
- `404 Not Found`: "Invalid email or password"
- `500 Internal Server Error`: "Internal server error"

#### `GET /api/auth_chw/current_chw`

Retrieves the profile of the current authenticated CHW. Requires authentication.
**Request**: (None - JWT token expected in cookie or Authorization header)
**Response**:

```json
{
  "message": "Current user fetched",
  "success": true,
  "data": {
    "_id": "65f0e3e3b3c3d3e3f3a3b3c7",
    "email": "chw.grace@example.com",
    "fullName": "Grace Adebayo",
    "state": "Lagos",
    "localGovernment": "Ikeja",
    "facilityName": "Community Health Center",
    "facilityCode": "CHC001",
    "assignedPatients": [],
    "createdAt": "2024-03-12T11:00:00.000Z",
    "updatedAt": "2024-03-12T11:30:00.000Z"
  }
}
```

**Errors**:

- `401 Unauthorized`: "Unauthorized" or "Token invalid or expired" or "CHW not found"
- `500 Internal Server Error`: "Internal server error"

#### `PUT /api/auth_chw/chw_profile`

Updates the profile information for the current authenticated CHW. Requires authentication.
**Request**:

```json
{
  "fullName": "Grace Adebayo",
  "state": "Lagos",
  "localGovernment": "Ikeja",
  "facilityName": "Community Health Center",
  "facilityCode": "CHC001"
}
```

**Response**:

```json
{
  "message": "Profile updated",
  "success": true,
  "data": {
    "_id": "65f0e3e3b3c3d3e3f3a3b3c7",
    "email": "chw.grace@example.com",
    "fullName": "Grace Adebayo",
    "state": "Lagos",
    "localGovernment": "Ikeja",
    "facilityName": "Community Health Center",
    "facilityCode": "CHC001",
    "assignedPatients": [],
    "createdAt": "2024-03-12T11:00:00.000Z",
    "updatedAt": "2024-03-12T11:30:00.000Z"
  }
}
```

**Errors**:

- `401 Unauthorized`: "Unauthorized" or "Token invalid or expired"
- `500 Internal Server Error`: "Internal server error"

#### `POST /api/auth_chw/assign_patient`

Assigns a patient to the current authenticated CHW. Requires authentication.
**Request**:

```json
{
  "patientId": "65f0e3e3b3c3d3e3f3a3b3c8"
}
```

**Response**:

```json
{
  "message": "Patient assigned successfully"
}
```

**Errors**:

- `401 Unauthorized`: "Unauthorized" or "Token invalid or expired"
- `404 Not Found`: "CHW or Patient not found"
- `500 Internal Server Error`: "Internal server error"

#### `POST /api/patient/log-visit`

Logs a visit for a specific patient by a CHW.
**Request**:

```json
{
  "patientId": "65f0e3e3b3c3d3e3f3a3b3c8",
  "pregnancyStage": "30 weeks",
  "visitDate": "2024-03-12T12:00:00.000Z",
  "medicationList": "Iron supplements, Folic Acid",
  "riskStatus": "monitor",
  "medicalHistory": "Patient has mild anemia, managed with medication.",
  "patientInformation": "Patient is responsive and adhering to advice."
}
```

**Response**:

```json
{
  "message": "Visit logged successfully",
  "success": true,
  "data": {
    "_id": "65f0e3e3b3c3d3e3f3a3b3c9",
    "patientId": "65f0e3e3b3c3d3e3f3a3b3c8",
    "pregnancyStage": "30 weeks",
    "visitDate": "2024-03-12T12:00:00.000Z",
    "medicationList": "Iron supplements, Folic Acid",
    "riskStatus": "monitor",
    "medicalHistory": "Patient has mild anemia, managed with medication.",
    "patientInformation": "Patient is responsive and adhering to advice.",
    "createdAt": "2024-03-12T12:05:00.000Z",
    "updatedAt": "2024-03-12T12:05:00.000Z"
  }
}
```

**Errors**:

- `500 Internal Server Error`: "Internal server error"

#### `GET /api/reminder/run`

Manually triggers the reminder job to send scheduled notifications.
**Request**: (None)
**Response**:

```json
{
  "message": "Reminders executed successfully",
  "count": 2
}
```

**Errors**:

- `500 Internal Server Error`: "Failed to run reminders"

#### `POST /api/visit/create_schedule`

Schedules a new visit for the current authenticated user. Requires authentication.
**Request**:

```json
{
  "visitDate": "2024-03-15",
  "visitTime": "14:30",
  "duration": 60,
  "hospitalName": "City Maternity Hospital",
  "doctorName": "Dr. Adebola",
  "notes": "Routine checkup"
}
```

**Response**:

```json
{
  "message": "Visit successfully scheduled 💛",
  "visit": {
    "_id": "65f0e3e3b3c3d3e3f3a3b3ca",
    "userId": "65f0e3e3b3c3d3e3f3a3b3c3",
    "doctorName": "Dr. Adebola",
    "reminderDateTime": "2024-03-15T14:30:00.000Z",
    "duration": 60,
    "hospitalName": "City Maternity Hospital",
    "notes": "Routine checkup",
    "sent": false,
    "createdAt": "2024-03-12T13:00:00.000Z",
    "updatedAt": "2024-03-12T13:00:00.000Z"
  }
}
```

**Errors**:

- `400 Bad Request`: "Visit date and time are required." or "Invalid visitTime format."
- `401 Unauthorized`: "Unauthorized" or "Token expired or invalid"
- `500 Internal Server Error`: "Internal server error"

#### `GET /api/visit/get_visits`

Retrieves all scheduled visits for the current authenticated user. Requires authentication.
**Request**: (None - JWT token expected in cookie or Authorization header)
**Response**:

```json
{
  "visits": [
    {
      "_id": "65f0e3e3b3c3d3e3f3a3b3ca",
      "userId": "65f0e3e3b3c3d3e3f3a3b3c3",
      "doctorName": "Dr. Adebola",
      "reminderDateTime": "2024-03-15T14:30:00.000Z",
      "duration": 60,
      "hospitalName": "City Maternity Hospital",
      "notes": "Routine checkup",
      "sent": false,
      "createdAt": "2024-03-12T13:00:00.000Z",
      "updatedAt": "2024-03-12T13:00:00.000Z"
    }
  ]
}
```

**Errors**:

- `401 Unauthorized`: "Unauthorized" or "Token expired or invalid"
- `500 Internal Server Error`: "Internal server error"

#### `GET /api/visit/get_visit/:id`

Retrieves a specific visit by its ID for the current authenticated user. Requires authentication.
**Request**: (Path param: `id` - e.g., `/api/visit/get_visit/65f0e3e3b3c3d3e3f3a3b3ca`)
**Response**:

```json
{
  "visit": {
    "_id": "65f0e3e3b3c3d3e3f3a3b3ca",
    "userId": "65f0e3e3b3c3d3e3f3a3b3c3",
    "doctorName": "Dr. Adebola",
    "reminderDateTime": "2024-03-15T14:30:00.000Z",
    "duration": 60,
    "hospitalName": "City Maternity Hospital",
    "notes": "Routine checkup",
    "sent": false,
    "createdAt": "2024-03-12T13:00:00.000Z",
    "updatedAt": "2024-03-12T13:00:00.000Z"
  }
}
```

**Errors**:

- `401 Unauthorized`: "Unauthorized" or "Token expired or invalid"
- `404 Not Found`: "Visit not found."
- `500 Internal Server Error`: "Internal server error"

#### `PUT /api/visit/update_visit/:id`

Updates an existing visit for the current authenticated user. Requires authentication.
**Request**: (Path param: `id`), (Body: any combination of `visitDate`, `visitTime`, `duration`, `hospitalName`, `doctorName`, `notes`)

```json
{
  "duration": 90,
  "notes": "Follow-up checkup and ultrasound",
  "visitTime": "15:00"
}
```

**Response**:

```json
{
  "message": "Visit updated successfully 💛",
  "visit": {
    "_id": "65f0e3e3b3c3d3e3f3a3b3ca",
    "userId": "65f0e3e3b3c3d3e3f3a3b3c3",
    "doctorName": "Dr. Adebola",
    "reminderDateTime": "2024-03-15T15:00:00.000Z",
    "duration": 90,
    "hospitalName": "City Maternity Hospital",
    "notes": "Follow-up checkup and ultrasound",
    "sent": false,
    "createdAt": "2024-03-12T13:00:00.000Z",
    "updatedAt": "2024-03-12T13:15:00.000Z"
  }
}
```

**Errors**:

- `401 Unauthorized`: "Unauthorized" or "Token expired or invalid"
- `404 Not Found`: "Visit not found."
- `500 Internal Server Error`: "Invalid visitDate or visitTime provided." or "Internal server error"

#### `DELETE /api/visit/delete_visit/:id`

Deletes a specific visit by its ID for the current authenticated user. Requires authentication.
**Request**: (Path param: `id`)
**Response**:

```json
{
  "message": "Visit deleted successfully 💛"
}
```

**Errors**:

- `401 Unauthorized`: "Unauthorized" or "Token expired or invalid"
- `404 Not Found`: "No visit scheduled."
- `500 Internal Server Error`: "Internal server error"

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

## Badges

[![Backend: Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Frontend: React Native](https://img.shields.io/badge/Frontend-React_Native-61DAFB?style=flat&logo=react&logoColor=white)](https://reactnative.dev/)
[![Database: MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![AI: Groq](https://img.shields.io/badge/AI-Groq-000000?style=flat&logo=groq&logoColor=white)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](Backend-Ayomama/LICENSE)
