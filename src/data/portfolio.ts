export interface Project {
  title: string;
  period: string;
  role: string;
  link?: string;
  overview: string;
  impact: string[];
  tags: string[];
}

export const projects: Project[] = [
  {
    title: "Fulfillment Nextgen",
    period: "July 2023 – June 2024",
    role: "Backend Engineer",
    link: "https://www.tokopedia.com/tagihan/",
    overview: "Split fulfillment flows from legacy code into dedicated services to reduce delivery bottlenecks and operational risk.",
    impact: [
      "Reduced feature lead time by decoupling release cycles",
      "Simplified integration testing across fulfillment domains",
      "Improved on-call debugging with clearer service boundaries",
      "Implemented async processing with throttling for order prioritization"
    ],
    tags: ["Go", "gRPC", "Microservices", "Message Queue", "Observability"]
  },
  {
    title: "Smart-Card Auto Escalation",
    period: "July 2023 – December 2023",
    role: "Backend Engineer",
    link: "https://www.tokopedia.com/emoney/",
    overview: "Built an automated escalation flow for Mandiri e-money balance update failures that previously required manual handling.",
    impact: [
      "Reduced customer support tickets by 60%",
      "Saved tens of millions IDR monthly in operational costs",
      "Removed manual customer reporting for most affected cases"
    ],
    tags: ["Go", "Automation", "Email Processing", "Microservices"]
  },
  {
    title: "Partner Self-Onboarding",
    period: "January 2022 – June 2022",
    role: "Backend Engineer",
    link: "https://www.tokopedia.com/partner/register",
    overview: "Replaced manual Digital B2B onboarding steps with a self-service platform for faster partner activation.",
    impact: [
      "Reduced B2B onboarding time by 80%",
      "Cut technical integration time by 50%",
      "Enabled partners to complete onboarding independently"
    ],
    tags: ["Go", "Self-Service", "B2B", "Automation"]
  },
  {
    title: "Lugna App",
    period: "August 2020 – December 2020",
    role: "UI/UX Designer",
    link: "https://apps.apple.com/id/app/lugna/id1538556393",
    overview: "Designed a guided journaling app to improve communication between patients, caregivers, and clinicians.",
    impact: [
      "Improved communication quality between users and clinicians",
      "Increased journaling consistency with guided prompts",
      "Conducted expert interviews with mental health professionals"
    ],
    tags: ["Swift", "iOS", "UI/UX", "Mental Health", "CloudKit"]
  },
  {
    title: "Videre / Mumu App",
    period: "June 2020 – December 2020",
    role: "iOS Developer",
    link: "https://github.com/Videre-App",
    overview: "Built an AR assistant for visual and mural artists to preview layouts and calculate grid sizing faster.",
    impact: [
      "Reduced manual grid calculation time for mural planning",
      "Implemented AR workflows using MVC architecture",
      "Added cloud save with Core Data and CloudKit"
    ],
    tags: ["Swift", "ARKit", "iOS", "Core Data", "CloudKit"]
  }
];

export const skills = [
  {
    category: "Programming Languages",
    skills: "Go (Golang), Node.js, JavaScript, TypeScript, Swift, SQL"
  },
  {
    category: "Backend & Data",
    skills: "Microservices, Clean Architecture, REST, gRPC, NestJS, PostgreSQL, MySQL, Redis, NATS, RabbitMQ"
  },
  {
    category: "Infrastructure & Cloud",
    skills: "AWS, GCP, Kubernetes, Docker, GitLab CI/CD, Linux"
  },
  {
    category: "Observability & Quality",
    skills: "DataDog, Splunk, New Relic, SonarQube"
  },
  {
    category: "Core Competencies",
    skills: "Technical Leadership, System Design, SDLC, Cross-Team Collaboration"
  }
];

export const workExperience = [
  {
    role: "Software Engineer",
    company: "Telkomsel",
    period: "Oct 2024 – Present",
    phase: "Modernization",
    summary: "Service ownership, software quality standards, and modernization across the MyTelkomsel web ecosystem.",
    proof: ["27 services", "GitLab CI/CD", "Quality gates"],
    projects: [
      {
        title: "MyTelkomsel Web Ecosystem",
        description: "Transitioned development ownership from external vendors to internal teams with minimal delivery disruption.",
        impact: [
          "Managed and optimized 27 microservices serving millions of users.",
          "Maintained sprint velocity during a high-risk vendor handover phase."
        ]
      },
      {
        title: "Infrastructure & Quality Modernization",
        description: "Modernized deployment workflows and enforced quality gates in the delivery pipeline.",
        impact: [
          "Migrated deployment pipelines from Jenkins to GitLab CI/CD.",
          "Implemented green pipeline standards with automated SonarQube checks."
        ]
      }
    ]
  },
  {
    role: "Software Engineer",
    company: "Tokopedia",
    period: "Oct 2021 – Aug 2024",
    phase: "Scale",
    summary: "Backend ownership for digital fulfillment, supplier integrations, reliability, and operational efficiency.",
    proof: ["4,000+ SKUs", "100+ suppliers", ">300 RPS"],
    projects: [
      {
        title: "Fulfillment Nextgen",
        description: "Built services that separated fulfillment processes from the legacy platform.",
        impact: [
          "Reduced time to deliver new fulfillment features.",
          "Improved deployment confidence with better service boundaries."
        ]
      },
      {
        title: "High-Performance & Cost Optimization",
        description: "Improved fulfillment latency, reliability, and infrastructure efficiency through targeted optimization.",
        impact: [
          "Improved order fulfillment speed from 4s to 1s.",
          "Achieved a 200% CVR improvement by optimizing caching strategies."
        ]
      }
    ]
  },
  {
    role: "Developer",
    company: "Apple Academy",
    period: "2020",
    phase: "Product",
    summary: "iOS product work, user research, and interface decisions before specializing deeper in backend systems.",
    proof: ["7 iOS apps", "Usability testing", "Swift"],
    projects: [
      {
        title: "Videre/Mumu AR App",
        description: "AR app that helped visual artists plan and measure mural grids.",
        impact: [
          "Simplified grid calculation workflows for mural artists.",
          "Implemented MVC architecture and cloud saves via CloudKit."
        ]
      },
      {
        title: "Lugna Smart Journaling App",
        description: "Journaling app designed for better communication between patients and clinicians.",
        impact: [
          "Conducted research with mental health patients.",
          "Led user and usability testing cycles."
        ]
      }
    ]
  }
];

export const education = [
  {
    degree: "Bachelor of Computer Science",
    institution: "Binus University",
    location: "Indonesia",
    period: "2017–2021"
  }
];
