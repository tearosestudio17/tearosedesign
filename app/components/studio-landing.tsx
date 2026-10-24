"use client";

import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowUpRight, Flower2, X } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { industries, launchItems, reasons, services } from "@/lib/studio-content";
import { FoldRow, Magnetic, Reveal, ScrubText, SplitHeading } from "./studio-motion";
import { StudioLink } from "./studio-navigation";

export function StudioAboutIntro() {
  return <section className="st-section st-intro" id="about">
    <div className="st-section-top"><span className="st-label">02 / A little introduction</span><Flower2 strokeWidth={1} /></div>
    <ScrubText text="We’re Tea Rose Design Studio. We mix research, design and marketing to help brands look sharper, sound clearer and grow faster." />
    <div className="st-intro-bottom"><div><p>We believe tea solves everything. A good conversation leads to a good idea, and a good idea leads to design that works.</p><p>One team for strategy, design, marketing, branding and launches. No scattered vendors and no mixed messages.</p></div><Magnetic><StudioLink href="/services" className="st-text-link">Explore our services <ArrowUpRight size={18} /></StudioLink></Magnetic></div>
  </section>;
}

function ServiceCard({ service, index }: { service: typeof services[number]; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 15%"] });
  const y = useTransform(scrollYProgress, [0, 1], [65, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [3, 0]);
  return <article id={service.name.toLowerCase()} className={`st-service-card st-service-${index}`} ref={ref} style={{ "--card-order": index } as React.CSSProperties}>
    <div className="st-service-copy">
      <span className="st-label">{service.number} / Our services</span>
      <SplitHeading text={service.name} className="st-service-name" />
      <p className="st-service-tagline">{service.line}</p>
      <SplitHeading as="h3" text={service.title} /><Reveal delay={0.18}><p className="st-service-description">{service.description}</p></Reveal>
      <ul>{service.items.map((item) => <li key={item}><span aria-hidden="true">↗</span>{item}</li>)}</ul>
    </div>
    <motion.div className={`st-service-art st-art-${index}`} aria-hidden="true" style={reduced ? undefined : { y, rotate }}>
      <span className="st-art-caption">TEA ROSE / {service.name.toUpperCase()}</span>
      {index === 0 && <div className="st-orbit-art"><i /><i /><i /><span /></div>}
      {index === 1 && <div className="st-design-art"><Flower2 strokeWidth={0.6} /><span /></div>}
      {index === 2 && <div className="st-signal-art">{[0, 1, 2, 3, 4, 5, 6].map((n) => <i key={n} style={{ "--bar": n } as React.CSSProperties} />)}</div>}
      {index === 3 && <div className="st-brand-art"><span>t</span><span>r<span className="st-art-dot">.</span></span></div>}
      <span className="st-art-foot">Thoughtfully blended. / {service.number}</span>
    </motion.div>
  </article>;
}

export function StudioServices({ standalone = false }: { standalone?: boolean }) {
  return <section className="st-services-section" id="services">
    <div className="st-section st-services-heading"><div className="st-section-top"><span className="st-label">{standalone ? "01" : "03"} / Our services</span><span className="st-label">Four disciplines. One thoughtful team.</span></div><SplitHeading text={"Branding, Marketing &\nDesign Services That Get Results"} className="st-heading" accent="Results" as={standalone ? "h1" : "h2"} /><Reveal><p className="st-section-description">One team for strategy, design, marketing, branding and launches. No scattered vendors and no mixed messages.</p></Reveal><nav aria-label="Our service disciplines" className="st-discipline-nav">{services.map(service => <a key={service.name} href={`#${service.name.toLowerCase()}`}><span>{service.number}</span>{service.name}<ArrowUpRight size={14} /></a>)}</nav></div>
    <div className="st-service-stack">{services.map((service, index) => <ServiceCard service={service} index={index} key={service.name} />)}</div>
    {!standalone && <div className="st-services-footer"><StudioLink href="/services" className="st-text-link">Explore the full blend <ArrowUpRight size={18} /></StudioLink></div>}
  </section>;
}

export function StudioLaunch({ number = "04" }: { number?: string }) {
  return <section className="st-section st-launch [--heading-accent-start:#300e20] [--heading-accent-middle:#67213f] [--heading-accent-end:#300e20]" id="launch-24">
    <div className="st-section-top"><span className="st-label">{number} / Product Launch, Event & Influencer Marketing</span><span className="st-label">Pour it hot. Launch loud.</span></div>
    <div className="st-launch-title"><SplitHeading text="Launch" className="st-launch-word" /><span className="st-launch-number" aria-label="24">24<ArrowUpRight aria-hidden="true" /></span></div>
    <div className="st-launch-bottom"><div><SplitHeading as="h3" text={"Pour it hot.\nLaunch loud."} accent="loud." /><Reveal><p className="mt-[22px] max-w-[42ch] text-sm leading-[1.9]">Launch 24 is our full-service launch team. We plan it, run it and make sure everyone’s talking about it.</p></Reveal></div><div className="st-launch-list">{launchItems.map((item, i) => <FoldRow key={item}><div className="st-launch-row"><span className="st-label">0{i + 1}</span><p>{item}</p><ArrowUpRight size={18} /></div></FoldRow>)}</div></div>
  </section>;
}

const industryArtwork = [
  "food-beverage", "hospitality-hotels", "fashion-lifestyle",
  "jewellery-luxury", "media-communication", "weddings-events",
  "healthcare", "pharma-life-sciences", "industrial-manufacturing",
];

function IndustryGridCard({ industry, index, progress, reduced, viewport }: {
  industry: string;
  index: number;
  progress: MotionValue<number>;
  reduced: boolean | null;
  viewport: { width: number; height: number };
}) {
  const { width, height } = viewport;
  const cardSize = Math.min(150, Math.max(104, width * 0.1));
  const ringRadius = Math.max(cardSize * 1.5, Math.min(245, width * 0.17, height * 0.5 - 130));
  const rowStep = (width - Math.max(24, width * 0.03) * 2 - cardSize) / 8;
  const angle = (-90 + index * 40) * Math.PI / 180;
  const rowX = (index - 4) * rowStep - width * 0.15 - cardSize / 2;
  const rowY = height * 0.23 - cardSize / 2;
  const ringX = Math.cos(angle) * ringRadius - cardSize / 2;
  const ringY = Math.sin(angle) * ringRadius - cardSize / 2;
  const x = useTransform(progress, [0, 0.16, 0.76, 1], [rowX, rowX, ringX, ringX]);
  const y = useTransform(progress, [0, 0.16, 0.76, 1], [rowY, rowY, ringY, ringY]);

  return <motion.li className="st-industry-item" style={reduced ? undefined : { x, y }}>
    <article className="st-industry-card">
      <Image src={`/industries/${industryArtwork[index]}-card.webp`} width={768} height={768} alt="" sizes="(max-width: 760px) 45vw, 200px" />
      <h3 className="sr-only">{industry}</h3>
    </article>
  </motion.li>;
}

export function StudioIndustries() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [viewport, setViewport] = useState({ width: 1440, height: 900 });
  const scrollYProgress = useMotionValue(0);
  const orbitOpacity = useTransform(scrollYProgress, [0.24, 0.6, 0.76], [0, 0.35, 1]);
  const orbitScale = useTransform(scrollYProgress, [0.24, 0.76], [0.8, 1]);

  useEffect(() => {
    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section) return;
      const scrollableDistance = section.offsetHeight - window.innerHeight;
      const progress = scrollableDistance > 0 ? -section.getBoundingClientRect().top / scrollableDistance : 0;
      section.dataset.debugProgress = progress.toFixed(3);
      scrollYProgress.set(Math.max(0, Math.min(1, progress)));
    };
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      updateProgress();
    };
    updateViewport();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateViewport);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateViewport);
    };
  }, [scrollYProgress]);

  const cardSize = Math.min(150, Math.max(104, viewport.width * 0.1));
  const ringRadius = Math.max(cardSize * 1.5, Math.min(245, viewport.width * 0.17, viewport.height * 0.5 - 130));

  return <section className="st-industries" id="industries" ref={sectionRef}>
    <div className="st-industry-stage">
      <div className="st-section-top"><span className="st-label">05 / Industries we work with</span><Flower2 strokeWidth={1} /></div>
      <div className="st-industry-center">
        <span className="st-label">A studio for every story</span>
        <h2 className="st-heading">Different worlds.<br /><em>One thoughtful studio.</em></h2>
        <p>Branding and marketing shaped around the people you want to reach.</p>
        <span className="st-industry-scroll">Scroll to explore all nine ↘</span>
      </div>
      <motion.div className="st-industry-orbit" aria-hidden="true" style={{ left: `calc(65% - ${ringRadius}px)`, top: `calc(55% - ${ringRadius}px)`, width: ringRadius * 2, height: ringRadius * 2, opacity: orbitOpacity, scale: orbitScale }}>
        <div className="st-industry-orbit-center"><Flower2 strokeWidth={1} /><span>Nine worlds.<br />One studio.</span></div>
      </motion.div>
      <ul className={`st-industry-list${reduced ? " st-industry-static" : ""}`} aria-label="Industries we work with">
        {industries.map((industry, index) => <IndustryGridCard key={industry} industry={industry} index={index} progress={scrollYProgress} reduced={reduced} viewport={viewport} />)}
      </ul>
    </div>
  </section>;
}

