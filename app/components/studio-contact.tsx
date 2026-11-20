"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useState } from "react";
import { Magnetic, Reveal, SplitHeading } from "./studio-motion";
import { StudioLink } from "./studio-navigation";

function BookingButton() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Magnetic>
        <Dialog.Trigger className="st-button st-button-pink">
          Book a Free Chat{" "}
        </Dialog.Trigger>
      </Magnetic>
      <Dialog.Portal>
        <Dialog.Backdrop className="st-booking-backdrop" />
        <Dialog.Popup className="st-booking-popup">
          <Dialog.Close
            className="st-booking-close"
            aria-label="Close booking information"
          >
            Close
          </Dialog.Close>
          <span className="st-label">Tea Rose Design Studio</span>
          <Dialog.Title>Let’s put the kettle on.</Dialog.Title>
          <Dialog.Description>
            Online booking isn’t available yet. In the meantime, explore what we
            can brew for your brand.
          </Dialog.Description>
          <StudioLink
            href="/services"
            className="st-text-link"
            onClick={() => setOpen(false)}
          >
            See Our Services{" "}
          </StudioLink>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
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
          </div>
          <span className="st-label">India & beyond</span>
          <a href="#" className="st-text-link">
            Back to top{" "}
          </a>
        </div>
      </div>
    </section>
  );
}
