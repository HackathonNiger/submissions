# RefreeG Database Schema Documentation

This document provides a comprehensive overview of the RefreeG database schema.

## 📊 Database Overview

RefreeG uses PostgreSQL (via Supabase) with Row Level Security (RLS) enabled for data protection.

### Core Entities

1. **Users & Authentication** - Managed by Supabase Auth
2. **Profiles** - User profile information
3. **Causes** - Fundraising campaigns
4. **Petitions** - Petition campaigns
5. **Donations & Signatures** - Contributions to causes and petitions
6. **Comments** - User engagement on causes and petitions

## 🗂️ Table Structures

### User Management Tables

#### `profiles`

Stores user profile information and bank account details.

| Column         | Type        | Description                     |
| -------------- | ----------- | ------------------------------- |
| id             | UUID (PK)   | References auth.users(id)       |
| full_name      | TEXT        | User's full name                |
| phone          | TEXT        | Phone number                    |
| email          | TEXT        | Email address (unique)          |
| bio            | TEXT        | User biography                  |
| account_number | TEXT        | Bank account number             |
| bank_name      | TEXT        | Bank name                       |
| account_name   | TEXT        | Account holder name             |
| crypto_wallets | JSONB       | Cryptocurrency wallet addresses |
| is_verified    | BOOLEAN     | KYC verification status         |
| is_blocked     | BOOLEAN     | Account blocked status          |
| created_at     | TIMESTAMPTZ | Profile creation timestamp      |
| updated_at     | TIMESTAMPTZ | Last update timestamp           |

**Indexes:**

- `idx_profiles_id` on `id`
- `idx_profiles_email` on `email`

**RLS Policies:**

- Users can view their own profile
- Users can update their own profile
- Users can insert their own profile

---

#### `roles`

User role assignments for access control.

| Column     | Type          | Description                         |
| ---------- | ------------- | ----------------------------------- |
| id         | UUID (PK)     | Primary key                         |
| user_id    | UUID (UNIQUE) | References profiles(id)             |
| role       | TEXT          | Role: 'admin', 'manager', or 'user' |
| created_at | TIMESTAMPTZ   | Role assignment timestamp           |
| updated_at | TIMESTAMPTZ   | Last update timestamp               |

**Indexes:**

- `idx_roles_user_id` on `user_id`
- `idx_roles_role` on `role`

**RLS Policies:**

- Users can view their own role
- Admins can view all roles
- Admins can insert/update/delete roles

---

#### `kyc_verifications`

KYC (Know Your Customer) verification records.

| Column             | Type        | Description                          |
| ------------------ | ----------- | ------------------------------------ |
| id                 | UUID (PK)   | Primary key                          |
| user_id            | UUID        | References auth.users(id)            |
| document_type      | TEXT        | Type of document submitted           |
| document_url       | TEXT        | URL to uploaded document             |
| status             | TEXT        | 'pending', 'approved', or 'rejected' |
| verification_notes | TEXT        | Admin notes                          |
| full_name          | TEXT        | Name on document                     |
| dob                | TEXT        | Date of birth                        |
| phone              | TEXT        | Phone number                         |
| address            | TEXT        | Street address                       |
| city               | TEXT        | City                                 |
| state              | TEXT        | State/Province                       |
| postal             | TEXT        | Postal/ZIP code                      |
| country            | TEXT        | Country                              |
| created_at         | TIMESTAMPTZ | Submission timestamp                 |
| updated_at         | TIMESTAMPTZ | Last update timestamp                |

**Triggers:**

- Syncs `profiles.is_verified` when status changes to 'approved'

---

### Cause Management Tables

#### `causes`

Fundraising campaigns created by users.

