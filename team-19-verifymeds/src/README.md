# VerifyMeds – QR-powered Drug Authentication  

## 👥 Team 19 - VerifyMeds

* **AbdulMuiz Jimoh** – Frontend Developer & Team Lead - 📧 muayyad822@gmail.com
* **Promise Ighedosa** – Frontend Developer & Medical Researcher 📧 ighedosapromisei@gmail.com
* **Udu Mercy** – Content & Presentation - 📧 nonyeroya100l@gmail.com
* **Sonia Amarachi** – Backend Developer - 📧 soniaamarach24@gmail.com

---
## 🚀 Project Overview  
Counterfeit and substandard drugs are a major public health threat in Nigeria and across Africa. According to WHO, **1 in 10 medical products in Africa is substandard or falsified**, causing thousands of preventable deaths yearly.  

**VerifyMeds** is a **web application** built to empower consumers and pharmacists to **verify the authenticity of medications** before purchase using **QR codes and NAFDAC data**.  

Our solution makes it easy for:  
- **Consumers:** Scan a drug pack before purchase to confirm authenticity.  
- **Pharmacists:** Bulk-verify inventory to protect customers and build trust.  
- **NAFDAC:** Receive counterfeit reports to track and eliminate fake drugs.  

---

## 🌐 Live Demo
Try the live application at: [verifymeds.vercel.app](https://verifymeds.vercel.app)

---

## ✨ Key Features
- 📷 **QR Code Scanning** – Verify drugs instantly using your camera.  
- ✅ **Drug Authentication** – Check drug ID, manufacturer, and batch against dataset.  
- ⏰ **Expiry Alerts** – Warns if a drug is expired or nearing expiry.  
- ⚠️ **Suspicious Reporting** – One-tap reporting of fake drugs to authorities.  
- 📊 **Pharmacist Dashboard** – Bulk verification with scan history and logs.  
- 💊 **Drug Info Cards** – Show dosage, side effects, and manufacturer details.  

---

## 🛠️ Tech Stack
- **Frontend Framework:** [Vite](https://vitejs.dev/) + [React](https://react.dev/) (v19.1.1)
- **Build Tool:** [Vite](https://vitejs.dev/) (v7.1.6)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4.1.13)
- **Icons:** [Lucide React](https://lucide.dev/) (v0.544.0)
- **QR Code Processing:** [jsQR](https://github.com/cozmo/jsQR) (v1.4.0)
- **OCR (Optical Character Recognition):** [Tesseract.js](https://tesseract.projectnaptha.com/) (v6.0.1)
- **Camera Access:** Native Web APIs (getUserMedia)
- **PWA Support:** [Vite PWA Plugin](https://vite-pwa-org.github.io/) + Workbox
- **Analytics:** [Vercel Analytics](https://vercel.com/docs/analytics)
- **Data:** NAFDAC dataset (JSON-based, extendable to live API)
- **Version Control:** Git + GitHub
- **Code Quality:** ESLint + Prettier

### Progressive Web App (PWA) Features
- **Offline Support:** Service workers cache app resources for offline functionality
- **Installable:** Can be installed on mobile devices and desktops as a native app
- **Camera Integration:** Native camera access for scanning QR codes
- **Responsive Design:** Optimized for mobile, tablet, and desktop devices
- **Fast Loading:** Vite-optimized build for quick startup and performance

---

## ⚡ Getting Started

### 1. Clone the Repository  

git clone https://github.com/Muayyad822/submissions.git
cd submissions


### 2. Install Dependencies


npm install


### 3. Run Development Server


npm run dev


## 📊 How the App Works

### Verification Methods

**1. QR Code Scanning**
- User opens camera modal and captures photo of QR code on drug packaging
- App uses **jsQR** library to decode the QR code data
- Decoded data is verified against NAFDAC database
- Results show authenticity, expiry status, and drug details

**2. Manual Input**
- User enters NAFDAC registration number (format: XX-XXXX or AXX-XXXXXX) or batch number (format: XXX-XXXXXXXX)
- Direct lookup in NAFDAC database for verification

**3. Search**
- User searches by drug name, manufacturer, or NAFDAC number
- Real-time search through NAFDAC dataset with fuzzy matching
- Click to select and view detailed drug information

### Technical Flow

1. **Camera Access:** Uses WebRTC `getUserMedia` API with mobile-optimized constraints
2. **QR Decoding:** jsQR processes image data to extract QR code content
3. **Data Verification:** Searches JSON-based NAFDAC dataset for matches
4. **Expiry Calculation:** Compares current date with drug expiry dates
5. **PWA Features:** Service workers for offline functionality, install prompts

### Result Display

- ✅ **Verified:** Green interface showing authentic drug details
- ❌ **Counterfeit:** Red interface with reporting options
- ⚠️ **Warnings:** Yellow alerts for expired or expiring drugs
- 📊 **Details:** Product name, manufacturer, NAFDAC number, batch number, expiry date, active ingredients

---

## 🌍 Impact & Sustainability

* **Consumers:** Safety and confidence in purchases.
* **Pharmacies:** Build trust and loyalty.
* **NAFDAC:** Real-time tracking of counterfeit distribution.
* **Long-term:** Potential for partnerships with manufacturers, API integration, and public health campaigns.

---


## 🙏 Acknowledgments

* [Codefest Africa](https://x.com/codefestng) for organizing this hackathon.
* [NAFDAC](https://www.nafdac.gov.ng/) for inspiring the vision of safer medications.
* Open-source contributors powering our tech stack.

---

