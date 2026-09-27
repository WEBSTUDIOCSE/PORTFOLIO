"use client";

import { useState } from "react";
import SkillsExplorer, { type ResolvedSkillGroup } from "@/components/skills-explorer";
import ResumeReceiptButton, { ResumeReceiptPanel } from "@/components/resume-receipt-button";

export default function SkillsClient({ groups }: { groups: ResolvedSkillGroup[] }) {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [resumeRunId, setResumeRunId] = useState(0);

  const openResume = () => {
    setResumeOpen(true);
    setResumeRunId((current) => current + 1);
  };

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="bg-[#1a1a1a] px-4 py-16 text-[#f4f1ea] sm:px-6 sm:py-20 lg:min-h-[100svh] lg:px-10 lg:py-16 xl:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(20rem,0.58fr)_minmax(0,1.42fr)] lg:items-start lg:gap-10">
          <header className="lg:sticky lg:top-24">
            <div data-reveal>
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#d9ad57]">
                Skills / systems / practice
              </p>
              <span aria-hidden data-fx-line className="mt-6 block h-px w-24 bg-[#d9ad57]/70" />
            </div>
            <h2
              id="skills-heading"
              className="mt-8 max-w-md font-display text-balance text-4xl font-light leading-[0.96] tracking-[-0.04em] sm:text-5xl lg:mt-10 lg:text-6xl xl:text-7xl"
              data-reveal
            >
              Skills with receipts.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-[#f4f1ea]/65 sm:text-base" data-reveal>
              A recruiter-readable map of the capabilities behind the products. These are
              not a keyword cloud—they are capabilities attached to systems I
              have designed, shipped, and maintained.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3" data-reveal>
              <ResumeReceiptButton isOpen={resumeOpen} onOpen={openResume} />
              <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f4f1ea]/40">
                {resumeOpen ? "PDF · live preview" : "Explore the stack"}
              </span>
            </div>
          </header>

          <div className="min-w-0">
            {resumeOpen ? (
              <ResumeReceiptPanel
                key={resumeRunId}
                runId={resumeRunId}
              />
            ) : (
              <SkillsExplorer groups={groups} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
