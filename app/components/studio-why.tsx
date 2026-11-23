"use client";

import { reasons } from "@/lib/studio-content";
import { Reveal, SplitHeading } from "./studio-motion";

export function StudioWhy() {
  return (
    <section className="relative py-[clamp(70px,10vw,150px)] px-[max(clamp(24px,5vw,80px),calc((100%-1680px)/2))] bg-[#291321] text-[#fff0f5]" id="why-tea-rose">
      <SplitHeading
        text={"Why Choose a\nDesign-Led Branding Agency?"}
        className="max-w-[23ch] text-[clamp(38px,5.2vw,82px)] font-normal tracking-[-.055em] leading-[1.12]"
        accent="Design-Led"
      />
      <div className="mt-[65px] grid grid-cols-4 gap-[35px] max-[1000px]:grid-cols-2 max-[1000px]:gap-10 max-[760px]:mt-[45px] max-[760px]:gap-[30px_25px]">
        {reasons.map((reason, i) => (
          <Reveal
            key={reason.title}
            delay={i * 0.06}
            className="border-t border-t-[#fff0f533] pt-5"
          >
            <span className="font-mono text-sm leading-[1.6] tracking-[.14em] uppercase text-[#ff83b5]">0{i + 1}</span>
            <SplitHeading
              as="h3"
              text={reason.title}
              className="mt-[35px] mb-4 text-[clamp(22px,2.1vw,32px)] font-normal tracking-[-.04em] max-[760px]:mt-[22px] max-[760px]:text-[24px]"
            />
            <p className="text-lg/[1.9] text-[#d8b1c5]">{reason.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
