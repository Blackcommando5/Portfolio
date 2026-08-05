"use client";

import { clsx } from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "cyan" | "violet" | "green" | "default";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
        variant === "cyan" &&
          "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20",
        variant === "violet" &&
          "bg-accent-violet/10 text-accent-violet border border-accent-violet/20",
        variant === "green" &&
          "bg-accent-green/10 text-accent-green border border-accent-green/20",
        variant === "default" &&
          "bg-bg-surface text-text-secondary border border-border-glass",
        className
      )}
    >
      {children}
    </span>
  );
}
