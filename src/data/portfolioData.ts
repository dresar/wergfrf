// Portfolio Data Structure - Mirroring SQL Tables

// Hero Section Data
export interface HeroProfession {
  id: number;
  title: string;
  order: number;
}

export interface HeroSection {
  id: number;
  name: string;
  tagline: string;
  description: string;
  resumeUrl: string;
  profileImage: string;
  professions: HeroProfession[];
}

export const heroData: HeroSection = {
  id: 1,
  name: "Eka Syarif Maulana",
  tagline: "Crafting Digital Experiences",
  description: "I'm a passionate developer and designer creating beautiful, functional digital experiences that make a difference.",
  resumeUrl: "/resume.pdf",
  profileImage: "/profile.jpg",
  professions: [
    { id: 1, title: "Web Developer", order: 1 },
    { id: 2, title: "UI/UX Designer", order: 2 },
    { id: 3, title: "Creative Technologist", order: 3 },
    { id: 4, title: "Digital Innovator", order: 4 },
  ],
};

// About Section Data
export interface AboutStats {
  id: number;
  label: string;
  value: number;
  suffix: string;
}

export interface AboutSection {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  image: string;
  stats: AboutStats[];
}

export const aboutData: AboutSection = {
  id: 1,
  title: "About Me",
  subtitle: "Passionate Developer & Designer",
  description: "With over 4 years of experience in web development and UI/UX design, I specialize in creating modern, responsive, and user-centric digital solutions.",
  longDescription: "I believe in the power of technology to transform ideas into reality. My approach combines technical expertise with creative thinking to deliver exceptional digital experiences. Whether it's building scalable web applications or designing intuitive interfaces, I'm committed to excellence in every project.",
  image: "/about-image.jpg",
  stats: [
    { id: 1, label: "Years Experience", value: 4, suffix: "+" },
    { id: 2, label: "Projects Completed", value: 50, suffix: "+" },
    { id: 3, label: "Happy Clients", value: 30, suffix: "+" },
    { id: 4, label: "Awards Won", value: 12, suffix: "" },
  ],
};

// Education Data
export interface EducationGalleryPhoto {
  id: number;
  imageUrl: string;
  caption: string;
  order: number;
}

export interface EducationDocument {
  id: number;
  title: string;
  type: "ijazah" | "khs" | "certificate";
  imageUrl: string;
}

export interface EducationHighlight {
  id: number;
  text: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number | null;
  gpa: number;
  description: string;
  logo: string;
  gallery: EducationGalleryPhoto[];
  documents: EducationDocument[];
  highlights: EducationHighlight[];
}

export const educationData: Education[] = [
  {
    id: 1,
    institution: "Universitas Muhammadiyah Sumatera Utara",
    degree: "Bachelor's Degree",
    field: "Information Technology",
    startYear: 2019,
    endYear: 2023,
    gpa: 3.68,
    description: "Focused on software engineering, web development, and human-computer interaction. Active in various technology clubs and competitions.",
    logo: "/umsu-logo.png",
    gallery: [
      { id: 1, imageUrl: "/gallery/campus-1.jpg", caption: "Main Campus Building", order: 1 },
      { id: 2, imageUrl: "/gallery/campus-2.jpg", caption: "Library", order: 2 },
      { id: 3, imageUrl: "/gallery/graduation.jpg", caption: "Graduation Day", order: 3 },
    ],
    documents: [
      { id: 1, title: "Bachelor's Degree Certificate", type: "ijazah", imageUrl: "/docs/ijazah.jpg" },
      { id: 2, title: "Academic Transcript", type: "khs", imageUrl: "/docs/transcript.jpg" },
    ],
    highlights: [
      { id: 1, text: "1st Place Chess Championship" },
      { id: 2, text: "GPA 3.68/4.00" },
      { id: 3, text: "Best Thesis Award" },
    ],
  },
  {
    id: 2,
    institution: "SMA Negeri 1 Medan",
    degree: "High School",
    field: "Science Major",
    startYear: 2016,
    endYear: 2019,
    gpa: 3.9,
    description: "Active in science olympiad and student council. Developed early interest in programming and technology.",
    logo: "/sma-logo.png",
    gallery: [
      { id: 1, imageUrl: "/gallery/school-1.jpg", caption: "School Building", order: 1 },
    ],
    documents: [
      { id: 1, title: "High School Diploma", type: "ijazah", imageUrl: "/docs/diploma-sma.jpg" },
    ],
    highlights: [
      { id: 1, text: "Student Council President" },
      { id: 2, text: "Science Olympiad Finalist" },
    ],
  },
];