| Column           | Type        | Description                          |
| ---------------- | ----------- | ------------------------------------ |
| id               | UUID (PK)   | Primary key                          |
| user_id          | UUID        | Creator (references auth.users)      |
| title            | TEXT        | Cause title                          |
| description      | TEXT        | Full description                     |
| category         | TEXT        | Cause category                       |
| goal             | INTEGER     | Fundraising goal amount              |
| raised           | INTEGER     | Amount raised so far                 |
| status           | TEXT        | 'pending', 'approved', or 'rejected' |
| rejection_reason | TEXT        | Reason if rejected                   |
| image            | TEXT        | Main image URL                       |
| multimedia       | TEXT[]      | Array of media URLs                  |
| video_links      | TEXT[]      | Array of video URLs                  |
| shared           | INTEGER     | Share count                          |
| days_active      | INTEGER     | Days since creation                  |
| created_at       | TIMESTAMPTZ | Creation timestamp                   |
| updated_at       | TIMESTAMPTZ | Last update timestamp                |

**Indexes:**

- `idx_causes_user_id` on `user_id`
- `idx_causes_status` on `status`
- `idx_causes_category` on `category`
- `idx_causes_created_at` on `created_at DESC`

**Functions:**

- `increment_cause_shared()` - Increments share count
- `increment_cause_raised()` - Updates raised amount

---

#### `cause_multimedia`

Additional media files for causes.

| Column     | Type        | Description           |
| ---------- | ----------- | --------------------- |
| id         | UUID (PK)   | Primary key           |
| cause_id   | UUID        | References causes(id) |
| media_type | TEXT        | 'image' or 'video'    |
| media_url  | TEXT        | URL to media file     |
| caption    | TEXT        | Media caption         |
| created_at | TIMESTAMPTZ | Upload timestamp      |

**Indexes:**

- `idx_cause_multimedia_cause_id` on `cause_id`
- `idx_cause_multimedia_media_type` on `media_type`

---

#### `donations`

Donations made to causes.

| Column       | Type        | Description                       |
| ------------ | ----------- | --------------------------------- |
| id           | UUID (PK)   | Primary key                       |
| cause_id     | UUID        | References causes(id)             |
| user_id      | UUID        | Donor (can be null for anonymous) |
| amount       | NUMERIC     | Donation amount                   |
| name         | TEXT        | Donor name                        |
| email        | TEXT        | Donor email                       |
| message      | TEXT        | Optional message                  |
| is_anonymous | BOOLEAN     | Hide donor identity               |
| status       | TEXT        | Payment status                    |
| receipt_url  | TEXT        | Receipt document URL              |
| created_at   | TIMESTAMPTZ | Donation timestamp                |

**Indexes:**

- `idx_donations_cause_id` on `cause_id`
- `idx_donations_user_id` on `user_id`
- `idx_donations_created_at` on `created_at DESC`

---

#### `crypto_donations`

Cryptocurrency donations tracking.

| Column            | Type        | Description                              |
| ----------------- | ----------- | ---------------------------------------- |
| id                | UUID (PK)   | Primary key                              |
| cause_id          | UUID        | References causes(id)                    |
| user_id           | UUID        | References auth.users(id)                |
| tx_signature      | TEXT        | Blockchain transaction signature         |
| amount_in_sol     | DECIMAL     | Amount in SOL                            |
| amount_in_naira   | DECIMAL     | Equivalent in Naira                      |
| wallet_address    | TEXT        | Sender wallet address                    |
| recipient_address | TEXT        | Recipient wallet address                 |
| payment_method    | TEXT        | Wallet type used                         |
| status            | TEXT        | Transaction status                       |
| network           | TEXT        | Blockchain network                       |
| currency          | TEXT        | Cryptocurrency used                      |
| wallet_type       | TEXT        | Type of wallet (MetaMask, Phantom, etc.) |
| created_at        | TIMESTAMPTZ | Transaction timestamp                    |
| updated_at        | TIMESTAMPTZ | Last update timestamp                    |

**Indexes:**

- `idx_crypto_donations_cause_id` on `cause_id`
- `idx_crypto_donations_user_id` on `user_id`
- `idx_crypto_donations_tx_signature` on `tx_signature`

---

#### `comments`

Comments on causes.

