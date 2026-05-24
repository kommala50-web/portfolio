# Vijay Kumar — Portfolio

> Spider-Verse × Cinematic Futurism · Production-Grade Next.js Portfolio

**Live demo:** https://vijaykumar.dev

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | RSC, ISR, image opt, SEO |
| Language | TypeScript 5 | Type safety, self-documenting |
| Styling | Tailwind CSS + CSS Variables | JIT, design tokens |
| 3D / Canvas | React Three Fiber + Canvas 2D | Particle web, neural network |
| Animations | Framer Motion + GSAP | Gestures + scroll timelines |
| Smooth Scroll | Lenis | 60fps inertia scroll |
| State | Zustand | Zero-boilerplate global state |
| UI Primitives | shadcn/ui + Radix | Accessible, headless |
| Analytics | @vercel/analytics | Lightweight, privacy-friendly |
| Email | Resend | Contact form delivery |

---

## Project Structure

```
portfolio/
├── public/
│   ├── fonts/          # Self-hosted variable fonts
│   ├── textures/       # noise.png grain overlay
│   ├── models/         # GLB 3D models (optional)
│   └── icons/          # favicon.svg
│
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout, fonts, SEO, providers
│   │   ├── page.tsx          # Homepage — assembles all sections
│   │   └── not-found.tsx     # Custom 404
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx        # Scroll-aware glass navbar + mobile drawer
│   │   │   └── SectionDots.tsx   # Side nav dots + LoadingScreen
│   │   │
│   │   ├── sections/
│   │   │   ├── Hero/             # Particle canvas, role cycler, magnetic CTAs
│   │   │   ├── About/            # Profile card, bio, journey timeline
│   │   │   ├── Skills/           # Neural network canvas, skill panels
│   │   │   ├── Projects/         # Featured spotlight, 3D tilt grid, filter
│   │   │   ├── Experience/       # Animated timeline cards
│   │   │   ├── Certifications/   # Drag carousel
│   │   │   ├── Contact/          # Glassmorphism form, social cards
│   │   │   └── index.ts          # Barrel export
│   │   │
│   │   └── ui/
│   │       ├── index.tsx         # Reveal, SectionLabel, TechTag, ActionBtn, etc.
│   │       ├── NoiseOverlay.tsx  # Film grain texture
│   │       └── ScrollProgress.tsx # Top progress bar
│   │
│   ├── hooks/
│   │   └── index.ts   # useInView, useReducedMotion, useMagnetic, useScrollSpy, useTilt
│   │
│   ├── lib/
│   │   ├── tokens.ts  # THEMES, EASE, DUR, NAV_ITEMS
│   │   ├── utils.ts   # ha(), clamp(), lerp(), debounce()
│   │   └── seo.ts     # generateSeoMetadata(), personSchema
│   │
│   ├── providers/
│   │   └── ThemeProvider.tsx  # Dark/light context, useTheme()
│   │
│   ├── store/
│   │   └── index.ts   # Zustand store (theme, modal, cursor, loading)
│   │
│   ├── data/
│   │   ├── projects.ts        # All project definitions
│   │   ├── experience.ts      # Internships, education, journey
│   │   ├── skills.ts          # Skill categories, network nodes/edges
│   │   ├── certifications.ts  # Certificate data
│   │   └── social.ts          # Social links, quick facts
│   │
│   ├── styles/
│   │   └── globals.css  # CSS vars, keyframes, reset, reduced-motion
│   │
│   └── types/           # TypeScript type declarations
│
├── .env.example         # Template for environment variables
├── .gitignore
├── next.config.ts       # Image opt, headers, webpack
├── tailwind.config.ts   # Extended theme tokens
├── tsconfig.json        # Strict TypeScript config
├── vercel.json          # Vercel deployment config
└── README.md
```

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/your-username/portfolio.git
cd portfolio
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GITHUB_USERNAME=your-github-username

# Contact form (get free key at resend.com)
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL_TO=you@email.com
```

### 3. Run Development Server

```bash
npm run dev
```

Open **http://localhost:3000**

### 4. Build for Production

```bash
npm run build
npm run start
```

### 5. Analyze Bundle

```bash
npm run analyze
```

---

## Customization

### Update Personal Info

All personal data lives in `src/data/`. Edit these files — the UI updates automatically:

| File | Controls |
|---|---|
| `src/data/projects.ts` | Your projects, tech stack, metrics, links |
| `src/data/experience.ts` | Internships, education, journey timeline |
| `src/data/skills.ts` | Skill categories, network nodes |
| `src/data/certifications.ts` | Certifications carousel |
| `src/data/social.ts` | Social links, quick facts |

### Update Colors / Theme

Edit `src/lib/tokens.ts`:

```ts
export const THEMES = {
  dark: {
    cyan: "#1BE4FF",   // Primary accent — change to your brand color
    // ...
  }
}
```

### Update SEO

Edit `src/lib/seo.ts` — update name, description, domain, and social handles.

### Replace the OG Image

Replace `public/og-image.png` with your own 1200×630px image.

---

## Deployment on Vercel

### Option A — CLI (fastest)

```bash
npm install -g vercel
vercel
vercel --prod
```

### Option B — GitHub Integration

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Set environment variables in the dashboard
5. Click **Deploy**

Every push to `main` auto-deploys. Pull requests get preview URLs.

### Environment Variables on Vercel

```bash
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env add RESEND_API_KEY production
vercel env add CONTACT_EMAIL_TO production
vercel env add NEXT_PUBLIC_GITHUB_USERNAME production
```

---

## Contact Form Setup (Resend)

1. Sign up at [resend.com](https://resend.com) (free: 100 emails/day)
2. Get your API key
3. Add to `.env.local`:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL_TO=you@yourdomain.com
```

4. Create `src/app/api/contact/route.ts`:

```ts
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, subject, message } = await req.json();

  await resend.emails.send({
    from:    "Portfolio <onboarding@resend.dev>",
    to:      process.env.CONTACT_EMAIL_TO!,
    subject: `[Portfolio] ${subject}`,
    text:    `From: ${name} <${email}>\n\n${message}`,
  });

  return NextResponse.json({ ok: true });
}
```

5. Update `ContactForm` in `src/components/sections/Contact/index.tsx` to call this API instead of the `setTimeout` mock.

---

## Performance Targets

| Metric | Target | Strategy |
|---|---|---|
| LCP | < 1.5s | Preload fonts, static hero text |
| CLS | < 0.05 | Reserve canvas space |
| FID/INP | < 100ms | No blocking JS |
| Lighthouse Performance | ≥ 90 | Dynamic import canvas, AVIF images |
| Lighthouse Accessibility | ≥ 95 | ARIA, reduced-motion, contrast |
| Lighthouse SEO | 100 | Metadata, sitemap, schema |

---

## Accessibility

- Skip-to-content link (first focusable element)
- All animations respect `prefers-reduced-motion`
- ARIA labels on all interactive elements
- `aria-live` on role cycler and form errors
- Focus indicators visible on all elements
- Color contrast ≥ 4.5:1 on all text
- Keyboard navigation throughout

---

## License

MIT — use freely, attribution appreciated.

---

*Built with obsessive attention to craft.*
*Every token has a rule. Every animation has a reason.*
