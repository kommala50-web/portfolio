"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useInView, useReducedMotion, useMediaQuery, useTilt } from "@/hooks";
import { ha } from "@/lib/utils";
import { DUR, EASE } from "@/lib/tokens";
import { Reveal, TechTag, ActionBtn, SectionBg } from "@/components/ui";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const ROLES = [
  "Frontend Developer",
  "CSE Student",
  "NRCM · Hyderabad",
  "UI/UX Enthusiast",
  "Problem Solver",
];

const TECH_STACK = [
  "React", "Next.js", "TypeScript", "TailwindCSS",
  "Framer Motion", "JavaScript", "Python", "C++",
  "MongoDB", "Firebase",
];

// ─── PARTICLE CANVAS ──────────────────────────────────────────────────────────
function ParticleCanvas({ isMobile, rm }: { isMobile: boolean; rm: boolean }) {
  const { C } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const mouseRef  = useRef({ x: -1, y: -1 });
  const nodesRef  = useRef<Array<{
    x: number; y: number; vx: number; vy: number;
    r: number; ox: number; oy: number; accent: "red" | "cyan";
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || rm) return;
    const ctx = canvas.getContext("2d")!;
    const DPR = Math.min(window.devicePixelRatio, 1.5);

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * DPR;
      canvas.height = canvas.offsetHeight * DPR;
      ctx.scale(DPR, DPR);
    };
    resize();

    const COUNT = isMobile ? 40 : 100;
    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    nodesRef.current = Array.from({ length: COUNT }, (_, i) => ({
      x:  Math.random() * W(),
      y:  Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.20,
      r:  Math.random() * 1.5 + 0.5,
      ox: Math.random() * Math.PI * 2,
      oy: Math.random() * Math.PI * 2,
      accent: (i % 9 === 0 ? "red" : "cyan") as "red" | "cyan",
    }));

    let t = 0;
    const draw = () => {
      t += 0.008;
      const w = W(), h = H();
      const { x: mx, y: my } = mouseRef.current;
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;

      // Update positions
      nodes.forEach((n) => {
        n.x += n.vx + Math.sin(t + n.ox) * 0.11;
        n.y += n.vy + Math.cos(t + n.oy) * 0.07;

        // Wrap
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;

        // Mouse repulsion
        const dx = n.x - mx, dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 85 && dist > 0) {
          n.x += (dx / dist) * 0.35;
          n.y += (dy / dist) * 0.35;
        }
      });

      // Draw edges
      const CONNECT = isMobile ? 90 : 130;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]!, b = nodes[j]!;
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT) {
            const alpha = (1 - d / CONNECT) * 0.42;
            ctx.beginPath();
            ctx.strokeStyle = (a.accent === "red" || b.accent === "red")
              ? `rgba(255,45,85,${alpha * 0.7})`
              : `rgba(27,228,255,${alpha})`;
            ctx.lineWidth = 0.65;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        const pulse = 1 + Math.sin(t * 2 + n.ox) * 0.28;
        const col = n.accent === "red" ? "255,45,85" : "27,228,255";

        // Glow halo
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
        g.addColorStop(0, `rgba(${col},${0.32 * pulse})`);
        g.addColorStop(1, `rgba(${col},0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},0.9)`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [isMobile, rm]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  }, []);

  const onMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1, y: -1 };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        display: rm ? "none" : "block",
      }}
    />
  );
}

