"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, FileImage, Play, Pause } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { designProjects } from "@/lib/data";

const categories = ["All", ...Array.from(new Set(designProjects.map((p) => p.category)))];

/* Inline video player with poster frame + play/pause */
function VideoPlayer({ src, alt }: { src: string; alt: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative aspect-video rounded-lg overflow-hidden bg-bg-secondary border border-border-glass cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        if (playing && videoRef.current) {
          videoRef.current.pause();
          setPlaying(false);
        }
      }}
      onClick={() => {
        if (!videoRef.current) return;
        if (playing) {
          videoRef.current.pause();
          setPlaying(false);
        } else {
          videoRef.current.play();
          setPlaying(true);
        }
      }}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      />
      {/* Play/pause overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-bg-surface/80 border border-border-glass flex items-center justify-center text-accent-violet shadow-lg">
          {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </div>
      </div>
      <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full bg-bg-surface/80 text-text-muted text-[9px] border border-border-glass">
        {hovered || playing ? "Hover to play" : "Click to play"}
      </span>
    </div>
  );
}

export function DesignWork() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? designProjects
      : designProjects.filter((p) => p.category === activeCategory);

  return (
    <section id="design" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Design Work"
          subtitle="Brand identities, illustrations, and CGI collaborations"
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border ${
                activeCategory === cat
                  ? "bg-accent-violet/10 text-accent-violet border-accent-violet/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                  : "bg-bg-surface text-text-muted border-border-glass hover:text-text-secondary hover:border-border-glass"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Design grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <GlassCard padding="sm" className="h-full">
                  {/* Thumbnail / Video */}
                  {project.video ? (
                    <div className="mb-3">
                      <VideoPlayer src={project.video} alt={project.name} />
                    </div>
                  ) : (
                    <div className="aspect-video rounded-lg overflow-hidden bg-bg-secondary border border-border-glass mb-3 flex items-center justify-center relative">
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <FileImage
                            size={24}
                            className="text-text-muted mx-auto mb-1"
                          />
                          <span className="text-text-muted text-[10px]">
                            No preview
                          </span>
                        </div>
                      )}
                      {project.permissionNeeded && (
                        <div className="absolute top-1.5 right-1.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-violet/10 text-accent-violet text-[10px] font-bold border border-accent-violet/20">
                          <Lock size={10} />
                          Permission needed
                        </div>
                      )}
                    </div>
                  )}

                  <h4 className="font-display text-sm font-bold text-text-primary">
                    {project.name}
                  </h4>
                  <p className="text-accent-violet/70 text-xs mt-0.5">
                    {project.client}
                  </p>
                  <p className="text-text-muted text-xs mt-2 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {project.tools.map((tool) => (
                      <span
                        key={tool}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-accent-violet/5 text-accent-violet border border-accent-violet/10"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
