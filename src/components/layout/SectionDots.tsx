"use client";
// ─────────────────────────────────────────────────────────────────────────────
// SectionDots.tsx — fixed right-side section position indicator
// LoadingScreen.tsx — cinematic loading intro
// Both exported from this file for simplicity.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useReducedMotion } from "@/hooks";
import { ha } from "@/lib/utils";
import { DUR, EASE, NAV_ITEMS } from "@/lib/tokens";

// ─── SECTION DOTS ─────────────────────────────────────────────────────────────
interface SectionDotsProps {
  activeSection: string;
  scrolled:      boolean;
}

export function SectionDots({ activeSection, scrolled }: SectionDotsProps) {
  const { C } = useTheme();
  const [hovered, setHovered] = useState<string | null>(null);

  if (!scrolled) return null;

  return (
    <nav
      aria-label="Section navigation"
      style={{
        position:  "fixed",
        right:     18,
        top:       "50%",
        transform: "translateY(-50%)",
        display:   "flex",
        flexDirection: "column",
        gap:       9,
        zIndex:    900,
      }}
    >
      {NAV_ITEMS.map((s) => {
        const isActive = activeSection === s.id;
        const isHov    = hovered === s.id;
        return (
          <div
            key={s.id}
            style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 7 }}
          >
            {isHov && (
              <span style={{
                fontSize: 8, fontFamily: "monospace", letterSpacing: "0.10em",
                color: C.cyan, textTransform: "uppercase", whiteSpace: "nowrap",
                background: ha(C.bgBase, 0.90),
                border: `1px solid ${ha(C.cyan, 0.25)}`,
                padding: "2px 7px", borderRadius: 4,
                animation: "tooltipFade 150ms ease-out",
              }}>
                {s.label}
              </span>
            )}
            <a
              href={`#${s.id}`}
              aria-label={`Navigate to ${s.label}`}
              aria-current={isActive ? "true" : undefined}
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display:      "block",
                width:        isActive ? 3 : 2,
                height:       isActive ? 22 : 7,
                borderRadius: 2,
                background:   isActive ? C.cyan : isHov ? C.textMuted : C.textDim,
                boxShadow:    isActive ? `0 0 8px ${C.cyan}` : "none",
                transition:   `all 350ms ${EASE.spring}`,
                cursor:       "pointer",
                textDecoration: "none",
                flexShrink:   0,
              }}
            />
          </div>
        );
      })}
    </nav>
  );
}

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────
const LOAD_PHRASES = [
  "initializing renderer",
  "loading assets",
  "building scene",
  "almost ready",
];

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { C } = useTheme();
  const [pct,  setPct]  = useState(0);
  const [pi,   setPi]   = useState(0);
  const [exiting, setExiting] = useState(false);
  const rm = useReducedMotion();

  useEffect(() => {
    if (rm) { setTimeout(onComplete, 200); return; }

    const steps = [0, 18, 35, 55, 72, 88, 96, 100];
    let i = 0;

    const go = () => {
      if (i >= steps.length) {
        setExiting(true);
        setTimeout(onComplete, 550);
        return;
      }
      setPct(steps[i]!);
      if (i < LOAD_PHRASES.length) setPi(i);
      i++;
      setTimeout(go, i < 5 ? 160 : i < 7 ? 110 : 70);
    };

    const id = setTimeout(go, 200);
    return () => clearTimeout(id);
  }, [rm, onComplete]);

  const corners = [
    { top: 20, left: 20, transform: "none" },
    { top: 20, right: 20, transform: "rotate(90deg)" },
    { bottom: 20, left: 20, transform: "rotate(-90deg)" },
    { bottom: 20, right: 20, transform: "rotate(180deg)" },
  ];

  return (
    <div style={{
      position:   "fixed",
      inset:      0,
      zIndex:     10000,
      background: "#04040A",
      display:    "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap:        28,
      opacity:    exiting ? 0 : 1,
      transition: rm ? "none" : `opacity 550ms ${EASE.smooth}`,
      pointerEvents: exiting ? "none" : "auto",
    }}>
      {/* Logo */}
      <div style={{
        opacity:   pct > 10 ? 1 : 0,
        transform: pct > 10 ? "translateY(0)" : "translateY(10px)",
        transition: rm ? "none" : `all 450ms ${EASE.spring}`,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "1px dashed rgba(27,228,255,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", animation: "spinSlow 8s linear infinite",
        }}>
          <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700, color: "#1BE4FF", letterSpacing: "-0.04em", position: "relative", zIndex: 1, animation: "spinSlow 8s linear infinite reverse" }}>KV</span>
          <span style={{ position: "absolute", top: "6%", left: "50%", transform: "translate(-50%,-50%)", width: 5, height: 5, borderRadius: "50%", background: "#1BE4FF", boxShadow: "0 0 8px #1BE4FF" }} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 700, color: "#EEEEFF", letterSpacing: "-0.02em" }}>Kamani Vijay</div>
          <div style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: "0.16em", color: "#3A3A5A" }}>PORTFOLIO · 2025</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ width: "min(260px,60vw)", display: "flex", flexDirection: "column", gap: 9 }}>
        <div style={{ height: 1, background: "rgba(255,255,255,0.05)", borderRadius: 1, overflow: "hidden", position: "relative" }}>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: `${pct}%`,
            background: "linear-gradient(90deg, #7C3AED, #1BE4FF)",
            boxShadow: "0 0 8px rgba(27,228,255,0.6)",
            borderRadius: 1,
            transition: rm ? "none" : `width 180ms ${EASE.smooth}`,
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: "0.10em", color: "#6A6A8A", textTransform: "uppercase" }}>
            {LOAD_PHRASES[pi] ?? "ready"}
          </span>
          <span style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: "0.08em", color: "#1BE4FF" }}>
            {String(Math.round(pct)).padStart(3, "0")}%
          </span>
        </div>
      </div>

      {/* Corner brackets */}
      {corners.map((pos, i) => (
        <div key={i} aria-hidden="true" style={{
          position:    "absolute",
          width:       16,
          height:      16,
          border:      "1.5px solid rgba(27,228,255,0.18)",
          borderRight: "none",
          borderBottom: "none",
          pointerEvents: "none",
          ...pos,
        }} />
      ))}
    </div>
  );
}
