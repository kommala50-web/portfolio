"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useMagnetic, useReducedMotion } from "@/hooks";
import { ha } from "@/lib/utils";
import { DUR, EASE, NAV_ITEMS } from "@/lib/tokens";

// ─── SKIP LINK ────────────────────────────────────────────────────────────────
function SkipLink() {
  const { C } = useTheme();
  return (
    <a
      href="#main-content"
      style={{
        position:   "fixed",
        top:        0,
        left:       "50%",
        transform:  "translateX(-50%) translateY(-100%)",
        zIndex:     99999,
        padding:    "10px 22px",
        background: C.cyan,
        color:      C.bgCanvas,
        fontFamily: "monospace",
        fontSize:   12,
        fontWeight: 700,
        letterSpacing: "0.06em",
        borderRadius: "0 0 8px 8px",
        textDecoration: "none",
        transition: "transform 200ms",
      }}
      onFocus={(e)  => { e.currentTarget.style.transform = "translateX(-50%) translateY(0)"; }}
      onBlur={(e)   => { e.currentTarget.style.transform = "translateX(-50%) translateY(-100%)"; }}
    >
      Skip to main content
    </a>
  );
}

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function Logo() {
  const { C } = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <a
      href="#hero"
      aria-label="Kamani Vijay — Home"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
    >
      <div style={{
        width: 33, height: 33, borderRadius: "50%",
        border: `1px dashed ${ha(C.cyan, hov ? 0.7 : 0.4)}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", flexShrink: 0,
        animation: "spinSlow 14s linear infinite",
        transition: `border-color ${DUR.normal}ms`,
      }}>
        <span style={{
          fontSize: 11, fontFamily: "monospace", fontWeight: 700,
          color: C.cyan, letterSpacing: "-0.04em",
          position: "relative", zIndex: 1,
          /* counter-rotate so text stays upright */
          animation: "spinSlow 14s linear infinite reverse",
        }}>KV</span>
        <span style={{
          position: "absolute", top: "6%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 5, height: 5, borderRadius: "50%",
          background: C.cyan, boxShadow: `0 0 7px ${C.cyan}`,
        }} />
      </div>
      <div>
        <div style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, color: C.textPrimary, letterSpacing: "-0.02em", lineHeight: 1.1, transition: `color ${DUR.normal}ms` }}>
          Kamani Vijay
        </div>
        <div style={{ fontSize: 7, fontFamily: "monospace", letterSpacing: "0.14em", color: hov ? C.cyan : C.textDim, textTransform: "uppercase", lineHeight: 1, transition: `color ${DUR.normal}ms` }}>
          Frontend Dev
        </div>
      </div>
    </a>
  );
}

// ─── DESKTOP NAV ITEM ─────────────────────────────────────────────────────────
function NavItem({ item, isActive }: { item: typeof NAV_ITEMS[number]; isActive: boolean }) {
  const { C } = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <li>
      <a
        href={`#${item.id}`}
        aria-current={isActive ? "page" : undefined}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          gap:            3,
          padding:        "6px 13px",
          borderRadius:   8,
          textDecoration: "none",
          background:     isActive ? ha(C.cyan, 0.07) : hov ? ha(C.textPrimary, 0.04) : "transparent",
          border:         `1px solid ${isActive ? ha(C.cyan, 0.30) : "transparent"}`,
          boxShadow:      isActive ? `0 0 14px ${ha(C.cyan, 0.10)}, inset 0 1px 0 ${ha(C.cyan, 0.10)}` : "none",
          transition:     `all ${DUR.normal}ms`,
          position:       "relative",
        }}
      >
        <span style={{ fontSize: 7, fontFamily: "monospace", letterSpacing: "0.10em", color: isActive ? C.cyan : C.textDim }}>
          {item.short}
        </span>
        <span style={{
          fontSize: 10, fontFamily: "monospace",
          fontWeight: isActive ? 600 : 400,
          letterSpacing: "0.06em",
          color: isActive ? C.cyan : hov ? C.textSecondary : C.textMuted,
          textShadow: isActive ? `0 0 10px ${ha(C.cyan, 0.5)}` : "none",
        }}>
          {item.label}
        </span>
        {isActive && (
          <span style={{
            position: "absolute", bottom: -1,
            width: 4, height: 4, borderRadius: "50%",
            background: C.cyan, boxShadow: `0 0 6px ${C.cyan}`,
          }} />
        )}
      </a>
    </li>
  );
}

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────────
function ThemeToggle() {
  const { C, theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      style={{
        width: 50, height: 25, borderRadius: 13,
        border: `1px solid ${C.border}`,
        background: "rgba(128,128,255,0.04)",
        cursor: "pointer", outline: "none",
        position: "relative", display: "flex", alignItems: "center",
        transition: `border-color ${DUR.normal}ms`,
      }}
    >
      <span aria-hidden="true" style={{ position: "absolute", left: 7, fontSize: 9, opacity: isDark ? 0.35 : 0.9, transition: "opacity 300ms" }}>☀</span>
      <span aria-hidden="true" style={{ position: "absolute", right: 7, fontSize: 9, opacity: isDark ? 0.9 : 0.35, transition: "opacity 300ms" }}>◑</span>
      <span style={{
        position:   "absolute",
        top:        3,
        left:       isDark ? "calc(100% - 20px)" : "3px",
        width:      17, height: 17, borderRadius: "50%",
        background: `linear-gradient(135deg, ${C.violet}, ${C.cyan})`,
        boxShadow:  `0 0 10px ${ha(C.cyan, 0.5)}`,
        transition: `left 320ms ${EASE.spring}`,
      }} />
    </button>
  );
}

