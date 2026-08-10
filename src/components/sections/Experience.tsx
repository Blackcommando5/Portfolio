"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experiences } from "@/lib/data";

export function Experience() {
  return (
    <section id="experience" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Experience"
          subtitle="My professional journey so far"
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-cyan/40 via-accent-violet/40 to-transparent md:-translate-x-px" />

          {experiences.map((exp, i) => {
            const isLeft = i % 2 === 0;

            return (
              <motion.div
                key={exp.company}
                /* Vertical, not the alternating horizontal slide it used to be.
                   Entries below the fold sit at their initial offset until they
                   scroll into view, and a ±40px x-offset on a single-column
                   mobile timeline widened the whole document — enough to make
                   phones zoom the page out on first load. */
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`relative mb-12 last:mb-0 md:w-1/2 ${
                  isLeft
                    ? "md:pr-12 md:text-right"
                    : "md:ml-auto md:pl-12"
                } pl-12 md:pl-0`}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute top-6 w-3 h-3 rounded-full bg-accent-cyan shadow-[0_0_12px_rgba(0,240,255,0.5)] ${
                    isLeft
                      ? "left-[10px] md:left-auto md:right-[-6.5px]"
                      : "left-[10px] md:left-[-6.5px]"
                  }`}
                />

                <GlassCard>
                  <div className="flex flex-col gap-1 mb-3">
                    <span className="text-accent-cyan font-display text-xs font-bold uppercase tracking-wider">
                      {exp.role}
                    </span>
                    <span className="text-text-secondary text-sm">
                      {exp.company}
                    </span>
                    <span className="text-text-muted text-xs">{exp.period}</span>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">
                    {exp.description}
                  </p>
                  <div className={`flex flex-wrap gap-1.5 ${isLeft ? "md:justify-end" : ""}`}>
                    {exp.tech.map((t) => (
                      <Badge key={t} variant={i === 0 ? "cyan" : "default"}>
                        {t}
                      </Badge>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