// Skills Data
export interface Skill {
  id: number;
  name: string;
  level: number;
  category: "technical" | "design" | "soft" | "language";
  icon: string;
}

export interface TechStack {
  id: number;
  name: string;
  icon: string;
  category: string;
}

export const skillsData: Skill[] = [
  // Technical Skills
  { id: 1, name: "React.js", level: 95, category: "technical", icon: "react" },
  { id: 2, name: "TypeScript", level: 90, category: "technical", icon: "typescript" },
  { id: 3, name: "Node.js", level: 85, category: "technical", icon: "nodejs" },
  { id: 4, name: "Next.js", level: 88, category: "technical", icon: "nextjs" },
  { id: 5, name: "Tailwind CSS", level: 95, category: "technical", icon: "tailwind" },
  { id: 6, name: "PostgreSQL", level: 80, category: "technical", icon: "postgresql" },
  // Design Skills
  { id: 7, name: "Figma", level: 92, category: "design", icon: "figma" },
  { id: 8, name: "Adobe XD", level: 85, category: "design", icon: "xd" },
  { id: 9, name: "Photoshop", level: 80, category: "design", icon: "photoshop" },
  { id: 10, name: "Illustrator", level: 75, category: "design", icon: "illustrator" },
  // Soft Skills
  { id: 11, name: "Problem Solving", level: 95, category: "soft", icon: "brain" },
  { id: 12, name: "Team Collaboration", level: 90, category: "soft", icon: "users" },
  { id: 13, name: "Communication", level: 88, category: "soft", icon: "message" },
  { id: 14, name: "Leadership", level: 85, category: "soft", icon: "crown" },
  // Language Skills
  { id: 15, name: "Indonesian", level: 100, category: "language", icon: "flag" },
  { id: 16, name: "English", level: 85, category: "language", icon: "flag" },
  { id: 17, name: "Japanese", level: 40, category: "language", icon: "flag" },
];

export const techStackData: TechStack[] = [
  { id: 1, name: "React", icon: "⚛️", category: "Frontend" },
  { id: 2, name: "Vue.js", icon: "💚", category: "Frontend" },
  { id: 3, name: "TypeScript", icon: "🔷", category: "Language" },
  { id: 4, name: "Node.js", icon: "🟢", category: "Backend" },
  { id: 5, name: "Python", icon: "🐍", category: "Language" },
  { id: 6, name: "PostgreSQL", icon: "🐘", category: "Database" },
  { id: 7, name: "MongoDB", icon: "🍃", category: "Database" },
  { id: 8, name: "Docker", icon: "🐳", category: "DevOps" },
  { id: 9, name: "AWS", icon: "☁️", category: "Cloud" },
  { id: 10, name: "Git", icon: "🔀", category: "Tools" },
  { id: 11, name: "Figma", icon: "🎨", category: "Design" },
  { id: 12, name: "Tailwind", icon: "💨", category: "CSS" },
];

// Projects Data
export interface ProjectTechnology {
  id: number;
  name: string;
}

export interface ProjectChallenge {
  id: number;
  description: string;
}

export interface ProjectSolution {
  id: number;
  description: string;
}

export interface ProjectResult {
  id: number;
  metric: string;
  value: string;
}

export interface ProjectImage {
  id: number;
  url: string;
  caption: string;
  order: number;
}

export interface ProjectModalDetails {
  client: string;
  duration: string;
  role: string;
  challenges: ProjectChallenge[];
  solutions: ProjectSolution[];
  results: ProjectResult[];
}

export interface Project {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: "web" | "mobile" | "uiux";
  thumbnail: string;
  images: ProjectImage[];
  technologies: ProjectTechnology[];
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  completedDate: string;
  modalDetails: ProjectModalDetails;
}

