import type { Metadata } from "next";
import { StudioAboutIntro, StudioContact, StudioFounder, StudioWhy } from "@/app/components/studio-landing";

export const metadata: Metadata = {
  title: "A Creative Agency Brewed on Strategy | Tea Rose Design Studio",
  description: "Meet Trishi Jain and Tea Rose Design Studio. Research, design and marketing to help brands look sharper, sound clearer and grow faster.",
  keywords: [
    "about Tea Rose Design Studio",
    "creative branding agency India",
    "brand design studio",
    "Trishi Jain",
    "brand strategy team",
  ],
};

export default function StudioPage() {
  return (
    <main className="[--paper:#f1e8e4] [--ink:#2c1422] [--pink:#ee3c80] pt-[90px] font-sans [&_a]:no-underline max-[760px]:pt-[80px] [@media(max-height:520px)_and_(orientation:landscape)]:pt-[72px] [&>*]:[animation:page-rise_.9s_cubic-bezier(.22,1,.36,1)_backwards] [&>*]:[animation-delay:calc(.25s+var(--enter-index,0)*.09s)] max-[760px]:[&>*]:[animation-duration:.7s] motion-reduce:[&>*]:animate-none [&>*:nth-child(2)]:[--enter-index:1] [&>*:nth-child(3)]:[--enter-index:2] [&>*:nth-child(4)]:[--enter-index:3] [&>*:nth-child(n+5)]:[--enter-index:4]">
      <StudioFounder standalone />
      <StudioAboutIntro />
      <StudioWhy />
      <StudioContact />
    </main>
  );
}
