"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skillCategories } from "@/lib/data";
import { clsx } from "clsx";

const colorMap: Record<string, string> = {
  "accent-cyan": "text-accent-cyan border-accent-cyan/20 bg-accent-cyan/5 hover:bg-accent-cyan/10 hover:border-accent-cyan/40 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]",
  "accent-violet": "text-accent-violet border-accent-violet/20 bg-accent-violet/5 hover:bg-accent-violet/10 hover:border-accent-violet/40 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]",
  "accent-green": "text-accent-green border-accent-green/20 bg-accent-green/5 hover:bg-accent-green/10 hover:border-accent-green/40 hover:shadow-[0_0_15px_rgba(0,255,136,0.15)]",
};

const labelColorMap: Record<string, string> = {
  "accent-cyan": "text-accent-cyan",
  "accent-violet": "text-accent-violet",
  "accent-green": "text-accent-green",
};

export function Skills() {
  return (
    <section id="skills" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Skills"
          subtitle="Technologies and tools I work with"
        />

        <div className="grid gap-10">
          {skillCategories.map((category, catIdx) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: catIdx * 0.05,
              }}
            >
              <h3
                className={clsx(
                  "font-display text-sm font-bold uppercase tracking-wider mb-4",
                  labelColorMap[category.color]
                )}
              >
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIdx) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.35,
                      delay: catIdx * 0.05 + skillIdx * 0.04,
                    }}
                    className={clsx(
                      "px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-300 cursor-default",
                      "animate-float",
                      colorMap[category.color]
                    )}
                    style={{
                      animationDelay: `${(catIdx * 7 + skillIdx) * 0.15}s`,
                      animationDuration: `${3 + (skillIdx % 3)}s`,
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
