import JourneyClient from './JourneyClient.jsx';

// Description updated 2026-07-23 alongside the temporary diorama ->
// video-reel simplification (see JourneyClient.jsx) — the old copy
// described a "Konkan Railway diorama" that isn't what's live right
// now. Revert this alongside the diorama if/when it comes back.
export const metadata = {
  title: 'Saurabh Jadhav — Journey',
  description: 'A short film through my story — from curiosity to code.',
  openGraph: {
    title: 'Saurabh Jadhav — Journey',
    description: 'A short film through my story — from curiosity to code.',
    url: 'https://saurabhjadhav.in/journey',
    siteName: 'Saurabh Jadhav',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saurabh Jadhav — Journey',
    description: 'A short film through my story — from curiosity to code.',
  },
  alternates: {
    canonical: 'https://saurabhjadhav.in/journey',
  },
};

export default function JourneyPage() {
  return <JourneyClient />;
}
