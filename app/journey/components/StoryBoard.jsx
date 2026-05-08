'use client';

import { Html } from '@react-three/drei';

// Per-scene story board overlay. Drei's <Html> portals real DOM
// nodes into the Canvas, anchored to a world-space position. We
// render in screen-space (no `transform` prop) so the text always
// faces the camera and stays at a constant readable size — and
// `pointerEvents="none"` lets the user scroll through the board
// without it intercepting wheel events.
//
// Anchored to (0, 0, 12), which is the centre of the bottom-card
// foreground zone — section C — i.e. the lower part of the frame
// below the train.

export default function StoryBoard({ title, body }) {
  if (!title && !body) return null;

  return (
    <Html
      position={[0, 0, 18]}
      center
      pointerEvents="none"
      zIndexRange={[10, 0]}
      style={{
        width: '720px',
        maxWidth: '85vw',
        padding: '22px 36px',
        background: 'rgba(255, 248, 240, 0.92)',
        border: '1px solid rgba(212, 196, 168, 0.85)',
        borderRadius: '4px',
        boxShadow: '0 4px 16px rgba(42, 36, 28, 0.18)',
        textAlign: 'center',
        fontFamily: 'monospace',
        color: '#2a241c',
        userSelect: 'none',
      }}
    >
      {title && (
        <h2
          style={{
            margin: 0,
            fontSize: '13px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          {title}
        </h2>
      )}
      {body && (
        <p
          style={{
            marginTop: title ? '14px' : 0,
            marginBottom: 0,
            fontSize: '13px',
            lineHeight: 1.65,
            letterSpacing: '0.01em',
          }}
        >
          {body}
        </p>
      )}
    </Html>
  );
}
