"use client";

import { useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useInView, useReducedMotion, useMediaQuery } from "@/hooks";
import { ha } from "@/lib/utils";
import { DUR, EASE } from "@/lib/tokens";
import { EXPERIENCES } from "@/data/experience";
import { Reveal, SectionLabel, TechTag, SectionBg } from "@/components/ui";

// ─── EXPERIENCE ITEM ──────────────────────────────────────────────────────────
function ExperienceItem({
  item, index, vis, rm, isLast,
}: {
  item: typeof EXPERIENCES[number];
  index: number;
  vis: boolean;
  rm: boolean;
  isLast: boolean;
}) {
  const { C } = useTheme();
  const [hov, setHov] = useState(false);
  const accent = C[item.accentKey as keyof typeof C] as string;
  const delay  = index * 110;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:   "flex",
        gap:       0,
        opacity:   vis ? 1 : 0,
        transform: vis ? "translateX(0)" : "translateX(-22px)",
        transition: rm ? "none" : `opacity 620ms ${EASE.spring} ${delay}ms, transform 620ms ${EASE.spring} ${delay}ms`,
      }}
    >
      {/* Spine */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 22, flexShrink: 0, width: 22 }}>
        <div style={{
          width: 22, height: 22, borderRadius: "50%",
          background: hov ? accent : C.bgElevated,
          border: `2px solid ${accent}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: hov ? `0 0 16px ${ha(accent, 0.55)}, 0 0 30px ${ha(accent,0.20)}` : `0 0 8px ${ha(accent,0.20)}`,
          transition: `all ${DUR.normal}ms ${EASE.spring}`,
          flexShrink: 0, zIndex: 1, marginTop: 2,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: hov ? C.bgCanvas : accent, transition: `background ${DUR.normal}ms` }} />
        </div>
        {!isLast && (
          <div style={{ flex: 1, width: 1, minHeight: 24, marginTop: 5, background: `linear-gradient(to bottom,${ha(accent,0.45)},${C.border})` }} />
        )}
      </div>

      {/* Card */}
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : 32, minWidth: 0 }}>
        <div style={{
          borderRadius: 14,
          border: `1px solid ${hov ? ha(accent,0.38) : C.border}`,
          borderLeft: `3px solid ${hov ? accent : ha(accent,0.32)}`,
          background: hov
            ? `linear-gradient(145deg,${ha(accent,0.07)} 0%,${C.bgSurface} 55%)`
            : C.bgSurface,
          padding: "clamp(1.1rem,2.5vw,1.6rem)",
          boxShadow: hov
            ? `0 10px 36px rgba(0,0,0,0.5), -4px 0 20px ${ha(accent,0.12)}`
            : "0 2px 10px rgba(0,0,0,0.3)",
          transform: hov ? "translateX(4px) translateY(-2px)" : "none",
          transition: rm ? "none" : `all ${DUR.normal}ms`,
          position: "relative", overflow: "hidden",
        }}>
          {/* Type chip */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 8px", borderRadius: 4, marginBottom: 10, background: ha(accent, 0.12), border: `1px solid ${ha(accent,0.28)}` }}>
            <span style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: "0.12em", color: accent, fontWeight: 600, textTransform: "uppercase" }}>
              {item.type === "education" ? "🎓 Education" : "💼 Internship"}
            </span>
          </div>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: "clamp(0.9rem,1.5vw,1.1rem)", fontFamily: "monospace", fontWeight: 800, letterSpacing: "-0.02em", color: hov ? C.textPrimary : C.textSecondary, margin: "0 0 2px", lineHeight: 1.2, transition: "color 220ms" }}>
                {item.role}
              </h3>
              <p style={{ fontSize: 11, fontFamily: "monospace", color: accent, margin: "0 0 3px", letterSpacing: "0.03em", textShadow: hov ? `0 0 8px ${ha(accent,0.5)}` : "none", transition: "text-shadow 220ms" }}>
                {item.company}
              </p>
              <p style={{ fontSize: 8, fontFamily: "monospace", color: C.textDim, letterSpacing: "0.08em", margin: 0 }}>{item.location}</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 10, fontFamily: "monospace", color: C.textMuted }}>{item.period}</div>
              <div style={{ fontSize: 8, fontFamily: "monospace", padding: "2px 7px", borderRadius: 4, background: ha(C.textPrimary,0.03), border: `1px solid ${C.border}`, color: C.textDim, marginTop: 4, display: "inline-block" }}>
                {item.duration}
              </div>
            </div>
          </div>

          {/* Highlights */}
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px", display: "flex", flexDirection: "column", gap: 7 }}>
            {item.highlights.map((hl, i) => (
              <li key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: accent, flexShrink: 0, marginTop: "0.42em", boxShadow: hov ? `0 0 5px ${accent}` : "none", transition: "box-shadow 220ms" }} />
                <span style={{ fontSize: 11, fontFamily: "monospace", color: C.textMuted, lineHeight: 1.7 }}>{hl}</span>
              </li>
            ))}
          </ul>

          {/* Impact bar */}
          <div style={{ padding: "8px 12px", borderRadius: 8, background: ha(accent, 0.07), border: `1px solid ${ha(accent,0.20)}`, marginBottom: 12 }}>
            <span style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.08em", color: accent, fontWeight: 600 }}>⚡ {item.impact}</span>
          </div>

          {/* Tech */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {item.tech.map((t) => <TechTag key={t} label={t} accent={accent} compact />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EXPERIENCE SECTION ───────────────────────────────────────────────────────
export function ExperienceSection() {
  const { C } = useTheme();
  const [ref, vis] = useInView(0.04);
  const rm         = useReducedMotion();
  const isMobile   = useMediaQuery("(max-width: 900px)");

  const internships = EXPERIENCES.filter((e) => e.type === "internship");
  const education   = EXPERIENCES.filter((e) => e.type === "education");

  const stats = [
    { v: "6mo",  l: "Internship Exp",       c: C.cyan   },
    { v: "8.4",  l: "CGPA / 10",            c: C.violet },
    { v: "200+", l: "LeetCode Solved",      c: C.amber  },
    { v: "2",    l: "Internships Done",     c: C.green  },
  ];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="experience"
      aria-label="Experience and Education"
      style={{ position: "relative", overflow: "hidden", padding: "clamp(5rem,10vh,8rem) 0", background: C.bgCanvas }}
    >
      <SectionBg accent={C.amber} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", padding: "0 clamp(1.25rem,5vw,4rem)" }}>
        <SectionLabel index={4} label="Experience" vis={vis} rm={rm} />

        <Reveal vis={vis} rm={rm} delay={80} style={{ marginBottom: "clamp(3rem,6vh,5rem)" }}>
          <h2 style={{ fontSize: "clamp(2rem,5vw,4.2rem)", fontFamily: "monospace", fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 14px", lineHeight: 0.96, color: C.textPrimary }}>
            Where I&apos;ve<br />
            <span style={{ color: C.cyan, textShadow: `0 0 30px ${ha(C.cyan,0.30)}` }}>been and built.</span>
          </h2>
          <p style={{ fontSize: "clamp(0.86rem,1.1vw,1rem)", color: C.textMuted, lineHeight: 1.75, maxWidth: 500 }}>
            Internships, education, and everything in between. Each role taught me something the last one couldn&apos;t.
          </p>
        </Reveal>

        {/* Two-column timeline */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "clamp(2rem,5vw,5rem)", alignItems: "start" }}>
          {[
            { title: "Internships", items: internships },
            { title: "Education",   items: education   },
          ].map(({ title, items }) => (
            <div key={title}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26 }}>
                <span style={{ fontSize: 10, fontFamily: "monospace", fontWeight: 600, letterSpacing: "0.16em", color: C.textMuted, textTransform: "uppercase", flexShrink: 0 }}>{title}</span>
                <div style={{ height: 1, background: C.border, flex: 1 }} />
              </div>
              {items.map((item, i) => (
                <ExperienceItem
                  key={item.id} item={item} index={i}
                  vis={vis} rm={rm} isLast={i === items.length - 1}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Stats grid */}
        <Reveal vis={vis} rm={rm} delay={500}>
          <div style={{ marginTop: "clamp(3rem,6vh,5rem)", padding: "clamp(1.5rem,3vh,2.5rem)", borderRadius: 14, background: C.bgSurface, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.14em", color: C.textDim, textTransform: "uppercase", marginBottom: 20 }}>Quick Stats</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: "clamp(1.5rem,3vw,2.5rem)" }}>
              {stats.map(({ v, l, c }) => (
                <div key={l}>
                  <div style={{ fontSize: "clamp(1.4rem,2.5vw,2rem)", fontFamily: "monospace", fontWeight: 700, letterSpacing: "-0.04em", color: c, textShadow: `0 0 14px ${ha(c,0.44)}` }}>{v}</div>
                  <div style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: "0.12em", color: C.textMuted, textTransform: "uppercase", marginTop: 5, lineHeight: 1.4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
