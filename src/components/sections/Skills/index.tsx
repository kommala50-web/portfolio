"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useInView, useReducedMotion, useMediaQuery } from "@/hooks";
import { ha } from "@/lib/utils";
import { DUR, EASE } from "@/lib/tokens";
import { SKILL_CATEGORIES, NET_NODES, NET_EDGES } from "@/data/skills";
import { Reveal, SectionLabel, TechTag, SectionBg } from "@/components/ui";

const CAT_COLOR_MAP: Record<string, string> = {
  frontend: "cyan", backend: "violet",
  database: "amber", devops: "green", design: "pink",
};

// ─── NEURAL NETWORK CANVAS ────────────────────────────────────────────────────
function NeuralCanvas({
  activeCat, hoveredNode, onHover, onNodeClick, vis,
}: {
  activeCat: string | null;
  hoveredNode: string | null;
  onHover: (id: string | null) => void;
  onNodeClick: (cat: string) => void;
  vis: boolean;
}) {
  const { C } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const rm = useReducedMotion();

  // Colour lookup using current theme
  const getColor = useCallback((cat: string): string => {
    const key = CAT_COLOR_MAP[cat] as keyof typeof C | undefined;
    return key ? (C[key] as string) : C.cyan;
  }, [C]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !vis) return;
    const ctx = canvas.getContext("2d")!;
    const DPR = Math.min(window.devicePixelRatio, 1.5);

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * DPR;
      canvas.height = canvas.offsetHeight * DPR;
      ctx.scale(DPR, DPR);
    };
    resize();
    window.addEventListener("resize", resize);

    const toRgba = (hex: string, a: number) => ha(hex, a);

    let t = 0;
    const draw = () => {
      t += rm ? 0 : 0.006;
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      if (!W || !H) { animRef.current = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, W, H);

      // ── Edges ──────────────────────────────────────────────────────────────
      NET_EDGES.forEach(([aId, bId]) => {
        const a = NET_NODES.find((n) => n.id === aId);
        const b = NET_NODES.find((n) => n.id === bId);
        if (!a || !b) return;
        const ax = a.x * W, ay = a.y * H, bx = b.x * W, by = b.y * H;
        const aCatOk = !activeCat || a.cat === activeCat;
        const bCatOk = !activeCat || b.cat === activeCat;
        const active = aCatOk && bCatOk;
        const isHov  = hoveredNode === a.id || hoveredNode === b.id;
        const alpha  = active ? (isHov ? 0.65 : activeCat ? 0.32 : 0.16) : 0.04;
        if (alpha < 0.01) return;

        // Travelling pulse
        if (active && !rm) {
          const pT = (t * 0.4) % 1;
          const px = ax + (bx - ax) * pT, py = ay + (by - ay) * pT;
          const gp = ctx.createRadialGradient(px, py, 0, px, py, 5);
          gp.addColorStop(0, toRgba(getColor(a.cat), 0.8));
          gp.addColorStop(1, toRgba(getColor(a.cat), 0));
          ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fillStyle = gp; ctx.fill();
        }

        const grad = ctx.createLinearGradient(ax, ay, bx, by);
        grad.addColorStop(0, toRgba(getColor(a.cat), alpha));
        grad.addColorStop(1, toRgba(getColor(b.cat), alpha));
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
        ctx.strokeStyle = grad;
        ctx.lineWidth = isHov ? 1.5 : active ? 0.9 : 0.4;
        ctx.stroke();
      });

      // ── Nodes ──────────────────────────────────────────────────────────────
      NET_NODES.forEach((node) => {
        const nx = node.x * W, ny = node.y * H;
        const catMatch = !activeCat || node.cat === activeCat;
        const isHov    = hoveredNode === node.id;

        if (!catMatch && !isHov) {
          ctx.beginPath(); ctx.arc(nx, ny, node.r * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = toRgba(C.textDim, 0.15); ctx.fill();
          return;
        }

        const pulse = rm ? 1 : 1 + Math.sin(t * 1.2 + node.x * 6) * 0.04;
        const r     = node.r * pulse * (isHov ? 1.3 : 1);
        const nc    = getColor(node.cat);

        const glow = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * (isHov ? 3.5 : 2.5));
        glow.addColorStop(0, toRgba(nc, isHov ? 0.35 : 0.15));
        glow.addColorStop(1, toRgba(nc, 0));
        ctx.beginPath(); ctx.arc(nx, ny, r * (isHov ? 3.5 : 2.5), 0, Math.PI * 2);
        ctx.fillStyle = glow; ctx.fill();

        ctx.beginPath(); ctx.arc(nx, ny, r, 0, Math.PI * 2);
        ctx.strokeStyle = toRgba(nc, isHov ? 0.9 : 0.55);
        ctx.lineWidth = isHov ? 2 : 1.2; ctx.stroke();

        const inner = ctx.createRadialGradient(nx - r * 0.25, ny - r * 0.25, 0, nx, ny, r);
        inner.addColorStop(0, toRgba(nc, isHov ? 0.35 : 0.12));
        inner.addColorStop(1, toRgba(nc, 0));
        ctx.beginPath(); ctx.arc(nx, ny, r - 1, 0, Math.PI * 2);
        ctx.fillStyle = inner; ctx.fill();

        const fs = Math.max(8, Math.min(r * 0.55, 12));
        ctx.font = `${isHov ? 600 : 500} ${fs}px 'JetBrains Mono',monospace`;
        ctx.fillStyle = isHov ? nc : toRgba(nc, 0.85);
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        if (isHov) { ctx.shadowColor = nc; ctx.shadowBlur = 8; }
        ctx.fillText(node.label, nx, ny);
        ctx.shadowBlur = 0;
      });

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [activeCat, hoveredNode, vis, rm, getColor, C]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return;
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    const W = r.width, H = r.height;
    let hit: string | null = null;
    for (const node of NET_NODES) {
      const dx = mx - node.x * W, dy = my - node.y * H;
      if (Math.sqrt(dx * dx + dy * dy) < node.r + 8) { hit = node.id; break; }
    }
    onHover(hit);
  }, [onHover]);

  const onClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return;
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    const W = r.width, H = r.height;
    for (const node of NET_NODES) {
      const dx = mx - node.x * W, dy = my - node.y * H;
      if (Math.sqrt(dx * dx + dy * dy) < node.r + 8) { onNodeClick(node.cat); return; }
    }
  }, [onNodeClick]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={onMouseMove}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      aria-label="Interactive neural network skill visualization"
      role="img"
      style={{ width: "100%", height: "100%", display: "block", cursor: hoveredNode ? "pointer" : "default" }}
    />
  );
}

