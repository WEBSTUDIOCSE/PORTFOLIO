import type { Metadata } from "next";
import ThemeToggle from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Style Guide — Saurabh Jadhav",
  description:
    "Living reference for the colours, fonts, and architecture of this portfolio.",
};

// Single source of truth for the documentation page. Each entry maps
// to a real token in app/globals.css — if a token moves or renames
// there, update the corresponding row here.

// ───────────────────────── proposed palettes ─────────────────────────
// Three palette options for review. Rendered via inline styles so the
// previews don't touch the global theme — what you see in the cards
// is what the site would feel like if we adopted that option.
//
// Body-text contrast ratios are computed via the WCAG 2.1 relative-
// luminance formula and pre-verified to clear AAA (≥7:1) for body and
// muted-foreground vs background in both modes.

type PaletteColors = {
  background: string;
  foreground: string;
  card: string;
  muted: string;
  mutedForeground: string;
  primary: string;
  primaryForeground: string;
  accent: string;
  border: string;
};

type PaletteOption = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  light: PaletteColors;
  dark: PaletteColors;
  contrast: { light: string; dark: string };
};

const PALETTE_OPTIONS: PaletteOption[] = [
  {
    id: "stone-atelier",
    name: "Stone Atelier",
    tagline: "Cream · greige · charcoal · terracotta",
    description:
      "The 2026 'nature distilled' direction. Editorial gallery feel — calm, mature, universal. Loses the Indian Railways thread but gains broadest age-comfort.",
    light: {
      background: "#f5efe6",
      foreground: "#1a1410",
      card: "#fbf6ec",
      muted: "#ebe3d4",
      mutedForeground: "#50473e",
      primary: "#a04830",
      primaryForeground: "#f5efe6",
      accent: "#a67d3a",
      border: "rgba(26,20,16,0.12)",
    },
    dark: {
      background: "#181513",
      foreground: "#f4ecdf",
      card: "#221d1a",
      muted: "#2a2522",
      mutedForeground: "#b0a69e",
      primary: "#d27a5a",
      primaryForeground: "#181513",
      accent: "#d4a874",
      border: "rgba(244,236,223,0.12)",
    },
    contrast: { light: "16:1 AAA · muted 7.7:1 AAA", dark: "13:1 AAA · muted 7.6:1 AAA" },
  },
  {
    id: "konkan-modernized",
    name: "Konkan Modernized",
    tagline: "Cream · bone · softened wine",
    description:
      "Retains the Indian Railways DNA but softens the maroon to a warm wine. Keeps brand continuity with /journey while modernising. Best of both worlds.",
    light: {
      background: "#f3ece0",
      foreground: "#231611",
      card: "#faf3e6",
      muted: "#e8dfcd",
      mutedForeground: "#4f3d33",
      primary: "#823943",
      primaryForeground: "#f3ece0",
      accent: "#b08648",
      border: "rgba(35,22,17,0.12)",
    },
    dark: {
      background: "#1a1310",
      foreground: "#f1e9dc",
      card: "#241b16",
      muted: "#2c221c",
      mutedForeground: "#b3a89a",
      primary: "#c47787",
      primaryForeground: "#1a1310",
      accent: "#d8aa6e",
      border: "rgba(241,233,220,0.12)",
    },
    contrast: { light: "14:1 AAA · muted 7.5:1 AAA", dark: "13:1 AAA · muted 7.4:1 AAA" },
  },
  {
    id: "studio-forest",
    name: "Studio Forest",
    tagline: "Cream · bone · deep forest green",
    description:
      "Most distinctive of the three. Forest green primary is rare for portfolios — calm, sophisticated, ages well. Pairs unexpectedly well with warm cream.",
    light: {
      background: "#f5efe5",
      foreground: "#1c1814",
      card: "#fbf6eb",
      muted: "#e9e2d2",
      mutedForeground: "#4f4a40",
      primary: "#2d4a3e",
      primaryForeground: "#f5efe5",
      accent: "#a67d3a",
      border: "rgba(28,24,20,0.12)",
    },
    dark: {
      background: "#171614",
      foreground: "#f3ede0",
      card: "#222019",
      muted: "#292621",
      mutedForeground: "#b1aa9f",
      primary: "#7fb398",
      primaryForeground: "#171614",
      accent: "#d4a874",
      border: "rgba(243,237,224,0.12)",
    },
    contrast: { light: "15:1 AAA · muted 7.8:1 AAA", dark: "13:1 AAA · muted 7.5:1 AAA" },
  },
];

