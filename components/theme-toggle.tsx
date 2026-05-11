"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme";

export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes can't know the resolved theme until after hydration,
  // so we delay rendering active state to avoid SSR/CSR mismatch.
  // Standard next-themes idiom — see docs.
  useEffect(() => setMounted(true), []);

  const active = mounted ? resolvedTheme : undefined;

  return (
    <div
      className={`inline-flex rounded-full border border-border bg-card/60 p-1 backdrop-blur-md ${className}`}
      role="group"
      aria-label="Color mode"
    >
      <button
        type="button"
        aria-pressed={active === "light"}
        onClick={() => setTheme("light")}
        className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] transition-colors ${
          active === "light"
            ? "bg-foreground/10 text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Light
      </button>
      <button
        type="button"
        aria-pressed={active === "dark"}
        onClick={() => setTheme("dark")}
        className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] transition-colors ${
          active === "dark"
            ? "bg-foreground/10 text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Dark
      </button>
    </div>
  );
}
