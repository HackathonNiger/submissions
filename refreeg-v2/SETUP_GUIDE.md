# RefreeG - Quick Setup Guide

This is a quick reference guide for setting up RefreeG. For detailed documentation, see [README.md](./README.md).

## ⚡ Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
cd refreeg-v2
npm install
# or
pnpm install
```

### 2. Setup Environment Variables

```bash
cp .env_example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_PAYSTACK_KEY=pk_test_xxxxx
NEXT_PUBLIC_REFREEG_SERVICE_FEE=0.05
SMTP_USER=your-email@gmail.com
SMTP_PORT=587
SMTP_PASSWORD="your-app-password"
SMTP_HOST=smtp.gmail.com
EMAIL_FROM=noreply@yourdomain.com
NODE_ENV=development
```

### 3. Setup Supabase Database

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project → **SQL Editor**
2. Open and run each migration file from `supabase/migrations/` in order:

```
Start with: 20240301000000_create_base_tables.sql (IMPORTANT: Run this first!)
Then run the rest in chronological order (by filename)
```

#### Option B: Using Supabase CLI

```bash
npm install -g supabase
supabase link --project-ref your-project-ref
supabase db push
```

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📋 Migration Checklist

Run migrations in this exact order:

- [ ] `20240301000000_create_base_tables.sql` ⭐ **MUST RUN FIRST**
- [ ] `20240320000000_add_kyc_verifications.sql`
- [ ] `20240320000000_add_roles_foreign_key.sql`
- [ ] `20240321000000_add_email_to_profiles.sql`
- [ ] `20240322000000_add_is_blocked_to_profiles.sql`
- [ ] `20240323000000_add_storage_policies.sql`
- [ ] `20240324000000_add_causes_foreign_keys.sql`
- [ ] `20240325000000_add_cause_shares.sql`
- [ ] `20240326000000_add_shared_field.sql`
- [ ] `20240326000001_add_increment_shared_function.sql`
- [ ] `20240326000002_add_increment_cause_raised_function.sql`
- [ ] `20240326000003_add_crypto_donations_table.sql`
- [ ] `20240326000004_add_tx_signature_column.sql`
- [ ] `20240327000000_add_bio_to_profiles.sql`
- [ ] `20240327000000_add_days_active_to_causes.sql`
- [ ] `20240328000000_add_days_active_cron_job.sql`
- [ ] `20240709000001_create_cause_multimedia.sql`
- [ ] `20240904000000_add_petition_flow.sql`
- [ ] `20241201000000_add_video_links_to_petitions.sql`
- [ ] `20241201000001_create_edits_tables.sql`
- [ ] `20241201000002_add_multimedia_to_causes.sql`

## 🔍 Verify Setup

### Check Tables Created

In Supabase Dashboard → **Table Editor**, verify these tables exist:

**Core Tables:**

- ✅ profiles
- ✅ roles
- ✅ causes
- ✅ donations
- ✅ comments
- ✅ petitions
- ✅ signatures

**Supporting Tables:**

- ✅ cause_multimedia
- ✅ kyc_verifications
- ✅ crypto_donations
- ✅ logs
- ✅ petition_sections
- ✅ petition_comments
- ✅ cause_edits
- ✅ petition_edits

### Check Storage Buckets

In Supabase Dashboard → **Storage**, verify these buckets exist:

- ✅ cause-images
- ✅ profile-images
- ✅ petition-videos
- ✅ kyc-documents

## 🔐 Create Admin User

After setup, create your first admin:

1. Sign up through the app at `/auth/signup`
2. Get your user ID from Supabase Dashboard → **Authentication** → Users
3. Run this SQL in **SQL Editor**:

```sql
INSERT INTO roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'admin');
```

## 🎯 Test Your Setup

1. **Authentication**: Try signing up and logging in
2. **Create a Cause**: Go to `/dashboard/causes/create`
3. **Upload an Image**: Test file upload functionality
4. **Make a Test Donation**: Use Paystack test card: `4084084084084081`

## 🐛 Common Issues

**Problem**: Cannot connect to Supabase

- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Verify they match your Supabase project settings

**Problem**: Table doesn't exist errors

- Run all migrations in order
- Start with `20240301000000_create_base_tables.sql`

**Problem**: Storage upload fails

- Check if storage buckets exist
- Verify RLS policies are set correctly

**Problem**: Emails not sending

- For Gmail: Enable 2FA and create an App Password
- Use the App Password as `SMTP_PASSWORD`

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Explore the codebase structure
- Check out the dashboard at `/dashboard`
- Review the admin panel at `/dashboard/admin`

## 🆘 Need Help?

1. Check the console for errors
2. Verify all environment variables are set
3. Ensure migrations ran successfully
4. Check Supabase logs in the Dashboard

---

**Ready to build for Nigeria! 🇳🇬**
