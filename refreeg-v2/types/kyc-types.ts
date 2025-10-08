export type KycStatus = "pending" | "approved" | "rejected";

export interface KycVerification {
  id: string;
  user_id: string;
  document_type: string;
  document_url: string;
  status: KycStatus;
  verification_notes?: string;
  full_name?: string;
  dob?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal?: string;
  country?: string;
  created_at: string;
  updated_at: string;
}
