"use client";

import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  Flower2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import teaIllustration from "@/public/home.webp";
import { Magnetic } from "./studio-motion";
import { AnimatedHeading, AnimatedReveal } from "./animated-heading";

interface HeroProps {
  /** Booking page, WhatsApp link, or mailto address for the primary CTA. */
  bookingHref?: string;
}

const services = [
  {
    name: "Strategy",
    line: "Here’s the tea. Plan before pixels.",
    description:
      "We study your market, audience and competitors, then turn those insights into a clear plan.",
  },
  {
    name: "Design",
    line: "Steeped in design principles.",
    description: "Design backed by research, so every visual has a reason.",
  },
  {
    name: "Marketing",
    line: "Positivi-tea, amplified.",
    description:
      "We plan and run digital campaigns that reach the right people in India and globally, and turn attention into customers.",
  },
  {
    name: "Branding",
    line: "Your brand, freshly brewed.",
    description:
      "From a first-time brand to a full refresh, we build a look, voice and story that stay consistent everywhere.",
  },
  {
    name: "Launch 24",
    line: "Pour it hot. Launch loud.",
    description:
      "Launch 24 is our full-service launch team. We plan it, run it and make sure everyone’s talking about it.",
  },
];

type HeroPanel = "services" | "studio" | "booking";

