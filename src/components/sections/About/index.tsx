"use client";

import { useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useInView, useReducedMotion, useMediaQuery, useTilt } from "@/hooks";
import { ha } from "@/lib/utils";
import { JOURNEY, QUICK_FACTS } from "@/data/experience";
import { Reveal, SectionLabel, TechTag, ActionBtn, SectionBg } from "@/components/ui";

// ─── PROFILE CARD ────────────────────────────────────────────────────────────
function ProfileCard({ vis }: { vis: boolean }) {
  const { C } = useTheme();
  const rm = useReducedMotion();
  const { tilt, handlers } = useTilt(5, rm);
  const [hov, setHov] = useState(false);

  return (
    <div
      {...handlers}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); handlers.onMouseLeave(); }}
      style={{ perspective: 900, width: "100%", maxWidth: 340, margin: "0 auto" }}
    >
      <div style={{
        position: "relative", borderRadius: 20, overflow: "hidden",
        background: C.bgGlass, backdropFilter: "blur(24px) saturate(200%)",
        border: `1px solid ${hov ? ha(C.cyan, 0.40) : C.border}`,
        boxShadow: hov
          ? `0 24px 64px rgba(0,0,0,0.8), -6px 0 32px ${ha(C.cyan,0.22)}, 0 0 0 1px ${ha(C.cyan,0.22)}`
          : "0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        transform: rm ? "none"
          : `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${vis ? 0 : 40}px)`,
        opacity: vis ? 1 : 0,
        transition: rm ? "none"
          : `box-shadow 300ms, border-color 300ms, opacity 700ms, transform ${hov ? "120ms ease-out" : "500ms cubic-bezier(0.16,1,0.3,1)"}`,
        willChange: "transform",
      }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${C.violet},${C.cyan},${C.violet})`, backgroundSize: "200%", animation: "gradShift 4s linear infinite" }} />
        <div style={{ padding: "28px 24px" }}>
          {/* Avatar row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", border: `2px solid ${ha(C.cyan,0.35)}`, overflow: "hidden", boxShadow: `0 0 24px ${ha(C.cyan,0.28)}`, position: "relative", zIndex: 1 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/profile_photo.jpg" alt="Kamani Vijay" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div aria-hidden="true" style={{ position: "absolute", inset: -8, borderRadius: "50%", border: `1px dashed ${ha(C.cyan,0.35)}`, animation: "spinSlow 12s linear infinite" }}>
                <div style={{ position: "absolute", top: "7%", left: "50%", transform: "translate(-50%,-50%)", width: 6, height: 6, borderRadius: "50%", background: C.cyan, boxShadow: `0 0 7px ${C.cyan}` }} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 9999, background: ha(C.green, 0.08), border: `1px solid ${ha(C.green, 0.20)}` }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, boxShadow: `0 0 6px ${C.green}`, animation: "pulseDot 2.4s ease-in-out infinite", flexShrink: 0 }} />
                <span style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: "0.10em", color: C.green }}>AVAILABLE</span>
              </div>
              <span style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: "0.12em", color: C.textDim }}>2028 · GRAD YEAR</span>
            </div>
          </div>

          <div style={{ fontSize: 20, fontFamily: "monospace", fontWeight: 700, letterSpacing: "-0.03em", color: C.textPrimary, marginBottom: 3 }}>Kamani Vijay</div>
          <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.08em", color: C.cyan, marginBottom: 18, textShadow: `0 0 10px ${ha(C.cyan,0.44)}` }}>FRONTEND DEVELOPER · NRCM</div>
          <div style={{ height: 1, background: C.border, marginBottom: 16 }} />

          {QUICK_FACTS.map(({ icon, label, value }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
              <span style={{ fontSize: 12, width: 18, textAlign: "center", flexShrink: 0 }}>{icon}</span>
              <span style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: "0.10em", color: C.textDim, width: 66, flexShrink: 0, textTransform: "uppercase" }}>{label}</span>
              <span style={{ fontSize: 10, fontFamily: "monospace", color: C.textSecondary }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PHILOSOPHY CARD ─────────────────────────────────────────────────────────
function PhiloCard({ icon, title, body, accent, delay, vis, rm }: {
  icon: string; title: string; body: string; accent: string;
  delay: number; vis: boolean; rm: boolean;
}) {
  const { C } = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: 20, borderRadius: 13,
        background: hov ? C.bgElevated : C.bgSurface,
        border: `1px solid ${hov ? ha(accent, 0.42) : C.border}`,
        borderLeft: `3px solid ${hov ? accent : ha(accent, 0.42)}`,
        boxShadow: hov ? `0 8px 30px rgba(0,0,0,0.45), -4px 0 18px ${ha(accent, 0.12)}` : "none",
        opacity: vis ? 1 : 0,
        transform: hov ? "translateX(4px) translateY(-2px)" : vis ? "none" : "translateX(-14px)",
        transition: rm ? "none"
          : `opacity 580ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform ${hov ? "180ms ease-out" : `580ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`}, border-color 200ms, box-shadow 200ms, background 200ms`,
        cursor: "default",
      }}
    >
      <div style={{ fontSize: 18, marginBottom: 9 }}>{icon}</div>
      <h4 style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, color: hov ? C.textPrimary : C.textSecondary, margin: "0 0 7px", transition: "color 200ms" }}>{title}</h4>
      <p style={{ fontSize: 11, fontFamily: "monospace", color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{body}</p>
    </div>
  );
}

// ─── ABOUT SECTION ────────────────────────────────────────────────────────────
export function AboutSection() {
  const { C } = useTheme();
  const [secRef,  secVis]  = useInView(0.06);
  const [profRef, profVis] = useInView(0.15);
  const [rightRef,rightVis]= useInView(0.05);
  const [timeRef, timeVis] = useInView(0.04);
  const [statsRef,statsVis]= useInView(0.25);
  const [philRef, philVis] = useInView(0.12);
  const rm = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 900px)");

  const philosophy = [
    { icon: "⚗️", title: "Precision over cleverness",  body: "Code a junior can read in 6 months beats code that impresses at review. Craft lives in clarity.",                                    accent: C.cyan   },
    { icon: "🔭", title: "Design is engineering",       body: "Typography, spacing, motion — not decorations. They're the interface between human cognition and system logic.",                      accent: C.violet },
    { icon: "🧭", title: "Ship, then iterate",          body: "Perfect is the enemy of shipped. Move fast, build in public, treat every deployment as a hypothesis.",                               accent: C.amber  },
    { icon: "🌱", title: "Compound curiosity",          body: "Learn one thing deeply every two weeks. Breadth is a side effect of sustained depth over time.",                                    accent: C.green  },
  ];

  return (
    <section
      ref={secRef as React.RefObject<HTMLElement>}
      id="about"
      aria-label="About"
      style={{ position: "relative", overflow: "hidden", padding: "clamp(5rem,10vh,8rem) 0", background: C.bgBase }}
    >
      <SectionBg accent={C.cyan} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", padding: "0 clamp(1.25rem,5vw,4rem)" }}>
        <SectionLabel index={1} label="About Me" vis={secVis} rm={rm} />

        <Reveal vis={secVis} rm={rm} delay={80} style={{ marginBottom: "clamp(3rem,6vh,5rem)" }}>
          <h2 style={{ fontSize: "clamp(2rem,5vw,4.2rem)", fontFamily: "monospace", fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 14px", lineHeight: 0.96, color: C.textPrimary }}>
            The person<br />
            <span style={{ color: C.cyan, textShadow: `0 0 30px ${ha(C.cyan,0.30)}` }}>behind the code.</span>
          </h2>
          <p style={{ fontSize: "clamp(0.87rem,1.1vw,1rem)", color: C.textMuted, lineHeight: 1.78, maxWidth: 540, letterSpacing: "-0.005em" }}>
            CSE student at NRCM building immersive, performance-driven digital experiences — at the intersection of frontend engineering, animation systems, and intelligent design.
          </p>
        </Reveal>

        {/* Stats row */}
        <div ref={statsRef as React.RefObject<HTMLDivElement>} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: "clamp(1.5rem,4vw,3rem)", padding: "clamp(1.25rem,3vh,2.5rem) 0", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, marginBottom: "clamp(3rem,7vh,5rem)" }}>
          {[
            { v: "4+",   l: "Projects Shipped",  c: C.cyan,   d: 0   },
            { v: "8.0",  l: "CGPA",              c: C.violet, d: 100 },
            { v: "2028", l: "Graduation Year",   c: C.amber,  d: 200 },
            { v: "∞",    l: "Curiosity",         c: C.green,  d: 300 },
          ].map(({ v, l, c, d }) => (
            <Reveal key={l} vis={statsVis} rm={rm} delay={d}>
              <div style={{ fontSize: "clamp(1.6rem,3vw,2.6rem)", fontFamily: "monospace", fontWeight: 700, letterSpacing: "-0.04em", color: c, lineHeight: 1, textShadow: `0 0 18px ${ha(c,0.44)}` }}>{v}</div>
              <div style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: "0.14em", color: C.textMuted, textTransform: "uppercase", marginTop: 5 }}>{l}</div>
            </Reveal>
          ))}
        </div>

        {/* Split layout */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "clamp(260px,30%,330px) 1fr", gap: "clamp(2.5rem,6vw,5.5rem)", alignItems: "start", marginBottom: "clamp(3rem,6vh,5rem)" }}>
          {/* Profile card */}
          <div ref={profRef as React.RefObject<HTMLDivElement>} style={{ position: isMobile ? "static" : "sticky", top: 90 }}>
            <ProfileCard vis={profVis} />
          </div>

          {/* Bio + Timeline */}
          <div ref={rightRef as React.RefObject<HTMLDivElement>}>
            {/* Bio paragraphs */}
            <div style={{ marginBottom: "clamp(2rem,4vh,3.5rem)" }}>
              {[
                { delay: 0, text: "'m Kamani Vijay, a Computer Science Engineering student at Narsimha Reddy College of Engineering & Management (NRCM). I focus on building immersive and performance-driven digital experiences using modern frontend technologies, interactive design systems, and intelligent application architecture.", isFirst: true },
                { delay: 80, text: "My interests span frontend engineering, AI-powered systems, animation-driven interfaces, and real-world problem solving through software. I care deeply about the gap between functional and truly great." },
                { delay: 160, text: "Beyond development, I actively participate in hackathons, collaborative projects, and creative writing initiatives like 'Echo of Life', where storytelling and technology intersect. Open to internships, collaborations, and impactful projects." },
              ].map(({ delay, text, isFirst }, i) => (
                <Reveal key={i} vis={rightVis} rm={rm} delay={delay} style={{ marginBottom: i < 2 ? 18 : 0 }}>
                  <p style={{ fontSize: "clamp(0.86rem,1.1vw,0.98rem)", color: C.textMuted, lineHeight: 1.82, letterSpacing: "-0.005em" }}>
                    {isFirst && (
                      <span style={{ float: "left", fontSize: "3.2em", lineHeight: 0.80, fontWeight: 800, marginRight: 5, marginTop: "0.05em", color: C.cyan, fontFamily: "monospace", letterSpacing: "-0.06em", textShadow: `0 0 18px ${ha(C.cyan,0.44)}` }}>I</span>
                    )}
                    {text}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Journey timeline */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <span style={{ fontSize: 10, fontFamily: "monospace", fontWeight: 600, letterSpacing: "0.14em", color: C.textMuted, textTransform: "uppercase", flexShrink: 0 }}>The Journey</span>
              <div style={{ height: 1, background: C.border, flex: 1 }} />
            </div>

            <div ref={timeRef as React.RefObject<HTMLDivElement>}>
              {JOURNEY.map((item, i) => {
                const accent = item.isNow ? C.cyan : item.accentKey ? C[item.accentKey] : C.cyan;
                return (
                  <div key={item.year + item.title} style={{ display: "flex", gap: 0, opacity: timeVis ? 1 : 0, transform: timeVis ? "translateX(0)" : "translateX(-18px)", transition: rm ? "none" : `all 580px cubic-bezier(0.16,1,0.3,1) ${i * 90}ms` }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 18, flexShrink: 0, width: 18 }}>
                      <div style={{ width: item.isNow ? 18 : 13, height: item.isNow ? 18 : 13, borderRadius: "50%", background: item.isNow ? accent : C.bgElevated, border: `2px solid ${accent}`, boxShadow: `0 0 12px ${ha(accent, item.isNow ? 0.6 : 0.25)}`, flexShrink: 0, zIndex: 1, marginTop: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {item.isNow && <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.bgCanvas, animation: "pulseDot 2s ease-in-out infinite" }} />}
                      </div>
                      {i < JOURNEY.length - 1 && <div style={{ flex: 1, width: 1, minHeight: 20, marginTop: 5, background: `linear-gradient(to bottom,${ha(accent,0.45)},${C.border})` }} />}
                    </div>
                    <div style={{ flex: 1, paddingBottom: i < JOURNEY.length - 1 ? 26 : 0 }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 7px", borderRadius: 4, marginBottom: 7, background: ha(accent, 0.12), border: `1px solid ${ha(accent, 0.30)}` }}>
                        <span style={{ fontSize: 10 }}>{item.icon}</span>
                        <span style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: "0.12em", color: accent, fontWeight: 600 }}>{item.year}</span>
                      </div>
                      <h4 style={{ margin: "0 0 1px", fontSize: 14, fontFamily: "monospace", fontWeight: 700, letterSpacing: "-0.02em", color: C.textSecondary, lineHeight: 1.2 }}>{item.title}</h4>
                      <p style={{ margin: "0 0 7px", fontSize: 9, fontFamily: "monospace", letterSpacing: "0.08em", color: C.textMuted, textTransform: "uppercase" }}>{item.subtitle}</p>
                      <p style={{ margin: "0 0 8px", fontSize: 11, fontFamily: "monospace", color: C.textMuted, lineHeight: 1.72 }}>{item.desc}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {item.tags.map((t) => <TechTag key={t} label={t} accent={accent} compact />)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Philosophy grid */}
        <div ref={philRef as React.RefObject<HTMLDivElement>}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
            <span style={{ fontSize: 10, fontFamily: "monospace", fontWeight: 600, letterSpacing: "0.14em", color: C.textMuted, textTransform: "uppercase", flexShrink: 0 }}>How I Think</span>
            <div style={{ height: 1, background: C.border, flex: 1 }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginBottom: "clamp(3rem,6vh,5rem)" }}>
            {philosophy.map((p, i) => <PhiloCard key={p.title} {...p} delay={i * 75} vis={philVis} rm={rm} />)}
          </div>
        </div>

        {/* CTA bar */}
        <Reveal vis={philVis} rm={rm} delay={400}>
          <div style={{ padding: "clamp(1.5rem,3vh,2.5rem) clamp(1.5rem,3vw,2.5rem)", borderRadius: 16, background: C.bgSurface, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20, position: "relative", overflow: "hidden" }}>
            <div aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, borderRadius: "16px 0 0 16px", background: `linear-gradient(to bottom,${C.violet},${C.cyan})` }} />
            <div aria-hidden="true" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "35%", background: `radial-gradient(ellipse 80% 100% at 100% 50%,${ha(C.cyan,0.05)},transparent)`, pointerEvents: "none" }} />
            <div style={{ paddingLeft: 14, position: "relative" }}>
              <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.14em", color: C.cyan, marginBottom: 6, textTransform: "uppercase" }}>Interested in working together?</div>
              <p style={{ fontSize: 15, fontFamily: "monospace", fontWeight: 700, color: C.textPrimary, margin: 0, letterSpacing: "-0.02em" }}>Let&apos;s build something worth talking about.</p>
            </div>
            <div style={{ display: "flex", gap: 10, position: "relative" }}>
              <ActionBtn primary accent={C.cyan} href="#projects" label="View Projects" />
              <ActionBtn href="#contact" label="Get in Touch" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
