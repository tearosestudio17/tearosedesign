import type { Metadata } from "next";
import { StudioContact, StudioLaunch, StudioServices } from "@/app/components/studio-landing";

export const metadata: Metadata = {
  title: "Branding, Marketing & Design Services | Tea Rose Design Studio",
  description: "Brand strategy, design, digital marketing, branding and Launch 24. One thoughtful team for brands in India and worldwide.",
};

export default function ServicesPage() {
  return <main className="st-site st-inner-page"><StudioServices standalone /><StudioLaunch number="02" /><StudioContact /></main>;
}
