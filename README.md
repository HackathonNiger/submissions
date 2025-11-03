# AjoSave - Digital Community Saving Platform

A modern fintech application that facilitates digital community savings (Ajo/Esusu) through group contributions with secure payments via Paystack.

---

## Quick Setup

### Prerequisites
- Node.js v16+
- MongoDB Atlas account
- Paystack account (test keys)

### Installation

**1. Clone Repository**
```bash
git clone <repository-url>
cd ajosave
```

**2. Backend Setup**
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
# MongoDB
MONGO_URI=mongodb+srv://ajosave:ajosavedb1234@ajosave.ks7dc.mongodb.net/ajosave-db?retryWrites=true&w=majority&appName=ajosave

# JWT
JWT_SECRET=ajosave_super_secret_jwt_key_2024_production

# Server
PORT=5000
NODE_ENV=development

# Paystack
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
```

Run migrations:
```bash
node src/database/migrations/001_initialize_collections.js
```

Start backend:
```bash
npm run dev
```
Backend runs on: `http://localhost:5000`

**3. Frontend Setup**
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
```

Update `frontend/index.html` - add to `<head>`:
```html
<script src="https://js.paystack.co/v1/inline.js"></script>
```

Start frontend:
```bash
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## Testing Guide

### Setup Paystack Test Keys

1. Sign up at https://paystack.com
2. Go to Settings → API Keys & Webhooks
3. Copy Test Public Key (`pk_test_...`) to frontend `.env`
4. Copy Test Secret Key (`sk_test_...`) to backend `.env`
5. Restart both servers

### Test Cards
```
✅ Success: 4084 0840 8408 4081 | CVV: 408 | PIN: 1234
❌ Decline: 5060 6666 6666 6666 | CVV: 123 | PIN: 1234
```

---

## Feature Testing

### 1. User Registration & Authentication
**Test:** Create account and login

**Steps:**
1. Navigate to `http://localhost:5173`
2. Click "Get Started"
3. Switch to "Sign Up" tab
4. Fill form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Phone: +2348012345678
   - BVN: 12345678901 (11 digits)
   - NIN: 12345678901 (11 digits)
   - DOB: 01/01/2000
   - Password: Test123!
5. Click "Create Account"

**Expected:**
- ✅ User created in MongoDB `users` collection
- ✅ Wallet auto-created in `wallets` collection
- ✅ Redirects to dashboard
- ✅ Shows user name in header

**Verify in MongoDB:**
```javascript
db.users.findOne({ email: "test@example.com" })
db.wallets.findOne({ userId: ObjectId("user_id_here") })
```

---

### 2. Create Savings Group
**Test:** Create a new group

**Steps:**
1. From dashboard, click "Create Group"
2. **Step 1:**
   - Name: "Test Savings Group"
   - Description: "Monthly savings"
   - Members: 5
   - Duration: 3 months
3. **Step 2:**
   - Amount: 1000
   - Frequency: Monthly
   - Payout: Random
4. **Step 3:** Skip emails
5. Click "Create Group"

**Expected:**
- ✅ Success screen with 6-character invitation code
- ✅ Group created in MongoDB `groups` collection
- ✅ You're admin with "Admin" badge
- ✅ Status: "pending"

**Verify in MongoDB:**
```javascript
db.groups.findOne({ name: "Test Savings Group" })
// Check: invitationCode, admin, members array, membersList
```

---

### 3. Join Group
**Test:** Second user joins group

**Steps:**
1. Logout (click Logout button)
2. Register new user (user2@example.com)
3. Navigate to Groups → "Join Group"
4. Enter invitation code from Step 2
5. Click "Find Group"
6. Review details
7. Click "Join Group"

**Expected:**
- ✅ Group details display correctly
- ✅ Shows current member count
- ✅ Success message appears
- ✅ Redirects to group detail page

**Verify in MongoDB:**
```javascript
db.groups.findOne({ invitationCode: "ABC123" })
// Check: members array has 2 IDs, membersList has 2 objects
```

---

### 4. Add Bank Account
**Test:** Add bank account for receiving payouts

**Steps:**
1. Login as any user
2. Go to Groups → Click your group
3. Click "Add Bank Account" button
4. Select Bank: "Guaranty Trust Bank"
5. Account Number: 0123456789
6. Click "Verify"
7. Verify account name appears
8. Click "Save Account"

**Expected:**
- ✅ Account verified with Paystack
- ✅ Account name displays
- ✅ Success message
- ✅ Saved in MongoDB

