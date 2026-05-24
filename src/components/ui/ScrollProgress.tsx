"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { useScrollProgress } from "@/hooks";
import { ha } from "@/lib/utils";

/**
 * ScrollProgress — 2px gradient bar fixed at the very top of the page.
 * Shows how far the user has scrolled (0 → 100%).
 * Color: violet → cyan (matches the portfolio accent system).
 */
export function ScrollProgress() {
  const { C }  = useTheme();
  const pct    = useScrollProgress();

  return (
    <div
      aria-hidden="true"
      style={{
        position:      "fixed",
        top:           0,
        left:          0,
        right:         0,
        height:        2,
        zIndex:        9998,
        pointerEvents: "none",
        overflow:      "hidden",
      }}
    >
      <div
        style={{
          height:       "100%",
          width:        `${pct}%`,
          background:   `linear-gradient(90deg, ${C.violet}, ${C.cyan})`,
          boxShadow:    `0 0 8px ${ha(C.cyan, 0.6)}`,
          borderRadius: "0 2px 2px 0",
          transition:   "width 80ms linear",
        }}
      />
    </div>
  );
}