export const projectsData: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    shortDescription: "A full-stack e-commerce solution with modern UI and seamless checkout experience.",
    fullDescription: "A comprehensive e-commerce platform built with React and Node.js, featuring product management, cart functionality, secure payment integration, and real-time inventory tracking.",
    category: "web",
    thumbnail: "/projects/ecommerce-thumb.jpg",
    images: [
      { id: 1, url: "/projects/ecommerce-1.jpg", caption: "Homepage", order: 1 },
      { id: 2, url: "/projects/ecommerce-2.jpg", caption: "Product Page", order: 2 },
      { id: 3, url: "/projects/ecommerce-3.jpg", caption: "Checkout", order: 3 },
    ],
    technologies: [
      { id: 1, name: "React" },
      { id: 2, name: "Node.js" },
      { id: 3, name: "PostgreSQL" },
      { id: 4, name: "Stripe" },
    ],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example",
    featured: true,
    completedDate: "2024-01-15",
    modalDetails: {
      client: "Fashion Retail Co.",
      duration: "4 months",
      role: "Full Stack Developer",
      challenges: [
        { id: 1, description: "Handling high traffic during sales events" },
        { id: 2, description: "Complex inventory management across warehouses" },
      ],
      solutions: [
        { id: 1, description: "Implemented Redis caching and CDN optimization" },
        { id: 2, description: "Built real-time sync system with WebSocket" },
      ],
      results: [
        { id: 1, metric: "Page Load Time", value: "-60%" },
        { id: 2, metric: "Conversion Rate", value: "+35%" },
        { id: 3, metric: "User Satisfaction", value: "4.8/5" },
      ],
    },
  },
  {
    id: 2,
    title: "Task Management App",
    shortDescription: "A beautiful and intuitive task management application with real-time collaboration.",
    fullDescription: "Built for teams who want to stay organized. Features include drag-and-drop boards, real-time updates, team collaboration, and detailed analytics.",
    category: "web",
    thumbnail: "/projects/taskapp-thumb.jpg",
    images: [
      { id: 1, url: "/projects/taskapp-1.jpg", caption: "Dashboard", order: 1 },
      { id: 2, url: "/projects/taskapp-2.jpg", caption: "Board View", order: 2 },
    ],
    technologies: [
      { id: 1, name: "Next.js" },
      { id: 2, name: "TypeScript" },
      { id: 3, name: "Prisma" },
      { id: 4, name: "WebSocket" },
    ],
    liveUrl: "https://example.com",
    githubUrl: null,
    featured: true,
    completedDate: "2023-11-20",
    modalDetails: {
      client: "StartupX Inc.",
      duration: "3 months",
      role: "Lead Developer",
      challenges: [
        { id: 1, description: "Real-time sync across multiple users" },
        { id: 2, description: "Complex permission system" },
      ],
      solutions: [
        { id: 1, description: "Implemented WebSocket with optimistic updates" },
        { id: 2, description: "Built RBAC with granular permissions" },
      ],
      results: [
        { id: 1, metric: "Team Productivity", value: "+45%" },
        { id: 2, metric: "Daily Active Users", value: "10K+" },
      ],
    },
  },
  {
    id: 3,
    title: "Fitness Mobile App",
    shortDescription: "A mobile fitness application with workout tracking and AI-powered recommendations.",
    fullDescription: "A cross-platform mobile app that helps users track their fitness journey with personalized workout plans, progress tracking, and AI-driven insights.",
    category: "mobile",
    thumbnail: "/projects/fitness-thumb.jpg",
    images: [
      { id: 1, url: "/projects/fitness-1.jpg", caption: "Home Screen", order: 1 },
      { id: 2, url: "/projects/fitness-2.jpg", caption: "Workout Tracker", order: 2 },
    ],
    technologies: [
      { id: 1, name: "React Native" },
      { id: 2, name: "Firebase" },
      { id: 3, name: "TensorFlow" },
    ],
    liveUrl: null,
    githubUrl: "https://github.com/example",
    featured: false,
    completedDate: "2023-08-10",
    modalDetails: {
      client: "FitLife Corp.",
      duration: "5 months",
      role: "Mobile Developer",
      challenges: [
        { id: 1, description: "Accurate exercise detection" },
        { id: 2, description: "Offline functionality" },
      ],
      solutions: [
        { id: 1, description: "Integrated TensorFlow Lite for on-device ML" },
        { id: 2, description: "Implemented SQLite with sync queue" },
      ],
      results: [
        { id: 1, metric: "App Store Rating", value: "4.7★" },
        { id: 2, metric: "Downloads", value: "50K+" },
      ],
    },
  },
  {
    id: 4,
    title: "Banking Dashboard UI",
    shortDescription: "A modern banking dashboard design with focus on accessibility and user experience.",
    fullDescription: "Designed a comprehensive banking dashboard that simplifies financial management with intuitive visualizations, quick actions, and accessibility features.",
    category: "uiux",
    thumbnail: "/projects/banking-thumb.jpg",
    images: [
      { id: 1, url: "/projects/banking-1.jpg", caption: "Overview", order: 1 },
      { id: 2, url: "/projects/banking-2.jpg", caption: "Analytics", order: 2 },
    ],
    technologies: [
      { id: 1, name: "Figma" },
      { id: 2, name: "Principle" },
      { id: 3, name: "Framer" },
    ],
    liveUrl: "https://figma.com/example",
    githubUrl: null,
    featured: true,
    completedDate: "2024-02-28",
    modalDetails: {
      client: "Digital Bank XYZ",
      duration: "2 months",
      role: "UI/UX Designer",
      challenges: [
        { id: 1, description: "Complex data visualization" },
        { id: 2, description: "WCAG AA compliance" },
      ],
      solutions: [
        { id: 1, description: "Created modular chart components" },
        { id: 2, description: "Built accessible color system and focus states" },
      ],
      results: [
        { id: 1, metric: "Usability Score", value: "94/100" },
        { id: 2, metric: "Task Completion", value: "+28%" },
      ],
    },
  },
];

