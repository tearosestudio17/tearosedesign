"use client";

import Image from "next/image";
import teaLogo from "@/public/logoTea.webp";
import { Dialog } from "@base-ui/react/dialog";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  industries,
  launchItems,
  reasons,
  services,
} from "@/lib/studio-content";
import {
  FoldRow,
  Magnetic,
  Reveal,
  ScrubText,
  SplitHeading,
} from "./studio-motion";
import { StudioLink } from "./studio-navigation";
import serviceArtStyles from "./studio-service-art.module.css";
import founderStyles from "./studio-founder.module.css";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToReducedMotion(onChange: () => void) {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
const getReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;
const getServerReducedMotion = () => false;

// Keep the first client render identical to the server, then read the preference.
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );
}

export function StudioAboutIntro() {
  return (
    <section className="st-section st-intro" id="about">
      <ScrubText text="We’re Tea Rose Design Studio. We mix research, design and marketing to help brands look sharper, sound clearer and grow faster." />
      <div className="st-intro-bottom">
        <div>
          <p>
            We believe tea solves everything. A good conversation leads to a
            good idea, and a good idea leads to design that works.
          </p>
          <p>
            One team for strategy, design, marketing, branding and launches. No
            scattered vendors and no mixed messages.
          </p>
        </div>
        <Magnetic>
          <StudioLink href="/services" className="st-text-link">
            Explore our services{" "}
          </StudioLink>
        </Magnetic>
      </div>
    </section>
  );
}

