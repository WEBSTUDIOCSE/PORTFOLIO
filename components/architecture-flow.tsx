"use client";

import { useEffect, useId, useState } from "react";
import MermaidDiagram from "@/components/mermaid-diagram";

type ArchitectureFlowProps = {
  steps: string[];
  chart: string;
  caption?: string;
  stack?: string[];
  useCases?: string[];
};

type View = "flow" | "use-cases" | "stack";

const FLOW_HINTS = [
  "Start here",
  "Shape the work",
  "Coordinate",
  "Persist",
  "Project",
  "Ship",
];

const VIEWS: Array<{ id: View; label: string }> = [
  { id: "flow", label: "System flow" },
  { id: "use-cases", label: "Use cases" },
  { id: "stack", label: "Stack" },
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
  stack = [],
  useCases = [],
}: ArchitectureFlowProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [view, setView] = useState<View>("flow");
  const [isPlaying, setIsPlaying] = useState(false);
  const baseId = useId().replace(/:/g, "_");
  const safeSteps = steps.length > 0 ? steps : ["The system is described in the full map below."];
  const stepCount = safeSteps.length;
  const currentStep = safeSteps[Math.min(activeStep, safeSteps.length - 1)];
  const safeUseCases = useCases.length > 0 ? useCases : ["Explore the system map to see how this product works end to end."];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const startTimer = window.setTimeout(() => setIsPlaying(true), 0);
    return () => window.clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (view !== "flow" || !isPlaying || stepCount < 2) return;

    const timer = window.setInterval(() => {
      setActiveStep((current) => (current >= stepCount - 1 ? 0 : current + 1));
    }, 2200);

    return () => window.clearInterval(timer);
  }, [isPlaying, stepCount, view]);

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[1.75rem] border border-[#1a1a1a]/15 bg-[#fffaf1] shadow-[0_18px_50px_rgba(26,26,26,0.07)]">
        <div className="border-b border-[#1a1a1a]/10 px-5 py-5 sm:px-8 sm:py-7">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#8a6526]">
                Interactive system view
              </p>
              <h3 className="mt-2 max-w-xl font-display text-3xl font-light leading-tight tracking-[-0.03em] text-[#1a1a1a] sm:text-4xl">
                See the product from purpose to implementation.
              </h3>
            </div>
            <p className="max-w-[17rem] text-sm leading-relaxed text-[#1a1a1a]/55">
              Follow the work, then switch views when you want the practical
              answer: who it is for and what it is built with.
            </p>
          </div>

          <div
            aria-label="Architecture views"
            className="mt-6 flex max-w-full gap-1 overflow-x-auto rounded-full border border-[#1a1a1a]/12 bg-[#f4ece2] p-1 scrollbar-none"
            role="tablist"
          >
            {VIEWS.map((item) => {
              const selected = item.id === view;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${baseId}-${item.id}`}
                  onClick={() => setView(item.id)}
                  className={`shrink-0 rounded-full px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.16em] transition-[background-color,color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a6526] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf1] motion-reduce:transition-none ${
                    selected
                      ? "bg-[#1a1a1a] text-[#f4f1ea]"
                      : "text-[#1a1a1a]/55 hover:-translate-y-0.5 hover:text-[#1a1a1a] motion-reduce:hover:translate-y-0"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {view === "flow" && (
          <div id={`${baseId}-flow`} role="tabpanel">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1a1a1a]/10 bg-[#f4ece2] px-5 py-4 sm:px-8">
              <div className="flex items-center gap-3" aria-live="polite">
                <span className={`relative flex h-2.5 w-2.5 ${isPlaying ? "" : "opacity-45"}`}>
                  {isPlaying && <span aria-hidden className="absolute inset-0 rounded-full bg-[#d9ad57] motion-safe:animate-ping" />}
                  <span aria-hidden className="relative h-2.5 w-2.5 rounded-full bg-[#d9ad57]" />
                </span>
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]/65">
                  {isPlaying ? "Flow running" : "Flow paused"}
                </span>
                <span className="text-sm text-[#1a1a1a]/45">
                  Step {String(activeStep + 1).padStart(2, "0")} / {String(stepCount).padStart(2, "0")}
                </span>
              </div>
              <button
                type="button"
                aria-pressed={isPlaying}
                onClick={() => setIsPlaying((playing) => !playing)}
                className="rounded-full border border-[#1a1a1a]/20 bg-[#fffaf1] px-3.5 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a] transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#8a6526] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a6526] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4ece2] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {isPlaying ? "Pause flow" : "Play flow"}
              </button>
            </div>

            <div className="overflow-x-auto px-5 py-6 sm:px-8 sm:py-8">
              <div className="mb-7 h-1 overflow-hidden rounded-full bg-[#1a1a1a]/10" aria-hidden>
                <span
                  className="block h-full rounded-full bg-[#d9ad57] transition-[width] duration-500 ease-out motion-reduce:transition-none"
                  style={{ width: `${((activeStep + 1) / stepCount) * 100}%` }}
                />
              </div>
              <ol
                className="flex min-w-max gap-3 md:grid md:min-w-0 md:gap-0"
                style={{ gridTemplateColumns: `repeat(${Math.min(safeSteps.length, 4)}, minmax(0, 1fr))` }}
              >
                {safeSteps.map((step, index) => {
                  const selected = index === activeStep;
                  const completed = index < activeStep;
                  const stepId = `${baseId}-step-${index}`;
                  return (
                    <li key={stepId} className="flex items-center md:min-w-0">
                      <button
                        type="button"
                        aria-current={selected ? "step" : undefined}
                        aria-controls={`${baseId}-detail`}
                        onClick={() => {
                          setActiveStep(index);
                          setIsPlaying(false);
                        }}
                        className={`group relative w-[13.5rem] rounded-2xl border p-4 text-left transition-[background-color,border-color,transform] duration-200 md:w-auto md:flex-1 md:rounded-none md:border-x-0 md:border-t-0 md:border-b-0 md:p-0 md:pr-5 motion-reduce:transition-none ${
                          selected
                            ? "border-[#1a1a1a] bg-[#1a1a1a] text-[#f4f1ea] shadow-[0_0_0_3px_rgba(217,173,87,0.35)] md:bg-transparent md:text-[#1a1a1a] md:shadow-none"
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
                        <span aria-hidden className={`mx-3 hidden h-px flex-1 transition-colors duration-500 md:block motion-reduce:transition-none ${completed ? "bg-[#d9ad57]" : "bg-[#1a1a1a]/15"}`} />
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

            <div className="border-t border-[#1a1a1a]/10 px-5 py-5 sm:px-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
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
            </div>
          </div>
        )}

        {view === "use-cases" && (
          <div id={`${baseId}-use-cases`} role="tabpanel" className="grid gap-3 bg-[#f4ece2] p-5 sm:grid-cols-3 sm:p-8">
            {safeUseCases.map((useCase, index) => (
              <article key={useCase} className="rounded-2xl border border-[#1a1a1a]/12 bg-[#fffaf1] p-5 sm:p-6">
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#8a6526]">
                  Use case {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-8 font-display text-xl leading-tight text-[#1a1a1a] sm:text-2xl">
                  {useCase}
                </p>
              </article>
            ))}
          </div>
        )}

        {view === "stack" && (
          <div id={`${baseId}-stack`} role="tabpanel" className="bg-[#f4ece2] p-5 sm:p-8">
            <div className="flex flex-wrap gap-2">
              {stack.map((item, index) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full border border-[#1a1a1a]/15 bg-[#fffaf1] px-4 py-2.5 text-sm text-[#1a1a1a]">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a6526]">{String(index + 1).padStart(2, "0")}</span>
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-[#1a1a1a]/65">
              The stack is shown as a system boundary, not a shopping list: each tool is here because it supports a specific product behaviour in the flow.
            </p>
          </div>
        )}
      </div>

      {view === "flow" && showMap && <MermaidDiagram chart={chart} caption={caption} />}
    </div>
  );
}