type SemanticToken = {
  name: string;
  oklch: { light: string; dark: string };
  hexHint?: string;
  swatchClass: string;
  fgClass?: string;
  use: string;
};

const SEMANTIC_TOKENS: SemanticToken[] = [
  {
    name: "background",
    oklch: { light: "0.929 0.018 80", dark: "0.080 0.008 50" },
    hexHint: "cream / ink-deep",
    swatchClass: "bg-background",
    fgClass: "text-foreground",
    use: "Page background. Body default surface.",
  },
  {
    name: "foreground",
    oklch: { light: "0.220 0.025 35", dark: "0.929 0.018 80" },
    hexHint: "ink / cream",
    swatchClass: "bg-foreground",
    fgClass: "text-background",
    use: "Body text. Default content colour.",
  },
  {
    name: "card",
    oklch: { light: "0.948 0.022 86", dark: "0.220 0.025 35" },
    hexHint: "paper / ink",
    swatchClass: "bg-card",
    fgClass: "text-card-foreground",
    use: "Elevated surfaces — cards, panels.",
  },
  {
    name: "popover",
    oklch: { light: "0.948 0.022 86", dark: "0.220 0.025 35" },
    hexHint: "paper / ink",
    swatchClass: "bg-popover",
    fgClass: "text-popover-foreground",
    use: "Floating overlays — dropdowns, tooltips.",
  },
  {
    name: "primary",
    oklch: { light: "0.380 0.120 18", dark: "0.660 0.100 75" },
    hexHint: "rail-maroon / brass",
    swatchClass: "bg-primary",
    fgClass: "text-primary-foreground",
    use: "Brand identity. CTAs, primary actions, highlights.",
  },
  {
    name: "secondary",
    oklch: { light: "0.860 0.045 88", dark: "0.300 0.025 40" },
    hexHint: "cream-dk / muted-ink",
    swatchClass: "bg-secondary",
    fgClass: "text-secondary-foreground",
    use: "Lower-emphasis surfaces, chips.",
  },
  {
    name: "muted",
    oklch: { light: "0.890 0.030 84", dark: "0.260 0.020 40" },
    hexHint: "warm-grey",
    swatchClass: "bg-muted",
    fgClass: "text-muted-foreground",
    use: "Subtle disabled / placeholder backgrounds.",
  },
  {
    name: "accent",
    oklch: { light: "0.660 0.100 75", dark: "0.380 0.120 18" },
    hexHint: "brass / rail-maroon",
    swatchClass: "bg-accent",
    fgClass: "text-accent-foreground",
    use: "Secondary highlight. Hover surfaces, badges.",
  },
  {
    name: "destructive",
    oklch: { light: "0.550 0.200 27", dark: "0.620 0.220 27" },
    hexHint: "warm red",
    swatchClass: "bg-destructive",
    fgClass: "text-destructive-foreground",
    use: "Error states, destructive confirmations.",
  },
  {
    name: "border",
    oklch: {
      light: "0.220 0.025 35 / 0.15",
      dark: "0.929 0.018 80 / 0.12",
    },
    hexHint: "ink @15% / cream @12%",
    swatchClass: "bg-border",
    fgClass: "text-foreground",
    use: "Separators, dividers, card borders.",
  },
  {
    name: "input",
    oklch: {
      light: "0.220 0.025 35 / 0.15",
      dark: "0.929 0.018 80 / 0.12",
    },
    hexHint: "same as border",
    swatchClass: "bg-input",
    fgClass: "text-foreground",
    use: "Form control borders.",
  },
  {
    name: "ring",
    oklch: {
      light: "0.380 0.120 18 / 0.5",
      dark: "0.660 0.100 75 / 0.5",
    },
    hexHint: "primary @50%",
    swatchClass: "bg-ring",
    fgClass: "text-primary-foreground",
    use: "Focus outlines.",
  },
];

