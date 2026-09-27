import { PROJECTS } from "@/lib/projects";
import { SKILL_GROUPS } from "@/lib/skills";
import SkillsExplorer, { type ResolvedSkillGroup } from "@/components/skills-explorer";

export default function Skills() {
  const projectBySlug = new Map(PROJECTS.map((project) => [project.slug, project]));
  const groups: ResolvedSkillGroup[] = SKILL_GROUPS.map((group) => ({
    ...group,
    skills: group.skills.map((skill) => ({
      ...skill,
      projects: skill.projectSlugs.flatMap((slug) => {
        const project = projectBySlug.get(slug);
        return project
          ? [{ slug: project.slug, title: project.title.split(" — ")[0] }]
          : [];
      }),
    })),
  }));

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="bg-[#1a1a1a] px-6 py-24 text-[#f4f1ea] sm:px-10 lg:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <header className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div data-reveal>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#d9ad57]">
              Skills / systems / practice
            </p>
            <span aria-hidden data-fx-line className="mt-6 block h-px w-24 bg-[#d9ad57]/70" />
          </div>
          <div data-reveal>
            <h2
              id="skills-heading"
              className="max-w-4xl font-display text-balance text-5xl font-light leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-8xl"
            >
              Skills with receipts.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#f4f1ea]/65 sm:text-lg">
              A recruiter-readable map of the capabilities behind the products. These are
              not a keyword cloud—they are capabilities attached to systems I
              have designed, shipped, and maintained.
            </p>
          </div>
        </header>

        <SkillsExplorer groups={groups} />
      </div>
    </section>
  );
}
