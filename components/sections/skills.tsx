import { PROJECTS } from "@/lib/projects";
import { SKILL_GROUPS } from "@/lib/skills";
import SkillsClient from "@/components/sections/skills-client";
import type { ResolvedSkillGroup } from "@/components/skills-explorer";

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

  return <SkillsClient groups={groups} />;
}