const BRAND_PALETTE: { var: string; hex: string; note: string }[] = [
  { var: "--rail-maroon", hex: "#7a1f2b", note: "Brand identity. Indian Railways enamel." },
  { var: "--rail-maroon-dk", hex: "#4f1219", note: "Darker maroon — borders, depth." },
  { var: "--cream", hex: "#efe8d8", note: "Canonical cream. Light mode bg." },
  { var: "--cream-dk", hex: "#e2d4ad", note: "Cream shifted toward khaki." },
  { var: "--paper", hex: "#f7efd9", note: "Slightly warmer cream — elevated surfaces." },
  { var: "--ink", hex: "#2a1a14", note: "Deep warm brown — primary text." },
  { var: "--ink-soft", hex: "#5a4435", note: "Softer ink — secondary text." },
  { var: "--ink-deep", hex: "#0d0805", note: "Near-black with warm tint. Dark mode bg." },
  { var: "--brass", hex: "#b88c3f", note: "Brass accent — fittings, brass plate." },
  { var: "--brass-dk", hex: "#8a6526", note: "Aged brass — darker variant." },
  { var: "--teak", hex: "#6b3f2a", note: "Teak wood — sleepers, warm accent." },
];

type FontEntry = {
  family: string;
  cssVar: string;
  twClass: string;
  role: string;
  sample: string;
  // Tailwind class to render the sample in this font.
  sampleClass: string;
};

const FONTS: FontEntry[] = [
  {
    family: "Geist Sans",
    cssVar: "--font-sans / --font-geist-sans",
    twClass: "font-sans",
    role: "Body workhorse. Default everywhere.",
    sample: "The quick brown fox jumps over the lazy dog.",
    sampleClass: "font-sans text-xl",
  },
  {
    family: "Fraunces",
    cssVar: "--font-display",
    twClass: "font-display",
    role: "Serif display. Section headlines, formal moments.",
    sample: "Frontend Developer",
    sampleClass: "font-display text-4xl font-light tracking-tight",
  },
  {
    family: "Tiro Devanagari Marathi",
    cssVar: "--font-deva",
    twClass: "font-deva",
    role: "Bilingual Devanagari script.",
    sample: "नमस्कार · सौरभ जाधव · मराठी",
    sampleClass: "font-deva text-2xl",
  },
  {
    family: "Geist Mono",
    cssVar: "--font-mono / --font-geist-mono",
    twClass: "font-mono",
    role: "Tabular figures, code, KM / PF# readouts.",
    sample: "const km = 942; PF 04",
    sampleClass: "font-mono text-base",
  },
  {
    family: "Caveat",
    cssVar: "--font-hand",
    twClass: "font-hand",
    role: "Warm prose hand. Eyebrows, captions, friendly callouts. ≤ 3 slots/page.",
    sample: "Hello, this is the handwritten voice.",
    sampleClass: "font-hand text-3xl",
  },
  {
    family: "Permanent Marker",
    cssVar: "--font-hand-stamp",
    twClass: "font-hand-stamp",
    role: "Bold stamp. ONE-WORD badges only — NEW, OPEN. ≤ 2 slots/page.",
    sample: "NEW · OPEN · 01",
    sampleClass: "font-hand-stamp text-2xl",
  },
  {
    family: "Architects Daughter",
    cssVar: "--font-hand-note",
    twClass: "font-hand-note",
    role: "Sketchbook annotation. Sidenotes, arrows. ≤ 2 slots/page.",
    sample: "// quick sketch note — this one →",
    sampleClass: "font-hand-note text-xl",
  },
  {
    family: "Dancing Script",
    cssVar: "--font-greet",
    twClass: "font-greet",
    role: "Greeting cursive. The Apple-hello flowing-script moment. ≤ 1 slot/page (eyebrow welcome). Visible only at large sizes — avoid < 18px.",
    sample: "Hola · Hello · नमस्कार",
    sampleClass: "font-greet text-4xl",
  },
];

