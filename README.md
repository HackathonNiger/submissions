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