// Experience Data
export interface ExperienceDetail {
  id: number;
  description: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  type: "fulltime" | "parttime" | "freelance" | "internship";
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  location: string;
  description: string;
  details: ExperienceDetail[];
  logo: string;
}

export const experienceData: Experience[] = [
  {
    id: 1,
    company: "Tech Innovators Ltd.",
    position: "Senior Frontend Developer",
    type: "fulltime",
    startDate: "2023-06-01",
    endDate: null,
    isCurrent: true,
    location: "Jakarta, Indonesia",
    description: "Leading frontend development team, architecting scalable solutions, and mentoring junior developers.",
    details: [
      { id: 1, description: "Led migration from Vue 2 to React 18, improving performance by 40%" },
      { id: 2, description: "Established coding standards and review processes" },
      { id: 3, description: "Mentored team of 5 junior developers" },
    ],
    logo: "/company/tech-innovators.png",
  },
  {
    id: 2,
    company: "Digital Solutions Inc.",
    position: "Full Stack Developer",
    type: "fulltime",
    startDate: "2021-08-01",
    endDate: "2023-05-31",
    isCurrent: false,
    location: "Medan, Indonesia",
    description: "Developed and maintained multiple client projects using modern web technologies.",
    details: [
      { id: 1, description: "Built 15+ client websites and web applications" },
      { id: 2, description: "Implemented CI/CD pipelines reducing deployment time by 60%" },
      { id: 3, description: "Collaborated with design team on UI/UX improvements" },
    ],
    logo: "/company/digital-solutions.png",
  },
  {
    id: 3,
    company: "StartupHub",
    position: "Frontend Developer Intern",
    type: "internship",
    startDate: "2021-01-01",
    endDate: "2021-07-31",
    isCurrent: false,
    location: "Remote",
    description: "Contributed to startup projects while learning industry best practices.",
    details: [
      { id: 1, description: "Developed responsive UI components using React" },
      { id: 2, description: "Participated in agile sprints and daily standups" },
    ],
    logo: "/company/startuphub.png",
  },
];

