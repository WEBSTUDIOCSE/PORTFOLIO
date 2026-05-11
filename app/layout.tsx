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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
