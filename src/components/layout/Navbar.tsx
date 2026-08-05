"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { siteConfig } from "@/lib/data";
import { clsx } from "clsx";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "3D Showcase", href: "#showcase" },
  { label: "Design", href: "#design" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "glass py-3"
          : "py-5 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="font-display text-lg md:text-xl font-bold tracking-wider text-accent-cyan glow-text hover:opacity-80 transition-opacity"
        >
          {siteConfig.name.split(" ")[0]}
          <span className="text-text-primary">.dev</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-text-secondary hover:text-accent-cyan transition-colors rounded-lg hover:bg-accent-cyan/5"
            >
              {link.label}
            </a>
          ))}
          <div className="ml-3">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center text-text-secondary hover:text-accent-cyan transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={clsx(
          "md:hidden glass border-t border-border-glass overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-sm text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/5 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