// Organization Data
export interface Organization {
  id: number;
  name: string;
  role: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
  logo: string;
}

export const organizationData: Organization[] = [
  {
    id: 1,
    name: "Google Developer Student Club",
    role: "Tech Lead",
    startDate: "2022-01-01",
    endDate: "2023-06-30",
    isCurrent: false,
    description: "Led technical workshops and organized hackathons for 200+ students.",
    logo: "/org/gdsc.png",
  },
  {
    id: 2,
    name: "Indonesian Developer Community",
    role: "Active Member",
    startDate: "2021-01-01",
    endDate: null,
    isCurrent: true,
    description: "Contributing to open source projects and community knowledge sharing.",
    logo: "/org/idc.png",
  },
];

// Certificates Data
export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string;
  credentialUrl: string;
  imageUrl: string;
  category: "course" | "event" | "seminar";
}

export const certificatesData: Certificate[] = [
  {
    id: 1,
    title: "Meta Frontend Developer Professional Certificate",
    issuer: "Meta (Coursera)",
    issueDate: "2023-12-15",
    expiryDate: null,
    credentialId: "ABC123XYZ",
    credentialUrl: "https://coursera.org/verify/ABC123XYZ",
    imageUrl: "/certs/meta-frontend.jpg",
    category: "course",
  },
  {
    id: 2,
    title: "Google UX Design Certificate",
    issuer: "Google (Coursera)",
    issueDate: "2023-08-20",
    expiryDate: null,
    credentialId: "GUX789DEF",
    credentialUrl: "https://coursera.org/verify/GUX789DEF",
    imageUrl: "/certs/google-ux.jpg",
    category: "course",
  },
  {
    id: 3,
    title: "HackFest 2023 - 2nd Place",
    issuer: "TechCommunity",
    issueDate: "2023-10-05",
    expiryDate: null,
    credentialId: "HF2023-002",
    credentialUrl: "",
    imageUrl: "/certs/hackfest.jpg",
    category: "event",
  },
  {
    id: 4,
    title: "Web3 & Blockchain Summit",
    issuer: "Blockchain Indonesia",
    issueDate: "2024-01-20",
    expiryDate: null,
    credentialId: "WBS-2024-123",
    credentialUrl: "",
    imageUrl: "/certs/web3-summit.jpg",
    category: "seminar",
  },
];

// Contact Data
export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
}

export interface ContactInfo {
  id: number;
  email: string;
  phone: string;
  location: string;
  mapEmbedUrl: string;
  socialLinks: SocialLink[];
}

export const contactData: ContactInfo = {
  id: 1,
  email: "eka.syarif@example.com",
  phone: "+62 812 3456 7890",
  location: "Medan, North Sumatra, Indonesia",
  mapEmbedUrl: "https://www.google.com/maps/embed?...",
  socialLinks: [
    { id: 1, platform: "GitHub", url: "https://github.com/ekasyarif", icon: "github" },
    { id: 2, platform: "LinkedIn", url: "https://linkedin.com/in/ekasyarif", icon: "linkedin" },
    { id: 3, platform: "Twitter", url: "https://twitter.com/ekasyarif", icon: "twitter" },
    { id: 4, platform: "Instagram", url: "https://instagram.com/ekasyarif", icon: "instagram" },
    { id: 5, platform: "Dribbble", url: "https://dribbble.com/ekasyarif", icon: "dribbble" },
  ],
};

// Navigation Data
export interface NavItem {
  id: number;
  label: string;
  href: string;
  order: number;
}

export const navItems: NavItem[] = [
  { id: 1, label: "Home", href: "#home", order: 1 },
  { id: 2, label: "About", href: "#about", order: 2 },
  { id: 3, label: "Education", href: "#education", order: 3 },
  { id: 4, label: "Skills", href: "#skills", order: 4 },
  { id: 5, label: "Projects", href: "#projects", order: 5 },
  { id: 6, label: "Experience", href: "#experience", order: 6 },
  { id: 7, label: "Certificates", href: "#certificates", order: 7 },
  { id: 8, label: "Contact", href: "#contact", order: 8 },
];
