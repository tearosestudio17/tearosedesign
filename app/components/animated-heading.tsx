"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const tags = { h1: motion.h1, h2: motion.h2, h3: motion.h3 };
const ease = [0.22, 1, 0.36, 1] as const;

// Pinned panels overlap in the viewport. Their accessibility state, rather
// than intersection alone, tells us when their content actually becomes visible.
function useRevealVisibility<T extends HTMLElement>(once: boolean) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount: 0.15, once });
  const [panelActive, setPanelActive] = useState(false);

  useEffect(() => {
    const section = ref.current?.closest("section");
    const update = () => setPanelActive(section?.getAttribute("aria-hidden") !== "true");
    const observer = new MutationObserver(update);
    if (section) observer.observe(section, { attributes: true, attributeFilter: ["aria-hidden"] });
    const frame = requestAnimationFrame(update);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, []);

  return { ref, visible: inView && panelActive };
}

export function AnimatedAccent({ children }: { children: ReactNode }) {
  return <em className="inline-block bg-[linear-gradient(115deg,var(--heading-accent-start,#ffe8ef),var(--heading-accent-middle,#ffadcc),var(--heading-accent-end,var(--accent)))] bg-clip-text pr-[0.12em] font-normal text-transparent">{children}</em>;
}

export function AnimatedReveal({ children, className = "", delay = 0.18, once = false }: {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const { ref, visible } = useRevealVisibility<HTMLDivElement>(once);
  const reduced = useReducedMotion();
  return <motion.div ref={ref} className={`motion-reduce:transform-none! motion-reduce:opacity-100! ${className}`}
    initial={{ opacity: 0, y: 16 }}
    animate={reduced || visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
    transition={{ duration: reduced ? 0 : 0.7, delay: visible && !reduced ? delay : 0, ease }}>
    {children}
  </motion.div>;
}

interface HeadingLine {
  text: string;
  /** Whole words to render in the site's italic rose accent. */
  accentWords?: string[];
  className?: string;
}

/** Smooth word reveals preserve the font's natural kerning and ligatures. */
export function AnimatedHeading({
  as = "h2", lines, className = "", waitForIntro = false, once = false,
}: {
  as?: keyof typeof tags;
  lines: HeadingLine[];
  className?: string;
  waitForIntro?: boolean;
  once?: boolean;
}) {
  const Tag = tags[as];
  const { ref, visible } = useRevealVisibility<HTMLHeadingElement>(once);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Let the layout start its entrance before inspecting the curtain.
    const frame = requestAnimationFrame(() => {
      const animations = waitForIntro
        ? document.querySelector(".st-curtain")?.getAnimations() ?? []
        : [];
      void Promise.all([
        document.fonts.ready,
        ...animations.map((animation) => animation.finished.catch(() => {})),
      ]).then(() => { if (!cancelled) setReady(true); });
    });
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [waitForIntro]);

  return <Tag ref={ref}
    className={`font-display font-normal leading-[1.06] tracking-[-0.035em] ${className}`}
    aria-label={lines.map((line) => line.text).join(" ")}
    initial="hidden" animate={reduced || (ready && visible) ? "visible" : "hidden"}
    variants={{ hidden: {}, visible: { transition: { staggerChildren: reduced ? 0 : 0.22 } } }}>
    {lines.map(({ text, accentWords = [], className: lineClass = "" }, lineIndex) => (
      <motion.span key={lineIndex} aria-hidden="true" className={`block ${lineClass}`}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: reduced ? 0 : 0.075 } } }}>
        {text.split(/\s+/).map((word, index) => (
          <Fragment key={index}>
            {index > 0 && " "}
            <span className="-my-[0.18em] inline-block overflow-clip py-[0.18em] align-bottom">
              <motion.span className="inline-block motion-reduce:transform-none! motion-reduce:opacity-100!"
                variants={{
                  hidden: { y: "105%", opacity: 0 },
                  visible: { y: "0%", opacity: 1, transition: { duration: reduced ? 0 : 0.85, ease } },
                }}>
                {accentWords.includes(word)
                  ? <AnimatedAccent>{word}</AnimatedAccent>
                  : word}
              </motion.span>
            </span>
          </Fragment>
        ))}
      </motion.span>
    ))}
  </Tag>;
}
