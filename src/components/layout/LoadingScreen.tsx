"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { EASE, THEMES } from "@/lib/tokens";

// ─── TYPES ─────────────────────────────────────────────────────────────────────
interface LoadingScreenProps {
  onComplete: () => void;
  /** Duration in ms before auto-completing. Default: 2400 */
  duration?: number;
}

// ─── LOADING SCREEN ──────────────────────────────────────────────────────────
export function LoadingScreen({ onComplete, duration = 2400 }: LoadingScreenProps) {
  // Use dark theme colors directly so loading screen always looks right
  // regardless of user's persisted theme preference
  const C = THEMES.dark;

  const [progress,  setProgress]  = useState(0);
  const [exiting,   setExiting]   = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const rafRef      = useRef<number | null>(null);
  const startRef    = useRef<number | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadingTexts = [
    "INITIALISING",
    "LOADING ASSETS",
    "BUILDING CANVAS",
    "READY",
  ];

  // ── Smooth progress animation ──────────────────────────────────────────────
  useEffect(() => {
    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const raw = Math.min(elapsed / duration, 1);
      // Ease-out cubic so progress feels snappy early and slows near 100 %
      const eased = 1 - Math.pow(1 - raw, 3);
      setProgress(Math.round(eased * 100));
      setTextIndex(Math.min(Math.floor(eased * loadingTexts.length), loadingTexts.length - 1));

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Progress done → play exit animation then call onComplete
        setExiting(true);
        exitTimerRef.current = setTimeout(onComplete, 700);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current)    cancelAnimationFrame(rafRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      aria-live="polite"
      aria-label="Loading portfolio"
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         99999,
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        background:     C.bgCanvas,
        opacity:        exiting ? 0 : 1,
        transform:      exiting ? "scale(1.03)" : "scale(1)",
        transition:     exiting
          ? `opacity 650ms ${EASE.smooth}, transform 650ms ${EASE.smooth}`
          : "none",
        overflow:       "hidden",
      }}
    >
      {/* ── Ambient glow blobs ──────────────────────────────────────────────── */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
      }}>
        <div style={{
          position: "absolute",
          top: "20%", left: "15%",
          width: 420, height: 420,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.violet}28 0%, transparent 70%)`,
          animation: "lsBlobA 6s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute",
          bottom: "18%", right: "12%",
          width: 340, height: 340,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.cyan}20 0%, transparent 70%)`,
          animation: "lsBlobB 8s ease-in-out infinite",
        }} />
      </div>

      {/* ── Scanlines ───────────────────────────────────────────────────────── */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(255,255,255,0.012) 2px,
          rgba(255,255,255,0.012) 4px
        )`,
      }} />

      {/* ── Logo mark ───────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", marginBottom: 44 }}>
        {/* Outer spinning ring */}
        <div style={{
          width: 88, height: 88, borderRadius: "50%",
          border: `1px dashed ${C.cyan}55`,
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "lsSpin 10s linear infinite",
        }}>
          {/* Orbit dot */}
          <span style={{
            position: "absolute", top: 3, left: "50%",
            transform: "translateX(-50%)",
            width: 6, height: 6, borderRadius: "50%",
            background: C.cyan,
            boxShadow: `0 0 10px ${C.cyan}, 0 0 20px ${C.cyan}80`,
          }} />
        </div>

        {/* Inner static ring */}
        <div style={{
          position: "absolute", inset: 10,
          borderRadius: "50%",
          border: `1px solid ${C.bgElevated}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* Monogram */}
          <span style={{
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: "-0.04em",
            color: C.textPrimary,
            userSelect: "none",
          }}>
            VK
          </span>
        </div>

        {/* Cyan glow halo */}
        <div style={{
          position: "absolute", inset: -16,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.cyan}15 0%, transparent 65%)`,
          pointerEvents: "none",
        }} />
      </div>

      {/* ── Status text ─────────────────────────────────────────────────────── */}
      <div style={{
        fontFamily:    "monospace",
        fontSize:      10,
        fontWeight:    700,
        letterSpacing: "0.22em",
        color:         C.cyan,
        textTransform: "uppercase",
        marginBottom:  20,
        height:        14,
        overflow:      "hidden",
        position:      "relative",
      }}>
        <span style={{
          display:    "inline-block",
          animation:  "lsTextPulse 1.2s ease-in-out infinite",
        }}>
          {loadingTexts[textIndex]}
        </span>
      </div>

      {/* ── Progress bar ────────────────────────────────────────────────────── */}
      <div style={{
        width:        280,
        height:       2,
        borderRadius: 2,
        background:   C.bgElevated,
        overflow:     "hidden",
        marginBottom: 14,
      }}>
        <div style={{
          height:     "100%",
          width:      `${progress}%`,
          background: `linear-gradient(90deg, ${C.violet}, ${C.cyan})`,
          boxShadow:  `0 0 8px ${C.cyan}80`,
          borderRadius: "0 2px 2px 0",
          transition: "width 60ms linear",
        }} />
      </div>

      {/* ── Counter ─────────────────────────────────────────────────────────── */}
      <div style={{
        fontFamily:    "monospace",
        fontSize:      10,
        letterSpacing: "0.10em",
        color:         C.textMuted,
      }}>
        {String(progress).padStart(3, "0")}
        <span style={{ color: C.textDim }}> / 100</span>
      </div>

      {/* ── Keyframe styles ─────────────────────────────────────────────────── */}
      <style>{`
        @keyframes lsSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes lsBlobA {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(40px, -30px) scale(1.08); }
        }
        @keyframes lsBlobB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-30px, 20px) scale(1.06); }
        }
        @keyframes lsTextPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
      `}</style>
    </div>
  );
}
