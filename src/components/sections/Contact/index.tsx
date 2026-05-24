"use client";

import { useState, useCallback } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useInView, useReducedMotion, useMediaQuery } from "@/hooks";
import { ha } from "@/lib/utils";
import { DUR, EASE } from "@/lib/tokens";
import { SOCIALS } from "@/data/social";
import { Reveal, SectionLabel, ActionBtn, SectionBg, FloatingInput } from "@/components/ui";

// ─── SOCIAL CARD ──────────────────────────────────────────────────────────────
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  twitter: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
    </svg>
  ),
  email: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
};

function SocialCard({
  social, delay, vis, rm,
}: {
  social: typeof SOCIALS[number]; delay: number; vis: boolean; rm: boolean;
}) {
  const { C } = useTheme();
  const [hov, setHov] = useState(false);
  const accent = C[social.accentKey as keyof typeof C] as string;

  return (
    <a
      href={social.href}
      aria-label={`${social.label}: ${social.handle}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:        "flex",
        alignItems:     "center",
        gap:            13,
        padding:        "12px 14px",
        borderRadius:   12,
        border:         `1px solid ${hov ? ha(accent,0.42) : C.border}`,
        borderLeft:     `3px solid ${hov ? accent : ha(accent,0.28)}`,
        background:     hov ? ha(accent, 0.07) : "rgba(255,255,255,0.02)",
        textDecoration: "none",
        boxShadow:      hov ? `0 6px 24px rgba(0,0,0,0.4), -3px 0 14px ${ha(accent,0.12)}` : "none",
        transform:      hov ? "translateX(4px) translateY(-1px)" : vis ? "none" : "translateX(-18px)",
        opacity:        vis ? 1 : 0,
        transition:     rm ? "none"
          : `opacity 580ms ${EASE.spring} ${delay}ms, transform ${hov ? `200ms ease-out` : `580ms ${EASE.spring} ${delay}ms`}, border-color 200ms, background 200ms, box-shadow 200ms`,
        cursor: "pointer",
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 9,
        background: ha(accent, 0.12), border: `1px solid ${ha(accent, 0.28)}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: hov ? accent : C.textMuted,
        boxShadow: hov ? `0 0 14px ${ha(accent, 0.28)}` : "none",
        transition: `all ${DUR.normal}ms`,
        flexShrink: 0,
      }}>
        {SOCIAL_ICONS[social.id]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
          <span style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, color: hov ? C.textPrimary : C.textSecondary, letterSpacing: "-0.01em", transition: "color 200ms" }}>{social.label}</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: hov ? 1 : 0.2, transition: "opacity 200ms", flexShrink: 0 }}>
            <path d="M1 9L9 1M9 1H3M9 1V7" stroke={accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p style={{ fontSize: 9, fontFamily: "monospace", color: hov ? accent : C.textDim, margin: "2px 0 0", letterSpacing: "0.03em", transition: "color 200ms" }}>{social.handle}</p>
        <p style={{ fontSize: 9, fontFamily: "monospace", color: C.textDim, margin: "2px 0 0" }}>{social.desc}</p>
      </div>
    </a>
  );
}

// ─── CONTACT FORM ────────────────────────────────────────────────────────────
type FormState = { name: string; email: string; subject: string; message: string };
type FormErrors = Partial<Record<keyof FormState, string>>;
type FormStatus = "idle" | "sending" | "sent";

