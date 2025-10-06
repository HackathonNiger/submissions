import { 
  Building2, 
  Smartphone, 
  Landmark, 
  Heart, 
  Edit3, 
  HeartPulse,
  BarChart3,
  ShieldCheck,
  Microscope,
  Monitor as MonitorIcon,
  Activity, 
  Edit,
  Monitor,
  Cpu, 
  Hospital,
  Truck,
  ShoppingCart,
  Factory,
  CheckCheck,
  Stethoscope,
  FlaskConical,
  BookOpen,
  ClipboardList,
  ClipboardCheck,
  Rocket, 
  Baby,
  ArrowRight, 
  TrendingUp,
  Users,
   Settings,
  FileCheck,
  Gavel,
   Network,
  Briefcase,
  DollarSign,
  MapPin
} from "lucide-react";

const  CareerpathData = {
  "Computer Science": [
    {
      id: "fintech",
      name: "Financial Technology",
      icon: DollarSign,
      description: "Revolutionary financial services sector",
      jobCount: "1,800+ jobs", 
      salaryRange: "₦300K - ₦3M",
      growth: "+40% annually",
      companies: ["PiggyVest", "Kuda", "Carbon"]
    },
    {
      id: "banking",
      name: "Banking & Finance",
      icon: Building2,
      description: "Traditional and digital banking solutions",
      jobCount: "3,200+ jobs",
      salaryRange: "₦250K - ₦1.5M", 
      growth: "+15% annually",
      companies: ["GTBank", "Access Bank", "Zenith Bank"]
    },
    {
      id: "government",
      name: "Government & Public Sector",
      icon: Landmark,
      description: "Digital transformation in public services",
      jobCount: "800+ jobs",
      salaryRange: "₦150K - ₦800K",
      growth: "+20% annually",
      companies: ["NITDA", "Galaxy Backbone", "NCC"]
    },
    {
      id: "startups",
      name: "Startups & Innovation",
      icon: Rocket,
      description: "Join the next generation of Nigerian unicorns",
      jobCount: "1,500+ jobs",
      salaryRange: "₦180K - ₦2.5M",
      growth: "+35% annually", 
      companies: ["54gene", "Kobo360", "Andela"]
    }
  ],
    "Law": [
    {
      id: "legal-practice",
      name: "Legal Practice",
      icon: Gavel, 
      description: "Work in law firms, courts, and legal advocacy",
      jobCount: "2,500+ jobs",
      salaryRange: "₦250K - ₦1.5M",
      growth: "+10% annually",
      companies: ["Aluko & Oyebode", "Gani Fawehinmi Chambers", "Babalakin & Co."]
    },
    {
      id: "corporate-law",
      name: "Corporate & Commercial Law",
      icon: Briefcase,
      description: "Handle legal issues in business, banking, oil & gas, and tech",
      jobCount: "1,700+ jobs",
      salaryRange: "₦300K - ₦2M",
      growth: "+15% annually",
      companies: ["MTN Legal", "UBA Legal", "Chevron Legal"]
    },
    {
      id: "regulatory-compliance",
      name: "Regulatory Compliance & Governance",
      icon: FileCheck,
      description: "Ensure company and sector compliance with regulations",
      jobCount: "1,100+ jobs",
      salaryRange: "₦180K - ₦1.2M",
      growth: "+12% annually",
      companies: ["CBN", "SEC Nigeria", "NDIC"]
    },
    {
      id: "legal-writing",
      name: "Legal Publishing & Content",
      icon: Edit3,
      description: "Research and write legal content for education and media",
      jobCount: "600+ jobs",
      salaryRange: "₦150K - ₦800K",
      growth: "+8% annually",
      companies: ["LawPavilion", "Nigerian Law School", "Channels TV"]
    }
  ],
    "Information Technology": [
    {
      id: "it-support",
      name: "IT Support & Services",
      icon: Settings,
      description: "Technical support and IT service management in various industries",
      jobCount: "3,000+ jobs",
      salaryRange: "₦150K - ₦1M",
      growth: "+20% annually",
      companies: ["MTN", "Glo", "Airtel", "NIBSS"]
    },
    {
      id: "networking",
      name: "Networking & Infrastructure",
      icon: Network,
      description: "Design, deploy, and secure enterprise networks",
      jobCount: "2,200+ jobs",
      salaryRange: "₦200K - ₦1.5M",
      growth: "+18% annually",
      companies: ["Cisco", "MainOne", "Galaxy Backbone"]
    },
    {
      id: "it-consulting",
      name: "IT Consulting & Business Solutions",
      icon: Briefcase,
      description: "Aligning tech with business strategies",
      jobCount: "1,700+ jobs",
      salaryRange: "₦250K - ₦2M",
      growth: "+22% annually",
      companies: ["Accenture", "Deloitte", "Softcom"]
    }
  ],
    "Software Engineering": [
    {
      id: "tech-product-dev",
      name: "Tech Product Development",
      icon: Monitor,
      description: "Build, test, and scale software solutions for consumers and enterprises",
      jobCount: "3,000+ jobs",
      salaryRange: "₦300K - ₦2.5M",
      growth: "+30% annually",
      companies: ["Andela", "Moniepoint", "Paga"]
    },
    {
      id: "embedded-systems",
      name: "Embedded Systems & IoT",
      icon: Cpu,
      description: "Design software that integrates with hardware in electronics and devices",
      jobCount: "1,200+ jobs",
      salaryRange: "₦350K - ₦2M",
      growth: "+18% annually",
      companies: ["Zinox", "Ardova", "Innoson"]
    },
    {
      id: "qa-and-testing",
      name: "Quality Assurance & Testing",
      icon: CheckCheck,
      description: "Ensure software quality through manual and automated testing",
      jobCount: "1,400+ jobs",
      salaryRange: "₦250K - ₦1.2M",
      growth: "+22% annually",
      companies: ["Testify", "Decagon", "Hotels.ng"]
    },
    {
      id: "devops-and-infra",
      name: "DevOps & Cloud Infrastructure",
      icon: Settings,
      description: "Deploy, monitor, and scale applications on modern infrastructure",
      jobCount: "2,100+ jobs",
      salaryRange: "₦350K - ₦2M",
      growth: "+25% annually",
      companies: ["AWS Nigeria", "Netcom Africa", "Cloudflare NG"]
    },
    {
      id: "tech-consulting",
      name: "IT & Software Consulting",
      icon: Users,
      description: "Work with clients to design and implement tech solutions",
      jobCount: "1,800+ jobs",
      salaryRange: "₦300K - ₦1.8M",
      growth: "+15% annually",
      companies: ["Softcom", "KPMG Tech", "Ernst & Young"]
    }
  ],
  "Nursing": [
  {
    id: "clinical-nursing",
    name: "Clinical Nursing",
    icon: Stethoscope,
    description: "Direct patient care in hospitals, clinics, and health centers",
    jobCount: "4,000+ jobs",
    salaryRange: "₦150K - ₦900K",
    growth: "+12% annually",
    companies: ["LUTH", "Reddington Hospital", "St. Nicholas Hospital"]
  },
  {
    id: "maternal-child-health",
    name: "Maternal & Child Health",
    icon: Baby,
    description: "Focus on pregnancy, delivery, and early child care",
    jobCount: "1,500+ jobs",
    salaryRange: "₦180K - ₦800K",
    growth: "+10% annually",
    companies: ["Primary Health Care Centres", "UNICEF", "Wellbeing Foundation Africa"]
  },
  {
    id: "public-health",
    name: "Community & Public Health Nursing",
    icon: Users,
    description: "Promote wellness and disease prevention at the community level",
    jobCount: "1,800+ jobs",
    salaryRange: "₦200K - ₦1M",
    growth: "+15% annually",
    companies: ["WHO", "Ministry of Health", "NPHCDA"]
  },
  {
    id: "nurse-education",
    name: "Nursing Education & Training",
    icon: BookOpen,
    description: "Teach and train future nurses in clinical and academic settings",
    jobCount: "900+ jobs",
    salaryRange: "₦250K - ₦1.2M",
    growth: "+10% annually",
    companies: ["Schools of Nursing", "University Teaching Hospitals", "NMCN"]
  },
  {
    id: "rehab-palliative",
    name: "Rehabilitation & Palliative Care",
    icon: HeartPulse,
    description: "Provide long-term care, comfort, and recovery support",
    jobCount: "1,100+ jobs",
    salaryRange: "₦180K - ₦750K",
    growth: "+8% annually",
    companies: ["Hospice Nigeria", "Healing Streams Centre", "NGOs"]
  }
],
"Medicine": [
  {
    id: "clinical-medicine",
    name: "Clinical Practice",
    icon: Stethoscope,
    description: "Diagnose and treat patients in hospitals or private clinics",
    jobCount: "5,000+ jobs",
    salaryRange: "₦300K - ₦1.8M",
    growth: "+10% annually",
    companies: ["LUTH", "Eko Hospital", "NIMR"]
  },
  {
    id: "public-health",
    name: "Public Health & Epidemiology",
    icon: Activity,
    description: "Promote population health and manage disease outbreaks",
    jobCount: "2,100+ jobs",
    salaryRange: "₦250K - ₦1.5M",
    growth: "+13% annually",
    companies: ["WHO", "NCDC", "Ministry of Health"]
  },
  {
    id: "medical-research",
    name: "Medical Research",
    icon: FlaskConical,
    description: "Conduct scientific research in biomedicine and health innovation",
    jobCount: "1,400+ jobs",
    salaryRange: "₦300K - ₦2M",
    growth: "+15% annually",
    companies: ["NIMR", "WHO", "Biovaccines Nigeria"]
  },
  {
    id: "medical-education",
    name: "Medical Education",
    icon: BookOpen,
    description: "Teach, train, and mentor future healthcare professionals",
    jobCount: "800+ jobs",
    salaryRange: "₦280K - ₦1.2M",
    growth: "+9% annually",
    companies: ["University Teaching Hospitals", "College of Medicine", "CMDs"]
  },
  {
    id: "healthcare-management",
    name: "Healthcare Administration",
    icon: ClipboardList,
    description: "Oversee operations and policy in hospitals and health organizations",
    jobCount: "1,600+ jobs",
    salaryRange: "₦250K - ₦1.4M",
    growth: "+11% annually",
    companies: ["NHIS", "Private Hospitals", "HMO Providers"]
  }
],
"Business Administration": [
  {
    id: "operations-management",
    name: "Operations Management",
    icon: Truck,
    description: "Oversee daily business activities, supply chains, and internal operations",
    jobCount: "3,200+ jobs",
    salaryRange: "₦200K - ₦1.5M",
    growth: "+10% annually",
    companies: ["Nestlé", "Dangote Group", "Unilever"]
  },
  {
    id: "human-resources",
    name: "Human Resources & Talent",
    icon: Users,
    description: "Recruit, manage, and develop people in organizations",
    jobCount: "2,800+ jobs",
    salaryRange: "₦180K - ₦1.2M",
    growth: "+11% annually",
    companies: ["Jobberman", "Access Bank HR", "MTN"]
  },
  {
    id: "sales-business-dev",
    name: "Sales & Business Development",
    icon: BarChart3,
    description: "Drive revenue, manage key accounts, and grow the customer base",
    jobCount: "3,500+ jobs",
    salaryRange: "₦200K - ₦2M",
    growth: "+13% annually",
    companies: ["PZ Cussons", "Flutterwave", "Globacom"]
  },
  {
    id: "management-consulting",
    name: "Management Consulting",
    icon: Briefcase,
    description: "Help organizations improve efficiency and solve business problems",
    jobCount: "1,600+ jobs",
    salaryRange: "₦300K - ₦2.2M",
    growth: "+14% annually",
    companies: ["McKinsey", "PwC", "KPMG"]
  },
  {
    id: "project-management",
    name: "Project Management",
    icon: ClipboardCheck,
    description: "Plan and manage key projects across industries like IT, construction, oil & gas",
    jobCount: "2,400+ jobs",
    salaryRange: "₦250K - ₦1.8M",
    growth: "+12% annually",
    companies: ["TotalEnergies", "Softcom", "Shell"]
  }
],
"Pharmacy": [
  {
    id: "hospital-pharmacy",
    name: "Hospital & Clinical Pharmacy",
    icon: Hospital,
    description: "Manage and dispense medications within hospitals and clinics",
    jobCount: "2,800+ jobs",
    salaryRange: "₦200K - ₦1M",
    growth: "+10% annually",
    companies: ["UCH", "LUTH", "Reddington Hospital"]
  },
  {
    id: "community-pharmacy",
    name: "Retail & Community Pharmacy",
    icon: ShoppingCart,
    description: "Dispense drugs and advise customers in community pharmacies",
    jobCount: "2,000+ jobs",
    salaryRange: "₦150K - ₦700K",
    growth: "+9% annually",
    companies: ["HealthPlus", "Medplus", "Pharmhouse"]
  },
  {
    id: "pharma-industry",
    name: "Pharmaceutical Industry",
    icon: Factory,
    description: "Engage in production, regulation, and quality control of drugs",
    jobCount: "1,500+ jobs",
    salaryRange: "₦250K - ₦1.5M",
    growth: "+12% annually",
    companies: ["Emzor Pharma", "Fidson", "May & Baker"]
  },
  {
    id: "regulatory-affairs",
    name: "Regulatory & Drug Safety",
    icon: ShieldCheck,
    description: "Ensure drug safety, compliance, and regulatory submissions",
    jobCount: "1,200+ jobs",
    salaryRange: "₦300K - ₦1.3M",
    growth: "+13% annually",
    companies: ["NAFDAC", "PCN", "WHO"]
  },
  {
    id: "clinical-research",
    name: "Clinical Trials & Research",
    icon: Microscope,
    description: "Conduct studies to test drug safety and effectiveness",
    jobCount: "900+ jobs",
    salaryRange: "₦280K - ₦1.2M",
    growth: "+14% annually",
    companies: ["NIMR", "NIMET", "GlaxoSmithKline"]
  }
],
  "Economics": [
    {
      id: "banking",
      name: "Banking & Finance",
      icon: Building2,
      description: "Economic analysis and financial services",
      jobCount: "2,800+ jobs",
      salaryRange: "₦200K - ₦1.2M",
      growth: "+12% annually",
      companies: ["CBN", "First Bank", "UBA"]
    },
    {
      id: "government",
      name: "Government & Policy",
      icon: Landmark,
      description: "Economic policy and public administration",
      jobCount: "1,200+ jobs",
      salaryRange: "₦180K - ₦900K",
      growth: "+8% annually",
      companies: ["Ministry of Finance", "FIRS", "NBS"]
    },
    {
      id: "consulting",
      name: "Consulting Services",
      icon: Users,
      description: "Strategic advisory and economic consulting",
      jobCount: "600+ jobs",
      salaryRange: "₦300K - ₦2M",
      growth: "+18% annually",
      companies: ["McKinsey", "PwC", "Deloitte"]
    }
  ]
};


export default CareerpathData;