"use client";

import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { services } from "@/lib/studio-content";
import { Reveal, SplitHeading } from "./studio-motion";
import { usePrefersReducedMotion } from "./studio-reduced-motion";
import { StudioLink } from "./studio-navigation";

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
  // Phone cards are taller than the screen, so the stack pins them by their bottom edge.
  // Publish the card height so CSS can compute that pin position without scroll handlers.
  useEffect(() => {
    const card = ref.current;
    if (!card) return;
    const publish = () => card.style.setProperty("--card-h", `${card.offsetHeight}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(card);
    return () => observer.disconnect();
  }, []);
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
        className="relative isolate flex aspect-square min-h-[390px] w-full flex-col self-center overflow-hidden rounded-[28px] border border-[#2c14221c] bg-[radial-gradient(ellipse_at_50%_40%,#ffffff75,transparent_70%)] bg-[color:var(--service-art-color)] p-[clamp(22px,2.2vw,34px)] text-[#2c1422] shadow-[inset_0_2px_2px_#ffffff80,0_24px_35px_-28px_#2c142260] min-[761px]:short-800:max-h-[490px] min-[761px]:short-800:min-h-[350px] max-[760px]:mx-auto max-[760px]:min-h-[310px] max-[760px]:w-[min(100%,480px)] max-[760px]:rounded-3xl max-[760px]:p-[22px]"
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
        <div className="flex items-center justify-between gap-4 [&>span:first-child]:font-mono [&>span:first-child]:text-sm/[1.5] [&>span:first-child]:tracking-[.09em] [&>span:first-child]:uppercase">
          <span>Tea Rose / The {service.name.toLowerCase()} blend</span>
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#2c142240] font-mono text-sm max-[760px]:size-[30px]">{service.number}</span>
        </div>
        <motion.div
          className="relative mt-2 mb-4 min-h-0 flex-1 mix-blend-multiply [&_img]:object-contain"
          style={reduced ? undefined : { scale: artScale }}
        >
          <Image
            src={`/services/${service.name.toLowerCase()}.webp`}
            alt=""
            fill
            sizes="(max-width: 760px) 85vw, 42vw"
          />
        </motion.div>
        <div className="flex items-center justify-between gap-5 border-t border-t-[#2c142225] pt-4 [&>span]:font-display [&>span]:text-[clamp(21px,2.1vw,30px)]/[1.15] [&>span]:tracking-[-.025em] [&>span]:italic max-[760px]:[&>span]:text-[23px]">
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
