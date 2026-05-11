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

export const metadata: Metadata = {
  title: "Saurabh Jadhav — Frontend & AI Engineer",
  description:
    "I build systems that replace headcount. Multi-agent AI pipelines, autonomous content platforms, and production Next.js apps.",
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
        <ThemeProvider>
          <SiteNav />
          {children}
          <FirebaseAnalytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