const COMPONENTS_IN_USE = [
  {
    name: "ThemeProvider",
    path: "lib/theme.tsx",
    note: "Wraps next-themes. attribute='class', defaultTheme='system', disableTransitionOnChange.",
  },
  {
    name: "ThemeToggle",
    path: "components/theme-toggle.tsx",
    note: "Pill toggle with Light / Dark segments. Uses resolvedTheme, mounted-state guard.",
  },
  {
    name: "CharacterScroll",
    path: "components/sections/character-scroll.tsx",
    note: "Landing hero. 119 PNG frames, 400vh scroll runway, 5 content beats.",
  },
  {
    name: "JourneyClient (3D diorama)",
    path: "app/journey/JourneyClient.jsx",
    note: "Konkan Railway diorama at /journey. WAP-7 locomotive, 5 scroll stations.",
  },
  {
    name: "SelectedWork",
    path: "components/sections/selected-work.tsx",
    note: "Homepage projects reel. Reads from lib/projects.ts. One featured card + grid.",
  },
  {
    name: "About",
    path: "components/sections/about.tsx",
    note: "Bio section. Portrait, three-paragraph bio, meta row (location/timezone/availability).",
  },
  {
    name: "Experience",
    path: "components/sections/experience.tsx",
    note: "Work history (Livlong, Hapinee) + Education + Certifications. Vertical timeline, most recent first. Logo cell with monogram fallback.",
  },
  {
    name: "Press",
    path: "components/sections/press.tsx",
    note: "On LinkedIn — text-only links to launch posts with impression metrics. No iframes (perf). Full embeds wait for /work/[slug].",
  },
  {
    name: "Currently",
    path: "components/sections/currently.tsx",
    note: "Soft signals — building / listening / reading. Manual fortnightly refresh.",
  },
  {
    name: "Contact",
    path: "components/sections/contact.tsx",
    note: "Final beat. Hola greeting + four channels (Email primary, GitHub/LinkedIn/Resume secondary).",
  },
  {
    name: "PROJECTS data",
    path: "lib/projects.ts",
    note: "Single source of truth for project metadata. Used by SelectedWork now; future /work/[slug].",
  },
];

const TECH_STACK = [
  { label: "Framework", value: "Next.js 16.2 (App Router, Turbopack)" },
  { label: "UI", value: "React 19" },
  { label: "Styles", value: "Tailwind CSS v4 + CSS custom properties" },
  { label: "Theming", value: "next-themes (shadcn pattern)" },
  { label: "Fonts", value: "next/font/google (7 families, self-hosted)" },
  { label: "3D", value: "three.js 0.184 + @react-three/fiber 9.6 + drei 10.7" },
  { label: "Language", value: "TypeScript (strict)" },
  { label: "Deployment", value: "Vercel — saurabhjadhav.in" },
];

const ROUTES = [
  { path: "/", role: "Landing — hero → work → about → experience → press → currently → contact" },
  { path: "/#work", role: "Selected work anchor (within /)" },
  { path: "/#about", role: "About anchor (within /)" },
  { path: "/#experience", role: "Experience anchor (within /)" },
  { path: "/#press", role: "Press / LinkedIn posts anchor (within /)" },
  { path: "/#contact", role: "Contact anchor (within /)" },
  { path: "/journey", role: "3D diorama — Saurabh Express story" },
  { path: "/style-guide", role: "This page — design system reference" },
];

