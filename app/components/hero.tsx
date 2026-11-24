"use client";

import Image from "next/image";
import teaIllustration from "@/public/home.webp";
import { AnimatedHeading, AnimatedReveal } from "./animated-heading";

const disciplines = ["Strategy", "Design", "Marketing", "Branding", "Launches"];

export default function Hero() {
  return (
    <div className="relative isolate flex h-full w-full max-w-[1440px] flex-col pt-[108px] text-left text-foreground max-[600px]:pt-24 max-[600px]:short:pt-[86px]">
      <div className="relative grid min-h-0 flex-1 grid-cols-[1.15fr_.85fr] items-center gap-6 max-lg:grid-cols-1">
        <div className="relative z-[2] py-7 max-lg:max-w-[680px] max-[600px]:py-[22px] short:py-4">
          <AnimatedReveal delay={0}>
            <p className="mb-[26px] font-mono text-sm/[1.6] uppercase tracking-[.1em] text-[#ffadcc] max-[600px]:mb-[21px] short:mb-4 max-[600px]:short:mb-3">
              Tea Rose Design Studio
            </p>
          </AnimatedReveal>
          <AnimatedHeading
            as="h1"
            waitForIntro
            className="text-[clamp(60px,8.6vw,132px)]"
            lines={[
              { text: "Spill the Tea.", accentWords: ["Tea."] },
              {
                text: "We’ll Do the Rest.",
                className:
                  "pt-4 font-sans text-[clamp(27px,3.15vw,46px)] tracking-[-.035em]",
              },
            ]}
          />
          <AnimatedReveal className="mt-7 max-[600px]:mt-[22px] short:mt-[18px]">
            <p className="max-w-[39ch] text-lg/[1.75] text-[#e0c8d5] text-pretty max-[600px]:max-w-[32ch] max-[600px]:short:leading-[1.6]">
              A creative branding and digital marketing agency for brands across
              India and around the world.
            </p>
            <p className="mt-[25px] text-sm/[1.6] text-muted-foreground max-[600px]:mt-5 short:mt-4 max-[600px]:short:hidden">
              Good conversations. Great brands.
            </p>
          </AnimatedReveal>
        </div>
        <div
          className="pointer-events-none relative min-w-0 self-stretch max-lg:absolute max-lg:inset-y-0 max-lg:-right-[70px] max-lg:z-0 max-lg:w-[55%] max-lg:opacity-[.22] max-[600px]:top-[8%] max-[600px]:-right-[90px] max-[600px]:w-[300px] max-[600px]:opacity-[.16]"
          aria-hidden="true"
        >
          <div className="absolute inset-x-[-10%] inset-y-[12%] bg-[radial-gradient(ellipse,#ff237e12,transparent_68%)]" />
          <div className="absolute inset-[-5%_-6%_-6%_-12%] max-lg:inset-0 rotate-[-3deg] animate-[tea-float_9s_ease-in-out_infinite] motion-reduce:animate-none">
            <Image
              src={teaIllustration}
              alt=""
              fill
              sizes="(min-width: 1024px) 46vw, (min-width: 600px) 55vw, 300px"
              className="object-contain object-center drop-shadow-[var(--illustration-shadow)]"
              preload
            />
          </div>
        </div>
      </div>
      <footer className="relative z-[2] flex flex-wrap items-center justify-between gap-x-8 gap-y-[18px] border-t border-t-[#fff3f726] py-6 max-[600px]:py-[18px] short:py-4">
        <p className="max-w-[50ch] text-sm/[1.8] text-[#e0c8d5]">
          {disciplines.join(". ")}.
        </p>
        <p className="font-mono text-sm/[1.6] text-muted-foreground max-[600px]:hidden">
          India &amp; beyond
        </p>
      </footer>
    </div>
  );
}
