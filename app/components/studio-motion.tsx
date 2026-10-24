"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { AnimatedHeading, AnimatedReveal } from "./animated-heading";

export function Reveal({
  children,
  className = "",
  delay = 0,
  once = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  return (
    <AnimatedReveal className={className} delay={delay} once={once}>
      {children}
    </AnimatedReveal>
  );
}

export function SplitHeading({
  text,
  className = "",
  as = "h2",
  accent,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  accent?: string;
}) {
  const lines = text
    .split("\n")
    .map((line) => ({ text: line, accentWords: accent?.split(/\s+/) }));
  return (
    <AnimatedHeading
      as={as}
      className={`st-split ${className}`}
      lines={lines}
    />
  );
}

function ScrubWord({
  word,
  progress,
  start,
  end,
}: {
  word: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  const reduced = useReducedMotion();
  return (
    <motion.span style={{ opacity: reduced ? 1 : opacity }}>
      {word}{" "}
    </motion.span>
  );
}

export function ScrubText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 88%", "end 48%"],
  });
  const words = text.split(" ");
  return (
    <p ref={ref} className={`st-scrub ${className}`}>
      {words.map((word, i) => (
        <ScrubWord
          key={i}
          word={word}
          progress={scrollYProgress}
          start={i / words.length}
          end={(i + 1) / words.length}
        />
      ))}
    </p>
  );
}

export function Magnetic({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const x = useSpring(0, { stiffness: 170, damping: 16 });
  const y = useSpring(0, { stiffness: 170, damping: 16 });
  const reduced = useReducedMotion();
  return (
    <motion.span
      className={`st-magnetic ${className}`}
      style={{ x, y }}
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.22);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.3);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

export function FoldRow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <AnimatedReveal className={className} delay={0}>
      {children}
    </AnimatedReveal>
  );
}

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="st-reading-progress"
      aria-hidden="true"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