export default function StyleGuidePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Reference
            </p>
            <h1 className="font-display text-2xl font-light tracking-tight">
              Style Guide
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Intro */}
        <section className="mb-16 max-w-2xl">
          <p className="font-hand text-2xl text-primary">A living reference.</p>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Every colour, font and component used across this site, with the
            names you can point at when you want something changed. Toggle
            light / dark above — swatches update live.
          </p>
        </section>

        {/* ─────────────── DECIDE: proposed palettes ─────────────── */}
        <section className="mb-24">
          <div className="mb-6 rounded-lg border border-primary/40 bg-primary/5 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
              Decide
            </p>
            <h2 className="mt-1 font-display text-3xl font-light tracking-tight">
              Three proposed palettes
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Research-backed options — all clear WCAG AAA (≥ 7:1) for body
              text in both modes, so any age group reads them comfortably.
              Previews use inline styles so the rest of the page (and the
              site) stay on the current palette. Pick a vibe, then I&apos;ll
              wire it into <code className="font-mono text-xs">globals.css</code>.
            </p>
          </div>

          <div className="space-y-6">
            {PALETTE_OPTIONS.map((opt, i) => (
              <PalettePreview key={opt.id} option={opt} index={i + 1} />
            ))}
          </div>
        </section>

        {/* ─────────────── Current state — for comparison ─────────────── */}
        <div className="mb-12 border-t border-border pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            For comparison
          </p>
          <h2 className="mt-1 font-display text-2xl font-light tracking-tight text-muted-foreground">
            What we&rsquo;re running today
          </h2>
        </div>

        {/* ─────────────── Semantic tokens ─────────────── */}
        <SectionHeading
          kicker="Colour"
          title="Semantic tokens"
          note="Used everywhere via Tailwind utilities — bg-primary, text-foreground, border-border, etc. Defined in app/globals.css."
        />
        <div className="mb-20 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SEMANTIC_TOKENS.map((t) => (
            <TokenCard key={t.name} token={t} />
          ))}
        </div>

        {/* ─────────────── Brand palette ─────────────── */}
        <SectionHeading
          kicker="Palette"
          title="Brand colours"
          note="The raw Konkan-railway palette. Theme-independent — referenced directly inside /journey CSS via var(--rail-maroon), var(--cream), etc."
        />
        <div className="mb-20 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {BRAND_PALETTE.map((c) => (
            <BrandSwatch key={c.var} {...c} />
          ))}
        </div>

        {/* ─────────────── Fonts ─────────────── */}
        <SectionHeading
          kicker="Type"
          title="Font system"
          note="Seven families, each with a strict role. Mixing handwritten fonts only works when each holds one narrow purpose — see the matrix in globals.css."
        />
        <div className="mb-20 space-y-4">
          {FONTS.map((f) => (
            <FontCard key={f.family} font={f} />
          ))}
        </div>

        {/* ─────────────── Type scale ─────────────── */}
        <SectionHeading
          kicker="Scale"
          title="Typography"
          note="Recurring text sizes across the site."
        />
        <div className="mb-20 space-y-6 rounded-lg border border-border bg-card p-6 text-card-foreground">
          <TypeRow label="Display 7xl · Fraunces" cls="font-display text-7xl font-light tracking-tight">
            I&apos;m Saurabh.
          </TypeRow>
          <TypeRow label="Display 5xl · Fraunces" cls="font-display text-5xl font-light tracking-tight">
            Frontend Developer
          </TypeRow>
          <TypeRow label="Display 3xl · Fraunces" cls="font-display text-3xl font-light tracking-tight">
            Section heading
          </TypeRow>
          <TypeRow label="Hand 3xl · Caveat" cls="font-hand text-3xl text-primary">
            A handwritten moment
          </TypeRow>
          <TypeRow label="Body lg · Geist Sans" cls="text-lg">
            Body lead — the workhorse paragraph size for readable prose.
          </TypeRow>
          <TypeRow label="Body base · Geist Sans" cls="text-base text-muted-foreground">
            Body default — for muted secondary text and supporting copy.
          </TypeRow>
          <TypeRow label="Mono caps eyebrow" cls="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            CATEGORY · KM 942 · PF 04
          </TypeRow>
        </div>

        {/* ─────────────── Components ─────────────── */}
        <SectionHeading
          kicker="Code"
          title="Components in use"
          note="Where the actual implementation lives."
        />
        <div className="mb-20 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.2em]">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.2em]">
                  Path
                </th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.2em]">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPONENTS_IN_USE.map((c, i) => (
                <tr
                  key={c.name}
                  className={i < COMPONENTS_IN_USE.length - 1 ? "border-b border-border" : ""}
                >
                  <td className="px-4 py-3 font-display text-base">{c.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {c.path}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {c.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ─────────────── Architecture ─────────────── */}
        <SectionHeading
          kicker="Stack"
          title="Architecture"
          note="The technology this site is built on."
        />
        <div className="mb-20 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          {TECH_STACK.map((t) => (
            <div
              key={t.label}
              className="flex items-baseline justify-between gap-4 border-b border-border py-2"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {t.label}
              </span>
              <span className="text-right text-sm">{t.value}</span>
            </div>
          ))}
        </div>

        {/* ─────────────── Routes ─────────────── */}
        <SectionHeading
          kicker="Map"
          title="Routes"
          note="The pages on this site."
        />
        <div className="mb-20 space-y-2">
          {ROUTES.map((r) => (
            <div
              key={r.path}
              className="flex items-baseline justify-between gap-4 rounded border border-border bg-card px-4 py-3 text-card-foreground"
            >
              <code className="font-mono text-sm text-primary">{r.path}</code>
              <span className="text-sm text-muted-foreground">{r.role}</span>
            </div>
          ))}
        </div>

        {/* ─────────────── How to change ─────────────── */}
        <SectionHeading
          kicker="Notes"
          title="How to request changes"
          note="Point at a name from this page when you want something tweaked."
        />
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-6">
          <p className="font-hand text-2xl text-primary">Examples:</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foreground">
            <li>
              <span className="font-mono text-xs text-muted-foreground">
                colour →
              </span>{" "}
              &quot;Make <strong>primary</strong> a deeper maroon in light
              mode.&quot; → edit <code className="font-mono text-xs">--primary</code>{" "}
              under <code className="font-mono text-xs">:root</code> in{" "}
              <code className="font-mono text-xs">app/globals.css</code>.
            </li>
            <li>
              <span className="font-mono text-xs text-muted-foreground">
                font →
              </span>{" "}
              &quot;Swap <strong>Caveat</strong> for Patrick Hand.&quot; → change
              the import in{" "}
              <code className="font-mono text-xs">app/layout.tsx</code>; CSS
              variable name stays{" "}
              <code className="font-mono text-xs">--font-hand</code> so no other
              file needs to change.
            </li>
            <li>
              <span className="font-mono text-xs text-muted-foreground">
                role →
              </span>{" "}
              &quot;Add a new <strong>Selected Work</strong> section.&quot; → new
              file under{" "}
              <code className="font-mono text-xs">components/sections/</code>,
              wired into{" "}
              <code className="font-mono text-xs">app/page.tsx</code>.
            </li>
          </ul>
        </div>

        {/* Footer */}
        <footer className="mt-24 border-t border-border pt-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Reference · Living document · Updated alongside the codebase
          </p>
        </footer>
      </div>
    </main>
  );
}

