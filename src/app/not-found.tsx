"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { ha } from "@/lib/utils";

export default function NotFound() {
  const { C } = useTheme();
  return (
    <div style={{
      minHeight: "100vh",
      background: C.bgCanvas,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 24,
      fontFamily: "monospace",
      padding: "2rem",
      textAlign: "center",
    }}>
      <div style={{
        fontSize: "clamp(6rem,20vw,14rem)",
        fontWeight: 800,
        letterSpacing: "-0.06em",
        color: "transparent",
        WebkitTextStroke: `1px ${ha(C.cyan, 0.25)}`,
        lineHeight: 1,
        userSelect: "none",
        animation: "floatGlyph 12s ease-in-out infinite",
      }}>404</div>

      <div>
        <div style={{ fontSize: 9, letterSpacing: "0.18em", color: C.cyan, textTransform: "uppercase", marginBottom: 12 }}>
          Page not found
        </div>
        <h1 style={{ fontSize: "clamp(1.25rem,3vw,2rem)", fontWeight: 800, letterSpacing: "-0.03em", color: C.textPrimary, margin: "0 0 12px" }}>
          You&apos;ve gone off the map.
        </h1>
        <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, maxWidth: 380, margin: "0 auto 24px" }}>
          This page doesn&apos;t exist. Head back to the portfolio.
        </p>
        <a href="/" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "11px 24px", borderRadius: 8,
          background: ha(C.cyan, 0.10),
          border: `1px solid ${ha(C.cyan, 0.30)}`,
          color: C.cyan,
          fontSize: 11, fontFamily: "monospace", fontWeight: 600, letterSpacing: "0.06em",
          textDecoration: "none",
          transition: "all 250ms cubic-bezier(0.16,1,0.3,1)",
        }}>
          ← Back to Portfolio
        </a>
      </div>
    </div>
  );
}
