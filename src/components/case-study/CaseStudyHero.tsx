import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Lock } from "lucide-react";
import { clsx } from "clsx";
import type { CaseStudy } from "@/lib/case-studies";

const statusStyles: Record<CaseStudy["status"], { label: string; className: string }> = {
  live: {
    label: "Live in production",
    className: "text-accent-green bg-accent-green/5 border-accent-green/20",
  },
  shipped: {
    label: "Shipped",
    className: "text-accent-cyan bg-accent-cyan/5 border-accent-cyan/20",
  },
  "in-development": {
    label: "In development",
    className: "text-accent-violet bg-accent-violet/5 border-accent-violet/20",
  },
  archived: {
    label: "Archived",
    className: "text-text-muted bg-bg-surface border-border-glass",
  },
};

export function CaseStudyHero({ study }: { study: CaseStudy }) {
  const status = statusStyles[study.status];

  return (
    <header className="relative border-b border-border-glass">
      {/* Ambient wash — decorative only */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-accent-cyan/5 blur-[120px]" />
        <div className="absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-accent-violet/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 pt-28 pb-14 sm:px-6 md:pt-32 lg:px-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-accent-cyan"
        >
          <ArrowLeft size={14} />
          All projects
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
              status.className
            )}
          >
            {study.status === "live" && (
              <span className="h-1.5 w-1.5 rounded-full bg-current animate-status-pulse" />
            )}
            {status.label}
          </span>
          {study.proprietary && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border-glass bg-bg-surface px-3 py-1 text-xs text-text-muted">
              <Lock size={11} />
              Proprietary — no screenshots
            </span>
          )}
        </div>

        <h1 className="font-display mt-5 text-3xl font-bold tracking-wide text-text-primary sm:text-4xl md:text-5xl">
          {study.title}
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-text-secondary md:text-xl">
          {study.tagline}
        </p>

        <dl className="mt-10 grid gap-x-8 gap-y-5 border-t border-border-glass pt-8 sm:grid-cols-2">
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              Role
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-text-secondary">
              {study.role}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              Timeline
            </dt>
            <dd className="mt-1.5 text-sm text-text-secondary">{study.timeline}</dd>
          </div>
        </dl>

        {study.links && Object.values(study.links).some(Boolean) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {study.links.live && (
              <a
                href={study.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-accent-cyan/30 bg-accent-cyan/10 px-4 py-2.5 text-sm font-medium text-accent-cyan transition-all hover:bg-accent-cyan/20 hover:shadow-[0_0_24px_rgba(0,240,255,0.25)]"
              >
                Visit the product
                <ArrowUpRight size={14} />
              </a>
            )}
            {study.links.api && (
              <a
                href={study.links.api}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border-glass bg-bg-surface px-4 py-2.5 text-sm text-text-secondary transition-colors hover:border-accent-cyan/30 hover:text-accent-cyan"
              >
                API
                <ArrowUpRight size={14} />
              </a>
            )}
            {study.links.github && (
              <a
                href={study.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border-glass bg-bg-surface px-4 py-2.5 text-sm text-text-secondary transition-colors hover:border-accent-cyan/30 hover:text-accent-cyan"
              >
                Source
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