// ─── SKILL BAR ────────────────────────────────────────────────────────────────
function SkillBar({ name, level, years, color, delay, vis, active }: {
  name: string; level: number; years: string; color: string;
  delay: number; vis: boolean; active: boolean;
}) {
  const { C } = useTheme();
  const rm = useReducedMotion();
  return (
    <div style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(-10px)", transition: rm ? "none" : `all 480ms cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 10, fontFamily: "monospace", color: active ? C.textSecondary : C.textMuted, fontWeight: active ? 600 : 400, transition: "all 280ms" }}>{name}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 8, fontFamily: "monospace", color: C.textDim, letterSpacing: "0.08em" }}>{years}</span>
          <span style={{ fontSize: 9, fontFamily: "monospace", color: vis ? color : "transparent", transition: rm ? "none" : `color 400ms ${delay + 700}ms`, textShadow: active ? `0 0 8px ${color}` : "none" }}>{level}%</span>
        </div>
      </div>
      <div style={{ height: 2, borderRadius: 2, background: ha(C.textPrimary, 0.05), overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: vis ? `${level}%` : "0%", borderRadius: 2, background: `linear-gradient(90deg,${ha(color,0.6)},${color})`, boxShadow: active ? `0 0 8px ${ha(color,0.5)}` : "none", transition: rm ? "none" : `width 850ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, box-shadow 280ms` }} />
      </div>
    </div>
  );
}

