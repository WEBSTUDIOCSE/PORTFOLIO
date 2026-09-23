import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Saurabh Jadhav — Full Stack & AI Engineer",
    short_name: "Saurabh Jadhav",
    description:
      "Portfolio of Saurabh Jadhav: production Next.js applications, multi-agent AI systems, and AI-native products.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0805",
    theme_color: "#0d0805",
    lang: "en-IN",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
