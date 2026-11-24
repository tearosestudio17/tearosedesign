"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import AboutUs from "./about-us";
import { AnimatedHeading, AnimatedReveal } from "./animated-heading";
import { StudioLink } from "./studio-navigation";
import { process } from "@/lib/studio-content";

type Step = (typeof process)[number];

function StepContent({ step }: { step: Step }) {
  return (
    <AnimatedReveal className="max-w-[480px]">
      <AnimatedHeading
        lines={[{ text: step.title }]}
        className="text-[clamp(30px,3.6vw,48px)] font-normal tracking-[-.05em] leading-[1.05]"
      />
      <p className="font-display mt-3 text-[clamp(18px,1.8vw,22px)]/[1.4] text-[#ffadcc] italic">
        {step.text}
      </p>
      <p className="mt-4 max-w-[46ch] border-l border-l-[#ff83b54d] pl-4 text-base leading-[1.8] text-muted-foreground">
        {step.note}
      </p>
      <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-2" aria-label={`${step.title} Focus areas`}>
        {step.items.map((item, i) => (
          <li key={item} className="flex items-baseline gap-2 text-sm text-muted-foreground">
            <span aria-hidden className="shrink-0 font-mono text-xs text-accent">
              0{i + 1}
            </span>
            {item}
          </li>
        ))}
      </ul>
      <StudioLink
        href={step.href}
        className="mt-6 inline-flex items-center gap-6 border-b border-b-current pb-1 text-sm transition-opacity duration-200 hover:opacity-65"
      >
        {step.link}
      </StudioLink>
    </AnimatedReveal>
  );
}

function TreeNode({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.7 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-[var(--accent)] bg-background font-mono text-sm text-[var(--accent)] shadow-[0_0_0_6px_var(--background),0_0_26px_-4px_var(--accent)] sm:size-14"
    >
      0{index + 1}
    </motion.div>
  );
}

function TreeBranch({ side }: { side: "left" | "right" }) {
  return (
    <motion.div
      aria-hidden
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.7 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className={
        side === "left"
          ? "absolute top-1/2 right-1/2 h-px w-full origin-right -translate-y-1/2 bg-[linear-gradient(to_left,#fff3f766,transparent)]"
          : "absolute top-1/2 left-1/2 h-px w-full origin-left -translate-y-1/2 bg-[linear-gradient(to_right,#fff3f766,transparent)]"
      }
    />
  );
}

function TreeStep({ step, index }: { step: Step; index: number }) {
  const left = index % 2 === 0;
  return (
    <div className="relative">
      {/* Desktop: alternating branches either side of the spine */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_64px_1fr] sm:items-center sm:gap-x-2">
        <div className={left ? "flex justify-end pr-10" : ""}>{left && <StepContent step={step} />}</div>
        <div className="relative flex justify-center">
          <TreeBranch side={left ? "left" : "right"} />
          <TreeNode index={index} />
        </div>
        <div className={!left ? "pl-10" : ""}>{!left && <StepContent step={step} />}</div>
      </div>
      {/* Mobile: left-rail spine, content to the right */}
      <div className="flex gap-5 sm:hidden">
        <TreeNode index={index} />
        <div className="min-w-0 pt-1">
          <StepContent step={step} />
        </div>
      </div>
    </div>
  );
}

export function StoryProcess() {
  const treeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: treeRef,
    offset: ["start 0.75", "end 0.4"],
  });

  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,#ffffff1f_1px,transparent_1.5px)] bg-[length:22px_22px] sm:bg-[length:28px_28px]"
      />
      <div className="relative mx-auto max-w-[1320px] px-6">
        <AboutUs />
      </div>
      <div className="relative mx-auto mt-24 max-w-[1320px] px-6 sm:mt-32">
        <AnimatedReveal className="mb-14 border-b border-b-[#fff3f71a] pb-6 text-center sm:mb-20">
          <h2 className="text-[clamp(34px,5vw,64px)] font-normal tracking-[-.045em] leading-[1.05]">
            How we <em className="text-[var(--accent)] not-italic">work</em>
          </h2>
        </AnimatedReveal>

        <div ref={treeRef} className="relative">
          {/* The spine — grows downward as the section scrolls into view */}
          <motion.div
            aria-hidden
            style={{ scaleY: scrollYProgress }}
            className="absolute top-0 bottom-0 left-6 w-px origin-top bg-[linear-gradient(to_bottom,#fff3f74d,#fff3f71a)] sm:left-1/2 sm:-translate-x-1/2"
          />
          <div className="flex flex-col gap-16 sm:gap-20">
            {process.map((step, i) => (
              <TreeStep key={step.title} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
