# 🌍 SmartEd Africa App

📱 **SmartEd Africa – A mobile-first learning platform empowering African students with AI tutors, localized lessons, teacher microlearning, and offline learning for IDP camps.**  

![GitHub last commit](https://img.shields.io/github/last-commit/judeik/smarted-africa-app)  
![GitHub issues](https://img.shields.io/github/issues/judeik/smarted-africa-app)  
![GitHub pull requests](https://img.shields.io/github/issues-pr/judeik/smarted-africa-app)  
![Contributors](https://img.shields.io/github/contributors/judeik/smarted-africa-app)

---

## 📌 Overview

Millions of African students struggle with access to **quality education**, exam preparation (WAEC, JAMB, etc.), and modern learning resources.  
**SmartEd Africa App** bridges this gap by combining:  

- 🎓 **AI Tutors** for WAEC preparation  
- 🌍 **Localized lessons** in Hausa and other African languages  
- 📚 **Teacher microlearning modules**  
- 💾 **Offline-first learning** for IDP camps  
- 📱 **Mobile-first design**  

This repository contains the **hackathon build (Codefest Hack 2025, Nigeria)** of SmartEd Africa.

---

## 🛠️ Tech Stack

- ⚡ **Frontend:** Vite + React + TypeScript  
- 🎨 **UI:** TailwindCSS + Bootstrap (combined for rapid prototyping + utility-first design)
- 🔗 **Routing:** react-router-dom  
- 📦 **State Management:** Zustand (lightweight global store)
- ⚙️ **Animation:** framer-motion
- 🔐 **Authentication / HTTP:** axios + JWT-ready with mock demo login/signup  
- ⚙️ **Build & Code Tools:** ESLint + Prettier + Husky  
- 🧩 **Utilities:** class-variance-authority, tailwind-merge, tailwind-variants
- 🤖 **AI/ML:** Python / TensorFlow / PyTorch  
- 🗄️ **Database:** PostgreSQL / MongoDB  
- 🛠️ **CI/CD:** GitHub Actions  

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:  

- [Node.js](https://nodejs.org/) (v22+)  
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)  
- [Python](https://www.python.org/) (for AI/ML models)  

### Clone the Repo

```bash
git clone https://github.com/judeik/smarted-africa-app.git
cd smarted-africa-app
```bash

### Install Dependencies & Run

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```

AI/ML:

```bash
cd ai-ml
pip install -r requirements.txt
```

---

**Useful Scripts:**

- npm run dev → start development server
- npm run build → build project + TypeScript compilation
- npm run lint → lint code and auto-fix
- npm run format → prettier formatting
- npm run preview → preview production build
- npm run prepare → install husky hooks

---

## 🧪 Running Tests

Frontend:

```bash
npm test
```

Backend:

```bash
npm test
```

---

## 🌱 Branching Strategy

- **main** → Production-ready  
- **dev** → Integration/testing  
- Feature branches:  

```bash
jude/fullstack
mamun/backend
david/frontend
chinemeze/ai-ml
```

---

<!-- ## 🤝 Contributing

We welcome contributions! 🎉  

Check [CONTRIBUTING.md](./CONTRIBUTING.md) for instructions on:  

- Forking/Cloning  
- Branch naming & workflow  
- Commit conventions  
- Pull Request process   -->

---

## 📌 Issue Templates

- 🐛 [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md)  
- ✨ [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md)  

---

## 🧑‍🤝‍🧑 Contributors

Thanks goes to these amazing people 💖  

- **Ojobor, Jude Ikechukwu** (Full-Stack)  
- **Omolaja Mamun** (Backend)  
- **Njoku Chinemeze** (AI/ML)  
- **Akpom David** (Frontend)  

---

## 📜 License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE) for details.
