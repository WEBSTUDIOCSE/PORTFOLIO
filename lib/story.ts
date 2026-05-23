// Story — the long-form origin narrative, eight beats, paced to run
// alongside the story video on the homepage <Story /> section.
// Edit the copy here; the component renders whatever's in this array.

export type StoryBeat = {
  /** Two-digit beat number, e.g. "01". */
  n: string;
  title: string;
  /** Paragraphs. The first renders in full foreground; the rest muted. */
  body: string[];
};

export const STORY_BEATS: StoryBeat[] = [
  {
    n: "01",
    title: "The Boy Who Played",
    body: [
      "Before I knew what software was, I knew what I wanted to build.",
      "Kindergarten me was the shy one — few words, fewer friends. But put a controller in my hands and something switched on. We had one of those plug-in consoles, the keyboard-and-stick kind, loaded with a “99-in-1” cartridge. Contra. Super Mario. I lived in those worlds.",
      "And somewhere in there, far too young to know the word “engineer,” I made up my mind: one day I’d be the person who makes these. The games. The apps. I didn’t know how. I just knew that was me.",
    ],
  },
  {
    n: "02",
    title: "Quiet Kid, Loud Dream",
    body: [
      "School came easy; people didn’t. Good in class, shy everywhere else, a circle of friends I could count on one hand.",
      "Then in 8th standard a school cricket tournament pulled me out of my shell. Football came after. For the first time I was in the game instead of watching it — louder, more active, finally found.",
      "But the dream underneath never moved an inch.",
    ],
  },
  {
    n: "03",
    title: "First Lines of Code",
    body: [
      "10th standard. My first website — pure HTML, mostly copy-pasted, held together with hope. It looked ridiculous. I loved it anyway. It was the first time something I imagined actually showed up on a screen because I put it there.",
    ],
  },
  {
    n: "04",
    title: "The Subjects That Didn’t Love Me Back",
    body: [
      "11th and 12th were a wall. Math, physics, chemistry never clicked, and I never pretended they did. The only math I could do effortlessly was the kind that touched IT.",
      "Because IT was mine. Favorite subject, class topper in it, IT monitor. I was already building — projects in .NET, JavaScript, HTML and CSS — while the rest of the syllabus just sort of happened to me.",
    ],
  },
  {
    n: "05",
    title: "Failing",
    body: [
      "Then came engineering, and on day one the same old subjects were waiting: math, physics, chemistry. First semester, I failed everything except C++.",
      "That was the lowest I’ve been. I genuinely believed I was finished — that I’d never make anything of myself.",
    ],
  },
  {
    n: "06",
    title: "The Reason I Kept Going",
    body: [
      "Then I met a girl. I fell for her, and she believed in me more than I did back then. She’d message me from her mom’s phone — borrowed WhatsApp, borrowed minutes — which made just talking its own small problem to solve.",
      "So I solved it. I was learning Java, and I built my first real Android app: a chat app, Java and Firebase, just so we’d have somewhere to talk. We used it. Ours.",
      "That app cracked something open. Android became an obsession — I learned everything I could, built project after project, shipped some to the Play Store. And on the second attempt, I cleared the semester I’d failed.",
    ],
  },
  {
    n: "07",
    title: "Rocking It",
    body: [
      "As engineering went on, the syllabus finally became mine — algorithms, DSA, real computer science. I knew I’d own it. And I did. Topper.",
      "I cracked company after company in placements, won hackathons and project competitions across colleges, landed a college-sponsored final-year project, and freelanced Android work on the side.",
    ],
  },
  {
    n: "08",
    title: "Now",
    body: [
      "Today I’m at Livlong. The hardest part wasn’t the job — it was the transition: leaving Android, the thing I’d fallen in love with, to go all-in on the web. React, Next.js, shadcn, a stack that keeps growing. It took time to accept. Now I can’t imagine it any other way.",
      "Since then I’ve shipped CinematicTale, built OpenClaw, and a handful of other things I’m proud of.",
      "The shy kid with the 99-in-1 cartridge still wants the exact same thing he always did. He’s just getting better at it.",
    ],
  },
];
