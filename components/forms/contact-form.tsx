"use client";

import { useRef, useState, useTransition } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDb } from "@/lib/firebase/db";
import {
  notifyContact,
  type ContactResult,
} from "@/app/actions/contact";
import {
  contactSchema,
  type ContactField,
} from "@/lib/validation/forms";

// Form pattern:
// - Native <form> + FormData → Web SDK Firestore write → email-only
//   Server Action. The Firestore write happens client-side, gated by
//   Firestore Security Rules (see firestore.rules). Resend's API key
//   is a real secret, so emailing stays server-side in the action.
// - useTransition gives us a `pending` flag without manual state.
// - Submit button stays clickable while pending — we show a spinner
//   inside the button label instead of disabling. Disabled buttons
//   confuse assistive tech and feel broken on mobile.
// - aria-describedby + aria-invalid wire each field to its error.
// - Honeypot field is hidden visually but kept in the accessibility
//   tree as off-screen (not display:none, which some bots skip).

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ContactResult | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const honeypot = fd.get("company_url");
      if (typeof honeypot === "string" && honeypot.length > 0) {
        // Honeypot — silent success.
        setResult({ ok: true });
        formRef.current?.reset();
        return;
      }

      // Validate on client. Rules re-validate the same shape.
      const parsed = contactSchema.safeParse({
        name: fd.get("name"),
        email: fd.get("email"),
        message: fd.get("message"),
        company_url: honeypot,
      });
      if (!parsed.success) {
        const fields: Partial<Record<ContactField, string>> = {};
        for (const issue of parsed.error.issues) {
          const key = issue.path[0]?.toString();
          if (
            (key === "name" || key === "email" || key === "message") &&
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

      const { name, email, message } = parsed.data;

      // 1. Firestore write via Web SDK — rules enforce the shape.
      try {
        await addDoc(collection(getDb(), "contactSubmissions"), {
          name,
          email,
          message,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("[contact] firestore write failed:", err);
        setResult({
          ok: false,
          error: "Something went wrong saving your message. Try again.",
        });
        return;
      }

      // 2. Email notification via Server Action.
      const r = await notifyContact(fd);
      setResult(r);
      if (r.ok) {
        formRef.current?.reset();
        document.getElementById("contact-success")?.focus();
      }
    });
  };

  // Render success state instead of the form so the user gets
  // unambiguous closure on the action.
  if (result?.ok) {
    return (
      <div
        id="contact-success"
        tabIndex={-1}
        role="status"
        className="rounded-lg border border-primary/30 bg-primary/5 p-6 text-center"
      >
        <p className="font-hand text-3xl text-primary sm:text-4xl">
          Thanks — got it.
        </p>
        <p className="mt-2 text-sm text-foreground sm:text-base">
          I&rsquo;ll reply within a day or two. Direct from my inbox.
        </p>
        <button
          type="button"
          onClick={() => setResult(null)}
          className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
        >
          Send another →
        </button>
      </div>
    );
  }

  const fieldErrors = !result?.ok ? result?.fields : undefined;
  const formError =
    result && !result.ok && !result.fields ? result.error : undefined;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="text-left"
    >
      <div className="space-y-4">
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
          label="Message"
          name="message"
          required
          multiline
          rows={5}
          placeholder="What are you building? What role? Anything you'd want me to know."
          error={fieldErrors?.message}
        />

        {/* Honeypot — invisible to humans, irresistible to bots. */}
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
            className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {formError}
          </p>
        )}

        <button
          type="submit"
          aria-busy={pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
        >
          {pending ? (
            <>
              <Spinner />
              <span>Sending…</span>
            </>
          ) : (
            <>
              <span>Send message</span>
              <span aria-hidden>→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ─── Pieces ────────────────────────────────────────────────────

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  error?: string;
};

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
  multiline,
  rows = 4,
  placeholder,
  error,
}: FieldProps) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;
  const baseInput =
    "w-full rounded-md border bg-card px-3 py-2.5 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40";
  const inputClass = `${baseInput} ${
    error ? "border-destructive" : "border-border focus:border-primary/40"
  }`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={rows}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={inputClass}
        />
      )}
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