export function StudioWhy({ number = "06" }: { number?: string }) {
  return <section className="st-section st-why" id="why-tea-rose">
    <div className="st-section-top"><span className="st-label">{number} / Why Tea Rose</span><span className="st-label">A considered approach. At every step.</span></div>
    <SplitHeading text={"Why Choose a\nDesign-Led Branding Agency?"} className="st-heading" accent="Design-Led" />
    <div className="st-reasons">{reasons.map((reason, i) => <Reveal key={reason.title} delay={i * 0.06}><span className="st-label">0{i + 1}</span><SplitHeading as="h3" text={reason.title} /><p>{reason.text}</p></Reveal>)}</div>
  </section>;
}

export function StudioFounder({ standalone = false }: { standalone?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const reduced = useReducedMotion();
  return <section className="st-section st-founder" id="founder">
    <div className="st-section-top"><span className="st-label">{standalone ? "01" : "07"} / The founder story</span><span className="st-label">Pull up a chair. The kettle’s on.</span></div>
    <div className="st-founder-grid"><div ref={ref} className="st-founder-image"><motion.div style={reduced ? undefined : { y }}><Image src="/founder.webp" width={1080} height={1350} alt="The girl behind Tea Rose, with a cup of tea" sizes="(max-width: 760px) 90vw, 42vw" /></motion.div><span className="st-photo-caption">Trishi Jain / Tea Rose Design Studio</span></div>
      <div className="st-founder-copy"><SplitHeading text={"Meet the Girl\nBehind the Tea"} className="st-heading" accent="Tea" as={standalone ? "h1" : "h2"} />
        <Reveal><p className="st-founder-intro">Hi, I’m Trishi Jain. I’m a creative at heart, a tea lover by habit and someone who can never resist spilling the tea.</p><p>I’ve always seen the world through a creative lens. A café menu, a shop sign, a wedding card. Everything tells a story, and I couldn’t stop noticing which ones told it well.</p><p>Somewhere between countless cups of tea and a lot of notebooks, an idea took shape. A studio where brands get honest conversations, real insight and design that actually means something.</p><p className="st-founder-signature">That’s Tea Rose.<br />Pull up a chair. The kettle’s on.</p></Reveal>
      </div>
    </div>
  </section>;
}

function BookingButton() {
  const [open, setOpen] = useState(false);
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Magnetic><Dialog.Trigger className="st-button st-button-pink">Book a Free Chat <ArrowUpRight size={18} /></Dialog.Trigger></Magnetic>
    <Dialog.Portal><Dialog.Backdrop className="st-booking-backdrop" /><Dialog.Popup className="st-booking-popup"><Dialog.Close className="st-booking-close" aria-label="Close booking information"><X size={22} /></Dialog.Close><Flower2 size={40} strokeWidth={1} /><span className="st-label">Tea Rose Design Studio</span><Dialog.Title>Let’s put the kettle on.</Dialog.Title><Dialog.Description>Online booking isn’t available yet. In the meantime, explore what we can brew for your brand.</Dialog.Description><StudioLink href="/services" className="st-text-link" onClick={() => setOpen(false)}>See Our Services <ArrowUpRight size={18} /></StudioLink></Dialog.Popup></Dialog.Portal>
  </Dialog.Root>;
}

export function StudioContact() {
  return <section className="st-contact" id="contact">
    <div className="st-section st-contact-main"><span className="st-label">Good conversations. Great brands.</span><SplitHeading text="Spill the Tea." accent="Tea." className="st-contact-title" /><div className="st-contact-bottom"><ScrubText text="A good conversation leads to a good idea, and a good idea leads to design that works." /><BookingButton /></div><div className="st-footer"><StudioLink href="/" className="st-footer-brand">Tea Rose<span>DESIGN STUDIO</span></StudioLink><span className="st-label">India & beyond</span><a href="#" className="st-text-link">Back to top <ArrowUpRight size={16} /></a></div></div>
  </section>;
}
