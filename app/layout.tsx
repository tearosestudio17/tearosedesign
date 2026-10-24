import type { Metadata } from "next";
import { bodyFont, displayFont, monoFont } from "./fonts";
import "./globals.css";
import { StudioNavigation, StudioTransitionProvider } from "./components/studio-navigation";

export const metadata: Metadata = {
  title: "Tea Rose Design Studio | Branding & Digital Marketing Agency in India & Worldwide",
  description: "Tea Rose Design Studio is a creative branding and digital marketing agency. Brand strategy, design, Meta ads, social media and product launches for brands in India and across the globe.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StudioTransitionProvider>
          <StudioNavigation />
          {children}
        </StudioTransitionProvider>
      </body>
    </html>
  );
}
