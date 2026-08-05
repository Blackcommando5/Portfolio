"use client";

import { motion } from "framer-motion";
import { Play, MapPin, Calendar } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { recentWork } from "@/lib/data";

export function CurrentlyBuilding() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Recent Work"
          subtitle="My latest professional experience"
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <GlassCard glow padding="lg" className="relative overflow-hidden">
            {/* Accent top line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-cyan to-transparent" />

            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Left: Details */}
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h3 className="font-display text-xl md:text-2xl font-bold text-accent-cyan">
                    {recentWork.role}
                  </h3>
                  <span className="text-text-muted text-sm">@ {recentWork.company}</span>
                </div>

                <div className="flex flex-wrap gap-3 mb-6 text-sm text-text-secondary">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} className="text-accent-cyan" />
                    {recentWork.period}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-accent-cyan" />
                    Completed
                  </span>
                </div>

                <p className="text-text-secondary leading-relaxed mb-6">
                  {recentWork.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {recentWork.tech.map((tech) => (
                    <Badge key={tech} variant="cyan">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Right: Video placeholder */}
              <div className="relative rounded-xl overflow-hidden bg-bg-secondary border border-border-glass aspect-video flex items-center justify-center">
                {/* 🔄 SWAP: Replace this placeholder with your real VR demo video.
                    Example: <video src="/videos/vr-demo.mp4" controls className="w-full h-full object-cover" />
                    Or embed: <iframe src="https://www.youtube.com/embed/VIDEO_ID" ... />
                */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-accent-violet/5" />
                <div className="relative text-center">
                  <div className="w-16 h-16 rounded-full glass flex items-center justify-center mx-auto mb-3 cursor-pointer hover:bg-accent-cyan/10 transition-colors">
                    <Play size={24} className="text-accent-cyan ml-1" />
                  </div>
                  <p className="text-text-muted text-sm">VR Demo Preview</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
