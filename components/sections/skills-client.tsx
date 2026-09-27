"use client";

import { useEffect, useState } from "react";
import SkillsExplorer, { type ResolvedSkillGroup } from "@/components/skills-explorer";
import ResumeReceiptButton, { ResumeReceiptPanel } from "@/components/resume-receipt-button";

export default function SkillsClient({ groups }: { groups: ResolvedSkillGroup[] }) {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [resumeRunId, setResumeRunId] = useState(0);
  const [autoDownload, setAutoDownload] = useState(false);
  const skillCount = groups.reduce((total, group) => total + group.skills.length, 0);
  const productCount = new Set(groups.flatMap((group) => group.skills.flatMap((skill) => skill.projectSlugs))).size;

  const openResume = (shouldDownload = false) => {
    setResumeOpen(true);
    setAutoDownload(shouldDownload);
    setResumeRunId((current) => current + 1);
    window.setTimeout(() => {
      document.getElementById("skills")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 40);
  };

  useEffect(() => {
    const handleResumeRequest = () => openResume(true);

    window.addEventListener("portfolio:open-resume", handleResumeRequest);
    if (new URLSearchParams(window.location.search).get("resume") === "1") {
      window.setTimeout(() => {
        openResume(true);
        window.history.replaceState({}, "", "/#skills");
      }, 0);
    }

    return () => {
      window.removeEventListener("portfolio:open-resume", handleResumeRequest);
    };
  }, []);

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="bg-[#1a1a1a] px-4 py-12 text-[#f4f1ea] sm:px-6 sm:py-20 lg:min-h-[100svh] lg:px-10 lg:py-16 xl:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(20rem,0.58fr)_minmax(0,1.42fr)] lg:items-start lg:gap-10">
          <header className="lg:sticky lg:top-24">
            <div data-reveal>
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#d9ad57]">
                Skills / systems / practice
              </p>
              <span aria-hidden data-fx-line className="mt-6 block h-px w-24 bg-[#d9ad57]/70" />
            </div>
            <h2
              id="skills-heading"
              className="mt-7 max-w-md font-display text-balance text-[2.65rem] font-light leading-[0.96] tracking-[-0.04em] sm:text-5xl lg:mt-10 lg:text-6xl xl:text-7xl"
              data-reveal
            >
              Skills with receipts.
            </h2>
            <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-[#f4f1ea]/65 sm:text-base" data-reveal>
              A recruiter-readable map of the capabilities behind the products. These are
              not a keyword cloud—they are capabilities attached to systems I
              have designed, shipped, and maintained.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3" data-reveal>
              <ResumeReceiptButton isOpen={resumeOpen} onOpen={openResume} />
            </div>
            <div className="mt-8 grid max-w-md grid-cols-3 border-t border-[#f4f1ea]/15 pt-5" data-reveal>
              <Stat value={groups.length} label="Practice areas" />
              <Stat value={skillCount} label="Capabilities" />
              <Stat value={productCount} label="Shipped systems" />
            </div>
          </header>

          <div className="min-w-0">
            {resumeOpen ? (
              <ResumeReceiptPanel
                key={resumeRunId}
                runId={resumeRunId}
                autoDownload={autoDownload}
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

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-0 pr-3">
      <p className="font-display text-2xl font-light leading-none text-[#d9ad57] sm:text-3xl">
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-2 font-sans text-[9px] uppercase leading-relaxed tracking-[0.16em] text-[#f4f1ea]/45">
        {label}
      </p>
    </div>
  );
}
