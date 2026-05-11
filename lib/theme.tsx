"use client";

// Custom ThemeProvider — replaces `next-themes` to avoid the
// React 19 "script inside Client Component" warning that next-themes
// triggers (its no-flash script is rendered inside its own client
// ThemeProvider). The no-flash script for us lives in
// app/layout.tsx <head> instead — a Server Component context where
// React 19 does not warn.
//
// API surface kept identical to the previous next-themes wrapper:
//   { theme, resolvedTheme, setTheme }
// so consumers (theme-toggle.tsx, character-scroll.tsx) need no
// changes when we swap implementations.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  /** Current theme preference — "system", "light", or "dark". */
  theme: Theme;
  /** Effective theme after resolving "system" — only "light" or "dark". */
  resolvedTheme: ResolvedTheme;
  setTheme: (t: Theme) => void;
};

const ThemeCtx = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "sj-theme";
const DARK_CLASS = "dark";

function readSystem(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readStored(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    // localStorage can throw in strict privacy modes.
  }
  return "system";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Server renders with "system" placeholder — the actual theme is
  // already on <html> from the no-flash script, so the user never
  // sees a flash. The first effect syncs React state with reality.
  const [theme, setThemeState] = useState<Theme>("system");
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>("light");

  // One-time bootstrap on mount.
  useEffect(() => {
    setThemeState(readStored());
    setSystemTheme(readSystem());

    // System preference can change while the page is open.
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };
    mql.addEventListener("change", onSystemChange);

    // Cross-tab sync — toggling in tab A reflects in tab B.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const v = e.newValue;
      if (v === "light" || v === "dark" || v === "system") {
        setThemeState(v);
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      mql.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? systemTheme : theme;

  // Apply / strip the .dark class on <html>. This is what flips the
  // CSS tokens defined under `.dark { ... }` in globals.css.
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add(DARK_CLASS);
    } else {
      root.classList.remove(DARK_CLASS);
    }
  }, [resolvedTheme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try {
      window.localStorage.setItem(STORAGE_KEY, t);
    } catch {
      // Persistence is best-effort.
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeCtx);
  if (!ctx) {
    throw new Error("useTheme must be used within <ThemeProvider>");
  }
  return ctx;
}
