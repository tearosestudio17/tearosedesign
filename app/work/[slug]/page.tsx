import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { projects } from "@/lib/work-content";
import { PortfolioBook } from "@/app/components/portfolio-book";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: "Project not found | Tea Rose" };
  return {
    title: `${project.name} — Case Study | Tea Rose`,
    description: project.sections[0].paragraphs.join(" "),
    keywords: [project.name, project.category, ...project.tags, "Tea Rose Design Studio case study"],
  };
}

async function CaseStudyContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();
  return <PortfolioBook initialProject={projects[index].slug} />;
}

export default function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <main>
      <Suspense fallback={null}>
        <CaseStudyContent params={params} />
      </Suspense>
    </main>
  );
}
