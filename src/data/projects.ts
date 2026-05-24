export interface Metric {
  value: string;
  label: string;
}

export interface Project {
  id:           string;
  slug:         string;
  title:        string;
  tagline:      string;
  description:  string;
  category:     "fullstack" | "frontend" | "ai" | "opensource";
  accentKey:    "cyan" | "red" | "violet" | "amber" | "green" | "pink";
  accentSecKey: "cyan" | "red" | "violet" | "amber" | "green" | "pink";
  emoji:        string;
  featured:     boolean;
  status:       "shipped" | "live" | "beta";
  metrics:      Metric[];
  tech:         string[];
  github:       string;
  live:         string;
  year:         string;
}

export const PROJECTS: Project[] = [
  {
    id: "techpath", slug: "01",
    title: "TechPath", tagline: "Structured technology roadmap platform",
    description: "Developed TechPath, a structured technology roadmap platform designed to help students explore learning paths, development roadmaps, and technical growth resources through a clean and interactive interface.",
    category: "frontend", accentKey: "cyan", accentSecKey: "violet",
    emoji: "🗺️", featured: true, status: "live",
    metrics: [{ value:"Live", label:"Status" },{ value:"React", label:"Framework" },{ value:"Clean UI", label:"Design" }],
    tech: ["React","Tailwind CSS","JavaScript"],
    github: "https://github.com/kommala50-web/vijay-techpath", live: "https://vijay-techpath.netlify.app/", year: "2024",
  },
  {
    id: "expense-tracker", slug: "02",
    title: "Smart Expense Tracker", tagline: "Personal finance dashboard",
    description: "Built a responsive expense tracking platform for monitoring personal spending, budgeting, and financial categorization through an intuitive dashboard interface.",
    category: "fullstack", accentKey: "violet", accentSecKey: "pink",
    emoji: "💰", featured: true, status: "live",
    metrics: [{ value:"Live", label:"Status" },{ value:"Next.js", label:"Framework" },{ value:"MongoDB", label:"Database" }],
    tech: ["React","Next.js","Tailwind CSS","MongoDB"],
    github: "https://github.com/kommala50-web/smart-expense-tracker", live: "https://smart-expense-tracker-2-ozil.onrender.com/", year: "2024",
  },
  {
    id: "agritrust", slug: "03",
    title: "AgriTrust", tagline: "Agriculture transparency platform",
    description: "Developed AgriTrust, a concept-driven agriculture-focused platform aimed at improving trust, transparency, and accessibility within agricultural ecosystems through digital solutions.",
    category: "frontend", accentKey: "green", accentSecKey: "amber",
    emoji: "🌾", featured: false, status: "live",
    metrics: [{ value:"Live", label:"Status" },{ value:"Concept", label:"Stage" },{ value:"Vercel", label:"Hosted" }],
    tech: ["React","Tailwind CSS","JavaScript","Vercel"],
    github: "", live: "https://agri-trust-three.vercel.app/", year: "2025",
  },
  {
    id: "smart-attendance", slug: "04",
    title: "Smart Attendance System", tagline: "AI-powered facial recognition attendance",
    description: "Developed an AI-assisted smart attendance system using facial recognition to automate attendance tracking and reduce manual verification overhead.",
    category: "ai", accentKey: "amber", accentSecKey: "red",
    emoji: "📸", featured: false, status: "shipped",
    metrics: [{ value:"AI", label:"Powered" },{ value:"OpenCV", label:"Vision" },{ value:"Auto", label:"Tracking" }],
    tech: ["Python","OpenCV","Face Recognition"],
    github: "", live: "", year: "2025",
  },
];

export const PROJECT_FILTERS = [
  { id: "all",        label: "All Work",    icon: "◈" },
  { id: "fullstack",  label: "Fullstack",   icon: "⬡" },
  { id: "frontend",   label: "Frontend",    icon: "◇" },
  { id: "ai",         label: "AI / ML",     icon: "◎" },
  { id: "opensource", label: "Open Source", icon: "⬢" },
] as const;