// ─── SKILLS SECTION ───────────────────────────────────────────────────────────
export function SkillsSection() {
  const { C } = useTheme();
  const [ref,     vis]     = useInView(0.05);
  const [gridRef, gridVis] = useInView(0.05);
  const [activeCat,    setActiveCat]    = useState<string | null>(null);
  const [hoveredNode,  setHoveredNode]  = useState<string | null>(null);
  const rm = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 900px)");

  const handleCatClick = useCallback((id: string) => {
    setActiveCat((prev) => (prev === id ? null : id));
  }, []);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="skills"
      aria-label="Skills"
      style={{ position: "relative", overflow: "hidden", padding: "clamp(5rem,10vh,8rem) 0", background: C.bgBase }}
    >
      <SectionBg accent={C.cyan} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", padding: "0 clamp(1.25rem,5vw,4rem)" }}>
        <SectionLabel index={2} label="Skills" vis={vis} rm={rm} />

        <Reveal vis={vis} rm={rm} delay={80} style={{ marginBottom: "clamp(2rem,4vh,3.5rem)" }}>
          <h2 style={{ fontSize: "clamp(2rem,5vw,4.2rem)", fontFamily: "monospace", fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 14px", lineHeight: 0.96, color: C.textPrimary }}>
            The stack I<br />
            <span style={{ color: C.cyan, textShadow: `0 0 30px ${ha(C.cyan,0.30)}` }}>trust to ship.</span>
          </h2>
          <p style={{ fontSize: "clamp(0.86rem,1.1vw,1rem)", color: C.textMuted, lineHeight: 1.75, maxWidth: 500 }}>
            Tools I&apos;ve used in production. Click a node or category to explore.
          </p>
        </Reveal>

        {/* Category filter tabs */}
        <Reveal vis={vis} rm={rm} delay={160} style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: "clamp(2rem,4vh,3.5rem)" }}>
          {SKILL_CATEGORIES.map((cat) => {
            const isActive = activeCat === cat.id;
            const color = C[cat.colorKey as keyof typeof C] as string;
            return (
              <button
                key={cat.id}
                onClick={() => handleCatClick(cat.id)}
                aria-pressed={isActive}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "8px 16px", borderRadius: 9,
                  border: `1px solid ${isActive ? ha(color, 0.50) : C.border}`,
                  background: isActive ? ha(color, 0.12) : "transparent",
                  color: isActive ? color : C.textMuted,
                  fontSize: 10, fontFamily: "monospace", fontWeight: isActive ? 600 : 400,
                  letterSpacing: "0.06em", cursor: "pointer", outline: "none",
                  boxShadow: isActive ? `0 0 16px ${ha(color, 0.18)}` : "none",
                  transition: `all ${DUR.normal}ms`, userSelect: "none",
                }}
              >
                <span style={{ textShadow: isActive ? `0 0 8px ${color}` : "none" }}>{cat.icon}</span>
                {cat.label}
                {isActive && <span style={{ width: 4, height: 4, borderRadius: "50%", background: color, boxShadow: `0 0 5px ${color}` }} />}
              </button>
            );
          })}
          {activeCat && (
            <button onClick={() => setActiveCat(null)} style={{ padding: "8px 14px", borderRadius: 9, border: `1px solid ${C.border}`, background: "transparent", color: C.textDim, fontSize: 9, fontFamily: "monospace", letterSpacing: "0.08em", cursor: "pointer", outline: "none" }}>
              ✕ CLEAR
            </button>
          )}
        </Reveal>

        {/* Canvas + panels */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr clamp(260px,36%,400px)", gap: "clamp(2rem,4vw,4rem)", alignItems: "start" }}>
          {/* Neural canvas */}
          <div>
            <div style={{
              position: "relative", borderRadius: 18, overflow: "hidden",
              border: `1px solid ${activeCat ? ha(C[CAT_COLOR_MAP[activeCat] as keyof typeof C] as string, 0.32) : C.border}`,
              background: `linear-gradient(160deg,${C.bgSurface},${C.bgCanvas})`,
              height: isMobile ? 300 : "clamp(380px,50vh,560px)",
              boxShadow: "0 4px 32px rgba(0,0,0,0.5)",
              transition: `border-color 400ms`,
            }}>
              <NeuralCanvas
                activeCat={activeCat}
                hoveredNode={hoveredNode}
                onHover={setHoveredNode}
                onNodeClick={handleCatClick}
                vis={vis}
              />
              {/* Hover tooltip */}
              {hoveredNode && (() => {
                const node = NET_NODES.find((n) => n.id === hoveredNode);
                const cat  = SKILL_CATEGORIES.find((c) => c.id === node?.cat);
                if (!node) return null;
                const color = C[CAT_COLOR_MAP[node.cat] as keyof typeof C] as string;
                return (
                  <div style={{ position: "absolute", top: 12, left: 12, background: C.bgGlass, backdropFilter: "blur(16px)", border: `1px solid ${ha(color,0.42)}`, borderRadius: 10, padding: "9px 13px", pointerEvents: "none", zIndex: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 7px ${color}` }} />
                      <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700, color: C.textPrimary }}>{node.label}</span>
                    </div>
                    <span style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.10em", color, textTransform: "uppercase" }}>{cat?.label}</span>
                  </div>
                );
              })()}
              {/* Inner vignette */}
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 100% 100% at 50% 50%,transparent 55%,${ha(C.bgCanvas,0.7)} 100%)`, borderRadius: 18, pointerEvents: "none" }} />
            </div>
            <p style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: "0.10em", color: C.textDim, textAlign: "center", marginTop: 9 }}>
              {hoveredNode
                ? `↑ ${NET_NODES.find((n) => n.id === hoveredNode)?.label} — click to filter`
                : "hover nodes · click to filter · arrows show dependencies"}
            </p>
          </div>

          {/* Skill panels */}
          <div ref={gridRef as React.RefObject<HTMLDivElement>} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SKILL_CATEGORIES.map((cat) => {
              const show  = !activeCat || activeCat === cat.id;
              const color = C[cat.colorKey as keyof typeof C] as string;
              return (
                <div key={cat.id} style={{ opacity: show ? 1 : 0.26, transform: show ? "none" : "scale(0.98)", transition: `all 280ms` }}>
                  <div style={{
                    padding: "18px 18px", borderRadius: 13,
                    border: `1px solid ${show && activeCat ? ha(color, 0.42) : C.border}`,
                    borderTop: `2px solid ${show && activeCat ? color : ha(color, 0.22)}`,
                    background: show && activeCat
                      ? `linear-gradient(160deg,${ha(color,0.06)} 0%,${C.bgSurface} 60%)`
                      : C.bgSurface,
                    transition: "all 280ms",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ fontSize: 14, color: show && activeCat ? color : C.textDim, transition: "color 280ms" }}>{cat.icon}</span>
                        <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.08em", color: show && activeCat ? C.textPrimary : C.textMuted, textTransform: "uppercase", transition: "color 280ms" }}>{cat.label}</span>
                      </div>
                      <span style={{ fontSize: 8, fontFamily: "monospace", padding: "2px 7px", borderRadius: 9999, background: ha(color, 0.12), border: `1px solid ${ha(color,0.28)}`, color }}>{cat.skills.length}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                      {cat.skills.map((sk, i) => (
                        <SkillBar
                          key={sk.name}
                          name={sk.name} level={sk.level} years={sk.years}
                          color={color} delay={i * 70}
                          vis={gridVis} active={!!(show && activeCat)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Footnote */}
            <div style={{ padding: "11px 14px", borderRadius: 10, background: ha(C.textPrimary, 0.02), border: `1px solid ${C.border}`, opacity: gridVis ? 1 : 0, transition: rm ? "none" : `opacity 600ms cubic-bezier(0.16,1,0.3,1) 600ms` }}>
              <p style={{ fontSize: 10, fontFamily: "monospace", color: C.textMuted, margin: 0, lineHeight: 1.6 }}>
                ⚡ Skill levels reflect real project usage — not tutorial completions. Always learning, never satisfied.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
