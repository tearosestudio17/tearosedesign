"use client";

import { reasons } from "@/lib/studio-content";
import { Reveal, SplitHeading } from "./studio-motion";

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
