"use client";

import { useCallback, useId, useRef, type CSSProperties, type ReactNode } from "react";
import { ParticleBackground, type ParticleBackgroundOptions } from "@/app/components/particle-background";
import { getPanelOpacity, normalizeMorphEnd, type ShapeTimeline } from "@/lib/particle-timeline";

interface ScrollMorphSectionProps extends ParticleBackgroundOptions {
  hero: ReactNode;
  /** Optional About panel with a brewing particle formation. */
  aboutSection?: ReactNode;
  nextSection: ReactNode;
  /** Research, Create, and Launch panels. Omit to retain the two-shape demo. */
  additionalSections?: readonly [ReactNode, ReactNode, ReactNode];
  /** Total height in vh. Defaults to 300vh plus 200vh per appended shape. */
  trackHeight?: number;
  id?: string;
  /** Accessible navigation labels, in the same order as the panels. */
  panelLabels?: readonly string[];
}

export function ScrollMorphSection({
  hero, aboutSection, nextSection, additionalSections, trackHeight, id, panelLabels, morphEnd = 0.6, ...particleOptions
}: ScrollMorphSectionProps) {
  const generatedId = useId();
  const sectionId = id ?? generatedId;
  const trackRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const nextRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const shapeCount = additionalSections ? 5 : 2;
  const hasAbout = aboutSection !== undefined;
  const panelOffset = Number(hasAbout);
  const defaultLabels = ["Home", ...(hasAbout ? ["About us"] : []), "Wave", ...(additionalSections ? ["Ring", "Sphere", "Tea Rose"] : [])];
  const sectionLabels = panelLabels?.length === defaultLabels.length ? panelLabels : defaultLabels;
  const defaultHeight = 100 + 200 * (sectionLabels.length - 1);
  const height = trackHeight !== undefined && Number.isFinite(trackHeight) ? Math.max(101, trackHeight) : defaultHeight;

  const updatePanels = useCallback((morph: number, reducedMotion: boolean, progress: number, timeline: ShapeTimeline) => {
    const panels = [heroRef.current, ...(hasAbout ? [aboutRef.current] : []), nextRef.current, ...panelRefs.current];
    panels.forEach((panel, index) => {
      if (!panel) return;
      const opacity = getPanelOpacity(index, timeline, morphEnd, reducedMotion, panels.length);
      panel.style.opacity = String(opacity);
      panel.style.visibility = opacity === 0 ? "hidden" : "visible";
      panel.style.pointerEvents = opacity >= 0.5 ? "auto" : "none";
      panel.style.setProperty("--section-reveal", String(opacity));
      const active = String(opacity > 0);
      if (panel.getAttribute("data-active") !== active) panel.setAttribute("data-active", active);
      panel.style.transform = reducedMotion ? "none" : index === 0
        ? `translateY(${-morph * 40}px)` : `translateY(${(1 - opacity) * 28}px)`;
      const hidden = opacity < 0.5;
      if (panel.inert !== hidden) panel.inert = hidden;
      // Reveal observers only need a notification when visibility actually changes.
      if (panel.getAttribute("aria-hidden") !== String(hidden)) panel.setAttribute("aria-hidden", String(hidden));
    });
    if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    const active = timeline.morph >= 0.5 ? timeline.to : timeline.from;
    dotRefs.current.forEach((dot, index) => {
      if (!dot) return;
      const selected = index === active;
      if (dot.getAttribute("data-active") !== String(selected)) dot.setAttribute("data-active", String(selected));
      if (selected && dot.getAttribute("aria-current") !== "step") dot.setAttribute("aria-current", "step");
      else if (!selected && dot.hasAttribute("aria-current")) dot.removeAttribute("aria-current");
    });
  }, [morphEnd, hasAbout]);

  function navigate(index: number) {
    const track = trackRef.current;
    if (!track) return;
    // Land during the target panel's hold, after its staggered morph completes.
    const rangePosition = index === 0 ? 0 : index - 1 + Math.min(1, Math.max(0.6, normalizeMorphEnd(morphEnd)));
    const offset = rangePosition / (sectionLabels.length - 1) * (track.offsetHeight - window.innerHeight);
    const top = window.scrollY + track.getBoundingClientRect().top + offset;
    window.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return (
    <div ref={trackRef} id={sectionId}
      className="relative isolate h-[var(--track-height)] bg-background text-foreground"
      style={{ "--track-height": `${height}vh` } as CSSProperties}>
      <ParticleBackground {...particleOptions} morphEnd={morphEnd} shapeCount={shapeCount} introAnimation={hasAbout}
        trackRef={trackRef} onProgress={updatePanels} />
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-20 h-0.5">
          <div ref={barRef} className="h-full origin-left bg-linear-to-r from-accent to-secondary" style={{ transform: "scaleX(0)" }} />
        </div>
        <nav aria-label="Particle story sections" className="absolute right-2 top-1/2 z-20 flex -translate-y-1/2 flex-col sm:right-5">
          {sectionLabels.map((label, index) => (
            <button key={label} type="button" ref={(node) => { dotRefs.current[index] = node; }}
              aria-label={`Go to ${label}`} aria-controls={`${sectionId}-${index}`}
              aria-current={index === 0 ? "step" : undefined} data-active={index === 0}
              onClick={() => navigate(index)}
              className="group flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              <span className="size-2 rounded-full bg-navigation group-hover:bg-foreground group-data-[active=true]:scale-150 group-data-[active=true]:bg-accent" />
            </button>
          ))}
        </nav>
        <section ref={heroRef} id={`${sectionId}-0`}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center sm:px-14">
          {hero}
        </section>
        {hasAbout && (
          <section ref={aboutRef} id={`${sectionId}-1`} aria-label="About Tea Rose" aria-hidden="true" inert
            className="about-stage absolute inset-0 z-10 flex flex-col items-center overflow-y-auto pb-7 pl-6 pr-14 pt-24 opacity-0 sm:px-16 sm:pb-10 sm:pt-28 lg:pl-14 lg:pr-24 [&>.about-content]:my-auto [&>.about-content]:shrink-0">
            {aboutSection}
          </section>
        )}
        <section ref={nextRef} id={`${sectionId}-${1 + panelOffset}`} aria-hidden="true" inert
          className="st-story-process absolute inset-0 z-10 flex flex-col items-start overflow-y-auto px-6 pb-8 pt-28 opacity-0 sm:px-14">
          {nextSection}
        </section>
        {additionalSections?.map((content, index) => (
          <section key={index} id={`${sectionId}-${index + 2 + panelOffset}`} aria-hidden="true" inert
            ref={(node) => { panelRefs.current[index] = node; }}
            className="st-story-process absolute inset-0 z-10 flex flex-col items-start overflow-y-auto px-6 pb-8 pt-28 opacity-0 sm:px-14">
            {content}
          </section>
        ))}
      </div>
    </div>
  );
}
