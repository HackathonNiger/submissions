import { 
  Monitor, 
  Shield, 
  Settings, 
  BarChart3, 
  ArrowRight,
  Users,
  Heart,
} from "lucide-react";


const RolesData = {
  /* Software Engineering */ //should be computer science
 
  "embedded-systems": [
    {
      id: "firmware-developer",
      name: "Firmware Developer",
      // icon: Chip,
       icon:Heart,
      description: "Write low-level software for embedded devices and microcontrollers",
      level: "Mid to Senior",
      avgSalary: "₦350K - ₦1.8M",
      demand: "Medium",
      skills: ["C/C++", "Real-time Systems", "Hardware Interfaces", "Debugging", "GPIO"]
    },
    {
      id: "iot-engineer",
      name: "IoT Engineer",
      // icon: Wifi,
       icon:Heart,
      description: "Build connected devices and integrate them into data ecosystems",
      level: "Entry to Mid",
      avgSalary: "₦300K - ₦1.5M",
      demand: "High",
      skills: ["MQTT", "Sensors", "Edge Computing", "Networking", "Security"]
    },
    {
      id: "embedded-test-engineer",
      name: "Embedded Test Engineer",
      // icon: CheckSquare,
       icon:Heart,
      description: "Validate and test embedded systems for reliability and correctness",
      level: "Entry to Mid",
      avgSalary: "₦250K - ₦1.2M",
      demand: "Medium",
      skills: ["Hardware Testing", "Automation", "Signal Integrity", "Debug Tools", "Scripting"]
    }
  ],
  "qa-and-testing": [
    {
      id: "qa-engineer",
      name: "Quality Assurance Engineer",
      // icon: ClipboardCheck,
       icon:Heart,
      description: "Design and run test plans to ensure product quality",
      level: "Entry to Mid",
      avgSalary: "₦250K - ₦1.2M",
      demand: "High",
      skills: ["Test Automation", "Selenium", "Test Case Design", "Bug Tracking", "Regression Testing"]
    },
    {
      id: "automation-tester",
      name: "Automation Tester",
      // icon: Robot,
       icon:Heart,
      description: "Build and maintain automated test suites for continuous delivery",
      level: "Mid Level",
      avgSalary: "₦300K - ₦1.5M",
      demand: "High",
      skills: ["Python/Java", "CI/CD", "Framework Design", "API Testing", "Reporting"]
    },
    {
      id: "performance-engineer",
      name: "Performance Engineer",
      // icon: Speedometer,
       icon:Heart,
      description: "Ensure systems scale and perform under load",
      level: "Mid to Senior",
      avgSalary: "₦400K - ₦2M",
      demand: "Medium",
      skills: ["Load Testing", "Profiling", "Bottleneck Analysis", "Monitoring", "Benchmarking"]
    }
  ],
  "devops-and-infra": [
    {
      id: "devops-engineer",
      name: "DevOps Engineer",
      // icon: Settings,
       icon:Heart,
      description: "Automate deployments, monitoring, and infrastructure management",
      level: "Mid Level",
      avgSalary: "₦350K - ₦2M",
      demand: "Very High",
      skills: ["CI/CD", "Docker", "Kubernetes", "Cloud (AWS/Azure)", "Infrastructure as Code"]
    },
    {
      id: "site-reliability-engineer",
      name: "Site Reliability Engineer",
      // icon: Shield,
       icon:Heart,
      description: "Maintain production reliability and scalability",
      level: "Senior",
      avgSalary: "₦500K - ₦2.5M",
      demand: "High",
      skills: ["Monitoring", "Incident Response", "Automation", "SLI/SLO", "Capacity Planning"]
    },
    {
      id: "platform-engineer",
      name: "Platform Engineer",
      // icon: Cloud,
       icon:Heart,
      description: "Build internal platforms that empower developer productivity",
      level: "Mid to Senior",
      avgSalary: "₦450K - ₦2.3M",
      demand: "High",
      skills: ["Developer Experience", "API Design", "Tooling", "Cloud Services", "Scripting"]
    }
  ],
  "tech-consulting": [
    {
      id: "software-consultant",
      name: "Software Consultant",
      // icon: Briefcase,
       icon:Heart,
      description: "Advise clients on software architecture and delivery",
      level: "Mid to Senior",
      avgSalary: "₦400K - ₦2.2M",
      demand: "High",
      skills: ["Requirements Gathering", "System Design", "Stakeholder Management", "Roadmapping", "Agile"]
    },
    {
      id: "solution-architect",
      name: "Solution Architect",
      // icon: Layers,
       icon:Heart,
      description: "Design end-to-end technical solutions for business problems",
      level: "Senior",
      avgSalary: "₦500K - ₦2.5M",
      demand: "Very High",
      skills: ["Architecture Patterns", "Integration", "Scalability", "Security", "Cloud"]
    }
  ],

  /* Law */
  "legal-practice": [
    {
      id: "lawyer",
      name: "Lawyer / Legal Officer",
      // icon: Scale,
       icon:Heart,
      description: "Represent clients, draft legal instruments, and argue cases",
      level: "Entry to Senior",
      avgSalary: "₦250K - ₦1.5M",
      demand: "High",
      skills: ["Legal Research", "Court Advocacy", "Contract Drafting", "Negotiation", "Ethics"]
    },
    {
      id: "litigation-specialist",
      name: "Litigation Specialist",
      // icon: Gavel,
       icon:Heart,
      description: "Handle courtroom strategy and case trials",
      level: "Mid to Senior",
      avgSalary: "₦300K - ₦1.8M",
      demand: "Medium",
      skills: ["Evidence Handling", "Cross Examination", "Legal Writing", "Case Strategy", "Oral Argument"]
    }
  ],
  "corporate-law": [
    {
      id: "corporate-lawyer",
      name: "Corporate Lawyer",
      // icon: Building2,
       icon:Heart,
      description: "Manage company legal affairs including M&A and compliance",
      level: "Mid to Senior",
      avgSalary: "₦400K - ₦2M",
      demand: "High",
      skills: ["M&A", "Contract Negotiation", "Corporate Governance", "Due Diligence", "Regulatory Law"]
    },
    {
      id: "tax-consultant",
      name: "Tax Consultant",
      // icon: DollarSign,
       icon:Heart,
      description: "Advise on tax strategy and compliance for individuals and companies",
      level: "Entry to Mid",
      avgSalary: "₦250K - ₦1.2M",
      demand: "Medium",
      skills: ["Tax Law", "Financial Analysis", "Excel Modeling", "Compliance", "Strategic Planning"]
    }
  ],
  "regulatory-compliance": [
    {
      id: "compliance-officer",
      name: "Compliance Officer",
      // icon: ClipboardList,
       icon:Heart,
      description: "Ensure adherence to sector and national regulations",
      level: "Entry to Mid",
      avgSalary: "₦220K - ₦1M",
      demand: "High",
      skills: ["Policy Development", "Risk Assessment", "Reporting", "Audit Coordination", "Legal Interpretation"]
    },
    {
      id: "corporate-governance-specialist",
      name: "Corporate Governance Specialist",
      // icon: ShieldCheck,
       icon:Heart,
      description: "Set up frameworks for ethical and legal corporate behavior",
      level: "Senior",
      avgSalary: "₦400K - ₦2M",
      demand: "Medium",
      skills: ["Governance Structures", "Ethics", "Stakeholder Engagement", "Audit", "Transparency"]
    }
  ],
  "legal-writing": [
    {
      id: "legal-content-writer",
      name: "Legal Content Writer",
      // icon: Edit3,
       icon:Heart,
      description: "Produce accessible legal content for media, education, and firms",
      level: "Entry to Mid",
      avgSalary: "₦150K - ₦800K",
      demand: "Medium",
      skills: ["Writing", "Research", "Simplifying Legalese", "SEO", "Editing"]
    },
    {
      id: "policy-writer",
      name: "Policy Writer",
      // icon: FileText,
       icon:Heart,
      description: "Draft organizational or governmental policy documents",
      level: "Mid",
      avgSalary: "₦250K - ₦1.2M",
      demand: "Medium",
      skills: ["Policy Analysis", "Technical Writing", "Stakeholder Interviews", "Drafting", "Review"]
    }
  ],

  /* Nursing */
  "clinical-nursing": [
    {
      id: "registered-nurse",
      name: "Registered Nurse",
      // icon: BandAid,
       icon:Heart,
      description: "Provide routine and critical patient care in clinical settings",
      level: "Entry to Mid",
      avgSalary: "₦150K - ₦800K",
      demand: "Very High",
      skills: ["Patient Assessment", "Medication Administration", "IV Therapy", "Infection Control", "Communication"]
    },
    {
      id: "critical-care-nurse",
      name: "Critical Care Nurse",
      // icon: HeartPulse,
       icon:Heart,
      description: "Work in ICU/critical units handling severe cases",
      level: "Mid to Senior",
      avgSalary: "₦250K - ₦1.2M",
      demand: "High",
      skills: ["Advanced Life Support", "Monitoring", "Ventilator Management", "Decision Making", "Team Coordination"]
    }
  ],
  "maternal-child-health": [
    {
      id: "midwife",
      name: "Midwife",
      // icon: Baby,
       icon:Heart,
      description: "Support pregnancy, delivery, and postpartum care",
      level: "Entry to Mid",
      avgSalary: "₦180K - ₦800K",
      demand: "High",
      skills: ["Prenatal Care", "Delivery Assistance", "Neonatal Support", "Patient Education", "Emergency Response"]
    },
    {
      id: "maternal-health-educator",
      name: "Maternal Health Educator",
      // icon: BookOpen,
       icon:Heart,
      description: "Educate mothers and communities on maternal and child health practices",
      level: "Entry",
      avgSalary: "₦150K - ₦600K",
      demand: "Medium",
      skills: ["Health Communication", "Curriculum Design", "Community Outreach", "Cultural Sensitivity", "Public Speaking"]
    }
  ],
  "fintech": [
    {
      id: "frontend-developer",
      name: "Frontend Developer",
      icon: "Layout",
      description: "Create engaging user experiences for websites and web apps.",
      level: "Entry to Mid",
      avgSalary: "₦250K - ₦1.2M",
      demand: "High",
      skills: ["html", "css", "javascript", "react", "git"]
    },
    {
      id: "backend-developer",
      name: "Backend Developer",
      icon: "Server",
      description: "Develop robust server-side applications and APIs.",
      level: "Mid to Senior",
      avgSalary: "₦300K - ₦1.5M",
      demand: "High",
      skills: ["nodejs", "python", "databases", "api-development", "git"]
    },
    {
      id: "mobile-developer",
      name: "Mobile App Developer",
      icon: "Smartphone",
      description: "Build mobile applications using React Native or Flutter.",
      level: "Entry to Mid",
      avgSalary: "₦300K - ₦1.4M",
      demand: "High",
      skills: ["react-native", "flutter", "javascript", "ui-design", "api-integration"]
    },
    {
      id: "product-engineer",
      name: "Product Engineer",
      // icon: Puzzle,
       icon:Heart,
      description: "Bridge product requirements and execution; iterate on features",
      level: "Mid Level",
      avgSalary: "₦400K - ₦2.2M",
      demand: "High",
      skills: ["User Research", "Agile", "Feature Prioritization", "A/B Testing", "Collaboration"]
    },
    {
      id: "software-engineer",
      name: "Software Engineer",
      icon: "Monitor",
      description: "Develop secure and scalable financial platforms.",
      level: "Entry to Senior",
      avgSalary: "₦400K - ₦2M",
      demand: "Very High",
      skills: ["javascript", "python", "react", "nodejs", "databases"]
    },
    {
      id: "cybersecurity-analyst",
      name: "Cybersecurity Analyst", 
      icon: "Shield",
      description: "Protect fintech applications from cyber threats.",
      level: "Mid to Senior",
      avgSalary: "₦350K - ₦1.5M",
      demand: "High",
      skills: ["network-security", "risk-assessment", "siem-tools", "incident-response"]
    },
    {
      id: "devops-engineer",
      name: "DevOps Engineer",
      icon: "Settings",
      description: "Automate and monitor deployments in cloud environments.",
      level: "Mid Level",
      avgSalary: "₦450K - ₦1.8M",
      demand: "High", 
      skills: ["ci-cd", "docker", "kubernetes", "aws", "monitoring"]
    }
  ],

  "banking": [
    {
      id: "database-admin",
      name: "Database Administrator",
      icon: "Database",
      description: "Manage banking databases for efficiency and security.",
      level: "Mid Level",
      avgSalary: "₦350K - ₦1.3M",
      demand: "High",
      skills: ["sql", "oracle", "data-backup", "performance-tuning"]
    },
    {
      id: "it-officer",
      name: "IT Officer",
      icon: "Cpu",
      description: "Support internal IT systems and network infrastructure.",
      level: "Entry Level",
      avgSalary: "₦200K - ₦800K",
      demand: "Medium",
      skills: ["network-administration", "windows-server", "help-desk", "active-directory"]
    },
    {
      id: "business-analyst",
      name: "Business Analyst", 
      icon: "BarChart3",
      description: "Analyze banking processes and technology alignment.",
      level: "Entry to Mid",
      avgSalary: "₦280K - ₦1.1M",
      demand: "High",
      skills: ["process-analysis", "sql", "stakeholder-management"]
    }
  ],
"it-support": [
    {
      id: "it-support-specialist",
      name: "IT Support Specialist",
      icon: "LifeBuoy",
      description: "Provide technical assistance and troubleshoot hardware/software issues.",
      level: "Entry to Mid",
      avgSalary: "₦150K - ₦700K",
      demand: "High",
      skills: ["hardware-troubleshooting", "windows-os", "ticketing-systems", "communication"]
    },
    {
      id: "helpdesk-technician",
      name: "Help Desk Technician",
      icon: "Headphones",
      description: "Handle support requests and resolve common IT problems.",
      level: "Entry Level",
      avgSalary: "₦120K - ₦500K",
      demand: "Medium",
      skills: ["customer-support", "windows", "active-directory", "remote-tools"]
    },
    {
      id: "system-administrator",
      name: "System Administrator",
      icon: "ServerCog",
      description: "Maintain and configure servers and user systems.",
      level: "Mid Level",
      avgSalary: "₦250K - ₦1.2M",
      demand: "High",
      skills: ["linux", "windows-server", "bash", "networking", "security-policies"]
    }
  ],

  "networking": [
    {
      id: "network-engineer",
      name: "Network Engineer",
      icon: "Router",
      description: "Design and maintain reliable and secure networks.",
      level: "Mid to Senior",
      avgSalary: "₦300K - ₦1.5M",
      demand: "High",
      skills: ["cisco", "switching", "routing", "vpn", "firewall-configuration"]
    },
    {
      id: "network-administrator",
      name: "Network Administrator",
      icon: "Cable",
      description: "Monitor and support day-to-day network operations.",
      level: "Entry to Mid",
      avgSalary: "₦200K - ₦800K",
      demand: "Medium",
      skills: ["tcp-ip", "dns", "dhcp", "network-monitoring", "troubleshooting"]
    },
    {
      id: "network-security-analyst",
      name: "Network Security Analyst",
      icon: "ShieldCheck",
      description: "Secure networks and mitigate unauthorized access.",
      level: "Mid to Senior",
      avgSalary: "₦400K - ₦1.6M",
      demand: "High",
      skills: ["firewall", "intrusion-detection", "security-audits", "vpn-security"]
    }
  ],

  "it-consulting": [
    {
      id: "it-consultant",
      name: "IT Consultant",
      icon: "Briefcase",
      description: "Advise businesses on how to best use IT to meet their goals.",
      level: "Mid to Senior",
      avgSalary: "₦400K - ₦2M",
      demand: "High",
      skills: ["business-analysis", "cloud-strategy", "digital-transformation", "stakeholder-engagement"]
    },
    {
      id: "solution-architect",
      name: "Solution Architect",
      icon: "GanttChart",
      description: "Design and plan complex tech systems aligned with business needs.",
      level: "Senior",
      avgSalary: "₦600K - ₦2.5M",
      demand: "High",
      skills: ["cloud", "architecture-patterns", "databases", "requirements-analysis"]
    },
    {
      id: "erp-specialist",
      name: "ERP Specialist",
      icon: "FileCog",
      description: "Manage and customize enterprise resource planning systems.",
      level: "Mid Level",
      avgSalary: "₦300K - ₦1.8M",
      demand: "Growing",
      skills: ["sap", "oracle-erp", "data-migration", "user-training"]
    }
  ],
   "banking": [
    {
      id: "financial-analyst",
      name: "Financial Analyst",
      icon: "BarChart3",
      description: "Analyze financial statements and market trends to guide investment decisions.",
      level: "Entry to Mid",
      avgSalary: "₦250K - ₦1M",
      demand: "High",
      skills: ["excel", "financial-modelling", "data-analysis", "accounting"]
    },
    {
      id: "investment-banker",
      name: "Investment Banker",
      icon: "Banknote",
      description: "Assist corporations and governments in raising capital and managing investments.",
      level: "Mid to Senior",
      avgSalary: "₦400K - ₦2M",
      demand: "High",
      skills: ["valuation", "finance", "presentation-skills", "m&a-analysis"]
    },
    {
      id: "loan-officer",
      name: "Loan Officer",
      icon: "CreditCard",
      description: "Evaluate and approve loan applications for individuals or businesses.",
      level: "Entry Level",
      avgSalary: "₦150K - ₦600K",
      demand: "Medium",
      skills: ["credit-analysis", "risk-assessment", "customer-service", "documentation"]
    }
  ],

  "government": [
    {
      id: "economic-analyst",
      name: "Economic Analyst",
      icon: "LineChart",
      description: "Analyze economic data to support government policy-making.",
      level: "Entry to Mid",
      avgSalary: "₦200K - ₦800K",
      demand: "Medium",
      skills: ["data-analysis", "stata", "policy-research", "report-writing"]
    },
    {
      id: "policy-advisor",
      name: "Policy Advisor",
      icon: "Scroll",
      description: "Advise on fiscal and monetary policies to improve economic outcomes.",
      level: "Mid to Senior",
      avgSalary: "₦300K - ₦1.2M",
      demand: "Medium",
      skills: ["economic-modelling", "communication", "legislation", "macro-economics"]
    },
    {
      id: "revenue-officer",
      name: "Revenue Officer",
      icon: "FileText",
      description: "Work with tax agencies to ensure revenue collection and compliance.",
      level: "Entry Level",
      avgSalary: "₦150K - ₦500K",
      demand: "Medium",
      skills: ["taxation", "excel", "compliance", "public-finance"]
    }
  ],

  "consulting": [
    {
      id: "business-analyst",
      name: "Business Analyst",
      icon: "Presentation",
      description: "Evaluate business processes and provide data-driven recommendations.",
      level: "Entry to Mid",
      avgSalary: "₦300K - ₦1.2M",
      demand: "High",
      skills: ["excel", "powerpoint", "financial-analysis", "presentation-skills"]
    },
    {
      id: "economic-consultant",
      name: "Economic Consultant",
      icon: "Users",
      description: "Provide expert advice on economic trends, projects, and strategies.",
      level: "Mid to Senior",
      avgSalary: "₦400K - ₦1.8M",
      demand: "High",
      skills: ["econometrics", "data-visualization", "policy-analysis", "communication"]
    },
    {
      id: "market-research-analyst",
      name: "Market Research Analyst",
      icon: "PieChart",
      description: "Analyze market conditions to identify potential opportunities and risks.",
      level: "Entry to Mid",
      avgSalary: "₦200K - ₦800K",
      demand: "High",
      skills: ["market-research", "surveys", "data-analysis", "reporting"]
    }
  ],
  "government": [
    {
      id: "it-support-specialist",
      name: "IT Support Specialist",
      icon: "LifeBuoy",
      description: "Maintain IT systems across government departments.",
      level: "Entry to Mid",
      avgSalary: "₦150K - ₦600K",
      demand: "Medium",
      skills: ["hardware-troubleshooting", "windows-os", "networking", "documentation"]
    },
    {
      id: "data-analyst",
      name: "Data Analyst",
      icon: "FileBarChart",
      description: "Analyze government data for informed decision-making.",
      level: "Mid Level",
      avgSalary: "₦200K - ₦900K",
      demand: "High",
      skills: ["excel", "python", "sql", "data-visualization", "tableau"]
    },
    {
      id: "software-developer",
      name: "Software Developer",
      icon: "Code",
      description: "Develop e-government platforms and digital services.",
      level: "Entry to Mid",
      avgSalary: "₦250K - ₦850K",
      demand: "High",
      skills: ["javascript", "html", "css", "react", "api-development"]
    }
  ],

  "startups": [
    {
      id: "fullstack-developer",
      name: "Fullstack Developer",
      icon: "Layers",
      description: "Build complete web applications from frontend to backend.",
      level: "Entry to Mid",
      avgSalary: "₦300K - ₦1.5M",
      demand: "High",
      skills: ["html", "css", "javascript", "react", "nodejs", "mongodb"]
    },
    {
      id: "product-designer",
      name: "Product Designer",
      icon: "PenTool",
      description: "Design intuitive user interfaces and user experiences.",
      level: "Entry to Mid",
      avgSalary: "₦250K - ₦1.2M",
      demand: "High",
      skills: ["figma", "ui-ux", "prototyping", "user-research"]
    },
    {
      id: "technical-cofounder",
      name: "Technical Co-Founder",
      icon: "Rocket",
      description: "Lead product development and technology strategy.",
      level: "Senior / Entrepreneur",
      avgSalary: "Equity Based",
      demand: "Niche",
      skills: ["fullstack-development", "team-leadership", "fundraising", "startup-growth"]
    }
  ],
  "public-health": [
    {
      id: "public-health-nurse",
      name: "Public Health Nurse",
      // icon: Globe,
       icon:Heart,
      description: "Work on community-level health promotion and disease prevention",
      level: "Entry to Mid",
      avgSalary: "₦200K - ₦1M",
      demand: "High",
      skills: ["Epidemiology Basics", "Health Education", "Surveillance", "Program Planning", "Data Collection"]
    },
    {
      id: "community-outreach-coordinator",
      name: "Community Outreach Coordinator",
      // icon: Users,
       icon:Heart,
      description: "Coordinate public health campaigns and partnerships",
      level: "Entry",
      avgSalary: "₦180K - ₦800K",
      demand: "Medium",
      skills: ["Coordination", "Stakeholder Engagement", "Event Planning", "Communication", "Reporting"]
    }
  ],
  "nurse-education": [
    {
      id: "nurse-educator",
      name: "Nurse Educator",
      // icon: ChalkboardTeacher,
       icon:Heart,
      description: "Train nursing students and staff in academic or clinical programs",
      level: "Mid",
      avgSalary: "₦250K - ₦1.2M",
      demand: "Medium",
      skills: ["Curriculum Development", "Teaching", "Assessment", "Mentorship", "Clinical Demonstration"]
    }
  ],
  "rehab-palliative": [
    {
      id: "palliative-care-nurse",
      name: "Palliative Care Nurse",
      icon: Heart,
      description: "Provide comfort care for patients with chronic or terminal illnesses",
      level: "Mid to Senior",
      avgSalary: "₦200K - ₦900K",
      demand: "Medium",
      skills: ["Pain Management", "Empathy", "Care Coordination", "Communication", "End-of-life Support"]
    }
  ],

  /* Pharmacy */
  "hospital-pharmacy": [
    {
      id: "clinical-pharmacist",
      name: "Clinical Pharmacist",
      // icon: Stethoscope,
       icon:Heart,
      description: "Manage drug therapy in hospital settings and counsel care teams",
      level: "Entry to Senior",
      avgSalary: "₦220K - ₦1.2M",
      demand: "High",
      skills: ["Pharmacology", "Drug Interaction Checks", "Patient Counseling", "Medication Therapy Management", "Clinical Guidelines"]
    }
  ],
  "community-pharmacy": [
    {
      id: "retail-pharmacist",
      name: "Retail Pharmacist",
      // icon: ShoppingCart,
       icon:Heart,
      description: "Dispense medications and advise walk-in customers",
      level: "Entry to Mid",
      avgSalary: "₦150K - ₦700K",
      demand: "High",
      skills: ["Customer Service", "Dispensing", "OTC Advice", "Inventory Management", "Basic Pharmacology"]
    }
  ],
  "pharma-industry": [
    {
      id: "production-pharmacist",
      name: "Production Pharmacist",
      // icon: Factory,
       icon:Heart,
      description: "Oversee manufacturing and quality of pharmaceutical products",
      level: "Mid",
      avgSalary: "₦250K - ₦1.5M",
      demand: "Medium",
      skills: ["GMP", "Batch Documentation", "Quality Control", "Process Optimization", "Regulatory Compliance"]
    }
  ],
  "regulatory-affairs": [
    {
      id: "regulatory-affairs-officer",
      name: "Regulatory Affairs Officer",
      // icon: ClipboardList,
       icon:Heart,
      description: "Prepare submissions and ensure compliance with drug authorities",
      level: "Entry to Mid",
      avgSalary: "₦280K - ₦1.3M",
      demand: "High",
      skills: ["Dossier Preparation", "Labeling", "Guideline Interpretation", "Communication", "Compliance Monitoring"]
    }
  ],
  "clinical-research": [
    {
      id: "clinical-research-coordinator",
      name: "Clinical Research Coordinator",
      // icon: Microscope,
       icon:Heart,
      description: "Manage the execution of clinical trials and protocol adherence",
      level: "Entry to Mid",
      avgSalary: "₦250K - ₦1.2M",
      demand: "High",
      skills: ["GCP", "Data Collection", "Protocol Management", "Patient Recruitment", "Documentation"]
    }
  ],

  /* Medicine */
  "clinical-medicine": [
    {
      id: "medical-doctor",
      name: "Medical Doctor",
      // icon: Stethoscope,
       icon:Heart,
      description: "Diagnose, treat, and manage patient health in clinical settings",
      level: "Entry to Senior",
      avgSalary: "₦300K - ₦1.8M",
      demand: "Very High",
      skills: ["Clinical Diagnosis", "Patient Communication", "Medical Ethics", "Emergency Care", "Treatment Planning"]
    }
  ],
  "public-health": [
    {
      id: "epidemiologist",
      name: "Epidemiologist",
      // icon: Globe,
       icon:Heart,
      description: "Study patterns of disease and guide public health interventions",
      level: "Mid",
      avgSalary: "₦250K - ₦1.5M",
      demand: "High",
      skills: ["Data Analysis", "Surveillance", "Outbreak Investigation", "Health Policy", "Statistical Tools"]
    }
  ],
  "medical-research": [
    {
      id: "medical-researcher",
      name: "Medical Researcher",
      // icon: FlaskConical,
       icon:Heart,
      description: "Design and conduct biomedical research studies",
      level: "Mid to Senior",
      avgSalary: "₦300K - ₦2M",
      demand: "High",
      skills: ["Research Methodology", "Biostatistics", "Scientific Writing", "Lab Techniques", "Grant Writing"]
    }
  ],
  "medical-education": [
    {
      id: "medical-lecturer",
      name: "Medical Lecturer",
      // icon: BookOpen,
       icon:Heart,
      description: "Teach and mentor medical students and trainees",
      level: "Mid to Senior",
      avgSalary: "₦280K - ₦1.2M",
      demand: "Medium",
      skills: ["Curriculum Development", "Teaching", "Assessment", "Mentoring", "Academic Research"]
    }
  ],
  "healthcare-management": [
    {
      id: "healthcare-manager",
      name: "Healthcare Administrator",
      // icon: Briefcase,
       icon:Heart,
      description: "Manage hospital operations, policy, and administrative workflows",
      level: "Senior",
      avgSalary: "₦300K - ₦1.6M",
      demand: "High",
      skills: ["Operations Management", "Budgeting", "Leadership", "Health Policy", "Quality Assurance"]
    }
  ],

  /* Business Administration */
  "operations-management": [
    {
      id: "operations-manager",
      name: "Operations Manager",
      // icon: Gear,
       icon:Heart,
      description: "Optimize internal processes and supply chain operations",
      level: "Mid to Senior",
      avgSalary: "₦250K - ₦1.5M",
      demand: "High",
      skills: ["Process Improvement", "Supply Chain", "Lean/Six Sigma", "KPI Tracking", "ERP Systems"]
    }
  ],
  "human-resources": [
    {
      id: "hr-generalist",
      name: "HR Generalist",
      // icon: Users,
       icon:Heart,
      description: "Handle recruitment, employee relations, and HR operations",
      level: "Entry to Mid",
      avgSalary: "₦180K - ₦1.2M",
      demand: "High",
      skills: ["Recruitment", "Onboarding", "Performance Management", "Labor Law", "HRIS"]
    }
  ],
  "sales-business-dev": [
    {
      id: "business-development-officer",
      name: "Business Development Officer",
      // icon: TrendingUp,
       icon:Heart,
      description: "Drive growth through partnerships and new markets",
      level: "Entry to Mid",
      avgSalary: "₦200K - ₦1.8M",
      demand: "Very High",
      skills: ["Lead Generation", "Negotiation", "CRM", "Strategic Sales", "Networking"]
    }
  ],
  "management-consulting": [
    {
      id: "management-consultant",
      name: "Management Consultant",
      // icon: Lightbulb,
       icon:Heart,
      description: "Advise organizations on efficiency, strategy, and transformation",
      level: "Mid to Senior",
      avgSalary: "₦300K - ₦2M",
      demand: "High",
      skills: ["Problem Solving", "Stakeholder Engagement", "Strategy Design", "Presentation", "Data Analysis"]
    }
  ],
  "project-management": [
    {
      id: "project-manager",
      name: "Project Manager",
      // icon: Calendar,
       icon:Heart,
      description: "Plan, execute, and deliver cross-functional projects",
      level: "Mid to Senior",
      avgSalary: "₦250K - ₦1.8M",
      demand: "High",
      skills: ["Scheduling", "Risk Management", "Budgeting", "Communication", "Agile/Scrum"]
    }
  ]
};

export default RolesData