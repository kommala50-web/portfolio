import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        canvas:  "var(--bg-canvas)",
        surface: "var(--bg-surface)",
        cyan:    "var(--accent-cyan)",
        red:     "var(--accent-red)",
        violet:  "var(--accent-violet)",
        amber:   "var(--accent-amber)",
        green:   "var(--accent-green)",
      },
      fontFamily: {
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      screens: {
        xs: "375px",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
        expo:   "cubic-bezier(0.19, 1, 0.22, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
