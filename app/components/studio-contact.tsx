"use client";

import { Magnetic, Reveal, SplitHeading } from "./studio-motion";
import { StudioLink } from "./studio-navigation";

function BookingButton() {
  return (
    <Magnetic>
      <a
        className="st-button st-button-pink"
        href="https://cal.com/project-24-iyyo9f/spill-the-tea"
        target="_blank"
        rel="noopener noreferrer"
      >
        Book a Free Chat{" "}
      </a>
    </Magnetic>
  );
}

export function StudioContact() {
  return (
    <section className="st-contact" id="contact">
      <div className="st-section st-contact-main">
        <span className="st-label">Good conversations. Great brands.</span>
        <SplitHeading
          text="Spill the Tea."
          accent="Tea."
          className="st-contact-title"
        />
        <div className="st-contact-bottom">
          <Reveal once>
            <p>
              A good conversation leads to a good idea, and a good idea leads to
              design that works.
            </p>
          </Reveal>
          <BookingButton />
        </div>
        <div className="st-footer">
          <div className="st-footer-brand-group">
            <StudioLink href="/" className="st-footer-brand">
              Tea Rose<span>DESIGN STUDIO</span>
            </StudioLink>
          </div>
          <span className="st-footer-credit">
            Design &amp; Developed by{" "}
            <a
              href="https://www.launchleap.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LaunchLeap
            </a>
          </span>
          <a href="#" className="st-text-link">
            Back to top{" "}
          </a>
        </div>
      </div>
    </section>
  );
}
