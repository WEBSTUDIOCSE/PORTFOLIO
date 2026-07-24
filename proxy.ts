import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const isDev = process.env.NODE_ENV !== "production";

  // CSP policy — strict nonce-based script-src
  const csp = [
    `default-src 'self'`,
    // Dev has no `strict-dynamic`, so externally-hosted scripts (GTM,
    // Speed Insights' va.vercel-scripts.com fallback) need an explicit
    // host entry here or they're silently blocked in local dev only —
    // prod's `strict-dynamic` propagates trust to anything a nonce'd
    // script loads, regardless of its own host, so no entry is needed there.
    isDev
      ? `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com`
      : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval' 'wasm-unsafe-eval'`,
    `worker-src 'self' blob: https://www.gstatic.com`,
    `style-src 'self' 'unsafe-inline'`, // Tailwind injects styles
    `img-src 'self' data: blob: https:`,
    `font-src 'self' https://fonts.gstatic.com`,
    // Speed Insights' beacon is same-origin (/_vercel/speed-insights/*)
    // when deployed on Vercel, but its script has a cross-origin
    // fallback host (va.vercel-scripts.com) — allow it explicitly
    // rather than relying on `strict-dynamic` propagation for the
    // connect-src half, since a silently-CSP-blocked beacon fails
    // exactly the way the package's own docs warn about ("no data
    // after 30s, check for content blockers") with zero error surfaced
    // to us.
    // https://www.google-analytics.com and https://www.google.com are
    // GA4's actual event-beacon endpoints (gtag.js POSTs /g/collect
    // there) — found missing while checking the Speed Insights CSP
    // change: Firebase Analytics' script loaded fine but every event
    // beacon was being silently dropped by connect-src, so GA4 was
    // recording effectively nothing in production.
    `connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://firestore.googleapis.com https://www.gstatic.com https://www.google-analytics.com https://www.google.com https://va.vercel-scripts.com https://vitals.vercel-insights.com`,
    // Vercel's own deployment toolbar (comments/feedback overlay,
    // injected automatically on Vercel-hosted deployments) opens
    // vercel.live in an iframe. Without this, `default-src 'self'`
    // blocks the frame and logs a CSP violation on every page load —
    // that console error is what was failing Lighthouse's
    // errors-in-console / inspector-issues best-practices audits.
    `frame-src https://vercel.live`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // OWASP-recommended headers
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // Pass nonce to Server Components via header
  response.headers.set("x-nonce", nonce);

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static assets and _next internals
    "/((?!_next/static|_next/image|favicon.ico|assets/).*)",
  ],
};