const serviceArtwork = [
  { color: "#fae8d0", caption: "Clear direction. Better decisions." },
  { color: "#f5edbc", caption: "Ideas, beautifully brought to life." },
  { color: "#deddf5", caption: "Turn attention into action." },
  { color: "#f6dce6", caption: "A brand that feels like you." },
];

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 15%"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [36, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [2, 0]);
  const artScale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const artwork = serviceArtwork[index];
  return (
    <article
      id={service.name.toLowerCase()}
      className={`st-service-card st-service-${index}`}
      ref={ref}
      style={{ "--card-order": index } as React.CSSProperties}
    >
      <div className="st-service-copy">
        <SplitHeading text={service.name} className="st-service-name" />
        <p className="st-service-tagline">{service.line}</p>
        <SplitHeading as="h3" text={service.title} />
        <Reveal delay={0.18}>
          <p className="st-service-description">{service.description}</p>
        </Reveal>
        <ul>
          {service.items.map((item) => (
            <li key={item}>
              <span aria-hidden="true">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <motion.div
        className={serviceArtStyles.art}
        aria-hidden="true"
        style={
          {
            "--service-art-color": artwork.color,
            ...(reduced ? {} : { y, rotate }),
          } as React.CSSProperties & {
            y?: MotionValue<number>;
            rotate?: MotionValue<number>;
          }
        }
      >
        <div className={serviceArtStyles.header}>
          <span>Tea Rose / The {service.name.toLowerCase()} blend</span>
          <span className={serviceArtStyles.number}>{service.number}</span>
        </div>
        <motion.div
          className={serviceArtStyles.illustration}
          style={reduced ? undefined : { scale: artScale }}
        >
          <Image
            src={`/services/${service.name.toLowerCase()}.webp`}
            alt=""
            fill
            sizes="(max-width: 760px) 85vw, 42vw"
          />
        </motion.div>
        <div className={serviceArtStyles.footer}>
          <span>{artwork.caption}</span>
        </div>
      </motion.div>
    </article>
  );
}

export function StudioServices({
  standalone = false,
}: {
  standalone?: boolean;
}) {
  return (
    <section className="st-services-section" id="services">
      <div className="st-section st-services-heading">
        <SplitHeading
          text={"Branding, Marketing &\nDesign Services That Get Results"}
          className="st-heading"
          accent="Results"
          as={standalone ? "h1" : "h2"}
        />
        <Reveal>
          <p className="st-section-description">
            One team for strategy, design, marketing, branding and launches. No
            scattered vendors and no mixed messages.
          </p>
        </Reveal>
        <nav aria-label="Our service disciplines" className="st-discipline-nav">
          {services.map((service) => (
            <a key={service.name} href={`#${service.name.toLowerCase()}`}>
              <span>{service.number}</span>
              {service.name}
            </a>
          ))}
        </nav>
      </div>
      <div className="st-service-stack">
        {services.map((service, index) => (
          <ServiceCard service={service} index={index} key={service.name} />
        ))}
      </div>
      {!standalone && (
        <div className="st-services-footer">
          <StudioLink href="/services" className="st-text-link">
            Explore the full blend{" "}
          </StudioLink>
        </div>
      )}
    </section>
  );
}

export function StudioLaunch() {
  return (
    <section
      className="st-section st-launch [--heading-accent-start:#300e20] [--heading-accent-middle:#67213f] [--heading-accent-end:#300e20]"
      id="launch-24"
    >
      <div className="st-launch-title">
        <SplitHeading text="Launch" className="st-launch-word" />
        <span className="st-launch-number" aria-label="24">
          24
        </span>
      </div>
      <div className="st-launch-bottom">
        <div>
          <SplitHeading
            as="h3"
            text={"Pour it hot.\nLaunch loud."}
            accent="loud."
          />
          <Reveal>
            <p className="mt-[22px] max-w-[42ch] text-base leading-[1.9]">
              Launch 24 is our full-service launch team. We plan it, run it and
              make sure everyone’s talking about it.
            </p>
          </Reveal>
        </div>
        <div className="st-launch-list">
          {launchItems.map((item, i) => (
            <FoldRow key={item}>
              <div className="st-launch-row">
                <span className="st-label">0{i + 1}</span>
                <p>{item}</p>
              </div>
            </FoldRow>
          ))}
        </div>
      </div>
    </section>
  );
}

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
    [0, 0, -Math.PI, -Math.PI],
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

export function StudioWhy() {
  return (
    <section className="st-section st-why" id="why-tea-rose">
      <SplitHeading
        text={"Why Choose a\nDesign-Led Branding Agency?"}
        className="st-heading"
        accent="Design-Led"
      />
      <div className="st-reasons">
        {reasons.map((reason, i) => (
          <Reveal key={reason.title} delay={i * 0.06}>
            <span className="st-label">0{i + 1}</span>
            <SplitHeading as="h3" text={reason.title} />
            <p>{reason.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

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
  return (
    <section
      className={founderStyles.section}
      id="founder"
      aria-labelledby="founder-title"
    >
      <div className={founderStyles.layout}>
        <figure className={founderStyles.portrait}>
          <div ref={ref} className={founderStyles.photo}>
            <motion.div
              className={founderStyles.photoMotion}
              style={reduced ? undefined : { y }}
            >
              <Image
                src="/founder.webp"
                fill
                alt="Trishi Jain enjoying a cup of tea by a sunlit window"
                sizes="(max-width: 760px) 85vw, 42vw"
              />
            </motion.div>
          </div>
          <figcaption className={founderStyles.caption}>
            <span className={founderStyles.name}>Trishi Jain</span>
            <span className={founderStyles.role}>
              Founder
              <br />
              Tea Rose Design Studio
            </span>
          </figcaption>
        </figure>
        <div className={founderStyles.copy}>
          <span className={`st-label ${founderStyles.eyebrow}`}>
            A creative heart. A curious mind.
          </span>
          <div id="founder-title">
            <SplitHeading
              text={"Meet the Girl\nBehind the Tea"}
              className={founderStyles.title}
              accent="Tea"
              as={standalone ? "h1" : "h2"}
            />
          </div>
          <Reveal>
            <p className={founderStyles.intro}>
              <span>Hi, I’m Trishi Jain.</span> I’m a creative at heart, a tea
              lover by habit and someone who can never resist spilling the tea.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className={founderStyles.story}>
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
          <div className={founderStyles.signoff}>
            <p>That’s Tea Rose.</p>
            <Magnetic>
              <a href="#contact" className={founderStyles.link}>
                Let’s talk over tea{" "}
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}

function BookingButton() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Magnetic>
        <Dialog.Trigger className="st-button st-button-pink">
          Book a Free Chat{" "}
        </Dialog.Trigger>
      </Magnetic>
      <Dialog.Portal>
        <Dialog.Backdrop className="st-booking-backdrop" />
        <Dialog.Popup className="st-booking-popup">
          <Dialog.Close
            className="st-booking-close"
            aria-label="Close booking information"
          >
            Close
          </Dialog.Close>
          <span className="st-label">Tea Rose Design Studio</span>
          <Dialog.Title>Let’s put the kettle on.</Dialog.Title>
          <Dialog.Description>
            Online booking isn’t available yet. In the meantime, explore what we
            can brew for your brand.
          </Dialog.Description>
          <StudioLink
            href="/services"
            className="st-text-link"
            onClick={() => setOpen(false)}
          >
            See Our Services{" "}
          </StudioLink>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function StudioContact() {
  return (
    <section className="st-contact" id="contact">
      <div className="st-section st-contact-main">
        <span className="st-label">Good conversations. Great brands.</span>
        <SplitHeading
          text="Spill the Tea."
          accent="Tea."
          className="st-contact-title"
        />
        <div className="st-contact-bottom">
          <ScrubText text="A good conversation leads to a good idea, and a good idea leads to design that works." />
          <BookingButton />
        </div>
        <div className="st-footer">
          <StudioLink href="/" className="st-footer-brand">
            Tea Rose<span>DESIGN STUDIO</span>
          </StudioLink>
          <span className="st-label">India & beyond</span>
          <a href="#" className="st-text-link">
            Back to top{" "}
          </a>
        </div>
      </div>
    </section>
  );
}
