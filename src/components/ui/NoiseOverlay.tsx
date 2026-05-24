import { memo } from "react";

/**
 * NoiseOverlay — film grain texture fixed over the entire page.
 * memo'd so it never re-renders regardless of theme or scroll changes.
 * Opacity is intentionally very low (0.022) — visible but never distracting.
 */
export const NoiseOverlay = memo(function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position:      "fixed",
        inset:         0,
        zIndex:        9990,
        pointerEvents: "none",
        opacity:       0.022,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
});
