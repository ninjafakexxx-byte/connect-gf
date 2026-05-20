import { useEffect, useState, useCallback } from "react";

type Theme = "dark" | "black";

const STORAGE_KEY = "theme";
const EVENT_NAME = "adna-theme-change";

function readStored(): Theme {
  if (typeof window === "undefined") return "dark";
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "black" ? "black" : "dark";
}

function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("dark", "black");
  if (t === "black") {
    root.classList.add("black");
    root.setAttribute("data-theme", "premium-dark");
  } else {
    root.classList.add("dark");
    root.setAttribute("data-theme", "classic");
  }
}

// Ensure theme is reapplied on every navigation/render in SPA. Idempotent.
export function syncThemeFromStorage() {
  applyTheme(readStored());
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readStored);

  // Apply on mount + when value changes
  useEffect(() => {
    applyTheme(theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
  }, [theme]);

  // Cross-instance + cross-tab sync
  useEffect(() => {
    const handler = () => {
      const next = readStored();
      setThemeState((prev) => (prev === next ? prev : next));
      applyTheme(next);
    };
    window.addEventListener("storage", handler);
    window.addEventListener(EVENT_NAME, handler);
    // Re-assert on focus / visibility (covers route transitions where DOM may
    // have been mutated by stale framework hydration).
    window.addEventListener("focus", handler);
    document.addEventListener("visibilitychange", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener("focus", handler);
      document.removeEventListener("visibilitychange", handler);
    };
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try { localStorage.setItem(STORAGE_KEY, t); } catch {}
    applyTheme(t);
    try { window.dispatchEvent(new Event(EVENT_NAME)); } catch {}
  }, []);

  const toggle = useCallback(() => {
    setTheme(readStored() === "dark" ? "black" : "dark");
  }, [setTheme]);

  return { theme, setTheme, toggle };
}
