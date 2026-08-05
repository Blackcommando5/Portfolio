"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, FileText, ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { certifications } from "@/lib/data";

const categories = ["All", ...Array.from(new Set(certifications.map((c) => c.category)))];

export function Certifications() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? certifications
      : certifications.filter((c) => c.category === activeCategory);

  return (
    <section className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Certifications"
          subtitle={`${certifications.length}+ certifications across AI, programming, design, and more`}
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border ${
                activeCategory === cat
                  ? "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                  : "bg-bg-surface text-text-muted border-border-glass hover:text-text-secondary hover:border-border-glass"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cert grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((cert, i) => (
              <motion.div
                key={cert.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <GlassCard
                  padding="sm"
                  className="h-full group"
                  onClick={
                    cert.file
                      ? () => window.open(cert.file, "_blank")
                      : undefined
                  }
                >
                  <div className="flex items-start gap-2.5">
                    {cert.file ? (
                      <FileText
                        size={18}
                        className="text-accent-cyan/60 group-hover:text-accent-cyan transition-colors shrink-0 mt-0.5"
                      />
                    ) : (
                      <Award
                        size={18}
                        className="text-accent-cyan/60 group-hover:text-accent-cyan transition-colors shrink-0 mt-0.5"
                      />
                    )}
                    <div className="min-w-0">
                      <h4 className="text-text-primary text-xs font-medium leading-snug">
                        {cert.name}
                      </h4>
                      <p className="text-text-muted text-[10px] mt-0.5 truncate">
                        {cert.issuer}
                      </p>
                      {cert.file && (
                        <span className="inline-flex items-center gap-1 text-accent-cyan/50 text-[10px] mt-1 group-hover:text-accent-cyan transition-colors">
                          <ExternalLink size={10} />
                          View Certificate
                        </span>
                      )}
                    </div>
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
