"use client";

import { useState, useCallback, useMemo } from "react";
import { useScrollSpy, useMediaQuery } from "@/hooks";
import { NAV_ITEMS } from "@/lib/tokens";

// Layout
import { Navbar }        from "@/components/layout/Navbar";
import { SectionDots }   from "@/components/layout/SectionDots";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { NoiseOverlay }  from "@/components/ui/NoiseOverlay";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

// Sections
import { HeroSection }            from "@/components/sections/Hero";
import { AboutSection }           from "@/components/sections/About";
import { SkillsSection }          from "@/components/sections/Skills";
import { ProjectsSection }        from "@/components/sections/Projects";
import { ExperienceSection }      from "@/components/sections/Experience";
import { CertificationsSection }  from "@/components/sections/Certifications";
import { ContactSection }         from "@/components/sections/Contact";

export default function Home() {
  const [loading,  setLoading]  = useState(true);
  const [ready,    setReady]    = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const sectionIds = useMemo(() => NAV_ITEMS.map((n) => n.id), []);
  const activeSection = useScrollSpy(sectionIds);

  // Track scrolled state for navbar glass effect
  if (typeof window !== "undefined") {
    window.addEventListener(
      "scroll",
      () => setScrolled(window.scrollY > 24),
      { passive: true }
    );
  }

  const onLoadComplete = useCallback(() => {
    setLoading(false);
    // Double rAF ensures browser has painted before revealing content
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setReady(true))
    );
  }, []);

  return (
    <>
      {/* Cinematic loading intro */}
      {loading && <LoadingScreen onComplete={onLoadComplete} />}

      {/* Persistent overlays */}
      <NoiseOverlay />
      <ScrollProgress />

      {/* Main page — fades in after loading */}
      <div
        style={{
          opacity:    ready ? 1 : 0,
          transition: loading ? "none" : "opacity 500ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Fixed navigation */}
        <Navbar
          activeSection={activeSection}
          scrolled={scrolled}
          isMobile={isMobile}
        />

        {/* Side section dots (desktop only) */}
        {!isMobile && (
          <SectionDots
            activeSection={activeSection}
            scrolled={scrolled}
          />
        )}

        {/* Content */}
        <main id="main-content" tabIndex={-1} style={{ outline: "none" }}>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <ExperienceSection />
          <CertificationsSection />
          <ContactSection />
        </main>
      </div>
    </>
  );
}
