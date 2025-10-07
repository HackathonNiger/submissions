import { 
  BookOpen, 
  ExternalLink, 
  CheckCircle,
  Circle,
  ArrowRight,
  Target,
  Clock,
  Cog,
  Brain,
  Server,
  Smartphone,
  Layout,
  Plug,
  CloudUpload,
  File,
  Briefcase,
  FlaskConical,
  Cloud,
  Trophy,
    Code,
  Layers,
  Database,
  GitBranch,
  Activity,
  Calendar,
  Users,
  Lightbulb,
  TrendingUp,
  Shield,
  ClipboardList,
  Globe,
  Heart,
  FileText
} from "lucide-react";

const skillsData = {
  //  computer science
  "frontend-developer": {
    roleName: "Frontend Developer",
    skills: [
      {
        id: "htmlNcss",
        name: "HTML & CSS",
        icon: BookOpen,
        description: "Structure and style accessible, responsive interfaces using HTML5 and modern CSS (Flexbox/Grid).",
        difficulty: "Beginner",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "CSS Tricks", url: "https://css-tricks.com" },
          { name: "MDN HTML & CSS", url: "https://developer.mozilla.org/en-US/docs/Web" }
        ]
      },
      {
        id: "javascript",
        name: "JavaScript Fundamentals",
        icon: Code,
        description: "Master core JavaScript concepts, ES6+, DOM manipulation, and asynchronous programming.",
        difficulty: "Beginner",
        timeEstimate: "3-4 weeks",
        completed: false,
        resources: [
          { name: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
          { name: "FreeCodeCamp JavaScript", url: "https://freecodecamp.org" },
          { name: "JavaScript.info", url: "https://javascript.info" }
        ]
      },
      {
        id: "react",
        name: "React Development",
        icon: Layers,
        description: "Build modern user interfaces with components, hooks, and state management.",
        difficulty: "Intermediate",
        timeEstimate: "4-6 weeks",
        completed: false,
        resources: [
          { name: "React Official Docs", url: "https://react.dev" },
          { name: "React Tutorial", url: "https://react.dev/tutorial" }
        ]
      },
      {
        id: "performance-optimization",
        name: "Performance Optimization",
        icon: Activity,
        description: "Improve load times and runtime performance via code-splitting, lazy loading, and profiling.",
        difficulty: "Advanced",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "Web.dev Performance", url: "https://web.dev/learn" },
          { name: "Lighthouse Audits", url: "https://developer.chrome.com/docs/lighthouse" }
        ]
      }
    ]
  },
  "backend-developer": {
    roleName: "Backend Engineer",
    skills: [
      {
        id: "nodejs",
        name: "Node.js Backend",
        icon: Code,
        description: "Server-side development with Node.js; building RESTful APIs and handling asynchronous I/O.",
        difficulty: "Intermediate",
        timeEstimate: "3-5 weeks",
        completed: false,
        resources: [
          { name: "Node.js Official Guide", url: "https://nodejs.org/en/docs/guides/" },
          { name: "Express.js Tutorial", url: "https://expressjs.com" }
        ]
      },
      {
        id: "databases",
        name: "Database Management",
        icon: Database,
        description: "Design, query, and optimize SQL and NoSQL databases.",
        difficulty: "Intermediate",
        timeEstimate: "2-4 weeks",
        completed: false,
        resources: [
          { name: "SQL Tutorial", url: "https://www.w3schools.com/sql/" },
          { name: "MongoDB University", url: "https://university.mongodb.com" }
        ]
      },
      {
        id: "api-design",
        name: "API Design",
        icon: Layers,
        description: "Design clean, versioned, and secure REST/GraphQL APIs.",
        difficulty: "Intermediate",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "Pragmatic REST API Guide", url: "https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api" }
        ]
      },
      {
        id: "scalability",
        name: "Scalability Patterns",
        icon: TrendingUp,
        description: "Architect systems to scale under increasing load.",
        difficulty: "Advanced",
        timeEstimate: "3-4 weeks",
        completed: false,
        resources: [
          { name: "Designing Data-Intensive Applications", url: "https://dataintensive.net" }
        ]
      }
    ]
  },
  "mobile-developer": {
  roleName: "Mobile Developer",
  skills: [
    {
      id: "mobile-ui",
      name: "Mobile UI/UX Design Principles",
      icon: Layout,
      description: "Design intuitive, responsive, and platform-consistent interfaces for mobile apps.",
      difficulty: "Beginner",
      timeEstimate: "2-3 weeks",
      completed: false,
      resources: [
        { name: "Google Material Design", url: "https://material.io/design" },
        { name: "Apple Human Interface Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines/" }
      ]
    },
    {
      id: "react-native",
      name: "React Native Fundamentals",
      icon: Smartphone,
      description: "Build cross-platform mobile apps using JavaScript and React Native framework.",
      difficulty: "Intermediate",
      timeEstimate: "3-4 weeks",
      completed: false,
      resources: [
        { name: "React Native Docs", url: "https://reactnative.dev/docs/getting-started" },
        { name: "React Native Express", url: "http://www.reactnativeexpress.com/" }
      ]
    },
    {
      id: "flutter",
      name: "Flutter & Dart",
      icon: Smartphone,
      description: "Create natively compiled mobile apps using Flutter and the Dart programming language.",
      difficulty: "Intermediate",
      timeEstimate: "4-5 weeks",
      completed: false,
      resources: [
        { name: "Flutter Docs", url: "https://flutter.dev/docs" },
        { name: "Dart Language Tour", url: "https://dart.dev/guides/language/language-tour" }
      ]
    },
    {
      id: "mobile-api",
      name: "API Integration",
      icon: Plug,
      description: "Fetch and send data between mobile apps and backend services using REST or GraphQL.",
      difficulty: "Intermediate",
      timeEstimate: "2-3 weeks",
      completed: false,
      resources: [
        { name: "RESTful API Tutorial", url: "https://restfulapi.net/" },
        { name: "GraphQL Docs", url: "https://graphql.org/learn/" }
      ]
    },
    {
      id: "mobile-testing",
      name: "Mobile App Testing",
      icon: CheckCircle,
      description: "Test mobile applications using automated and manual testing tools.",
      difficulty: "Intermediate",
      timeEstimate: "1-2 weeks",
      completed: false,
      resources: [
        { name: "Appium Docs", url: "https://appium.io/docs/en/about-appium/intro/" },
        { name: "Testing React Native Apps", url: "https://reactnative.dev/docs/testing-overview" }
      ]
    },
    {
      id: "mobile-deployment",
      name: "Deployment to App Stores",
      icon: CloudUpload,
      description: "Publish and maintain mobile applications on Google Play Store and Apple App Store.",
      difficulty: "Beginner",
      timeEstimate: "1-2 weeks",
      completed: false,
      resources: [
        { name: "Google Play Console Help", url: "https://support.google.com/googleplay/android-developer" },
        { name: "App Store Connect Help", url: "https://developer.apple.com/app-store-connect/" }
      ]
    }
  ]
},
  "product-engineer": {
    roleName: "Product Engineer",
    skills: [
      {
        id: "agile",
        name: "Agile Methodologies",
        icon: Calendar,
        description: "Iterative development using Scrum/Kanban with continuous feedback.",
        difficulty: "Beginner",
        timeEstimate: "1-2 weeks",
        completed: false,
        resources: [
          { name: "Scrum Guide", url: "https://scrumguides.org" },
          { name: "Agile Alliance", url: "https://www.agilealliance.org" }
        ]
      },
      {
        id: "user-research",
        name: "User Research",
        icon: Users,
        description: "Gather and synthesize user feedback to inform product decisions.",
        difficulty: "Intermediate",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "IDEO Design Kit", url: "https://www.designkit.org" }
        ]
      },
      {
        id: "experiment-design",
        name: "A/B Testing",
        icon: Lightbulb,
        description: "Design and analyze controlled experiments to validate features.",
        difficulty: "Intermediate",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "Optimizely Learning", url: "https://www.optimizely.com/optimization-glossary/ab-testing/" }
        ]
      }
    ]
  },

  /* Embedded / IoT */
  "firmware-developer": {
    roleName: "Firmware Developer",
    skills: [
      {
        id: "c-cpp",
        name: "C/C++ Programming",
        icon: Code,
        description: "Low-level programming for microcontrollers and embedded platforms.",
        difficulty: "Advanced",
        timeEstimate: "4-6 weeks",
        completed: false,
        resources: [
          { name: "C++ Core Guidelines", url: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines" }
        ]
      },
      {
        id: "real-time-systems",
        name: "Real-Time Systems",
        icon: Activity,
        description: "Understand determinism, scheduling, and constraints in embedded systems.",
        difficulty: "Advanced",
        timeEstimate: "3-4 weeks",
        completed: false,
        resources: [
          { name: "FreeRTOS Docs", url: "https://freertos.org" }
        ]
      }
    ]
  },
  "iot-engineer": {
    roleName: "IoT Engineer",
    skills: [
      {
        id: "mqtt",
        name: "MQTT & Messaging",
        icon: Layers,
        description: "Lightweight message protocol for IoT device communication.",
        difficulty: "Intermediate",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "MQTT.org", url: "https://mqtt.org" }
        ]
      },
      {
        id: "edge-computing",
        name: "Edge Computing",
        icon: Cloud,
        description: "Process data closer to source to reduce latency and bandwidth.",
        difficulty: "Intermediate",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "Red Hat Edge Guide", url: "https://www.redhat.com/en/topics/edge-computing" }
        ]
      }
    ]
  },
  "embedded-test-engineer": {
    roleName: "Embedded Test Engineer",
    skills: [
      {
        id: "hardware-testing",
        name: "Hardware Testing",
        icon: ClipboardList,
        description: "Validate embedded hardware functionality and signals.",
        difficulty: "Intermediate",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "Electronics Testing Basics", url: "https://www.eetimes.com" }
        ]
      },
      {
        id: "automation-scripting",
        name: "Automation & Scripting",
        icon: Code,
        description: "Automate test procedures for repeatability and coverage.",
        difficulty: "Intermediate",
        timeEstimate: "2-4 weeks",
        completed: false,
        resources: [
          { name: "Scripting with Python", url: "https://docs.python.org/3/tutorial/" }
        ]
      }
    ]
  },

  /* QA & DevOps */
  "qa-engineer": {
    roleName: "Quality Assurance Engineer",
    skills: [
      {
        id: "test-automation",
        name: "Test Automation",
        icon: Code,
        description: "Build automated test suites using frameworks like Selenium.",
        difficulty: "Intermediate",
        timeEstimate: "3-4 weeks",
        completed: false,
        resources: [
          { name: "Selenium Docs", url: "https://www.selenium.dev/documentation/" }
        ]
      },
      {
        id: "bug-tracking",
        name: "Bug Tracking & Reporting",
        icon: FileText,
        description: "Log, categorize, and report defects effectively.",
        difficulty: "Beginner",
        timeEstimate: "1-2 weeks",
        completed: false,
        resources: [
          { name: "JIRA Guide", url: "https://www.atlassian.com/software/jira/guides" }
        ]
      }
    ]
  },
  "automation-tester": {
    roleName: "Automation Tester",
    skills: [
      {
        id: "ci-cd",
        name: "CI/CD Pipelines",
        icon: TrendingUp,
        description: "Automate build-test-deploy workflows for continuous delivery.",
        difficulty: "Intermediate",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "CI/CD Concepts", url: "https://www.redhat.com/en/topics/devops/what-is-ci-cd" }
        ]
      },
      {
        id: "framework-design",
        name: "Framework Design",
        icon: Layers,
        description: "Architect reusable test automation frameworks.",
        difficulty: "Advanced",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "Test Automation Frameworks", url: "https://martinfowler.com/articles/microservice-testing/" }
        ]
      }
    ]
  },
  "performance-engineer": {
    roleName: "Performance Engineer",
    skills: [
      {
        id: "load-testing",
        name: "Load & Stress Testing",
        icon: Activity,
        description: "Simulate heavy traffic to identify bottlenecks.",
        difficulty: "Advanced",
        timeEstimate: "2-4 weeks",
        completed: false,
        resources: [
          { name: "JMeter Tutorial", url: "https://jmeter.apache.org/" }
        ]
      },
      {
        id: "profiling",
        name: "Application Profiling",
        icon: Lightbulb,
        description: "Use tools to find performance hotspots in code.",
        difficulty: "Advanced",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "Chrome DevTools", url: "https://developer.chrome.com/docs/devtools/" }
        ]
      }
    ]
  },
  "devops-engineer": {
    roleName: "DevOps Engineer",
    skills: [
      {
        id: "infrastructure-as-code",
        name: "Infrastructure as Code",
        icon: Layers,
        description: "Automate environment provisioning with tools like Terraform.",
        difficulty: "Intermediate",
        timeEstimate: "3-4 weeks",
        completed: false,
        resources: [
          { name: "Terraform Docs", url: "https://developer.hashicorp.com/terraform/docs" }
        ]
      },
      {
        id: "containerization",
        name: "Containerization",
        icon: Code,
        description: "Package and deploy applications using Docker/Kubernetes.",
        difficulty: "Intermediate",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "Docker Guide", url: "https://docs.docker.com/get-started/" }
        ]
      }
    ]
  },
  "site-reliability-engineer": {
    roleName: "Site Reliability Engineer",
    skills: [
      {
        id: "monitoring",
        name: "Monitoring & Alerting",
        icon: Activity,
        description: "Track system health and set up reliable alerts.",
        difficulty: "Intermediate",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "Prometheus Docs", url: "https://prometheus.io/docs/" }
        ]
      },
      {
        id: "incident-response",
        name: "Incident Response",
        icon: Shield,
        description: "Respond to outages and restore service reliably.",
        difficulty: "Advanced",
        timeEstimate: "2-4 weeks",
        completed: false,
        resources: [
          { name: "Google SRE Practices", url: "https://sre.google/" }
        ]
      }
    ]
  },
  "platform-engineer": {
    roleName: "Platform Engineer",
    skills: [
      {
        id: "developer-experience",
        name: "Developer Experience",
        icon: Users,
        description: "Build tools that improve internal dev workflows.",
        difficulty: "Intermediate",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "DX Best Practices", url: "https://12factor.net/" }
        ]
      },
      {
        id: "tooling",
        name: "Internal Tooling",
        icon: Cog,
        description: "Create and maintain internal platforms for efficiency.",
        difficulty: "Intermediate",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "Internal Developer Platforms", url: "https://www.cncf.io" }
        ]
      }
    ]
  },
  "financial-analyst": {
  roleName: "Financial Analyst",
  skills: [
    {
      id: "financial-modeling",
      name: "Financial Modeling",
      icon: Heart,
      description: "Build and interpret financial models for forecasting, budgeting, and decision-making.",
      difficulty: "Intermediate",
      timeEstimate: "3-4 weeks",
      completed: false,
      resources: [
        { name: "Corporate Finance Institute", url: "https://corporatefinanceinstitute.com/resources/knowledge/modeling/what-is-financial-modeling/" },
        { name: "Investopedia Financial Modeling", url: "https://www.investopedia.com/terms/f/financialmodeling.asp" }
      ]
    },
    {
      id: "data-analysis",
      name: "Data Analysis with Excel",
      icon: Heart,
      description: "Use Excel to clean, analyze, and visualize financial data effectively.",
      difficulty: "Beginner",
      timeEstimate: "2-3 weeks",
      completed: false,
      resources: [
        { name: "Excel Jet", url: "https://exceljet.net/" },
        { name: "Excel Exposure", url: "https://excelexposure.com/" }
      ]
    },
    {
      id: "valuation",
      name: "Company Valuation",
      icon: Heart,
      description: "Estimate a company's worth using methods like DCF, comparable analysis, and precedent transactions.",
      difficulty: "Intermediate",
      timeEstimate: "2-3 weeks",
      completed: false,
      resources: [
        { name: "Aswath Damodaran Valuation", url: "https://pages.stern.nyu.edu/~adamodar/" }
      ]
    },
    {
      id: "financial-reporting",
      name: "Financial Reporting & Analysis",
      icon: Heart,
      description: "Interpret balance sheets, income statements, and cash flow statements.",
      difficulty: "Beginner",
      timeEstimate: "1-2 weeks",
      completed: false,
      resources: [
        { name: "AccountingCoach", url: "https://www.accountingcoach.com/" }
      ]
    }
  ]
},
"investment-banker": {
  roleName: "Investment Banker",
  skills: [
    {
      id: "mergers-acquisitions",
      name: "Mergers & Acquisitions (M&A)",
      icon: Heart,
      description: "Advise clients on buying, selling, and merging companies.",
      difficulty: "Advanced",
      timeEstimate: "4-6 weeks",
      completed: false,
      resources: [
        { name: "M&A Overview", url: "https://www.investopedia.com/terms/m/mergersandacquisitions.asp" }
      ]
    },
    {
      id: "ipo",
      name: "Initial Public Offerings (IPO)",
      icon: Heart,
      description: "Guide companies through the process of going public.",
      difficulty: "Advanced",
      timeEstimate: "3-4 weeks",
      completed: false,
      resources: [
        { name: "SEC IPO Guide", url: "https://www.sec.gov/answers/ipodisc.htm" }
      ]
    },
    {
      id: "financial-modeling",
      name: "Financial Modeling",
      icon: Heart,
      description: "Develop financial projections to evaluate investment opportunities.",
      difficulty: "Intermediate",
      timeEstimate: "3-4 weeks",
      completed: false,
      resources: [
        { name: "CFI Modeling Course", url: "https://corporatefinanceinstitute.com/resources/knowledge/modeling/what-is-financial-modeling/" }
      ]
    },
    {
      id: "deal-structuring",
      name: "Deal Structuring",
      icon: Heart,
      description: "Structure complex financial deals to maximize client value.",
      difficulty: "Advanced",
      timeEstimate: "3-4 weeks",
      completed: false,
      resources: [
        { name: "Investment Banking Explained", url: "https://www.wallstreetoasis.com/" }
      ]
    }
  ]
},
"loan-officer": {
  roleName: "Loan Officer",
  skills: [
    {
      id: "credit-analysis",
      name: "Credit Analysis",
      icon: Heart,
      description: "Evaluate a borrower’s ability to repay loans by analyzing credit history and financial status.",
      difficulty: "Intermediate",
      timeEstimate: "2-3 weeks",
      completed: false,
      resources: [
        { name: "Credit Analysis Basics", url: "https://corporatefinanceinstitute.com/resources/knowledge/credit/credit-analysis/" }
      ]
    },
    {
      id: "loan-processing",
      name: "Loan Processing",
      icon: Heart,
      description: "Manage loan applications from origination to approval or denial.",
      difficulty: "Beginner",
      timeEstimate: "1-2 weeks",
      completed: false,
      resources: [
        { name: "Loan Officer Guide", url: "https://www.investopedia.com/terms/l/loan-officer.asp" }
      ]
    },
    {
      id: "risk-assessment",
      name: "Risk Assessment",
      icon: Heart,
      description: "Identify and evaluate risks associated with lending decisions.",
      difficulty: "Intermediate",
      timeEstimate: "2 weeks",
      completed: false,
      resources: [
        { name: "Bank Risk Management", url: "https://www.bis.org/" }
      ]
    },
    {
      id: "customer-relations",
      name: "Customer Relations",
      icon: Heart,
      description: "Build and maintain strong relationships with clients during the lending process.",
      difficulty: "Beginner",
      timeEstimate: "1 week",
      completed: false,
      resources: [
        { name: "Effective Communication Skills", url: "https://www.mindtools.com/CommSkll/CommunicationSkills.htm" }
      ]
    }
  ]
},
"it-support-specialist": {
  roleName: "IT Support Specialist",
  skills: [
    {
      id: "troubleshooting",
      name: "Troubleshooting & Diagnostics",
      icon: Heart,
      description: "Identify, analyze, and solve technical issues for hardware, software, and networks.",
      difficulty: "Beginner",
      timeEstimate: "1-2 weeks",
      completed: false,
      resources: [
        { name: "IT Troubleshooting Guide", url: "https://www.comptia.org/blog/troubleshooting-guide" }
      ]
    },
    {
      id: "hardware-setup",
      name: "Hardware Installation & Maintenance",
      icon: Heart,
      description: "Set up, maintain, and repair computer hardware and peripherals.",
      difficulty: "Beginner",
      timeEstimate: "1-2 weeks",
      completed: false,
      resources: [
        { name: "PC Building Guide", url: "https://www.tomshardware.com/how-to/build-a-pc" }
      ]
    },
    {
      id: "os-management",
      name: "Operating System Management",
      icon: Heart,
      description: "Install, configure, and troubleshoot Windows, macOS, and Linux systems.",
      difficulty: "Intermediate",
      timeEstimate: "2-3 weeks",
      completed: false,
      resources: [
        { name: "Windows Admin Center", url: "https://learn.microsoft.com/en-us/windows-server/manage/windows-admin-center/overview" }
      ]
    },
    {
      id: "customer-support",
      name: "Customer Support Skills",
      icon: Heart,
      description: "Communicate effectively and provide excellent customer service for technical support.",
      difficulty: "Beginner",
      timeEstimate: "1 week",
      completed: false,
      resources: [
        { name: "Customer Service Skills", url: "https://www.mindtools.com/CommSkll/CommunicationSkills.htm" }
      ]
    }
  ]
},
"data-analyst": {
  roleName: "Data Analyst",
  skills: [
    {
      id: "data-cleaning",
      name: "Data Cleaning & Preparation",
      icon: Heart,
      description: "Prepare raw data for analysis by handling missing values, errors, and inconsistencies.",
      difficulty: "Beginner",
      timeEstimate: "1-2 weeks",
      completed: false,
      resources: [
        { name: "Data Cleaning in Pandas", url: "https://pandas.pydata.org/docs/user_guide/missing_data.html" }
      ]
    },
    {
      id: "data-visualization",
      name: "Data Visualization",
      icon: Heart,
      description: "Create clear and impactful visualizations using tools like Tableau, Power BI, or Matplotlib.",
      difficulty: "Intermediate",
      timeEstimate: "2-3 weeks",
      completed: false,
      resources: [
        { name: "Tableau Public", url: "https://public.tableau.com/en-us/s/" },
        { name: "Power BI Docs", url: "https://learn.microsoft.com/en-us/power-bi/" }
      ]
    },
    {
      id: "statistics",
      name: "Statistics & Probability",
      icon: Heart,
      description: "Apply statistical methods to interpret data and identify patterns.",
      difficulty: "Intermediate",
      timeEstimate: "2-3 weeks",
      completed: false,
      resources: [
        { name: "Khan Academy Statistics", url: "https://www.khanacademy.org/math/statistics-probability" }
      ]
    },
    {
      id: "sql",
      name: "SQL for Data Analysis",
      icon: Heart,
      description: "Query, join, and aggregate data using SQL for analytical purposes.",
      difficulty: "Beginner",
      timeEstimate: "1-2 weeks",
      completed: false,
      resources: [
        { name: "SQLBolt", url: "https://sqlbolt.com/" }
      ]
    }
  ]
},
"software-developer": {
  roleName: "Software Developer",
  skills: [
    {
      id: "programming-fundamentals",
      name: "Programming Fundamentals",
      icon: Heart,
      description: "Understand core programming concepts such as loops, conditions, and data types.",
      difficulty: "Beginner",
      timeEstimate: "2-3 weeks",
      completed: false,
      resources: [
        { name: "FreeCodeCamp JavaScript", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" }
      ]
    },
    {
      id: "web-development",
      name: "Web Development Basics",
      icon: Heart,
      description: "Build simple websites using HTML, CSS, and JavaScript.",
      difficulty: "Beginner",
      timeEstimate: "2-3 weeks",
      completed: false,
      resources: [
        { name: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Learn" }
      ]
    },
    {
      id: "api-integration",
      name: "API Integration",
      icon: Heart,
      description: "Fetch and send data using REST or GraphQL APIs.",
      difficulty: "Intermediate",
      timeEstimate: "2 weeks",
      completed: false,
      resources: [
        { name: "RESTful API Tutorial", url: "https://restfulapi.net/" }
      ]
    },
    {
      id: "version-control",
      name: "Version Control with Git",
      icon: Heart,
      description: "Track and manage code changes using Git and GitHub.",
      difficulty: "Beginner",
      timeEstimate: "1 week",
      completed: false,
      resources: [
        { name: "Pro Git Book", url: "https://git-scm.com/book/en/v2" }
      ]
    }
  ]
},
"fullstack-developer": {
  roleName: "Fullstack Developer",
  skills: [
    {
      id: "frontend-development",
      name: "Frontend Development",
      icon: Heart,
      description: "Build responsive and interactive UIs using HTML, CSS, JavaScript, and frameworks like React or Vue.",
      difficulty: "Intermediate",
      timeEstimate: "3-4 weeks",
      completed: false,
      resources: [
        { name: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Learn" },
        { name: "React Docs", url: "https://react.dev/" }
      ]
    },
    {
      id: "backend-development",
      name: "Backend Development",
      icon: Heart,
      description: "Create and manage server-side applications with Node.js, Express, or similar technologies.",
      difficulty: "Intermediate",
      timeEstimate: "3-4 weeks",
      completed: false,
      resources: [
        { name: "Node.js Docs", url: "https://nodejs.org/en/docs" },
        { name: "Express Docs", url: "https://expressjs.com/" }
      ]
    },
    {
      id: "database-management",
      name: "Database Management",
      icon: Heart,
      description: "Work with relational and NoSQL databases like PostgreSQL and MongoDB.",
      difficulty: "Intermediate",
      timeEstimate: "2-3 weeks",
      completed: false,
      resources: [
        { name: "PostgreSQL Tutorial", url: "https://www.postgresql.org/docs/" },
        { name: "MongoDB University", url: "https://learn.mongodb.com/" }
      ]
    },
    {
      id: "deployment",
      name: "Deployment & DevOps",
      icon: Heart,
      description: "Deploy and manage apps using cloud platforms like AWS, Vercel, or Heroku.",
      difficulty: "Intermediate",
      timeEstimate: "1-2 weeks",
      completed: false,
      resources: [
        { name: "AWS Getting Started", url: "https://aws.amazon.com/getting-started/" },
        { name: "Vercel Docs", url: "https://vercel.com/docs" }
      ]
    }
  ]
},
"product-designer": {
  roleName: "Product Designer",
  skills: [
    {
      id: "user-research",
      name: "User Research",
      icon: Heart,
      description: "Gather insights from users to guide design decisions.",
      difficulty: "Beginner",
      timeEstimate: "1-2 weeks",
      completed: false,
      resources: [
        { name: "IDEO Design Kit", url: "https://www.designkit.org/" }
      ]
    },
    {
      id: "wireframing",
      name: "Wireframing & Prototyping",
      icon: Heart,
      description: "Create wireframes and prototypes to visualize product concepts.",
      difficulty: "Beginner",
      timeEstimate: "1-2 weeks",
      completed: false,
      resources: [
        { name: "Figma Learn", url: "https://help.figma.com/hc/en-us/articles/360040518034-Learn-design-with-Figma" }
      ]
    },
    {
      id: "ui-design",
      name: "UI Design Principles",
      icon: Heart,
      description: "Design visually appealing and accessible interfaces.",
      difficulty: "Intermediate",
      timeEstimate: "2-3 weeks",
      completed: false,
      resources: [
        { name: "Material Design Guidelines", url: "https://material.io/design" }
      ]
    },
    {
      id: "usability-testing",
      name: "Usability Testing",
      icon: Heart,
      description: "Test designs with real users to identify improvements.",
      difficulty: "Beginner",
      timeEstimate: "1 week",
      completed: false,
      resources: [
        { name: "Nielsen Norman Group Usability Testing", url: "https://www.nngroup.com/articles/usability-testing-101/" }
      ]
    }
  ]
},
"technical-cofounder": {
  roleName: "Technical Cofounder",
  skills: [
    {
      id: "product-strategy",
      name: "Product Strategy",
      icon: Heart,
      description: "Define the product vision, roadmap, and priorities based on market needs.",
      difficulty: "Intermediate",
      timeEstimate: "2-3 weeks",
      completed: false,
      resources: [
        { name: "Product Plan Strategy Guide", url: "https://www.productplan.com/learn/product-strategy/" }
      ]
    },
    {
      id: "technical-architecture",
      name: "Technical Architecture",
      icon: Heart,
      description: "Design the technical foundation and choose the right stack for scalability.",
      difficulty: "Advanced",
      timeEstimate: "3-4 weeks",
      completed: false,
      resources: [
        { name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" }
      ]
    },
    {
      id: "team-management",
      name: "Team Management",
      icon: Heart,
      description: "Build, lead, and mentor the engineering team.",
      difficulty: "Intermediate",
      timeEstimate: "2 weeks",
      completed: false,
      resources: [
        { name: "Harvard Business Review Leadership", url: "https://hbr.org/topic/leadership" }
      ]
    },
    {
      id: "fundraising-tech",
      name: "Technical Support for Fundraising",
      icon: Heart,
      description: "Prepare technical documentation and prototypes for investor pitches.",
      difficulty: "Intermediate",
      timeEstimate: "1-2 weeks",
      completed: false,
      resources: [
        { name: "Y Combinator Pitch Guide", url: "https://www.ycombinator.com/library" }
      ]
    }
  ]
},
  //Cyber security
  "cybersecurity-analyst": {
  roleName: "Cyber Security Specialist",
  skills: [
    {
      id: "network-security",
      name: "Network Security Fundamentals",
      icon: Heart,
      description: "Understand firewalls, VPNs, intrusion detection systems, and securing network traffic.",
      difficulty: "Beginner",
      timeEstimate: "2-3 weeks",
      completed: false,
      resources: [
        { name: "Cisco Networking Basics", url: "https://www.cisco.com/c/en/us/training-events/training-certifications/exams/current-list/ccna.html" },
        { name: "Network Security Essentials", url: "https://www.geeksforgeeks.org/network-security/" }
      ]
    },
    {
      id: "ethical-hacking",
      name: "Ethical Hacking & Penetration Testing",
      icon: Heart,
      description: "Learn penetration testing tools, exploit techniques, and security assessment methods.",
      difficulty: "Intermediate",
      timeEstimate: "3-4 weeks",
      completed: false,
      resources: [
        { name: "Kali Linux Docs", url: "https://www.kali.org/docs/" },
        { name: "OWASP Testing Guide", url: "https://owasp.org/www-project-web-security-testing-guide/" }
      ]
    },
    {
      id: "cryptography",
      name: "Cryptography Basics",
      icon: Heart,
      description: "Secure communications using encryption, hashing, and digital signatures.",
      difficulty: "Intermediate",
      timeEstimate: "2-3 weeks",
      completed: false,
      resources: [
        { name: "Cryptography for Beginners", url: "https://www.geeksforgeeks.org/cryptography-and-its-types/" },
        { name: "Applied Cryptography", url: "https://www.schneier.com/books/applied-cryptography/" }
      ]
    },
    {
      id: "incident-response",
      name: "Incident Response",
      icon: Heart,
      description: "Identify, contain, and recover from security incidents and breaches.",
      difficulty: "Intermediate",
      timeEstimate: "1-2 weeks",
      completed: false,
      resources: [
        { name: "SANS Incident Response", url: "https://www.sans.org/incident-response/" }
      ]
    },
    {
      id: "web-security",
      name: "Web Application Security",
      icon: Heart,
      description: "Protect web applications from vulnerabilities like SQL injection and XSS.",
      difficulty: "Intermediate",
      timeEstimate: "2-3 weeks",
      completed: false,
      resources: [
        { name: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" },
        { name: "Web Security Academy", url: "https://portswigger.net/web-security" }
      ]
    },
    {
      id: "cloud-security",
      name: "Cloud Security",
      icon: Heart,
      description: "Secure cloud infrastructure and services, focusing on AWS, Azure, or Google Cloud.",
      difficulty: "Intermediate",
      timeEstimate: "2-4 weeks",
      completed: false,
      resources: [
        { name: "AWS Security Best Practices", url: "https://aws.amazon.com/architecture/security-identity-compliance/" },
        { name: "Cloud Security Alliance", url: "https://cloudsecurityalliance.org/" }
      ]
    }
  ]
},
// Software engineer
"software-engineer": {
  roleName: "Software Engineer",
  skills: [
    {
      id: "problem-solving",
      name: "Problem-Solving & Algorithms",
      icon: Brain,
      description: "Apply logical thinking, data structures, and algorithms to solve complex problems efficiently.",
      difficulty: "Intermediate",
      timeEstimate: "3-4 weeks",
      completed: false,
      resources: [
        { name: "GeeksforGeeks Algorithms", url: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/" },
        { name: "Big O Cheat Sheet", url: "https://www.bigocheatsheet.com/" }
      ]
    },
    {
      id: "version-control",
      name: "Version Control with Git",
      icon: GitBranch,
      description: "Collaborate on code, track changes, and manage projects using Git and GitHub.",
      difficulty: "Beginner",
      timeEstimate: "1-2 weeks",
      completed: false,
      resources: [
        { name: "Pro Git Book", url: "https://git-scm.com/book/en/v2" },
        { name: "GitHub Guides", url: "https://guides.github.com/" }
      ]
    },
    {
      id: "oop",
      name: "Object-Oriented Programming (OOP)",
      icon: Layers,
      description: "Write modular, reusable, and maintainable code using classes, objects, and design patterns.",
      difficulty: "Intermediate",
      timeEstimate: "3-4 weeks",
      completed: false,
      resources: [
        { name: "OOP Principles", url: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/" },
        { name: "Refactoring Guru", url: "https://refactoring.guru/design-patterns" }
      ]
    },
    {
      id: "database",
      name: "Databases & SQL",
      icon: Database,
      description: "Design, query, and manage relational and non-relational databases effectively.",
      difficulty: "Intermediate",
      timeEstimate: "2-3 weeks",
      completed: false,
      resources: [
        { name: "SQLBolt", url: "https://sqlbolt.com/" },
        { name: "MongoDB University", url: "https://learn.mongodb.com/" }
      ]
    },
    {
      id: "software-testing",
      name: "Software Testing",
      icon: CheckCircle,
      description: "Ensure software quality through unit, integration, and system testing techniques.",
      difficulty: "Intermediate",
      timeEstimate: "2 weeks",
      completed: false,
      resources: [
        { name: "Testing JavaScript", url: "https://testingjavascript.com/" },
        { name: "JUnit Tutorial", url: "https://www.javatpoint.com/junit-tutorial" }
      ]
    },
    {
      id: "system-design",
      name: "System Design Fundamentals",
      icon: Server,
      description: "Architect scalable and maintainable systems by applying design principles and patterns.",
      difficulty: "Advanced",
      timeEstimate: "4-6 weeks",
      completed: false,
      resources: [
        { name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" },
        { name: "Grokking the System Design Interview", url: "https://www.educative.io/courses/grokking-the-system-design-interview" }
      ]
    }
  ]
},
  /* Law */
  "lawyer": {
    roleName: "Lawyer / Legal Officer",
    skills: [
      {
        id: "legal-research",
        name: "Legal Research",
        icon: BookOpen,
        description: "Source and interpret case law and statutory instruments.",
        difficulty: "Intermediate",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "Nigerian Legal Info", url: "https://nigerialii.org" },
          { name: "Harvard Legal Research Guide", url: "https://guides.library.harvard.edu/legalresearch" }
        ]
      },
      {
        id: "contract-drafting",
        name: "Contract Drafting",
        icon: FileText,
        description: "Compose legally binding agreements with correct clauses.",
        difficulty: "Intermediate",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "Practical Law Contracts", url: "https://uk.practicallaw.thomsonreuters.com" }
        ]
      }
    ]
  },
  "litigation-specialist": {
    roleName: "Litigation Specialist",
    skills: [
      {
        id: "case-strategy",
        name: "Case Strategy",
        icon: Lightbulb,
        description: "Develop and adapt legal arguments for trials.",
        difficulty: "Advanced",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "Trial Advocacy Resources", url: "https://www.nationalparalegal.edu" }
        ]
      },
      {
        id: "cross-examination",
        name: "Cross Examination",
        icon: Users,
        description: "Conduct effective questioning to challenge testimony.",
        difficulty: "Advanced",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "Litigation Skills Guides", url: "https://www.lawprose.org" }
        ]
      }
    ]
  },

  /* Nursing */
  "registered-nurse": {
    roleName: "Registered Nurse",
    skills: [
      {
        id: "patient-assessment",
        name: "Patient Assessment",
        icon: ClipboardList,
        description: "Evaluate patient conditions and vital signs accurately.",
        difficulty: "Beginner",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "Nursing Assessment Guide", url: "https://www.registerednursing.org/nursing-assessment/" }
        ]
      },
      {
        id: "infection-control",
        name: "Infection Control",
        icon: Shield,
        description: "Apply protocols to prevent hospital-acquired infections.",
        difficulty: "Intermediate",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "WHO Infection Prevention", url: "https://www.who.int" }
        ]
      }
    ]
  },
  "midwife": {
    roleName: "Midwife",
    skills: [
      {
        id: "prenatal-care",
        name: "Prenatal Care",
        icon: Heart,
        description: "Monitor and support expectant mothers during pregnancy.",
        difficulty: "Beginner",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "WHO Antenatal Care", url: "https://www.who.int" }
        ]
      },
      {
        id: "delivery-assistance",
        name: "Delivery Assistance",
        icon: Users,
        description: "Assist safely during childbirth.",
        difficulty: "Intermediate",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "Midwifery Guidelines", url: "https://www.internationalmidwives.org" }
        ]
      }
    ]
  },

  /* Pharmacy */
  "clinical-pharmacist": {
    roleName: "Clinical Pharmacist",
    skills: [
      {
        id: "pharmacology",
        name: "Pharmacology",
        icon: BookOpen,
        description: "Understand drug actions, interactions, and therapeutics.",
        difficulty: "Intermediate",
        timeEstimate: "4 weeks",
        completed: false,
        resources: [
          { name: "Khan Academy Pharmacology", url: "https://www.khanacademy.org" }
        ]
      },
      {
        id: "medication-therapy",
        name: "Medication Therapy Management",
        icon: ClipboardList,
        description: "Optimize treatment plans for patient outcomes.",
        difficulty: "Advanced",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "Clinical Pharmacy Texts", url: "https://www.ncbi.nlm.nih.gov" }
        ]
      }
    ]
  },
  "retail-pharmacist": {
    roleName: "Retail Pharmacist",
    skills: [
      {
        id: "customer-service",
        name: "Customer Service",
        icon: Users,
        description: "Communicate effectively with walk-in patients about medications.",
        difficulty: "Beginner",
        timeEstimate: "1-2 weeks",
        completed: false,
        resources: [
          { name: "Service Excellence Articles", url: "https://hbr.org" }
        ]
      },
      {
        id: "dispensing",
        name: "Dispensing & Counseling",
        icon: Heart,
        description: "Accurately give medications and advise on usage.",
        difficulty: "Intermediate",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "Pharmacy Practice Standards", url: "https://www.fip.org" }
        ]
      }
    ]
  },

  /* Medicine */
  "medical-doctor": {
    roleName: "Medical Doctor",
    skills: [
      {
        id: "clinical-diagnosis",
        name: "Clinical Diagnosis",
        icon: Globe,
        description: "Assess and determine medical conditions from symptoms.",
        difficulty: "Advanced",
        timeEstimate: "6 weeks",
        completed: false,
        resources: [
          { name: "UpToDate (institutional)", url: "https://www.uptodate.com" }
        ]
      },
      {
        id: "patient-communication",
        name: "Patient Communication",
        icon: Users,
        description: "Explain conditions and treatments empathetically.",
        difficulty: "Beginner",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "Harvard Health Communication", url: "https://www.health.harvard.edu" }
        ]
      }
    ]
  },
  "epidemiologist": {
    roleName: "Epidemiologist",
    skills: [
      {
        id: "surveillance",
        name: "Disease Surveillance",
        icon: Activity,
        description: "Track and interpret patterns of disease spread.",
        difficulty: "Intermediate",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "CDC Surveillance Resources", url: "https://www.cdc.gov" }
        ]
      },
      {
        id: "statistical-analysis",
        name: "Statistical Analysis",
        icon: TrendingUp,
        description: "Use statistics to model outbreaks and interventions.",
        difficulty: "Advanced",
        timeEstimate: "4 weeks",
        completed: false,
        resources: [
          { name: "R for Epidemiology", url: "https://cran.r-project.org" }
        ]
      }
    ]
  },
  "medical-researcher": {
    roleName: "Medical Researcher",
    skills: [
      {
        id: "research-methods",
        name: "Research Methodology",
        icon: Lightbulb,
        description: "Design and plan biomedical studies.",
        difficulty: "Advanced",
        timeEstimate: "4 weeks",
        completed: false,
        resources: [
          { name: "NIH Research Training", url: "https://www.nih.gov" }
        ]
      },
      {
        id: "biostatistics",
        name: "Biostatistics",
        icon: TrendingUp,
        description: "Apply statistical techniques to biological data.",
        difficulty: "Advanced",
        timeEstimate: "4 weeks",
        completed: false,
        resources: [
          { name: "Biostatistics Texts", url: "https://www.openintro.org" }
        ]
      }
    ]
  },
  "medical-lecturer": {
    roleName: "Medical Lecturer",
    skills: [
      {
        id: "curriculum-development",
        name: "Curriculum Development",
        icon: BookOpen,
        description: "Design medical course content and assessments.",
        difficulty: "Intermediate",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "Instructional Design Basics", url: "https://www.coursera.org" }
        ]
      },
      {
        id: "teaching",
        name: "Teaching & Mentorship",
        icon: Users,
        description: "Deliver lectures and guide students effectively.",
        difficulty: "Beginner",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "Effective Teaching Practices", url: "https://www.edutopia.org" }
        ]
      }
    ]
  },

  /* Business Administration */
  "operations-manager": {
    roleName: "Operations Manager",
    skills: [
      {
        id: "process-improvement",
        name: "Process Improvement",
        icon: Lightbulb,
        description: "Optimize workflows using Lean/Six Sigma principles.",
        difficulty: "Intermediate",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "Lean Six Sigma Overview", url: "https://goleansixsigma.com" }
        ]
      },
      {
        id: "supply-chain",
        name: "Supply Chain Management",
        icon: Layers,
        description: "Coordinate sourcing, production, and delivery efficiently.",
        difficulty: "Intermediate",
        timeEstimate: "3-4 weeks",
        completed: false,
        resources: [
          { name: "SCM Fundamentals", url: "https://www.cips.org" }
        ]
      }
    ]
  },
  "hr-generalist": {
    roleName: "HR Generalist",
    skills: [
      {
        id: "recruitment",
        name: "Recruitment & Onboarding",
        icon: Users,
        description: "Source talent and integrate them into the organization.",
        difficulty: "Beginner",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "SHRM Resources", url: "https://www.shrm.org" }
        ]
      },
      {
        id: "performance-management",
        name: "Performance Management",
        icon: ClipboardList,
        description: "Track and improve employee performance.",
        difficulty: "Intermediate",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "Performance Review Best Practices", url: "https://hbr.org" }
        ]
      }
    ]
  },
  "business-development-officer": {
    roleName: "Business Development Officer",
    skills: [
      {
        id: "lead-generation",
        name: "Lead Generation",
        icon: TrendingUp,
        description: "Identify and qualify potential growth opportunities.",
        difficulty: "Beginner",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "Sales Funnel Guides", url: "https://www.hubspot.com" }
        ]
      },
      {
        id: "negotiation",
        name: "Negotiation Skills",
        icon: Lightbulb,
        description: "Close deals and manage partnerships effectively.",
        difficulty: "Intermediate",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "Getting to Yes", url: "https://www.pon.harvard.edu" }
        ]
      }
    ]
  },
  "management-consultant": {
    roleName: "Management Consultant",
    skills: [
      {
        id: "problem-solving",
        name: "Problem Solving",
        icon: Lightbulb,
        description: "Break down complex business issues into actionable plans.",
        difficulty: "Advanced",
        timeEstimate: "3 weeks",
        completed: false,
        resources: [
          { name: "McKinsey Problem Solving", url: "https://www.mckinsey.com" }
        ]
      },
      {
        id: "strategy-design",
        name: "Strategy Design",
        icon: TrendingUp,
        description: "Develop long-term plans aligned with organizational goals.",
        difficulty: "Advanced",
        timeEstimate: "3-4 weeks",
        completed: false,
        resources: [
          { name: "Strategy Resources", url: "https://www.bcg.com" }
        ]
      }
    ]
  },
  "project-manager": {
    roleName: "Project Manager",
    skills: [
      {
        id: "risk-management",
        name: "Risk Management",
        icon: Shield,
        description: "Identify, assess, and mitigate project risks.",
        difficulty: "Intermediate",
        timeEstimate: "2-3 weeks",
        completed: false,
        resources: [
          { name: "PMI Risk Management", url: "https://www.pmi.org" }
        ]
      },
      {
        id: "agile-scrum",
        name: "Agile / Scrum",
        icon: Calendar,
        description: "Run projects with iterative feedback loops and sprints.",
        difficulty: "Beginner",
        timeEstimate: "2 weeks",
        completed: false,
        resources: [
          { name: "Scrum Guide", url: "https://scrumguides.org" }
        ]
      }
    ]
  }
};

export default skillsData;