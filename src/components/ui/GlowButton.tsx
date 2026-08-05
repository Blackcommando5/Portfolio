"use client";

import { ReactNode } from "react";
import { clsx } from "clsx";

interface GlowButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

export function GlowButton({
  children,
  className,
  variant = "primary",
  href,
  onClick,
  type = "button",
}: GlowButtonProps) {
  const baseStyles = clsx(
    "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer",
    variant === "primary" &&
      "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30 hover:bg-accent-cyan/20 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]",
    variant === "secondary" &&
      "bg-accent-violet/10 text-accent-violet border border-accent-violet/30 hover:bg-accent-violet/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]",
    className
  );

  if (href) {
    return (
      <a href={href} className={baseStyles}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseStyles}>
      {children}
    </button>
  );
}
