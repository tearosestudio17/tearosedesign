import Hero from "@/app/components/hero";
import AboutUs from "@/app/components/about-us";
import { ScrollMorphSection } from "@/app/components/scroll-morph-section";
import {
  StudioContact,
  StudioFounder,
  StudioIndustries,
  StudioLaunch,
  StudioServices,
  StudioWhy,
} from "@/app/components/studio-landing";
import { process } from "@/lib/studio-content";
import { StudioLink } from "./components/studio-navigation";
import { LogoWave } from "./components/logo-wave";
import { AnimatedHeading, AnimatedReveal } from "./components/animated-heading";
import { SelectedWork } from "./components/work-gallery";

function ProcessPanel({ index }: { index: number }) {
  const step = process[index];
  return (
    <div
      className="mx-auto w-full max-w-[1320px] flex-shrink-0 py-6 min-[761px]:short-800:py-5 max-[1023px]:max-w-[700px] max-[760px]:my-auto max-[760px]:p-0"
      data-process={index}
    >
      <div className="flex justify-between gap-5 border-b border-b-[#fff3f71a] pb-[18px] max-[760px]:pb-[10px]">
        <p className="font-mono text-sm leading-[1.6] tracking-[.14em] uppercase text-[#ff83b5]">How we work / 0{index + 1}</p>
        <span className="font-mono text-sm leading-[1.6] tracking-[.14em] uppercase text-[var(--muted-foreground)] max-[1023px]:hidden">
          Tea Rose / The process
        </span>
      </div>
      <div className="grid grid-cols-[1.1fr_1fr] items-center gap-[7%] py-6 max-[1023px]:grid-cols-1 max-[1023px]:gap-6 max-[760px]:gap-[10px] max-[760px]:py-[10px]">
        <div className="relative z-[1] min-w-0">
          <AnimatedHeading
            lines={[{ text: step.title }]}
            className="text-[clamp(52px,7vw,108px)] font-normal tracking-[-.065em] leading-[1.06] min-[761px]:short-800:mt-4 min-[761px]:short-800:text-[64px] max-[760px]:mt-2 max-[760px]:text-[clamp(34px,9.5vw,46px)]"
          />
          <AnimatedReveal>
            <p className="font-display mt-[18px] max-w-[28ch] text-[clamp(21px,2.3vw,32px)]/[1.4] text-[#ffadcc] text-balance italic max-[760px]:mt-2 max-[760px]:max-w-[30ch] max-[760px]:text-[18px] max-[760px]:leading-[1.35]">
              {step.text}
            </p>
            <p className="mt-6 max-w-[45ch] border-l border-l-[#ff83b54d] pl-5 text-lg leading-[1.85] text-[var(--muted-foreground)] max-[760px]:mt-3 max-[760px]:pl-[14px] max-[760px]:text-sm max-[760px]:leading-[1.6] [@media(max-width:760px)_and_(max-height:640px)]:hidden">
              {step.note}
            </p>
            <ul
              className="mt-6 grid grid-cols-2 gap-[12px_24px] border-t border-t-[#fff3f71a] pt-5 max-[760px]:mt-[14px] max-[760px]:gap-[8px_14px] max-[760px]:pt-3"
              aria-label={`${step.title} Focus areas`}
            >
              {step.items.map((item, itemIndex) => (
                <li
                  key={item}
                  className="flex items-baseline gap-3 text-lg leading-[1.65] text-[var(--muted-foreground)] max-[760px]:gap-1.5 max-[760px]:text-sm max-[760px]:leading-[1.45]"
                >
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-mono text-sm text-[var(--accent)] max-[760px]:text-[12px]"
                  >
                    0{itemIndex + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-col items-start gap-4 min-[761px]:short-800:mt-4 max-[760px]:mt-[14px] max-[760px]:flex-row max-[760px]:flex-wrap max-[760px]:items-center max-[760px]:justify-between max-[760px]:gap-3">
              <span className="font-mono text-sm leading-[1.6] tracking-[.14em] uppercase text-[var(--muted-foreground)] max-[760px]:text-sm [@media(max-width:760px)_and_(max-height:720px)]:hidden">
                {step.label}
              </span>
              <StudioLink href={step.href} className="inline-flex min-h-[44px] items-center justify-between gap-[30px] border-b border-b-current py-[10px] text-sm transition-opacity duration-200 hover:opacity-65">
                {step.link}
              </StudioLink>
            </div>
          </AnimatedReveal>
        </div>
        <div
          className="h-[clamp(300px,47vh,470px)] w-full max-[1023px]:h-[280px] max-[760px]:h-[clamp(90px,16dvh,190px)] [@media(max-width:760px)_and_(max-height:720px)]:h-[clamp(80px,14dvh,150px)] [@media(max-width:760px)_and_(max-height:640px)]:h-[80px]"
          data-particle-art={index + 1}
          aria-hidden="true"
        />
      </div>
      <ol
        className="mt-[25px] grid w-[49%] grid-cols-4 gap-[18px] min-[761px]:short-800:mt-4 max-[1023px]:w-full max-[760px]:mt-[6px] max-[760px]:gap-[6px]"
        aria-label="Our Brand & Marketing Process"
      >
        {process.map((item, i) => (
          <li
            key={item.title}
            aria-current={i === index ? "step" : undefined}
            className="flex gap-3 border-t-2 border-t-[#fff3f71a] pt-3 text-sm text-[#c9abbc] max-[760px]:flex-col max-[760px]:gap-[2px] max-[760px]:pt-2 max-[760px]:text-xs [&[aria-current]]:border-[var(--accent)] [&[aria-current]]:text-[var(--foreground)]"
          >
            <span className="font-mono text-sm max-[760px]:text-xs">0{i + 1}</span>
            {item.title}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Home() {
  return (
    <main className="[--paper:#f1e8e4] [--ink:#2c1422] [--pink:#ee3c80] font-sans [&_a]:no-underline">
      <section className="relative z-10 flex h-dvh flex-col items-center justify-center  text-center sm:px-14">
        <Hero />
      </section>
      <ScrollMorphSection
        id="particle-story"
        trackHeight={650}
        morphEnd={0.38}
        panelLabels={[
          "Home",
          "About us",
          "Listen",
          "Research",
          "Create",
          "Launch",
        ]}
        aboutSection={<AboutUs />}
        nextSection={<ProcessPanel index={0} />}
        additionalSections={[
          <ProcessPanel key="research" index={1} />,
          <ProcessPanel key="create" index={2} />,
          <ProcessPanel key="launch" index={3} />,
        ]}
      />
      <SelectedWork />
      <StudioServices />
      <StudioLaunch />
      <StudioIndustries />
      <StudioWhy />
      <StudioFounder />
      <LogoWave />
      <StudioContact />
    </main>
  );
}
