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

  return (
    <div className="mt-12">
      <div
        aria-label="Skill areas"
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
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
              className={`shrink-0 rounded-full border px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.16em] transition-[background-color,border-color,color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9ad57] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] motion-reduce:transition-none ${
                selected
                  ? "border-[#d9ad57] bg-[#d9ad57] text-[#1a1a1a]"
                  : "border-[#f4f1ea]/20 text-[#f4f1ea]/65 hover:-translate-y-0.5 hover:border-[#d9ad57]/70 hover:text-[#f4f1ea] motion-reduce:hover:translate-y-0"
              }`}
            >
              {group.label}
            </button>
          );
        })}
      </div>

      <div
        id={`skills-panel-${activeGroup.id}`}
        role="tabpanel"
        className="mt-5 grid overflow-hidden rounded-[1.75rem] border border-[#f4f1ea]/15 bg-[#24231f] lg:grid-cols-[0.78fr_1.22fr]"
      >
        <div className="border-b border-[#f4f1ea]/10 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#d9ad57]">
            {String(activeGroupIndex + 1).padStart(2, "0")} / {String(groups.length).padStart(2, "0")}
          </p>
          <h3 className="mt-5 max-w-md font-display text-3xl font-light leading-[1.02] tracking-[-0.03em] text-[#f4f1ea] sm:text-4xl">
            {activeGroup.title}
          </h3>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-[#f4f1ea]/60 sm:text-base">
            {activeGroup.description}
          </p>

          <div className="mt-8 border-t border-[#f4f1ea]/10 pt-5">
            <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#f4f1ea]/40">
              Select a capability
            </p>
            <div className="mt-4 space-y-1">
              {activeGroup.skills.map((skill, index) => {
                const selected = index === activeSkillIndex;
                return (
                  <button
                    key={skill.name}
                    type="button"
                    onClick={() => setActiveSkillIndex(index)}
                    className={`flex w-full items-center justify-between gap-4 rounded-xl px-3 py-3 text-left transition-[background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9ad57] motion-reduce:transition-none ${
                      selected
                        ? "bg-[#f4f1ea] text-[#1a1a1a]"
                        : "text-[#f4f1ea]/65 hover:bg-[#f4f1ea]/8 hover:text-[#f4f1ea]"
                    }`}
                  >
                    <span className="font-sans text-sm">{skill.name}</span>
                    <span aria-hidden className="font-sans text-xs opacity-45">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex min-h-[22rem] flex-col justify-between p-6 sm:p-8 lg:p-10">
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#d9ad57]">
              Capability note
            </p>
            <h4 className="mt-5 max-w-xl font-display text-4xl font-light leading-[0.98] tracking-[-0.035em] text-[#f4f1ea] sm:text-5xl">
              {activeSkill.name}
            </h4>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#f4f1ea]/65 sm:text-lg">
              {activeSkill.summary}
            </p>
          </div>

          <div className="mt-12 border-t border-[#f4f1ea]/10 pt-5">
            <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#f4f1ea]/40">
              Seen in shipped work
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {activeSkill.projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/work/${project.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-[#f4f1ea]/18 px-3 py-2 text-sm text-[#f4f1ea]/75 transition-[border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#d9ad57] hover:text-[#f4f1ea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9ad57] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  {project.title}
                  <span aria-hidden className="text-[#d9ad57]">↗</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