// ─── RESUME BUTTON ────────────────────────────────────────────────────────────
function ResumeBtn() {
  const { C } = useTheme();
  const mag = useMagnetic(0.28);
  const [hov, setHov] = useState(false);
  return (
    <a
      ref={mag.ref as React.RefObject<HTMLAnchorElement>}
      href="/Kamani_Vijay_Resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download Resume"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); mag.handlers.onMouseLeave(); }}
      onMouseMove={mag.handlers.onMouseMove}
      style={{
        position:       "relative",
        display:        "inline-flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "7px 16px",
        borderRadius:   7,
        fontSize:       9,
        fontFamily:     "monospace",
        fontWeight:     700,
        letterSpacing:  "0.10em",
        textDecoration: "none",
        overflow:       "hidden",
        cursor:         "pointer",
        color:          hov ? C.bgCanvas : C.cyan,
        border:         `1px solid ${C.cyan}`,
        background:     hov ? C.cyan : "transparent",
        boxShadow:      hov ? `0 0 22px ${ha(C.cyan, 0.45)}, 0 4px 14px rgba(0,0,0,0.3)` : `0 0 10px ${ha(C.cyan, 0.12)}`,
        transition:     `all ${DUR.normal}ms`,
        ...mag.style,
      }}
    >
      <span aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: C.cyan,
        transform: hov ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left",
        transition: `transform 260ms ${EASE.spring}`,
        zIndex: 0,
      }} />
      <span style={{
        position: "relative",
        zIndex: 1,
        display: "block",
        height: 12,
        overflow: "hidden",
        lineHeight: "12px",
      }}>
        <span style={{
          display: "block",
          transform: hov ? "translateY(-12px)" : "translateY(0)",
          transition: `transform 300ms ${EASE.spring}`,
        }}>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, height: 12 }}>
            RESUME ↗
          </span>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, height: 12 }}>
            DOWNLOAD CV ↓
          </span>
        </span>
      </span>
    </a>
  );
}

// ─── HAMBURGER ────────────────────────────────────────────────────────────────
function Hamburger({ open, onClick }: { open: boolean; onClick: () => void }) {
  const { C } = useTheme();
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      style={{
        width: 37, height: 37, borderRadius: 9,
        border: `1px solid ${open ? ha(C.cyan, 0.35) : C.border}`,
        background: open ? ha(C.cyan, 0.08) : "transparent",
        cursor: "pointer", outline: "none",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 4.5,
        transition: `all ${DUR.normal}ms`,
      }}
    >
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          display: "block", height: 1.5, borderRadius: 2,
          background: open ? C.cyan : C.textMuted,
          width: [17, 11, 15][i],
          transform: open
            ? (["translateY(6px) rotate(45deg)", "scaleX(0)", "translateY(-6px) rotate(-45deg)"][i])
            : "none",
          opacity: open && i === 1 ? 0 : 1,
          transition: `all 300ms ${EASE.spring}`,
        }} />
      ))}
    </button>
  );
}

