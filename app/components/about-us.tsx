import { AnimatedHeading, AnimatedReveal } from "./animated-heading";

const services = [
  { no: "01", title: "Strategy", note: "Research & positioning" },
  { no: "02", title: "Design", note: "Identity & digital" },
  { no: "03", title: "Marketing", note: "Campaigns that land" },
  { no: "04", title: "Branding", note: "Voice, look & feel" },
  { no: "05", title: "Launches", note: "First thought to day one" },
];

export default function AboutUs() {
  return (
    <div className="mx-auto w-full max-w-[1320px] text-left">
      <div className="flex justify-between gap-5 text-muted-foreground [&>:first-child]:text-accent">
        <p className="font-mono text-sm leading-[1.6] tracking-[.14em] uppercase whitespace-nowrap max-[600px]:text-xs max-[600px]:tracking-[.1em]">
          01 / The studio
        </p>
        <p className="font-mono text-sm leading-[1.6] tracking-[.14em] uppercase whitespace-nowrap max-[600px]:text-xs max-[600px]:tracking-[.1em]">
          India & beyond
        </p>
      </div>
      <div className="grid grid-cols-[1.1fr_1fr] items-center gap-[6%] py-[clamp(28px,5vh,56px)] max-lg:grid-cols-1 max-lg:gap-[30px] max-[600px]:gap-6 max-[600px]:py-6">
        <div className="min-w-0">
          <AnimatedHeading
            className="text-[clamp(40px,5.2vw,74px)] max-lg:max-w-full max-lg:text-[clamp(36px,6vw,64px)] max-[600px]:text-[clamp(32px,9.4vw,44px)] max-[600px]:leading-[1.08]"
            lines={[
              { text: "A creative agency." },
              { text: "Brewed on" },
              { text: "strategy.", accentWords: ["strategy."] },
            ]}
          />
          <AnimatedReveal delay={0.22}>
            <p className="mt-6 max-w-[43ch] text-[clamp(18px,1.3vw,20px)] leading-[1.85] max-[600px]:mt-4 max-[600px]:text-[15px] max-[600px]:leading-[1.55] text-muted-foreground max-lg:max-w-[55ch] [&_span]:text-foreground">
              We’re <span>Tea Rose Design Studio.</span> We mix research, design
              and marketing to help brands look sharper, sound clearer and grow
              faster.
            </p>
            <p className="mt-5 max-w-[43ch] border-l max-[600px]:mt-3 max-[600px]:pl-3.5 max-[600px]:text-sm max-[600px]:leading-[1.6] border-l-[color-mix(in_srgb,var(--accent)_35%,transparent)] pl-5 text-[clamp(18px,1.3vw,20px)] leading-[1.85] text-muted-foreground max-lg:max-w-[55ch]">
              We believe tea solves everything. A good conversation leads to a
              good idea, and a good idea leads to design that works.
            </p>
            <p className="mt-[26px] max-[600px]:mt-3 max-[600px]:text-base font-display text-[clamp(18px,2vw,24px)]/[1.4] italic">
              Good conversations. Great brands.
            </p>
          </AnimatedReveal>
        </div>

        {/* Replaces the empty dotted card */}
        <AnimatedReveal delay={0.3} className="w-full">
          <p className="font-mono text-xs leading-[1.6] tracking-[.14em] text-accent uppercase">
            What&apos;s on the menu
          </p>
          <ul className="mt-4 divide-y divide-[#fff3f71a] border-y border-y-[#fff3f71a]">
            {services.map((s) => (
              <li
                key={s.no}
                className="group flex items-baseline justify-between gap-4 py-4 max-[600px]:py-3"
              >
                <div className="flex items-baseline gap-4 transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                  <span className="font-mono text-xs tracking-[.14em] text-muted-foreground">
                    {s.no}
                  </span>
                  <span className="font-display text-[clamp(26px,3vw,40px)] leading-none text-foreground italic transition-colors group-hover:text-accent">
                    {s.title}
                  </span>
                </div>
                <span className="text-right text-sm text-muted-foreground max-[600px]:hidden">
                  {s.note}
                </span>
              </li>
            ))}
          </ul>
        </AnimatedReveal>
      </div>
      <div className="flex justify-between gap-5 border-t border-t-[#fff3f71a] pt-5 text-sm text-muted-foreground max-[600px]:gap-3 max-[600px]:pt-3 max-[600px]:text-[13px]">
        <p>One team. From first thought to launch day.</p>
        <span className="font-mono text-sm leading-[1.6] tracking-[.14em] uppercase">
          Keep brewing
        </span>
      </div>
    </div>
  );
}
