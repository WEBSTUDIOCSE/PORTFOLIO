"use client";

import Link from "next/link";
import { useState } from "react";
import type { SkillGroup } from "@/lib/skills";

export type ResolvedSkillGroup = Omit<SkillGroup, "skills"> & {
  skills: Array<SkillGroup["skills"][number] & { projects: Array<{ slug: string; title: string }> }>;
};

export default function SkillsExplorer({ groups }: { groups: ResolvedSkillGroup[] }) {
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const activeGroup = groups[activeGroupIndex] ?? groups[0];
  const activeSkill = activeGroup?.skills[activeSkillIndex] ?? activeGroup?.skills[0];

  if (!activeGroup || !activeSkill) return null;

  const projectsInGroup = new Set(activeGroup.skills.flatMap((skill) => skill.projectSlugs));

  return (
    <div className="mt-12">
      <div
        aria-label="Skill areas"
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        role="tablist"
      >
        {groups.map((group, index) => {
          const selected = index === activeGroupIndex;
          return (
            <button
              key={group.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`skills-panel-${group.id}`}
              onClick={() => {
                setActiveGroupIndex(index);
                setActiveSkillIndex(0);
              }}
              className={`group rounded-2xl border p-4 text-left transition-[background-color,border-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9ad57] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] motion-reduce:transition-none ${
                selected
                  ? "border-[#d9ad57] bg-[#d9ad57] text-[#1a1a1a] shadow-[0_12px_30px_rgba(217,173,87,0.18)]"
                  : "border-[#f4f1ea]/15 bg-[#24231f] text-[#f4f1ea]/65 hover:-translate-y-0.5 hover:border-[#d9ad57]/70 hover:text-[#f4f1ea] motion-reduce:hover:translate-y-0"
              }`}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] opacity-60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-sans text-[10px] uppercase tracking-[0.15em] opacity-60">
                  {group.skills.length} skills
                </span>
              </span>
              <span className="mt-7 block font-display text-lg leading-tight sm:text-xl">
                {group.label}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id={`skills-panel-${activeGroup.id}`}
        role="tabpanel"
        className="mt-4 overflow-hidden rounded-[1.75rem] border border-[#f4f1ea]/15 bg-[#24231f]"
      >
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[#f4f1ea]/10 p-6 sm:p-8 lg:p-10">
          <div className="max-w-2xl">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#d9ad57]">
              Capability layer {String(activeGroupIndex + 1).padStart(2, "0")} / {String(groups.length).padStart(2, "0")}
            </p>
            <h3 className="mt-4 font-display text-3xl font-light leading-[1.02] tracking-[-0.03em] text-[#f4f1ea] sm:text-5xl">
              {activeGroup.title}
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#f4f1ea]/60 sm:text-base">
              {activeGroup.description}
            </p>
          </div>
          <div className="flex items-end gap-3 text-right">
            <span className="font-display text-5xl font-light leading-none text-[#d9ad57] sm:text-6xl">
              {String(activeGroup.skills.length).padStart(2, "0")}
            </span>
            <span className="mb-1 max-w-[5.5rem] font-sans text-[10px] uppercase leading-relaxed tracking-[0.16em] text-[#f4f1ea]/45">
              capabilities<br />
              {projectsInGroup.size} products
            </span>
          </div>
        </div>

        <div className="grid gap-2 p-3 sm:grid-cols-2 sm:p-5">
          {activeGroup.skills.map((skill, index) => {
            const selected = index === activeSkillIndex;
            return (
              <button
                key={skill.name}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveSkillIndex(index)}
                className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-[background-color,border-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9ad57] motion-reduce:transition-none ${
                  selected
                    ? "border-[#d9ad57]/70 bg-[#f4f1ea] text-[#1a1a1a] shadow-[0_12px_30px_rgba(0,0,0,0.16)]"
                    : "border-[#f4f1ea]/10 bg-[#1a1a1a]/35 text-[#f4f1ea] hover:-translate-y-0.5 hover:border-[#f4f1ea]/30 hover:bg-[#1a1a1a]/60 motion-reduce:hover:translate-y-0"
                }`}
              >
                <span className="flex items-center justify-between gap-4">
                  <span className={`font-sans text-[10px] font-bold uppercase tracking-[0.18em] ${selected ? "text-[#8a6526]" : "text-[#d9ad57]"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={`font-sans text-[10px] uppercase tracking-[0.14em] ${selected ? "text-[#1a1a1a]/45" : "text-[#f4f1ea]/40"}`}>
                    {skill.projects.length} {skill.projects.length === 1 ? "project" : "projects"}
                  </span>
                </span>
                <span className="mt-7 block font-display text-2xl leading-tight tracking-[-0.02em] sm:text-3xl">
                  {skill.name}
                </span>
                <span className={`mt-3 block text-sm leading-relaxed ${selected ? "text-[#1a1a1a]/65" : "text-[#f4f1ea]/55"}`}>
                  {skill.summary}
                </span>
                <span className={`mt-6 inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.16em] ${selected ? "text-[#8a6526]" : "text-[#d9ad57]"}`}>
                  {selected ? "Selected" : "Explore skill"}
                  <span aria-hidden className={`transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none ${selected ? "rotate-90" : ""}`}>
                    ↗
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div
          aria-live="polite"
          className="grid gap-6 border-t border-[#1a1a1a]/10 bg-[#f4f1ea] p-6 text-[#1a1a1a] sm:p-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:p-10"
        >
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#8a6526]">
              Proof in shipped work
            </p>
            <h4 className="mt-3 font-display text-3xl font-light leading-tight tracking-[-0.03em] sm:text-4xl">
              {activeSkill.name}
            </h4>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#1a1a1a]/60">
              {activeSkill.summary}
            </p>
          </div>
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#1a1a1a]/45">
              Used on these systems
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {activeSkill.projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/work/${project.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-[#1a1a1a]/15 bg-[#fffaf1] px-3 py-2 text-sm transition-[border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#8a6526] hover:text-[#8a6526] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a6526] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  {project.title}
                  <span aria-hidden className="text-[#8a6526]">↗</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