// ─── MOBILE DRAWER ────────────────────────────────────────────────────────────
function MobileDrawer({
  open, activeSection, onClose,
}: { open: boolean; activeSection: string; onClose: () => void }) {
  const { C, theme, toggle } = useTheme();
  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 998,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
          transition: "opacity 280ms",
        }}
      />
      {/* Drawer */}
      <nav
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "min(300px, 82vw)", zIndex: 999,
          background: C.bgMobile,
          backdropFilter: "blur(28px) saturate(200%)",
          borderLeft: `1px solid ${C.border}`,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: `transform 360ms ${EASE.spring}`,
          display: "flex", flexDirection: "column", overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: "0.18em", color: C.textDim, textTransform: "uppercase" }}>Navigation</span>
          <button onClick={onClose} aria-label="Close menu" style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${C.border}`, background: "transparent", cursor: "pointer", outline: "none", color: C.textMuted, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        <ul style={{ listStyle: "none", padding: "22px 20px 0", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_ITEMS.map((item, i) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id} style={{ opacity: open ? 1 : 0, transform: open ? "translateX(0)" : "translateX(18px)", transition: `all 320ms ${EASE.spring} ${i * 50 + 80}ms` }}>
                <a href={`#${item.id}`} onClick={onClose} aria-current={isActive ? "page" : undefined} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "13px 14px", borderRadius: 10, textDecoration: "none",
                  background: isActive ? ha(C.cyan, 0.09) : "transparent",
                  border: `1px solid ${isActive ? ha(C.cyan, 0.28) : "transparent"}`,
                  transition: `all ${DUR.normal}ms`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: "0.08em", color: isActive ? C.cyan : C.textDim, width: 16 }}>{item.short}</span>
                    <span style={{ fontSize: 15, fontFamily: "monospace", fontWeight: isActive ? 600 : 400, color: isActive ? C.cyan : C.textPrimary }}>{item.label}</span>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: isActive ? 1 : 0.2 }}>
                    <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke={isActive ? C.cyan : C.textMuted} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </li>
            );
          })}
        </ul>

        <div style={{ padding: 20, borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 12, opacity: open ? 1 : 0, transition: "opacity 300ms 380ms" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.10em", color: C.textMuted, textTransform: "uppercase" }}>
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
            <ThemeToggle />
          </div>
          <a href="/Kamani_Vijay_Resume.pdf" target="_blank" rel="noopener noreferrer" onClick={onClose} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: 12, borderRadius: 10, background: ha(C.cyan, 0.10), border: `1px solid ${ha(C.cyan, 0.28)}`, textDecoration: "none", color: C.cyan, fontSize: 10, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.10em" }}>
            ↓ DOWNLOAD CV
          </a>
        </div>
      </nav>
    </>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function NavProgressBar() {
  const { C } = useTheme();
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: C.border }}>
      <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${C.violet}, ${C.cyan})`, boxShadow: `0 0 6px ${ha(C.cyan, 0.6)}`, borderRadius: "0 2px 2px 0", transition: "width 80ms linear" }} />
    </div>
  );
}

// ─── NAVBAR (main export) ─────────────────────────────────────────────────────
interface NavbarProps {
  activeSection: string;
  scrolled:      boolean;
  isMobile:      boolean;
}

export function Navbar({ activeSection, scrolled, isMobile }: NavbarProps) {
  const { C } = useTheme();
  const [open,    setOpen]    = useState(false);
  const [entered, setEntered] = useState(false);
  const rm = useReducedMotion();

  useEffect(() => {
    const id = setTimeout(() => setEntered(true), 300);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => { if (!isMobile) setOpen(false); }, [isMobile]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const toggleOpen = useCallback(() => setOpen((v) => !v), []);

  return (
    <>
      <SkipLink />
      <header
        role="banner"
        style={{
          position:       "fixed",
          top:            0, left: 0, right: 0,
          zIndex:         1000,
          height:         scrolled ? 56 : 70,
          background:     scrolled ? C.bgNavScroll : "transparent",
          backdropFilter: scrolled ? "blur(22px) saturate(200%)" : "none",
          borderBottom:   `1px solid ${scrolled ? C.border : "transparent"}`,
          boxShadow:      scrolled ? C.shadow : "none",
          display:        "flex",
          alignItems:     "center",
          opacity:        entered ? 1 : 0,
          transform:      entered ? "translateY(0)" : "translateY(-100%)",
          transition:     rm
            ? "none"
            : `height ${DUR.slow}ms ${EASE.spring}, background ${DUR.slow}ms, backdrop-filter ${DUR.slow}ms, border-color ${DUR.slow}ms, box-shadow ${DUR.slow}ms, opacity 600ms ${EASE.spring} 300ms, transform 600ms ${EASE.spring} 300ms`,
        }}
      >
        <div style={{ width: "100%", maxWidth: 1240, margin: "0 auto", padding: "0 clamp(1.25rem,4vw,2.5rem)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <Logo />

          {!isMobile && (
            <nav aria-label="Main navigation">
              <ul style={{ display: "flex", gap: 2, listStyle: "none", padding: 0, margin: 0 }}>
                {NAV_ITEMS.map((item) => (
                  <NavItem key={item.id} item={item} isActive={activeSection === item.id} />
                ))}
              </ul>
            </nav>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {!isMobile && (
              <>
                <ThemeToggle />
                <div style={{ width: 1, height: 18, background: C.border }} />
                <ResumeBtn />
              </>
            )}
            {isMobile && (
              <>
                <ThemeToggle />
                <Hamburger open={open} onClick={toggleOpen} />
              </>
            )}
          </div>
        </div>

        {scrolled && <NavProgressBar />}
      </header>

      {isMobile && (
        <MobileDrawer open={open} activeSection={activeSection} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
