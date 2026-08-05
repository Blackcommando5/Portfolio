"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
import {
  getServerTheme,
  getTheme,
  subscribeToTheme,
  toggleTheme,
} from "@/lib/theme";

export function ThemeToggle() {
  /* Reads the <html> class rather than mirroring it in state — no effect, no
     cascading render, and no way for the two to drift apart. */
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme);
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-xl glass glass-hover flex items-center justify-center text-text-secondary hover:text-accent-cyan transition-colors cursor-pointer"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
