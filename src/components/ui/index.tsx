"use client";

import { useState, useRef, useCallback, useMemo, memo } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useMagnetic, useReducedMotion, useScrollProgress } from "@/hooks";
import { ha } from "@/lib/utils";
import { DUR, EASE } from "@/lib/tokens";

// ─── REVEAL ───────────────────────────────────────────────────────────────────
// Unified entrance animation wrapper used by every section.
interface RevealProps {
  children:   React.ReactNode;
  vis:        boolean;
  rm?:        boolean;
  delay?:     number;
  x?:         number;
  y?:         number;
  style?:     React.CSSProperties;
  className?: string;
}

export function Reveal({ children, vis, rm = false, delay = 0, x = 0, y = 20, style = {}, className }: RevealProps) {
  return (
    <div
      className={className}
      style={{
        opacity:   vis ? 1 : 0,
        transform: vis ? "none" : `translate(${x}px, ${y}px)`,
        transition: rm
          ? "none"
          : `opacity ${DUR.cin}ms ${EASE.spring} ${delay}ms, transform ${DUR.cin}ms ${EASE.spring} ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
interface SectionLabelProps {
  index: number;
  label: string;
  vis:   boolean;
  rm?:   boolean;
}

export function SectionLabel({ index, label, vis, rm = false }: SectionLabelProps) {
  const { C } = useTheme();
  return (
    <Reveal vis={vis} rm={rm} y={12} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
      <span style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.18em", color: C.textDim }}>
        {String(index).padStart(2, "0")}
      </span>
      <div style={{ flex: 1, height: 1, background: C.border }} />
      <span style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: "0.18em", color: C.cyan, textTransform: "uppercase" }}>
        {label}
      </span>
    </Reveal>
  );
}

// ─── TECH TAG ────────────────────────────────────────────────────────────────
interface TechTagProps {
  label:    string;
  accent?:  string;
  compact?: boolean;
}

export function TechTag({ label, accent, compact = false }: TechTagProps) {
  const { C } = useTheme();
  const [h, setH] = useState(false);
  const a = accent || C.cyan;
  return (
    <span
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display:    "inline-block",
        padding:    compact ? "2px 7px" : "3px 9px",
        borderRadius: 4,
        fontSize:   compact ? 8 : 9,
        fontFamily: "monospace",
        letterSpacing: "0.05em",
        background: h ? ha(a, 0.12) : ha(C.textPrimary, 0.04),
        border:     `1px solid ${h ? ha(a, 0.35) : C.border}`,
        color:      h ? a : C.textMuted,
        transition: `all ${DUR.fast}ms ${EASE.spring}`,
        cursor:     "default",
        userSelect: "none",
      }}
    >
      {label}
    </span>
  );
}

// ─── ACTION BUTTON ────────────────────────────────────────────────────────────
interface ActionBtnProps {
  label:    string;
  href?:    string;
  primary?: boolean;
  accent?:  string;
  icon?:    React.ReactNode;
  onClick?: () => void;
}

export function ActionBtn({ label, href = "#", primary = false, accent, icon, onClick }: ActionBtnProps) {
  const { C } = useTheme();
  const mag = useMagnetic(0.28);
  const [h, setH] = useState(false);
  const a = accent || C.cyan;

  const baseStyle: React.CSSProperties = {
    position:   "relative",
    display:    "inline-flex",
    alignItems: "center",
    gap:        8,
    padding:    "11px 24px",
    borderRadius: 8,
    fontSize:   11,
    fontFamily: "monospace",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textDecoration: "none",
    cursor:     "pointer",
    overflow:   "hidden",
    ...mag.style,
    transform:  (mag.style.transform ?? "") + ` translateY(${h ? -2 : 0}px)`,
    transition: `background ${DUR.normal}ms, border-color ${DUR.normal}ms, box-shadow ${DUR.normal}ms, color ${DUR.normal}ms`,
    ...(primary ? {
      background: h ? ha(a, 0.18) : ha(a, 0.10),
      border:     `1px solid ${ha(a, h ? 0.55 : 0.28)}`,
      color:      a,
      boxShadow:  h ? `0 0 24px ${ha(a, 0.25)}, 0 6px 20px rgba(0,0,0,0.4)` : "none",
    } : {
      background: h ? ha(C.textPrimary, 0.05) : "transparent",
      border:     `1px solid ${h ? C.borderMid : C.border}`,
      color:      h ? C.textPrimary : C.textMuted,
    }),
  };

  return (
    <a
      ref={mag.ref as React.RefObject<HTMLAnchorElement>}
      href={href}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => { setH(false); mag.handlers.onMouseLeave(); }}
      onMouseMove={mag.handlers.onMouseMove}
      style={baseStyle}
    >
      {primary && (
        <span aria-hidden="true" style={{
          position:   "absolute",
          inset:      0,
          background: `linear-gradient(105deg, transparent 30%, ${ha(a, 0.13)} 50%, transparent 70%)`,
          transform:  h ? "translateX(100%)" : "translateX(-100%)",
          transition: `transform 580ms ${EASE.smooth}`,
        }} />
      )}
      <span style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
        {icon && icon}
        {label}
        <span style={{
          display:    "inline-block",
          transition: `transform ${DUR.normal}ms ${EASE.spring}`,
          transform:  h ? "translate(2px, -1px)" : "none",
        }}>↗</span>
      </span>
    </a>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
type StatusType = "shipped" | "live" | "beta";

const STATUS_META: Record<StatusType, { label: string; colorKey: "cyan" | "green" | "amber" }> = {
  shipped: { label: "Shipped", colorKey: "cyan"  },
  live:    { label: "Live",    colorKey: "green" },
  beta:    { label: "Beta",    colorKey: "amber" },
};

export function StatusBadge({ status }: { status: StatusType }) {
  const { C } = useTheme();
  const meta = STATUS_META[status];
  const color = C[meta.colorKey];
  return (
    <div style={{
      display:      "inline-flex",
      alignItems:   "center",
      gap:          5,
      padding:      "3px 9px",
      borderRadius: 9999,
      background:   ha(color, 0.09),
      border:       `1px solid ${ha(color, 0.28)}`,
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: "50%",
        background: color, boxShadow: `0 0 5px ${color}`,
        animation: "pulseDot 2.4s ease-in-out infinite",
        flexShrink: 0,
      }} />
      <span style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: "0.12em", color, fontWeight: 600, textTransform: "uppercase" }}>
        {meta.label}
      </span>
    </div>
  );
}

// ─── SECTION BACKGROUND ───────────────────────────────────────────────────────
// Consistent dot-grid + radial glow used by every section.
export function SectionBg({ accent }: { accent: string }) {
  const { C } = useTheme();
  return (
    <>
      {/* Dot matrix */}
      <div aria-hidden="true" style={{
        position:      "absolute",
        inset:         0,
        zIndex:        0,
        pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(128,128,180,0.06) 1px, transparent 1px)",
        backgroundSize: "38px 38px",
        maskImage:      "radial-gradient(ellipse 90% 80% at 50% 50%, black 5%, transparent 100%)",
        WebkitMaskImage:"radial-gradient(ellipse 90% 80% at 50% 50%, black 5%, transparent 100%)",
        opacity: 0.45,
      }} />
      {/* Ambient radials */}
      <div aria-hidden="true" style={{
        position:      "absolute",
        inset:         0,
        zIndex:        0,
        pointerEvents: "none",
        background: `
          radial-gradient(ellipse 65% 55% at 10% 30%, ${ha(accent, 0.05)} 0%, transparent 60%),
          radial-gradient(ellipse 55% 45% at 90% 70%, ${ha(C.violet, 0.04)} 0%, transparent 60%)
        `,
      }} />
    </>
  );
}

// ─── NOISE OVERLAY ────────────────────────────────────────────────────────────
// Film grain texture. memo'd — never re-renders.
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

// ─── SCROLL PROGRESS BAR ──────────────────────────────────────────────────────
export function ScrollProgress() {
  const { C } = useTheme();
  const pct = useScrollProgress();
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
      <div style={{
        height:     "100%",
        width:      `${pct}%`,
        background: `linear-gradient(90deg, ${C.violet}, ${C.cyan})`,
        boxShadow:  `0 0 8px ${ha(C.cyan, 0.6)}`,
        borderRadius: "0 2px 2px 0",
        transition: "width 80ms linear",
      }} />
    </div>
  );
}

// ─── FLOATING INPUT (contact form) ────────────────────────────────────────────
interface FloatingInputProps {
  label:      string;
  name:       string;
  type?:      string;
  value:      string;
  onChange:   (name: string, value: string) => void;
  onBlur?:    (name: string) => void;
  error?:     string | null;
  required?:  boolean;
  multiline?: boolean;
}

export function FloatingInput({
  label, name, type = "text", value,
  onChange, onBlur, error, required, multiline,
}: FloatingInputProps) {
  const { C } = useTheme();
  const [focus, setFocus] = useState(false);
  const Tag = multiline ? "textarea" : "input";
  const floating = focus || value.length > 0;

  return (
    <div style={{ position: "relative", paddingTop: 9 }}>
      <label htmlFor={name} style={{
        position:      "absolute",
        left:          13,
        top:           floating ? -2 : (multiline ? 24 : 21),
        fontSize:      floating ? 8 : 12,
        fontFamily:    "monospace",
        letterSpacing: floating ? "0.12em" : "0.02em",
        color:         error ? C.red : focus ? C.cyan : C.textMuted,
        textTransform: floating ? "uppercase" : "none",
        transition:    `all ${DUR.normal}ms ${EASE.spring}`,
        pointerEvents: "none",
        zIndex:        2,
        background:    floating ? C.bgSurface : "transparent",
        padding:       floating ? "0 4px" : "0",
      }}>
        {label}{required && <span style={{ color: C.red }}> *</span>}
      </label>

      
      <Tag
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          onChange(name, e.target.value)
        }
        onFocus={() => setFocus(true)}
        onBlur={() => { setFocus(false); onBlur?.(name); }}
        required={required}
        rows={multiline ? 5 : undefined}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-err` : undefined}
        style={{
          width:       "100%",
          padding:     multiline ? "15px 13px" : "14px 13px",
          borderRadius: 10,
          background:  focus ? ha(C.cyan, 0.05) : ha(C.textPrimary, 0.02),
          border:      `1px solid ${error ? C.red : focus ? ha(C.cyan, 0.45) : C.border}`,
          color:       C.textPrimary,
          fontSize:    13,
          fontFamily:  "monospace",
          letterSpacing: "-0.01em",
          outline:     "none",
          resize:      multiline ? "vertical" : "none",
          transition:  `border-color ${DUR.normal}ms, background ${DUR.normal}ms, box-shadow ${DUR.normal}ms`,
          boxShadow:   focus
            ? `0 0 0 3px ${ha(C.cyan, 0.08)}, 0 0 18px ${ha(C.cyan, 0.06)}`
            : error
            ? `0 0 0 3px ${ha(C.red, 0.08)}`
            : "none",
          minHeight:  multiline ? 115 : undefined,
          lineHeight: multiline ? 1.7  : undefined,
        }}
      />

      {/* Right glow indicator on focus */}
      {focus && (
        <div style={{
          position:     "absolute",
          top:          11,
          bottom:       0,
          right:        0,
          width:        2,
          borderRadius: "0 10px 10px 0",
          background:   `linear-gradient(to bottom, transparent, ${C.cyan}, transparent)`,
          opacity:      0.6,
          animation:    "glowLine 1.5s ease-in-out infinite",
        }} />
      )}

      {error && (
        <p id={`${name}-err`} role="alert" style={{
          margin:        "5px 0 0",
          fontSize:      9,
          fontFamily:    "monospace",
          letterSpacing: "0.08em",
          color:         C.red,
        }}>
          {error}
        </p>
      )}
    </div>
  );
}
