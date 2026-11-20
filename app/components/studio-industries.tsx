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

  return (
    <motion.li
      className="st-industry-item"
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
      <article className="st-industry-card">
        <h3>{industry}</h3>
        <Image
          src={`/industries/illustrations/${industryArtwork[index]}.webp`}
          width={512}
          height={512}
          alt=""
          sizes="(max-width: 900px) 164px, 224px"
        />
        <span className="st-industry-card-number" aria-hidden="true">
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
      className={`st-industries${reduced ? " st-industries-reduced" : ""}`}
      id="industries"
      ref={sectionRef}
      aria-labelledby="st-industries-title"
      style={{ height: reduced ? "auto" : "450svh" }}
    >
      <div className="st-industry-stage">
        <div className="st-industry-center">
          <div>
            <span className="st-label">A studio for every story</span>
            <h2 id="st-industries-title" className="st-heading">
              Different worlds.
              <br />
              <em>One thoughtful studio.</em>
            </h2>
            <p>
              From your morning cup to your next big idea. We help brands find
              their place in the world.
            </p>
            <motion.span
              className="st-industry-scroll"
              style={reduced ? undefined : { opacity: hintOpacity }}
            >
              Keep scrolling. Meet our world.{" "}
            </motion.span>
          </div>
        </div>
        {!reduced && (
          <motion.div
            className="st-industry-orbit"
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
              className="st-industry-orbit-center"
              style={{ opacity: logoOpacity, y: logoY, scale: logoScale }}
            >
              <Image
                src={teaLogo}
                alt=""
                sizes="(max-width: 900px) 96px, 180px"
                className="st-industry-center-logo"
              />
              {/* <span className="st-label">One thoughtful studio.</span> */}
            </motion.div>
          </motion.div>
        )}
        <ul
          className={`st-industry-list${reduced ? " st-industry-static" : ""}`}
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
        <div className="st-industry-footer">
          <span className="st-label">
            09 industries. Endless possibilities.
          </span>
          <div className="st-industry-progress" aria-hidden="true">
            <motion.span style={{ scaleX: scrollYProgress }} />
          </div>
          <span className="st-label">Your world. Our next conversation.</span>
        </div>
      </div>
    </section>
  );
}
