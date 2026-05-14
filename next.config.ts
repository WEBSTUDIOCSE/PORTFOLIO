import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization config.
  // - `formats` order = preferred → fallback. AVIF is ~30% smaller
  //   than WebP at the same quality; serving it first cuts mobile
  //   payload meaningfully for any <Image> on the site.
  // - The default deviceSizes / imageSizes work for our breakpoints.
  // Docs: https://nextjs.org/docs/app/api-reference/components/image
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Tree-shake heavy library barrel imports. Next.js generates
  // optimized per-export sub-imports for these packages at build
  // time, so e.g. `import { getFirestore } from "firebase/firestore"`
  // doesn't pull in every Firestore feature.
  //
  // - `firebase`: avoids dragging Auth / Storage / Messaging into
  //   the analytics + db chunks.
  // - `@react-three/drei`: drei's barrel is famously fat; this
  //   makes <Loader> / <useGLTF> ship without the other 60 helpers.
  // - `mermaid`: dynamic-imported on /work/[slug] only, but this
  //   trims its own internal deps.
  //
  // Docs: https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports
  experimental: {
    optimizePackageImports: ["firebase", "@react-three/drei", "mermaid"],
  },

  async headers() {
    return [
      {
        source: "/models/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate",
          },
        ],
      },
      // Long-cache the hero canvas frame sequence. These 119 WebP
      // files are content-hashed in their filenames? — they're not
      // (ezgif-frame-NNN.webp), so we use a moderate max-age with
      // must-revalidate. Once cached by the browser, subsequent
      // home-page visits skip the network entirely.
      {
        source: "/assets/saurabh/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
