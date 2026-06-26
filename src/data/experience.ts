export interface Experience {
  id:         string;
  type:       "internship" | "education";
  company:    string;
  role:       string;
  period:     string;
  duration:   string;
  location:   string;
  accentKey:  "cyan" | "violet" | "amber" | "green";
  highlights: string[];
  tech:       string[];
  impact:     string;
}

export interface QuickFact {
  icon:  string;
  label: string;
  value: string;
}

export const QUICK_FACTS: QuickFact[] = [
  { icon: "📍", label: "Location",    value: "Hyderabad, India" },
  { icon: "🎓", label: "Degree",      value: "B.Tech CSE · Narsimha Reddy College of Engineering & Management (NRCM)" },
  { icon: "📬", label: "Email",       value: "kommala50@gmail.com" },
  { icon: "💼", label: "Status",      value: "Open to Work" },
  { icon: "🌐", label: "Languages",   value: "English · Telugu · Hindi" },
];

export const EXPERIENCES: Experience[] = [
  {
    id: "exp1", type: "internship",
    company: "Thrinex",
    role: "C++ Intern",
    period: "2024", duration: "Internship",
    location: "India",
    accentKey: "cyan",
    highlights: [
      "Worked on foundational C++ application development and problem-solving tasks",
      "Built multiple internal projects focused on logic implementation and modular programming",
      "Applied object-oriented concepts within structured development workflows",
      "Collaborated with team members on code reviews and iterative development",
    ],
    tech: ["C++","OOP","Problem Solving","Modular Programming"],
    impact: "C++ fundamentals · OOP projects · Team collaboration",
  },
  {
    id: "edu1", type: "education",
    company: "Narsimha Reddy College of Engineering & Management (NRCM)",
    role: "B.Tech in Computer Science and Engineering",
    period: "2024 – 2028", duration: "4 years",
    location: "Hyderabad, India",
    accentKey: "amber",
    highlights: [
      "CGPA: 8.0 / 10 in Computer Science Engineering",
      "Active participation in hackathons and collaborative technical events",
      "Consistent coding practice on LeetCode and GeeksforGeeks",
      "Creator of 'Echo of Life', a creative writing initiative blending storytelling and imagination",
    ],
    tech: ["C++","Python","React","Next.js","Tailwind CSS","MongoDB"],
    impact: "8.0 CGPA · Hackathon participant · Active on LeetCode & GFG",
  },
];

