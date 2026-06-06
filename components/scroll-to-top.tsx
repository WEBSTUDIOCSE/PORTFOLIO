"use client";

import React from "react";

export default function ScrollToTop({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={className}
    >
      {children}
    </button>
  );
}
