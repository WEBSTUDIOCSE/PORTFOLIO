"use client";

import { useRef, useState, useTransition } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDb } from "@/lib/firebase/db";
import {
  notifyResumeRequest,
  type ResumeResult,
} from "@/app/actions/resume";
import {
  resumeRequestSchema,
  type ResumeField,
} from "@/lib/validation/forms";

// Pattern: button on Contact section → click → form expands inline.
// On submit, two parallel writes:
//   1. Firestore (lead capture) via Web SDK — gated by Firestore Rules
//   2. Server Action (email notification) — Resend API key is server-only
// Then reveal the Firebase Storage URL + auto-download.
//
// Web SDK + rules is the Firebase-standard pattern for public form
// submissions. No service-account credential required on this path.

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
      const honeypot = fd.get("company_url");
      if (typeof honeypot === "string" && honeypot.length > 0) {
        // Honeypot tripped — silent-success and skip both writes.
        setResult({
          ok: true,
          downloadUrl: process.env.NEXT_PUBLIC_RESUME_URL ?? "/resume.pdf",
        });
        setMode("done");
        return;
      }

      // Client-side validate. Rules will re-validate server-side.
      const parsed = resumeRequestSchema.safeParse({
        name: fd.get("name"),
        email: fd.get("email"),
        role: fd.get("role"),
        company: fd.get("company"),
        company_url: honeypot,
      });
      if (!parsed.success) {
        const fields: Partial<Record<ResumeField, string>> = {};
        for (const issue of parsed.error.issues) {
          const key = issue.path[0]?.toString();
          if (
            (key === "name" ||
              key === "email" ||
              key === "role" ||
              key === "company") &&
            !fields[key]
          ) {
            fields[key] = issue.message;
          }
        }
        setResult({
          ok: false,
          error: "Please fix the highlighted fields.",
          fields,
        });
        return;
      }

      const { name, email, role, company } = parsed.data;

      // 1. Firestore write via Web SDK — rules validate the shape.
      //    Must match exactly what firestore.rules expects, no extras.
      try {
        await addDoc(collection(getDb(), "resumeRequests"), {
          name,
          email,
          role,
          company,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("[resume] firestore write failed:", err);
        setResult({
          ok: false,
          error: "Something went wrong. Try again in a moment.",
        });
        return;
      }

      // 2. Email notification via Server Action (Resend key is secret).
      //    Best-effort — Firestore already has the record.
      const r = await notifyResumeRequest(fd);
      setResult(r);
      if (r.ok) {
        setMode("done");
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
          label="Company (optional)"
          name="company"
          autoComplete="organization"
          error={fieldErrors?.company}
        />
        <Field
          label="Role you're hiring for (optional)"
          name="role"
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