| Column     | Type        | Description                  |
| ---------- | ----------- | ---------------------------- |
| id         | UUID (PK)   | Primary key                  |
| cause_id   | UUID        | References causes(id)        |
| user_id    | UUID        | Comment author               |
| content    | TEXT        | Comment content              |
| parent_id  | UUID        | Parent comment (for replies) |
| is_edited  | BOOLEAN     | Edit flag                    |
| created_at | TIMESTAMPTZ | Comment timestamp            |
| updated_at | TIMESTAMPTZ | Last edit timestamp          |

**Indexes:**

- `idx_comments_cause_id` on `cause_id`
- `idx_comments_user_id` on `user_id`
- `idx_comments_parent_id` on `parent_id`

---

### Petition Management Tables

#### `petitions`

Petition campaigns.

| Column           | Type        | Description                          |
| ---------------- | ----------- | ------------------------------------ |
| id               | UUID (PK)   | Primary key                          |
| user_id          | UUID        | Creator                              |
| title            | TEXT        | Petition title                       |
| description      | TEXT        | Full description                     |
| category         | TEXT        | Petition category                    |
| goal             | INTEGER     | Signature goal                       |
| raised           | INTEGER     | Signatures collected                 |
| status           | TEXT        | 'pending', 'approved', or 'rejected' |
| rejection_reason | TEXT        | Reason if rejected                   |
| image            | TEXT        | Main image URL                       |
| multimedia       | TEXT[]      | Array of media URLs                  |
| shared           | INTEGER     | Share count                          |
| days_active      | INTEGER     | Days since creation                  |
| created_at       | TIMESTAMPTZ | Creation timestamp                   |
| updated_at       | TIMESTAMPTZ | Last update timestamp                |

**Similar structure to `causes` table**

---

#### `petition_sections`

Additional sections/paragraphs for petitions.

| Column      | Type        | Description              |
| ----------- | ----------- | ------------------------ |
| id          | UUID (PK)   | Primary key              |
| petition_id | UUID        | References petitions(id) |
| heading     | TEXT        | Section heading          |
| description | TEXT        | Section content          |
| created_at  | TIMESTAMPTZ | Creation timestamp       |

---

#### `signatures`

Petition signatures (similar to donations).

| Column       | Type        | Description                      |
| ------------ | ----------- | -------------------------------- |
| id           | UUID (PK)   | Primary key                      |
| petition_id  | UUID        | References petitions(id)         |
| user_id      | UUID        | Signer (can be null)             |
| amount       | NUMERIC     | Optional donation with signature |
| name         | TEXT        | Signer name                      |
| email        | TEXT        | Signer email                     |
| message      | TEXT        | Optional message                 |
| is_anonymous | BOOLEAN     | Hide signer identity             |
| status       | TEXT        | Signature status                 |
| receipt_url  | TEXT        | Receipt URL                      |
| created_at   | TIMESTAMPTZ | Signature timestamp              |

**Constraint:**

- One signature per user per petition (unique index on `petition_id, user_id` where `user_id IS NOT NULL`)

---

#### `petition_comments`

Comments on petitions.

| Column      | Type        | Description                  |
| ----------- | ----------- | ---------------------------- |
| id          | UUID (PK)   | Primary key                  |
| petition_id | UUID        | References petitions(id)     |
| user_id     | UUID        | Comment author               |
| content     | TEXT        | Comment content              |
| parent_id   | UUID        | Parent comment (for replies) |
| is_edited   | BOOLEAN     | Edit flag                    |
| created_at  | TIMESTAMPTZ | Comment timestamp            |

---

### Edit Proposal Tables

#### `cause_edits`

Proposed edits to existing causes.

| Column            | Type        | Description                          |
| ----------------- | ----------- | ------------------------------------ |
| id                | UUID (PK)   | Primary key                          |
| original_cause_id | UUID        | References causes(id)                |
| user_id           | UUID        | Editor                               |
| title             | TEXT        | New title                            |
| description       | TEXT        | New description                      |
| category          | TEXT        | New category                         |
| goal              | INTEGER     | New goal                             |
| image             | TEXT        | New image                            |
| multimedia        | TEXT[]      | New multimedia                       |
| video_links       | TEXT[]      | New video links                      |
| days_active       | INTEGER     | Days active                          |
| status            | TEXT        | 'pending', 'approved', or 'rejected' |
| rejection_reason  | TEXT        | Reason if rejected                   |
| created_at        | TIMESTAMPTZ | Edit submission timestamp            |
| updated_at        | TIMESTAMPTZ | Last update timestamp                |

