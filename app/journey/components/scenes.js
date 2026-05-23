// Saurabh Express stations. Each entry is one stop on the journey.
// One viewport of vertical scroll = one station. The train glides
// L→R within each viewport and the active station drives the top
// hoarding panel + the bottom route-map medallion highlight.
//
// Per-station fields:
//   id      — short slug (also React key)
//   stop    — display number (00..N), shown on the medallion
//   p       — normalised position 0..1 along the route (drives medallion left%)
//   name    — English station name
//   deva    — Devanagari station name
//   km      — milepost as a string (e.g. '000', '942')
//   plat    — platform string (e.g. 'PF 1')
//   panel   — { type, ...content } feeding the matching panel component

export const STATIONS = [
  {
    // 00 — The pre-departure platform.
    id: 'platform',
    stop: 0,
    p: 0.0,
    name: 'The Platform',
    deva: 'प्लॅटफॉर्म',
    km: '000',
    plat: 'PF 0',
    departure: '05:30',
    bgImage: '/assets/platform_bg.jpg',
    panel: {
      type: 'intro',
      lede:
        'A platform somewhere along the Konkan line. Distant horn, mist on the rails, the Sahyadri ridges in soft pre-dawn blue. The 06:00 to Mumbai Central is pulling in. Stand still — when you scroll, you board.',
      meta: 'Pre-departure · 05:30 AM IST',
    },
  },
  {
    id: 'story',
    stop: 1,
    p: 0.25,
    name: 'The Story',
    deva: 'कथा',
    km: '235',
    plat: 'PF 1',
    departure: '06:00',
    bgImage: '/assets/story_bg.jpg',
    panel: {
      type: 'intro',
      lede:
        'Saurabh Jadhav. Product engineer based in Mumbai. I build software end-to-end — design, code, ship — for products people actually use. Welcome aboard.',
      meta: 'Mumbai · India · Boarding since 1998',
    },
  },
  {
    id: 'skills',
    stop: 2,
    p: 0.5,
    name: 'Skills',
    deva: 'कौशल्ये',
    km: '471',
    plat: 'PF 2',
    departure: '09:12',
    // No bgImage — Skills has a dedicated full-overlay component
    // (SkillsStation.jsx) with its own dotted-grid backdrop.
    panel: {
      type: 'skills',
      items: [
        { icon: '⚛', name: 'React', note: 'Years of production work' },
        { icon: 'TS', name: 'TypeScript', note: 'Strict mode, always' },
        { icon: '◆', name: 'Next.js', note: 'App router, RSC' },
        { icon: '⬢', name: 'Node.js', note: 'APIs, scripts, CLI tools' },
        { icon: '⚙', name: 'Postgres', note: 'Schema, perf, migrations' },
        { icon: '☁', name: 'Cloudflare', note: 'Workers, R2, KV' },
        { icon: '✦', name: 'Three.js', note: 'r3f — this site' },
        { icon: '★', name: 'Tailwind', note: 'v4 with design tokens' },
      ],
    },
  },
  {
    id: 'projects',
    stop: 3,
    p: 0.75,
    name: 'Projects',
    deva: 'कार्य',
    km: '706',
    plat: 'PF 3',
    departure: '11:24',
    // No bgImage — Projects is a content stop with a dedicated overlay
    // (ProjectsStation.jsx) on the dotted-grid backdrop, like Skills.
    panel: {
      type: 'projects',
      cards: [
        {
          num: 'P-001',
          title: 'SaaS product 0→10k MAU',
          meta: 'Founding engineer · 2018–20',
          stack: ['React', 'Node', 'Postgres'],
        },
        {
          num: 'P-002',
          title: 'Mobile app for kirana stores',
          meta: 'Lead · 2020',
          stack: ['React Native', 'Firebase'],
        },
        {
          num: 'P-003',
          title: 'Realtime collab editor',
          meta: 'Tech lead · 2022',
          stack: ['CRDT', 'WebSocket', 'Yjs'],
        },
        {
          num: 'P-004',
          title: 'Edge ML inference',
          meta: 'Architect · 2023',
          stack: ['Cloudflare Workers', 'ONNX'],
        },
        {
          num: 'P-005',
          title: 'rail-svg toolkit',
          meta: 'Open-source · maintainer',
          stack: ['SVG', 'TypeScript'],
        },
        {
          num: 'P-006',
          title: 'Konkan diorama (this site)',
          meta: 'Personal · 2025',
          stack: ['Next.js', 'react-three-fiber'],
        },
      ],
    },
  },
  {
    id: 'contact',
    stop: 4,
    p: 1.0,
    name: 'Contact',
    deva: 'संपर्क',
    km: '942',
    plat: 'PF 4',
    departure: '13:50',
    // No bgImage — Contact has a dedicated full-overlay component
    // (ContactStation.jsx) that supplies its own banner backdrop +
    // headline + contact actions. Avoids double-stacking bg layers.
    panel: {
      type: 'terminus',
      heading: 'Now boarding the next route.',
      body:
        'Available for senior product-engineer roles, technical co-founding, and design-engineering work. Mumbai or remote.',
      links: [
        { label: 'Email', href: 'mailto:saurabhjadhav.webstudio@gmail.com' },
        { label: 'Resume PDF', href: '#' },
        { label: 'GitHub', href: '#' },
        { label: 'LinkedIn', href: '#' },
      ],
    },
  },
];

// Total route length for the route-map readout ("000 / 942 KM").
export const TOTAL_KM = 942;

// Train motion in world X. The train glides from X_START → X_END as
// the user scrolls from the top to the bottom of the runway.
//   X_START = -23: at scroll=0 the COACH (back of train) is half off
//                  the left edge of the visible frame.
//   X_END   = +18: at end-of-scroll the train is at the right edge.
export const TRAIN_X_START = -23;
export const TRAIN_X_END   = +18;
