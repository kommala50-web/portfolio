export interface Skill {
  name:  string;
  level: number; // 0–100
  years: string;
}

export interface SkillCategory {
  id:          string;
  label:       string;
  icon:        string;
  colorKey:    "cyan" | "violet" | "amber" | "green" | "pink";
  description: string;
  skills:      Skill[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "frontend", label: "Frontend", icon: "◈", colorKey: "cyan",
    description: "Building interfaces that feel alive",
    skills: [
      { name:"HTML5",         level:95, years:"2yr"  },
      { name:"CSS3",          level:93, years:"2yr"  },
      { name:"JavaScript",    level:90, years:"2yr"  },
      { name:"TypeScript",    level:82, years:"1yr"  },
      { name:"React.js",      level:90, years:"1.5yr"},
      { name:"Next.js",       level:85, years:"1yr"  },
      { name:"Tailwind CSS",  level:92, years:"1.5yr"},
      { name:"Framer Motion", level:80, years:"1yr"  },
    ],
  },
  {
    id: "backend", label: "Programming", icon: "⬡", colorKey: "violet",
    description: "Logic, systems & problem solving",
    skills: [
      { name:"C++",    level:85, years:"2yr"},
      { name:"Python", level:82, years:"1.5yr"},
    ],
  },
  {
    id: "database", label: "Backend / DB", icon: "◎", colorKey: "amber",
    description: "Data storage & cloud services",
    skills: [
      { name:"MongoDB",  level:82, years:"1yr"},
      { name:"Firebase", level:78, years:"1yr"},
    ],
  },
  {
    id: "devops", label: "Tools", icon: "⬢", colorKey: "green",
    description: "Workflow & development tooling",
    skills: [
      { name:"Git",     level:90, years:"2yr"  },
      { name:"GitHub",  level:90, years:"2yr"  },
      { name:"VS Code", level:95, years:"2yr"  },
      { name:"Postman", level:80, years:"1yr"  },
    ],
  },
  {
    id: "design", label: "Concepts", icon: "◇", colorKey: "pink",
    description: "Principles that drive quality",
    skills: [
      { name:"Responsive Design", level:92, years:"2yr"  },
      { name:"UI/UX Principles",  level:85, years:"1.5yr"},
      { name:"API Integration",   level:88, years:"1.5yr"},
      { name:"State Management",  level:82, years:"1yr"  },
      { name:"Problem Solving",   level:90, years:"2yr"  },
    ],
  },
];

// Neural network node definitions for the Skills canvas
export const NET_NODES = [
  { id:"react",    label:"React",          cat:"frontend", x:0.50, y:0.20, r:22 },
  { id:"nextjs",   label:"Next.js",        cat:"frontend", x:0.72, y:0.15, r:18 },
  { id:"ts",       label:"TypeScript",     cat:"frontend", x:0.28, y:0.18, r:18 },
  { id:"tailwind", label:"Tailwind",       cat:"frontend", x:0.15, y:0.28, r:16 },
  { id:"framer",   label:"Framer Motion",  cat:"frontend", x:0.82, y:0.28, r:15 },
  { id:"python",   label:"Python",         cat:"backend",  x:0.15, y:0.55, r:16 },
  { id:"cpp",      label:"C++",            cat:"backend",  x:0.82, y:0.55, r:15 },
  { id:"mongo",    label:"MongoDB",        cat:"database", x:0.75, y:0.75, r:17 },
  { id:"firebase", label:"Firebase",       cat:"database", x:0.28, y:0.75, r:15 },
  { id:"git",      label:"Git",            cat:"devops",   x:0.50, y:0.85, r:15 },
  { id:"postman",  label:"Postman",        cat:"devops",   x:0.65, y:0.92, r:12 },
  { id:"api",      label:"API Integration",cat:"design",   x:0.50, y:0.50, r:14 },
  { id:"uiux",     label:"UI/UX",          cat:"design",   x:0.35, y:0.42, r:13 },
  { id:"state",    label:"State Mgmt",     cat:"design",   x:0.65, y:0.42, r:12 },
] as const;

export const NET_EDGES: [string, string][] = [
  ["react","ts"],["react","nextjs"],["react","tailwind"],["react","framer"],
  ["nextjs","ts"],["nextjs","mongo"],["nextjs","api"],
  ["python","mongo"],["python","firebase"],
  ["cpp","python"],
  ["mongo","firebase"],["mongo","api"],
  ["git","postman"],["git","api"],
  ["api","uiux"],["api","state"],
  ["react","state"],["react","uiux"],
];
