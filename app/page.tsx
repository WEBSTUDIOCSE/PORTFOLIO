import CharacterScroll from "@/components/sections/character-scroll";
import SelectedWork from "@/components/sections/selected-work";
import About from "@/components/sections/about";
import Currently from "@/components/sections/currently";
import Contact from "@/components/sections/contact";

// Section order is research-backed (see plan file):
// hero → work → about → currently → contact.
// "Work first, then person" — recruiters who reached About already
// liked what they saw and now want context.
export default function Home() {
  return (
    <>
      <CharacterScroll />
      <SelectedWork />
      <About />
      <Currently />
      <Contact />
    </>
  );
}