// ───────────────────────── pieces ─────────────────────────

function PalettePreview({
  option,
  index,
}: {
  option: PaletteOption;
  index: number;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card text-card-foreground">
      <div className="border-b border-border p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Option {String(index).padStart(2, "0")} · {option.id}
        </p>
        <h3 className="mt-1 font-display text-2xl font-light tracking-tight">
          {option.name}
        </h3>
        <p className="mt-1 font-hand text-xl text-primary">{option.tagline}</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {option.description}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <PalettePanel
          mode="Light"
          colors={option.light}
          contrast={option.contrast.light}
        />
        <PalettePanel
          mode="Dark"
          colors={option.dark}
          contrast={option.contrast.dark}
          borderLeft
        />
      </div>
    </div>
  );
}

function PalettePanel({
  mode,
  colors,
  contrast,
  borderLeft,
}: {
  mode: "Light" | "Dark";
  colors: PaletteColors;
  contrast: string;
  borderLeft?: boolean;
}) {
  // Inline styles only — this panel must NOT inherit from the global
  // theme so the user sees a true preview of the proposed palette.
  const wrapperStyle: React.CSSProperties = {
    backgroundColor: colors.background,
    color: colors.foreground,
    borderLeft: borderLeft
      ? `1px solid var(--border)`
      : undefined,
  };

  return (
    <div style={wrapperStyle} className="p-6 sm:p-8">
      {/* Mode tag + contrast */}
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <span
          style={{
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.2em",
            color: colors.mutedForeground,
          }}
          className="text-[10px] uppercase"
        >
          {mode}
        </span>
        <span
          style={{ color: colors.mutedForeground, fontFamily: "var(--font-mono)" }}
          className="text-[10px] tabular-nums"
        >
          {contrast}
        </span>
      </div>

      {/* Hand eyebrow */}
      <p
        style={{
          color: colors.primary,
          fontFamily: "var(--font-hand)",
        }}
        className="mb-3 flex items-baseline gap-2 text-2xl"
      >
        <span style={{ fontFamily: "var(--font-deva)" }} className="text-base">
          नमस्कार
        </span>
        <span style={{ color: colors.mutedForeground }}>·</span>
        <span>Hello</span>
      </p>

      {/* Display headline */}
      <h4
        style={{
          fontFamily: "var(--font-display)",
          color: colors.foreground,
        }}
        className="text-3xl font-light leading-tight tracking-tight"
      >
        Frontend Developer
      </h4>
      <p
        style={{ color: colors.mutedForeground }}
        className="mb-5 mt-1 text-sm"
      >
        Based in Maharashtra
      </p>

      {/* Body copy — readability test */}
      <p
        style={{ color: colors.foreground }}
        className="mb-5 max-w-md text-sm leading-relaxed"
      >
        Body text in the foreground colour. The whole page should read
        like this without any squinting — clear at 60+, comfortable on
        every screen.
      </p>
      <p
        style={{ color: colors.mutedForeground }}
        className="mb-6 max-w-md text-sm leading-relaxed"
      >
        Muted secondary text — captions, meta, supporting copy. Lower
        contrast than the foreground but still hits AAA.
      </p>

      {/* Card sample */}
      <div
        style={{
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`,
        }}
        className="mb-5 rounded-lg p-4"
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            color: colors.mutedForeground,
            letterSpacing: "0.18em",
          }}
          className="mb-1 text-[10px] uppercase"
        >
          Card · P-001
        </p>
        <p style={{ color: colors.foreground }} className="text-sm">
          Elevated surface — used for project cards, panels, popovers.
        </p>
      </div>

      {/* Button + chip row */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          style={{
            backgroundColor: colors.primary,
            color: colors.primaryForeground,
            border: `1px solid ${colors.primary}`,
          }}
          className="rounded-full px-5 py-2 text-sm font-medium"
        >
          Take the Journey →
        </button>
        <span
          style={{
            backgroundColor: colors.muted,
            color: colors.mutedForeground,
            border: `1px solid ${colors.border}`,
          }}
          className="rounded-full px-3 py-1 text-xs"
        >
          React
        </span>
        <span
          style={{
            backgroundColor: colors.accent,
            color: colors.background,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.2em",
          }}
          className="rounded px-2 py-1 text-[10px] font-semibold uppercase"
        >
          New
        </span>
      </div>

      {/* Swatch row */}
      <div
        className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t pt-4"
        style={{ borderColor: colors.border }}
      >
        {(
          [
            ["bg", colors.background],
            ["fg", colors.foreground],
            ["card", colors.card],
            ["muted", colors.muted],
            ["primary", colors.primary],
            ["accent", colors.accent],
          ] as const
        ).map(([label, val]) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              style={{
                backgroundColor: val,
                border: `1px solid ${colors.border}`,
              }}
              className="block h-3.5 w-3.5 rounded-sm"
            />
            <span
              style={{
                color: colors.mutedForeground,
                fontFamily: "var(--font-mono)",
              }}
              className="text-[10px] tabular-nums"
            >
              {label} {val.toLowerCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeading({
  kicker,
  title,
  note,
}: {
  kicker: string;
  title: string;
  note?: string;
}) {
  return (
    <div className="mb-6 max-w-2xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
        {kicker}
      </p>
      <h2 className="mt-1 font-display text-3xl font-light tracking-tight">
        {title}
      </h2>
      {note && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}

function TokenCard({ token }: { token: SemanticToken }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card text-card-foreground">
      <div
        className={`flex h-20 items-center justify-center ${token.swatchClass} ${
          token.fgClass ?? "text-foreground"
        }`}
      >
        <span className="font-display text-3xl">Aa</span>
      </div>
      <div className="space-y-1 p-3">
        <div className="flex items-baseline justify-between gap-2">
          <code className="font-mono text-sm text-primary">{token.name}</code>
          {token.hexHint && (
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              {token.hexHint}
            </span>
          )}
        </div>
        <p className="font-mono text-[10px] text-muted-foreground">
          <span className="opacity-50">L</span> oklch({token.oklch.light})
        </p>
        <p className="font-mono text-[10px] text-muted-foreground">
          <span className="opacity-50">D</span> oklch({token.oklch.dark})
        </p>
        <p className="text-xs leading-snug text-muted-foreground">{token.use}</p>
      </div>
    </div>
  );
}

function BrandSwatch({
  var: cssVar,
  hex,
  note,
}: {
  var: string;
  hex: string;
  note: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card text-card-foreground">
      <div
        className="h-16 w-full"
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <div className="space-y-1 p-3">
        <code className="font-mono text-xs text-primary">{cssVar}</code>
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          {hex}
        </p>
        <p className="text-[11px] leading-snug text-muted-foreground">{note}</p>
      </div>
    </div>
  );
}

function FontCard({ font }: { font: FontEntry }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 text-card-foreground">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="font-display text-lg">{font.family}</p>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            <code className="text-primary">{font.twClass}</code>{" "}
            <span className="opacity-50">·</span> {font.cssVar}
          </p>
        </div>
        <p className="max-w-md text-right text-xs leading-relaxed text-muted-foreground">
          {font.role}
        </p>
      </div>
      <p className={`${font.sampleClass} leading-tight`}>{font.sample}</p>
    </div>
  );
}

function TypeRow({
  label,
  cls,
  children,
}: {
  label: string;
  cls: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-border pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-6">
      <p className="w-48 shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className={cls}>{children}</p>
    </div>
  );
}
