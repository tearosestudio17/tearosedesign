"use client";

import Image from "next/image";
import teaIllustration from "@/public/home.webp";
import { AnimatedHeading, AnimatedReveal } from "./animated-heading";
import styles from "./hero.module.css";

const disciplines = ["Strategy", "Design", "Marketing", "Branding", "Launches"];

export default function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.layout}>
        <div className={styles.copy}>
          <AnimatedReveal delay={0}>
            <p className={styles.eyebrow}>Tea Rose Design Studio</p>
          </AnimatedReveal>
          <AnimatedHeading
            as="h1"
            waitForIntro
            className={styles.title}
            lines={[
              { text: "Spill the Tea.", accentWords: ["Tea."] },
              { text: "We’ll Do the Rest.", className: styles.subheading },
            ]}
          />
          <AnimatedReveal className={styles.details}>
            <p className={styles.description}>
              A creative branding and digital marketing agency for brands across
              India and around the world.
            </p>
            <p className={styles.note}>Good conversations. Great brands.</p>
          </AnimatedReveal>
        </div>
        <div className={styles.visual} aria-hidden="true">
          <div className={styles.glow} />
          <div className={`hero-illustration ${styles.illustration}`}>
            <Image
              src={teaIllustration}
              alt=""
              fill
              sizes="(min-width: 1024px) 46vw, (min-width: 600px) 55vw, 300px"
              className={styles.image}
              preload
            />
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <p className={styles.disciplines}>{disciplines.join(". ")}.</p>
        <p className={styles.location}>India &amp; beyond</p>
      </footer>
    </div>
  );
}
