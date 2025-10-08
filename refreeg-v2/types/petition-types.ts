import type { PetitionStatus } from "./common-types";

// Petition
export interface Petition {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  goal: number;
  raised: number;
  status: PetitionStatus;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  image?: string | null;
  days_active?: number | null;
  profiles?: {
    full_name: string;
    email: string;
  };
}
export interface subHeadings {
  id: string;
  title: string;
  petition_id: string;
  created_at: string;
}
export interface subDescription {
  id: string;
  description: string;
  sub_heading_id: string;
  created_at: string;
}
export interface subHeadingWithSubDescription extends subHeadings {
  sub_description: subDescription[];
}
export interface PetitionWithSubHeading extends Petition {
  sub_heading: subHeadingWithSubDescription[];
}

// Petition with user information
export interface PetitionWithUser extends Petition {
  user: {
    name: string;
    email: string;
  };
}

// Category
export interface Category {
  id: string;
  name: string;
}

// Petition form data
export interface PetitionFormData {
  title: string;
  description: string;
  category: string;
  goal: string | number;
  coverImage: File | null;
  sections?: { heading: string; description: string }[];
  startDate?: Date | undefined;
  endDate?: Date | undefined;
}
