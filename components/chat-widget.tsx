"use client";

// Floating chat widget — replaces the old TC (Ticket Checker) mascot
// in the same slot. Answers questions about Saurabh using his
// projects/experience/writing + resume as a knowledge base (see
// app/api/chat/route.ts). Ephemeral: nothing about the conversation
// is stored anywhere server-side — messages live only in this
// component's state for the current tab.
//
// Colors are literal hex (not the theme's semantic tokens) because
// this widget is `fixed` and scrolls over every section — hero
// (dark), the light sections, and the yellow Footer alike. Inheriting
// whichever section's theme happens to be behind it would make the
// widget's own contrast unpredictable, so it carries its own
// self-contained palette (matching the brand's ink/cream/brass
// tones used elsewhere) regardless of scroll position.
//
// Visible from page load (including over the hero), unlike the old
// TCInvite widget which waited for a scroll past the first viewport —
// this bot should be reachable immediately. The panel stays mounted once opened for the first time —
// visibility toggles via opacity/scale + `inert` rather than
// mount/unmount, so open/close actually animates (see
// .chat-message-enter / panel transition classes in globals.css).

import { useCallback, useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };
type PetMood = "idle" | "wave" | "thinking" | "happy" | "dance" | "sleep";

const MAX_HISTORY_TURNS = 6;
const EMAIL = "saurabhjadhav.cse@gmail.com";
const PHONE_DISPLAY = "+91 90213 37133";
const PHONE_TEL = "+919021337133";

const TEXTAREA_MAX_HEIGHT = 96; // px, matches the max-h-24 cap below

const TOPIC_SUGGESTIONS = [
  { label: "His projects", prompt: "What are Saurabh's best projects?" },
  { label: "Work experience", prompt: "What's Saurabh's work experience?" },
  { label: "Skills & stack", prompt: "What technologies does Saurabh work with?" },
] as const;

