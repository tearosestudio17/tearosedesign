import type { Metadata } from "next";
import { StudioContact, StudioLaunch, StudioServices } from "@/app/components/studio-landing";

export const metadata: Metadata = {
  title: "Branding, Marketing & Design Services | Tea Rose Design Studio",
  description: "Brand strategy, design, digital marketing, branding and Launch 24. One thoughtful team for brands in India and worldwide.",
  keywords: [
    "branding services",
    "digital marketing services",
    "brand strategy",
    "graphic design agency",
    "product launch agency",
    "social media marketing services",
  ],
};

export default function ServicesPage() {
  return (
    <main className="[--paper:#f1e8e4] [--ink:#2c1422] [--pink:#ee3c80] pt-[90px] font-sans [&_a]:no-underline max-[760px]:pt-[80px] [@media(max-height:520px)_and_(orientation:landscape)]:pt-[72px] [&>*]:[animation:page-rise_.9s_cubic-bezier(.22,1,.36,1)_backwards] [&>*]:[animation-delay:calc(.25s+var(--enter-index,0)*.09s)] max-[760px]:[&>*]:[animation-duration:.7s] motion-reduce:[&>*]:animate-none [&>*:nth-child(2)]:[--enter-index:1] [&>*:nth-child(3)]:[--enter-index:2] [&>*:nth-child(4)]:[--enter-index:3] [&>*:nth-child(n+5)]:[--enter-index:4]">
      <StudioServices standalone />
      <StudioLaunch />
      <StudioContact />
    </main>
  );
}
