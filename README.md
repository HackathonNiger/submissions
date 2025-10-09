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

*Add screenshots of your app here (Mobile and Web views).*  

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