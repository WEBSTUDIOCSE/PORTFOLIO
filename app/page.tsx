import CharacterScroll from "@/components/sections/character-scroll";
import SelectedWork from "@/components/sections/selected-work";
import About from "@/components/sections/about";
import Experience from "@/components/sections/experience";
import Press from "@/components/sections/press";
import Currently from "@/components/sections/currently";
import Contact from "@/components/sections/contact";
import Footer from "@/components/sections/footer";
import TCInvite from "@/components/tc-invite";

// Section order is research-backed (see plan file):
//   hero → work → about → experience → press → currently → contact → footer
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
      <Experience />
      <Press />
      <Currently />
      <Contact />
      <Footer />
      <TCInvite />
    </>
  );
}
