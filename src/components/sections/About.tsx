"use client";

import { motion } from "framer-motion";
import { GraduationCap, Zap, Users } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { about } from "@/lib/data";

export function About() {
  return (
    <section id="about" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="About Me"
          subtitle="A brief overview of who I am and what drives me"
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid lg:grid-cols-3 gap-6"
        >
          {/* Summary card (spans 2 cols) */}
          <GlassCard className="lg:col-span-2">
            <p className="text-text-secondary leading-relaxed text-base md:text-lg">
              {about.summary}
            </p>
          </GlassCard>

          {/* Education card */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap size={24} className="text-accent-cyan" />
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-accent-cyan">
                Education
              </h3>
            </div>
            <p className="text-text-primary font-medium">{about.education.degree}</p>
            <p className="text-text-secondary text-sm mt-1">
              {about.education.college}
            </p>
            <p className="text-text-muted text-sm mt-1">
              {about.education.period} · CGPA: {about.education.gpa}
            </p>
            <p className="text-accent-green text-sm mt-1 font-medium">
              ✅ {about.education.status}
            </p>
          </GlassCard>

          {/* Focus areas card */}
          <GlassCard className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Zap size={24} className="text-accent-violet" />
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-accent-violet">
                Current Focus
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {about.focusAreas.map((area, i) => (
                <motion.div
                  key={area}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="px-4 py-3 rounded-xl bg-bg-surface border border-border-glass text-sm text-text-secondary hover:border-accent-violet/30 hover:text-accent-violet transition-colors"
                >
                  {area}
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Studio card */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <Users size={24} className="text-accent-green" />
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-accent-green">
                Freelance Work
              </h3>
            </div>
            <p className="text-text-primary font-medium">Multi-Discipline Freelancer</p>
            <p className="text-text-secondary text-sm mt-1">
              Delivering web apps, e-commerce platforms, desktop tools, AI integrations, Figma plugins, and 3D art for clients.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
