"use client";

import { useRef, useState, useTransition } from "react";
import {
  requestResume,
  type ResumeResult,
} from "@/app/actions/resume";

// Pattern: button on the Contact section → user clicks → form expands
// inline (slide in). After submit, the form swaps to a success state
// with a download link and triggers download automatically.
//
// "Soft gating": the download URL is /resume.pdf (public asset). The
// form captures intent + lead info; it doesn't hard-protect the PDF.

type Mode = "closed" | "open" | "done";

export default function ResumeForm() {
  const [mode, setMode] = useState<Mode>("closed");
  const [result, setResult] = useState<ResumeResult | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const open = () => {
    setMode("open");
    setResult(null);
    // Focus the first field after mount.
    requestAnimationFrame(() => {
      const first = formRef.current?.querySelector<HTMLInputElement>(
        "input[name=name]",
      );
      first?.focus();
    });
  };

  const close = () => {
    setMode("closed");
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const r = await requestResume(fd);
      setResult(r);
      if (r.ok) {
        setMode("done");
        // Auto-trigger download — recruiter doesn't have to click again.
        triggerDownload(r.downloadUrl);
      }
    });
  };

  // ─── Trigger button (initial state) ────────────────────────
  if (mode === "closed") {
    return (
      <button
        type="button"
        onClick={open}
        className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-card-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        Resume PDF
      </button>
    );
  }

  // ─── Success state ─────────────────────────────────────────
  if (mode === "done" && result?.ok) {
    return (
      <div
        role="status"
        tabIndex={-1}
        className="w-full rounded-lg border border-primary/30 bg-primary/5 p-5 text-left"
      >
        <p className="font-hand text-2xl text-primary">Done — thanks.</p>
        <p className="mt-1 text-sm text-foreground">
          The download should start automatically. If it didn&rsquo;t:
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <a
            href={result.downloadUrl}
            download
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <DownloadIcon />
            Download resume
          </a>
          <button
            type="button"
            onClick={close}
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // ─── Open form ─────────────────────────────────────────────
  const fieldErrors = !result?.ok ? result?.fields : undefined;
  const formError =
    result && !result.ok && !result.fields ? result.error : undefined;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="w-full rounded-lg border border-border bg-card p-5 text-left"
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Resume · quick intro
        </p>
        <button
          type="button"
          onClick={close}
          aria-label="Cancel"
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field
          label="Your name"
          name="name"
          type="text"
          autoComplete="name"
          required
          error={fieldErrors?.name}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={fieldErrors?.email}
        />
        <Field
          label="Company"
          name="company"
          autoComplete="organization"
          required
          error={fieldErrors?.company}
        />
        <Field
          label="Role you're hiring for"
          name="role"
          required
          error={fieldErrors?.role}
        />
      </div>

      {/* Honeypot */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Company URL
          <input
            type="text"
            name="company_url"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      {formError && (
        <p
          role="alert"
          className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {formError}
        </p>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          aria-busy={pending}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {pending ? (
            <>
              <Spinner />
              <span>Sending…</span>
            </>
          ) : (
            <>
              <span>Send &amp; download</span>
              <span aria-hidden>↓</span>
            </>
          )}
        </button>
        <p className="text-xs text-muted-foreground">
          So I know who you are. No spam.
        </p>
      </div>
    </form>
  );
}

// ─── Pieces ───────────────────────────────────────────────────

function triggerDownload(url: string) {
  if (typeof document === "undefined") return;
  const a = document.createElement("a");
  a.href = url;
  a.download = "saurabh-jadhav-resume.pdf";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
};

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
  error,
}: FieldProps) {
  const id = `resume-${name}`;
  const errorId = `${id}-error`;
  const cls = `w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
    error ? "border-destructive" : "border-border focus:border-primary/40"
  }`;
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cls}
      />
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      aria-hidden
      className="animate-spin"
    >
      <circle
        cx="7"
        cy="7"
        r="5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.3"
      />
      <path
        d="M 7 1.5 A 5.5 5.5 0 0 1 12.5 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path
        d="M 7 1 L 7 9 M 3.5 6 L 7 9.5 L 10.5 6 M 2 12 L 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