export default function Hero({ bookingHref }: HeroProps) {
  const [panel, setPanel] = useState<HeroPanel>("services");
  const [open, setOpen] = useState(false);

  function showPanel(nextPanel: HeroPanel) {
    setPanel(nextPanel);
    setOpen(true);
  }

  return (
    <div className="relative flex h-full w-full max-w-[1440px] flex-col text-left text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-6 inset-y-0 bg-linear-to-r from-background/70 via-background/25 to-transparent sm:-inset-x-14 lg:from-background/75 lg:via-background/25"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-1/4 top-1/4 h-1/2 w-full rounded-full bg-[radial-gradient(ellipse,var(--hero-glow),transparent_70%)]"
      />
      <div className="h-24 shrink-0" aria-hidden="true" />

      <div className="relative grid min-h-0 flex-1 items-center lg:grid-cols-[1.15fr_0.85fr] lg:gap-2">
        <div className="relative z-10 py-8 sm:py-10 lg:py-7">
          {/* <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/5 px-3.5 py-2 font-mono text-[8px] uppercase tracking-[0.12em] text-foreground/75 backdrop-blur-sm sm:mb-7 sm:text-[9px]">
            <span className="relative flex size-1.5" aria-hidden="true">
              <span className="absolute inline-flex size-full rounded-full bg-accent opacity-70 motion-safe:animate-ping" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
            </span>
            A little tea. A lot of possibility.
          </div> */}

          <AnimatedHeading
            as="h1"
            waitForIntro
            className="text-[clamp(60px,8.6vw,132px)]"
            lines={[
              { text: "Spill the Tea.", accentWords: ["Tea."] },
              {
                text: "We’ll Do the Rest.",
                className:
                  "pt-4 font-sans text-[clamp(27px,3.15vw,46px)] tracking-[-0.035em]",
              },
            ]}
          />

          <AnimatedReveal>
            <p className="mt-6 max-w-[38ch] text-[15px] leading-[1.75] text-muted-foreground sm:mt-7 sm:text-base lg:text-[17px]">
              A creative branding and digital marketing agency for brands across
              India and around the world.
            </p>

            {/* <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4">
              {bookingHref ? (
                <Button
                  render={<a href={bookingHref} />}
                  nativeButton={false}
                  size="lg"
                  className="group h-12 rounded-full px-6 text-[13px] shadow-(--button-glow) transition-[opacity,box-shadow] sm:h-14 sm:px-7 sm:text-sm"
                >
                  Book a Free Chat{" "}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="ml-1 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </Button>
              ) : (
                <Button
                  onClick={() => showPanel("booking")}
                  size="lg"
                  className="group h-12 rounded-full px-6 text-[13px] shadow-(--button-glow) transition-[opacity,box-shadow] sm:h-14 sm:px-7 sm:text-sm"
                >
                  Book a Free Chat{" "}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="ml-1 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </Button>
              )}
              <Magnetic>
                <Button
                  variant="outline"
                  size="lg"
                  render={<a href="#services" />}
                  nativeButton={false}
                  className="h-12 rounded-full border-foreground/20 bg-background/50 px-5 text-[13px] text-foreground backdrop-blur-sm sm:h-14 sm:px-6 sm:text-sm"
                >
                  See Our Services{" "}
                  <ArrowDownRight aria-hidden="true" className="ml-1" />
                </Button>
              </Magnetic>
            </div> */}

            <div className="mt-7 flex items-center gap-3 text-[10px] text-muted-foreground sm:mt-8 sm:text-xs">
              <span className="h-px w-7 bg-foreground/25" aria-hidden="true" />
              Good conversations. Great brands.
            </div>
          </AnimatedReveal>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 bottom-0 h-[450px] w-[300px] opacity-15 sm:-right-12 sm:h-[550px] sm:w-[370px] lg:relative lg:inset-auto lg:h-full lg:min-h-0 lg:w-full lg:opacity-100"
        >
          <div className="absolute left-[4%] top-[14%] hidden h-[66%] w-[88%] -rotate-20 rounded-[50%] border border-accent/15 lg:block" />
          <div className="absolute left-[12%] top-[12%] hidden h-[70%] w-[74%] rotate-25 rounded-[50%] border border-secondary/10 lg:block" />
          <div className="absolute inset-x-0 top-1/4 aspect-square rounded-full bg-[radial-gradient(ellipse,var(--illustration-glow),transparent_67%)]" />
          <span className="absolute right-0 top-[16%] hidden rotate-90 font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/40 xl:block">
            Ideas, freshly brewed.
          </span>
          <div className="hero-illustration absolute -inset-x-5 -bottom-[9%] top-[2%] lg:-left-10 lg:-right-2 lg:-top-3">
            <Image
              src={teaIllustration}
              alt=""
              fill
              sizes="(min-width: 1024px) 48vw, 390px"
              className="object-contain object-center drop-shadow-(--illustration-shadow)"
              preload
            />
          </div>
          <div className="absolute bottom-[12%] right-[8%] hidden -rotate-12 rounded-full border border-accent/25 bg-surface/80 px-5 py-4 text-center backdrop-blur-md lg:block">
            <Flower2
              className="mx-auto mb-2 size-5 text-accent"
              strokeWidth={1.3}
            />
            <p className="font-display text-xl italic leading-tight">
              Brewed on
              <br />
              strategy.
            </p>
          </div>
        </div>
      </div>

      <footer className="relative z-10 flex shrink-0 items-end justify-between gap-4 border-t border-foreground/10 py-5 sm:py-6">
        <p className="max-w-[25ch] font-mono text-[8px] uppercase leading-relaxed tracking-[0.12em] text-muted-foreground sm:max-w-none sm:text-[10px]">
          Strategy. Design. Marketing. Branding. Launches.
        </p>
        <span className="flex shrink-0 items-center gap-3 text-[9px] uppercase tracking-[0.18em] text-foreground/70 sm:text-[10px]">
          Scroll to steep{" "}
          <ArrowDown aria-hidden="true" className="size-3.5 text-accent" />
        </span>
      </footer>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-background/75 backdrop-blur-sm" />
          <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[85dvh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-foreground/15 bg-surface p-6 font-sans text-foreground shadow-2xl shadow-shadow/60 outline-none sm:p-10">
            <Dialog.Close
              aria-label="Close dialog"
              className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full text-foreground/60 hover:bg-foreground/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
            >
              <X className="size-5" aria-hidden="true" />
            </Dialog.Close>
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-accent">
              Tea Rose Design Studio
            </p>
            <Dialog.Title className="max-w-[20ch] pr-5 font-display text-3xl font-normal leading-tight tracking-tight sm:text-4xl">
              {panel === "services"
                ? "A little strategy. A lot of possibility."
                : panel === "studio"
                  ? "A Creative Agency Brewed on Strategy"
                  : "Let’s put the kettle on."}
            </Dialog.Title>
            <Dialog.Description className="mt-4 text-sm leading-relaxed text-foreground/60 sm:text-base">
              {panel === "services"
                ? "Branding, marketing & design services that get results."
                : panel === "studio"
                  ? "We’re Tea Rose Design Studio. We mix research, design and marketing to help brands look sharper, sound clearer and grow faster."
                  : "A good conversation leads to a good idea, and a good idea leads to design that works."}
            </Dialog.Description>
            {panel === "services" ? (
              <div className="mt-8 divide-y divide-foreground/10">
                {services.map((service, index) => (
                  <div
                    key={service.name}
                    className="grid grid-cols-[24px_1fr] gap-4 py-5 first:pt-0 last:pb-0"
                  >
                    <span className="pt-1 font-mono text-[10px] text-accent">
                      0{index + 1}
                    </span>
                    <div>
                      <AnimatedHeading
                        as="h3"
                        className="text-2xl"
                        lines={[{ text: service.name }]}
                      />
                      <p className="mt-1 font-serif text-base italic text-accent/90">
                        {service.line}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/55">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : panel === "studio" ? (
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/65">
                <p>
                  We believe tea solves everything. A good conversation leads to
                  a good idea, and a good idea leads to design that works.
                </p>
                <p>
                  One team for strategy, design, marketing, branding and
                  launches. No scattered vendors and no mixed messages.
                </p>
                <p className="pt-3 font-serif text-xl italic text-foreground">
                  Pull up a chair. The kettle’s on.
                </p>
              </div>
            ) : (
              <div className="mt-7 rounded-2xl border border-foreground/10 bg-foreground/3 p-5">
                <p className="text-sm leading-relaxed text-foreground/70">
                  Online booking isn’t available yet. In the meantime, explore
                  what we can brew for your brand.
                </p>
                <Button
                  onClick={() => setPanel("services")}
                  className="mt-5 rounded-full"
                >
                  Explore our services <ArrowUpRight aria-hidden="true" />
                </Button>
              </div>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
