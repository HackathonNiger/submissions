# VerifyMeds – QR-powered Drug Authentication  

## 👥 Team Nexploy

* **AbdulMuiz Jimoh** – Frontend Developer & Team Lead
* **Promise Ighedosa** – Frontend Developer & Medical Researcher
* **Udu Mercy** – Content & Presentation
* **Sonia Amarachi** – Backend Developer

---
## 🚀 Project Overview  
Counterfeit and substandard drugs are a major public health threat in Nigeria and across Africa. According to WHO, **1 in 10 medical products in Africa is substandard or falsified**, causing thousands of preventable deaths yearly.  

**VerifyMeds** is a **web application** built to empower consumers and pharmacists to **verify the authenticity of medications** before purchase using **QR codes and NAFDAC data**.  

Our solution makes it easy for:  
- **Consumers:** Scan a drug pack before purchase to confirm authenticity.  
- **Pharmacists:** Bulk-verify inventory to protect customers and build trust.  
- **NAFDAC:** Receive counterfeit reports to track and eliminate fake drugs.  

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
- **Frontend Framework:** [Vite](https://vitejs.dev/) + [React](https://react.dev/)  
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)  
- **QR Scanner Library:** [html5-qrcode](https://github.com/mebjas/html5-qrcode)  
- **Data:** Mock NAFDAC dataset (JSON-based, extendable to live API)  
- **Version Control:** Git + GitHub  

---


## ⚡ Getting Started  

### 1. Clone the Repository  

git clone https://github.com/Muayyad822/submissions.git
cd submissions


### 2. Install Dependencies


npm install


### 3. Run Development Server


npm run dev


## 📊 Usage Flow

1. **Open the app** on your phone or desktop.
2. **Scan the QR code** on the drug packaging.
3. The app checks the QR code against the **mock NAFDAC dataset**.
4. **Result displayed:**

   * ✅ Green → Authentic drug.
   * ❌ Red → Fake or expired drug.
5. **Extra options:** View expiry alerts, side effects, dosage, or report suspicious drugs.

---

## 🌍 Impact & Sustainability

* **Consumers:** Safety and confidence in purchases.
* **Pharmacies:** Build trust and loyalty.
* **NAFDAC:** Real-time tracking of counterfeit distribution.
* **Long-term:** Potential for partnerships with manufacturers, API integration, and public health campaigns.

---


## 🙏 Acknowledgments

* [Codefest Africa](https://twitter.com/codefestafrica) for organizing this hackathon.
* [NAFDAC](https://www.nafdac.gov.ng/) for inspiring the vision of safer medications.
* Open-source contributors powering our tech stack.

---

