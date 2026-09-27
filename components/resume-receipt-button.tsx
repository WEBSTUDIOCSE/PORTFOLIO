"use client";

import ResumePdfPreview from "@/components/resume-pdf-preview";

const RESUME_URL = "/resume/saurabh-jadhav-resume.pdf";

type ResumeReceiptButtonProps = {
  isOpen: boolean;
  onOpen: () => void;
};

type ResumeReceiptPanelProps = {
  runId: number;
};

export default function ResumeReceiptButton({
  isOpen,
  onOpen,
}: ResumeReceiptButtonProps) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls="resume-printer-preview"
      onClick={onOpen}
      className="group inline-flex items-center gap-3 rounded-full bg-[#d9ad57] px-5 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a1a1a] shadow-[0_10px_28px_rgba(217,173,87,0.18)] transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[#e7c374] hover:shadow-[0_14px_34px_rgba(217,173,87,0.26)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9ad57] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <span aria-hidden className="h-2 w-2 rounded-full bg-[#1a1a1a]/55" />
      {isOpen ? "Replay resume" : "Get resume"}
      <span aria-hidden className="text-sm transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none">
        ↗
      </span>
    </button>
  );
}

export function ResumeReceiptPanel({ runId }: ResumeReceiptPanelProps) {
  return (
    <section
      id="resume-printer-preview"
      aria-label="Resume printer preview"
      className="relative overflow-visible"
    >
      <div className="flex items-start justify-center px-0 pb-0 pt-0 sm:px-0 sm:pt-1">
        <div className="w-full max-w-[34rem] [perspective:900px]">
          <div className="relative pt-2">
            <div className="resume-printer__head relative z-30 mx-0 rounded-[0.8rem] border border-[#f4f1ea]/15 bg-[#1b1b18] px-4 pb-2.5 pt-2.5 shadow-[0_12px_24px_rgba(0,0,0,0.22)] [transform:translateZ(14px)] sm:px-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="shrink-0 font-mono text-[8px] uppercase tracking-[0.2em] text-[#f4f1ea]/45">
                  printer
                </span>
                <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-[#67d391]/80">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#67d391]" />
                  online
                </span>
                <a
                  href={RESUME_URL}
                  download
                  className="ml-auto inline-flex shrink-0 items-center rounded-full border border-[#d9ad57]/50 px-3 py-1.5 font-sans text-[9px] font-bold uppercase tracking-[0.12em] text-[#d9ad57] transition-colors hover:border-[#e7c374] hover:bg-[#d9ad57]/10 hover:text-[#e7c374] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9ad57]"
                >
                  Download PDF
                </a>
              </div>
              <div className="mt-3 h-2 rounded-full bg-black shadow-[inset_0_1px_3px_rgba(255,255,255,0.12)]">
                <span className="resume-printer__progress block h-full w-full rounded-full bg-[#d9ad57]/65" />
              </div>
            </div>

            <div
              key={runId}
              className="resume-receipt-feed relative z-10 mx-1 -mt-1 sm:mx-2"
            >
              <article className="resume-receipt relative bg-[#fffaf1] px-4 pb-0 pt-0 text-[#1a1a1a] shadow-[0_20px_36px_rgba(0,0,0,0.3)] [transform-style:preserve-3d] sm:px-6">
                <div className="resume-receipt__preview overflow-hidden bg-white">
                  <ResumePdfPreview />
                </div>
              </article>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
