import React from "react";
import { FaHeartbeat, FaMapMarkerAlt } from "react-icons/fa";
import { CauseTable, DonationHistory, SignedPetitions } from "@/lib/type";
import {
  Info,
  ShieldCheck,
  User,
  Users,
  HeartHandshake,
  CreditCard,
  FileText,
  BadgeCheck,
  HelpCircle,
  MessageSquare,
  Bug,
  KeyRound,
  PhoneCall,
} from "lucide-react";
export const causesData = [
  {
    id: 1,
    imageSrc: "/images/cancerFoundation.png",
    altText: "Cancer foundation",
    profileImageSrc: "/images/cancerEllipse.svg",
    title: "Cancer foundation",
    daysLeft: "15 days left",
    progressPercentage: 85,
    donationAmount: 1700000,
    goalAmount: 2000000,
    description:
      "This cause is for Ikemefuna, a Nigerian boy that needs surgery for his cancer and is seeking your funding for the sum of 100m more...",
    tags: [
      {
        icon: React.createElement(FaHeartbeat, { className: "mr-1" }),
        text: "Healthcare",
      },
      {
        icon: React.createElement(FaMapMarkerAlt, { className: "mr-1" }),
        text: "Abuja, Nigeria",
      },
    ],
  },
  {
    id: 2,
    imageSrc: "/images/flood1.png",
    altText: "Maiduguri flood",
    profileImageSrc: "/images/maiduguriEllipse1.png",
    title: "Maiduguri flood",
    daysLeft: "15 days left",
    progressPercentage: 65,
    donationAmount: 1300000,
    goalAmount: 2000000,
    tags: [
      {
        icon: React.createElement(FaHeartbeat, { className: "mr-1" }),
        text: "Disaster Relief",
      },
      {
        icon: React.createElement(FaMapMarkerAlt, { className: "mr-1" }),
        text: "Maiduguri, Nigeria",
      },
    ],
  },
  {
    id: 3,
    imageSrc: "/images/flood1.png",
    altText: "Maiduguri flood",
    profileImageSrc: "/images/maiduguriEllipse1.png",
    title: "Maiduguri flood",
    daysLeft: "15 days left",
    progressPercentage: 65,
    donationAmount: 1300000,
    goalAmount: 2000000,
    tags: [
      {
        icon: React.createElement(FaHeartbeat, { className: "mr-1" }),
        text: "Disaster Relief",
      },
      {
        icon: React.createElement(FaMapMarkerAlt, { className: "mr-1" }),
        text: "Maiduguri, Nigeria",
      },
    ],
  },
  {
    id: 4,
    imageSrc: "/images/flood1.png",
    altText: "Maiduguri flood",
    profileImageSrc: "/images/maiduguriEllipse1.png",
    title: "Maiduguri flood",
    daysLeft: "15 days left",
    progressPercentage: 65,
    donationAmount: 1300000,
    goalAmount: 2000000,
    tags: [
      {
        icon: React.createElement(FaHeartbeat, { className: "mr-1" }),
        text: "Disaster Relief",
      },
      {
        icon: React.createElement(FaMapMarkerAlt, { className: "mr-1" }),
        text: "Maiduguri, Nigeria",
      },
    ],
  },
  {
    id: 5,
    imageSrc: "/images/flood1.png",
    altText: "Maiduguri flood",
    profileImageSrc: "/images/maiduguriEllipse1.png",
    title: "Maiduguri flood",
    daysLeft: "15 days left",
    progressPercentage: 65,
    donationAmount: 1300000,
    goalAmount: 2000000,
    tags: [
      {
        icon: React.createElement(FaHeartbeat, { className: "mr-1" }),
        text: "Disaster Relief",
      },
      {
        icon: React.createElement(FaMapMarkerAlt, { className: "mr-1" }),
        text: "Maiduguri, Nigeria",
      },
    ],
  },
  {
    id: 6,
    imageSrc: "/images/flood1.png",
    altText: "Maiduguri flood",
    profileImageSrc: "/images/maiduguriEllipse1.png",
    title: "Maiduguri flood",
    daysLeft: "15 days left",
    progressPercentage: 65,
    donationAmount: 1300000,
    goalAmount: 2000000,
    tags: [
      {
        icon: React.createElement(FaHeartbeat, { className: "mr-1" }),
        text: "Disaster Relief",
      },
      {
        icon: React.createElement(FaMapMarkerAlt, { className: "mr-1" }),
        text: "Maiduguri, Nigeria",
      },
    ],
  },
  {
    id: 7,
    imageSrc: "/images/flood1.png",
    altText: "Maiduguri flood",
    profileImageSrc: "/images/maiduguriEllipse1.png",
    title: "Maiduguri flood",
    daysLeft: "15 days left",
    progressPercentage: 65,
    donationAmount: 1300000,
    goalAmount: 2000000,
    tags: [
      {
        icon: React.createElement(FaHeartbeat, { className: "mr-1" }),
        text: "Disaster Relief",
      },
      {
        icon: React.createElement(FaMapMarkerAlt, { className: "mr-1" }),
        text: "Maiduguri, Nigeria",
      },
    ],
  },
  {
    id: 8,
    imageSrc: "/images/flood1.png",
    altText: "Maiduguri flood",
    profileImageSrc: "/images/maiduguriEllipse1.png",
    title: "Maiduguri flood",
    daysLeft: "15 days left",
    progressPercentage: 65,
    donationAmount: 1300000,
    goalAmount: 2000000,
    tags: [
      {
        icon: React.createElement(FaHeartbeat, { className: "mr-1" }),
        text: "Disaster Relief",
      },
      {
        icon: React.createElement(FaMapMarkerAlt, { className: "mr-1" }),
        text: "Maiduguri, Nigeria",
      },
    ],
  },
  {
    id: 9,
    imageSrc: "/images/flood1.png",
    altText: "Maiduguri flood",
    profileImageSrc: "/images/maiduguriEllipse1.png",
    title: "Maiduguri flood",
    daysLeft: "15 days left",
    progressPercentage: 65,
    donationAmount: 1300000,
    goalAmount: 2000000,
    tags: [
      {
        icon: React.createElement(FaHeartbeat, { className: "mr-1" }),
        text: "Disaster Relief",
      },
      {
        icon: React.createElement(FaMapMarkerAlt, { className: "mr-1" }),
        text: "Maiduguri, Nigeria",
      },
    ],
  },
  // Add more causes here
];

