"use client";

import { Magnetic, ScrubText } from "./studio-motion";
import { StudioLink } from "./studio-navigation";

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
