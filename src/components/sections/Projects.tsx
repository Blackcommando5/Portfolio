"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Lock } from "lucide-react";

/* GitHub icon (removed from lucide-react v1+) */
function GitHubIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects, type Discipline } from "@/lib/data";
import { clsx } from "clsx";

/* Filter tab definitions */
const filterTabs: { label: string; value: Discipline | "all" }[] = [
  { label: "All", value: "all" },
  { label: "AI / ML", value: "aiml" },
  { label: "Web", value: "web" },
  { label: "App", value: "app" },
  { label: "Windows", value: "windows" },
  { label: "AR/VR", value: "arvr" },
];

export function Projects() {
  const [activeFilter, setActiveFilter] = useState<Discipline | "all">("all");

  /* Matches the primary discipline or any secondary one, so AI work shows up
     under AI/ML without leaving the web, app, or desktop filter it lives in. */
  const filteredProjects = projects.filter(
    (p) =>
      activeFilter === "all" ||
      p.discipline === activeFilter ||
      p.alsoIn?.includes(activeFilter)
  );

  /* The featured/compact split is an editorial device for the "All" overview,
     where 30 full cards would be unreadable. Once someone picks a discipline
     they have asked to see that discipline, so every match renders as a full
     card and nothing is demoted into a one-line list. */
  const isAll = activeFilter === "all";
  const featured = isAll
    ? filteredProjects.filter((p) => p.tier === "featured")
    : filteredProjects;
  const secondary = isAll
    ? filteredProjects.filter((p) => p.tier === "secondary")
    : [];

  const activeLabel =
    filterTabs.find((t) => t.value === activeFilter)?.label ?? "All";

  return (
    <section id="projects" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Projects"
          subtitle="Selected work showcasing problem-solving through code"
        />

        {/* ── Filter Tabs ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={clsx(
                "px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer",
                activeFilter === tab.value
                  ? "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                  : "bg-bg-surface text-text-muted border-border-glass hover:text-text-secondary hover:border-border-glass/80"
              )}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* ── Featured / Primary Projects ────────────────────────────── */}
        {featured.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-sm uppercase tracking-widest text-text-muted font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
              {isAll
                ? "Featured Projects"
                : `${activeLabel} — ${featured.length} project${featured.length === 1 ? "" : "s"}`}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((project, i) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.08 }}
                >
                  <GlassCard className="relative h-full flex flex-col group">
                    {/* Stretched link: makes the whole card navigate without
                        wrapping it in an anchor, which would nest the Code and
                        Live links inside another link and swallow the video's
                        controls. Interactive children sit above it via z-10. */}
                    {project.slug && (
                      <Link
                        href={`/projects/${project.slug}`}
                        aria-label={`${project.title} — read case study`}
                        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan"
                      />
                    )}

                    {/* Thumbnail is the first element in every card so the images
                        line up across a row. The badge is overlaid on it rather
                        than stacked above — sitting above pushed the image down
                        on badged cards only, which broke that alignment.

                        Renders `image` when set, otherwise a labelled frame so a
                        missing file never looks broken. */}
                    <div className="relative -mx-6 md:-mx-8 -mt-6 md:-mt-8 mb-6 aspect-video overflow-hidden rounded-t-2xl bg-bg-secondary border-b border-border-glass">
                      {project.badge && (
                        <div className="absolute top-3 left-3 z-20">
                          <Badge variant={project.badge.variant}>
                            {project.badge.label}
                          </Badge>
                        </div>
                      )}
                      {/* Employer-owned work. Stated on the card itself, since
                          the thumbnail no longer carries the notice now that
                          every project has a real image. */}
                      {project.confidential && (
                        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-bg-primary/85 px-2.5 py-1 text-[11px] font-medium text-amber-300/90 backdrop-blur-sm">
                          <Lock size={11} />
                          Company project — confidential
                        </div>
                      )}
                      {project.video ? (
                        /* preload="none" so a card with a clip costs nothing
                           until someone actually presses play. relative z-10
                           keeps its controls above the stretched link. */
                        <video
                          src={project.video}
                          poster={project.image}
                          controls
                          preload="none"
                          playsInline
                          className="relative z-10 w-full h-full object-cover"
                          aria-label={`${project.title} — gameplay clip`}
                        />
                      ) : project.image ? (
                        <Image
                          src={project.image}
                          alt={`${project.title} — project thumbnail`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-accent-cyan/5 to-accent-violet/5 flex items-center justify-center">
                          {project.confidential ? (
                            <div className="flex items-center gap-2 text-text-muted/60 text-xs">
                              <Lock size={14} />
                              <span>Confidential — screenshot needs permission</span>
                            </div>
                          ) : (
                            <span className="text-text-muted text-xs">
                              {project.title} screenshot
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="font-display text-lg font-bold text-text-primary group-hover:text-accent-cyan transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-accent-cyan/70 text-sm mt-1">
                        {project.tagline}
                      </p>

                      <div className="mt-4 flex-1">
                        <p className="text-text-muted text-xs uppercase tracking-wider font-bold mb-1">
                          Problem
                        </p>
                        <p className="text-text-secondary text-sm leading-relaxed">
                          {project.problem}
                        </p>
                        <p className="text-text-muted text-xs uppercase tracking-wider font-bold mb-1 mt-3">
                          Solution
                        </p>
                        <p className="text-text-secondary text-sm leading-relaxed">
                          {project.solution}
                        </p>
                      </div>

                      {/* Tech + Links */}
                      <div className="flex flex-wrap gap-1.5 mt-4 mb-4">
                        {project.tech.map((t) => (
                          <Badge key={t} variant="cyan">
                            {t}
                          </Badge>
                        ))}
                      </div>

                      {/* z-10 so the outbound links stay clickable over the
                          stretched card link. */}
                      <div className="relative z-10 flex flex-wrap items-center gap-3 mt-auto pt-4 border-t border-border-glass">
                        {project.slug && (
                          /* Not a link — the stretched overlay owns the click.
                             A second anchor to the same place would just add a
                             duplicate tab stop. */
                          <span className="flex items-center gap-1.5 text-sm font-medium text-accent-cyan pointer-events-none">
                            Read case study
                            <ArrowRight
                              size={14}
                              className="transition-transform group-hover:translate-x-0.5"
                            />
                          </span>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-text-muted hover:text-accent-cyan transition-colors"
                          >
                            <GitHubIcon size={14} />
                            Code
                          </a>
                        )}
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-text-muted hover:text-accent-cyan transition-colors"
                          >
                            <ExternalLink size={14} />
                            Live
                          </a>
                        )}
                        {project.confidential && (
                          <span className="flex items-center gap-1.5 text-sm text-amber-300/70">
                            <Lock size={14} />
                            Employer-owned — media pending approval
                          </span>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Secondary / More Projects ─────────────────────────────── */}
        {secondary.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-sm uppercase tracking-widest text-text-muted font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-violet" />
              More Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {secondary.map((project, i) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.06 }}
                >
                  <GlassCard className="relative group">
                    {/* Same stretched-link approach as the featured cards. */}
                    {project.slug && (
                      <Link
                        href={`/projects/${project.slug}`}
                        aria-label={`${project.title} — read case study`}
                        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan"
                      />
                    )}
                    <div className="flex flex-col gap-2">
                      {/* Title row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-sm font-bold text-text-primary group-hover:text-accent-cyan transition-colors truncate">
                            {project.title}
                          </h3>
                          <p className="text-accent-cyan/60 text-xs mt-0.5 line-clamp-1">
                            {project.tagline}
                          </p>
                        </div>
                        {/* Links — above the stretched link so they stay usable */}
                        <div className="relative z-10 flex items-center gap-2 shrink-0">
                          {project.slug && (
                            <span className="text-[11px] font-medium text-accent-cyan pointer-events-none">
                              Case study
                            </span>
                          )}
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-text-muted hover:text-accent-cyan transition-colors"
                              aria-label="View source code"
                            >
                              <GitHubIcon size={14} />
                            </a>
                          )}
                          {project.live && (
                            <a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-text-muted hover:text-accent-cyan transition-colors"
                              aria-label="View live site"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                          {project.confidential && (
                            <span className="flex items-center gap-1 rounded-full border border-amber-400/25 bg-amber-400/5 px-2 py-0.5 text-[10px] font-medium text-amber-300/90 whitespace-nowrap">
                              <Lock size={10} />
                              Confidential
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Tech badges — compact row */}
                      <div className="flex flex-wrap gap-1">
                        {project.tech.slice(0, 6).map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent-cyan/5 text-accent-cyan/70 border border-accent-cyan/10"
                          >
                            {t}
                          </span>
                        ))}
                        {project.tech.length > 6 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-text-muted/50">
                            +{project.tech.length - 6}
                          </span>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Index link */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/projects"
            className="group/all inline-flex items-center gap-2 rounded-xl border border-border-glass bg-bg-surface px-5 py-3 text-sm text-text-secondary transition-colors hover:border-accent-cyan/30 hover:text-accent-cyan"
          >
            Browse all {projects.length} projects
            <ArrowRight
              size={14}
              className="transition-transform group-hover/all:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Empty state for filter */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-text-muted text-sm">
              No projects in this category yet.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