**Verify in MongoDB:**
```javascript
db.wallets.findOne({ userId: ObjectId("user_id") })
// Check: linkedBankAccounts array has entry with recipientCode
```

---

### 5. Make Contribution
**Test:** Member contributes to group pool

**Steps:**
1. Login as group member
2. Navigate to Payment page
3. Select your group
4. Review payment details (₦1,000)
5. Click "Pay ₦1,000"
6. Paystack popup opens
7. Enter test card: 4084 0840 8408 4081
8. CVV: 408, Expiry: 12/25, PIN: 1234
9. Complete payment

**Expected:**
- ✅ Payment succeeds
- ✅ Success screen with transaction ID
- ✅ Transaction created in MongoDB
- ✅ Wallet `totalContributions` increases by ₦1,000
- ✅ Group `totalPool` increases by ₦1,000
- ✅ Member `contributionsMade` increments by 1

**Verify in MongoDB:**
```javascript
// Check transaction
db.transactions.findOne({ type: "contribution" })

// Check wallet updated
db.wallets.findOne({ userId: ObjectId("user_id") })
// totalContributions should be 1000

// Check group pool
db.groups.findOne({ _id: ObjectId("group_id") })
// totalPool should be 1000
// membersList[0].contributionsMade should be 1
```

---

### 6. Multiple Contributions
**Test:** All members contribute to fill pool

**Steps:**
1. Login as User 1 → Make contribution → ₦1,000
2. Login as User 2 → Make contribution → ₦1,000
3. Add User 3, 4, 5 (repeat join + contribute)

**Expected:**
- ✅ 5 transactions created
- ✅ Group `totalPool` = ₦5,000
- ✅ Each member `contributionsMade` = 1
- ✅ Group status ready for payout

**Verify in MongoDB:**
```javascript
// Check all contributions
db.transactions.find({ groupId: ObjectId("group_id"), type: "contribution" }).count()
// Should return 5

// Check group pool
db.groups.findOne({ _id: ObjectId("group_id") })
// totalPool: 5000
```

---

### 7. Process Payout (Admin)
**Test:** Admin processes payout to first member

**Prerequisites:**
- Group has ₦5,000 in pool
- First member has bank account added
- You are logged in as admin

**Steps:**
1. Login as group admin
2. Navigate to Groups → Click your group
3. Verify "Process Payout" button visible
4. Click "Process Payout (₦5,000)"
5. Confirm payout to first member
6. Wait for processing (~5 seconds)

**Expected:**
- ✅ Paystack transfer initiated
- ✅ Success alert with transfer reference
- ✅ Payout transaction created (type: "payout")
- ✅ Recipient wallet balance increases by ₦5,000
- ✅ Group `totalPool` resets to 0
- ✅ Current member status → "completed"
- ✅ Next member status → "current"
- ✅ `currentTurn` increments from 0 to 1
- ✅ Turn tracker updates visually

**Verify in MongoDB:**
```javascript
// Check payout transaction
db.transactions.findOne({ type: "payout" })
// Should have: userId (recipient), amount: 5000, status: "completed"

// Check recipient wallet
db.wallets.findOne({ userId: ObjectId("recipient_id") })
// totalPayouts: 5000, availableBalance: 5000

// Check group rotation
db.groups.findOne({ _id: ObjectId("group_id") })
// totalPool: 0
// currentTurn: 1 (was 0)
// membersList[0].status: "completed"
// membersList[1].status: "current"
```

---

### 8. Full Cycle Test
**Test:** Complete entire group lifecycle

**Steps:**
1. Create group with 3 members
2. All 3 members contribute ₦1,000 each
3. Admin processes payout #1 → Member A receives ₦3,000
4. All 3 members contribute again
5. Admin processes payout #2 → Member B receives ₦3,000
6. All 3 members contribute again
7. Admin processes payout #3 → Member C receives ₦3,000

**Expected After Final Payout:**
- ✅ All members status = "completed"
- ✅ Group status = "completed"
- ✅ `currentTurn` = 3 (equals maxMembers)
- ✅ 9 contribution transactions (3 rounds × 3 members)
- ✅ 3 payout transactions
- ✅ Each member contributed ₦3,000 total
- ✅ Each member received ₦3,000 payout
- ✅ Net: Everyone breaks even (classic Ajo model)

---

## Database Collections

### Active Collections:
- ✅ `users` - User accounts
- ✅ `wallets` - Wallet balances
- ✅ `groups` - Savings groups
- ✅ `transactions` - Contributions & payouts

