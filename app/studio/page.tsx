import type { Metadata } from "next";
import { StudioAboutIntro, StudioContact, StudioFounder, StudioWhy } from "@/app/components/studio-landing";

export const metadata: Metadata = {
  title: "A Creative Agency Brewed on Strategy | Tea Rose Design Studio",
  description: "Meet Trishi Jain and Tea Rose Design Studio. Research, design and marketing to help brands look sharper, sound clearer and grow faster.",
};

export default function StudioPage() {
  return <main className="st-site st-inner-page"><StudioFounder standalone /><StudioAboutIntro /><StudioWhy number="03" /><StudioContact /></main>;
}
