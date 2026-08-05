"use client";

import { clsx } from "clsx";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  title,
  subtitle,
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={clsx(
        "mb-12 md:mb-16",
        align === "center" && "text-center",
        align === "left" && "text-left",
        className
      )}
    >
      <h2
        className={clsx(
          "font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide",
          align === "center" && "mx-auto"
        )}
      >
        <span className="hud-corners relative inline-block px-4 py-2">
          <span className="text-accent-cyan glow-text">&lt;</span>
          {title}
          <span className="text-accent-cyan glow-text"> /&gt;</span>
        </span>
      </h2>
      {subtitle && (
        <p className="mt-4 text-text-secondary text-base md:text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
