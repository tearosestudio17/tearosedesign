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

function ProcessPanel({ index }: { index: number }) {
  const step = process[index];
  return (
    <div className="st-process-panel" data-process={index}>
      <div className="st-process-heading">
        <p className="st-label">How we work / 0{index + 1}</p>
        <span className="st-label">Tea Rose / The process</span>
      </div>
      <div className="st-process-layout">
        <div className="st-process-copy">
          <AnimatedHeading lines={[{ text: step.title }]} />
          <AnimatedReveal>
            <p className="st-process-lead">{step.text}</p>
            <p className="st-process-note">{step.note}</p>
            <ul className="st-process-topics" aria-label={`${step.title} Focus areas`}>
              {step.items.map((item, itemIndex) => (
                <li key={item}>
                  <span aria-hidden="true">0{itemIndex + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="st-process-footer">
              <span className="st-label">{step.label}</span>
              <StudioLink href={step.href} className="st-text-link">
                {step.link}
              </StudioLink>
            </div>
          </AnimatedReveal>
        </div>
        <div className="st-process-scene-space" data-particle-art={index + 1} aria-hidden="true" />
      </div>
      <ol
        className="st-process-steps"
        aria-label="Our Brand & Marketing Process"
      >
        {process.map((item, i) => (
          <li key={item.title} aria-current={i === index ? "step" : undefined}>
            <span>0{i + 1}</span>
            {item.title}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Home() {
  return (
    <main className="st-site">
      <ScrollMorphSection
        id="particle-story"
        trackHeight={650}
        panelLabels={[
          "Home",
          "About us",
          "Listen",
          "Research",
          "Create",
          "Launch",
        ]}
        hero={<Hero />}
        aboutSection={<AboutUs />}
        nextSection={<ProcessPanel index={0} />}
        additionalSections={[
          <ProcessPanel key="research" index={1} />,
          <ProcessPanel key="create" index={2} />,
          <ProcessPanel key="launch" index={3} />,
        ]}
      />
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
