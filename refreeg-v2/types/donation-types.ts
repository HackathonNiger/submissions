import type { DonationStatus } from "./common-types"

// Donation
export interface Donation {
  id: string
  cause_id: string
  user_id: string | null
  amount: number
  name: string
  email: string
  message: string | null
  is_anonymous: boolean
  status: DonationStatus
  receipt_url: string | null
  created_at: string
}

// Donation with cause information
export interface DonationWithCause extends Donation {
  cause: {
    title: string
    category: string
  }
}

