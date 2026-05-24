// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
// Single source of truth. Import from here everywhere.
// Never define colors, durations, or easings inline in components.

export const THEMES = {
  dark: {
    bgCanvas:    "#04040A",
    bgBase:      "#07070F",
    bgSurface:   "#0C0C1A",
    bgElevated:  "#111122",
    bgGlass:     "rgba(10,10,22,0.78)",
    bgNavScroll: "rgba(7,7,15,0.90)",
    bgMobile:    "rgba(5,5,14,0.97)",
    cyan:        "#1BE4FF",
    red:         "#FF2D55",
    violet:      "#7C3AED",
    amber:       "#F5A623",
    green:       "#00E5A0",
    pink:        "#FF6EB4",
    textPrimary:   "#EEEEFF",
    textSecondary: "#A0A0C0",
    textMuted:     "#6A6A8A",
    textDim:       "#333355",
    border:        "rgba(255,255,255,0.06)",
    borderMid:     "rgba(255,255,255,0.11)",
    borderAccent:  "rgba(27,228,255,0.26)",
    shadow:        "0 8px 40px rgba(0,0,0,0.7)",
  },
  light: {
    bgCanvas:    "#F4F4FC",
    bgBase:      "#FFFFFF",
    bgSurface:   "#F0F0FA",
    bgElevated:  "#E8E8F4",
    bgGlass:     "rgba(255,255,255,0.82)",
    bgNavScroll: "rgba(250,250,255,0.92)",
    bgMobile:    "rgba(247,247,252,0.98)",
    cyan:        "#006EE6",
    red:         "#D0192B",
    violet:      "#5B21B6",
    amber:       "#B45309",
    green:       "#047857",
    pink:        "#BE185D",
    textPrimary:   "#0A0A1A",
    textSecondary: "#3A3A5A",
    textMuted:     "#5A5A7A",
    textDim:       "#9090B0",
    border:        "rgba(0,0,0,0.07)",
    borderMid:     "rgba(0,0,0,0.12)",
    borderAccent:  "rgba(0,110,230,0.28)",
    shadow:        "0 8px 32px rgba(0,0,20,0.10)",
  },
} as const;

export type Theme = keyof typeof THEMES;
export type ThemeColors = typeof THEMES.dark;

// Motion constants — every animation references these
export const EASE = {
  spring: "cubic-bezier(0.16, 1, 0.3, 1)",
  expo:   "cubic-bezier(0.19, 1, 0.22, 1)",
  smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
  inQuad: "cubic-bezier(0.4, 0, 1, 0.45)",
} as const;

export const DUR = {
  fast:   150,
  normal: 250,
  slow:   400,
  cin:    700,
  epic:   1100,
} as const;

// Navigation items
export const NAV_ITEMS = [
  { id: "hero",           label: "Home",           short: "00" },
  { id: "about",          label: "About",          short: "01" },
  { id: "skills",         label: "Skills",         short: "02" },
  { id: "projects",       label: "Projects",       short: "03" },
  { id: "experience",     label: "Experience",     short: "04" },
  { id: "certifications", label: "Certifications", short: "05" },
  { id: "contact",        label: "Contact",        short: "06" },
] as const;

export type NavItem = typeof NAV_ITEMS[number];
