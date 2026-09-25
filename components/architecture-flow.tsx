"use client";

import { useId, useState } from "react";
import MermaidDiagram from "@/components/mermaid-diagram";

type ArchitectureFlowProps = {
  steps: string[];
  chart: string;
  caption?: string;
};

const FLOW_HINTS = [
  "Start here",
  "Shape the work",
  "Coordinate",
  "Persist",
  "Project",
  "Ship",
];

function compactTitle(text: string) {
  const firstClause = text.split(/[:—]/)[0].trim();
  if (firstClause.length <= 38) return firstClause;
  return `${firstClause.split(/\s+/).slice(0, 5).join(" ")}…`;
}

export default function ArchitectureFlow({
  steps,
  chart,
  caption,
}: ArchitectureFlowProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const baseId = useId().replace(/:/g, "_");
  const safeSteps = steps.length > 0 ? steps : ["The system is described in the full map below."];
  const currentStep = safeSteps[Math.min(activeStep, safeSteps.length - 1)];

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[1.75rem] border border-[#1a1a1a]/15 bg-[#fffaf1] shadow-[0_18px_50px_rgba(26,26,26,0.07)]">
        <div className="border-b border-[#1a1a1a]/10 px-5 py-5 sm:px-8 sm:py-7">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#8a6526]">
                Interactive flow
              </p>
              <h3 className="mt-2 max-w-xl font-display text-3xl font-light leading-tight tracking-[-0.03em] text-[#1a1a1a] sm:text-4xl">
                Follow the system from input to outcome.
              </h3>
            </div>
            <p className="max-w-[15rem] text-sm leading-relaxed text-[#1a1a1a]/55">
              Select a step to see what happens there. The flow stays readable
              even when the underlying system is complex.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto px-5 py-6 sm:px-8 sm:py-8">
          <ol className="flex min-w-max gap-3 md:grid md:min-w-0 md:gap-0" style={{ gridTemplateColumns: `repeat(${Math.min(safeSteps.length, 4)}, minmax(0, 1fr))` }}>
            {safeSteps.map((step, index) => {
              const selected = index === activeStep;
              const stepId = `${baseId}-step-${index}`;
              return (
                <li key={stepId} className="flex items-center md:min-w-0">
                  <button
                    type="button"
                    aria-current={selected ? "step" : undefined}
                    aria-controls={`${baseId}-detail`}
                    onClick={() => setActiveStep(index)}
                    className={`group relative w-[13.5rem] rounded-2xl border p-4 text-left transition-[background-color,border-color,transform] duration-200 md:w-auto md:flex-1 md:rounded-none md:border-x-0 md:border-t-0 md:border-b-0 md:p-0 md:pr-5 motion-reduce:transition-none ${
                      selected
                        ? "border-[#1a1a1a] bg-[#1a1a1a] text-[#f4f1ea] md:bg-transparent md:text-[#1a1a1a]"
                        : "border-[#1a1a1a]/15 bg-transparent text-[#1a1a1a]/55 hover:-translate-y-0.5 hover:border-[#8a6526]/60 hover:text-[#1a1a1a] md:hover:translate-y-0"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a6526]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={`font-sans text-[9px] uppercase tracking-[0.16em] ${selected ? "text-current/55" : "text-current/40"}`}>
                        {FLOW_HINTS[index] ?? "Continue"}
                      </span>
                    </span>
                    <span className="mt-5 block font-display text-lg leading-tight sm:text-xl">
                      {compactTitle(step)}
                    </span>
                  </button>
                  {index < safeSteps.length - 1 && (
                    <span aria-hidden className="mx-3 hidden h-px flex-1 bg-[#1a1a1a]/15 md:block" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div
          id={`${baseId}-detail`}
          aria-live="polite"
          className="grid gap-6 border-t border-[#1a1a1a]/10 bg-[#f4ece2] px-5 py-6 sm:px-8 sm:py-8 md:grid-cols-[0.7fr_1.3fr] md:items-start"
        >
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#8a6526]">
              Step {String(activeStep + 1).padStart(2, "0")} of {String(safeSteps.length).padStart(2, "0")}
            </p>
            <p className="mt-3 font-display text-2xl leading-tight text-[#1a1a1a] sm:text-3xl">
              {compactTitle(currentStep)}
            </p>
          </div>
          <p className="max-w-3xl text-base leading-relaxed text-[#1a1a1a]/75 sm:text-lg">
            {currentStep}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#1a1a1a]/15 bg-[#fffaf1] px-5 py-4 sm:px-6">
        <div>
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a6526]">
            Full system map
          </p>
          <p className="mt-1 text-sm text-[#1a1a1a]/60">
            Open the detailed dependency view when you want the infrastructure level.
          </p>
        </div>
        <button
          type="button"
          aria-expanded={showMap}
          onClick={() => setShowMap((visible) => !visible)}
          className="shrink-0 rounded-full bg-[#1a1a1a] px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#f4f1ea] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a6526] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          {showMap ? "Hide map" : "Open map"}
        </button>
      </div>

      {showMap && <MermaidDiagram chart={chart} caption={caption} />}
    </div>
  );
}
