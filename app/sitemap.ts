import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/projects";
import { PUBLISHED_POSTS } from "@/lib/writing";

// Sitemap convention per Next.js docs:
//   node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md
//
// Lives at /sitemap.xml at runtime. Listed in robots.ts so Google /
// Bing find it on first crawl.

const BASE = "https://saurabhjadhav.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static routes. /style-guide is intentionally NOT here — it's
  // internal documentation, not for search. Robots disallows it too.
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE}/journey`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/writing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // /work/[slug] — one entry per featured project.
  const workRoutes: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: `${BASE}/work/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // /writing/[slug] — one entry per published post. lastModified
  // uses the post's date so search engines see "this is when the
  // content actually changed."
  const writingRoutes: MetadataRoute.Sitemap = PUBLISHED_POSTS.map((p) => ({
    url: `${BASE}/writing/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...workRoutes, ...writingRoutes];
}
