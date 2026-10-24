import { DM_Sans, Geist_Mono, Instrument_Serif } from "next/font/google";

// The site's three font roles. Layout exposes these variables to every page.
export const displayFont = Instrument_Serif({
  variable: "--font-editorial",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

// Font families are configured here; semantic Tailwind aliases live in globals.css.
export const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const monoFont = Geist_Mono({
  variable: "--font-label",
  subsets: ["latin"],
  display: "swap",
});
