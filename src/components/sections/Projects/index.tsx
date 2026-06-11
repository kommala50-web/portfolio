"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useInView, useReducedMotion, useMediaQuery, useTilt, useMagnetic } from "@/hooks";
import { ha } from "@/lib/utils";
import { DUR, EASE } from "@/lib/tokens";
import { PROJECTS, PROJECT_FILTERS, type Project } from "@/data/projects";
import { Reveal, SectionLabel, TechTag, StatusBadge, ActionBtn, SectionBg } from "@/components/ui";

// ─── PROJECT CARD (shared by featured + grid) ─────────────────────────────────
function ProjectCard({
  project, vis, rm, delay = 0, featured = false, onPreview,
}: {
  project: Project; vis: boolean; rm: boolean; delay?: number; featured?: boolean; onPreview?: (project: Project) => void;
}) {
  const { C } = useTheme();
  const [hov, setHov] = useState(false);
  const { tilt, handlers } = useTilt(featured ? 4 : 5, rm);

  const accent    = C[project.accentKey    as keyof typeof C] as string;
  const accentSec = C[project.accentSecKey as keyof typeof C] as string;

  const hasImages = !!(project.images && project.images.length > 0);

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
            {hasImages && (
              <button
                onClick={(e) => { e.stopPropagation(); onPreview?.(project); }}
                style={{
                  display:        "inline-flex",
                  alignItems:     "center",
                  gap:            4,
                  padding:        "5px 10px",
                  borderRadius:   6,
                  border:         `1px solid ${ha(accent, 0.45)}`,
                  background:     ha(accent, 0.10),
                  color:          accent,
                  fontSize:       9,
                  fontFamily:     "monospace",
                  fontWeight:     700,
                  letterSpacing:  "0.06em",
                  cursor:         "pointer",
                  outline:        "none",
                  transition:     `all ${DUR.fast}ms`,
                  textShadow:     `0 0 8px ${ha(accent, 0.4)}`,
                  boxShadow:      `0 0 10px ${ha(accent, 0.12)}`,
                  whiteSpace:     "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background  = ha(accent, 0.22);
                  e.currentTarget.style.boxShadow   = `0 0 18px ${ha(accent, 0.30)}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background  = ha(accent, 0.10);
                  e.currentTarget.style.boxShadow   = `0 0 10px ${ha(accent, 0.12)}`;
                }}
              >
                Preview ↗
              </button>
            )}
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

// ─── PREVIEW MODAL (carousel) ─────────────────────────────────────────────────
function PreviewModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const { C } = useTheme();
  const isMobile = useMediaQuery("(max-width: 840px)");
  const [index, setIndex] = useState(0);
  const images = project.images ?? [];
  const accent = C[project.accentKey as keyof typeof C] as string;
  const total  = images.length;

  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  const navBtnStyle = (side: "left" | "right"): React.CSSProperties => ({
    position:       "absolute",
    top:            "50%",
    [side]:         isMobile ? 8 : 16,
    transform:      "translateY(-50%)",
    zIndex:         10,
    width:          isMobile ? 34 : 42,
    height:         isMobile ? 34 : 42,
    borderRadius:   "50%",
    border:         `1px solid ${ha(accent, 0.40)}`,
    background:     ha(C.bgCanvas, 0.85),
    backdropFilter: "blur(8px)",
    color:          accent,
    fontSize:       isMobile ? 14 : 18,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    cursor:         "pointer",
    outline:        "none",
    boxShadow:      `0 0 18px ${ha(accent, 0.20)}`,
    transition:     `all ${DUR.fast}ms`,
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} preview`}
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         9999,
        background:     "rgba(4, 4, 10, 0.88)",
        backdropFilter: "blur(18px) saturate(180%)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "clamp(10px, 4vw, 30px)",
        animation:      "fadeIn 250ms ease-out",
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.94) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>

      <div
        style={{
          width:         "100%",
          maxWidth:      860,
          maxHeight:     "90vh",
          background:    C.bgSurface,
          borderRadius:  18,
          border:        `1px solid ${ha(accent, 0.40)}`,
          boxShadow:     `0 30px 80px rgba(0,0,0,0.90), 0 0 50px ${ha(accent, 0.18)}`,
          display:       "flex",
          flexDirection: "column",
          overflow:      "hidden",
          animation:     "scaleUp 320ms cubic-bezier(0.16, 1, 0.3, 1)",
          position:      "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />

        {/* Header */}
        <div style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "16px 24px",
          borderBottom:   `1px solid ${C.border}`,
          background:     C.bgElevated,
          flexShrink:     0,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>{project.emoji}</span>
              <h3 style={{ fontSize: "clamp(12px, 4.5vw, 15px)", fontFamily: "monospace", fontWeight: 800, color: C.textPrimary, margin: 0 }}>
                {project.title}
              </h3>
              <span style={{ fontSize: 9, fontFamily: "monospace", color: C.textDim }}>({project.year})</span>
              {total > 1 && (
                <span style={{ fontSize: 8, fontFamily: "monospace", color: accent, padding: "2px 7px", borderRadius: 4, background: ha(accent, 0.10), border: `1px solid ${ha(accent, 0.25)}`, letterSpacing: "0.08em" }}>
                  {index + 1} / {total}
                </span>
              )}
            </div>
            <p style={{ fontSize: 9, fontFamily: "monospace", color: accent, margin: "2px 0 0 24px" }}>{project.tagline}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close preview"
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: "transparent",
              cursor: "pointer",
              color: C.textMuted,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14,
              transition: `all ${DUR.fast}ms`,
              outline: "none",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.red; e.currentTarget.style.borderColor = ha(C.red, 0.4); }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.borderColor = C.border; }}
          >
            ✕
          </button>
        </div>

        {/* Gallery viewer */}
        <div style={{
          flex:           1,
          background:     "#05050c",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          position:       "relative",
          overflow:       "hidden",
          minHeight:      isMobile ? 300 : 420,
        }}>
          {/* Image */}
          <img
            key={images[index]}
            src={images[index]}
            alt={`${project.title} screenshot ${index + 1}`}
            loading="lazy"
            style={{
              maxWidth:   "100%",
              maxHeight:  isMobile ? 340 : 500,
              width:      "auto",
              height:     "auto",
              objectFit:  "contain",
              borderRadius: 8,
              boxShadow:  `0 8px 40px rgba(0,0,0,0.70), 0 0 30px ${ha(accent, 0.12)}`,
              animation:  "fadeIn 220ms ease-out",
              padding:    isMobile ? "8px" : "20px",
            }}
          />

          {/* Prev arrow */}
          {total > 1 && (
            <button
              onClick={prev}
              aria-label="Previous screenshot"
              style={navBtnStyle("left")}
              onMouseEnter={(e) => { e.currentTarget.style.background = ha(accent, 0.20); e.currentTarget.style.boxShadow = `0 0 28px ${ha(accent, 0.40)}`; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ha(C.bgCanvas, 0.85); e.currentTarget.style.boxShadow = `0 0 18px ${ha(accent, 0.20)}`; }}
            >
              ‹
            </button>
          )}

          {/* Next arrow */}
          {total > 1 && (
            <button
              onClick={next}
              aria-label="Next screenshot"
              style={navBtnStyle("right")}
              onMouseEnter={(e) => { e.currentTarget.style.background = ha(accent, 0.20); e.currentTarget.style.boxShadow = `0 0 28px ${ha(accent, 0.40)}`; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ha(C.bgCanvas, 0.85); e.currentTarget.style.boxShadow = `0 0 18px ${ha(accent, 0.20)}`; }}
            >
              ›
            </button>
          )}

          {/* Dot indicators */}
          {total > 1 && (
            <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6 }}>
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to screenshot ${i + 1}`}
                  style={{
                    width:        i === index ? 20 : 6,
                    height:       6,
                    borderRadius: 999,
                    background:   i === index ? accent : ha(accent, 0.30),
                    border:       "none",
                    cursor:       "pointer",
                    outline:      "none",
                    padding:      0,
                    transition:   `all ${DUR.normal}ms`,
                    boxShadow:    i === index ? `0 0 8px ${ha(accent, 0.6)}` : "none",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding:        "14px 24px",
          borderTop:      `1px solid ${C.border}`,
          background:     C.bgElevated,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          flexWrap:       "wrap",
          gap:            12,
          flexShrink:     0,
        }}>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {project.tech.map((t) => (
              <span key={t} style={{ fontSize: 7.5, fontFamily: "monospace", padding: "2px 6px", borderRadius: 4, background: ha(C.textPrimary, 0.05), border: `1px solid ${C.border}`, color: C.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "7px 14px", borderRadius: 6,
                  border: `1px solid ${C.border}`, background: "transparent",
                  color: C.textSecondary, fontSize: 9, fontFamily: "monospace",
                  fontWeight: 700, letterSpacing: "0.08em", textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 6,
                  transition: "border-color 150ms, color 150ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.textPrimary; e.currentTarget.style.color = C.textPrimary; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSecondary; }}
              >
                CODE ↗
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "7px 14px", borderRadius: 6,
                  background: accent, color: C.bgCanvas,
                  fontSize: 9, fontFamily: "monospace", fontWeight: 700,
                  letterSpacing: "0.08em", textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 6,
                  boxShadow: `0 0 14px ${ha(accent, 0.3)}`,
                  transition: "transform 150ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
              >
                LIVE ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
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
  const [activeProject, setActiveProject] = useState<Project | null>(null);

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
              <ProjectCard key={p.id} project={p} vis={featVis} rm={rm} featured onPreview={setActiveProject} />
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
                <ProjectCard key={`${filter}-${p.id}`} project={p} vis={gridVis} rm={rm} delay={i * 65} onPreview={setActiveProject} />
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

      {/* Preview Modal */}
      {activeProject && activeProject.images && activeProject.images.length > 0 && (
        <PreviewModal project={activeProject} onClose={() => setActiveProject(null)} />
      )}
    </section>
  );
}