export const causes = [
  {
    imageSrc: "/images/radio.svg",
    title: "Vocational Training",
    points: [
      "Empowering Artisans: We provide vocational training to individuals, helping them acquire valuable skills to become proficient artisans.",
      "Economic Contribution: By gaining these skills, individuals can join the labor force, contributing to the nation’s GDP and overall economic growth.",
    ],
    linkHref: "#",
  },
  {
    imageSrc: "/images/radio.svg",
    title: "Support for GBV Victims",
    points: [
      "Holistic Recovery: We offer comprehensive support to victims of gender-based violence, aiding in both their emotional and physical healing.",
      "Safe Spaces: Our initiatives include creating safe spaces and providing necessary resources to help victims rebuild their lives.",
    ],
    linkHref: "#",
  },
  {
    imageSrc: "/images/radio.svg",
    title: "Education",
    points: [
      "Access to Education: We strive to send children of various ages to school, ensuring they have access to quality education.",
      "Future Leaders: By investing in their education, we aim to improve their lives and contribute to the country’s future development.",
    ],
    linkHref: "#",
  },
  {
    imageSrc: "/images/radio.svg",
    title: "Basic Necessities",
    points: [
      "Essential Aid: We provide food, healthcare, shelter, and clothing to those in need, ensuring they have access to basic life necessities.",
      "Health and Well-being: Our support extends to ensuring individuals have access to healthcare services, promoting their overall well-being.",
    ],
    linkHref: "#",
  },
];

