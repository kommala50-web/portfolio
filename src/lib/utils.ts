// ─── UTILITY FUNCTIONS ────────────────────────────────────────────────────────

/** Convert hex color + alpha to rgba string */
export function ha(hex: string, alpha: number): string {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  if (hex.startsWith("rgba") || hex.startsWith("rgb")) return hex;
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Clamp a value between min and max */
export const clamp = (val: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, val));

/** Linear interpolation */
export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

/** Debounce — use for resize handlers */
export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms = 200) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/** Pad number with leading zeros */
export const zeroPad = (n: number, digits = 2): string =>
  String(n).padStart(digits, "0");
