"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";
import { brandMarks } from "@/lib/brand-marks";
import { SplitHeading } from "./studio-motion";
import { StudioLink } from "./studio-navigation";
import styles from "./logo-wave.module.css";

function WaveLogo({ brand, index, duplicate }: {
  brand: typeof brandMarks[number]; index: number; duplicate: boolean;
}) {
  return <li className={styles.mark} style={{ "--wave-delay": `${-index * 6}s` } as CSSProperties}>
    <div className={styles.card} title={brand.name}>
      <Image src={`/brands/${brand.slug}.webp`} alt={duplicate ? "" : `${brand.name} logo`} width={480} height={320}
        sizes="(max-width: 600px) 132px, 210px" />
    </div>
  </li>;
}

export function LogoWave() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let inView = false;
    const update = () => { section.dataset.animating = String(inView && !document.hidden); };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(section);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return <section ref={sectionRef} id="brand-worlds" className={styles.section} aria-labelledby="brand-wave-title">
    <div className={styles.top}>
      <span className="st-label">02 / Brand worlds</span>
      <span className="st-label">A selection from the studio / {String(brandMarks.length).padStart(2, "0")} identities</span>
    </div>

    <div className={styles.wave}>
      <div className={styles.track}>
        {[false, true].map(duplicate => <ul key={String(duplicate)} className={styles.group}
          aria-hidden={duplicate || undefined} aria-label={duplicate ? undefined : "Selected brand identities"}>
          {brandMarks.map((brand, index) => <WaveLogo key={brand.slug} brand={brand} index={index} duplicate={duplicate} />)}
        </ul>)}
      </div>
    </div>

    <div className={styles.bottom}>
      <div id="brand-wave-title"><SplitHeading text={"Different brands.\nA thoughtful blend."} className={styles.title} accent="blend." /></div>
      <div className={styles.copy}>
        <p>One team for strategy, design, marketing, branding and launches. No scattered vendors and no mixed messages.</p>
        <StudioLink href="/services#branding" className="st-text-link">Explore brand identity <ArrowUpRight size={18} aria-hidden="true" /></StudioLink>
        <span className="st-label">Good conversations. Great brands.</span>
      </div>
    </div>
  </section>;
}
