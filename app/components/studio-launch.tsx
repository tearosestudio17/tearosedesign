"use client";

import { launchItems } from "@/lib/studio-content";
import { FoldRow, Reveal, SplitHeading } from "./studio-motion";

export function StudioLaunch() {
  return (
    <section
      className="relative py-[clamp(70px,10vw,150px)] px-[max(clamp(24px,5vw,80px),calc((100%-1680px)/2))] overflow-clip bg-[#ed3f80] text-[#300e20] [--heading-accent-start:#300e20] [--heading-accent-middle:#67213f] [--heading-accent-end:#300e20]"
      id="launch-24"
    >
      <div className="flex items-center justify-between gap-[30px] pt-[10px] pb-[50px] max-[760px]:gap-[15px] max-[760px]:pb-[30px]">
        <SplitHeading
          text="Launch"
          className="font-display text-[clamp(58px,13vw,210px)]/none font-normal tracking-[-.075em] max-[760px]:text-[14vw]"
        />
        <span
          className="font-display relative pr-[0.1em] text-[clamp(80px,18vw,290px)]/none tracking-[-.09em] italic max-[760px]:text-[22vw]"
          aria-label="24"
        >
          24
        </span>
      </div>
      <div className="grid grid-cols-[.85fr_1fr] gap-[10%] border-t border-t-[#300e2044] pt-[45px] max-[760px]:grid-cols-1 max-[760px]:gap-[35px] max-[760px]:pt-[30px]">
        <div>
          <SplitHeading
            as="h3"
            text={"Pour it hot.\nLaunch loud."}
            accent="loud."
            className="text-[clamp(30px,4vw,60px)] font-normal tracking-[-.04em] leading-[1.15]"
          />
          <Reveal>
            <p className="mt-[22px] max-w-[42ch] text-lg leading-[1.9]">
              Launch 24 is our full-service launch team. We plan it, run it and
              make sure everyone’s talking about it.
            </p>
          </Reveal>
        </div>
        <div>
          {launchItems.map((item, i) => (
            <FoldRow key={item}>
              <div className="grid grid-cols-[25px_1fr] items-baseline gap-5 border-t border-t-[#300e2033] py-[23px] max-[760px]:gap-[15px] max-[760px]:py-5">
                <span className="font-mono text-sm leading-[1.6] tracking-[.14em] uppercase">0{i + 1}</span>
                <p className="text-lg leading-[1.75]">{item}</p>
              </div>
            </FoldRow>
          ))}
        </div>
      </div>
    </section>
  );
}
