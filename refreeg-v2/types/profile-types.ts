// User profile
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  account_number: string | null;
  bank_name: string | null;
  account_name: string | null;
  sub_account_code: string | null;
  profile_photo: string | null;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
  country_of_residence?: string;
  date_of_birth?: string;
  bvn?: number;
  nin?: number;
  pin?: number;
  donation_preference?: string;
  is_verified?: boolean;
  followers_count?: number;
  following_count?: number;
  causes_count?: number;
  account_type?: "individual" | "organization";
  bio: string | null;
  solana_wallet?: string | null;
  social_media?: {
    twitter?: string | null;
    facebook?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
  };
}
