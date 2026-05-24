"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useInView, useReducedMotion, useMediaQuery, useTilt, useMagnetic } from "@/hooks";
import { ha } from "@/lib/utils";
import { DUR, EASE } from "@/lib/tokens";
import { PROJECTS, PROJECT_FILTERS, type Project } from "@/data/projects";
import { Reveal, SectionLabel, TechTag, StatusBadge, ActionBtn, SectionBg } from "@/components/ui";

// ─── PROJECT CARD (shared by featured + grid) ─────────────────────────────────
function ProjectCard({
  project, vis, rm, delay = 0, featured = false,
}: {
  project: Project; vis: boolean; rm: boolean; delay?: number; featured?: boolean;
}) {
  const { C } = useTheme();
  const [hov, setHov] = useState(false);
  const { tilt, handlers } = useTilt(featured ? 4 : 5, rm);

  const accent    = C[project.accentKey    as keyof typeof C] as string;
  const accentSec = C[project.accentSecKey as keyof typeof C] as string;

  return (
    <div
      {...handlers}
      onMouseEnter={() => { setHov(true); }}
      onMouseLeave={() => { setHov(false); handlers.onMouseLeave(); }}
      style={{
        position:     "relative",
        borderRadius: featured ? 20 : 15,
        overflow:     "hidden",
        border:       `1px solid ${hov ? ha(accent, 0.42) : C.border}`,
        borderTop:    `2px solid ${hov ? accent : ha(accent, 0.22)}`,
        background:   hov
          ? `linear-gradient(160deg,${ha(accent,0.07)} 0%,${C.bgSurface} 60%)`
          : C.bgSurface,
        boxShadow: hov
          ? `0 ${featured ? 18 : 12}px ${featured ? 56 : 40}px rgba(0,0,0,0.65), 0 0 0 1px ${ha(accent,0.18)}, 0 -2px 20px ${ha(accent,0.10)}`
          : "0 2px 14px rgba(0,0,0,0.35)",
        transform: rm ? "none" : `
          perspective(700px)
          rotateX(${tilt.x}deg)
          rotateY(${tilt.y}deg)
          translateY(${hov ? -4 : vis ? 0 : 24}px)
        `,
        opacity:    vis ? 1 : 0,
        transition: rm ? "none" : `
          opacity 550ms ${EASE.spring} ${delay}ms,
          border-color 250ms, background 250ms, box-shadow 250ms,
          transform ${hov ? "120ms ease-out" : `520ms ${EASE.spring}`}
        `,
        willChange:     "transform",
        display:        "flex",
        flexDirection:  "column",
        cursor:         "default",
      }}
    >
      {/* Tilt light */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: `radial-gradient(ellipse 65% 50% at ${50 + tilt.y * 5}% ${40 - tilt.x * 4}%,${ha(accent,0.09)} 0%,transparent 70%)`, transition: "background 80ms", borderRadius: featured ? 20 : 15 }} />
      {/* Ambient mesh */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: `radial-gradient(ellipse 90% 70% at 85% 95%,${ha(accentSec,0.06)} 0%,transparent 60%)`, borderRadius: featured ? 20 : 15 }} />

      <div style={{ position: "relative", zIndex: 2, padding: featured ? "clamp(1.5rem,3vw,2rem)" : "18px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: featured ? 46 : 38, height: featured ? 46 : 38, borderRadius: featured ? 12 : 10, background: `linear-gradient(135deg,${ha(accent,0.18)},${ha(accentSec,0.12)})`, border: `1px solid ${ha(accent,0.28)}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: featured ? 22 : 18, flexShrink: 0, boxShadow: hov ? `0 0 18px ${ha(accent,0.28)}` : "none", transition: "box-shadow 250ms" }}>{project.emoji}</div>
            <div>
              <h3 style={{ fontSize: featured ? "clamp(1.1rem,2vw,1.45rem)" : 14, fontFamily: "monospace", fontWeight: 800, letterSpacing: "-0.025em", color: hov ? C.textPrimary : C.textSecondary, margin: 0, lineHeight: 1.2, transition: "color 220ms" }}>{project.title}</h3>
              <p style={{ fontSize: featured ? 10 : 9, fontFamily: "monospace", color: accent, margin: "3px 0 0", letterSpacing: "0.04em", textShadow: hov ? `0 0 8px ${ha(accent,0.5)}` : "none", transition: "text-shadow 220ms" }}>{project.tagline}</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
            <StatusBadge status={project.status} />
            <span style={{ fontSize: 8, fontFamily: "monospace", color: C.textDim, letterSpacing: "0.10em" }}>{project.year}</span>
          </div>
        </div>

        <p style={{ fontSize: featured ? "clamp(0.82rem,1vw,0.94rem)" : 11, fontFamily: "monospace", color: C.textMuted, lineHeight: 1.75, letterSpacing: "-0.005em", margin: "0 0 14px", flex: featured ? 0 : 1 }}>{project.description}</p>

        {/* Metrics */}
        <div style={{ display: "flex", gap: featured ? "clamp(1rem,3vw,2.5rem)" : 14, padding: "10px 0", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, marginBottom: 14, flexWrap: "wrap" }}>
          {project.metrics.map((m) => (
            <div key={m.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: featured ? "clamp(1rem,2vw,1.4rem)" : 13, fontFamily: "monospace", fontWeight: 700, letterSpacing: "-0.03em", color: accent, lineHeight: 1, textShadow: hov ? `0 0 12px ${ha(accent,0.5)}` : "none", transition: "text-shadow 250ms" }}>{m.value}</span>
              <span style={{ fontSize: featured ? 8 : 7, fontFamily: "monospace", letterSpacing: "0.12em", color: C.textDim, textTransform: "uppercase" }}>{m.label}</span>
            </div>
          ))}
        </div>

        {/* Tech + actions */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {project.tech.slice(0, featured ? project.tech.length : 4).map((t) => (
              <TechTag key={t} label={t} accent={accent} compact />
            ))}
            {!featured && project.tech.length > 4 && (
              <span style={{ padding: "2px 7px", borderRadius: 4, fontSize: 8, fontFamily: "monospace", background: ha(C.textPrimary, 0.03), border: `1px solid ${C.border}`, color: C.textDim }}>
                +{project.tech.length - 4}
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 7, flexShrink: 0, opacity: hov ? 1 : 0.7, transition: "opacity 250ms" }}>
            <ActionBtn href={project.github} label="Code" />
            <ActionBtn primary accent={accent} href={project.live} label="Live" />
          </div>
        </div>
      </div>

      {/* Slug watermark */}
      <div aria-hidden="true" style={{ position: "absolute", bottom: featured ? 18 : 10, right: featured ? 22 : 13, zIndex: 1, fontSize: featured ? "clamp(3rem,7vw,6rem)" : "3.5rem", fontFamily: "monospace", fontWeight: 800, color: "transparent", WebkitTextStroke: `1px ${ha(accent,0.07)}`, letterSpacing: "-0.06em", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
        {project.slug}
      </div>
    </div>
  );
}

// ─── FILTER PILL ──────────────────────────────────────────────────────────────
function FilterPill({
  id, label, icon, isActive, onClick,
}: {
  id: string; label: string; icon: string; isActive: boolean; onClick: () => void;
}) {
  const { C } = useTheme();
  const [hov, setHov] = useState(false);
  const mag = useMagnetic(0.22);

  return (
    <button
      ref={mag.ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      aria-pressed={isActive}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); mag.handlers.onMouseLeave(); }}
      onMouseMove={mag.handlers.onMouseMove}
      style={{
        display:        "flex",
        alignItems:     "center",
        gap:            5,
        padding:        "7px 14px",
        borderRadius:   9999,
        border:         `1px solid ${isActive ? ha(C.cyan, 0.45) : hov ? C.borderMid : C.border}`,
        background:     isActive ? ha(C.cyan, 0.10) : hov ? ha(C.textPrimary, 0.04) : "transparent",
        color:          isActive ? C.cyan : hov ? C.textSecondary : C.textMuted,
        fontSize:       9,
        fontFamily:     "monospace",
        fontWeight:     isActive ? 600 : 400,
        letterSpacing:  "0.06em",
        cursor:         "pointer",
        outline:        "none",
        boxShadow:      isActive ? `0 0 14px ${ha(C.cyan, 0.15)}, inset 0 1px 0 ${ha(C.cyan, 0.12)}` : "none",
        transition:     `all ${DUR.normal}ms`,
        whiteSpace:     "nowrap",
        userSelect:     "none",
        ...mag.style,
      }}
    >
      <span>{icon}</span>
      {label}
      {isActive && (
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.cyan, boxShadow: `0 0 5px ${C.cyan}`, flexShrink: 0 }} />
      )}
    </button>
  );
}

