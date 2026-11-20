import Image from "next/image";
import { brandMarks } from "@/lib/brand-marks";

export function BrandWave() {
  return <section id="brand-worlds" className="relative overflow-hidden bg-[var(--wave-bg,#ead8d3)] pt-[clamp(72px,8vw,118px)] pb-[clamp(60px,7vw,100px)] text-[var(--wave-ink,#2a1820)] [--wave-amplitude:clamp(55px,7vw,85px)] [--wave-padding:clamp(22px,5vw,80px)] max-[600px]:[--wave-amplitude:46px]" aria-labelledby="brand-wave-heading">
    <div className="mx-[var(--wave-padding)] flex justify-between gap-6 border-t border-t-current pt-3.5 font-mono text-sm/[1.4] font-medium uppercase tracking-[.12em] [&>span:last-child]:text-right"><span>Selected identities</span><span>Tea Rose Design Studio</span></div>
    <h2 id="brand-wave-heading" className="mx-[var(--wave-padding)] mt-[38px] mb-0 font-[family-name:var(--display,var(--font-display))] text-[clamp(58px,8.5vw,130px)] leading-[.95] font-[var(--wave-weight,400)] tracking-[-.07em] max-[600px]:text-[clamp(52px,14vw,78px)] [&_em]:font-[inherit] [&_em]:text-[var(--wave-accent,#a43b65)]">Brand <em>worlds.</em></h2>
    <div className="group/vp mt-9 overflow-hidden py-[calc(var(--wave-amplitude)+30px)] max-[600px]:mt-[25px] max-[600px]:py-[calc(var(--wave-amplitude)+22px)] motion-reduce:overflow-x-auto">
      <div className="flex w-max animate-[brand-drift_40s_linear_infinite] group-hover/vp:[animation-play-state:paused] motion-reduce:animate-none">
        {[false, true].map(duplicate => <ul key={String(duplicate)} className="m-0 flex flex-none list-none gap-[22px] p-0 pr-[22px] max-[600px]:gap-3.5 max-[600px]:pr-3.5 motion-reduce:aria-hidden:hidden" aria-hidden={duplicate || undefined}>
          {brandMarks.map((brand, index) => <li key={brand.slug} className="w-[190px] flex-none origin-center animate-[brand-s-curve_20s_linear_infinite] group-hover/vp:[animation-play-state:paused] max-[600px]:w-[136px] motion-reduce:animate-none" style={{ animationDelay: `${(-index * 10 / 3).toFixed(3)}s` }}>
            <div className="grid aspect-[1.55] w-full place-items-center overflow-hidden rounded-[var(--wave-radius,23px)] border border-[var(--wave-border,#54203437)] bg-white shadow-[0_14px_30px_#32102016] max-[600px]:rounded-[min(20px,var(--wave-radius,20px))] [&_img]:block [&_img]:size-full [&_img]:object-contain [&_img]:p-[8%]"><Image src={`/brands/${brand.slug}.${"ext" in brand ? brand.ext : "webp"}`} alt={duplicate ? "" : `${brand.name} logo`} width={480} height={320} sizes="(max-width: 600px) 136px, 190px" /></div>
          </li>)}
        </ul>)}
      </div>
    </div>
  </section>;
}
