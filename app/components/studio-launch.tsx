"use client";

import { launchItems } from "@/lib/studio-content";
import { FoldRow, Reveal, SplitHeading } from "./studio-motion";

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