---

#### `petition_edits`

Proposed edits to existing petitions (similar structure to `cause_edits`).

---

### Administrative Tables

#### `logs`

Admin activity audit trail.

| Column     | Type        | Description             |
| ---------- | ----------- | ----------------------- |
| id         | UUID (PK)   | Primary key             |
| admin_id   | UUID        | References profiles(id) |
| action     | TEXT        | Action performed        |
| created_at | TIMESTAMPTZ | Action timestamp        |

**Indexes:**

- `idx_logs_admin_id` on `admin_id`
- `idx_logs_created_at` on `created_at DESC`

---

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with policies such as:

- **SELECT**: Users can view approved content or their own content
- **INSERT**: Authenticated users can create their own content
- **UPDATE**: Users can update their own content
- **DELETE**: Users can delete their own content
- **ADMIN**: Admins can manage all content

## 📦 Storage Buckets

### `cause-images`

- **Public**: Yes
- **Purpose**: Store cause cover images
- **Policies**:
  - Anyone can view
  - Authenticated users can upload
  - Users can manage their own images

### `profile-images`

- **Public**: Yes
- **Purpose**: Store user profile pictures
- **Policies**:
  - Anyone can view
  - Users can only manage their own images

### `petition-videos`

- **Public**: Yes
- **Purpose**: Store petition video files
- **Policies**:
  - Anyone can view
  - Authenticated users can upload
  - Users can update/delete their uploads

### `kyc-documents`

- **Public**: No (Private)
- **Purpose**: Store KYC verification documents
- **Policies**:
  - Users can only view/upload their own documents
  - Service role can delete documents

---

## 🔄 Database Functions

### `handle_new_user()`

- **Trigger**: After INSERT on `auth.users`
- **Purpose**: Automatically create a profile when a user signs up

### `set_updated_at()`

- **Trigger**: Before UPDATE on various tables
- **Purpose**: Automatically update the `updated_at` timestamp

### `sync_profile_verification()`

- **Trigger**: After UPDATE on `kyc_verifications.status`
- **Purpose**: Sync verification status to user profile

### `increment_cause_shared()`

- **Purpose**: Increment the share count for a cause

### `increment_cause_raised()`

- **Purpose**: Update the raised amount for a cause

---

## 🔗 Relationships

```
auth.users (Supabase Auth)
    └─→ profiles (1:1)
        ├─→ roles (1:1)
        ├─→ kyc_verifications (1:many)
        ├─→ causes (1:many)
        │   ├─→ donations (1:many)
        │   ├─→ comments (1:many)
        │   ├─→ cause_multimedia (1:many)
        │   └─→ cause_edits (1:many)
        └─→ petitions (1:many)
            ├─→ signatures (1:many)
            ├─→ petition_comments (1:many)
            ├─→ petition_sections (1:many)
            └─→ petition_edits (1:many)
```

---

## 📝 Notes

- All UUIDs are generated using `gen_random_uuid()`
- All timestamps use `TIMESTAMPTZ` for timezone awareness
- Foreign keys use `ON DELETE CASCADE` or `ON DELETE SET NULL` as appropriate
- Unique constraints ensure data integrity
- Indexes optimize common query patterns

---

## 🔍 Common Queries

### Get User's Causes with Donation Count

```sql
SELECT c.*, COUNT(d.id) as donation_count
FROM causes c
LEFT JOIN donations d ON d.cause_id = c.id
WHERE c.user_id = auth.uid()
GROUP BY c.id;
```

### Get Top Donors for a Cause

```sql
SELECT name, email, amount, created_at
FROM donations
WHERE cause_id = 'CAUSE_ID'
  AND is_anonymous = false
ORDER BY amount DESC
LIMIT 10;
```

### Get User's Role

```sql
SELECT role
FROM roles
WHERE user_id = auth.uid();
```

---

Last updated: October 2024
