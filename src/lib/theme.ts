/* ── Theme ────────────────────────────────────────────────────────────────── */
/* The <html> element is the single source of truth: it carries the `light`
   class. An inline script in the document head sets that class before first
   paint, so there is no flash of the wrong theme. React subscribes to the
   element rather than holding its own copy of the value, which keeps the two
   from disagreeing. */

export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";

/** Fires when the theme changes so every mounted toggle re-reads the DOM. */
const THEME_EVENT = "themechange";

/**
 * Runs in the document head before paint. Kept as a string because it has to
 * execute synchronously, ahead of hydration. Mirrors `applyTheme` below —
 * change both together.
 */
export const themeInitScript = `
(function(){
  try {
    var saved = localStorage.getItem("${THEME_STORAGE_KEY}");
    var dark = saved
      ? saved === "dark"
      : !window.matchMedia("(prefers-color-scheme: light)").matches;
    document.documentElement.classList.toggle("light", !dark);
  } catch (e) {
    /* Private mode can throw on localStorage. Dark is the default. */
  }
})();
`;

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("light", theme === "light");
}

export function getTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

export function setTheme(theme: Theme) {
  applyTheme(theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* Persistence is best-effort; the class is already applied. */
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function toggleTheme() {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}

/* ── useSyncExternalStore wiring ─────────────────────────────────────────── */

export function subscribeToTheme(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

/** The server has no DOM to read, and the head script defaults to dark. */
export function getServerTheme(): Theme {
  return "dark";
}
