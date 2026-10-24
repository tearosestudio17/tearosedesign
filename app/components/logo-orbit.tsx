"use client";

import Image from "next/image";
import { ArrowDown, Flower2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { brandMarks } from "@/lib/brand-marks";
import { SplitHeading } from "./studio-motion";
import styles from "./logo-orbit.module.css";

function BrandMark({ brand, index, progress, width, height }: {
  brand: typeof brandMarks[number]; index: number; progress: MotionValue<number>; width: number; height: number;
}) {
  const reduced = useReducedMotion();
  const compact = width <= 600;
  // Keep every mark visible, reading left to right and wrapping on smaller screens.
  const columns = width >= 1100 ? 6 : compact ? 3 : 4;
  const rows = Math.ceil(brandMarks.length / columns);
  const cellWidth = width / columns;
  const cellHeight = Math.min(height * 0.78 / rows, compact ? 116 : 160);
  const gridX = (index % columns - (columns - 1) / 2) * cellWidth;
  const gridY = (Math.floor(index / columns) - (rows - 1) / 2) * cellHeight;
  const gridScale = Math.min(1, cellWidth * 0.82 / (compact ? 104 : 150), cellHeight * 0.78 / (compact ? 104 : 126));
  const getPosition = (value: number) => {
    const blend = Math.max(0, Math.min(1, (value - 0.12) / 0.64));
    const eased = blend * blend * (3 - 2 * blend);
    const rotation = Math.max(0, value - 0.76) / 0.24 * Math.PI * 0.4;
    const angle = index / brandMarks.length * Math.PI * 2 - Math.PI / 2 + rotation;
    const radiusX = Math.min(width * 0.39, 490);
    const radiusY = Math.min(height * 0.36, width * 0.39);
    return {
      x: gridX * (1 - eased) + Math.cos(angle) * radiusX * eased,
      y: gridY * (1 - eased) + Math.sin(angle) * radiusY * eased,
      scale: gridScale + ((compact ? 0.62 : 0.88) - gridScale) * eased,
    };
  };
  const x = useTransform(progress, value => getPosition(value).x);
  const y = useTransform(progress, value => getPosition(value).y);
  const scale = useTransform(progress, value => getPosition(value).scale);

  return <motion.li className={styles.mark} style={reduced ? undefined : { x, y, scale }}>
    <div className={styles.logo}><Image src={`/brands/${brand.slug}.webp`} alt={`${brand.name} logo`} width={480} height={320} sizes="(max-width: 600px) 100px, 160px" /></div>
    <span>{brand.name}</span>
  </motion.li>;
}

export function LogoOrbit() {
  const ref = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 1200, height: 560 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const centerOpacity = useTransform(scrollYProgress, [0.4, 0.72], [0, 1]);
  const orbitOpacity = useTransform(scrollYProgress, [0.38, 0.76], [0, 1]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!stage.current) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

  return <section ref={ref} className={styles.section} id="brand-worlds" aria-labelledby="brand-worlds-title">
    <div className={styles.sticky}>
      <div className={styles.heading}>
        <div className="st-section-top"><span className="st-label">02 / Brand worlds</span><span className="st-label">A selection from the studio</span></div>
        <div id="brand-worlds-title"><SplitHeading text="Different brands. One creative orbit." className="st-heading" /></div>
      </div>
      <div ref={stage} className={styles.stage}>
        <motion.div className={styles.orbitGuide} aria-hidden="true" style={{ width: Math.min(size.width * 0.78, 980), height: Math.min(size.height * 0.72, size.width * 0.78), ...(reduced ? {} : { opacity: orbitOpacity }) }} />
        <motion.div className={styles.center} aria-hidden="true" style={reduced ? undefined : { opacity: centerOpacity }}>
          <Flower2 strokeWidth={0.8} /><span>Tea Rose<span>Design Studio</span></span>
        </motion.div>
        <ul className={styles.marks} aria-label="Selected brand identities">{brandMarks.map((brand, index) => <BrandMark key={brand.slug} brand={brand} index={index} progress={scrollYProgress} {...size} />)}</ul>
      </div>
      <div className={styles.footer}><p className="st-label">Good conversations. Great brands.</p><span className={styles.scrollHint}>Scroll to bring it all together <ArrowDown size={14} aria-hidden="true" /></span></div>
    </div>
  </section>;
}
