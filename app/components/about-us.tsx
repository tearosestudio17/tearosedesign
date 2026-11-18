import { AnimatedHeading, AnimatedReveal } from "./animated-heading";

export default function AboutUs() {
  return (
    <div className="about-content mx-auto w-full max-w-[1320px] text-left">
      <div className="flex justify-between gap-5 text-muted-foreground [&>:first-child]:text-accent">
        <p className="st-label max-[600px]:text-sm">01 / The studio</p>
        <p className="st-label max-[600px]:text-sm">India & beyond</p>
      </div>
      <div className="grid grid-cols-[1.1fr_1fr] items-center gap-[6%] py-[clamp(28px,5vh,56px)] max-lg:grid-cols-1 max-lg:gap-[30px] max-[600px]:gap-3 max-[600px]:py-[30px]">
        <div className="min-w-0">
          <AnimatedHeading
            className="text-[clamp(40px,5.2vw,74px)] max-lg:max-w-full max-lg:text-[clamp(36px,6vw,64px)] max-[600px]:text-[clamp(30px,7.5vw,44px)]"
            lines={[
              { text: "A creative agency." },
              { text: "Brewed on" },
              { text: "strategy.", accentWords: ["strategy."] },
            ]}
          />
          <AnimatedReveal delay={0.22}>
            <p className="mt-6 max-w-[43ch] text-[clamp(18px,1.3vw,20px)] leading-[1.85] text-muted-foreground max-lg:max-w-[55ch] [&_span]:text-foreground">
              We’re <span>Tea Rose Design Studio.</span> We mix research, design and
              marketing to help brands look sharper, sound clearer and grow faster.
            </p>
            <p className="mt-5 max-w-[43ch] border-l border-l-[color-mix(in_srgb,var(--accent)_35%,transparent)] pl-5 text-[clamp(18px,1.3vw,20px)] leading-[1.85] text-muted-foreground max-lg:max-w-[55ch]">
              We believe tea solves everything. A good conversation leads to a good
              idea, and a good idea leads to design that works.
            </p>
            <p className="mt-[26px] font-display text-[clamp(18px,2vw,24px)]/[1.4] italic">Good conversations. Great brands.</p>
          </AnimatedReveal>
        </div>
        <div className="h-full min-h-[340px] max-lg:h-[220px] max-lg:min-h-0 max-[600px]:h-[180px]" data-particle-art="0" aria-hidden="true" />
      </div>
      <div className="flex justify-between gap-5 border-t border-t-[#fff3f71a] pt-5 text-sm text-muted-foreground max-[600px]:flex-wrap max-[600px]:gap-3">
        <p>One team. From first thought to launch day.</p>
        <span className="st-label">Keep brewing</span>
      </div>
    </div>
  );
}
