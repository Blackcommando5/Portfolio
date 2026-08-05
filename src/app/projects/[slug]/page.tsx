import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { caseStudies, getCaseStudy } from "@/lib/case-studies";
import { CaseStudyHero } from "@/components/case-study/CaseStudyHero";
import { ScreenViewer } from "@/components/case-study/ScreenViewer";
import { AudioPipelineDiagram } from "@/components/case-study/AudioPipelineDiagram";
import { BridgeLoopDiagram } from "@/components/case-study/BridgeLoopDiagram";
import {
  ArchitectureBlock,
  ArchitectureNotes,
  BlockList,
  DecisionList,
  FlowSteps,
  MetricStrip,
  Prose,
  RoadmapList,
  Section,
  StackGrid,
} from "@/components/case-study/blocks";

type Params = { slug: string };

/* Only the slugs below exist — anything else 404s without a dynamic render. */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) return {};

  const title = `${study.title} — Case Study | Subash Krishnan K`;

  return {
    title,
    description: study.tagline,
    alternates: { canonical: `/projects/${study.slug}` },
    openGraph: {
      title,
      description: study.tagline,
      url: `/projects/${study.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: study.tagline,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) notFound();

  /* Built as a list so kickers number themselves — optional sections can drop
     out without renumbering everything after them. */
  const sections: { title: string; content: React.ReactNode }[] = [
    {
      title: study.problem.heading,
      content: <Prose body={study.problem.body} bullets={study.problem.bullets} />,
    },
    {
      title: "Approach",
      content: <BlockList blocks={study.approach} />,
    },
  ];

  if (study.flows?.length) {
    sections.push({
      title: "How it works",
      content: <FlowSteps flows={study.flows} />,
    });
  }

  if (study.screens?.length) {
    sections.push({
      title: "Interface",
      content: <ScreenViewer groups={study.screens} />,
    });
  }

  if (study.diagram) {
    const Diagram =
      study.diagram === "audio-pipeline" ? AudioPipelineDiagram : BridgeLoopDiagram;
    sections.push({
      title: study.diagram === "bridge-loop" ? "How the loop works" : "Architecture",
      content: (
        <div className="space-y-6">
          <Diagram />
          {study.architectureNotes && (
            <ArchitectureNotes notes={study.architectureNotes} />
          )}
        </div>
      ),
    });
  } else if (study.architecture) {
    sections.push({
      title: "Architecture",
      content: (
        <ArchitectureBlock
          diagram={study.architecture}
          notes={study.architectureNotes}
        />
      ),
    });
  }

  if (study.decisions?.length) {
    sections.push({
      title: "Decisions and trade-offs",
      content: <DecisionList decisions={study.decisions} />,
    });
  }

  sections.push({
    title: "Stack",
    content: <StackGrid groups={study.stack} />,
  });

  if (study.engineering?.length) {
    sections.push({
      title: "Engineering practice",
      content: <BlockList blocks={study.engineering} />,
    });
  }

  sections.push({
    title: study.outcome.heading,
    content: <Prose body={study.outcome.body} bullets={study.outcome.bullets} />,
  });

  if (study.roadmap?.length) {
    sections.push({
      title: "What's next",
      content: <RoadmapList items={study.roadmap} />,
    });
  }

  return (
    <article>
      <CaseStudyHero study={study} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Overview — no top border, it sits right under the hero */}
        <section className="py-14 md:py-16">
          <p className="max-w-3xl text-base leading-[1.8] text-text-secondary md:text-[17px]">
            {study.summary}
          </p>
          <div className="mt-10">
            <MetricStrip metrics={study.metrics} />
          </div>
        </section>

        {sections.map((section, i) => (
          <Section
            key={section.title}
            kicker={String(i + 1).padStart(2, "0")}
            title={section.title}
          >
            {section.content}
          </Section>
        ))}

        {/* Footer nav */}
        <nav className="flex flex-wrap gap-3 border-t border-border-glass py-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-xl border border-border-glass bg-bg-surface px-4 py-2.5 text-sm text-text-secondary transition-colors hover:border-accent-cyan/30 hover:text-accent-cyan"
          >
            All projects
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-xl border border-accent-cyan/30 bg-accent-cyan/10 px-4 py-2.5 text-sm font-medium text-accent-cyan transition-all hover:bg-accent-cyan/20"
          >
            Get in touch
            <ArrowRight size={14} />
          </Link>
        </nav>
      </div>
    </article>
  );
}
