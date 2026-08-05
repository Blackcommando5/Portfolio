"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Box, Globe, Smartphone, AppWindow, Glasses } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { disciplines, projects, assets3d, type Discipline } from "@/lib/data";
import { clsx } from "clsx";

/* Icon map — lucide component for each discipline */
const iconMap: Record<Discipline, React.FC<{ size?: number; className?: string }>> = {
  "3d": Box,
  web: Globe,
  app: Smartphone,
  windows: AppWindow,
  arvr: Glasses,
};

/* Discipline accent colors */
const colorMap: Record<Discipline, { text: string; bg: string; border: string; hoverBorder: string; glow: string }> = {
  "3d": {
    text: "text-accent-green",
    bg: "bg-accent-green/5",
    border: "border-accent-green/20",
    hoverBorder: "hover:border-accent-green/40",
    glow: "hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]",
  },
  web: {
    text: "text-accent-violet",
    bg: "bg-accent-violet/5",
    border: "border-accent-violet/20",
    hoverBorder: "hover:border-accent-violet/40",
    glow: "hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]",
  },
  app: {
    text: "text-accent-cyan",
    bg: "bg-accent-cyan/5",
    border: "border-accent-cyan/20",
    hoverBorder: "hover:border-accent-cyan/40",
    glow: "hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]",
  },
  windows: {
    text: "text-accent-cyan",
    bg: "bg-accent-cyan/5",
    border: "border-accent-cyan/20",
    hoverBorder: "hover:border-accent-cyan/40",
    glow: "hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]",
  },
  arvr: {
    text: "text-accent-green",
    bg: "bg-accent-green/5",
    border: "border-accent-green/20",
    hoverBorder: "hover:border-accent-green/40",
    glow: "hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]",
  },
};

export function WhatIDo() {
  /* Count projects + assets per discipline */
  const counts = useMemo(() => {
    const map: Record<Discipline, number> = { "3d": 0, web: 0, app: 0, windows: 0, arvr: 0 };
    projects.forEach((p) => map[p.discipline]++);
    assets3d.forEach((a) => map[a.discipline]++);
    return map;
  }, []);

  return (
    <section id="what-i-do" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary tracking-wider">
            What I Do
          </h2>
          <p className="text-text-muted mt-2 text-sm md:text-base max-w-xl mx-auto">
            Five disciplines, one creative engineer
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {disciplines.map((disc, i) => {
            const Icon = iconMap[disc.id];
            const colors = colorMap[disc.id];
            return (
              <motion.a
                key={disc.id}
                href={disc.sectionHref}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <GlassCard
                  className={clsx(
                    "h-full flex flex-col items-center text-center gap-3 py-6 px-4 cursor-pointer",
                    "transition-all duration-300",
                    colors.hoverBorder,
                    colors.glow
                  )}
                >
                  {/* Icon */}
                  <div
                    className={clsx(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      colors.bg,
                      colors.border,
                      "border"
                    )}
                  >
                    <Icon size={24} className={colors.text} />
                  </div>

                  {/* Label */}
                  <h3 className="font-display text-sm font-bold text-text-primary">
                    {disc.label}
                  </h3>

                  {/* Description */}
                  <p className="text-text-muted text-xs leading-relaxed flex-1">
                    {disc.description}
                  </p>

                  {/* Count */}
                  <span
                    className={clsx(
                      "text-[11px] font-bold px-2.5 py-1 rounded-full border",
                      colors.bg,
                      colors.text,
                      colors.border
                    )}
                  >
                    {counts[disc.id]} project{counts[disc.id] !== 1 ? "s" : ""}
                  </span>
                </GlassCard>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
