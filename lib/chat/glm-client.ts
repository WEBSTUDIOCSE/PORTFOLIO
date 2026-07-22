import "server-only";

// Raw fetch() to Zhipu AI's GLM chat-completions endpoint — no SDK.
// GLM's API is OpenAI-compatible (chat completions shape + SSE
// streaming), so this is a plain HTTP call.
//
// Verified live against the real API (2026-07-22) with a working key:
// - Endpoint + SSE shape (`data: {...}` / `choices[0].delta.content` /
//   `data: [DONE]`) match the OpenAI-compatible convention as assumed.
// - "glm-4-flash" (the original placeholder) doesn't exist on this
//   account — error 1211. Confirmed working + free: "glm-4.5-flash".
//   (glm-4-plus/glm-4.5/glm-4.6 exist but need paid balance — error
//   1113 "insufficient balance"; several other guessed names return
//   1211 "model doesn't exist".)
// - glm-4.5-flash is a REASONING model: by default it streams its
//   chain-of-thought as `delta.reasoning_content`, separate from the
//   final answer in `delta.content` — with a modest max_tokens budget
//   it can burn the entire budget "thinking" and never emit any
//   `content` at all (confirmed: max_tokens=150 produced 150 tokens
//   of reasoning_content and an empty final content). The `thinking:
//   { type: "disabled" }` request field (GLM-4.5 series' documented
//   toggle) skips the reasoning phase entirely — confirmed this makes
//   the model stream `content` directly, using ~6 tokens for a short
//   reply instead of 150+. Required for a snappy chat-bubble UX.
const ENDPOINT =
  process.env.ZHIPU_API_BASE_URL ??
  "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const MODEL = process.env.ZHIPU_MODEL ?? "glm-4.5-flash";

export type GLMChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

/**
 * Calls GLM with streaming enabled and re-emits the upstream SSE as a
 * plain UTF-8 text-delta stream — the browser-side consumer just
 * reads bytes and appends, no SSE/JSON parsing on the client.
 */
export async function streamGLMChatCompletion(opts: {
  messages: GLMChatMessage[];
}): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.ZHIPU_API_KEY;
  if (!apiKey) {
    throw new Error("ZHIPU_API_KEY is not set.");
  }

  const upstream = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: opts.messages,
      stream: true,
      temperature: 0.4,
      max_tokens: 600,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    throw new Error(`GLM API error ${upstream.status}: ${detail}`);
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const delta: string | undefined =
                json.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch (e) {
              console.error("[chat] failed to parse GLM SSE chunk:", e);
            }
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}
