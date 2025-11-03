# RefreeG - Community Fundraising & Petition Platform

RefreeG is a comprehensive web platform that enables communities to create fundraising campaigns (causes) and petitions, accept donations through multiple payment methods (Paystack, cryptocurrency), and track progress transparently. Built with Next.js 15, Supabase, and modern web technologies.

pitch deck: https://www.canva.com/design/DAGf4ypibCE/6cfxP1KpKczKYIaax5ec2g/edit?utm_content=DAGf4ypibCE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

## 🚀 Features

- **Cause Management**: Create, manage, and track fundraising campaigns
- **Petition System**: Start and sign petitions with donation support
- **Multiple Payment Methods**:
  - Paystack integration for card payments
  - Cryptocurrency donations (Solana, MetaMask, Phantom)
- **User Profiles**: Manage user information, bank details, and KYC verification
- **Admin Dashboard**: Comprehensive analytics, user management, and content moderation
- **Real-time Updates**: Live donation tracking and notifications
- **Comment System**: Engage with causes and petitions through comments
- **File Upload**: Support for images and videos (YouTube, multimedia)
- **Email Notifications**: Automated email notifications using SMTP
- **Role-Based Access Control**: Admin, Manager, and User roles
- **Dark/Light Mode**: Built-in theme switching

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** or **pnpm** package manager
- **Supabase Account** (for database and authentication)
- **Paystack Account** (for payment processing)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
cd refreeg-v2
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using pnpm:

```bash
pnpm install
```

### 3. Environment Variables Setup

Copy the `.env_example` file to `.env.local`:

```bash
cp .env_example .env.local
```

Edit `.env.local` and fill in your configuration:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Paystack Configuration
NEXT_PUBLIC_PAYSTACK_KEY=your_paystack_public_key

# Service Fee (in percentage, e.g., 0.05 for 5%)
NEXT_PUBLIC_REFREEG_SERVICE_FEE=0.05

# SMTP Configuration for Email Notifications
SMTP_USER=your_smtp_username
SMTP_PORT=587
SMTP_PASSWORD="your_smtp_password"
SMTP_HOST=smtp.your-email-provider.com
EMAIL_FROM=noreply@yourdomain.com

# Environment
NODE_ENV=development
```

#### Where to Get These Values:

**Supabase:**

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select an existing one
3. Go to Settings → API
4. Copy the `Project URL` as `NEXT_PUBLIC_SUPABASE_URL`
5. Copy the `anon public` key as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Paystack:**

1. Sign up at [paystack.com](https://paystack.com)
2. Go to Settings → API Keys & Webhooks
3. Copy your `Public Key` as `NEXT_PUBLIC_PAYSTACK_KEY`

**SMTP (Email):**

- Use Gmail, SendGrid, Mailgun, or any SMTP provider
- For Gmail: Enable "App Passwords" in your Google Account settings
- For SendGrid: Create an API key and use it as the password

### 4. Database Setup

#### Run Migrations

The migrations are located in `supabase/migrations/` and must be run in order. Follow these steps:

1. **Go to your Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Run the migrations in chronological order (sorted by filename):

```sql
-- Run migrations in this order:
-- 1. Base tables (MUST RUN FIRST)
20240301000000_create_base_tables.sql

-- 2. Add email to profiles
20240321000000_add_email_to_profiles.sql

-- 3. Add is_blocked to profiles
20240322000000_add_is_blocked_to_profiles.sql

-- 4. Add storage policies
20240323000000_add_storage_policies.sql

-- 5. KYC verifications
20240320000000_add_kyc_verifications.sql

-- 6. Roles foreign key
20240320000000_add_roles_foreign_key.sql

-- 7. Causes foreign keys
20240324000000_add_causes_foreign_keys.sql

-- 8. Cause shares
20240325000000_add_cause_shares.sql

-- 9. Add shared field
20240326000000_add_shared_field.sql

-- 10. Increment functions
20240326000001_add_increment_shared_function.sql
20240326000002_add_increment_cause_raised_function.sql

-- 11. Crypto donations
20240326000003_add_crypto_donations_table.sql
20240326000004_add_tx_signature_column.sql

-- 12. Profile enhancements
20240327000000_add_bio_to_profiles.sql

-- 13. Days active
20240327000000_add_days_active_to_causes.sql
20240328000000_add_days_active_cron_job.sql

-- 14. Cause multimedia
20240709000001_create_cause_multimedia.sql

-- 15. Petition flow
20240904000000_add_petition_flow.sql

-- 16. Video links and multimedia
20241201000000_add_video_links_to_petitions.sql
20241201000001_create_edits_tables.sql
20241201000002_add_multimedia_to_causes.sql
```

**Alternative: Using Supabase CLI**

If you have Supabase CLI installed:

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run all migrations
supabase db push
```

### 5. Verify Database Tables

After running migrations, verify that all tables were created successfully:

**Required Tables:**