### Quick Checks:
```javascript
// Count documents
db.users.countDocuments()
db.wallets.countDocuments()
db.groups.countDocuments()
db.transactions.countDocuments()

// View latest of each
db.users.findOne({}, {sort: {createdAt: -1}})
db.wallets.findOne({}, {sort: {createdAt: -1}})
db.groups.findOne({}, {sort: {createdAt: -1}})
db.transactions.findOne({}, {sort: {createdAt: -1}})
```

---

## Troubleshooting

### Backend won't start
```bash
# Check MongoDB connection
mongosh "mongodb+srv://ajosave:ajosavedb1234@ajosave.ks7dc.mongodb.net/"

# Check port 5000 not in use
lsof -i :5000
kill -9 <PID>
```

### Frontend won't connect
- Verify backend running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend

### Paystack popup won't open
```bash
# In browser console:
console.log(typeof PaystackPop)
# Should output: "object"
```
- Verify script tag in `index.html`
- Check `VITE_PAYSTACK_PUBLIC_KEY` in `.env`
- Restart frontend

### Payment succeeds but no transaction
- Check backend console for errors
- Verify Paystack secret key correct
- Check MongoDB connection
- View Network tab: POST `/api/transactions/contribution`

### Payout fails
Common causes:
- Recipient has no bank account → Add one first
- Invalid Paystack secret key
- Group pool is empty
- User is not admin

---

## API Endpoints

### Auth
- POST `/api/auth/register` - Create account
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user
- POST `/api/auth/logout` - Logout

### Groups
- POST `/api/groups` - Create group
- GET `/api/groups` - Get user's groups
- GET `/api/groups/:id` - Get group details
- GET `/api/groups/find/:code` - Find by invitation code
- POST `/api/groups/:id/join` - Join group
- POST `/api/groups/:id/process-payout` - Process payout (admin)

### Wallets
- GET `/api/wallets/me` - Get wallet
- POST `/api/wallets/verify-account` - Verify bank account
- POST `/api/wallets/add-bank-account` - Add bank account
- GET `/api/wallets/bank-accounts` - Get linked accounts

### Transactions
- GET `/api/transactions` - Get transactions
- POST `/api/transactions/contribution` - Create contribution
- GET `/api/transactions/:id` - Get transaction details

---

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router
**Backend:** Node.js, Express, MongoDB, Mongoose
**Payment:** Paystack
**Database:** MongoDB Atlas

---

## Project Structure
```
ajosave/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth, validation
│   │   └── database/        # Migrations
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── context/         # React context
│   └── .env
└── README.md
```

---

## Support

For issues:
1. Check backend console for errors
2. Check MongoDB connection
3. Verify environment variables
4. Check browser Network tab
5. View MongoDB collections directly

---

**Version:** 1.0.0  
**Last Updated:** 2025
````markdown
# 🚀 Codefest GWR Hackathon – Submissions Portal

Welcome to the official submission repo for the **Codefest GWR Hackathon**  
Theme: _Build for Nigeria_ 🇳🇬

---

# 🍼 PregAssist (React Native CLI)

PregAssist is a **React Native CLI mobile application** built to support pregnant mothers with features like pregnancy tracking, appointment scheduling, health reminders, and clinic connections.  
It is powered by **Firebase** and supports **offline data sync** using Firestore persistence.

---

## 📖 Project Overview

PregAssist helps expectant mothers manage their pregnancy with ease.  
It tracks their expected delivery date (EDD), connects them with doctors, and provides personalized health information and reminders.

### ✨ Core Features

- 👩‍🍼 **Mother Registration:** Capture mother’s details and Expected Delivery Date (EDD)
- 🗓️ **Pregnancy Tracker:** Automatically calculates weeks and days remaining
- 🧑‍⚕️ **Doctor Dashboard:** Displays assigned doctor and quick access to contact
- 🕒 **Appointments:** Create and view appointments with reminders
- 🔔 **Reminders:** Notify mothers for medications or checkups
- 📍 **Nearby Clinics:** Integrates geolocation for available clinics
- 🌐 **Multi-language Support (i18n):** Switch between multiple languages
- 🛜 **Offline Mode:** Firestore automatically syncs data when online again

---

## 🛠️ Tech Stack

