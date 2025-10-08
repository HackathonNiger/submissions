# Getting Started with RefreeG

Welcome to RefreeG! This guide will help you get up and running in minutes.

## 📚 Documentation Overview

We've prepared comprehensive documentation to help you:

1. **[README.md](./README.md)** - Complete project documentation
2. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Quick setup instructions
3. **[supabase/MIGRATION_ORDER.md](./supabase/migrations/MIGRATION_ORDER.md)** - Database migration guide
4. **[supabase/DATABASE_SCHEMA.md](./supabase/DATABASE_SCHEMA.md)** - Database schema reference

## ⚡ Quick Start (3 Steps)

### Step 1: Install Dependencies (1 minute)

```bash
cd refreeg-v2
npm install
```

### Step 2: Configure Environment (2 minutes)

```bash
cp .env_example .env.local
```

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_PAYSTACK_KEY=pk_test_xxxxx
NEXT_PUBLIC_REFREEG_SERVICE_FEE=0.05
SMTP_USER=your-email@gmail.com
SMTP_PORT=587
SMTP_PASSWORD="your-password"
SMTP_HOST=smtp.gmail.com
EMAIL_FROM=noreply@yourdomain.com
NODE_ENV=development
```

### Step 3: Setup Database (5 minutes)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → SQL Editor
2. Run migrations from `supabase/migrations/` in order (see [MIGRATION_ORDER.md](./supabase/migrations/MIGRATION_ORDER.md))
3. Start with `20240301000000_create_base_tables.sql` ⭐

**OR** use Supabase CLI:

```bash
npm install -g supabase
supabase link --project-ref your-project-ref
supabase db push
```

### Step 4: Run the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 🎯 What You Need

### Required Services

1. **Supabase Account** (Free tier works)

   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Get your URL and anon key from Settings → API

2. **Paystack Account** (For payments)

   - Sign up at [paystack.com](https://paystack.com)
   - Get your test public key from Settings → API Keys

3. **SMTP Email Service** (Optional but recommended)
   - Use Gmail, SendGrid, or any SMTP provider
   - For Gmail: Enable 2FA and create an App Password

### Optional But Helpful

- **Node.js 18+** (Required)
- **pnpm** or **npm** (Required)
- **Git** (For version control)

## 📋 Pre-Flight Checklist

Before you start, make sure you have:

- [ ] Node.js 18 or higher installed
- [ ] A Supabase account and project
- [ ] Supabase URL and anon key
- [ ] Paystack test public key
- [ ] SMTP credentials (or skip email features for now)
- [ ] 10-15 minutes to complete setup

## 🏗️ What Gets Built

RefreeG includes:

- ✅ User authentication (signup/login)
- ✅ Create fundraising causes
- ✅ Create petitions
- ✅ Accept donations via Paystack
- ✅ Accept crypto donations (Solana, ETH)
- ✅ Admin dashboard with analytics
- ✅ User profiles with KYC verification
- ✅ Comment system
- ✅ Email notifications
- ✅ Dark/Light mode
- ✅ Responsive design

## 🎨 Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **Payments**: Paystack, Web3 (MetaMask, Phantom)
- **Email**: Nodemailer
- **UI Components**: shadcn/ui, Radix UI
- **Animations**: Framer Motion

## 🚀 Next Steps After Setup

1. **Create an Account**

   - Go to `/auth/signup`
   - Sign up with your email

2. **Make Yourself Admin** (Optional)

   - Get your user ID from Supabase Dashboard → Authentication
   - Run this SQL in SQL Editor:

   ```sql
   INSERT INTO roles (user_id, role)
   VALUES ('your-user-id', 'admin');
   ```

3. **Create Your First Cause**

   - Go to `/dashboard/causes/create`
   - Fill in the details
   - Upload an image
   - Submit for approval

4. **Approve the Cause** (As Admin)

   - Go to `/dashboard/admin`
   - Approve your cause
   - Now it's visible on the homepage!

5. **Test a Donation**
   - Click "Donate" on your cause
   - Use Paystack test card: `4084084084084081`
   - CVV: `408`, Expiry: any future date

## 📖 Learn More

- **Full Documentation**: See [README.md](./README.md)
- **Database Setup**: See [MIGRATION_ORDER.md](./supabase/migrations/MIGRATION_ORDER.md)
- **Database Schema**: See [DATABASE_SCHEMA.md](./supabase/DATABASE_SCHEMA.md)
- **Quick Setup**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 🆘 Need Help?

### Common Issues

**Problem**: "Cannot find module 'next'"

```bash
# Solution: Install dependencies
npm install
```

**Problem**: "Supabase URL is required"

```bash
# Solution: Check your .env.local file
# Make sure NEXT_PUBLIC_SUPABASE_URL is set
```

**Problem**: "Table does not exist"

```bash
# Solution: Run database migrations
# See supabase/migrations/MIGRATION_ORDER.md
```

### Still Stuck?

1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure migrations were run successfully
4. Check Supabase Dashboard → Logs
5. Read the detailed error message

## 🎓 Learning Resources

- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Paystack**: [paystack.com/docs](https://paystack.com/docs)
- **TailwindCSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

## 🎉 You're Ready!

Once setup is complete, you'll have a fully functional fundraising and petition platform running locally.

**Happy building for Nigeria! 🇳🇬**

---

## 📝 Quick Command Reference

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Install Supabase CLI
npm install -g supabase

# Link to Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

---

**Questions?** Check our documentation files or reach out to the team.

**Found a bug?** Please report it with details about what went wrong.

**Want to contribute?** See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
