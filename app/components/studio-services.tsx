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

const serviceCardColor = [
  "bg-[#e7c4cd]",
  "bg-[#edb08d]",
  "bg-[#f0dfe3]",
  "bg-[#a83564] text-[#fff1f6] [&_li]:border-t-[#fff1f633]",
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
    const publish = () =>
      card.style.setProperty("--card-h", `${card.offsetHeight}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(card);
    return () => observer.disconnect();
  }, []);
  return (
    <article
      id={service.name.toLowerCase()}
      className={`scroll-mt-[110px] sticky top-[calc(96px+var(--card-order)*8px)] grid min-h-[min(710px,85svh)] grid-cols-2 gap-[6%] rounded-t-xl border-t border-t-[#2c142244] p-[clamp(30px,4vw,65px)] shadow-[0_-15px_55px_#2c142212] max-[1000px]:gap-[5%] min-[761px]:short-800:min-h-[570px] min-[761px]:short-800:p-[28px_40px] max-[760px]:top-[min(calc(88px+var(--card-order)*8px),calc(100svh-var(--card-h,0px)-12px))] max-[760px]:min-h-0 max-[760px]:grid-cols-1 max-[760px]:gap-[30px] max-[760px]:rounded-t-[20px] max-[760px]:p-[35px_24px] ${serviceCardColor[index]}`}
      ref={ref}
      style={{ "--card-order": index } as React.CSSProperties}
    >
      <div className="relative z-[1]">
        <SplitHeading
          text={service.name}
          className="mt-5 mb-[0.25em] text-[clamp(48px,6vw,100px)] font-normal tracking-[-.07em] leading-[1.35] min-[761px]:short-800:mt-3 min-[761px]:short-800:text-[55px] max-[760px]:text-[55px]"
        />
        <p className="font-display mt-[14px] text-[clamp(18px,2.2vw,30px)]/[1.5] italic min-[761px]:short-800:mt-2 min-[761px]:short-800:text-[20px]">
          {service.line}
        </p>
        <SplitHeading
          as="h3"
          text={service.title}
          className="mt-[27px] text-[25px] font-normal min-[761px]:short-800:mt-[15px]"
        />
        <Reveal delay={0.18}>
          <p className="mt-[10px] max-w-[48ch] text-lg/[1.8] opacity-75">
            {service.description}
          </p>
        </Reveal>
        <ul className="mt-[22px] min-[761px]:short-800:mt-[15px]">
          {service.items.map((item) => (
            <li
              key={item}
              className="flex items-baseline gap-[14px] border-t border-t-[#2c142222] py-2 text-lg/[1.7] min-[761px]:short-800:py-[5px]"
            >
              <span aria-hidden="true" className="flex-none">
                •
              </span>
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
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#2c142240] font-mono text-sm max-[760px]:size-[30px]">
            {service.number}
          </span>
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
    <section
      className="relative bg-[#e9dfd9] text-[var(--ink)] [--heading-accent-end:#8e254e] [--heading-accent-middle:#a73560] [--heading-accent-start:#752647]"
      id="services"
    >
      <div className="relative py-[clamp(70px,10vw,150px)] px-[max(clamp(24px,5vw,80px),calc((100%-1680px)/2))] pb-[70px] max-[760px]:pb-[45px]">
        <SplitHeading
          text={"Branding, Marketing &\nDesign Services That Get Results"}
          className="max-w-[22ch] text-[clamp(38px,5.2vw,82px)] font-normal tracking-[-.055em] leading-[1.12]"
          accent="Results"
          as={standalone ? "h1" : "h2"}
        />
        <Reveal>
          <p className="mt-7 max-w-[50ch] text-[17px] text-[#725661] leading-[1.85]">
            One team for strategy, design, marketing, branding and launches. No
            scattered vendors and no mixed messages.
          </p>
        </Reveal>
        <nav
          aria-label="Our service disciplines"
          className="mt-8 flex flex-wrap gap-3 max-[760px]:gap-2"
        >
          {services.map((service) => (
            <a
              key={service.name}
              href={`#${service.name.toLowerCase()}`}
              className="inline-flex items-center gap-[18px] rounded-full border border-[#2c142233] px-[18px] py-3 text-sm transition-colors duration-200 hover:bg-[var(--ink)] hover:text-[var(--paper)] max-[760px]:gap-[10px] max-[760px]:px-[14px] max-[760px]:py-[10px]"
            >
              <span className="font-mono text-sm opacity-65">
                {service.number}
              </span>
              {service.name}
            </a>
          ))}
        </nav>
      </div>
      <div className="px-[clamp(16px,3vw,48px)] max-[760px]:px-2">
        {services.map((service, index) => (
          <ServiceCard service={service} index={index} key={service.name} />
        ))}
      </div>
      {!standalone && (
        <div className="pt-10 pr-[5vw] pb-[70px] pl-[5vw] text-right max-[760px]:pt-[30px] max-[760px]:px-6 max-[760px]:pb-[50px]">
          <StudioLink href="/services" className="inline-flex min-h-[44px] items-center justify-between gap-[30px] border-b border-b-current py-[10px] text-base transition-opacity duration-200 hover:opacity-65">
            Explore the full blend{" "}
          </StudioLink>
        </div>
      )}
    </section>
  );
}
