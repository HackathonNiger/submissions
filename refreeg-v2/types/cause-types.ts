import type { CauseStatus } from "./common-types";

// Cause
export interface Cause {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  goal: number;
  raised: number;
  status: CauseStatus;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  image?: string | null;
  days_active?: number | null;
  multimedia?: string[]; // Array of image URLs
  video_links?: string[]; // Array of video URLs
  profiles?: {
    full_name: string;
    email: string;
    profile_photo: string | null;
  };
}
export interface subHeadings {
  id: string;
  title: string;
  cause_id: string;
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
export interface CauseWithSubHeading extends Cause {
  sub_heading: subHeadingWithSubDescription[];
}

// Cause with user information
export interface CauseWithUser extends Cause {
  user: {
    name: string;
    email: string;
    sub_account_code?: string;
    profile_photo?: string | null;
  };
}

// Category
export interface Category {
  id: string;
  name: string;
}

// Cause form data
export interface CauseFormData {
  title: string;
  description: string;
  category: string;
  goal: string | number;
  currency: string;
  coverImage: File | null;
  sections?: { heading: string; description: string }[];
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  multimedia: File[]; // Image files only
  video_links?: string[]; // Video URLs
}
