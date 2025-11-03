export interface NavItem {
  href: string;
  label: string;
  shortLabel?: string;
  icon: string;
  muiIcon: string;
  description?: string;
}

export const navItems: NavItem[] = [
  { 
    href: "/", 
    label: "Home", 
    shortLabel: "Home", 
    icon: "🏠",
    muiIcon: "Home",
    description: "Welcome to GreenKudi"
  },
  { 
    href: "/map", 
    label: "Waste Hotspot Map", 
    shortLabel: "Map", 
    icon: "🗺️",
    muiIcon: "Map",
    description: "Report and view waste hotspots"
  },
  { 
    href: "/centers", 
    label: "Centers", 
    shortLabel: "Centers", 
    icon: "♻️",
    muiIcon: "Recycling",
    description: "Find recycling centers"
  },
  { 
    href: "/rewards", 
    label: "Rewards", 
    shortLabel: "Rewards", 
    icon: "🎁",
    muiIcon: "CardGiftcard",
    description: "Earn points and redeem rewards"
  },
  { 
    href: "/dashboard", 
    label: "Dashboard", 
    shortLabel: "Data", 
    icon: "📊",
    muiIcon: "Dashboard",
    description: "Analytics and insights"
  },
];
