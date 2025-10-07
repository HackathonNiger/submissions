# 🩺 Aidora – Your AI-Powered Pocket Doctor

## 📖 Project Overview

**Aidora** is an innovative AI-powered mobile application developed by **Team Pandora** for the **CodeFest Hackathon** under the **Health Tech** category.

Designed to tackle the challenge of inefficient access to timely medical consultations in Nigeria, Aidora serves as a _“pocket doctor”_ — offering on-demand, personalized health assistance to students, professionals, and families.

By leveraging conversational AI, Aidora helps users manage minor health concerns without unnecessary hospital visits, long queues, or travel delays. It provides preliminary, evidence-based guidance while emphasizing that it is **not a substitute for professional medical care**, but a complementary tool that empowers users with early insights and supports proactive health management.

The app directly addresses Nigeria’s healthcare challenges, including **urban clinic congestion** and **limited rural access**, with planned **offline functionality** for low-connectivity environments.

The name _Aidora_ merges **“Aid”** (support, comfort) and **“Aura”** (presence, influence), symbolizing compassionate and accessible healthcare assistance.

---

## 🚨 Problem Statement

Nigeria’s healthcare system is heavily overburdened. Urban areas like Lagos experience long hospital queues and overcrowded clinics, while rural regions face a shortage of medical facilities and long travel distances.

For instance, a student at the University of Lagos might choose to ignore minor symptoms such as headaches due to time constraints, risking escalation into serious health conditions. This situation strains medical infrastructure, increases patient costs, and limits healthcare workers’ ability to focus on critical cases.

---

## 💡 Solution

Aidora delivers quick, reliable, and accessible health assistance through a **mobile app powered by Meta LLaMA AI**.

Users can describe symptoms, upload prescriptions or diagnostic reports, and ask health-related questions to receive personalized, easy-to-understand guidance.

### ✳️ Key Features

- **Quick Consultations:** Users input symptoms (via text or voice). Aidora asks clarifying questions and provides evidence-based suggestions — such as recommending rest, hydration, or professional consultation when necessary.
- **Prescription Interpretation:** Users upload prescription images, and Aidora explains medication names, dosages, and side effects in plain language to improve adherence.
- **Test Result Analysis:** Users upload lab or diagnostic reports and receive simplified explanations of complex medical terms or values (e.g., understanding blood count results).
- **Educational Resource:** Aidora serves as a quick reference for medical students, offering visual aids and concise definitions to enhance learning.

Through these features, Aidora reduces hospital congestion, saves time and cost for individuals, and allows healthcare professionals to focus on more critical patients.

---

## 🌍 Impact

- **Individuals:** Saves time and reduces healthcare expenses by offering instant, AI-based consultations for minor concerns.
- **Healthcare System:** Alleviates overcrowding in hospitals and clinics, improving operational efficiency.
- **Education:** Provides accessible medical knowledge for students and healthcare trainees.
- **Local Context:** Addresses Nigeria’s healthcare disparities by bridging urban and rural access gaps.

---

## 📈 Scalability

Aidora is designed with scalability and inclusivity in mind:

- 🌐 **Geographic Expansion:** Support for local languages (Yoruba, Hausa, Igbo) and adaptation to regional medical guidelines.
- ⚙️ **Feature Growth:** Future updates will introduce telemedicine integration, wearable device connectivity, multilingual support, and offline mode.
- 🤝 **Partnerships:** Collaborations with hospitals, universities, and NGOs to enhance reach and credibility.
- 💰 **Affordability:** Subscription-based model with a free tier to ensure accessibility for all users.

---

## 🧠 Technologies Used

### **Frontend:** Flutter/Dart

- **Why:** Enables cross-platform development for iOS and Android using a single codebase, ensuring fast performance and a consistent user experience.
- **Use Case:** Powers the intuitive UI for symptom input, prescription uploads, and test result display.

### **Backend:** Node.js with Express

- **Why:** Lightweight, scalable, and efficient for handling high user concurrency.
- **Use Case:** Manages API requests, user interactions, AI communications, and data flow.

### **Database:** MongoDB

- **Why:** Flexible NoSQL structure for storing diverse user data and interaction logs.
- **Use Case:** Securely stores user profiles, consultation histories, and system logs.

### **AI/ML:** Meta LLaMA AI

- **Why:** Delivers advanced natural language understanding and conversational capabilities.
- **Use Case:** Powers symptom analysis, medical explanations, and educational responses.

### **Image Storage & Processing:** Cloudinary

- **Why:** Secure, scalable image storage and integrated OCR for reading prescriptions.
- **Use Case:** Manages image uploads and extracts medical text for easy explanation.

### **APIs:** Medical Knowledge Bases (e.g., PubMed APIs)

- **Why:** Ensures accurate, evidence-based information.
- **Use Case:** Supports data-driven health insights and educational content.

---

## ⚙️ Local Setup Instructions

### 🧩 Prerequisites

- **Node.js:** v16 or higher (with npm)
- **MongoDB:** Local or Cloud (e.g., MongoDB Atlas)
- **Flutter:** Latest stable version with Dart SDK
- **Cloudinary Account:** For image storage and OCR
- **Meta LLaMA Access:** Or substitute model (e.g., BERT for testing)
- **Git:** For repository management
- **PubMed API Key:** Optional, for medical data integration

---

### 🚧 Project Status

The Aidora APK file is attached to this submission for demonstration purposes.

The application is approximately **70% complete** — due to the complexity of AI integration and limited hackathon timeframe, some advanced features are still under development.

Core functionalities like **symptom consultations, prescription uploads, and AI-based responses** are fully functional and demonstrate Aidora’s core value proposition.

---

### 👥 Team Pandora

Safianu Sani Mohammed – **Team Leader**

Maryam Dauda Olamide – **Team Member**
