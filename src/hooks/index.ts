"use client";

import {
  useState, useEffect, useRef, useCallback, useMemo,
} from "react";

// ─── useReducedMotion ─────────────────────────────────────────────────────────
export function useReducedMotion(): boolean {
  const [rm, setRm] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setRm(mq.matches);
    const cb = (e: MediaQueryListEvent) => setRm(e.matches);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  }, []);
  return rm;
}

// ─── useInView ────────────────────────────────────────────────────────────────
// Fires once when element enters viewport. Disconnects after trigger.
export function useInView(threshold = 0.10): [React.RefObject<HTMLElement>, boolean] {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

// ─── useMediaQuery ────────────────────────────────────────────────────────────
export function useMediaQuery(query: string): boolean {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatch(mq.matches);
    const cb = (e: MediaQueryListEvent) => setMatch(e.matches);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  }, [query]);
  return match;
}

// ─── useMagnetic ─────────────────────────────────────────────────────────────
interface MagneticResult {
  ref: React.RefObject<HTMLElement>;
  handlers: {
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseLeave: () => void;
  };
  style: React.CSSProperties;
}

export function useMagnetic(strength = 0.30): MagneticResult {
  const ref = useRef<HTMLElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos({
      x: (e.clientX - (r.left + r.width  / 2)) * strength,
      y: (e.clientY - (r.top  + r.height / 2)) * strength,
    });
  }, [strength]);

  const onMouseLeave = useCallback(() => setPos({ x: 0, y: 0 }), []);

  const style = useMemo<React.CSSProperties>(() => ({
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    transition: pos.x === 0 && pos.y === 0
      ? "transform 400ms cubic-bezier(0.16,1,0.3,1)"
      : "none",
    willChange: "transform",
  }), [pos.x, pos.y]);

  return { ref, handlers: { onMouseMove, onMouseLeave }, style };
}

// ─── useScrollSpy ─────────────────────────────────────────────────────────────
// Tracks which section is currently in viewport, offset by 35% from top.
export function useScrollSpy(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const update = () => {
      const mid = window.scrollY + window.innerHeight * 0.35;
      let best = ids[0] ?? "";
      let bestDist = Infinity;
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const dist = Math.abs(
          el.getBoundingClientRect().top + window.scrollY + el.offsetHeight * 0.15 - mid
        );
        if (dist < bestDist) { bestDist = dist; best = id; }
      });
      setActive(best);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [ids]);

  return active;
}

// ─── useScrollProgress ───────────────────────────────────────────────────────
// Returns scroll progress 0–100 as percentage.
export function useScrollProgress(): number {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return pct;
}

// ─── useTilt ──────────────────────────────────────────────────────────────────
// 3D tilt tracking for cards. Returns tilt {x,y} and event handlers.
interface TiltResult {
  tilt: { x: number; y: number };
  handlers: {
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseLeave: () => void;
  };
}

export function useTilt(maxAngle = 5, disabled = false): TiltResult {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTilt({
      x: ((e.clientY - (r.top  + r.height / 2)) / (r.height / 2)) * -maxAngle,
      y: ((e.clientX - (r.left + r.width  / 2)) / (r.width  / 2)) *  maxAngle,
    });
  }, [maxAngle, disabled]);

  const onMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  return { tilt, handlers: { onMouseMove, onMouseLeave } };
}
