'use client';

import { useEffect, useRef, useState } from 'react';

// Tracks continuous scroll progress in viewport units.
// 0 = top of page, 1 = end of station 0, 2 = end of station 1, etc.
// Used by every component that needs to react to scroll position.
//
// Scroll events on modern devices can fire 100+ times per second
// (high-DPI mice, touchpads). Calling setState on every event would
// thrash React's render queue, drop frames, and make the train
// motion stutter during scroll. We coalesce all scroll events
// inside a frame into a single state update via requestAnimationFrame,
// so the consumer tree re-renders at most once per paint.
export default function useScrollProgress() {
  const [t, setT] = useState(0);
  const rafIdRef = useRef(null);

  useEffect(() => {
    const update = () => {
      setT(window.scrollY / window.innerHeight);
      rafIdRef.current = null;
    };

    const onScroll = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return t;
}
