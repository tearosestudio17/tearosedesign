import Hero from "@/app/components/hero";
import { StoryProcess } from "@/app/components/story-process";
import {
  StudioContact,
  StudioFounder,
  StudioIndustries,
  StudioLaunch,
  StudioServices,
  StudioWhy,
} from "@/app/components/studio-landing";
import { LogoWave } from "./components/logo-wave";
import { SelectedWork } from "./components/work-gallery";

export default function Home() {
  return (
    <main className="[--paper:#f1e8e4] [--ink:#2c1422] [--pink:#ee3c80] font-sans [&_a]:no-underline ">
      <section className="relative z-10 flex h-dvh flex-col items-center justify-center overflow-hidden text-center px-6 sm:px-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle,#ffffff38_1px,transparent_1.5px)] bg-[length:22px_22px] sm:bg-[length:28px_28px]"
        />
        <Hero />
      </section>
      <StoryProcess />
      <SelectedWork />
      <StudioServices />
      <StudioLaunch />
      <StudioIndustries />
      <StudioWhy />
      <StudioFounder />
      <LogoWave />
      <StudioContact />
    </main>
  );
}
