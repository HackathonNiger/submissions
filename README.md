<<<<<<< HEAD

## Problem: Offlince Mobile Payment for Rural Markets,
# Build s USSD base payment system that allow market traders to accept digital payment without internet access
# FinXchange 

FinXchange is a modern, professional financial application for managing services, transactions, and support, with a clean and intuitive user interface. This project serves as a comprehensive demonstration of a digital wallet with a wide array of features, built using a modern frontend stack.
Team Lead Umar Alhaji Husseini
AI deve
## ✨ Features

- **Onboarding:** Smooth and secure sign-up, sign-in, and PIN setup flow.
- **Dashboard:** At-a-glance view of your total balance, recent transactions, and quick access to core services.
- **Core Financial Services:**
    - **Add Money:** Fund your wallet via card or bank transfer.
    - **Transfers:** Send money to any Nigerian bank account with real-time account verification.
    - **Withdrawals:** Move funds from your wallet to your linked bank account.
- **Bill Payments:**
    - Airtime & Data top-ups for all major networks.
    - TV, Electricity, Internet, Water, and School Fees payments.
    - Betting account funding.
- **Advanced Finance Tools:**
    - **Virtual Cards:** Create, manage, freeze, and fund virtual debit cards.
    - **Savings:** Set up and track personal savings goals.
    - **Loans:** View credit score and apply for micro-loans.
    - **Group Savings:** Ajo/Esusu feature for collaborative saving.
- **AI-Powered Assistance:**
    - **Voice Payments:** Initiate transfers, airtime, and data purchases using your voice, powered by the Gemini Live API.
    - **AI Support:** Chat with "Finn," a Gemini-powered AI assistant, for instant help and answers to FAQs.
- **Security & Profile Management:**
    - KYC Tiers to manage and upgrade transaction limits.
    - Comprehensive security settings including PIN/password change and biometric login toggles.
    - View account information and login history.
- **Transaction Management:** Detailed transaction history with search, filtering, and the ability to download receipts as PNG or PDF.

## 🛠️ Tech Stack

- **UI Framework:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **AI/LLM:** Google Gemini API (`@google/genai`) for Chatbot, AI Support, and Voice Payments.
- **External APIs:** Paystack API for bank list fetching, account number resolution, and card payments, artine, data, bil and others.
- **Client-side Storage:** Local Storage for persisting user state, transactions, balance, and settings.
- **Build:** No bundler! The app runs directly in the browser using ES Modules and an `importmap`.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need a modern web browser and a local web server to handle requests correctly. We recommend using `serve`.

