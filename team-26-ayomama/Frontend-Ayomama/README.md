# Ayomama: Your Trusted Companion Through Motherhood 🤰

Ayomama is a comprehensive mobile health application designed to support pregnant mothers and healthcare workers throughout the maternal and child health journey. Leveraging modern mobile development practices and intelligent features, Ayomama provides personalized guidance, community support, and efficient patient management tools, aiming to enhance care accessibility and maternal well-being.

## Installation

To get the Ayomama app running on your local machine, follow these steps:

### ⚙️ Prerequisites

Ensure you have Node.js (with npm or Yarn), Expo CLI, and Git installed on your system.

### ⬇️ Clone the Repository

First, clone the project repository from GitHub:

```bash
git clone https://github.com/Ayomama-Health-Project/Frontend-Ayomama.git
cd Frontend-Ayomama
```

### 📦 Install Dependencies

Install the necessary project dependencies using npm:

```bash
npm install
# Or if you prefer Yarn:
# yarn install
```

### 🔑 Environment Variables

Create a `.env` file in the root directory of the project and add the following required environment variables:

- `EXPO_PUBLIC_API_BASE_URL`: The base URL for the backend API.
- `EXPO_PUBLIC_TRANSLATOR_API_KEY`: API key for the Microsoft Translator service.
- `EXPO_PUBLIC_TRANSLATOR_REGION`: Region for the Microsoft Translator service.
- `EXPO_PUBLIC_TRANSLATOR_ENDPOINT`: Endpoint URL for the Microsoft Translator service.

**Example .env:**

```
EXPO_PUBLIC_API_BASE_URL="http://localhost:3000"
EXPO_PUBLIC_TRANSLATOR_API_KEY="your_microsoft_translator_key"
EXPO_PUBLIC_TRANSLATOR_REGION="your_microsoft_translator_region"
EXPO_PUBLIC_TRANSLATOR_ENDPOINT="https://api.cognitive.microsofttranslator.com"
```

## Usage

After installing the dependencies, you can run the application on various platforms using Expo.

### ▶️ Starting the Development Server

To start the Expo development server, run:

```bash
npm start
# Or with Yarn:
# yarn start
```

This will open a new tab in your browser with the Expo Dev Tools. From there, you can:

- **Run on Android device/emulator**: Scan the QR code with the Expo Go app or click "Run on Android device/emulator".
- **Run on iOS simulator**: Click "Run on iOS simulator" (requires Xcode installed).
- **Run in web browser**: Click "Run in web browser".

### 🚶 User Flows

The Ayomama application supports two distinct user roles: **Mothers** and **Healthcare Workers**.

#### Mother User Flow:

1.  **Onboarding**: New users are guided through an interactive onboarding carousel introducing the app's benefits.
2.  **Account Selection**: Choose "Mother" to register or log in.
3.  **Authentication**: Sign up with Full Name, Email, and Password, or log in if you already have an account.
4.  **Information Setup**:
    - **Language Preference**: Select your preferred language (English, Hausa, Yoruba, Igbo).
    - **Personal Information**: Enter your full name, home address, phone number, and last period date.
    - **Emergency Contacts**: Add at least one emergency contact with their name, phone number, and relationship.
    - **Antenatal Status**: Indicate if you've started antenatal care and provide initial vital data (blood pressure, temperature, weight, blood level, date) if applicable.
    - **Notification Preferences**: Turn on daily routine notifications.
5.  **Main Dashboard**: Access your personalized dashboard with:
    - **Daily Checklist**: Track iron supplements, water intake, walks, and clinic visits.
    - **Baby Development**: See weekly baby size comparisons, milestones, and health tips.
    - **Vitals Overview**: Monitor your blood pressure, weight, temperature, and blood level, with an option to update vitals.
    - **Upcoming Visits**: View your next antenatal check-up details and set reminders.
    - **Emergency Contacts**: Quick access to call emergency contacts.
    - **Wellness Activities**: Explore prenatal yoga, breathing exercises, meditation, and sleep stories.
    - **Nutrition Today**: Plan your meals with suggested breakfast, lunch, and dinner options.
6.  **Learn Section**:
    - **Smart AI Chat**: Engage with an AI assistant for pregnancy-related questions.
    - **Community**: Connect with other mothers, share experiences, and seek advice.
    - **Baby Development**: Deep dive into your baby's weekly development.
7.  **Emergency**: A dedicated section to quickly view nearby hospitals and send emergency alerts to contacts.
8.  **Profile**: Manage personal information, change language, security settings, and log out.

#### Healthcare Worker User Flow:

1.  **Onboarding**: New healthcare workers are guided through the initial setup.
2.  **Account Selection**: Choose "Healthcare Worker" to register or log in.
3.  **Authentication**: Sign up or log in with your Email and Password.
4.  **Health Information Setup**:
    - **Personal Information**: Provide your full name, state, Local Government Area (LGA), facility name, and facility code/ID.
5.  **Main Dashboard**:
    - **Overview Stats**: View statistics on mothers under care (Safe, Monitor, Urgent).
    - **Quick Actions**: Easily add new patients or log patient visits.
    - **Mothers Under Your Care**: List of patients with their status, next, and last visit dates.
    - **Risky Distribution**: Visual representation of the risk status of all registered mothers.
    - **Mothers Needing Attention**: Highlighted list of patients requiring immediate attention.
    - **Weekly Visit Progress**: Track visits completed and new registrations against targets.
