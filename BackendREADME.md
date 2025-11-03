# Ajosave – Backend

The backend service for the **Ajosave**, a digital platform that enables users to save collectively in a transparent and secure way, just like traditional cooperative savings but online.  

The backend provides APIs for user authentication, savings management, contribution tracking, withdrawals, and group savings cycles.  

---

## Features
- User authentication & authorization  
- Group creation and membership management  
- Contribution tracking and history  
- Withdrawal requests & approvals  
- Secure and transparent record keeping  

---

## Tech Stack
- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** MongoDB (Mongoose ORM)  
- **Authentication:** JWT (JSON Web Token)  
- **Environment Management:** dotenv  

---

## Getting Started

Follow the steps below to set up the backend locally.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ajosave-backend.git
cd ajosave-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and configure it as follows:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Run the Project
bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on:  
`http://localhost:5000`

---

## API Endpoints (Sample)
- `POST /api/auth/register` – Register a new user  
- `POST /api/auth/login` – Login and get token  
- `POST /api/groups` – Create a savings group  
- `GET /api/groups/:id` – View group details  
- `POST /api/contributions` – Make a contribution  

(Full documentation will be added later with Swagger/Postman collection)

## Contribution
1. Fork the repo  
2. Create a feature branch (`git checkout -b feature-name`)  
3. Commit changes (`git commit -m 'Add new feature'`)  
4. Push branch (`git push origin feature-name`)  
5. Open a Pull Request  

---

## License
This project is licensed under the MIT License.  


SETUP GUIDE

# AjoSave Setup Checklist ✅

Follow these steps in order to set up the project after pulling from GitHub.

---

## Prerequisites (5 minutes)
- [ ] Node.js installed (v16+)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Terminal access

---

## Step 1: Clone & Install (5 minutes)

```bash
# Clone repository
git clone <repository-url>
cd ajosave

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## Step 2: Configure Backend (2 minutes)

Create `backend/.env`:
```bash
cd backend
touch .env  # or create manually
```

Copy this into `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://ajosave:ajosave123@ajosave-cluster.p9pij.mongodb.net/ajosave-db?retryWrites=true&w=majority&appName=Ajosave-cluster
JWT_SECRET=ajosave_super_secret_key_2024_production_ready
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
PAYSTACK_SECRET_KEY=sk_test_your_key_here
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MINUTES=15
```

---

## Step 3: Configure Frontend (2 minutes)

Create `frontend/.env`:
```bash
cd ../frontend
touch .env  # or create manually
```

Copy this into `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_key_here
```

---

## Step 4: Get Paystack Keys (5 minutes)

1. Go to https://paystack.com
2. Sign up / Login
3. Navigate to: Settings → API Keys & Webhooks
4. Copy **Test Public Key** (`pk_test_...`)
5. Copy **Test Secret Key** (`sk_test_...`)
6. Update both `.env` files with your keys

---

## Step 5: Add Paystack Script (1 minute)

Edit `frontend/index.html` and add this in `<head>`:
```html
<script src="https://js.paystack.co/v1/inline.js"></script>
```

---

## Step 6: Start Servers (1 minute)

### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```
✅ Should see: "✅ MongoDB connected successfully"

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
✅ Should see: "Local: http://localhost:5173"

---

## Step 7: Verify Setup (2 minutes)

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] No errors in terminals
- [ ] Can open http://localhost:5173 in browser
- [ ] Homepage loads correctly

---

## Step 8: Test Basic Flow (5 minutes)

1. **Register User:**
   - Go to http://localhost:5173/auth
   - Click "Sign Up" tab
   - Fill form and submit
   - Should redirect to dashboard

2. **Check Database:**
   - Open MongoDB Atlas
   - Check `users` collection has your user
   - Check `wallets` collection has your wallet

3. **Create Group:**
   - Click "Create Group"
   - Fill 3 steps
   - Note the invitation code

4. **Test Payment:**
   - Navigate to Payment page
   - Select your group
   - Use test card: `4084 0840 8408 4081`
   - CVV: `408`, PIN: `1234`
   - Should see success screen

---

## Common Issues & Fixes

### ❌ "Cannot connect to MongoDB"
**Fix:** Check MONGO_URI in `backend/.env` is exact copy (no extra spaces)

### ❌ "PaystackPop is not defined"
**Fix:** Add Paystack script to `frontend/index.html`

### ❌ "Port 5000 already in use"
**Fix:** Change PORT in `backend/.env` to 5001

### ❌ "CORS error"
**Fix:** Ensure `CORS_ORIGIN=http://localhost:5173` in `backend/.env`

### ❌ "Paystack popup doesn't open"
**Fix:** 
1. Check script in `index.html`
2. Verify public key in `frontend/.env`
3. Restart frontend server

---

## Quick Test Commands

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Check MongoDB connection
# Backend console should show: ✅ MongoDB connected successfully

# Check frontend is running
# Open browser: http://localhost:5173
```

---

## Success Indicators ✅

Your setup is complete when you can:
- [x] Register a new user
- [x] Login successfully
- [x] See dashboard with your name
- [x] Create a group
- [x] Make a payment (Paystack popup opens)
- [x] See transaction in MongoDB

---

## Total Setup Time: ~20-30 minutes

Need help? Check the main README.md for detailed testing guide.

**Ready to test?** Start with registering your first user! 🚀