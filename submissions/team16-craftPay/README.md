# CraftPay — Digital Marketplace for Local Crafts

*CodeFest Hackathon Submission — Team 16*

CraftPay is a **React + TypeScript + PHP & MYSQL** web platform designed to connect **rural artisans** in Nigeria directly to **buyers across the country and beyond**.
The platform eliminates middlemen, giving local craft makers a fairer share of their earnings while offering buyers authentic, affordable, handmade products.

---

## Problem Statement

Rural artisans in Nigeria create unique, high-quality crafts but often lack access to digital marketplaces.
They rely heavily on middlemen (wholesalers and retailers), resulting in reduced profits and limited exposure.
The absence of a direct platform makes it difficult for these artisans to reach national or international customers.

---

## Our Solution

CraftPay provides a **digital marketplace** where artisans and craft makers can:

* Create accounts and list their products.
* Sell directly to buyers without middlemen.
* Manage orders, view analytics, and track sales performance.

Buyers can:

* Explore diverse handmade crafts from local artisans.
* Add or remove items from their cart.
* Create and view orders seamlessly.

---

## MVP Key Features

### Buyer

* **Sign Up / Login**
* **Product Listing** — Browse available crafts
* **Add / Remove Cart Items**
* **View Cart Items**
* **Create Order**
* **View Orders**

### Artisan

* **Sign Up / Login**
* **Add Products to Catalog**

---

## Beyond MVP (Future Features)

### For Buyers

* **Integrated Payment Gateways** (Beewave Merchant, Paystack, etc.)
* **Voucher Code System** for discounts
* **View Artisan Profiles**
* **Add Delivery Addresses**

### For Artisans

* **Sales Analytics Dashboard**
* **Receive and Manage Buyer Orders**

---

## Software Structure

* **Optimized API calls** — uses caching/memoization to reduce redundant requests
* **Interactive UI** — engaging and responsive interface
* **Robust error handling** — prevents app crashes during runtime errors

---

## Tech Stack

| Layer                 | Technologies                  |
| --------------------- | ----------------------------- |
| **Backend**           | PHP + MySQL                   |
| **Frontend**          | React + TypeScript            |
| **Styling**           | Tailwind CSS                  |
| **State Management**  | React Context / Redux Toolkit |
| **API Communication** | Fetch / React Query           |
| **Authentication**    | JWT                           |
| **Build Tool**        | Vite                          |
| **Version Control**   | Git + GitHub                  |

---

## Folder Structure

```
submissions/
└── team16-craftPay/
    ├── README.md
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── hooks/
    │   ├── assets/
    │   └── main.tsx
    ├── package.json
    ├── tsconfig.json
    └── ...
```

---

## Getting Started

### Prerequisites

Make sure you have:

* Node.js (v16 or newer)
* npm or yarn

### Installation

```bash
git clone https://github.com/OyeyipoEmmanuel/codefest-hackathon.git
cd codefest-hackathon/submissions/team16-craftPay
npm install
```

### Run the app

```bash
npm run dev
```

Then visit **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🧾 Usage

* Register as an artisan or buyer.
* Browse and add products to your cart.
* Create an order and view your order list.
* Artisans can add new products and track sales.

---

## Team 16 — Members
**Beebay** - Backend Developer / Team Lead
**Oyeyipo Emmanuel** - Frontend Engineer
**Mariam** - Product Manager

---

## Future Improvements

* Add **multi-language support** for local Nigerian languages
* Implement **real-time messaging** between artisans and buyers
* Add **AI-based product recommendations**
* Integrate **delivery tracking system**
* Improve **offline performance**

---

## Acknowledgements

Special thanks to **CodeFest Hackathon** organizers for the opportunity to build impactful solutions for local communities.