export const stories = [
  {
    imageSrc: "/images/radio.svg",
    title: "How It Started",
    points: [
      "It all began with a frustration with traditional donation systems—high transaction fees, lack of transparency, and little accountability. Too often, money meant to help those in need never reaches them due to middlemen, mismanagement, or lack of proper tracking.",
      "We envisioned a better way—a decentralized, community-driven platform where:\n✅ Anyone can raise funds for causes they believe in\n✅ Donors can track how their money is spent\n✅ Every contribution leads to measurable impact\n\nWhat started as a dream quickly became a mission—and now, a growing movement.",
    ],
    linkHref: "#",
  },
  {
    imageSrc: "/images/radio.svg",
    title: "Where We Are Today",
    points: [
      "From helping victims of disasters, to funding education for children, to supporting small businesses in underserved communities, RefreeG has become more than just a crowdfunding platform—it’s a force for social change.",
      "With a thriving community of donors, changemakers, and organizations, we are proving that small acts of generosity can create life-changing ripple effects.\n ✅ Thousands of lives impacted through verified fundraisers\n✅ Millions in donations tracked securely using blockchain\n✅ A growing global community committed to making a difference",
    ],
    linkHref: "#",
  },
  {
    imageSrc: "/images/radio.svg",
    title: "Where We’re Headed",
    points: [
      "We’re just getting started. Our goal is to make RefreeG the go-to crowdfunding platform for Africa, one that not only raises funds but also drives sustainable change.",
      "🔹 More transparency – Strengthening our blockchain-powered tracking system\n🔹 More impact – Expanding partnerships with NGOs, businesses, and institutions\n🔹 More accessibility – Making it easier for anyone to start and support causes We believe in a future where no cause goes unfunded, no dream goes unsupported, and no life goes unchanged.",
    ],
    linkHref: "#",
  },
];

