import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Lock } from "lucide-react";
import { projects, type Discipline } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects | Subashkrishnan K",
  description:
    "Web, mobile, Windows desktop, and AR/VR projects by Subashkrishnan K — with long-form case studies covering architecture, decisions, and trade-offs.",
  alternates: { canonical: "/projects" },
};

const groupOrder: { id: Discipline; label: string; blurb: string }[] = [
  { id: "web", label: "Web", blurb: "Full-stack platforms, SaaS, and tooling" },
  { id: "app", label: "Mobile", blurb: "Flutter and native Android apps" },
  { id: "windows", label: "Windows desktop", blurb: "Electron apps and creative-tool bridges" },
  { id: "arvr", label: "AR / VR", blurb: "Unity experiences for Meta Quest" },
];

export default function ProjectsIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-28 pb-20 sm:px-6 md:pt-32 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-accent-cyan"
      >
        <ArrowLeft size={14} />
        Home
      </Link>

      <h1 className="font-display mt-8 text-3xl font-bold tracking-wide text-text-primary sm:text-4xl">
        Projects
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
        {projects.length} projects across four disciplines. The ones marked with a case
        study have a full write-up covering the problem, architecture, and the trade-offs
        I made.
      </p>

      <div className="mt-16 space-y-16">
        {groupOrder.map((group) => {
          const items = projects.filter((p) => p.discipline === group.id);
          if (items.length === 0) return null;

          return (
            <section key={group.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border-glass pb-4">
                <h2 className="font-display text-lg font-bold tracking-wide text-text-primary">
                  {group.label}
                </h2>
                <p className="text-sm text-text-muted">{group.blurb}</p>
              </div>

              <ul className="mt-6 space-y-3">
                {items.map((project) => {
                  const body = (
                    <>
                      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                        <h3 className="text-[15px] font-semibold text-text-primary transition-colors group-hover:text-accent-cyan">
                          {project.title}
                        </h3>
                        {project.slug ? (
                          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-accent-cyan/80">
                            Case study
                            <ArrowRight
                              size={12}
                              className="transition-transform group-hover:translate-x-0.5"
                            />
                          </span>
                        ) : project.confidential ? (
                          <span className="inline-flex shrink-0 items-center gap-1 text-xs text-text-muted/60">
                            <Lock size={11} />
                            Confidential
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-accent-cyan/60">{project.tagline}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.tech.slice(0, 7).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md border border-border-glass bg-bg-surface px-2 py-0.5 text-[11px] text-text-muted"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech.length > 7 && (
                          <span className="px-1 py-0.5 text-[11px] text-text-muted/60">
                            +{project.tech.length - 7}
                          </span>
                        )}
                      </div>
                    </>
                  );

                  const shell =
                    "group block rounded-2xl border border-border-glass bg-bg-surface p-5 transition-colors";

                  return (
                    <li key={project.title}>
                      {project.slug ? (
                        <Link
                          href={`/projects/${project.slug}`}
                          className={`${shell} hover:border-accent-cyan/30`}
                        >
                          {body}
                        </Link>
                      ) : project.live || project.github ? (
                        <a
                          href={(project.live ?? project.github)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${shell} hover:border-accent-cyan/30`}
                        >
                          {body}
                          <span className="mt-3 inline-flex items-center gap-1 text-xs text-text-muted">
                            {project.live ? "Live site" : "Source"}
                            <ArrowUpRight size={11} />
                          </span>
                        </a>
                      ) : (
                        <div className={shell}>{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
