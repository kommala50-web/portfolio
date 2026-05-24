export interface Certification {
  id:         string;
  title:      string;
  issuer:     string;
  issued:     string;
  accentKey:  "cyan" | "violet" | "amber" | "green" | "red";
  icon:       string;
  credential: string;
  skills:     string[];
  badge:      string;
}

export const CERTIFICATIONS: Certification[] = [
  {
    id: "c1", title: "Hackathon Participation",
    issuer: "Multiple Events", issued: "2024–2025", accentKey: "cyan", icon: "◈",
    credential: "",
    skills: ["Problem Solving","Team Coordination","Rapid Prototyping"],
    badge: "Participation",
  },
  {
    id: "c2", title: "Active Competitive Coder",
    issuer: "LeetCode & GeeksforGeeks", issued: "Ongoing", accentKey: "amber", icon: "⬡",
    credential: "",
    skills: ["DSA","C++","Problem Solving","Algorithms"],
    badge: "Practice",
  },
  {
    id: "c3", title: "8.0 CGPA in CSE",
    issuer: "Narsimha Reddy College of Engineering & Management (NRCM)", issued: "2024–Present", accentKey: "green", icon: "◎",
    credential: "",
    skills: ["Computer Science","Engineering","Academics"],
    badge: "Academic",
  },
  {
    id: "c4", title: "Echo of Life — Creative Writing",
    issuer: "Self-Initiated", issued: "2024–Present", accentKey: "violet", icon: "◇",
    credential: "",
    skills: ["Storytelling","Creative Writing","Imagination"],
    badge: "Initiative",
  },
];