export const faqs = [
  // FEATURES
  {
    category: "features",
    icon: Info,
    question: "What is RefreeG?",
    answer:
      "RefreeG is a blockchain-powered crowdfunding platform designed to help individuals, NGOs, and community-led projects raise funds transparently and efficiently. Whether it's emergency aid, education, or creative work. RefreeG empowers changemakers with tools to create verified causes and receive support.",
  },
  {
    category: "features",
    icon: Users,
    question: "Who can use RefreeG?",
    answer:
      "Anyone! Whether you're an individual, an organization, a creative, or someone trying to raise money for a friend or family member. RefreeG is for you.",
  },
  {
    category: "features",
    icon: ShieldCheck,
    question: "What kind of causes are allowed on RefreeG?",
    answer:
      "RefreeG supports a wide range of causes, including education, medical emergencies, GBV support, food drives, creative projects, and more. We do not allow campaigns that promote hate, fraud, or misinformation.",
  },
  {
    category: "features",
    icon: CreditCard,
    question: "How do I create a cause on RefreeG?",
    answer:
      "Simply sign up, click 'Start a Cause,' and fill in the required details—title, description, goal amount, category, and a banner. Once submitted, our team will review and verify your cause before it goes live.",
  },
  {
    category: "features",
    icon: BadgeCheck,
    question: "How do I know a cause is legitimate?",
    answer:
      "Every cause is vetted by our moderation team. We also provide a 'Verified' badge for approved causes and use blockchain technology to ensure funds are traceable and secure.",
  },
  {
    category: "features",
    icon: ShieldCheck,
    question: "How does RefreeG ensure transparency?",
    answer:
      "RefreeG uses blockchain technology to log and track donations. This ensures that each transaction is immutable and can be traced for accountability and transparency.",
  },
  {
    category: "features",
    icon: ShieldCheck,
    question: "What is blockchain transparency?",
    answer:
      "Blockchain allows every transaction on RefreeG to be recorded on a secure, tamper-proof ledger. This ensures donations are visible, trackable, and accountable—no middlemen, no funny business.",
  },
  {
    category: "features",
    icon: HeartHandshake,
    question: "Can I start a petition on RefreeG?",
    answer:
      "Yes! Our petition system allows anyone to start or support petitions around social, political, or community causes—giving users a way to drive both funding and awareness.",
  },
  {
    category: "features",
    icon: User,
    question: "How do I create an account on RefreeG?",
    answer:
      "To create an account, click on the 'Sign Up' button on the homepage and follow the on-screen instructions to register.",
  },
  {
    category: "features",
    icon: User,
    question: "How can I set up my profile after signing up?",
    answer:
      "After signing up, go to your profile settings and fill out your personal and cause-related details to complete your profile.",
  },
  {
    category: "features",
    icon: Users,
    question: "What is RefreeG's mission?",
    answer:
      "RefreeG aims to provide transparent, secure, and efficient crowdfunding solutions for education and other verified causes across Africa.",
  },
  {
    category: "features",
    icon: HeartHandshake,
    question: "How do I make a donation on RefreeG?",
    answer:
      "To donate, browse through active causes, select one, and choose your preferred payment method such as Paystack (Naira) or cryptocurrency (like MATIC).",
  },
  {
    category: "features",
    icon: CreditCard,
    question: "What is the withdrawal process like?",
    answer:
      "For Naira donations, funds are transferred instantly to the recipient's bank account. For crypto donations, the timeline depends on blockchain network confirmations.",
  },
  {
    category: "features",
    icon: KeyRound,
    question: "How do I reset my RefreeG password?",
    answer:
      "Click on 'Forgot Password?' at the login screen, enter your registered email address, and follow the link sent to your inbox to reset your password.",
  },
  {
    category: "features",
    icon: ShieldCheck,
    question: "Does RefreeG support two-factor authentication (2FA)?",
    answer:
      "Yes, you can enable 2FA in your account settings. It adds an extra layer of security by sending a verification code to your registered email.",
  },

  // RESOURCES
  {
    category: "resources",
    icon: HelpCircle,
    question: "How can I avoid scams on RefreeG?",
    answer:
      "Only donate to verified causes with clear documentation. If you notice any suspicious activity, report it immediately through our support channels.",
  },
  {
    category: "resources",
    icon: FileText,
    question: "Where can I find RefreeG's terms of service?",
    answer:
      "You can review our terms of service in the 'Policy & Compliance' section. It outlines the rules of usage and types of content prohibited on the platform.",
  },
  {
    category: "resources",
    icon: BadgeCheck,
    question: "What is RefreeG's cause verification process?",
    answer:
      "Every submitted cause undergoes a thorough review process, where documents are checked and authenticity is verified before public listing.",
  },
  {
    category: "resources",
    icon: FileText,
    question: "What is RefreeG's refund policy?",
    answer:
      "All donations made on RefreeG are final and non-refundable. We encourage donors to review cause details thoroughly before donating.",
  },
  {
    category: "resources",
    icon: PhoneCall,
    question: "How do I contact RefreeG support?",
    answer:
      "You can reach us via live chat on the platform or send us an email. Our support team is available to assist you with any issues or questions.",
  },
  {
    category: "resources",
    icon: Bug,
    question: "How can I report a problem on RefreeG?",
    answer:
      "If you encounter a bug or suspicious activity, use the 'Report a Problem' option in the support section, and our team will look into it promptly.",
  },
  {
    category: "resources",
    icon: MessageSquare,
    question: "Is there a RefreeG community forum?",
    answer:
      "Yes, our community forum allows users to engage, ask questions, and get help from other community members and moderators.",
  },
];

