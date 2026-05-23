import CharacterScroll from "@/components/sections/character-scroll";
import SelectedWork from "@/components/sections/selected-work";
import About from "@/components/sections/about";
// Story section hidden for now — re-enable once the story video is ready.
// import Story from "@/components/sections/story";
import Experience from "@/components/sections/experience";
import Press from "@/components/sections/press";
// Testimonials hidden for now — re-enable once real quotes are collected.
// import Testimonials from "@/components/sections/testimonials";
import Currently from "@/components/sections/currently";
import Contact from "@/components/sections/contact";
import Footer from "@/components/sections/footer";
import TCInvite from "@/components/tc-invite";

// Section order is research-backed (see plan file):
//   hero → work → about → story → experience → press → testimonials →
//   currently → contact → footer
// About is the short "who I am"; Story is the long-form origin arc
// (8 beats + video). Testimonials sit after press: the reader has seen
// the work and the history, now hears others vouch for it.
// Reads chronologically: who I am → what I've shipped → who I am →
// where I've worked → what reached people → what I'm doing now →
// how to reach me → housekeeping.
//
// TCInvite is a fixed floating widget — the Indian Railways Ticket
// Checker character who slides in after the hero and routes to
// /journey on click. Lives at root of home only.
export default function Home() {
  return (
    <>
      <CharacterScroll />
      <SelectedWork />
      <About />
      {/* <Story /> hidden for now — enable once the story video is ready */}
      <Experience />
      <Press />
      {/* <Testimonials /> hidden for now — enable later with real quotes */}
      <Currently />
      <Contact />
      <Footer />
      <TCInvite />
    </>
  );
}
