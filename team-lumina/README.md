# 🌟 Lumina Frontend

**Lumina** is an **AI-powered exam prep tutor** built with **Next.js** that makes **WAEC preparation** feel like learning with a real teacher. It explains questions step by step, identifies student weaknesses, and personalizes quizzes — creating a smart, engaging, and effective learning experience.

---

## 🚀 Features

### 🧠 Smart Learning

* Step-by-step **AI explanations** for every question.
* Automatic **error analysis** to detect and explain mistakes.
* Personalized **quiz generation** based on weak areas.

### 💬 Interactive Experience

* **Chatbot-style interface** that simulates a real tutor.
* Friendly conversational flow for better engagement.

### 📈 Progress Tracking

* **Syllabus tracker** to visualize study progress.
* Built-in **Focus Mode** to reduce distractions and procrastination.

### 🌍 Future Enhancements

* **Offline access** for low-connectivity environments.
* **Local language support** to reach every learner.

---

## 🧩 Tech Stack

* **Framework:** [Next.js 14+](https://nextjs.org/)
* **Language:** TypeScript
* **UI Components:** [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **State Management:** React Hooks / Context
* **Backend Integration:** Connects to Lumina’s AI API & user progress endpoints

---

## 📁 Folder Structure

```
frontend/
│
├── app/                   # Next.js app directory
├── components/            # Reusable UI and functional components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities, config, and helper functions
├── types/                 # TypeScript interfaces and types
├── public/                # Static assets
└── styles/                # Global and module-specific styles
```

---

## ⚙️ Setup & Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/lumina.git
   cd lumina/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:

   ```
   http://localhost:3000
   ```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root of the frontend folder:

```env

GOOGLE_API_KEY=your_api_key_here
```

> ⚠️ Do not commit `.env.local` to version control.

---

## 🧱 Build & Deployment

**Build for production**

```bash
npm run build
```

**Start production server**

```bash
npm start
```

**Deploy easily on**

* [Vercel](https://vercel.com/) (recommended)
* [Netlify](https://www.netlify.com/)
* or your preferred cloud host.

---

## 🧑‍💻 Contributing

We welcome contributions!
To contribute:

1. Fork the repo
2. Create a new branch (`feature/your-feature-name`)
3. Submit a pull request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🌠 Vision

> *"To make exam preparation smarter, fairer, and more human — ensuring that no student is left behind."*

