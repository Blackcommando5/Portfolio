import { Check, GitBranch, Scale, ArrowRight } from "lucide-react";
import type {
  Block,
  Decision,
  Flow,
  Metric,
  StackGroup,
} from "@/lib/case-studies";

/* ── Section shell ───────────────────────────────────────────────────────── */

export function Section({
  id,
  kicker,
  title,
  children,
}: {
  id?: string;
  kicker?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-border-glass py-14 md:py-16">
      {kicker && (
        /* Tight tracking — at 0.2em a two-digit kicker reads as "0 4". */
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-accent-cyan/70">
          {kicker}
        </p>
      )}
      <h2 className="font-display mt-2 text-xl font-bold tracking-wide text-text-primary md:text-2xl">
        {title}
      </h2>
      <div className="mt-7">{children}</div>
    </section>
  );
}

/* ── Prose block ─────────────────────────────────────────────────────────── */

export function Prose({ body, bullets }: Pick<Block, "body" | "bullets">) {
  return (
    <>
      {body && (
        <p className="max-w-3xl text-[15px] leading-[1.75] text-text-secondary">
          {body}
        </p>
      )}
      {bullets && bullets.length > 0 && (
        <ul className={`${body ? "mt-5" : ""} max-w-3xl space-y-2.5`}>
          {bullets.map((item) => (
            <li key={item} className="flex gap-3 text-[15px] leading-[1.7] text-text-secondary">
              <span
                aria-hidden
                className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent-cyan/60"
              />
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/** A run of headed prose blocks, e.g. the approach or engineering sections. */
export function BlockList({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-10">
      {blocks.map((block) => (
        <div key={block.heading}>
          <h3 className="text-base font-semibold text-text-primary">
            {block.heading}
          </h3>
          <div className="mt-2.5">
            <Prose body={block.body} bullets={block.bullets} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Metrics ─────────────────────────────────────────────────────────────── */

export function MetricStrip({ metrics }: { metrics: Metric[] }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border-glass bg-border-glass md:grid-cols-3">
      {metrics.map((metric) => (
        <div key={metric.label} className="bg-bg-primary p-5">
          <dt className="font-display text-xl font-bold text-accent-cyan md:text-2xl">
            {metric.value}
          </dt>
          <dd className="mt-1.5 text-xs leading-relaxed text-text-muted">
            {metric.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ── User flows ──────────────────────────────────────────────────────────── */

export function FlowSteps({ flows }: { flows: Flow[] }) {
  return (
    <div className="space-y-8">
      {flows.map((flow) => (
        <div key={flow.actor}>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <GitBranch size={14} className="text-accent-violet" />
            {flow.actor}
          </h3>
          <ol className="mt-4 space-y-0">
            {flow.steps.map((step, i) => (
              <li key={step.label} className="relative flex gap-4 pb-5 last:pb-0">
                {/* Connector */}
                {i < flow.steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-[13px] top-7 bottom-0 w-px bg-border-glass"
                  />
                )}
                <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent-cyan/25 bg-bg-primary text-[11px] font-bold text-accent-cyan">
                  {i + 1}
                </span>
                <div className="pt-0.5">
                  <p className="text-sm font-medium text-text-primary">{step.label}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-text-muted">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

/* ── Architecture ────────────────────────────────────────────────────────── */

/** Shared by the monospace block and the drawn diagrams. */
export function ArchitectureNotes({ notes }: { notes: string[] }) {
  if (notes.length === 0) return null;
  return (
    <ul className="max-w-3xl space-y-2.5">
      {notes.map((note) => (
        <li key={note} className="flex gap-3 text-sm leading-relaxed text-text-secondary">
          <Check size={14} className="mt-1 shrink-0 text-accent-green/70" />
          {note}
        </li>
      ))}
    </ul>
  );
}

export function ArchitectureBlock({
  diagram,
  notes,
}: {
  diagram: string;
  notes?: string[];
}) {
  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-border-glass bg-bg-secondary p-5">
        <pre className="w-max text-[11px] leading-[1.5] text-text-secondary sm:text-xs">
          {diagram}
        </pre>
      </div>
      {notes && notes.length > 0 && (
        <div className="mt-6">
          <ArchitectureNotes notes={notes} />
        </div>
      )}
    </div>
  );
}

/* ── Decisions ───────────────────────────────────────────────────────────── */

export function DecisionList({ decisions }: { decisions: Decision[] }) {
  return (
    <div className="space-y-4">
      {decisions.map((item) => (
        <article
          key={item.decision}
          className="rounded-2xl border border-border-glass bg-bg-surface p-5 transition-colors hover:border-accent-cyan/20 md:p-6"
        >
          <h3 className="text-[15px] font-semibold leading-snug text-text-primary">
            {item.decision}
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-accent-cyan/70">
                <ArrowRight size={11} />
                Why
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                {item.why}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-accent-violet/70">
                <Scale size={11} />
                Trade-off
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                {item.tradeoff}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ── Stack ───────────────────────────────────────────────────────────────── */

export function StackGrid({ groups }: { groups: StackGroup[] }) {
  return (
    <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      {groups.map((group) => (
        <div key={group.layer}>
          <dt className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
            {group.layer}
          </dt>
          <dd className="mt-2 flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <span
                key={item}
                className="rounded-lg border border-accent-cyan/10 bg-accent-cyan/5 px-2.5 py-1 text-xs text-accent-cyan/80"
              >
                {item}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ── Roadmap ─────────────────────────────────────────────────────────────── */

export function RoadmapList({ items }: { items: string[] }) {
  return (
    <ul className="grid max-w-3xl gap-2.5 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-xl border border-border-glass bg-bg-surface px-4 py-3 text-sm text-text-secondary"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
