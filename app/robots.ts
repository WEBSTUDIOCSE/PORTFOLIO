import type { MetadataRoute } from "next";

// robots.txt convention per Next.js docs:
//   node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md
//
// Lives at /robots.txt at runtime.

const BASE = "https://saurabhjadhav.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/style-guide", // internal design system docs
          "/api/", // server endpoints (form actions, OG image route)
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
