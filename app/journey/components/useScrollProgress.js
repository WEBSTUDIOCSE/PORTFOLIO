'use client';

import { useEffect, useState } from 'react';

// Tracks continuous scroll progress in viewport units.
// 0 = top of page, 1 = end of station 0, 2 = end of station 1, etc.
// Used by both the in-Canvas Diorama and the out-of-Canvas Timeline
// + StoryBoard so they stay in sync from a single scroll signal.
export default function useScrollProgress() {
  const [t, setT] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setT(window.scrollY / window.innerHeight);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return t;
}