// ─── ROLE CYCLER ─────────────────────────────────────────────────────────────
function RoleCycler() {
  const { C } = useTheme();
  const [idx,   setIdx]   = useState(0);
  const [phase, setPhase] = useState<"in" | "out" | "vis">("vis");
  const [text,  setText]  = useState(ROLES[0]!);

  useEffect(() => {
    const cycle = () => {
      setPhase("out");
      setTimeout(() => {
        setIdx((i) => {
          const next = (i + 1) % ROLES.length;
          setText(ROLES[next]!);
          return next;
        });
        setPhase("in");
        setTimeout(() => setPhase("vis"), 60);
      }, 300);
    };
    const id = setInterval(cycle, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <span aria-live="polite" aria-label={`Current role: ${text}`} style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
      {/* Blinking cursor */}
      <span style={{
        display: "inline-block", width: 2.5, height: "0.85em",
        background: C.cyan, borderRadius: 2,
        boxShadow: `0 0 8px ${C.cyan}`,
        animation: "cursorBlink 1.1s step-end infinite",
        flexShrink: 0, verticalAlign: "middle",
      }} />
      <span style={{
        display: "inline-block",
        opacity:   phase === "out" ? 0 : 1,
        transform: phase === "out" ? "translateY(-55%) skewX(-5deg)" : phase === "in" ? "translateY(55%)" : "translateY(0)",
        transition: phase !== "vis"
          ? `all 280ms ${EASE.smooth}`
          : `all 320ms ${EASE.spring}`,
      }}>
        {text}
      </span>
    </span>
  );
}

// ─── HERO PROFILE CARD ────────────────────────────────────────────────────────
function HeroCard() {
  const { C } = useTheme();
  const rm = useReducedMotion();
  const { tilt, handlers } = useTilt(5, rm);

  return (
    <div {...handlers} style={{ perspective: 800, width: 220, flexShrink: 0 }}>
      <div style={{
        borderRadius: 18, overflow: "hidden",
        background: C.bgGlass,
        backdropFilter: "blur(22px) saturate(200%)",
        border: `1px solid ${C.border}`,
        boxShadow: `0 8px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)`,
        transform: rm ? "none" : `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: rm ? "none" : `transform ${tilt.x === 0 ? "450ms" : "120ms"} ${EASE.spring}`,
        willChange: "transform",
        animation: rm ? "none" : "floatCard 7s ease-in-out infinite",
        position: "relative",
      }}>
        {/* Top gradient bar */}
        <div style={{ height: 2.5, background: `linear-gradient(90deg,${C.violet},${C.cyan},${C.violet})`, backgroundSize: "200%", animation: "gradShift 4s linear infinite" }} />

        <div style={{ padding: "24px 20px" }}>
          {/* Avatar + orbit */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 60, height: 60, borderRadius: "50%",
                border: `2px solid ${ha(C.cyan,0.35)}`,
                overflow: "hidden",
                boxShadow: `0 0 20px ${ha(C.cyan,0.28)}`,
                position: "relative", zIndex: 1,
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/profile_photo.jpg" alt="Kamani Vijay" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div aria-hidden="true" style={{ position: "absolute", inset: -7, borderRadius: "50%", border: `1px dashed ${ha(C.cyan,0.35)}`, animation: "spinSlow 12s linear infinite" }}>
                <div style={{ position: "absolute", top: "7%", left: "50%", transform: "translate(-50%,-50%)", width: 5, height: 5, borderRadius: "50%", background: C.cyan, boxShadow: `0 0 7px ${C.cyan}` }} />
              </div>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 9px", borderRadius: 9999, background: ha(C.green, 0.08), border: `1px solid ${ha(C.green, 0.22)}` }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.green, boxShadow: `0 0 6px ${C.green}`, animation: "pulseDot 2.4s ease-in-out infinite", flexShrink: 0 }} />
              <span style={{ fontSize: 7, fontFamily: "monospace", letterSpacing: "0.10em", color: C.green }}>AVAILABLE</span>
            </div>
          </div>

          {/* Name */}
          <div style={{ fontSize: 16, fontFamily: "monospace", fontWeight: 700, letterSpacing: "-0.03em", color: C.textPrimary, marginBottom: 3 }}>Kamani Vijay</div>
          <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.08em", color: C.cyan, marginBottom: 16, textShadow: `0 0 9px ${ha(C.cyan,0.45)}` }}>FRONTEND · NRCM</div>

          <div style={{ height: 1, background: C.border, marginBottom: 14 }} />

          {[["📍", "Hyderabad, India"], ["🎓", "B.Tech CSE · NRCM"], ["⚡", "Frontend + Motion"]].map(([ic, v]) => (
            <div key={v} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, width: 16, textAlign: "center", flexShrink: 0 }}>{ic}</span>
              <span style={{ fontSize: 9, fontFamily: "monospace", color: C.textMuted }}>{v}</span>
            </div>
          ))}

          <div style={{ height: 1, background: C.border, margin: "14px 0" }} />

          {/* Quick stats */}
          <div style={{ display: "flex", gap: 8 }}>
            {[{ v: "12+", l: "Projects" }, { v: "2+", l: "Years" }, { v: "∞", l: "Coffee" }].map(({ v, l }) => (
              <div key={l} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 14, fontFamily: "monospace", fontWeight: 700, color: C.cyan, textShadow: `0 0 10px ${ha(C.cyan,0.45)}` }}>{v}</div>
                <div style={{ fontSize: 7, fontFamily: "monospace", letterSpacing: "0.12em", color: C.textDim, textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCROLL INDICATOR ────────────────────────────────────────────────────────
function ScrollIndicator() {
  const { C } = useTheme();
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const fn = () => setOpacity(Math.max(0, 1 - window.scrollY / 200));
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollDown = () => window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });

  return (
    <div
      onClick={scrollDown}
      role="button"
      aria-label="Scroll to explore"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") scrollDown(); }}
      style={{
        position: "absolute", bottom: 36, left: "50%",
        transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
        opacity, transition: "opacity 200ms",
        zIndex: 20, cursor: "pointer",
        pointerEvents: opacity < 0.05 ? "none" : "auto",
      }}
    >
      <span style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: "0.18em", color: C.textDim, textTransform: "uppercase" }}>scroll</span>
      <div style={{ width: 19, height: 31, borderRadius: 10, border: `1.5px solid ${ha(C.textPrimary, 0.15)}`, display: "flex", justifyContent: "center", paddingTop: 5 }}>
        <div style={{ width: 2.5, height: 6, borderRadius: 2, background: C.cyan, boxShadow: `0 0 6px ${C.cyan}`, animation: "scrollDot 1.9s ease-in-out infinite" }} />
      </div>
      {[0, 1, 2].map((i) => (
        <svg key={i} width="9" height="6" viewBox="0 0 9 6" fill="none" style={{ opacity: 0.25 + i * 0.25, marginTop: i === 0 ? -3 : -4, animation: `scrollChev 1.9s ease-in-out ${i * 0.18}s infinite` }}>
          <path d="M1 1L4.5 5L8 1" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}

// ─── HERO SECTION (main export) ───────────────────────────────────────────────
export function HeroSection() {
  const { C } = useTheme();
  const [ref, vis] = useInView(0.05);
  const rm = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="hero"
      aria-label="Hero — Kamani Vijay, Frontend Developer"
      style={{
        position: "relative", width: "100%", minHeight: "100dvh",
        background: C.bgCanvas, display: "flex", alignItems: "center", overflow: "hidden",
      }}
    >
      {/* Particle canvas */}
      <ParticleCanvas isMobile={isMobile} rm={rm} />

      {/* Overlays */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${ha(C.cyan,0.038)} 1px,transparent 1px),linear-gradient(90deg,${ha(C.cyan,0.038)} 1px,transparent 1px)`, backgroundSize: "52px 52px", maskImage: "radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%)", animation: "gridPulse 7s ease-in-out infinite", pointerEvents: "none", zIndex: 2 }} />
      {!rm && <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${ha(C.cyan,0.16)} 50%,transparent)`, animation: "scanLine 9s linear infinite", zIndex: 5, pointerEvents: "none" }} />}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, ${ha(C.bgCanvas,0.92)} 100%)`, pointerEvents: "none", zIndex: 7 }} />

      {/* Content grid */}
      <div style={{
        position: "relative", zIndex: 10, width: "100%", maxWidth: 1240, margin: "0 auto",
        padding: "clamp(5rem,10vh,7rem) clamp(1.25rem,5vw,4rem) clamp(3rem,8vh,5rem)",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
        gap: "clamp(2rem,4vw,4rem)", alignItems: "center",
      }}>
        {/* LEFT: Copy */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Available badge */}
          <Reveal vis={vis} rm={rm} delay={0} style={{ marginBottom: 24 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 9999, background: ha(C.green, 0.08), border: `1px solid ${ha(C.green, 0.22)}` }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, boxShadow: `0 0 7px ${C.green}`, animation: "pulseDot 2.5s ease-in-out infinite", flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.08em", color: C.green }}>OPEN TO OPPORTUNITIES</span>
            </div>
          </Reveal>

          {/* Eyebrow */}
          <Reveal vis={vis} rm={rm} delay={80} style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.20em", color: C.textDim }}>{"// portfolio · 2024"}</span>
          </Reveal>

          {/* Hero name */}
          <Reveal vis={vis} rm={rm} delay={140} y={40}>
            <h1 style={{ fontSize: "clamp(3rem,8.5vw,8rem)", fontFamily: "monospace", fontWeight: 800, lineHeight: 0.93, letterSpacing: "-0.04em", margin: "0 0 4px" }}>
              <span style={{ display: "inline-block", background: `linear-gradient(160deg,${C.textPrimary} 0%,${ha(C.textPrimary,0.65)} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Kamani
              </span>
              <br />
              <span style={{ display: "inline-block", color: C.cyan, WebkitTextFillColor: C.cyan, animation: "heroGlow 4s ease-in-out infinite" }}>
                Vijay.
              </span>
            </h1>
          </Reveal>

          {/* Role cycler */}
          <Reveal vis={vis} rm={rm} delay={220} style={{ marginTop: 20, marginBottom: 26, fontSize: "clamp(0.95rem,1.7vw,1.25rem)", color: C.textMuted, letterSpacing: "-0.01em", minHeight: "2em", display: "flex", alignItems: "center" }}>
            <RoleCycler />
          </Reveal>

          {/* Description */}
          <Reveal vis={vis} rm={rm} delay={300}>
            <p style={{ fontSize: "clamp(0.85rem,1.1vw,1rem)", color: C.textMuted, lineHeight: 1.8, maxWidth: 510, letterSpacing: "-0.005em", marginBottom: 36 }}>
              <span style={{ color: C.textPrimary }}>Engineering cinematic digital experiences</span>
              {" "}through code, motion, and creativity.
              Frontend developer focused on immersive UI, performance-focused web applications, animation systems, and{" "}
              <span style={{ color: C.cyan }}>intelligent digital experiences.</span>
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal vis={vis} rm={rm} delay={380} style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 40 }}>
            <ActionBtn
              primary accent={C.cyan}
              href="#projects" label="View Projects"
              icon={
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6H10M10 6L6.5 2.5M10 6L6.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
            <ActionBtn href="#contact" label="Get in Touch" />
          </Reveal>

          {/* Tech stack */}
          <Reveal vis={vis} rm={rm} delay={460}>
            <div style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: "0.16em", color: C.textDim, textTransform: "uppercase", marginBottom: 9 }}>Tech Stack</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {TECH_STACK.map((t) => <TechTag key={t} label={t} accent={C.cyan} />)}
            </div>
          </Reveal>
        </div>

        {/* RIGHT: Profile card (desktop) */}
        {!isMobile && (
          <Reveal vis={vis} rm={rm} delay={540} x={20} y={0}>
            <HeroCard />
          </Reveal>
        )}
      </div>

      {/* Corner brackets */}
      {[
        { top: 18, left: 18 },
        { top: 18, right: 18, transform: "rotate(90deg)" },
        { bottom: 18, left: 18, transform: "rotate(-90deg)" },
        { bottom: 18, right: 18, transform: "rotate(180deg)" },
      ].map((pos, i) => (
        <div key={i} aria-hidden="true" style={{
          position: "absolute", ...pos,
          width: 16, height: 16,
          borderTop: `1.5px solid ${ha(C.cyan, 0.22)}`,
          borderLeft: `1.5px solid ${ha(C.cyan, 0.22)}`,
          zIndex: 14, pointerEvents: "none",
        }} />
      ))}

      <ScrollIndicator />

      {/* Bottom fade */}
      <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, background: `linear-gradient(to bottom, transparent, ${C.bgCanvas})`, pointerEvents: "none", zIndex: 11 }} />
    </section>
  );
}
