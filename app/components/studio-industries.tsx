"use client";

import Image from "next/image";
import teaLogo from "@/public/logoTea.webp";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { industries } from "@/lib/studio-content";
import { usePrefersReducedMotion } from "./studio-reduced-motion";

const industryArtwork = [
  "food-beverage",
  "hospitality-hotels",
  "fashion-lifestyle",
  "jewellery-luxury",
  "media-communication",
  "weddings-events",
  "healthcare",
  "pharma-life-sciences",
  "industrial-manufacturing",
];

const industryColors = [
  "#f9dfba",
  "#efc1ed",
  "#cccbfa",
  "#c6e9c1",
  "#f5f4b7",
  "#f0cdd5",
  "#cce5e8",
  "#dfd0ef",
  "#eed6ba",
];

function industryLayout(width: number, height: number) {
  const compact = width <= 900;
  const radius = compact
    ? Math.min(width * 0.34, Math.max(85, (height - 370) / 2.5))
    : Math.min(width * 0.205, (height - 200) / 2.65, 300);
  return {
    radius,
    cardSize: compact ? 164 : Math.min(184, width * 0.105),
    ringCardSize: radius * 0.47,
    centerX: width * (compact ? 0.5 : 0.695),
    centerY: height * (compact ? 0.69 : 0.57),
    rowY: height * (compact ? 0.68 : 0.57),
    gutter: compact ? 24 : width * 0.4,
  };
}

function IndustryGridCard({
  industry,
  index,
  progress,
  rotation,
  reduced,
  viewport,
}: {
  industry: string;
  index: number;
  progress: MotionValue<number>;
  rotation: MotionValue<number>;
  reduced: boolean | null;
  viewport: { width: number; height: number };
}) {
  const layout = industryLayout(viewport.width, viewport.height);
  const { cardSize, ringCardSize, radius, centerX, centerY, rowY, gutter } =
    layout;
  const angle = ((-90 - (index * 360) / industries.length) * Math.PI) / 180;
  const rowX = gutter + index * (cardSize + 22) + cardSize / 2;
  const ringX = centerX + Math.cos(angle) * radius;
  const ringY = centerY + Math.sin(angle) * radius;
  const foldX = useTransform(
    progress,
    [0, 0.14, 0.8, 1],
    [rowX, rowX, ringX, ringX],
  );
  const foldY = useTransform(
    progress,
    [0, 0.14, 0.8, 1],
    [rowY, rowY, ringY, ringY],
  );
  // Move the card centers along the orbit so the artwork stays upright.
  const x = useTransform(
    () =>
      foldX.get() +
      radius * (Math.cos(angle + rotation.get()) - Math.cos(angle)),
  );
  const y = useTransform(
    () =>
      foldY.get() +
      radius * (Math.sin(angle + rotation.get()) - Math.sin(angle)),
  );
  const scale = useTransform(
    progress,
    [0, 0.14, 0.8, 1],
    [1, 1, ringCardSize / cardSize, ringCardSize / cardSize],
  );

  const isLast = index === industries.length - 1;
  const commonItemClasses =
    "pointer-events-auto after:pointer-events-none after:absolute after:top-[calc(100%+10px)] after:right-0 after:left-0 after:-z-10 after:h-[65px] after:rounded-t-[20px] after:bg-[linear-gradient(var(--industry-card-color),transparent)] after:opacity-[.16] after:content-[''] hover:z-[5] [&:hover_article]:-translate-y-[6px] [&:hover_article]:rotate-[-2deg] [&:hover_article]:shadow-[inset_0_2px_3px_#ffffff90,0_22px_25px_-12px_#30232060]";
  const positionClasses = reduced
    ? `relative top-auto left-auto m-0 h-auto w-full aspect-square will-change-auto ${isLast ? "max-[760px]:col-span-full max-[760px]:w-[calc(50%-7px)] max-[760px]:justify-self-center" : ""}`
    : "absolute top-0 left-0 ml-[calc(var(--industry-card-size)/-2)] mt-[calc(var(--industry-card-size)/-2)] h-[var(--industry-card-size)] w-[var(--industry-card-size)] will-change-transform";

  return (
    <motion.li
      className={`${commonItemClasses} ${positionClasses}`}
      style={
        {
          "--industry-card-size": `${cardSize}px`,
          "--industry-card-color": industryColors[index],
          ...(reduced ? {} : { x, y, scale }),
        } as React.CSSProperties & {
          x?: MotionValue<number>;
          y?: MotionValue<number>;
          scale?: MotionValue<number>;
        }
      }
    >
      <article className="relative flex h-full flex-col items-center overflow-hidden rounded-[25px] border border-[#3b22231c] bg-[var(--industry-card-color)] p-[calc(var(--industry-card-size)*.085)_calc(var(--industry-card-size)*.085)_calc(var(--industry-card-size)*.065)] shadow-[inset_0_2px_3px_#ffffff90,0_15px_19px_-12px_#30232075,0_3px_5px_#30232012] transition-[transform,box-shadow] duration-300 max-[900px]:rounded-[21px] max-[900px]:p-[14px_12px_11px]">
        <h3
          className={`relative z-[1] grid min-h-[2.1em] max-w-[13ch] items-center text-center font-normal leading-[1.02] tracking-[-.025em] text-balance font-display ${reduced ? "text-[clamp(19px,1.7vw,27px)] max-[900px]:text-[clamp(20px,4vw,28px)]" : "text-[calc(var(--industry-card-size)*.13)] max-[900px]:text-[25px]"}`}
        >
          {industry}
        </h3>
        <Image
          src={`/industries/illustrations/${industryArtwork[index]}.webp`}
          width={512}
          height={512}
          alt=""
          sizes="(max-width: 900px) 164px, 224px"
          className="block w-[82%] min-h-0 flex-1 object-contain [mix-blend-mode:multiply]"
        />
        <span
          className="absolute right-[13px] bottom-[11px] font-mono text-sm tracking-[.03em] text-[#30232080]"
          aria-hidden="true"
        >
          0{index + 1}
        </span>
      </article>
    </motion.li>
  );
}

