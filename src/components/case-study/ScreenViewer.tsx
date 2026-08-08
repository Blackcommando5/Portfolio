"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff, Monitor, Smartphone } from "lucide-react";
import { clsx } from "clsx";
import type { ScreenGroup, Shot } from "@/lib/case-studies";

const accessStyles: Record<ScreenGroup["access"], string> = {
  public: "text-accent-green bg-accent-green/5 border-accent-green/20",
  authenticated: "text-accent-cyan bg-accent-cyan/5 border-accent-cyan/20",
  admin: "text-accent-violet bg-accent-violet/5 border-accent-violet/20",
};

const accessLabels: Record<ScreenGroup["access"], string> = {
  public: "No login",
  authenticated: "Signed in",
  admin: "Admin only",
};

/* ── Device chrome ───────────────────────────────────────────────────────── */

function BrowserBar({ route }: { route: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border-glass bg-bg-surface px-3 py-2">
      <span className="flex gap-1.5" aria-hidden>
        <span className="h-2 w-2 rounded-full bg-text-muted/30" />
        <span className="h-2 w-2 rounded-full bg-text-muted/30" />
        <span className="h-2 w-2 rounded-full bg-text-muted/30" />
      </span>
      <span className="ml-1 truncate rounded-md bg-bg-primary/60 px-2 py-0.5 font-mono text-[10px] text-text-muted">
        {route}
      </span>
    </div>
  );
}

/* ── The frame that holds either a screenshot or a labelled placeholder ──── */

function ShotFrame({ shot }: { shot: Shot }) {
  const isPortrait = shot.aspect === "portrait";

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-xl border border-border-glass bg-bg-secondary",
        isPortrait ? "mx-auto w-full max-w-[280px]" : "w-full"
      )}
    >
      {!isPortrait && <BrowserBar route={shot.route} />}

      <div className={clsx("relative", isPortrait ? "aspect-[9/16]" : "aspect-video")}>
        {shot.src ? (
          <Image
            src={shot.src}
            alt={`${shot.label} — ${shot.detail}`}
            fill
            sizes={isPortrait ? "280px" : "(max-width: 768px) 100vw, 700px"}
            /* contain, not cover — a capture whose aspect doesn't match the
               frame gets letterboxed rather than silently cropped. */
            className="object-contain"
          />
        ) : (
          /* Capture pending. Deliberate frame, not a broken image. */
          <div className="absolute inset-0 grid-bg flex flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-glass bg-bg-surface">
              {isPortrait ? (
                <Smartphone size={18} className="text-text-muted" />
              ) : (
                <Monitor size={18} className="text-text-muted" />
              )}
            </span>
            <p className="font-mono text-[11px] text-text-muted">{shot.route}</p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border-glass bg-bg-surface/80 px-2.5 py-1 text-[10px] text-text-muted/70">
              <ImageOff size={10} />
              Capture pending
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Viewer ──────────────────────────────────────────────────────────────── */

/** Open on whichever group has the most real captures, so a visitor never
 *  lands on a tab of placeholders while another tab has screenshots. Resolves
 *  itself as captures get filled in. */
function bestGroupIndex(groups: ScreenGroup[]) {
  let best = 0;
  let bestCount = -1;
  groups.forEach((g, i) => {
    const captured = g.shots.filter((s) => s.src).length;
    if (captured > bestCount) {
      bestCount = captured;
      best = i;
    }
  });
  return best;
}

/** Within a group, open on the first captured shot rather than a placeholder. */
function firstCapturedShot(group: ScreenGroup | undefined) {
  if (!group) return 0;
  const i = group.shots.findIndex((s) => s.src);
  return i === -1 ? 0 : i;
}

export function ScreenViewer({ groups }: { groups: ScreenGroup[] }) {
  const [groupIndex, setGroupIndex] = useState(() => bestGroupIndex(groups));
  const [shotIndex, setShotIndex] = useState(() =>
    firstCapturedShot(groups[bestGroupIndex(groups)])
  );

  const group = groups[groupIndex];
  if (!group) return null;

  const shot = group.shots[shotIndex] ?? group.shots[0];
  if (!shot) return null;

  const total = group.shots.length;

  function selectGroup(i: number) {
    setGroupIndex(i);
    setShotIndex(firstCapturedShot(groups[i]));
  }

  function step(delta: number) {
    setShotIndex((prev) => (prev + delta + total) % total);
  }

  return (
    <div>
      {/* Group tabs */}
      <div role="tablist" aria-label="Screen groups" className="flex flex-wrap gap-2">
        {groups.map((g, i) => (
          <button
            key={g.group}
            role="tab"
            aria-selected={i === groupIndex}
            onClick={() => selectGroup(i)}
            className={clsx(
              "cursor-pointer rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors",
              i === groupIndex
                ? "border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan"
                : "border-border-glass bg-bg-surface text-text-muted hover:text-text-secondary"
            )}
          >
            {g.group}
            <span className="ml-1.5 text-[11px] opacity-60">{g.shots.length}</span>
          </button>
        ))}
      </div>

      {/* Access note for the active group */}
      <p className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={clsx(
            "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium",
            accessStyles[group.access]
          )}
        >
          {accessLabels[group.access]}
        </span>
        <span className="text-xs text-text-muted">
          {group.group} · {total} screen{total === 1 ? "" : "s"}
        </span>
      </p>

      {/* Stage */}
      <div className="mt-5 rounded-2xl border border-border-glass bg-bg-surface p-4 md:p-6">
        <ShotFrame shot={shot} />

        {/* Caption */}
        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary">{shot.label}</p>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">{shot.detail}</p>
            <p className="mt-2 font-mono text-[11px] text-accent-cyan/60">{shot.route}</p>
          </div>

          {total > 1 && (
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                onClick={() => step(-1)}
                aria-label="Previous screen"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border-glass bg-bg-primary text-text-muted transition-colors hover:text-accent-cyan"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="min-w-[3rem] text-center font-mono text-[11px] text-text-muted">
                {shotIndex + 1} / {total}
              </span>
              <button
                onClick={() => step(1)}
                aria-label="Next screen"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border-glass bg-bg-primary text-text-muted transition-colors hover:text-accent-cyan"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Step rail */}
        {total > 1 && (
          <div className="mt-5 flex gap-1.5 border-t border-border-glass pt-4">
            {group.shots.map((s, i) => (
              <button
                key={s.route}
                onClick={() => setShotIndex(i)}
                aria-label={s.label}
                aria-current={i === shotIndex}
                className={clsx(
                  "h-1 flex-1 cursor-pointer rounded-full transition-colors",
                  i === shotIndex
                    ? "bg-accent-cyan"
                    : "bg-border-glass hover:bg-text-muted/40"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