function ContactForm({ vis, rm }: { vis: boolean; rm: boolean }) {
  const { C } = useTheme();

  const [fields,  setFields]  = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [errors,  setErrors]  = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [status,  setStatus]  = useState<FormStatus>("idle");

  const validate = useCallback((name: keyof FormState, val: string): string | undefined => {
    if (!val.trim())                                   return `${name === "name" ? "Name" : name === "email" ? "Email" : name === "subject" ? "Subject" : "Message"} is required`;
    if (name === "email" && !/\S+@\S+\.\S+/.test(val)) return "Please enter a valid email";
    if (name === "message" && val.trim().length < 20)  return "Please write at least 20 characters";
  }, []);

  const onChange = useCallback((name: string, val: string) => {
    setFields((f) => ({ ...f, [name]: val }));
    if (touched[name as keyof FormState]) {
      const err = validate(name as keyof FormState, val);
      setErrors((e) => ({ ...e, [name]: err }));
    }
  }, [touched, validate]);

  const onBlur = useCallback((name: string) => {
    setTouched((t) => ({ ...t, [name]: true }));
    const err = validate(name as keyof FormState, fields[name as keyof FormState]);
    setErrors((e) => ({ ...e, [name]: err }));
  }, [fields, validate]);

  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = { name: true, email: true, subject: true, message: true };
    setTouched(allTouched);
    const newErrors: FormErrors = {};
    (Object.keys(fields) as (keyof FormState)[]).forEach((k) => {
      const err = validate(k, fields[k]);
      if (err) newErrors[k] = err;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setStatus("sending");
    // Simulate API call — replace with your Resend/EmailJS call
    setTimeout(() => setStatus("sent"), 1800);
  }, [fields, validate]);

  const reset = useCallback(() => {
    setStatus("idle");
    setFields({ name: "", email: "", subject: "", message: "" });
    setTouched({});
    setErrors({});
  }, []);

  // ── Success state ─────────────────────────────────────────────────────────
  if (status === "sent") {
    return (
      <div style={{
        borderRadius: 18, background: C.bgGlass, backdropFilter: "blur(22px) saturate(200%)",
        border: `1px solid ${ha(C.green, 0.35)}`,
        boxShadow: `0 0 60px ${ha(C.green, 0.08)}`,
        padding: "3rem 2rem",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 18, textAlign: "center",
        animation: rm ? "none" : "cardIn 500ms cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: ha(C.green, 0.14), border: `2px solid ${ha(C.green,0.45)}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: `0 0 26px ${ha(C.green,0.35)}` }}>✓</div>
        <div>
          <h3 style={{ fontSize: 18, fontFamily: "monospace", fontWeight: 800, color: C.textPrimary, letterSpacing: "-0.02em", margin: "0 0 8px" }}>Message sent!</h3>
          <p style={{ fontSize: 12, fontFamily: "monospace", color: C.textMuted, lineHeight: 1.7, margin: "0 0 18px" }}>Thanks for reaching out. I&apos;ll reply within 24 hours.</p>
          <button onClick={reset} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${ha(C.cyan,0.32)}`, background: "transparent", color: C.cyan, fontSize: 10, fontFamily: "monospace", letterSpacing: "0.08em", cursor: "pointer", outline: "none" }}>
            Send another →
          </button>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Contact form"
      style={{
        borderRadius: 18,
        background:   C.bgGlass,
        backdropFilter: "blur(24px) saturate(200%)",
        border: `1px solid ${C.borderMid}`,
        boxShadow: "0 12px 56px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
        padding: "clamp(1.5rem,3vw,2.5rem)",
        position: "relative", overflow: "hidden",
        opacity:   vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(22px)",
        transition: rm ? "none" : `opacity 700ms ${EASE.spring} 150ms, transform 700ms ${EASE.spring} 150ms`,
      }}
    >
      {/* Top accent bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${ha(C.violet,0.8)},${C.cyan},${ha(C.violet,0.8)})`, backgroundSize: "200%", animation: "gradShift 4s linear infinite" }} />
      {/* Ambient glow */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 70% 50% at 15% 20%,${ha(C.cyan,0.05)} 0%,transparent 60%)` }} />

      <div style={{ position: "relative" }}>
        <h3 style={{ fontSize: "clamp(1.1rem,2vw,1.4rem)", fontFamily: "monospace", fontWeight: 800, letterSpacing: "-0.03em", color: C.textPrimary, margin: "0 0 5px" }}>
          Send a message
        </h3>
        <p style={{ fontSize: 11, fontFamily: "monospace", color: C.textMuted, lineHeight: 1.6, margin: "0 0 26px" }}>
          I read every message. No auto-replies. Real conversation.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <FloatingInput label="Full Name"      name="name"    value={fields.name}    onChange={onChange} onBlur={onBlur} error={errors.name}    required />
            <FloatingInput label="Email Address"  name="email"   type="email" value={fields.email}   onChange={onChange} onBlur={onBlur} error={errors.email}   required />
          </div>
          <FloatingInput label="Subject"          name="subject" value={fields.subject} onChange={onChange} onBlur={onBlur} error={errors.subject} required />
          <FloatingInput label="Your Message"     name="message" value={fields.message} onChange={onChange} onBlur={onBlur} error={errors.message} required multiline />

          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
              padding: "13px 28px", borderRadius: 10,
              background: status === "sending" ? ha(C.cyan, 0.09) : ha(C.cyan, 0.12),
              border: `1px solid ${ha(C.cyan, status === "sending" ? 0.20 : 0.32)}`,
              color: C.cyan, fontSize: 12, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.08em",
              cursor: status === "sending" ? "default" : "pointer",
              outline: "none", position: "relative", overflow: "hidden",
              transition: `all ${DUR.normal}ms`,
            }}
            onMouseEnter={(e) => { if (status !== "sending") { e.currentTarget.style.background = ha(C.cyan, 0.20); e.currentTarget.style.boxShadow = `0 0 22px ${ha(C.cyan,0.25)}`; e.currentTarget.style.transform = "translateY(-2px)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ha(C.cyan, 0.12); e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
          >
            {status === "sending" ? (
              <>
                <span style={{ width: 11, height: 11, borderRadius: "50%", border: `2px solid ${ha(C.cyan,0.3)}`, borderTopColor: C.cyan, animation: "spin 700ms linear infinite", display: "inline-block" }} />
                SENDING...
              </>
            ) : "SEND MESSAGE →"}
          </button>
        </div>
      </div>
    </form>
  );
}

// ─── CONTACT SECTION ──────────────────────────────────────────────────────────
export function ContactSection() {
  const { C }  = useTheme();
  const [ref, vis] = useInView(0.04);
  const rm       = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 900px)");

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="contact"
      aria-label="Contact"
      style={{ position: "relative", overflow: "hidden", padding: "clamp(5rem,10vh,8rem) 0", background: C.bgBase, borderTop: `1px solid ${C.border}` }}
    >
      <SectionBg accent={C.green} />
      {/* Scan line */}
      {!rm && <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${ha(C.cyan,0.15)} 50%,transparent)`, animation: "scanLine 10s linear infinite", zIndex: 6, pointerEvents: "none" }} />}

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", padding: "0 clamp(1.25rem,5vw,4rem)" }}>
        <SectionLabel index={6} label="Contact" vis={vis} rm={rm} />

        <Reveal vis={vis} rm={rm} delay={80} style={{ marginBottom: "clamp(3rem,6vh,5rem)" }}>
          <h2 style={{ fontSize: "clamp(2rem,5vw,4.2rem)", fontFamily: "monospace", fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 14px", lineHeight: 0.96, color: C.textPrimary }}>
            Let&apos;s build<br />
            <span style={{ color: C.cyan, textShadow: `0 0 30px ${ha(C.cyan,0.30)}` }}>something impactful together.</span>
          </h2>
          <p style={{ fontSize: "clamp(0.86rem,1.1vw,1rem)", color: C.textMuted, lineHeight: 1.75, maxWidth: 500 }}>
            Open to collaborations, internships, frontend development opportunities, and innovative technical projects.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 16, padding: "7px 14px", borderRadius: 9999, background: ha(C.green, 0.08), border: `1px solid ${ha(C.green,0.22)}` }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, boxShadow: `0 0 7px ${C.green}`, animation: "pulseDot 2.5s ease-in-out infinite", flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "0.08em", color: C.green }}>Available for opportunities</span>
          </div>
        </Reveal>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "clamp(270px,34%,380px) 1fr", gap: "clamp(2rem,5vw,5rem)", alignItems: "start" }}>

          {/* Left: info + socials */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Quick info card */}
            <Reveal vis={vis} rm={rm}>
              <div style={{ padding: "clamp(1.2rem,2.5vw,1.6rem)", borderRadius: 13, background: C.bgSurface, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.14em", color: C.textDim, textTransform: "uppercase", marginBottom: 14 }}>Quick Info</div>
                {[
                  ["📍", "Based in",   "Hyderabad, India"],
                  ["⏰", "Response",   "Within 24 hours"],
                  ["🌐", "Open to",    "Remote / On-site"],
                  ["📅", "Available",  "Now"],
                ].map(([ic, l, v]) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 13, width: 18, textAlign: "center", flexShrink: 0 }}>{ic}</span>
                    <span style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: "0.10em", color: C.textDim, textTransform: "uppercase", width: 58, flexShrink: 0 }}>{l}</span>
                    <span style={{ fontSize: 10, fontFamily: "monospace", color: C.textSecondary }}>{v}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.14em", color: C.textDim, textTransform: "uppercase", marginTop: 4, opacity: vis ? 1 : 0, transition: rm ? "none" : `opacity 600ms ${EASE.spring} 150ms` }}>
              Elsewhere on the internet
            </div>

            {SOCIALS.map((social, i) => (
              <SocialCard key={social.id} social={social} delay={i * 75 + 200} vis={vis} rm={rm} />
            ))}
          </div>

          {/* Right: form */}
          <ContactForm vis={vis} rm={rm} />
        </div>

        {/* Footer strip */}
        <div style={{
          marginTop: "clamp(4rem,8vh,6rem)",
          paddingTop: "clamp(1.5rem,3vh,2.5rem)",
          borderTop: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
          opacity:   vis ? 1 : 0,
          transition: rm ? "none" : `opacity 600ms ${EASE.spring} 600ms`,
        }}>
          <div>
            <div style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, color: C.textPrimary, letterSpacing: "-0.02em", marginBottom: 4 }}>Kamani Vijay</div>
            <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.12em", color: C.textDim }}>
              BUILT WITH NEXT.JS · FRAMER MOTION · TAILWIND CSS · ♥
            </div>
          </div>
          <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.10em", color: C.textDim }}>
            © 2025 · All rights reserved
          </div>
        </div>
      </div>
    </section>
  );
}
