import { AnimatedHeading, AnimatedReveal } from "./animated-heading";

export default function AboutUs() {
  return (
    <div className="about-content mx-auto w-full max-w-[1320px] text-left [@media(min-width:1024px)_and_(max-height:760px)]:[&>:first-child]:mb-5 [@media(min-width:1024px)_and_(max-height:760px)]:[&>:last-child]:mt-5">
      <div className="flex justify-between gap-5 text-muted-foreground [&>:first-child]:text-accent">
        <p className="font-mono text-sm leading-[1.6] tracking-[.14em] uppercase whitespace-nowrap max-[600px]:text-xs max-[600px]:tracking-[.1em]">01 / The studio</p>
        <p className="font-mono text-sm leading-[1.6] tracking-[.14em] uppercase whitespace-nowrap max-[600px]:text-xs max-[600px]:tracking-[.1em]">India & beyond</p>
      </div>
      <div className="grid grid-cols-[1.1fr_1fr] items-center gap-[6%] py-[clamp(28px,5vh,56px)] max-lg:grid-cols-1 max-lg:gap-[30px] max-[600px]:gap-2 max-[600px]:py-3">
        <div className="min-w-0">
          <AnimatedHeading
            className="text-[clamp(40px,5.2vw,74px)] max-lg:max-w-full max-lg:text-[clamp(36px,6vw,64px)] max-[600px]:text-[clamp(32px,9.4vw,44px)] max-[600px]:leading-[1.08] [@media(min-width:1024px)_and_(max-height:760px)]:text-[clamp(40px,4.6vw,64px)]"
            lines={[
              { text: "A creative agency." },
              { text: "Brewed on" },
              { text: "strategy.", accentWords: ["strategy."] },
            ]}
          />
          <AnimatedReveal delay={0.22}>
            <p className="mt-6 max-w-[43ch] text-[clamp(18px,1.3vw,20px)] leading-[1.85] max-[600px]:mt-4 max-[600px]:text-[15px] max-[600px]:leading-[1.55] text-muted-foreground max-lg:max-w-[55ch] [&_span]:text-foreground">
              We’re <span>Tea Rose Design Studio.</span> We mix research, design and
              marketing to help brands look sharper, sound clearer and grow faster.
            </p>
            <p className="mt-5 max-w-[43ch] border-l short:max-[600px]:hidden max-[600px]:mt-3 max-[600px]:pl-3.5 max-[600px]:text-sm max-[600px]:leading-[1.6] border-l-[color-mix(in_srgb,var(--accent)_35%,transparent)] pl-5 text-[clamp(18px,1.3vw,20px)] leading-[1.85] text-muted-foreground max-lg:max-w-[55ch]">
              We believe tea solves everything. A good conversation leads to a good
              idea, and a good idea leads to design that works.
            </p>
            <p className="mt-[26px] max-[600px]:mt-3 max-[600px]:text-base short:max-[600px]:hidden font-display text-[clamp(18px,2vw,24px)]/[1.4] italic">Good conversations. Great brands.</p>
          </AnimatedReveal>
        </div>
        <div className="h-full min-h-[340px] max-lg:h-[220px] max-lg:min-h-0 max-[600px]:h-[clamp(84px,13dvh,130px)]! max-[600px]:min-h-0!" data-particle-art="0" aria-hidden="true" />
      </div>
      <div className="flex justify-between gap-5 border-t border-t-[#fff3f71a] pt-5 text-sm text-muted-foreground max-[600px]:gap-3 max-[600px]:pt-3 max-[600px]:text-[13px] max-[600px]:[&>span]:hidden [@media(max-height:640px)]:max-[600px]:hidden">
        <p>One team. From first thought to launch day.</p>
        <span className="font-mono text-sm leading-[1.6] tracking-[.14em] uppercase">Keep brewing</span>
      </div>
    </div>
  );
}
