"use client";

import { Magnetic, Reveal, SplitHeading } from "./studio-motion";
import { StudioLink } from "./studio-navigation";

function BookingButton() {
  return (
    <Magnetic>
      <a
        className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-[22px] rounded-full border border-transparent px-[23px] py-[14px] text-sm leading-[1.4] transition-[background-color,color] duration-[250ms] bg-[var(--accent)] text-[#240b17] hover:bg-[#ffc4dc] hover:text-[#240b17]"
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
    <section className="bg-[#120910] text-[#fff0f5]" id="contact">
      <div className="relative py-[clamp(70px,10vw,150px)] px-[max(clamp(24px,5vw,80px),calc((100%-1680px)/2))] pb-[25px]">
        <span className="font-mono text-sm leading-[1.6] tracking-[.14em] uppercase">
          Good conversations. Great brands.
        </span>
        <SplitHeading
          text="Spill the Tea."
          accent="Tea."
          className="mt-[35px] text-[clamp(65px,13vw,205px)]/[1.1] tracking-[-.065em]"
        />
        <div className="flex items-center justify-between gap-[50px] pt-10 pb-20 max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-[30px] max-[760px]:pb-[55px]">
          <Reveal once>
            <p className="font-display max-w-[30ch] text-[clamp(21px,2.5vw,38px)] tracking-[-.025em] leading-[1.55]">
              A good conversation leads to a good idea, and a good idea leads to
              design that works.
            </p>
          </Reveal>
          <BookingButton />
        </div>
        <div className="flex items-center justify-between gap-[25px] border-t border-t-[#fff0f533] pt-[30px]">
          <div className="flex flex-col">
            <StudioLink
              href="/"
              className="font-display text-[32px] leading-none font-normal tracking-[-.06em]"
            >
              Tea Rose
              <span className="mt-[10px] block font-mono text-sm tracking-[.15em]">
                DESIGN STUDIO
              </span>
            </StudioLink>
          </div>
          <span className="font-mono block mt-[14px] text-xs/[1.6] tracking-[.1em] text-[#fff0f599] uppercase">
            Design &amp; Developed by{" "}
            <a
              href="https://tearosedesign.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] transition-opacity duration-200 hover:opacity-70"
            >
              Tea Rose Design Studio
            </a>
          </span>
          <a
            href="#"
            className="inline-flex min-h-[44px] items-center justify-between gap-[30px] py-[10px] text-sm transition-opacity duration-200 hover:opacity-65 max-[760px]:gap-3"
          >
            Back to top{" "}
          </a>
        </div>
      </div>
    </section>
  );
}