export function StudioIndustries() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const [viewport, setViewport] = useState({ width: 1440, height: 900 });
  const scrollYProgress = useMotionValue(0);
  // Preserve the fold and logo timing, then reserve scroll for a half turn.
  const formationProgress = useTransform(
    scrollYProgress,
    [0, 0.54, 1],
    [0, 1, 1],
  );
  const rotation = useTransform(
    scrollYProgress,
    [0, 0.57, 0.96, 1],
    [0, 0, Math.PI, Math.PI],
  );
  const orbitOpacity = useTransform(formationProgress, [0.4, 0.8], [0, 1]);
  const orbitScale = useTransform(formationProgress, [0.4, 0.8], [0.75, 1]);
  const logoOpacity = useTransform(
    formationProgress,
    [0, 0.82, 0.96, 1],
    [0, 0, 1, 1],
  );
  const logoY = useTransform(formationProgress, [0.82, 0.96], [36, 0]);
  const logoScale = useTransform(formationProgress, [0.82, 0.96], [0.8, 1]);
  const hintOpacity = useTransform(formationProgress, [0.12, 0.4], [1, 0]);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section) return;
      const scrollableDistance = section.offsetHeight - window.innerHeight;
      const progress =
        scrollableDistance > 0
          ? -section.getBoundingClientRect().top / scrollableDistance
          : 0;
      scrollYProgress.set(Math.max(0, Math.min(1, progress)));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateProgress);
    };
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      updateProgress();
    };
    updateViewport();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateViewport);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateViewport);
    };
  }, [scrollYProgress]);

  const { radius, centerX, centerY } = industryLayout(
    viewport.width,
    viewport.height,
  );

  return (
    <section
      className={`relative overflow-clip bg-[#faf7f2] text-[var(--ink)] ${reduced ? "h-auto" : "h-[290svh]"}`}
      id="industries"
      ref={sectionRef}
      aria-labelledby="st-industries-title"
      style={{ height: reduced ? "auto" : "450svh" }}
    >
      <div
        className={`isolate px-[clamp(24px,4.5vw,80px)] pt-[116px] pb-[30px] max-[900px]:px-6 max-[900px]:pt-[100px] max-[900px]:pb-6 ${reduced ? "relative h-auto min-h-[800px] max-[900px]:min-h-0" : "sticky top-0 h-[100svh]"}`}
      >
        <div
          className={`pointer-events-none absolute z-[2] top-[55%] left-[clamp(40px,4.5vw,80px)] w-[min(390px,29vw)] -translate-y-1/2 ${
            reduced
              ? "max-[900px]:relative max-[900px]:top-auto max-[900px]:left-auto max-[900px]:right-auto max-[900px]:w-auto max-[900px]:max-w-[500px] max-[900px]:translate-y-0 max-[900px]:mt-[35px]"
              : "max-[900px]:top-[165px] max-[900px]:left-6 max-[900px]:right-6 max-[900px]:w-auto max-[900px]:max-w-[500px] max-[900px]:translate-y-0 [@media(max-width:900px)_and_(max-height:700px)]:top-[145px]"
          }`}
        >
          <div>
            <span className="font-mono text-sm leading-[1.6] tracking-[.14em] uppercase text-[#98637c]">A studio for every story</span>
            <h2
              id="st-industries-title"
              className="mt-4 font-normal text-[clamp(38px,3.7vw,60px)] leading-[1.04] tracking-[-.045em] text-balance max-[900px]:mt-[10px] max-[900px]:text-[clamp(36px,6vw,50px)] [@media(max-width:900px)_and_(max-height:700px)]:text-[32px]"
            >
              Different worlds.
              <br />
              <em className="font-normal text-[#a73560]">One thoughtful studio.</em>
            </h2>
            <p className="mt-5 max-w-[30ch] text-[clamp(17px,1.3vw,19px)] leading-[1.7] text-[#755c69] max-[900px]:mt-3 max-[900px]:max-w-[40ch] max-[900px]:text-lg [@media(max-width:900px)_and_(max-height:700px)]:hidden">
              From your morning cup to your next big idea. We help brands find
              their place in the world.
            </p>
            <motion.span
              className={`mt-[25px] flex items-center gap-5 font-mono text-sm tracking-[.07em] text-[#9b7286] uppercase max-[900px]:mt-[14px] ${reduced ? "max-[900px]:hidden" : "[@media(max-width:900px)_and_(max-height:700px)]:hidden"}`}
              style={reduced ? undefined : { opacity: hintOpacity }}
            >
              Keep scrolling. Meet our world.{" "}
            </motion.span>
          </div>
        </div>
        {!reduced && (
          <motion.div
            className="pointer-events-none absolute z-0 grid place-items-center rounded-full border border-dashed border-[#b38c9b66] before:absolute before:inset-[22%] before:rounded-full before:border before:border-[#b38c9b25] before:content-['']"
            aria-hidden="true"
            style={{
              left: centerX - radius,
              top: centerY - radius,
              width: radius * 2,
              height: radius * 2,
              opacity: orbitOpacity,
              scale: orbitScale,
            }}
          >
            <motion.div
              className="flex flex-col items-center gap-[13px] text-center text-[#874d68] max-[900px]:gap-2"
              style={{ opacity: logoOpacity, y: logoY, scale: logoScale }}
            >
              <Image
                src={teaLogo}
                alt=""
                sizes="(max-width: 900px) 96px, 180px"
                className="h-auto w-[clamp(110px,13vw,190px)] object-contain drop-shadow-[0_10px_14px_#a735601a] max-[900px]:w-[94px]"
              />
            </motion.div>
          </motion.div>
        )}
        <ul
          className={
            reduced
              ? "relative inset-auto mt-[60px] mr-0 mb-[80px] ml-auto grid w-[58%] grid-cols-3 gap-[22px] list-none p-0 max-[900px]:mt-[35px] max-[900px]:w-full max-[900px]:gap-[14px] max-[760px]:grid-cols-2"
              : "pointer-events-none absolute inset-0 z-[3] m-0 list-none p-0"
          }
          aria-label="Industries we work with"
        >
          {industries.map((industry, index) => (
            <IndustryGridCard
              key={industry}
              industry={industry}
              index={index}
              progress={formationProgress}
              rotation={rotation}
              reduced={reduced}
              viewport={viewport}
            />
          ))}
        </ul>
        <div className="absolute z-[2] bottom-[30px] left-[clamp(24px,4.5vw,80px)] right-[clamp(24px,4.5vw,80px)] flex items-center gap-[30px] text-[#926b7c] max-[900px]:bottom-6 max-[900px]:gap-4">
          <span className="font-mono text-sm leading-[1.6] tracking-[.14em] uppercase text-sm tracking-[.08em]">
            09 industries. Endless possibilities.
          </span>
          <div className="h-px flex-1 bg-[#2c14221a]" aria-hidden="true">
            <motion.span
              className="block h-full origin-left bg-[#a73560]"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
          <span className="font-mono text-sm leading-[1.6] tracking-[.14em] uppercase text-sm tracking-[.08em] max-[900px]:hidden">
            Your world. Our next conversation.
          </span>
        </div>
      </div>
    </section>
  );
}
