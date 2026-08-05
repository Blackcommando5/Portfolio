"use client";

import { ReactNode } from "react";
import { clsx } from "clsx";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  glow = false,
  hover = true,
  padding = "md",
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "glass rounded-2xl relative",
        glow && "animate-glow-border border-accent-cyan/20",
        hover && "glass-hover",
        padding === "sm" && "p-4",
        padding === "md" && "p-6 md:p-8",
        padding === "lg" && "p-8 md:p-12",
        className
      )}
    >
      {children}
    </div>
  );
}
