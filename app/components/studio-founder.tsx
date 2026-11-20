"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Magnetic, Reveal, SplitHeading } from "./studio-motion";
import { usePrefersReducedMotion } from "./studio-reduced-motion";

export function StudioFounder({
  standalone = false,
}: {
  standalone?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const reduced = usePrefersReducedMotion();
  const [flipped, setFlipped] = useState(false);
  return (
    <section
      className="relative overflow-clip bg-[#f2e3e4] px-[clamp(24px,5vw,80px)] py-[clamp(70px,7vw,110px)] text-[var(--ink)] [--heading-accent-end:#8e254e] [--heading-accent-middle:#a73560] [--heading-accent-start:#752647] max-[760px]:px-6 max-[760px]:pt-[55px] max-[760px]:pb-[65px]"
      id="founder"
      aria-labelledby="founder-title"
    >
      <div className="mx-auto grid max-w-[1320px] grid-cols-[.9fr_1fr] items-center gap-[clamp(50px,8vw,125px)] min-[761px]:max-[1100px]:grid-cols-[.85fr_1fr] min-[761px]:max-[1100px]:gap-[45px] max-[760px]:grid-cols-1 max-[760px]:gap-[42px]">
        <figure className="relative -rotate-2 rounded-[180px_180px_12px_12px] border border-[#2c14221a] bg-[#fff9f0] px-3.5 pt-3.5 shadow-[0_22px_35px_-24px_#4d203c65] min-w-0 max-[760px]:mx-auto max-[760px]:w-[min(100%-16px,430px)] max-[760px]:px-[11px] max-[760px]:pt-[11px] motion-reduce:rotate-0">
          <div
            ref={ref}
            tabIndex={0}
            onMouseEnter={() => setFlipped(true)}
            onMouseLeave={() => setFlipped(false)}
            onFocus={() => setFlipped(true)}
            onBlur={() => setFlipped(false)}
            onClick={() => setFlipped((value) => !value)}
            className="relative aspect-[.8] cursor-pointer overflow-hidden rounded-[170px_170px_5px_5px] bg-[#c6b6a6] [perspective:1600px] max-[760px]:max-h-[480px]"
          >
            <div
              className="relative h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] [transform-style:preserve-3d]"
              style={reduced ? undefined : { transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
            >
              <motion.div
                className="absolute inset-x-0 -inset-y-[5%] [backface-visibility:hidden] [&_img]:object-cover [&_img]:object-[55%_60%]"
                style={reduced ? undefined : { y }}
              >
                <Image
                  src="/founder.webp"
                  fill
                  alt="Trishi Jain enjoying a cup of tea by a sunlit window"
                  sizes="(max-width: 760px) 85vw, 42vw"
                />
              </motion.div>
              {!reduced && (
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <Image
                    src="/flip.png"
                    fill
                    alt="Trishi Jain reaching for a teapot in her kitchen"
                    sizes="(max-width: 760px) 85vw, 42vw"
                    className="object-cover object-[50%_25%]"
                  />
                </div>
              )}
            </div>
          </div>
          <figcaption className="flex flex-wrap items-center justify-between gap-5 px-2.5 pt-[23px] pb-[25px] max-[760px]:px-[7px] max-[760px]:py-5">
            <span className="font-display text-[clamp(27px,2.7vw,39px)]/none tracking-[-.04em] italic max-[760px]:text-[32px]">Trishi Jain</span>
            <span className="max-w-[17ch] text-right font-mono text-sm/[1.7] tracking-[.08em] text-[#805568] uppercase">
              Founder
              <br />
              Tea Rose Design Studio
            </span>
          </figcaption>
        </figure>
        <div className="min-w-0 max-[760px]:mx-auto max-[760px]:max-w-[530px]">
          <span className="st-label mb-[19px] block text-[#98637c] max-[760px]:mb-3.5">
            A creative heart. A curious mind.
          </span>
          <div id="founder-title">
            <SplitHeading
              text={"Meet the Girl\nBehind the Tea"}
              className="max-w-[12ch] text-[clamp(44px,5.1vw,76px)] leading-[1.04] font-normal tracking-[-.05em] min-[761px]:max-[1100px]:text-[clamp(40px,5vw,56px)] max-[760px]:text-[clamp(46px,10.8vw,68px)]"
              accent="Tea"
              as={standalone ? "h1" : "h2"}
            />
          </div>
          <Reveal>
            <p className="mt-[26px] max-w-[36ch] font-sans text-[clamp(17px,1.55vw,22px)]/[1.65] tracking-[-.025em] max-[760px]:mt-[21px] max-[760px]:text-lg [&>span]:text-[#9a335d]">
              <span>Hi, I’m Trishi Jain.</span> I’m a creative at heart, a tea
              lover by habit and someone who can never resist spilling the tea.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-[22px] [&_p]:max-w-[53ch] [&_p]:font-sans [&_p]:text-lg/[1.8] [&_p]:text-[#745765] max-[760px]:[&_p]:leading-[1.9] [&_p+p]:mt-4">
              <p>
                I’ve always seen the world through a creative lens. A café menu,
                a shop sign, a wedding card. Everything tells a story, and I
                couldn’t stop noticing which ones told it well.
              </p>
              <p>
                Somewhere between countless cups of tea and a lot of notebooks,
                an idea took shape. A studio where brands get honest
                conversations, real insight and design that actually means
                something.
              </p>
            </div>
          </Reveal>
          <div className="mt-[30px] flex items-center justify-between gap-6 border-t border-t-[#2c142222] pt-[25px] min-[761px]:max-[1100px]:flex-wrap min-[761px]:max-[1100px]:gap-3 max-[760px]:mt-[25px] max-[760px]:flex-wrap max-[760px]:gap-[18px] [&>p]:font-display [&>p]:text-[30px]/[1.2] [&>p]:tracking-[-.03em] [&>p]:italic max-[760px]:[&>p]:text-[28px]">
            <p>That’s Tea Rose.</p>
            <Magnetic>
              <a href="#contact" className="inline-flex items-center gap-[18px] border-b border-b-[#a7356066] py-2 font-sans text-sm/[1.5] text-[#872d51]">
                Let’s talk over tea{" "}
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
