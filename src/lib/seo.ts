// ─── SEO METADATA FACTORY ────────────────────────────────────────────────────
// Used with Next.js 14 App Router generateMetadata()

const BASE_URL  = process.env.NEXT_PUBLIC_SITE_URL || "https://kamanivijay.dev";
const SITE_NAME = "Kamani Vijay — Frontend Developer";
const DEFAULT_OG = `${BASE_URL}/og-image.png`;

interface SeoConfig {
  title?:       string;
  description?: string;
  image?:       string;
  url?:         string;
}

export function generateSeoMetadata(config: SeoConfig = {}) {
  const {
    title       = "Kamani Vijay | Frontend Developer & CSE @ NRCM",
    description = "Frontend developer focused on immersive UI, performance-focused web applications, animation systems, and intelligent digital experiences.",
    image       = DEFAULT_OG,
    url         = BASE_URL,
  } = config;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates:   { canonical: url },
    robots:       { index: true, follow: true },
    openGraph: {
      title, description, url, type: "website" as const,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title, description,
      images: [image],
      creator: "",
    },
  };
}

// JSON-LD schema for the portfolio
export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kamani Vijay",
  url: BASE_URL,
  jobTitle: "Frontend Developer",
  alumniOf: { "@type": "CollegeOrUniversity", name: "Narsimha Reddy Engineering College" },
  knowsAbout: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  sameAs: [
    "https://github.com/kommala50-web",
    "https://www.linkedin.com/in/kamani-vijay-60a989387",
    "https://twitter.com/",
  ],
};
