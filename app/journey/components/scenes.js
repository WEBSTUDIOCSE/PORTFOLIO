// Saurabh Express stations. Each entry is one stop on the journey.
// One viewport of vertical scroll = one station. The train glides
// L→R within each viewport and the active station drives the top
// hoarding panel + the bottom route-map medallion highlight.
//
// Per-station fields:
//   id      — short slug (also React key)
//   stop    — display number (1..N)
//   p       — normalised position 0..1 along the route (drives medallion left%)
//   name    — English station name
//   deva    — Devanagari station name
//   km      — milepost as a string (e.g. '000', '942')
//   plat    — platform string (e.g. 'PF 1')
//   panel   — { type, ...content } feeding the matching panel component

export const STATIONS = [
  {
    id: 'origin',
    stop: 1,
    p: 0.0,
    name: 'Origin',
    deva: 'मूळ',
    km: '000',
    plat: 'PF 1',
    departure: '06:00',
    panel: {
      type: 'intro',
      lede:
        'Saurabh Jadhav. Product engineer based in Mumbai. I build software end-to-end — design, code, ship — for products people actually use. Welcome aboard.',
      meta: 'Mumbai · India · Boarding since 1998',
    },
  },
  {
    id: 'journey',
    stop: 2,
    p: 0.25,
    name: 'Journey',
    deva: 'प्रवास',
    km: '164',
    plat: 'PF 2',
    departure: '07:38',
    panel: {
      type: 'journey',
      cards: [
        {
          year: '2014–17',
          role: 'Frontend Engineer',
          org: 'Mumbai agency',
          notes: ['Shipped first commercial site', 'Learnt to estimate'],
        },
        {
          year: '2018–20',
          role: 'Full-stack Engineer',
          org: 'Product start-up',
          notes: ['0→10k MAU', 'Wore every hat'],
        },
        {
          year: '2021–23',
          role: 'Lead Engineer',
          org: 'SaaS team',
          notes: ['Hired & mentored 4', 'Shipped v2 platform'],
        },
        {
          year: '2024 →',
          role: 'Senior Product Engineer',
          org: 'Available',
          notes: ['Looking for senior role', 'Or co-founding'],
        },
      ],
    },
  },
  {
    id: 'offduty',
    stop: 3,
    p: 0.5,
    name: 'Off-Duty',
    deva: 'विश्रांती',
    km: '412',
    plat: 'PF 3',
    departure: '09:12',
    panel: {
      type: 'hobbies',
      items: [
        { icon: '✦', name: 'Cycling', note: 'Konkan coastal rides' },
        { icon: '★', name: 'Photography', note: '35mm film, mostly trains' },
        { icon: '◈', name: 'Reading', note: 'Mostly non-fiction' },
        { icon: '✺', name: 'Cooking', note: 'Maharashtrian + experiments' },
        { icon: '◆', name: 'Music', note: 'Hindustani classical, lo-fi' },
        { icon: '✧', name: 'Sketching', note: 'Architecture, faces' },
        { icon: '❋', name: 'Trekking', note: 'Sahyadri hills' },
        { icon: '◉', name: 'Open source', note: 'Small tools, occasional PRs' },
      ],
    },
  },
  {
    id: 'projects',
    stop: 4,
    p: 0.75,
    name: 'Projects',
    deva: 'कार्य',
    km: '720',
    plat: 'PF 4',
    departure: '11:24',
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
    stop: 5,
    p: 1.0,
    name: 'Contact',
    deva: 'संपर्क',
    km: '942',
    plat: 'PF 18',
    departure: '13:50',
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
