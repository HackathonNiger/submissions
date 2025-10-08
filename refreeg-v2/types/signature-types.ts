import type { SignatureStatus } from "./common-types"

// Signature
export interface Signature {
  id: string
  petition_id: string
  user_id: string | null
  amount: number
  name: string
  email: string
  message: string | null
  is_anonymous: boolean
  status: SignatureStatus
  receipt_url: string | null
  created_at: string
}

// Signature with cause information
export interface SignatureWithPetition extends Signature {
  petition: {
    title: string
    category: string
  }
}