export const DonationHistoryData: DonationHistory[] = [
  {
    id: 1,
    cause: "Send Children to School",
    amount: 100000,
    dateTime: "2025-05-01 10:00:00",
    transactionId: "#873882",
    paymentMethod: "Card",
  },
  {
    id: 2,
    cause: "Provide Books for Students",
    amount: 50000,
    dateTime: "2025-05-02 11:00:00",
    transactionId: "#873883",
    paymentMethod: "Crypto",
  },
  {
    id: 3,
    cause: "Build a New School",
    amount: 250000,
    dateTime: "2025-05-03 12:00:00",
    transactionId: "#873884",
    paymentMethod: "Card",
  },
  {
    id: 4,
    cause: "Scholarships for Girls",
    amount: 150000,
    dateTime: "2025-05-04 10:00:00",
    transactionId: "#873885",
    paymentMethod: "Crypto",
  },
  {
    id: 5,
    cause: "Donate to the Homeless Shelter",
    amount: 200000,
    dateTime: "2025-05-05 11:00:00",
    transactionId: "#873886",
    paymentMethod: "Card",
  },
  {
    id: 6,
    cause: "Food for Orphanages",
    amount: 180000,
    dateTime: "2025-05-06 12:00:00",
    transactionId: "#873887",
    paymentMethod: "Crypto",
  },
  {
    id: 7,
    cause: "Support Local Farmers",
    amount: 50000,
    dateTime: "2025-05-07 10:00:00",
    transactionId: "#873888",
    paymentMethod: "Card",
  },
  {
    id: 8,
    cause: "Clean Water for Rural Areas",
    amount: 300000,
    dateTime: "2025-05-08 11:00:00",
    transactionId: "#873889",
    paymentMethod: "Crypto",
  },
  {
    id: 9,
    cause: "Empower Women in Tech",
    amount: 120000,
    dateTime: "2025-05-09 12:00:00",
    transactionId: "#873890",
    paymentMethod: "Card",
  },
  {
    id: 10,
    cause: "Medical Aid for Children",
    amount: 180000,
    dateTime: "2025-05-10 10:00:00",
    transactionId: "#873891",
    paymentMethod: "Crypto",
  },
];

export const CausesData: CauseTable[] = [
  {
    id: 1,
    name: "Send Children to School",
    metrics: "₦100,000",
    status: "Pending",
  },
  {
    id: 2,
    name: "Provide Books for Students",
    metrics: "Books",
    status: "Approved",
  },
  {
    id: 3,
    name: "Build a New School",
    metrics: "₦250,000",
    status: "Completed",
  },
  {
    id: 4,
    name: "Scholarships for Girls",
    metrics: "₦150,000",
    status: "Pending",
  },
  {
    id: 5,
    name: "Donate to the Homeless Shelter",
    metrics: "₦200,000",
    status: "Approved",
  },
  { id: 6, name: "Food for Orphanages", metrics: "Food", status: "Completed" },
  {
    id: 7,
    name: "Support Local Farmers",
    metrics: "₦50,000",
    status: "Pending",
  },
  {
    id: 8,
    name: "Clean Water for Rural Areas",
    metrics: "₦300,000",
    status: "Approved",
  },
  {
    id: 9,
    name: "Empower Women in Tech",
    metrics: "₦120,000",
    status: "Pending",
  },
  {
    id: 10,
    name: "Medical Aid for Children",
    metrics: "₦180,000",
    status: "Completed",
  },
  {
    id: 11,
    name: "New Classroom Desks",
    metrics: "₦80,000",
    status: "Approved",
  },
  {
    id: 12,
    name: "Solar Panels for Schools",
    metrics: "₦400,000",
    status: "Pending",
  },
  {
    id: 13,
    name: "Build a New School",
    metrics: "₦250,000",
    status: "Completed",
  },
  {
    id: 14,
    name: "Scholarships for Girls",
    metrics: "₦150,000",
    status: "Pending",
  },
  {
    id: 15,
    name: "Donate to the Homeless Shelter",
    metrics: "₦200,000",
    status: "Approved",
  },
  { id: 16, name: "Food for Orphanages", metrics: "Food", status: "Completed" },
  {
    id: 17,
    name: "Support Local Farmers",
    metrics: "₦50,000",
    status: "Pending",
  },
  {
    id: 18,
    name: "Clean Water for Rural Areas",
    metrics: "₦300,000",
    status: "Approved",
  },
  {
    id: 19,
    name: "Empower Women in Tech",
    metrics: "₦120,000",
    status: "Pending",
  },
  {
    id: 20,
    name: "Medical Aid for Children",
    metrics: "₦180,000",
    status: "Completed",
  },
  {
    id: 21,
    name: "New Classroom Desks",
    metrics: "₦80,000",
    status: "Approved",
  },
  {
    id: 22,
    name: "Solar Panels for Schools",
    metrics: "₦400,000",
    status: "Pending",
  },
];