| Technology                              | Purpose                 |
| --------------------------------------- | ----------------------- |
| **React Native CLI**                    | App development         |
| **Firebase (Auth, Firestore, Storage)** | Backend services        |
| **React Navigation**                    | Screen routing          |
| **AsyncStorage**                        | Local data persistence  |
| **React Native Vector Icons**           | Icons                   |
| **Geolocation API**                     | Location-based features |
| **Moment.js / Date-fns**                | Date calculations       |

---

## ⚙️ Installation & Setup

### 1️⃣ Prerequisites

Before starting, make sure you have installed:

- [Node.js](https://nodejs.org/)
- [Java JDK 11+](https://adoptium.net/)
- [Android Studio](https://developer.android.com/studio)
- React Native CLI:
  ```bash
  npm install -g react-native-cli
  ```
````

---

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/Bezliab/Team-04---CareNest.git
cd CareNest
```

---

### 3️⃣ Install Dependencies

```bash
npm install
# or
yarn install
```

---

### 4️⃣ Firebase Configuration

Go to [Firebase Console](https://console.firebase.google.com) → Create a project.
Enable:

- Authentication
- Firestore Database
- Storage

---

### 5️⃣ Android Setup

- Make sure you have an Android emulator installed, or connect a physical device.
- Then run:

```bash
npm install react-native-worklet
npm install @react-native-firebase/auth
npm install @react-native-firebase/storage
npm install @react-native-firebase/database
npx react-native run-android
```

If you get build errors:

```bash
cd android && ./gradlew clean
cd ..
npx react-native run-android
```

---

### 6️⃣ iOS Setup (macOS Only)

If you’re developing on macOS:

```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

---

## 🧮 Pregnancy Tracking Logic

When a mother registers, she provides an **Expected Delivery Date (EDD)**.
The app automatically calculates:

- The **current pregnancy week**
- **Days remaining** to delivery
- The **trimester** (1st, 2nd, or 3rd)

This data is displayed dynamically on the **Dashboard** and updates daily.

---

## 🔥 Firestore Collections

| Collection         | Example Fields                                              |
| ------------------ | ----------------------------------------------------------- |
| **users**          | name, email, expectedDeliveryDate, doctor, emergencyContact |
| **appointments**   | userId, doctorId, date, notes, status                       |
| **reminders**      | userId, message, scheduledAt                                |
| **health_records** | userId, bloodPressure, weight, heartRate                    |
| **emergencies**    | userId, location, status                                    |

---

## 🧩 Key Files

| File                     | Description                              |
| ------------------------ | ---------------------------------------- |
| `firebaseService_rnf.js` | Handles Firestore read/write and caching |
| `Dashboard.js`           | Displays live pregnancy progress         |
| `SignupScreen.js`        | Registers new mothers and saves EDD      |
| `DashboardStyle.js`      | Contains dashboard layout and colors     |

---

## 🔄 Offline Mode

Firestore automatically caches user data locally.
This means users can continue using the app without an internet connection.
Once reconnected, updates sync automatically to Firebase.

---

## 🧪 Testing Checklist

✅ Create a new account using Firebase Authentication
✅ Enter EDD and verify correct pregnancy progress
✅ Add reminders and appointments
✅ Simulate offline use (disable internet, re-enable to test sync)
✅ Confirm Firestore data under the correct user document

---

## ⚠️ Common Issues

| Issue                                                | Solution                                       |
| ---------------------------------------------------- | ---------------------------------------------- |
| `FirebaseError: Missing or insufficient permissions` | Update Firestore security rules                |
| `Task :app:mergeDexDebug FAILED`                     | Run `cd android && ./gradlew clean`            |
| `Emulator not found`                                 | Launch AVD manually in Android Studio          |
| `Network Error` when offline                         | Ensure `enableIndexedDbPersistence` is enabled |

---

## Video link

Youtube link - https://youtu.be/EVcFub7n-Tc?feature=shared

---

## 👨‍💻 Author

**PregAssist Development Team**
Built with ❤️ by **Isaac Adeniji & Team**

📧 Contact: [[boluwarin215@gmail.com](mailto:boluwarin215@gmail.com)]

> _“Empowering mothers with care, knowledge, and technology.”_
> _“Saving one mother at a time, that's the goal.”_
# Aharrie-Strategy
Team 24 - Aharrie Strategy
‎Drug Verification System, Fighting counterfeit drugs, one scan at a time.

# Aharrie-Strategy

**Drug Verification System – Fighting counterfeit drugs, one scan at a time.**

---

## Table of Contents

1. [Overview](#overview)  
2. [Features](#features)  
3. [Screenshots](#screenshots)  
4. [Installation](#installation)  
5. [Usage](#usage)  
6. [Technology Stack](#technology-stack)  
7. [How It Works](#how-it-works)  
8. [Contributing](#contributing)  
9. [License](#license)  
10. [Contact](#contact)  

---

## Overview

**Aharrie-Strategy** is a mobile-first drug verification system designed to combat counterfeit medications. By scanning QR codes on drug packages, users can instantly check product authenticity against a trusted database and view important details such as manufacturer, batch number, and expiration date.  

---

## Features

- ✅ Scan drug QR codes using your device camera  
- ✅ Upload QR code images (Web) for verification  
- ✅ Check product details including active ingredients, dosage, and manufacturer  
- ✅ Track previously scanned drugs (scan history)  
- ✅ Visual feedback for genuine vs. fake or unverified products  
- ✅ Scanning tips for accurate and efficient verification  

---

## Screenshots

*Screenshots of your app here (Mobile and Web views).*  
https://like-viral-18836929.figma.site
- **Home / Scan Dashboard**  
- **Scanning Screen**  
- **Scan Result Screen**  
- **History of Scanned Drugs**  

---

## Installation

### Prerequisites

- Node.js >= 14.x  
- Expo CLI (`npm install -g expo-cli`)  
- Android/iOS device or simulator  

### Steps

1. Clone the repository:  
   ```bash
   git clone https://github.com/yourusername/Aharrie-Strategy.git
   cd Aharrie-Strategy

### Install dependencies:

- npm install

### Run the app:

- npx expo start,

### usage


- Launch the app and log in as a user.

- Tap SCAN NOW to start scanning QR codes on drug packages.

- Align the QR code within the scanning frame.

- View verification results instantly.

- Access your scanned history to review previous scans.

- Follow scanning tips at the bottom of the screen for best results.

### Technology Stack

- Frontend: React Native, Expo

- Web Support: React for Web (via Expo Web)

- Camera & QR Scanning: expo-camera, - react-qr-reader

- Storage: AsyncStorage (for scan history)

- Icons & UI: @expo/vector-icons

- Styling: React Native StyleSheet


## How It Works

1. Users scan a QR code on a drug package.

2. The app verifies the QR code against mockData.json (or your backend in production).

3. Displays detailed product information including:

   - Product Name

   - Manufacturer

   - Active Ingredient

   - Dosage Form

   - Batch Number

   - Production & Expiry Dates

   - Verification Status (Genuine / Expired / Fake)

4. Stores scan results locally for quick access to history.
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

- 🎤 **Voice Input**: Record audio and convert to text for translation using OpenAI Whisper
- 🔊 **Advanced TTS**: Multiple TTS engines including Coqui TTS and Google TTS
- 🌐 **Multi-language Support**: Supports Hausa, Yoruba, Igbo, Edo/Bini languages
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔌 **API Integration**: RESTful API for developers to integrate translation services
- 🎨 **Modern UI**: Clean, intuitive interface built with shadcn/ui components
- 📹 **Multimedia Processing**: Extract training data from videos, music, and documents
- 📊 **Advanced Data Processing**: Sophisticated CSV/Excel parsing for training data
- 🤖 **Auto-Learning**: Automatic model improvement from user feedback and corrections
- 🔄 **Real Model Training**: Actual fine-tuning instead of simulation

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
- **Docker Desktop** (4.40.0 or higher) - **Recommended**
- **Node.js** (v18 or higher) - For local development
- **Python** (v3.10 or higher) - For local development
- **Git**

## 🐳 **Docker Setup (Recommended)**

### 1. Clone the Repository

```bash
git clone https://github.com/Ip-Tec/uwe-talk.git
cd uwe-talk
```

### 2. Quick Start with Docker

```bash
# Make the management script executable (Linux/macOS)
chmod +x docker-manage.sh

# Start all services
./docker-manage.sh start

# Or use docker-compose directly
docker-compose up --build -d
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### 4. Docker Management Commands

```bash
# View service status
./docker-manage.sh status

# View logs
./docker-manage.sh logs
./docker-manage.sh logs backend  # Backend only
./docker-manage.sh logs frontend # Frontend only

# Restart services
./docker-manage.sh restart

# Stop services
./docker-manage.sh stop

# Clean up (removes all containers and images)
./docker-manage.sh clean
```

## 💻 **Local Development Setup**

### 1. Backend Setup

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
cp env.example .env
# Edit .env with your configuration

# Run the backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup

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

### 3. Access the Application (Local)

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

The backend provides a comprehensive RESTful API with the following endpoints:

### Core Translation
- `POST /translate/` - Translate text between languages
- `POST /stt/` - Speech-to-text conversion
- `POST /tts/` - Text-to-speech generation
- `POST /pipeline/` - Complete audio-to-audio pipeline

### Language Support
- `GET /languages/` - Get supported languages
- `POST /detect-language/` - Detect language of input text

### TTS Engines
- `GET /tts/engines/` - Get available TTS engines and voices

### Multimedia Processing
- `POST /process-multimedia/` - Process videos, music, documents for training data

### Feedback & Learning
- `POST /feedback/translation/` - Submit translation feedback
- `POST /feedback/tts/` - Submit TTS feedback
- `POST /feedback/correction/` - Submit user corrections
- `GET /feedback/summary/` - Get feedback summary
- `POST /feedback/export-training-data/` - Export training data from feedback

### Model Training
- `POST /train/` - Train models with uploaded data
- `GET /feedback/should-retrain/` - Check if model should be retrained

### System
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
# Vault - Smart Savings Platform 🏦

## 🏆 Competition Submission

Welcome judges! This is **Vault**, a comprehensive smart savings platform designed to help users achieve their financial goals through intelligent tracking, community support, and personalized insights.

## 🚀 Live Demo Access

### Quick Start (For Judges):
1. **Start XAMPP**: Ensure Apache and MySQL are running
2. **Access Application**: Navigate to `http://localhost/Vault/welcome.php`
3. **Demo Credentials**: Use the registration flow to create an account
4. **Explore Features**: Complete the multi-step signup and explore the dashboard

### Default Access URLs:
- **Welcome Page**: `http://localhost/Vault/welcome.php`
- **Registration**: `http://localhost/Vault/sign.php`
- **Dashboard**: `http://localhost/Vault/dashboard.php` (after registration)

## 📋 Project Overview

### 🎯 Problem Statement
Many individuals struggle with consistent savings due to lack of motivation, poor tracking systems, and limited financial guidance. Vault addresses this by providing a comprehensive savings ecosystem.

### 💡 Our Solution
Vault combines gamification, community features, and AI-powered insights to make savings engaging, trackable, and achievable.

## ✨ Key Features Implemented

### 🎨 User Experience & Design
- **Multi-step Registration**: Beautiful 3-step signup process with progress tracking
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Smooth Animations**: CSS animations and transitions for engaging interactions
- **PWA Ready**: Can be installed as a mobile app

### 💰 Core Savings Features
- **Goal Setting**: Create personalized savings goals with target amounts and deadlines
- **Progress Tracking**: Visual progress bars with real-time updates
- **Quick Savings**: One-tap savings options (₦50, ₦100, ₦500, ₦1000)
- **Withdrawal System**: Secure fund withdrawal with reason tracking
- **Achievement System**: Badges and rewards for savings milestones

### 🤖 Smart Features
- **AI Savings Assistant**: Personalized notifications and motivational messages
- **Savings Analytics**: Streak tracking, monthly savings, and goal completion stats
- **Smart Recommendations**: AI-driven savings suggestions
- **Celebration System**: Confetti animations for achievements

### 👥 Social & Community
- **Friend System**: Connect with other savers (placeholder for expansion)
- **Progress Sharing**: Share achievements and milestones
- **Community Badges**: Earn recognition for savings consistency

## 🛠 Technical Implementation

### Frontend Technologies
- **HTML5**: Semantic markup and modern structure
- **CSS3**: Advanced animations, gradients, and responsive design
- **JavaScript**: Interactive features and dynamic content
- **Font Awesome**: Comprehensive icon library
- **Google Fonts**: Inter font family for modern typography

### Backend Technologies
- **PHP 7.4+**: Server-side processing and business logic
- **MySQL**: Relational database for data persistence
- **PDO**: Secure database interactions with prepared statements
- **Sessions**: User authentication and state management

### Database Schema
```sql
-- Users: Core user information and authentication
-- Savings Goals: User savings targets and progress
-- Transactions: Deposit and withdrawal history
-- Page Visits: Analytics and user engagement tracking
```

### Security Measures
- **HTTPS**: Secure data transmission
- **Password Hashing**: bcrypt for password storage
- **Input Validation**: Prevent SQL injection and XSS attacks
- **Error Handling**: Graceful error reporting and logging




