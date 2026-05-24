"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useInView, useReducedMotion, useMediaQuery, useTilt } from "@/hooks";
import { ha } from "@/lib/utils";
import { DUR, EASE } from "@/lib/tokens";
import { CERTIFICATIONS } from "@/data/certifications";
import { Reveal, SectionLabel, TechTag, SectionBg } from "@/components/ui";

// ─── CERT CARD ────────────────────────────────────────────────────────────────
function CertCard({
  cert, isCenter,
}: {
  cert: typeof CERTIFICATIONS[number];
  isCenter: boolean;
}) {
  const { C }  = useTheme();
  const rm     = useReducedMotion();
  const { tilt, handlers } = useTilt(5, rm || !isCenter);
  const [hov, setHov] = useState(false);

  const accent = C[cert.accentKey as keyof typeof C] as string;

  return (
    <div
      {...handlers}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); handlers.onMouseLeave(); }}
      style={{
        borderRadius: 18,
        border: `1px solid ${isCenter || hov ? ha(accent, 0.42) : C.border}`,
        background:   isCenter
          ? `linear-gradient(145deg,${ha(accent,0.10)} 0%,${C.bgSurface} 60%)`
          : C.bgSurface,
        padding:    "clamp(1.4rem,2.5vw,1.9rem)",
        boxShadow:  isCenter
          ? `0 16px 54px rgba(0,0,0,0.7), 0 0 0 1px ${ha(accent,0.20)}, 0 0 60px ${ha(accent,0.08)}`
          : "0 2px 14px rgba(0,0,0,0.35)",
        transform: rm ? "none" : `
          perspective(700px)
          rotateX(${tilt.x}deg)
          rotateY(${tilt.y}deg)
          scale(${isCenter ? 1 : 0.91})
          translateY(${isCenter ? 0 : 14}px)
        `,
        opacity:    isCenter ? 1 : 0.42,
        transition: rm ? "none"
          : `all 340ms ${EASE.spring}, transform ${hov ? "115ms ease-out" : `340ms ${EASE.spring}`}`,
        willChange: "transform",
        position:   "relative",
        overflow:   "hidden",
        cursor:     isCenter ? "default" : "pointer",
      }}
    >
      {/* Top accent bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${accent},transparent)`, opacity: isCenter ? 1 : 0.3 }} />

      {/* Tilt light */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: `radial-gradient(ellipse 60% 45% at ${50 + tilt.y * 5}% ${35 - tilt.x * 4}%,${ha(accent,0.08)} 0%,transparent 70%)`, transition: "background 80ms", borderRadius: 18 }} />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Icon + badge */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 13, background: `linear-gradient(135deg,${ha(accent,0.20)},${ha(accent,0.08)})`, border: `1px solid ${ha(accent,0.30)}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: isCenter ? `0 0 20px ${ha(accent,0.28)}` : "none", transition: "box-shadow 280ms" }}>{cert.icon}</div>
          <div style={{ padding: "3px 9px", borderRadius: 9999, background: ha(accent, 0.10), border: `1px solid ${ha(accent,0.25)}` }}>
            <span style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: "0.10em", color: accent, fontWeight: 600, textTransform: "uppercase" }}>{cert.badge}</span>
          </div>
        </div>

        <h3 style={{ fontSize: "clamp(0.95rem,1.8vw,1.15rem)", fontFamily: "monospace", fontWeight: 800, letterSpacing: "-0.03em", color: isCenter ? C.textPrimary : C.textSecondary, margin: "0 0 3px", lineHeight: 1.2, transition: "color 280ms" }}>{cert.title}</h3>
        <p style={{ fontSize: 10, fontFamily: "monospace", color: accent, margin: "0 0 3px", letterSpacing: "0.04em", textShadow: isCenter ? `0 0 8px ${ha(accent,0.5)}` : "none" }}>{cert.issuer}</p>
        <p style={{ fontSize: 8, fontFamily: "monospace", color: C.textDim, letterSpacing: "0.10em", margin: "0 0 14px", textTransform: "uppercase" }}>Issued {cert.issued}</p>

        <div style={{ height: 1, background: C.border, marginBottom: 12 }} />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
          {cert.skills.map((s) => <TechTag key={s} label={s} accent={accent} compact />)}
        </div>

        <div style={{ padding: "7px 11px", borderRadius: 8, background: ha(C.textPrimary, 0.03), border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 8, fontFamily: "monospace", color: C.textDim, letterSpacing: "0.08em", textTransform: "uppercase" }}>Credential ID</span>
          <span style={{ fontSize: 9, fontFamily: "monospace", color: C.textMuted }}>{cert.credential}</span>
        </div>
      </div>
    </div>
  );
}

// ─── CAROUSEL BUTTON ─────────────────────────────────────────────────────────
function CarouselBtn({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  const { C } = useTheme();
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous certificate" : "Next certificate"}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: 36, height: 36, borderRadius: "50%",
        border: `1px solid ${h ? ha(C.cyan, 0.42) : C.border}`,
        background: h ? ha(C.cyan, 0.10) : "rgba(128,128,255,0.03)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", outline: "none",
        color: h ? C.cyan : C.textMuted,
        boxShadow: h ? `0 0 14px ${ha(C.cyan, 0.25)}` : "none",
        transform: h ? "scale(1.08)" : "none",
        transition: `all ${DUR.normal}ms ${EASE.spring}`,
        flexShrink: 0,
      }}
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path
          d={dir === "prev" ? "M8.5 2L4 6.5L8.5 11" : "M4.5 2L9 6.5L4.5 11"}
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

// ─── CERTIFICATIONS SECTION ───────────────────────────────────────────────────
export function CertificationsSection() {
  const { C }  = useTheme();
  const [ref, vis] = useInView(0.06);
  const rm     = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [idx,  setIdx]  = useState(0);
  const total = CERTIFICATIONS.length;
  const dragStart = useRef<number | null>(null);

  const goTo = useCallback((n: number) => {
    setIdx(((n % total) + total) % total);
  }, [total]);

  // Auto-advance
  useEffect(() => {
    if (rm || !vis) return;
    const id = setInterval(() => goTo(idx + 1), 4200);
    return () => clearInterval(id);
  }, [idx, rm, vis, goTo]);

  // Keyboard nav
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  goTo(idx - 1);
      if (e.key === "ArrowRight") goTo(idx + 1);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [idx, goTo]);

  const getSlot = (offset: number) => ((idx + offset + total) % total);

  const onPointerDown = (e: React.PointerEvent) => { dragStart.current = e.clientX; };
  const onPointerUp   = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    if (Math.abs(dx) > 40) { dx > 0 ? goTo(idx - 1) : goTo(idx + 1); }
    dragStart.current = null;
  };

  const activeCert  = CERTIFICATIONS[idx]!;
  const activeAccent = C[activeCert.accentKey as keyof typeof C] as string;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="certifications"
      aria-label="Certifications"
      style={{ position: "relative", overflow: "hidden", padding: "clamp(5rem,10vh,8rem) 0", background: C.bgBase, borderTop: `1px solid ${C.border}` }}
    >
      <SectionBg accent={C.violet} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", padding: "0 clamp(1.25rem,5vw,4rem)" }}>
        <SectionLabel index={5} label="Certifications" vis={vis} rm={rm} />

        <Reveal vis={vis} rm={rm} delay={80} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: "clamp(2.5rem,5vh,4rem)" }}>
          <div>
            <h2 style={{ fontSize: "clamp(2rem,5vw,4.2rem)", fontFamily: "monospace", fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 14px", lineHeight: 0.96, color: C.textPrimary }}>
              Credentials I&apos;ve<br />
              <span style={{ color: C.cyan, textShadow: `0 0 30px ${ha(C.cyan,0.30)}` }}>earned for real.</span>
            </h2>
            <p style={{ fontSize: "clamp(0.86rem,1.1vw,1rem)", color: C.textMuted, lineHeight: 1.75, maxWidth: 460 }}>
              Drag, click arrows, or press ← → to explore. Applied, not assumed, knowledge.
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: "clamp(2rem,4vw,3.5rem)", fontFamily: "monospace", fontWeight: 800, letterSpacing: "-0.06em", color: C.violet, lineHeight: 1, textShadow: `0 0 24px ${ha(C.violet,0.40)}` }}>{total}</div>
            <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.14em", color: C.textMuted, textTransform: "uppercase" }}>Certificates</div>
          </div>
        </Reveal>

        {/* Cards stage */}
        <div
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerLeave={() => { dragStart.current = null; }}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1.4fr 1fr",
            gap: 13,
            marginBottom: 26,
            cursor: "grab",
            userSelect: "none",
            opacity: vis ? 1 : 0,
            transition: rm ? "none" : `opacity 700ms ${EASE.spring} 200ms`,
          }}
        >
          {(isMobile ? [0] : [-1, 0, 1]).map((offset) => {
            const cert     = CERTIFICATIONS[getSlot(offset)]!;
            const isCenter = offset === 0;
            return (
              <div
                key={cert.id}
                onClick={() => !isCenter && (offset === -1 ? goTo(idx - 1) : goTo(idx + 1))}
              >
                <CertCard cert={cert} isCenter={isCenter} />
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
          <CarouselBtn dir="prev" onClick={() => goTo(idx - 1)} />

          {/* Dot indicators */}
          <div style={{ display: "flex", gap: 6 }}>
            {CERTIFICATIONS.map((_, i) => {
              const isActive = i === idx;
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to certificate ${i + 1}`}
                  style={{
                    width:        isActive ? 18 : 6,
                    height:       6,
                    borderRadius: 3,
                    background:   isActive ? activeAccent : C.textDim,
                    boxShadow:    isActive ? `0 0 7px ${activeAccent}` : "none",
                    border:       "none",
                    cursor:       "pointer",
                    outline:      "none",
                    transition:   `all 300ms ${EASE.spring}`,
                    padding:      0,
                  }}
                />
              );
            })}
          </div>

          <CarouselBtn dir="next" onClick={() => goTo(idx + 1)} />
        </div>

        <p style={{ textAlign: "center", marginTop: 12, fontSize: 8, fontFamily: "monospace", letterSpacing: "0.14em", color: C.textDim }}>
          {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {activeCert.title}
        </p>
      </div>
    </section>
  );
}
