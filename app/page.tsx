import CharacterScroll from "@/components/sections/character-scroll";
import WhatWeBuild from "@/components/sections/what-we-build";
import SelectedWork from "@/components/sections/selected-work";
import About from "@/components/sections/about";
// Story section hidden for now — re-enable once the story video is ready.
// import Story from "@/components/sections/story";
import Experience from "@/components/sections/experience";
// Testimonials hidden for now — re-enable once real quotes are collected.
// import Testimonials from "@/components/sections/testimonials";
import Footer from "@/components/sections/footer";
import TCInvite from "@/components/tc-invite";
import ScrollFX from "@/components/scroll-fx";

// Section order is research-backed (see plan file):
//   hero → build → work → story → experience → about → footer
// WhatWeBuild is the DEVSTUDIOLABS-pattern color-block section (see its
// own file comments) inserted right after the hero. About moved to
// after Experience — "show the work and the history first, then the
// person" — Story is the long-form origin arc (8 beats + video).
// Press ("Posts that traveled.") and Currently ("What I'm reaching
// for.") were removed — components/sections/press.tsx and
// currently.tsx no longer exist; see lib/projects.ts's linkedinPosts
// field if Press-equivalent content is ever wanted again elsewhere.
// Contact ("Hola.") was also removed — the Footer already covers
// socials + email (EmailButton), so a dedicated Contact section was
// pure duplication. components/sections/contact.tsx no longer exists.
// Resume is a direct-download icon in the Footer's icon row now, not
// a gated form — components/forms/resume-form.tsx was removed too.
// Reads chronologically: who I am → what I build → what I've shipped →
// where I've worked → who I am → housekeeping + how to reach me.
//
// TCInvite is a fixed floating widget — the Indian Railways Ticket
// Checker character who slides in after the hero and routes to
// /journey on click. Lives at root of home only.
export default function Home() {
  return (
    <>
      <CharacterScroll />
      <WhatWeBuild />
      <SelectedWork />
      {/* <Story /> hidden for now — enable once the story video is ready */}
      <Experience />
      <About />
      {/* <Testimonials /> hidden for now — enable later with real quotes */}
      <Footer />
      <TCInvite />
      {/* GSAP scroll effects — deferred import, reveals via data-*
          attributes on the sections above. See components/scroll-fx.tsx. */}
      <ScrollFX />
    </>
  );
}