- [Node.js](https://nodejs.org/) (which includes npm)
- A Google Gemini API Key.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install a simple local server:**
    This project doesn't have a build step, so you just need a server to serve the static files. `serve` is a great, simple option.
    ```sh
    npm install -g serve
    ```

3.  **Set up your Gemini API Key:**
    The application code expects the Gemini API key to be available at `process.env.API_KEY`. Since there's no build process to inject environment variables, we'll simulate this.

    a. Create a new file named `env.js` in the root of your project directory.

    b. Add the following code to `env.js`, replacing `"YOUR_GEMINI_API_KEY"` with your actual key:
    ```javascript
    // env.js
    window.process = {
      env: {
        API_KEY: "YOUR_GEMINI_API_KEY"
      }
    };
    ```
    > **Security Note:** This method is for local development only. Never expose your API keys in the frontend of a production application.

4.  **Link the environment script:**
    Open `index.html` and add a script tag for your new `env.js` file. It **must** be placed *before* the main application script (`index.tsx`).

    ```html
    <!-- index.html -->
    <body class="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
        <div id="root"></div>
        
        <!-- Add this line -->
        <script src="/env.js"></script> 
        
        <script type="importmap">
        {
          "imports": { ... }
        }
        </script>
        <script type="module" src="/index.tsx"></script>
    </body>
    ```

5.  **Run the application:**
    From your project's root directory, run the local server:
    ```sh
    serve
    ```
    The command will output a local address (usually `http://localhost:3000`). Open this URL in your web browser to see the app running!

## 🔑 API Keys

- **Google Gemini API:**
  - The key is required for the AI Support, Chatbot, and Voice Payment features to work.
  - You can obtain a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
  - Add this key to the `env.js` file as instructed above.

- **Paystack API:**
  - The project uses Paystack's test keys for resolving bank account numbers and handling card payments.
  - These test keys are currently hardcoded in `src/services/bankApi.ts` and `src/services/squadApi.ts`.
  - In a real-world scenario, these should be moved to a secure backend and accessed via environment variables.

## 📝 Notes
this one is only for the demo and the fully function app is under construction
- **Persistence:** The application uses the browser's **Local Storage** to simulate a database. Your balance, transaction history, virtual cards, and KYC level will be saved in your browser. Clearing your browser's site data will reset the app to its initial state.
- **Permissions:** The Voice Payment feature requires microphone access. The app will prompt you for permission when you first use the feature.
- 


# 📱 USSD Code Installation (Africa's Talking Integration)

## 🏆 CodeFest Africa Hackathon Submission

This project demonstrates how to **install and configure a USSD code** using **Africa’s Talking API** to enable users to access services via mobile dial codes such as `*123#`.  
It focuses purely on **USSD setup and integration**, not full app features.

---

## ⚙️ Project Overview

USSD (Unstructured Supplementary Service Data) allows users to interact with applications through short dial codes — without needing internet access.  
This setup provides a simple backend endpoint to handle Africa’s Talking USSD requests and responses.

---

## 🧰 Requirements

Before installing, ensure you have:
- A **web server** (e.g. XAMPP, WAMP, or live host)
- **PHP 7.4+**
- **MySQL** (optional, for data storage)
- An **Africa’s Talking** account → [https://account.africastalking.com](https://account.africastalking.com)
- A **registered USSD code** on Africa’s Talking sandbox (or production)

---

## 🏗️ Installation Steps

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/ussd-installation.git
cd ussd-installation
2️⃣ Configure Africa’s Talking Sandbox
Go to Africa’s Talking Sandbox

Set your Callback URL to your local or hosted endpoint, for example:

arduino
Copy code
https://your-domain.com/ussd.php
Add your USSD code, e.g. *384*1234#

Save the configuration

3️⃣ Set Up Your Local Server
If you’re testing locally:

Start Apache on XAMPP or WAMP

Place your project inside htdocs/ (e.g. C:\xampp\htdocs\ussd-installation)

Access via:

arduino
Copy code
http://localhost/ussd-installation/ussd.php
```
STs data to your URL each time the user interacts

🧾 Environment Variables (optional)

You can store sensitive data in a .env file:
```
AT_API_KEY=your_api_key_here
AT_USERNAME=sandbox
```
```
##🧑‍💻 Team

-*Team Lead Name: Umar Alhaji Husseini    Fullstack Developer*
-*Yahaya Minkail    AI Engineer*
-*Yohanna Ishaku    Backend Developer*
-*Muhammad Sheriff  Mobile App Developer*

-Project: FinXchange
-Event: CodeFest Africa Hackathon 2025
-Email: umaraalhajihusseini@gmail.com
```
# FinXchange
=======
# 🚀 Codefest GWR Hackathon – Submissions Portal

Welcome to the official submission repo for the **Codefest GWR Hackathon**  
Theme: *Build for Nigeria* 🇳🇬  
Participants: 6,000+

---

## 📥 How to Submit Your Project

To submit your hackathon project:

### ✅ Step-by-Step:

1. **Fork** this repository  
2. Create a new folder using your **team name**  
   Folder format:  

submissions/team-yourteamname/

3. Inside your folder, add:
- `README.md` describing your project
- Your source code
- Optional screenshots or demo files

4. Commit your changes and **open a Pull Request** to this repo's `main` branch

---

## 🗂 Folder Format Example

submissions/team-phoenix/
├── README.md
├── src/
└── demo.gif


---

## ⏳ Deadline

📅 Final submission deadline: **Oct 7th**  
🛠 You may update your PR until the deadline.

---

## 📦 Need a Starter Template?

Use one of our ready-made starter kits to get up and running quickly:

- [React Starter](./starter-templates/react/)
- [Node.js Starter](./starter-templates/node/)
- [Python (Flask) Starter](./starter-templates/python/)
- [Laravel Starter](./starter-templates/laravel/)

---

## 🧠 Tips

- You can work as a team 
- Make sure your folder name is unique
- Submissions will be reviewed directly from your PR

---

## 🤝 Questions?

Need help or stuck?  
Reach out in the [official Codefest Hackathon group](#) or contact us at [codefestnigeriahackathon@gmail.com]

---

Let’s build for Nigeria and break a world record 🌍🔥

>>>>>>> 8d7e299f2e30454f8a4fdc29b8204fbb4c1f9bb9