const PET_ACTIONS = [
  { label: "Wave", mood: "wave" as const, note: "👋 Tiny wave delivered. What should we explore?" },
  { label: "Dance", mood: "dance" as const, note: "✦ One micro victory dance. Now ask me about something Saurabh built." },
  { label: "Nap", mood: "sleep" as const, note: "Shhh… I’m taking a three-second power nap. I’ll be right here." },
] as const;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nearFooter, setNearFooter] = useState(false);
  const [petMood, setPetMood] = useState<PetMood>("idle");

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const moodTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playMood = useCallback((next: PetMood, duration = 1800) => {
    if (moodTimerRef.current) clearTimeout(moodTimerRef.current);
    setPetMood(next);
    moodTimerRef.current = setTimeout(() => setPetMood("idle"), duration);
  }, []);

  useEffect(() => {
    return () => {
      if (moodTimerRef.current) clearTimeout(moodTimerRef.current);
    };
  }, []);

  // The footer has its own "Reach out" row (email/socials/resume) in
  // the same bottom-right corner this widget occupies — without this,
  // the fixed bubble sits on top of those icons and blocks clicks on
  // them. Fade the closed bubble out while the footer is in view; if
  // the panel is already open, leave it alone rather than yanking it
  // away mid-conversation.
  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setNearFooter(entry.isIntersecting),
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // Auto-scroll the message list to the newest content.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  // Auto-grow the input with its content (up to TEXTAREA_MAX_HEIGHT) so
  // the native scrollbar essentially never appears — the browser's
  // default scrollbar rendering picks up the page's dark color-scheme
  // even inside this light panel, which looked broken.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
  }, [input]);

  // Focus the input + trap Escape when the panel opens.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        bubbleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const send = useCallback(async (preset?: string) => {
    const text = (preset ?? input).trim();
    if (!text || sending) return;

    const history = messages.slice(-MAX_HISTORY_TURNS);
    setMessages((m) => [
      ...m,
      { role: "user", content: text },
      { role: "assistant", content: "" },
    ]);
    setInput("");
    setSending(true);
    setError(null);
    playMood("thinking", 60000);

    let failed = false;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (!res.ok || !res.body) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error ?? `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = { role: "assistant", content: acc };
          return next;
        });
      }
    } catch (err) {
      failed = true;
      setError(err instanceof Error ? err.message : "Something went wrong.");
      // Drop the empty assistant placeholder bubble on failure.
      setMessages((m) => m.slice(0, -1));
    } finally {
      setSending(false);
      playMood(failed ? "sleep" : "happy");
    }
  }, [input, sending, messages, playMood]);

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const runPetAction = useCallback(
    (action: (typeof PET_ACTIONS)[number]) => {
      playMood(action.mood);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: action.note },
      ]);
    },
    [playMood],
  );

  const toggleOpen = () => {
    const next = !open;
    setHasOpenedOnce(true);
    setOpen(next);
    if (next) playMood("wave");
  };

  const lastIsStreamingPlaceholder =
    sending &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant" &&
    messages[messages.length - 1].content === "";

  return (
    <div
      className={`fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 transition-opacity duration-300 sm:bottom-6 sm:right-6 ${
        nearFooter && !open ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Panel — stays mounted after first open, animates via
          scale/opacity + inert rather than mount/unmount. */}
      {hasOpenedOnce && (
        <div
          ref={panelRef}
          id="saurabh-chat-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Chat with Saurabh's assistant"
          inert={!open ? true : undefined}
          className={`flex h-[34rem] w-[calc(100vw-2rem)] max-w-[400px] origin-bottom-right flex-col overscroll-contain overflow-hidden rounded-[1.75rem] border border-[#1a1a1a]/10 bg-[#f4f1ea] text-[#1a1a1a] shadow-2xl transition-[opacity,transform] duration-300 ease-out [color-scheme:light] motion-reduce:transition-none ${
            open
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-2 scale-95 opacity-0"
          }`}
        >
          <div className="chat-pet-header flex items-center justify-between border-b border-white/10 bg-[#171713] px-4 py-3 text-[#f4f1ea]">
            <div className="pl-1">
              <div>
                <p className="flex items-center gap-1.5 font-display text-base font-medium leading-tight tracking-tight">
                  Mini Saurabh <span className="text-[#d9ad57]">·</span> portfolio sidekick
                </p>
                <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#f4f1ea]/50">
                  {petMood === "thinking" ? "thinking tiny thoughts" : "ready for a mission"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMessages([])}
              className="rounded-full border border-white/15 px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.14em] text-[#f4f1ea]/60 transition-colors hover:border-[#d9ad57]/60 hover:text-[#f4f1ea]"
            >
              Reset
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            role="log"
            aria-live="polite"
            className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4 font-sans text-sm leading-relaxed"
          >
            {messages.length === 0 && (
              <div className="chat-message-enter flex flex-col gap-4">
                <div className="chat-pet-welcome rounded-[1.4rem] border border-[#8a6526]/15 bg-[#fffdf7] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                <p className="font-display text-lg font-medium tracking-tight text-[#1a1a1a]">
                        Meet Mini Saurabh.
                      </p>
                      <p className="mt-1 max-w-[15rem] text-xs leading-relaxed text-[#1a1a1a]/60">
                        A tiny animated version of Saurabh with a few tricks up his sleeve.
                      </p>
                    </div>
                    <PetCharacter mood={petMood} size="welcome" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {PET_ACTIONS.map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        onClick={() => runPetAction(action)}
                        className="chat-action-button rounded-full border border-[#1a1a1a]/10 bg-[#f4f1ea] px-2.5 py-1.5 text-[11px] font-medium text-[#1a1a1a] transition-colors hover:border-[#8a6526]/40 hover:bg-[#8a6526]/10"
                      >
                        {action.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => send("Give me a quick tour of Saurabh's best work.")}
                      disabled={sending}
                      className="chat-action-button rounded-full border border-[#1a1a1a]/10 bg-[#1a1a1a] px-2.5 py-1.5 text-[11px] font-medium text-[#f4f1ea] transition-transform hover:-translate-y-0.5 disabled:opacity-40"
                    >
                      Find a project
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="rounded-2xl bg-[#1a1a1a]/[0.06] px-3.5 py-2.5 text-[#1a1a1a]">
                    <p className="font-medium">Hi, I&apos;m Saurabh&apos;s assistant 👋</p>
                    <p className="mt-1 text-[#1a1a1a]/70">
                      Ask me about his projects, experience, or skills — or
                      reach him directly below.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <a
                    href={`mailto:${EMAIL}`}
                    className="flex items-center gap-1.5 rounded-full border border-[#1a1a1a]/15 bg-white px-3 py-1.5 text-xs font-medium text-[#1a1a1a] transition-colors hover:border-[#8a6526]/40 hover:bg-[#8a6526]/10"
                  >
                    <MailIcon className="h-3.5 w-3.5 text-[#8a6526]" />
                    Email Saurabh
                  </a>
                  <a
                    href={`tel:${PHONE_TEL}`}
                    title={PHONE_DISPLAY}
                    className="flex items-center gap-1.5 rounded-full border border-[#1a1a1a]/15 bg-white px-3 py-1.5 text-xs font-medium text-[#1a1a1a] transition-colors hover:border-[#8a6526]/40 hover:bg-[#8a6526]/10"
                  >
                    <PhoneIcon className="h-3.5 w-3.5 text-[#8a6526]" />
                    Call Saurabh
                  </a>
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-[#1a1a1a]/40">
                    Or ask about
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {TOPIC_SUGGESTIONS.map((t) => (
                      <button
                        key={t.label}
                        type="button"
                        onClick={() => send(t.prompt)}
                        disabled={sending}
                        className="rounded-full bg-[#1a1a1a]/[0.06] px-3 py-1.5 text-xs font-medium text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a]/[0.1] disabled:opacity-40"
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {messages.map((m, i) => {
              const isStreamingThis =
                lastIsStreamingPlaceholder && i === messages.length - 1;
              return (
                <div
                  key={i}
                  className={`chat-message-enter flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {isStreamingThis ? (
                    <TypingDots />
                  ) : (
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 ${
                        m.role === "user"
                          ? "whitespace-pre-wrap bg-[#8a6526] text-[#f4f1ea]"
                          : "bg-[#1a1a1a]/[0.06] text-[#1a1a1a]"
                      }`}
                    >
                      {m.role === "assistant"
                        ? renderFormattedText(m.content)
                        : m.content}
                    </div>
                  )}
                </div>
              );
            })}
            {error && (
              <p
                role="alert"
                className="chat-message-enter rounded-xl border border-red-700/20 bg-red-700/[0.06] px-3 py-2 text-xs text-red-800"
              >
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto border-t border-[#1a1a1a]/[0.08] px-3 py-2 no-scrollbar">
            <span className="shrink-0 px-1 text-[10px] uppercase tracking-[0.14em] text-[#1a1a1a]/35">
              Actions
            </span>
            {PET_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => runPetAction(action)}
                className="chat-action-button shrink-0 rounded-full border border-[#1a1a1a]/10 bg-white px-2.5 py-1 text-[10px] font-medium text-[#1a1a1a]/75 hover:border-[#8a6526]/40 hover:text-[#1a1a1a]"
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-end gap-2 border-t border-[#1a1a1a]/10 p-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onInputKeyDown}
              rows={1}
              maxLength={1000}
              placeholder="Ask a question…"
              aria-label="Ask Saurabh's assistant"
              className="no-scrollbar max-h-24 flex-1 resize-none overflow-y-auto rounded-xl border border-[#1a1a1a]/15 bg-white px-3 py-2 font-sans text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:ring-2 focus:ring-[#8a6526]/40 focus-visible:ring-2 focus-visible:ring-[#8a6526]/60 [color-scheme:light]"
            />
            <button
              type="button"
              onClick={() => send()}
              disabled={sending || !input.trim()}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-[#f4f1ea] transition-[background-color,transform,opacity] hover:scale-105 hover:bg-[#1a1a1a]/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a6526] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f1ea] disabled:scale-100 disabled:opacity-40"
            >
              <SendIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bubble */}
      <div className="relative">
        {/* Attention pulse — stops for good once the widget has been
            opened at least once. */}
        {!hasOpenedOnce && (
          <span className="chat-pet-nudge absolute bottom-[calc(100%+0.65rem)] right-0 whitespace-nowrap rounded-full border border-[#1a1a1a]/10 bg-[#fffdf7] px-3 py-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.13em] text-[#1a1a1a]/70 shadow-lg">
            Ask Mini Saurabh anything
          </span>
        )}
        <button
          type="button"
          aria-label={open ? "Close chat" : "Chat with Saurabh's assistant"}
          aria-expanded={open}
          ref={bubbleRef}
          aria-controls="saurabh-chat-panel"
          className="chat-bubble-button relative flex h-16 w-16 items-center justify-center text-[#1a1a1a] transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a6526] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={toggleOpen}
        >
          <span
            className={`absolute transition-[opacity,transform] duration-200 ${open ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
          >
            <PetCharacter mood={petMood} size="bubble" />
          </span>
          <span
            className={`absolute transition-[opacity,transform] duration-200 ${open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}
          >
            <CloseIcon className="h-4 w-4" />
          </span>
        </button>
      </div>
    </div>
  );
}

// Renders the assistant's limited markdown subset (see the FORMATTING
// guardrail in lib/chat/knowledge-base.ts): "- " lines become a real
// list, **bold** becomes <strong>, blank-line-separated blocks become
// paragraphs. Anything else is shown as plain text — no arbitrary
// HTML is ever parsed from the model's output.
function renderFormattedText(content: string) {
  const blocks = content.split(/\n{2,}/).filter((b) => b.trim() !== "");

  return blocks.map((block, bi) => {
    const lines = block.split("\n").filter((l) => l.trim() !== "");
    const isList = lines.length > 0 && lines.every((l) => /^\s*-\s+/.test(l));

    if (isList) {
      return (
        <ul key={bi} className={`list-disc space-y-1 pl-4 ${bi > 0 ? "mt-2" : ""}`}>
          {lines.map((line, li) => (
            <li key={li}>{renderInlineBold(line.replace(/^\s*-\s+/, ""))}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={bi} className={`whitespace-pre-line ${bi > 0 ? "mt-2" : ""}`}>
        {renderInlineBold(block)}
      </p>
    );
  });
}

function renderInlineBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function TypingDots() {
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label="Assistant is typing"
      className="flex items-center gap-1 rounded-2xl bg-[#1a1a1a]/[0.06] px-4 py-3"
    >
      <span className="chat-typing-dot h-1.5 w-1.5 rounded-full bg-[#1a1a1a]/50 [animation-delay:0ms]" />
      <span className="chat-typing-dot h-1.5 w-1.5 rounded-full bg-[#1a1a1a]/50 [animation-delay:150ms]" />
      <span className="chat-typing-dot h-1.5 w-1.5 rounded-full bg-[#1a1a1a]/50 [animation-delay:300ms]" />
    </span>
  );
}

type PetSize = "tiny" | "mini" | "welcome" | "bubble";

function PetCharacter({ mood, size }: { mood: PetMood; size: PetSize }) {
  const [hovered, setHovered] = useState(false);
  const animated = hovered || mood === "wave" || mood === "dance";

  return (
    <span
      className={`chat-pet chat-pet--${size} chat-pet--${mood}`}
      aria-hidden="true"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {/* Animated GIFs must stay as native images so the browser preserves playback. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="chat-pet__image"
        src={animated ? "/assets/mini-saurabh-4k.gif" : "/assets/mini-saurabh-4k-still.png"}
        alt=""
        draggable={false}
      />
    </span>
  );
}

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.909a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  );
}

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 0 0-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </svg>
  );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
      {...props}
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7z" />
    </svg>
  );
}
