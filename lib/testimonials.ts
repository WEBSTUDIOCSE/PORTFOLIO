// Testimonials — social proof / third-party validation. The single
// highest-credibility add for a portfolio (recruiters weight it
// heavily). Surfaced by <Testimonials /> on the homepage.
//
// ⚠️ SAMPLE CONTENT: the entries below are PLACEHOLDERS so the
// section can ship now. Replace each `quote` / `name` / `role` /
// `company` with real LinkedIn recommendations or client quotes as
// they come in. Add `href` to link the person's LinkedIn profile.
// Keep 3–6 entries — quality over quantity.

export type Testimonial = {
  /** The recommendation text. One or two sentences reads best. */
  quote: string;
  /** Person's full name. */
  name: string;
  /** Their role / title. */
  role: string;
  /** Their company or org. */
  company?: string;
  /** Optional link to their LinkedIn / profile. */
  href?: string;
  /** Surface on the homepage reel. Defaults true if omitted. */
  featured?: boolean;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Saurabh ships. He led our migration to Next.js 16 end-to-end and the LCP gains were immediate — the kind of engineer who owns the problem from design to deploy.",
    name: "Placeholder Name",
    role: "Engineering Manager",
    company: "Livlong 365",
    featured: true,
  },
  {
    quote:
      "Rare combination of design taste and AI depth. He turned a vague idea into a live, monetised product faster than I thought possible, and handled the hard edge cases without being asked.",
    name: "Placeholder Name",
    role: "Founder",
    company: "Startup",
    featured: true,
  },
  {
    quote:
      "Worked with Saurabh on a multi-agent build — he thinks in systems, not scripts. Clear communicator, zero hand-holding, and the architecture decisions held up under real load.",
    name: "Placeholder Name",
    role: "Senior Engineer",
    company: "Collaborator",
    featured: true,
  },
];

export const FEATURED_TESTIMONIALS = TESTIMONIALS.filter(
  (t) => t.featured !== false,
);
