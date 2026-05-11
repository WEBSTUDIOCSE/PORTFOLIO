"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// Thin wrapper around next-themes — see app/layout.tsx for the props
// passed in. next-themes handles the no-flash script, multi-tab sync,
// system-pref live changes, and SSR/hydration timing for us.
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// Re-export the hook so consumers import from one place (lib/theme).
// If we ever swap providers, only this file changes.
export { useTheme } from "next-themes";
