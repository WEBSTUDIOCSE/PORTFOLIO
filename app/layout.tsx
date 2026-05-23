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
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import SiteNav from "@/components/site-nav";
import { FirebaseAnalytics } from "@/lib/firebase/analytics";
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
  title: "Saurabh Jadhav — Frontend & AI Engineer",
  description:
    "I build systems that replace headcount. Multi-agent AI pipelines, autonomous content platforms, and production Next.js apps.",
  keywords: [
    "Saurabh Jadhav",
    "Frontend Developer",
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
    title: "Saurabh Jadhav — Frontend & AI Engineer",
    description:
      "I build systems that replace headcount. Multi-agent AI pipelines, autonomous content platforms, and production Next.js apps.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saurabh Jadhav — Frontend & AI Engineer",
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
      jobTitle: "Frontend & AI Engineer",
      url: SITE_URL,
      image: `${SITE_URL}/opengraph-image`,
      email: "mailto:saurabhjadhav.cse@gmail.com",
      description:
        "Frontend & AI Engineer based in Mumbai. Builds multi-agent AI pipelines, autonomous content platforms, and production Next.js apps.",
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
        "Frontend Engineering",
        "Web Performance",
      ],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: "Saurabh Jadhav",
      description:
        "Portfolio of Saurabh Jadhav — Frontend & AI Engineer based in Mumbai.",
      publisher: { "@id": PERSON_ID },
      inLanguage: "en-IN",
    },
  ],
};

// Runs on initial HTML parse, BEFORE React hydration, BEFORE first
// paint. Applies the stored / system theme to <html> so the user
// never sees a flash of the wrong theme on reload.
//
// Rendered via next/script with strategy="beforeInteractive" — per
// the Next.js docs, this routes through their injection pipeline
// (bypassing React 19's "script in component" warning) and is
// guaranteed to land in <head> of the initial HTML, regardless of
// where the component is placed.
//   docs: node_modules/next/dist/docs/01-app/03-api-reference/02-components/script.md
const NO_FLASH_THEME_SCRIPT = `
(function(){
  try {
    var t = localStorage.getItem('sj-theme');
    if (t !== 'light' && t !== 'dark') {
      t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${tiroDevanagari.variable} ${caveat.variable} ${permanentMarker.variable} ${architectsDaughter.variable} ${dancingScript.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script id="no-flash-theme" strategy="beforeInteractive">
          {NO_FLASH_THEME_SCRIPT}
        </Script>
        {/* Native <script> for JSON-LD per Next.js docs. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(ROOT_JSON_LD) }}
        />
        <ThemeProvider>
          <SiteNav />
          {children}
          <FirebaseAnalytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
