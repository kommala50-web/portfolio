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

export interface JourneyItem {
  year:     string;
  icon:     string;
  title:    string;
  subtitle: string;
  desc:     string;
  accentKey?: "cyan" | "violet" | "amber" | "green" | "red";
  tags:     string[];
  isNow?:   boolean;
}

export const JOURNEY: JourneyItem[] = [
  { year:"2023", icon:"⚡", title:"The Spark",    subtitle:"First line of code",              desc:"Started learning web development with HTML, CSS, and JavaScript. Built my first static pages and discovered the joy of seeing code come alive in the browser.",                         tags:["HTML","CSS","JavaScript"] },
  { year:"2024", icon:"🎓", title:"College Begins", subtitle:"B.Tech CSE · NRCM",             desc: "Enrolled at Narsimha Reddy College of Engineering & Management (NRCM). Began learning C++, data structures, and algorithms while building frontend projects on the side.",                                     accentKey:"violet", tags:["C++","DSA","Algorithms"] },
  { year:"2024", icon:"🚀", title:"First Projects", subtitle:"React + Next.js in action",     desc:"Built TechPath and Smart Expense Tracker — real projects with React, Next.js, Tailwind CSS, and MongoDB. Started understanding full project lifecycles.",                                accentKey:"amber",  tags:["React","Next.js","MongoDB"] },
  { year:"2025", icon:"🌐", title:"Growing Deeper", subtitle:"Hackathons & collaboration",     desc:"Participated in hackathons, built AgriTrust, and developed a Smart Attendance System with Python and OpenCV. Expanded into AI-assisted applications.",                                  accentKey:"green",  tags:["Python","OpenCV","Hackathons"] },
  { year:"2025", icon:"🎨", title:"Cinematic UI",   subtitle:"Animation-driven interfaces",    desc:"Became passionate about the gap between functional and beautiful. Started building immersive UIs with Framer Motion and advanced CSS animations.",                                       accentKey:"red",    tags:["Framer Motion","Tailwind CSS","UI/UX"] },
  { year:"Now",  icon:"◉", title:"Present",        subtitle:"Seeking the right opportunity",   desc:"Building this portfolio. Looking for internships and teams where frontend craft meets great product thinking.", isNow:true,       tags:["Open to Work","Hyderabad / Remote"] },
];
