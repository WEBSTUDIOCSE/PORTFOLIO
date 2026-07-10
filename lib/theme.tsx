"use client";

// Dark-only theme. The site committed to a single dark look — the
// light palette and the toggle were removed. This file keeps the old
// { theme, resolvedTheme, setTheme } API so consumers
// (mermaid-diagram.tsx, character-scroll.tsx) need no changes, but
// everything resolves to "dark" permanently:
//   - <html> ships with class="dark" from the server (app/layout.tsx),
//     so there is no flash and no no-flash script.
//   - globals.css defines the dark tokens on :root directly.
//   - setTheme is a no-op.

import React, { createContext, useContext } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  /** Always "dark" — kept for API compatibility. */
  theme: Theme;
  /** Always "dark" — kept for API compatibility. */
  resolvedTheme: ResolvedTheme;
  /** No-op — the site is dark-only. */
  setTheme: (t: Theme) => void;
};

const DARK_ONLY: ThemeContextValue = {
  theme: "dark",
  resolvedTheme: "dark",
  setTheme: () => {},
};

const ThemeCtx = createContext<ThemeContextValue>(DARK_ONLY);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeCtx.Provider value={DARK_ONLY}>{children}</ThemeCtx.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeCtx);
}