6.  **Patient Management**:
    - **Add Patient**: Register new mothers by entering their name, pregnancy stage, visit details, antenatal visits, and phone number.
    - **Log Visit**: Record detailed visit information including patient name, pregnancy stage, date, medication, risk status, and medical history.
    - **Mother Info**: View a patient's comprehensive profile including vitals, medical history, and medication list.
7.  **Profile**: Manage profile information, change language, security settings, and log out.

## Features

- **Two-Factor User Authentication**: Separate secure authentication flows for Mothers and Healthcare Workers.
- **Personalized Onboarding**: Tailored setup experience based on user role and preferences.
- **Daily Checklist & Vitals Tracking**: Keep track of essential health activities and monitor key maternal vitals.
- **Baby Development Milestones**: Provides weekly insights into fetal growth, size comparisons, and development tips.
- **Smart AI Chat Assistant**: An intelligent chatbot powered by Groq AI to answer pregnancy-related questions and provide health advice.
- **Community Support Forum**: A platform for mothers to connect, share experiences, and receive peer support.
- **Emergency Services**: Quick access to nearby hospitals using location services and instant alerts to predefined emergency contacts.
- **Visit Scheduling & Reminders**: Schedule antenatal appointments, log visits, and receive timely notifications.
- **Multi-language Support**: Comprehensive translation services for a diverse user base, including English, Hausa, Yoruba, and Igbo.
- **Healthcare Worker Dashboard**: Dedicated interface for healthcare professionals to manage patients, log visits, and monitor their progress efficiently.
- **Profile Management**: Update personal details, manage language preferences, and configure security settings.
- **Wellness Activities**: Curated content for prenatal yoga, breathing exercises, meditation, and sleep stories to promote maternal well-being.
- **Nutrition Guidance**: Meal suggestions and nutritional information for different times of the day.

## Technologies Used

| Category           | Technology                                  | Description                                                       | Link                                                                                                                                                                   |
| :----------------- | :------------------------------------------ | :---------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**       | React Native                                | JavaScript framework for building native mobile apps.             | [reactnative.dev](https://reactnative.dev/)                                                                                                                            |
|                    | Expo                                        | A framework and platform for universal React applications.        | [expo.dev](https://expo.dev/)                                                                                                                                          |
|                    | TypeScript                                  | Strongly typed superset of JavaScript.                            | [typescriptlang.org](https://www.typescriptlang.org/)                                                                                                                  |
|                    | Nativewind                                  | Tailwind CSS for React Native.                                    | [nativewind.dev](https://www.nativewind.dev/)                                                                                                                          |
| **State Mgmt.**    | Zustand                                     | A small, fast, and scalable bear-bones state-management solution. | [github.com/pmndrs/zustand](https://github.com/pmndrs/zustand)                                                                                                         |
| **Networking**     | Axios                                       | Promise-based HTTP client for the browser and Node.js.            | [axios-http.com](https://axios-http.com/)                                                                                                                              |
| **AI Integration** | Microsoft Translator API                    | For multi-language support.                                       | [azure.microsoft.com/en-us/products/ai-services/cognitive-services/translator/](https://azure.microsoft.com/en-us/products/ai-services/cognitive-services/translator/) |
|                    | Groq AI (via backend)                       | Powering the intelligent chat assistant.                          | [groq.com](https://groq.com/)                                                                                                                                          |
| **UI Components**  | `@gluestack-ui/themed`                      | Universal UI components for React Native.                         | [gluestack.io](https://gluestack.io/)                                                                                                                                  |
|                    | `@react-native-async-storage/async-storage` | Asynchronous, persistent, key-value storage system.               | [react-native-async-storage.github.io/async-storage/](https://react-native-async-storage.github.io/async-storage/)                                                     |
| **Navigation**     | Expo Router                                 | File-system based router for universal React applications.        | [expo.dev/router](https://expo.dev/router)                                                                                                                             |
| **Date/Time**      | `@react-native-community/datetimepicker`    | Date and Time picker for React Native.                            | [github.com/react-native-datetimepicker/datetimepicker](https://github.com/react-native-datetimepicker/datetimepicker)                                                 |
| **Other**          | `react-native-toast-message`                | Highly customizable Toast messages for React Native.              | [github.com/calintamas/react-native-toast-message](https://github.com/calintamas/react-native-toast-message)                                                           |

## Contributing

We welcome contributions to Ayomama! To contribute, please follow these guidelines:

✨ **Fork the Repository**: Start by forking the project repository to your GitHub account.

🌿 **Create a New Branch**:

```bash
git checkout -b feature/your-feature-name
```

🚀 **Make Your Changes**: Implement your features or bug fixes. Ensure your code adheres to the project's coding standards.

📝 **Commit Your Changes**:

```bash
git commit -m "feat: Add new feature"
# or
git commit -m "fix: Resolve bug in X"
```

⬆️ **Push to Your Fork**:

```bash
git push origin feature/your-feature-name
```

📬 **Open a Pull Request**: Submit a pull request to the `main` branch of the original repository, clearly describing your changes and their benefits.

## License

This project is licensed under the [MIT License](LICENSE).

## Author Info

**Ayomama Health Project Team**

Feel free to connect with the team behind this project:

- **Twitter**: [Ayomama Twitter](https://x.com/Ayomama_ng)
- **Instagram**: [Ayomama Instagram](https://www.instagram.com/ayomama_ng/)
- **YouTube**: [Ayomama YouTube](https://www.youtube.com/@Ayomamahealth)

---

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
