import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/lib/work-content";
import { PortfolioBook } from "@/app/components/portfolio-book";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return { title: project ? `${project.name} — Case Study | Tea Rose` : "Project not found | Tea Rose", description: project?.sections[0].paragraphs.join(" ") };
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();
  return <main><PortfolioBook initialProject={projects[index].slug} /></main>;
}