// ─── PROJECTS SECTION ─────────────────────────────────────────────────────────
export function ProjectsSection() {
  const { C } = useTheme();
  const [ref,     vis]     = useInView(0.05);
  const [featRef, featVis] = useInView(0.06);
  const [gridRef, gridVis] = useInView(0.04);
  const rm       = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 840px)");

  const [filter,  setFilter]  = useState<string>("all");
  const [showAll, setShowAll] = useState(false);

  const featured = useMemo(() => PROJECTS.filter((p) => p.featured), []);
  const gridAll  = useMemo(() => {
    const base = PROJECTS.filter((p) => !p.featured);
    return filter === "all" ? base : base.filter((p) => p.category === filter);
  }, [filter]);
  const visible  = showAll ? gridAll : gridAll.slice(0, 4);

  const handleFilter = useCallback((id: string) => {
    setFilter(id);
    setShowAll(false);
  }, []);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="projects"
      aria-label="Projects"
      style={{ position: "relative", overflow: "hidden", padding: "clamp(5rem,10vh,8rem) 0", background: C.bgBase }}
    >
      <SectionBg accent={C.red} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", padding: "0 clamp(1.25rem,5vw,4rem)" }}>
        <SectionLabel index={3} label="Projects" vis={vis} rm={rm} />

        {/* Header */}
        <Reveal vis={vis} rm={rm} delay={80} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: "clamp(2.5rem,5vh,4rem)" }}>
          <div>
            <h2 style={{ fontSize: "clamp(2rem,5vw,4.2rem)", fontFamily: "monospace", fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 14px", lineHeight: 0.96, color: C.textPrimary }}>
              Things I&apos;ve<br />
              <span style={{ color: C.cyan, textShadow: `0 0 30px ${ha(C.cyan,0.30)}` }}>actually shipped.</span>
            </h2>
            <p style={{ fontSize: "clamp(0.86rem,1.1vw,1rem)", color: C.textMuted, lineHeight: 1.75, maxWidth: 480 }}>
              Production code, real users, real constraints. Not side projects that lived for a weekend.
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: "clamp(2rem,4vw,3.5rem)", fontFamily: "monospace", fontWeight: 800, letterSpacing: "-0.06em", color: C.cyan, lineHeight: 1, textShadow: `0 0 24px ${ha(C.cyan,0.40)}` }}>{PROJECTS.length}</div>
            <div style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: "0.14em", color: C.textMuted, textTransform: "uppercase" }}>Projects total</div>
          </div>
        </Reveal>

        {/* Featured spotlight */}
        <div ref={featRef as React.RefObject<HTMLDivElement>} style={{ marginBottom: "clamp(3rem,6vh,5rem)" }}>
          <Reveal vis={featVis} rm={rm} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontFamily: "monospace", fontWeight: 600, letterSpacing: "0.16em", color: C.textMuted, textTransform: "uppercase", flexShrink: 0 }}>Featured</span>
            <div style={{ height: 1, background: C.border, flex: 1 }} />
            <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 8, fontFamily: "monospace", letterSpacing: "0.10em", background: ha(C.cyan, 0.08), border: `1px solid ${ha(C.cyan,0.22)}`, color: C.cyan }}>SPOTLIGHT</span>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, opacity: featVis ? 1 : 0, transition: rm ? "none" : `opacity 600ms ${EASE.spring} 100ms` }}>
            {featured.map((p) => (
              <ProjectCard key={p.id} project={p} vis={featVis} rm={rm} featured />
            ))}
          </div>
        </div>

        {/* Filter + grid */}
        <div ref={gridRef as React.RefObject<HTMLDivElement>}>
          <Reveal vis={gridVis} rm={rm} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 10, fontFamily: "monospace", fontWeight: 600, letterSpacing: "0.16em", color: C.textMuted, textTransform: "uppercase" }}>More Work</span>
              <span style={{ fontSize: 9, fontFamily: "monospace", color: C.textDim }}>{gridAll.length} project{gridAll.length !== 1 ? "s" : ""}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {PROJECT_FILTERS.map((f) => (
                <FilterPill
                  key={f.id} id={f.id} label={f.label} icon={f.icon}
                  isActive={filter === f.id}
                  onClick={() => handleFilter(f.id)}
                />
              ))}
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(300px,1fr))", gap: 13, minHeight: 200 }}>
            {visible.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", padding: "3rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, borderRadius: 13, border: `1px dashed ${C.border}`, color: C.textDim }}>
                <span style={{ fontSize: 24 }}>◎</span>
                <span style={{ fontSize: 12, fontFamily: "monospace" }}>No projects in this category</span>
                <button onClick={() => setFilter("all")} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, fontSize: 10, fontFamily: "monospace", cursor: "pointer", outline: "none" }}>Show all</button>
              </div>
            ) : (
              visible.map((p, i) => (
                <ProjectCard key={`${filter}-${p.id}`} project={p} vis={gridVis} rm={rm} delay={i * 65} />
              ))
            )}
          </div>

          {/* Show more */}
          {!showAll && gridAll.length > 4 && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
              <button
                onClick={() => setShowAll(true)}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 26px", borderRadius: 9999, border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, fontSize: 9, fontFamily: "monospace", letterSpacing: "0.08em", cursor: "pointer", outline: "none", transition: `all ${DUR.normal}ms` }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = ha(C.cyan, 0.40); e.currentTarget.style.color = C.cyan; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
              >
                Show {gridAll.length - 4} more ▾
              </button>
            </div>
          )}

          {/* Bottom CTA */}
          <Reveal vis={gridVis} rm={rm} delay={500} style={{ marginTop: "clamp(3rem,6vh,5rem)" }}>
            <div style={{ padding: "clamp(1.5rem,3vh,2.5rem) clamp(1.5rem,3vw,2.5rem)", borderRadius: 16, background: C.bgSurface, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20, position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, borderRadius: "16px 0 0 16px", background: `linear-gradient(to bottom,${C.cyan},${C.violet})` }} />
              <div aria-hidden="true" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "35%", background: `radial-gradient(ellipse 80% 100% at 100% 50%,${ha(C.cyan,0.05)},transparent)`, pointerEvents: "none" }} />
              <div style={{ paddingLeft: 14, position: "relative" }}>
                <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.14em", color: C.cyan, marginBottom: 6, textTransform: "uppercase" }}>Want to see more?</div>
                <p style={{ fontSize: 15, fontFamily: "monospace", fontWeight: 700, color: C.textPrimary, margin: 0, letterSpacing: "-0.02em" }}>All my code lives on GitHub.</p>
              </div>
              <div style={{ display: "flex", gap: 10, position: "relative" }}>
                <ActionBtn primary accent={C.cyan} href="https://github.com" label="GitHub Profile" />
                <ActionBtn href="#contact" label="Contact Me" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
