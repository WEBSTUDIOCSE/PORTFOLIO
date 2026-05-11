import "server-only";
// ─────────────────────────────────────────────────────────────
// Resend transactional email (server-only).
//
// Why Resend vs. nodemailer/Gmail: Resend is a transactional email
// API with proper deliverability, no SPF/DKIM setup required for
// the sandbox sender. Free tier: 100 emails/day, 3000/month — well
// beyond a portfolio's needs.
//
// SENDER NOTE: while you haven't verified a custom domain, Resend
// only allows sending TO addresses you've verified during signup.
// Since the recipient (CONTACT_EMAIL_TO) is always your own inbox,
// this works out of the box. To send to arbitrary recipients later,
// verify a domain in Resend dashboard and update FROM_ADDRESS.
//
// Reference: https://resend.com/docs/send-with-nextjs
// ─────────────────────────────────────────────────────────────

import { Resend } from "resend";

// Sandbox sender — works without domain verification because we
// only send to the verified account inbox. Swap to your domain
// (e.g. "Saurabh <hello@saurabhjadhav.in>") once domain DNS is set.
const FROM_ADDRESS = "Portfolio <onboarding@resend.dev>";

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error(
      "Missing RESEND_API_KEY. Get a key from https://resend.com/api-keys " +
        "and add it to .env.local.",
    );
  }
  return new Resend(key);
}

function getRecipient(): string {
  const to = process.env.CONTACT_EMAIL_TO;
  if (!to) {
    throw new Error("Missing CONTACT_EMAIL_TO env var.");
  }
  return to;
}

// ─── Email shape helpers ────────────────────────────────────────

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function plainTextSignature(): string {
  return "\n\n—\nSent from the contact form at saurabhjadhav.in.";
}

// ─── Public API ────────────────────────────────────────────────

export async function sendContactEmail(data: {
  name: string;
  email: string;
  message: string;
}) {
  const resend = getResend();
  const subject = `Portfolio contact: ${data.name}`;

  const text =
    `From: ${data.name} <${data.email}>\n\n` +
    `${data.message}` +
    plainTextSignature();

  const html = `
    <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;line-height:1.5;color:#1a1410;max-width:600px;">
      <p style="font-family:monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#5a4435;margin:0 0 16px 0;">
        Portfolio · Contact form
      </p>
      <p style="margin:0 0 8px 0;"><strong>${escapeHtml(data.name)}</strong>
        <span style="color:#5a4435;">&lt;${escapeHtml(data.email)}&gt;</span>
      </p>
      <hr style="border:none;border-top:1px solid rgba(26,20,16,0.15);margin:16px 0;" />
      <div style="white-space:pre-wrap;">${escapeHtml(data.message)}</div>
      <hr style="border:none;border-top:1px solid rgba(26,20,16,0.15);margin:24px 0 8px 0;" />
      <p style="font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#5a4435;margin:0;">
        Reply directly — it goes to ${escapeHtml(data.email)}
      </p>
    </div>
  `;

  // replyTo sets the Reply-To header so hitting Reply in Gmail goes
  // straight to the sender, not back to Resend.
  return resend.emails.send({
    from: FROM_ADDRESS,
    to: getRecipient(),
    replyTo: data.email,
    subject,
    text,
    html,
  });
}

export async function sendResumeRequestEmail(data: {
  name: string;
  email: string;
  role: string;
  company: string;
}) {
  const resend = getResend();
  const subject = `Resume request: ${data.name} · ${data.company}`;

  const text =
    `Resume request received.\n\n` +
    `Name:    ${data.name}\n` +
    `Email:   ${data.email}\n` +
    `Company: ${data.company}\n` +
    `Role:    ${data.role}` +
    plainTextSignature();

  const html = `
    <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;line-height:1.5;color:#1a1410;max-width:600px;">
      <p style="font-family:monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#7a1f2b;margin:0 0 16px 0;">
        Portfolio · Resume request
      </p>
      <table style="border-collapse:collapse;">
        <tr><td style="padding:4px 16px 4px 0;color:#5a4435;font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;">Name</td>
            <td style="padding:4px 0;"><strong>${escapeHtml(data.name)}</strong></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#5a4435;font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;">Email</td>
            <td style="padding:4px 0;">${escapeHtml(data.email)}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#5a4435;font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;">Company</td>
            <td style="padding:4px 0;">${escapeHtml(data.company)}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#5a4435;font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;">Role</td>
            <td style="padding:4px 0;">${escapeHtml(data.role)}</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid rgba(26,20,16,0.15);margin:24px 0 8px 0;" />
      <p style="font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#5a4435;margin:0;">
        Reply directly — it goes to ${escapeHtml(data.email)}
      </p>
    </div>
  `;

  return resend.emails.send({
    from: FROM_ADDRESS,
    to: getRecipient(),
    replyTo: data.email,
    subject,
    text,
    html,
  });
}
