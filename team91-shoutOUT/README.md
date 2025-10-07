# ShoutOUT

## A Community Safety, Crime and Emergency Reporting App

## 🚨 Project Overview

This is a modern mobile application built with Flutter designed to enhance community safety by connecting citizens and security personnel. It features a robust authentication system using **Firebase Authentication** and **Firestore** to distinguish between user roles (Citizen and Security) and provides a reliable platform for reporting incidents, including an **offline reporting capability**.

The application uses the **Provider** package for state management and adheres to a clean, scalable project structure.

## ✨ Key Features

* **Role-Based Authentication:** Secure user login and registration for two distinct roles:
    * **Citizen:** For general public reporting.
    * **Security Personnel:** For agency or department members (requires additional fields like Badge Number and Agency).
* **Firebase Integration:** Full backend powered by Google's Firebase suite:
    * **Firebase Auth:** Handles user sign-up, login, and password reset.
    * **Firestore:** Stores detailed user profiles and manages crime report data.
* **Authentication Wrapper (`AuthWrapper`):** Automatically directs users to the correct home screen (`/citizen-home` or `/security-home`) upon login or app launch, ensuring seamless role management.
* **Offline Reporting (Mock/Placeholder):** Includes a dedicated screen for citizens to log basic crime reports without an internet connection, preparing for later implementation of local data storage (e.g., using `sqflite` or `hive`).
* **Password Management:** Dedicated "Forgot Password" screen with Firebase password reset functionality.

## 🛠 Tech Stack

| Technology          | Purpose                                              |
|:--------------------|:-----------------------------------------------------|
| **Flutter / Dart**  | Cross-platform mobile development framework          |
| **Firebase Auth**   | User authentication and identity management          |
| **Cloud Firestore** | NoSQL database for structured data and user profiles |
| **Provider**        | Simple, scalable state management for the entire app |
| **Hive**            | NoSQL datababse for storing offline                  |

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

* Flutter SDK (version 3.x or higher recommended)
* Dart SDK
* A code editor (VS Code or Android Studio)
* A Firebase account and a new Firebase Project

### 1. Flutter Setup

1.  Clone the repository:
    ```bash
    git clone [repository-url]
    cd [project-folder]
    ```
2.  Get the required Dart packages:
    ```bash
    flutter pub get
    ```

### 2. Firebase Project Configuration

This step is crucial for the app to connect to the backend services.

1.  **Create Project:** Create a new project in the [Firebase Console].
2.  **Enable Services:**
    * Go to **Authentication** and enable the **Email/Password** sign-in method.
    * Go to **Firestore Database** and create a new database (start in test mode for quick setup).
3.  **Add Configuration Files:**

    * **Android:** Register an Android app in Firebase (using your app's package name, e.g., `com.example.community_app`). Download the `google-services.json` file and place it in the `android/app/` directory.
    * **iOS:** Register an iOS app. Download the `GoogleService-Info.plist` file and open your Flutter project in Xcode. Drag the file into the `Runner` directory in the project navigator.

### 3. Firestore Schema Initialization

The app requires a `users` collection in Firestore to store role-specific data.

You must manually create an index on the `users` collection, or ensure the app's rules allow read access to the collection. The `AuthService` will handle creating the user documents upon registration.

## 🏃 Running the App

1.  Ensure an emulator or physical device is connected.
2.  Run the application:
    ```bash
    flutter run
    ```

## Demo

To test the app in action, click here: https://appetize.io/app/b_7k7kpll5isvya2ox5of2kg5v6y

## 📂 Code Architecture

The project follows a modular structure leveraging the Provider package:

| Directory | Content | Description |
| :--- | :--- | :--- |
| `lib/main.dart` | Root App Widget, Providers, and `AuthWrapper` | Initializes the app and manages the top-level routing based on the user's authentication status. |
| `lib/services/` | `AuthService` | Contains all business logic for Firebase Authentication, Firestore profile fetching, and role identification. |
| `lib/models/` | `User`, `CrimeReport` | Data models used throughout the application. |
| `lib/screens/auth/` | `LoginScreen`, `RegisterScreen`, `ForgotPasswordScreen` | Handles user input and delegates authentication tasks to `AuthService`. |
| `lib/screens/citizen/` | `CitizenHome`, `OfflineReportScreen` | User interface for the Citizen role. |
| `lib/screens/security/` | `SecurityHome` | User interface for the Security Personnel role. |

## 🤝 Contribution

Feel free to open issues or submit pull requests. Any contributions are welcome!

## 📄 License

This project is licensed under the MIT License.