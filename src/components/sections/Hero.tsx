"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { siteConfig, roles, currentStatus } from "@/lib/data";

const HeroModel = dynamic(
  () => import("@/components/three/HeroModel").then((mod) => ({ default: mod.HeroModel })),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
);

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg"
    >
      {/* Scanline overlay */}
      <div className="scanlines absolute inset-0 pointer-events-none" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-violet/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Text content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Status badge */}
              {/* max-w-full lets the pill wrap instead of running off a phone
                  screen — the label is long enough to need two lines there. */}
              <div className="inline-flex max-w-full items-start gap-2 px-4 py-2 rounded-full glass text-sm mb-6 text-left">
                <span className="mt-1.5 w-2 h-2 shrink-0 rounded-full bg-accent-green animate-status-pulse" />
                <span className="text-accent-green font-medium">
                  {currentStatus.badge}
                </span>
              </div>

              {/* Name — starts a step smaller with tighter tracking, because
                  "Subashkrishnan" is long enough to overflow a 360px screen at
                  text-4xl with wide letter spacing. */}
              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide sm:tracking-wider leading-tight break-words">
                <span className="text-text-primary">{siteConfig.name.split(" ")[0]}</span>
                <br />
                <span className="text-accent-cyan glow-text">
                  {siteConfig.name.split(" ").slice(1).join(" ")}
                </span>
              </h1>

              {/* Rotating role titles. The window clips the slide transition on
                  purpose; h-9 keeps the settled line clear of the edges. */}
              <div className="mt-4 h-9 overflow-hidden">
                <motion.p
                  key={roleIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-lg md:text-xl text-text-secondary font-medium"
                >
                  {roles[roleIndex]}
                </motion.p>
              </div>

              {/* Location */}
              <p className="mt-2 text-text-muted text-sm flex items-center justify-center lg:justify-start gap-1">
                📍 {siteConfig.location}
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                <GlowButton variant="primary" href="#projects">
                  <ArrowDown size={16} />
                  View My Work
                </GlowButton>
                <GlowButton variant="secondary" href="#contact">
                  <Mail size={16} />
                  Get in Touch
                </GlowButton>
              </div>
            </motion.div>
          </div>

          {/* Right: 3D model */}
          <div className="order-1 lg:order-2 h-[300px] sm:h-[400px] lg:h-[500px]">
            <HeroModel />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown size={20} className="text-text-muted" />
      </motion.div>
    </section>
  );
}
