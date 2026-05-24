export interface Social {
  id:        string;
  label:     string;
  handle:    string;
  desc:      string;
  accentKey: "cyan" | "violet" | "pink" | "green";
  href:      string;
}

export const SOCIALS: Social[] = [
  {
    id: "github", label: "GitHub", handle: "@kommala50-web",
    desc: "Code, projects, contributions",
    accentKey: "cyan", href: "https://github.com/kommala50-web",
  },
  {
    id: "linkedin", label: "LinkedIn", handle: "kamani-vijay",
    desc: "Professional network, experience",
    accentKey: "violet", href: "https://www.linkedin.com/in/kamani-vijay-60a989387",
  },
  {
    id: "email", label: "Email", handle: "kommala50@gmail.com",
    desc: "Best for opportunities",
    accentKey: "green", href: "mailto:kommala50@gmail.com",
  },
];

export const QUICK_FACTS = [
  { icon: "📍", label: "Location",  value: "Hyderabad, India"              },
  { icon: "🎓", label: "Degree",    value: "B.Tech CSE · NRCM"            },
  { icon: "💼", label: "Status",    value: "Open to Opportunities"         },
  { icon: "🌐", label: "Languages", value: "Telugu · Hindi · English"      },
  { icon: "⚡", label: "Focus",     value: "Frontend + Animation Systems"  },
  { icon: "🎯", label: "Goal",      value: "Impactful Digital Experiences" },
];
