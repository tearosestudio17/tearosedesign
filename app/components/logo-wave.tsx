"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { brandMarks } from "@/lib/brand-marks";
import { SplitHeading } from "./studio-motion";
import { StudioLink } from "./studio-navigation";

function WaveLogo({
  brand,
  index,
  duplicate,
}: {
  brand: (typeof brandMarks)[number];
  index: number;
  duplicate: boolean;
}) {
  return (
    <li
      className="w-[210px] flex-shrink-0 origin-center animate-[float-wave_24s_linear_infinite] [animation-delay:var(--wave-delay)] group-not-data-[animating=true]/sec:[animation-play-state:paused] group-hover/wave:[animation-play-state:paused] max-[600px]:w-[132px] motion-reduce:w-auto motion-reduce:animate-none motion-reduce:transform-none"
      style={{ "--wave-delay": `${-index * 6}s` } as CSSProperties}
    >
      <div
        className="group/card aspect-[1.65] overflow-hidden rounded-[clamp(22px,2.6vw,44px)] border border-[#ffffff80] bg-white shadow-[0_12px_32px_#290d211c] transition-[translate,box-shadow] duration-300 ease-in-out hover:-translate-y-1.5 hover:shadow-[0_22px_40px_#290d2133] max-[600px]:rounded-[20px] motion-reduce:transition-none [&_img]:size-full [&_img]:object-contain [&_img]:p-[8%]"
        title={brand.name}
      >
        <Image
          src={`/brands/${brand.slug}.${"ext" in brand ? brand.ext : "webp"}`}
          alt={duplicate ? "" : `${brand.name} logo`}
          width={480}
          height={320}
          sizes="(max-width: 600px) 132px, 210px"
        />
      </div>
    </li>
  );
}

export function LogoWave() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let inView = false;
    const update = () => {
      section.dataset.animating = String(inView && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(section);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="brand-worlds"
      className="group/sec relative overflow-clip [background:radial-gradient(ellipse_at_15%_5%,#ff83b522,transparent_55%),radial-gradient(ellipse_at_95%_95%,#ff941f14,transparent_50%),#742347] px-[clamp(24px,5vw,80px)] pt-16 pb-[90px] text-foreground [--section-padding:clamp(24px,5vw,80px)] [--wave-amplitude:64px] max-[600px]:pt-10 max-[600px]:pb-[60px] max-[600px]:[--wave-amplitude:38px]"
      aria-labelledby="brand-wave-title"
    >
      <div className="group/wave -mx-[var(--section-padding)] mt-9 mb-[60px] overflow-hidden py-[100px] max-[600px]:my-5 max-[600px]:mb-[30px] max-[600px]:py-[70px] motion-reduce:m-0 motion-reduce:my-12 motion-reduce:overflow-visible motion-reduce:p-0">
        <div className="flex w-max animate-[drift-right_72s_linear_infinite] group-not-data-[animating=true]/sec:[animation-play-state:paused] group-hover/wave:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none">
          {[false, true].map((duplicate) => (
            <ul
              key={String(duplicate)}
              className="m-0 flex flex-shrink-0 list-none gap-10 p-0 pr-10 max-[600px]:gap-6 max-[600px]:pr-6 motion-reduce:grid motion-reduce:w-full motion-reduce:grid-cols-3 motion-reduce:gap-5 motion-reduce:p-0 motion-reduce:aria-hidden:hidden"
              aria-hidden={duplicate || undefined}
              aria-label={duplicate ? undefined : "Selected brand identities"}
            >
              {brandMarks.map((brand, index) => (
                <WaveLogo
                  key={brand.slug}
                  brand={brand}
                  index={index}
                  duplicate={duplicate}
                />
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1.3fr_1fr] items-end gap-[10%] max-[1000px]:gap-[6%] max-[600px]:grid-cols-1 max-[600px]:gap-7">
        <div id="brand-wave-title">
          <SplitHeading
            text={"Different brands.\nA thoughtful blend."}
            className="text-[clamp(40px,5.8vw,88px)] leading-[1.08] font-normal tracking-[-.065em] max-[600px]:text-[clamp(36px,8.7vw,52px)]"
            accent="blend."
          />
        </div>
        <div className="max-w-[39ch] [&>a]:mt-6 [&>p]:text-[clamp(18px,1.4vw,20px)] [&>p]:leading-[1.8] [&>p]:text-[#ffe1ed] [&>span]:mt-8 [&>span]:block [&>span]:text-sm [&>span]:text-[#f2c4d5]">
          <p>
            One team for strategy, design, marketing, branding and launches. No
            scattered vendors and no mixed messages.
          </p>
          <StudioLink
            href="/services#branding"
            className="inline-flex min-h-[44px] items-center justify-between gap-[30px] border-b border-b-current py-[10px] text-base transition-opacity duration-200 hover:opacity-65"
          >
            Explore brand identity{" "}
          </StudioLink>
          <span className="font-mono text-sm leading-[1.6] tracking-[.14em] uppercase">
            Good conversations. Great brands.
          </span>
        </div>
      </div>
    </section>
  );
}
