import { LucideIcon } from "lucide-react";

export type elementProps = {
  className?: string;
  children?: React.ReactNode;
};
export type typographyProps = elementProps & {
  color?:
    | "text-primary"
    | "text-secondary"
    | "text-primary-foreground"
    | "text-secondary-foreground"
    | "text-popover"
    | "text-gray-400";
};

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  countryOfResidence: string;
  DOB: string;
  phoneNumber: string;
  bvn: number;
  nin: number;
  pin: number;
  donationPreference: string;
  profileImage: string;
  accDetails?: {
    account_number: string;
    subaccount_code: string;
    bank_name: string;
    account_name: string;
  }[];
  isVerified: boolean;
  createdAt: Date | string | number;
  updatedAt: Date | string | number;
  followersCount?: number;
  followingCount?: number;
  causesCount?: number;
  userType?: "individual" | "organization";
  bio: string;
  cryptoWallets?: {
    [network: string]: string; // Just store the address directly
  };
}

export interface Country {
  name: {
    common: string;
    official: string;
    nativeName: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
  tld: string[];
  cca2: string;
  ccn3: string;
  cca3: string;
  independent: boolean;
  status: string;
  unMember: boolean;
  currencies: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  capital: string[];
  altSpellings: string[];
  region: string;
  languages: {
    [key: string]: string;
  };
  translations: {
    [key: string]: {
      official: string;
      common: string;
    };
  };
  latlng: [number, number];
  landlocked: boolean;
  area: number;
  demonyms: {
    eng: {
      f: string;
      m: string;
    };
  };
  flag: string;
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
  population: number;
  car: {
    signs: string[];
    side: string;
  };
  timezones: string[];
  continents: string[];
  flags: {
    png: string;
    svg: string;
  };
  coatOfArms: object;
  startOfWeek: string;
  capitalInfo: {
    latlng: [number, number];
  };
}

export interface SortedCountry {
  name: {
    common: string;
    official: string;
    nativeName: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
  flags: {
    png: string;
    svg: string;
  };
}

export type DonationHistory = {
  id: number;
  amount: number;
  cause: string;
  dateTime: string;
  transactionId: string;
  paymentMethod: string;
};

export type CauseTable = {
  id: number;
  name: string;
  metrics: string;
  status: "Pending" | "Approved" | "Completed";
};
export type SignedPetitions = {
  id: number;
  cause: string;
  dates: string;
  times: string;
};
type CauseSections = {
  id: number;
  header: string;
  description: string;
};

export type Cause = {
  id: string;
  causeTitle: string;
  description: string;
  sections: CauseSections[]; // Adjust the type based on your actual structure
  uploadedImage: {
    src: string;
    name: string;
    size: number;
    type: string;
    progress: number;
  };

  img: string;
  userId: string;
  zipCode: string;
  goalAmount: number;
  deadline: string;
  causeCategory: string;
  state: string;
  currency: string;
  raisedAmount: number;
  donationCount:number;
  profileImage: string;
  isBookmarked: boolean;
  onRemoveBookmark?: (id: string) => void;
  daysLeft: string; // Add this
  progressPercentage: number; // Add this
  keywords: string[];
};

export interface TransactionData
  extends Pick<User, "email" | "firstName" | "lastName" | "id"> {
  amount: number;
  serviceFee: number;
  causeId: string;
  subaccounts: {
    subaccount: string;
    share: number;
  }[];
}
export interface Transaction {
  id: string;
  amount: number;
  causeId: string;
  userId: string;
  timestamp: string;
  customer_name: string;
}

export interface ICreateSubaccount {
  bank_code: string;
  account_number: string;
  percentage_charge?: number;
  business_name: string;
}

export interface MainCauseCardProps
  extends Omit<
    Cause,
    | "sections"
    | "userId"
    | "zipCode"
    | "deadline"
    | "causeCategory"
    | "state"
    | "currency"
  > {
  daysLeft: string;
  progressPercentage: number;
  tags?: string[];
  hideDescription?: boolean;
  hideTags?: boolean;
  hideButton?: boolean;
  isBookmarked: boolean; // Add isBookmarked to the interface
}

export type CauseCategory = {
  name: string;
  icon: LucideIcon;
};