- `profiles` - User profile information
- `roles` - User roles (admin, manager, user)
- `causes` - Fundraising campaigns
- `donations` - Donations to causes
- `comments` - Comments on causes
- `cause_multimedia` - Media files for causes
- `petitions` - Petition campaigns
- `petition_sections` - Additional sections for petitions
- `signatures` - Signatures on petitions
- `petition_comments` - Comments on petitions
- `kyc_verifications` - KYC verification records
- `crypto_donations` - Cryptocurrency donation records
- `cause_edits` - Edit proposals for causes
- `petition_edits` - Edit proposals for petitions
- `logs` - Admin activity logs

**Required Storage Buckets:**

- `cause-images` - Images for causes
- `profile-images` - User profile images
- `petition-videos` - Videos for petitions
- `kyc-documents` - KYC verification documents

You can verify tables in Supabase Dashboard → Table Editor.

### 6. Create Default Admin User (Optional)

After running migrations, you can create an admin user:

1. Sign up for an account through the app
2. Go to Supabase Dashboard → SQL Editor
3. Run this query (replace `USER_ID` with your user's UUID from `auth.users` table):

```sql
INSERT INTO roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'admin');
```

## 🚀 Running the Project

### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
refreeg-v2/
├── actions/              # Server actions for data operations
│   ├── auth-actions.ts
│   ├── cause-actions.ts
│   ├── donation-actions.ts
│   ├── petition-actions.ts
│   └── ...
├── app/                  # Next.js app directory
│   ├── (routes)/
│   ├── api/             # API routes
│   ├── auth/            # Authentication pages
│   ├── causes/          # Causes pages
│   ├── dashboard/       # Dashboard pages
│   ├── petitions/       # Petitions pages
│   └── layout.tsx
├── components/          # React components
│   ├── ui/             # UI components (shadcn/ui)
│   ├── home/           # Home page components
│   ├── charts/         # Chart components
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   ├── supabase/       # Supabase client configuration
│   └── utils.ts
├── types/              # TypeScript type definitions
├── supabase/
│   └── migrations/     # Database migration files
├── services/           # External service integrations
│   ├── mail.ts        # Email service
│   └── paystack.ts    # Paystack payment service
├── public/            # Static assets
├── .env.local         # Environment variables (create this)
├── package.json
└── README.md
```

## 🔐 Authentication

RefreeG uses Supabase Authentication with the following features:

- Email/Password authentication
- Magic link authentication
- Row Level Security (RLS) for data protection
- Automatic profile creation on signup

## 💳 Payment Integration

### Paystack

Paystack is used for card payments in Nigeria. Configure your Paystack public key in the environment variables.

### Cryptocurrency

Supports multiple wallets:

- **Solana**: Via Phantom or Solflare wallet
- **Ethereum**: Via MetaMask

## 📧 Email Notifications

Email templates are located in `services/templates/`. The following notifications are sent:

- Welcome email on signup
- Donation receipts
- Campaign approval/rejection
- KYC verification status
- Milestone achievements

## 👥 User Roles

- **User**: Can create causes/petitions, donate, comment
- **Manager**: User permissions + moderate content
- **Admin**: Full access including user management and analytics

## 🎨 Styling

- **TailwindCSS** for utility-first styling
- **shadcn/ui** for pre-built components
- **Framer Motion** for animations
- **Next Themes** for dark/light mode

## 🧪 Testing

Currently, the project doesn't have automated tests. Consider adding:

- Unit tests with Jest
- Integration tests with React Testing Library
- E2E tests with Playwright or Cypress

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_PAYSTACK_KEY`
- `NEXT_PUBLIC_REFREEG_SERVICE_FEE`
- `SMTP_USER`
- `SMTP_PORT`
- `SMTP_PASSWORD`
- `SMTP_HOST`
- `EMAIL_FROM`
- `NODE_ENV=production`

## 📊 Database Schema Overview

### Core Tables

**profiles**: User profile information including bank details
**causes**: Fundraising campaigns with goals, raised amounts, and status
**petitions**: Petition campaigns with signature goals
**donations**: Records of all donations made to causes
**signatures**: Records of all signatures/donations on petitions
**comments**: Comments on causes
**petition_comments**: Comments on petitions

### Supporting Tables

**roles**: User role assignments
**kyc_verifications**: KYC document verification records
**crypto_donations**: Cryptocurrency transaction records
**cause_multimedia**: Media attachments for causes
**logs**: Admin activity audit trail

## 🐛 Troubleshooting

### Common Issues

**Issue**: "relation does not exist" error

- **Solution**: Ensure all migrations have been run in the correct order

**Issue**: Authentication not working

- **Solution**: Check your Supabase URL and anon key are correct

**Issue**: Paystack payments failing

- **Solution**: Verify your Paystack public key and ensure you're using the correct environment (test/live)

**Issue**: Email not sending

- **Solution**: Check SMTP credentials and ensure your email provider allows SMTP access

**Issue**: Images not uploading

- **Solution**: Verify storage buckets exist and RLS policies are set correctly

### Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Check the server logs (`npm run dev` output)
3. Verify environment variables are set correctly
4. Check Supabase logs in the Dashboard

## 📝 License

This project is part of the Codefest GWR Hackathon submission.

## 🤝 Contributing

This is a hackathon project. For the main hackathon submission guidelines, see the root [README.md](../README.md).

## 📧 Contact

For questions about this project, contact: [Your Contact Information]

---

Built with ❤️ for Nigeria 🇳🇬