export const SignedPetitionsData: SignedPetitions[] = [
  {
    id: 1,
    cause: "Send Children to School",
    dates: "2025-05-01",
    times: "10:00 AM",
  },
  {
    id: 2,
    cause: "Provide Books for Students",
    dates: "2025-05-02",
    times: "10:00 AM",
  },
  {
    id: 3,
    cause: "Build a New School",
    dates: "2025-05-03",
    times: "10:00 AM",
  },
  {
    id: 4,
    cause: "Scholarships for Girls",
    dates: "2025-05-04",
    times: "10:00 AM",
  },
  {
    id: 5,
    cause: "Donate to the Homeless Shelter",
    dates: "2025-05-05",
    times: "10:00 AM",
  },
  {
    id: 6,
    cause: "Food for Orphanages",
    dates: "2025-05-06",
    times: "10:00 AM",
  },
  {
    id: 7,
    cause: "Support Local Farmers",
    dates: "2025-05-07",
    times: "10:00 AM",
  },
  {
    id: 8,
    cause: "Clean Water for Rural Areas",
    dates: "2025-05-08",
    times: "10:00 AM",
  },
  {
    id: 9,
    cause: "Empower Women in Tech",
    dates: "2025-05-09",
    times: "10:00 AM",
  },
  {
    id: 10,
    cause: "Medical Aid for Children",
    dates: "2025-05-10",
    times: "10:00 AM",
  },
  {
    id: 11,
    cause: "New Classroom Desks",
    dates: "2025-05-11",
    times: "10:00 AM",
  },
  {
    id: 12,
    cause: "Solar Panels for Schools",
    dates: "2025-05-12",
    times: "10:00 AM",
  },
  {
    id: 13,
    cause: "University Scholarships",
    dates: "2025-05-13",
    times: "10:00 AM",
  },
  {
    id: 14,
    cause: "Rural Teacher Salaries",
    dates: "2025-05-14",
    times: "10:00 AM",
  },
  {
    id: 15,
    cause: "School Lunch Program",
    dates: "2025-05-15",
    times: "10:00 AM",
  },
  {
    id: 16,
    cause: "Library Renovation",
    dates: "2025-05-16",
    times: "10:00 AM",
  },
  {
    id: 17,
    cause: "STEM Programs for Girls",
    dates: "2025-05-17",
    times: "10:00 AM",
  },
  {
    id: 18,
    cause: "Tech Equipment for Schools",
    dates: "2025-05-18",
    times: "10:00 AM",
  },
  {
    id: 19,
    cause: "Support for Disabled Students",
    dates: "2025-05-19",
    times: "10:00 AM",
  },
  {
    id: 20,
    cause: "School Bus for Rural Kids",
    dates: "2025-05-20",
    times: "10:00 AM",
  },
  {
    id: 21,
    cause: "After-School Programs",
    dates: "2025-05-21",
    times: "10:00 AM",
  },
  {
    id: 22,
    cause: "Refurbish Old Schools",
    dates: "2025-05-22",
    times: "10:00 AM",
  },
  {
    id: 23,
    cause: "Educational Workshops",
    dates: "2025-05-23",
    times: "10:00 AM",
  },
  {
    id: 24,
    cause: "Literacy Program for Adults",
    dates: "2025-05-24",
    times: "10:00 AM",
  },
  {
    id: 25,
    cause: "Donate School Uniforms",
    dates: "2025-05-25",
    times: "10:00 AM",
  },
  {
    id: 26,
    cause: "Science Lab for Schools",
    dates: "2025-05-26",
    times: "10:00 AM",
  },
  {
    id: 27,
    cause: "Digital Learning Materials",
    dates: "2025-05-27",
    times: "10:00 AM",
  },
  { id: 28, cause: "Mobile Libraries", dates: "2025-05-28", times: "10:00 AM" },
  {
    id: 29,
    cause: "Coding Bootcamp for Kids",
    dates: "2025-05-29",
    times: "10:00 AM",
  },
  {
    id: 30,
    cause: "Eco-Friendly Schools",
    dates: "2025-05-30",
    times: "10:00 AM",
  },
  {
    id: 31,
    cause: "Tutoring for Orphans",
    dates: "2025-05-31",
    times: "10:00 AM",
  },
  {
    id: 32,
    cause: "Mental Health Support for Students",
    dates: "2025-06-01",
    times: "10:00 AM",
  },
];
