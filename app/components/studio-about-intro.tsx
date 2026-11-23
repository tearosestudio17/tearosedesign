"use client";

import { Magnetic, ScrubText } from "./studio-motion";
import { StudioLink } from "./studio-navigation";

export function StudioAboutIntro() {
  return (
    <section className="relative py-[clamp(70px,10vw,150px)] px-[max(clamp(24px,5vw,80px),calc((100%-1680px)/2))] bg-[var(--paper)] text-[var(--ink)]" id="about">
      <ScrubText
        className="font-display max-w-[24ch] text-[clamp(26px,4.4vw,68px)] font-[450] tracking-[-.045em] leading-[1.35]"
        text="We’re Tea Rose Design Studio. We mix research, design and marketing to help brands look sharper, sound clearer and grow faster."
      />
      <div className="mt-[60px] flex items-end justify-between gap-[60px] border-t border-t-[#2c142233] pt-[30px] max-[760px]:mt-[40px] max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-[25px]">
        <div className="max-w-[47ch] text-lg leading-[1.8] text-[#78626d]">
          <p>
            We believe tea solves everything. A good conversation leads to a
            good idea, and a good idea leads to design that works.
          </p>
          <p className="mt-[15px]">
            One team for strategy, design, marketing, branding and launches. No
            scattered vendors and no mixed messages.
          </p>
        </div>
        <Magnetic>
          <StudioLink href="/services" className="inline-flex min-h-[44px] items-center justify-between gap-[30px] border-b border-b-current py-[10px] text-base transition-opacity duration-200 hover:opacity-65">
            Explore our services{" "}
          </StudioLink>
        </Magnetic>
      </div>
    </section>
  );
}
