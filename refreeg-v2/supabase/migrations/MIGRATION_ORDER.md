# Database Migration Order

This document lists all migration files in the order they should be executed.

## ⚠️ Important Notes

1. **ALWAYS run migrations in the exact order listed below**
2. **The first migration (create_base_tables) MUST be run before any others**
3. **Do not skip any migrations** - they build upon each other
4. **Check for errors after each migration** before proceeding to the next

## 🚀 How to Run Migrations

### Method 1: Supabase Dashboard (Recommended for Beginners)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the contents of each migration file below (in order)
5. Execute the query
6. Verify success before moving to the next migration

### Method 2: Supabase CLI (Recommended for Advanced Users)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Push all migrations
supabase db push
```

## 📋 Migration Execution Order

### Phase 1: Core Foundation (CRITICAL - Must Run First!)

```
1. 20240301000000_create_base_tables.sql
   Purpose: Creates all core tables (profiles, causes, donations, roles, comments, etc.)
   Status: ⭐ REQUIRED - RUN FIRST
```

### Phase 2: User & Profile Extensions

```
2. 20240320000000_add_kyc_verifications.sql
   Purpose: Adds KYC verification system

3. 20240320000000_add_roles_foreign_key.sql
   Purpose: Adds foreign key constraint to roles table

4. 20240321000000_add_email_to_profiles.sql
   Purpose: Adds email column to profiles

5. 20240322000000_add_is_blocked_to_profiles.sql
   Purpose: Adds user blocking functionality

6. 20240327000000_add_bio_to_profiles.sql
   Purpose: Adds bio field to user profiles
```

### Phase 3: Storage & Media

```
7. 20240323000000_add_storage_policies.sql
   Purpose: Sets up storage bucket policies
```

### Phase 4: Cause Enhancements

```
8. 20240324000000_add_causes_foreign_keys.sql
   Purpose: Adds foreign key relationships for causes

9. 20240325000000_add_cause_shares.sql
   Purpose: Adds cause sharing functionality

10. 20240326000000_add_shared_field.sql
    Purpose: Adds shared count field

11. 20240326000001_add_increment_shared_function.sql
    Purpose: Creates function to increment share count

12. 20240326000002_add_increment_cause_raised_function.sql
    Purpose: Creates function to increment raised amount

13. 20240327000000_add_days_active_to_causes.sql
    Purpose: Adds days_active tracking to causes

14. 20240328000000_add_days_active_cron_job.sql
    Purpose: Sets up automated job to update days_active
```

### Phase 5: Cryptocurrency Support

```
15. 20240326000003_add_crypto_donations_table.sql
    Purpose: Creates crypto donations tracking table

16. 20240326000004_add_tx_signature_column.sql
    Purpose: Adds transaction signature tracking
```

### Phase 6: Multimedia Features

```
17. 20240709000001_create_cause_multimedia.sql
    Purpose: Adds video links support to causes
```

### Phase 7: Petition System

```
18. 20240904000000_add_petition_flow.sql
    Purpose: Creates complete petition system (petitions, signatures, comments)
```

### Phase 8: Advanced Features

```
19. 20241201000000_add_video_links_to_petitions.sql
    Purpose: Adds video support to petitions

20. 20241201000001_create_edits_tables.sql
    Purpose: Creates edit proposal system for causes and petitions

21. 20241201000002_add_multimedia_to_causes.sql
    Purpose: Adds multimedia array support to causes
```

## ✅ Verification Checklist

After running all migrations, verify the following:

### Tables Created

- [ ] profiles
- [ ] roles
- [ ] causes
- [ ] donations
- [ ] comments
- [ ] cause_multimedia
- [ ] petitions
- [ ] petition_sections
- [ ] signatures
- [ ] petition_comments
- [ ] kyc_verifications
- [ ] crypto_donations
- [ ] cause_edits
- [ ] petition_edits
- [ ] cause_edit_sections
- [ ] petition_edit_sections
- [ ] logs

### Storage Buckets Created

- [ ] cause-images
- [ ] profile-images
- [ ] petition-videos
- [ ] kyc-documents

### Functions Created

- [ ] handle_new_user()
- [ ] set_updated_at()
- [ ] update_updated_at_column()
- [ ] sync_profile_verification()
- [ ] increment_cause_shared()
- [ ] increment_cause_raised()

### Triggers Created

- [ ] on_auth_user_created
- [ ] set_petitions_updated_at
- [ ] update_kyc_verifications_updated_at
- [ ] kyc_sync_profile_verified
- [ ] set_cause_edits_updated_at
- [ ] set_petition_edits_updated_at

## 🔍 Testing Migration Success

Run this query in Supabase SQL Editor to verify all tables exist:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

Expected output should include all tables listed in the verification checklist above.

## 🐛 Troubleshooting

### Error: "relation does not exist"

- You likely skipped a migration or ran them out of order
- Start fresh and run from the beginning in correct order

### Error: "constraint already exists"

- The migration was already run
- Skip to the next migration

### Error: "column already exists"

- The migration was already run
- Skip to the next migration

### Error: "permission denied"

- You may not have sufficient database permissions
- Ensure you're using the correct Supabase credentials

## 📝 Notes

- Each migration is idempotent where possible (using `IF NOT EXISTS`)
- Some migrations build upon previous ones and will fail if prerequisites aren't met
- Always backup your database before running migrations in production
- Test migrations in a development environment first

## 🆘 Need Help?

If you encounter issues:

1. Check the error message carefully
2. Verify you ran all previous migrations
3. Check Supabase logs in Dashboard → Logs
4. Ensure your database has enough resources
5. Contact support with the specific error message and migration number

---

Last updated: October 2024
