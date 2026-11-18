import type { Metadata } from "next";
import { WorkGallery } from "../components/work-gallery";

export const metadata: Metadata = {
  title: "Selected Work | Tea Rose Design Studio",
  description: "Explore seven Tea Rose brand stories, from visual identities and packaging to launch campaigns and creative direction.",
};

export default function WorkPage() {
  return <WorkGallery />;
}
