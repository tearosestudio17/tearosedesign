"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { brandMarks } from "@/lib/brand-marks";
import { SplitHeading } from "./studio-motion";

function BrandMark({
  brand,
  index,
  progress,
  width,
  height,
}: {
  brand: (typeof brandMarks)[number];
  index: number;
  progress: MotionValue<number>;
  width: number;
  height: number;
}) {
  const reduced = useReducedMotion();
  const compact = width <= 600;
  // Keep every mark visible, reading left to right and wrapping on smaller screens.
  const columns = width >= 1100 ? 6 : compact ? 3 : 4;
  const rows = Math.ceil(brandMarks.length / columns);
  const cellWidth = width / columns;
  const cellHeight = Math.min((height * 0.78) / rows, compact ? 116 : 160);
  const gridX = ((index % columns) - (columns - 1) / 2) * cellWidth;
  const gridY = (Math.floor(index / columns) - (rows - 1) / 2) * cellHeight;
  const gridScale = Math.min(
    1,
    (cellWidth * 0.82) / (compact ? 104 : 150),
    (cellHeight * 0.78) / (compact ? 104 : 126),
  );
  const getPosition = (value: number) => {
    const blend = Math.max(0, Math.min(1, (value - 0.12) / 0.64));
    const eased = blend * blend * (3 - 2 * blend);
    const rotation = (Math.max(0, value - 0.76) / 0.24) * Math.PI * 0.4;
    const angle =
      (index / brandMarks.length) * Math.PI * 2 - Math.PI / 2 + rotation;
    const radiusX = Math.min(width * 0.39, 490);
    const radiusY = Math.min(height * 0.36, width * 0.39);
    return {
      x: gridX * (1 - eased) + Math.cos(angle) * radiusX * eased,
      y: gridY * (1 - eased) + Math.sin(angle) * radiusY * eased,
      scale: gridScale + ((compact ? 0.62 : 0.88) - gridScale) * eased,
    };
  };
  const x = useTransform(progress, (value) => getPosition(value).x);
  const y = useTransform(progress, (value) => getPosition(value).y);
  const scale = useTransform(progress, (value) => getPosition(value).scale);

  return (
    <motion.li
      className="absolute top-[calc(50%-59px)] left-[calc(50%-75px)] w-[150px] text-center max-[600px]:top-[calc(50%-44px)] max-[600px]:left-[calc(50%-52px)] max-[600px]:w-[104px] motion-reduce:static motion-reduce:w-auto motion-reduce:!transform-none [&>span]:mt-2 [&>span]:block [&>span]:font-mono [&>span]:text-sm/[1.35] [&>span]:text-[#624952] max-[600px]:[&>span]:text-base"
      style={reduced ? undefined : { x, y, scale }}
    >
      <div className="aspect-[1.5] overflow-hidden rounded-lg border border-[#2c142215] bg-white shadow-[0_8px_24px_#2c142208] [&_img]:size-full [&_img]:object-contain">
        <Image
          src={`/brands/${brand.slug}.webp`}
          alt={`${brand.name} logo`}
          width={480}
          height={320}
          sizes="(max-width: 600px) 100px, 160px"
        />
      </div>
      <span>{brand.name}</span>
    </motion.li>
  );
}

export function LogoOrbit() {
  const ref = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 1200, height: 560 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const centerOpacity = useTransform(scrollYProgress, [0.4, 0.72], [0, 1]);
  const orbitOpacity = useTransform(scrollYProgress, [0.38, 0.76], [0, 1]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!stage.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      }),
    );
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative h-[280svh] bg-[var(--paper)] text-[var(--ink)] motion-reduce:h-auto"
      id="brand-worlds"
      aria-labelledby="brand-worlds-title"
    >
      <div className="sticky top-0 flex h-svh flex-col overflow-clip px-[clamp(24px,5vw,80px)] pt-[120px] pb-[26px] max-[600px]:pt-[100px] max-[600px]:pb-5 motion-reduce:relative motion-reduce:h-auto motion-reduce:overflow-visible motion-reduce:py-20">
        <div className="shrink-0 [&>div:first-child]:mb-[22px] [&_h2]:max-w-[20ch] [&_h2]:text-[clamp(32px,4.4vw,66px)] [&_h2]:leading-[1.12]">
          <div className="mb-[55px] flex items-start justify-between gap-[30px] max-[760px]:mb-[35px] max-[760px]:gap-5">
            <span className="font-mono text-sm leading-[1.6] tracking-[.14em] uppercase">A selection from the studio</span>
          </div>
          <div id="brand-worlds-title">
            <SplitHeading
              text="Different brands. One creative orbit."
              className="text-[clamp(38px,5.2vw,82px)] font-normal tracking-[-.055em] leading-[1.12]"
            />
          </div>
        </div>
        <div ref={stage} className="relative min-h-0 flex-1 motion-reduce:my-9">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-1/2 rounded-full border border-[#2c14221c] motion-reduce:hidden"
            aria-hidden="true"
            style={{
              width: Math.min(size.width * 0.78, 980),
              height: Math.min(size.height * 0.72, size.width * 0.78),
              ...(reduced ? {} : { opacity: orbitOpacity }),
            }}
          />
          <motion.div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 max-[600px]:gap-2 motion-reduce:hidden [&>span]:font-display [&>span]:text-[32px]/none [&>span]:tracking-[-.055em] max-[600px]:[&>span]:text-[22px] [&>span>span]:mt-2.5 [&>span>span]:block [&>span>span]:text-center [&>span>span]:font-mono [&>span>span]:text-sm [&>span>span]:tracking-[.14em] [&>span>span]:uppercase"
            aria-hidden="true"
            style={reduced ? undefined : { opacity: centerOpacity }}
          >
            <span>
              Tea Rose<span>Design Studio</span>
            </span>
          </motion.div>
          <ul
            className="absolute inset-0 m-0 list-none p-0 motion-reduce:relative motion-reduce:grid motion-reduce:grid-cols-4 motion-reduce:gap-x-5 motion-reduce:gap-y-7 max-[600px]:motion-reduce:grid-cols-2"
            aria-label="Selected brand identities"
          >
            {brandMarks.map((brand, index) => (
              <BrandMark
                key={brand.slug}
                brand={brand}
                index={index}
                progress={scrollYProgress}
                {...size}
              />
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-between gap-5 border-t border-t-[#2c142225] pt-5 max-[600px]:items-start max-[600px]:[&>p]:max-w-[18ch] max-[600px]:[&>p]:text-sm">
          <p className="font-mono text-sm leading-[1.6] tracking-[.14em] uppercase">Good conversations. Great brands.</p>
          <span className="inline-flex items-center gap-3 font-mono text-sm text-[#624952] max-[600px]:max-w-[20ch] max-[600px]:leading-[1.6] motion-reduce:hidden">
            Scroll to bring it all together{" "}
          </span>
        </div>
      </div>
    </section>
  );
}
