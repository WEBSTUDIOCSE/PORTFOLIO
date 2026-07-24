import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Fraunces,
  Tiro_Devanagari_Marathi,
  Caveat,
  Permanent_Marker,
  Architects_Daughter,
  Dancing_Script,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import SiteNav from "@/components/site-nav";
import { headers } from "next/headers";
import { FirebaseAnalytics } from "@/lib/firebase/analytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PERSON_ID, SITE_URL, WEBSITE_ID, jsonLd } from "@/lib/seo";

// Variable fonts — per Next.js docs, omit `weight` to load the full
// variable axis as a single woff2. Adding an array of static weights
// would force per-weight static instances instead.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  display: "swap",
});

// Greeting cursive — the Apple-hello flowing-script moment. ONE per
// page max (eyebrow welcome only). Variable weight, omit weight.
const dancingScript = Dancing_Script({
  variable: "--font-greet",
  subsets: ["latin"],
  display: "swap",
});

// Non-variable fonts — single weight string per docs.
const tiroDevanagari = Tiro_Devanagari_Marathi({
  variable: "--font-deva",
  subsets: ["devanagari", "latin"],
  weight: "400",
});

const permanentMarker = Permanent_Marker({
  variable: "--font-hand-stamp",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const architectsDaughter = Architects_Daughter({
  variable: "--font-hand-note",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// metadataBase resolves any relative URLs in this object (e.g. the
// og:image route returned by app/opengraph-image.tsx) to absolute
// URLs at build time. Set to the production origin so social
// previews work everywhere.
export const metadata: Metadata = {
  metadataBase: new URL("https://saurabhjadhav.in"),
  title: "Saurabh Jadhav — Full Stack & AI Engineer",
  description:
    "I build systems that replace headcount. Multi-agent AI pipelines, autonomous content platforms, and production Next.js apps.",
  keywords: [
    "Saurabh Jadhav",
    "Full Stack Developer",
    "AI Engineer",
    "Next.js",
    "React",
    "TypeScript",
    "Firebase",
    "Mumbai",
    "Maharashtra",
    "Portfolio",
  ],
  authors: [{ name: "Saurabh Jadhav", url: "https://saurabhjadhav.in" }],
  creator: "Saurabh Jadhav",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://saurabhjadhav.in",
    siteName: "Saurabh Jadhav",
    title: "Saurabh Jadhav — Full Stack & AI Engineer",
    description:
      "I build systems that replace headcount. Multi-agent AI pipelines, autonomous content platforms, and production Next.js apps.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saurabh Jadhav — Full Stack & AI Engineer",
    description:
      "I build systems that replace headcount. Multi-agent AI pipelines, autonomous content platforms, and production Next.js apps.",
    creator: "@saurabhjadhav",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://saurabhjadhav.in",
  },
  // Google Search Console site verification. The token is fetched
  // from GSC → Settings → Ownership verification → HTML tag, and
  // stored as an env var so it doesn't leak in PRs. Without GSC
  // verification we can't see indexing errors, query data, or
  // sitemap status.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

// JSON-LD graph — single @graph with Person + WebSite. Per
// Next.js docs (node_modules/next/dist/docs/01-app/02-guides/
// json-ld.md): "a native <script> tag is the right choice here" —
// NOT next/script. The browser doesn't execute JSON-LD as JS; it's
// structured data for crawlers.
//
// The @id values let project / blog pages reference the SAME Person
// node via `author: { "@id": PERSON_ID }` rather than duplicating
// fields. See lib/seo.ts. This gives Google's knowledge graph a
// clean entity model: one Saurabh authoring many projects + posts.
const ROOT_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Saurabh Jadhav",
      alternateName: "सौरभ जाधव",
      jobTitle: "Full Stack & AI Engineer",
      url: SITE_URL,
      image: `${SITE_URL}/opengraph-image`,
      email: "mailto:saurabhjadhav.cse@gmail.com",
      description:
        "Full Stack & AI Engineer based in Mumbai. Builds multi-agent AI pipelines, autonomous content platforms, and production Next.js apps.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mumbai",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
      sameAs: [
        "https://github.com/saurabhrjadhavcse",
        "https://www.linkedin.com/in/saurabhjadhav-cse",
        "https://x.com/saurabhjadhvcse",
        "https://www.youtube.com/@Saurabhjadhav.cse11",
        "https://www.instagram.com/saurabhjadhav.cse",
      ],
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Gharda Institute of Technology",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Ratnagiri",
          addressRegion: "Maharashtra",
          addressCountry: "IN",
        },
      },
      worksFor: {
        "@type": "Organization",
        name: "Livlong 365",
      },
      knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "Firebase",
        "Tailwind CSS",
        "shadcn/ui",
        "Multi-agent AI systems",
        "Generative AI",
        "Full Stack Development",
        "Web Performance",
      ],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: "Saurabh Jadhav",
      description:
        "Portfolio of Saurabh Jadhav — Full Stack & AI Engineer based in Mumbai.",
      publisher: { "@id": PERSON_ID },
      inLanguage: "en-IN",
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || "";

  return (
    <html
      lang="en"
      // Dark-only: the class ships from the server, so there is no
      // theme flash and no no-flash script. See lib/theme.tsx.
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${tiroDevanagari.variable} ${caveat.variable} ${permanentMarker.variable} ${architectsDaughter.variable} ${dancingScript.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Firebase Analytics (lib/firebase/analytics.tsx) defers
            loading Google's gtag.js until idle, so it never blocks
            first paint — but the connection itself (DNS + TLS) still
            costs ~100-200ms whenever it does fire. Preconnecting
            early means that cost is paid in parallel with everything
            else instead of at request time. */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        {/* Native <script> for JSON-LD per Next.js docs. */}
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: jsonLd(ROOT_JSON_LD) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <SiteNav />
          {children}
          <FirebaseAnalytics />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
