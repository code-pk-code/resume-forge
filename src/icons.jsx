// src/icons.jsx
// All SVG icons used in the redesigned UI.
// Each is a simple functional component accepting optional size/className/style props.

export function IcoUser({ size = 14, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...p}>
      <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2 14c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

export function IcoBriefcase({ size = 14, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...p}>
      <rect x="2" y="6" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M5.5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M2 9.5h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

export function IcoGradCap({ size = 14, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...p}>
      <path d="M8 2L15 6 8 10 1 6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M4 8v4a4 4 0 008 0V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M15 6v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

export function IcoStar({ size = 14, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...p}>
      <path d="M8 2l1.5 3.5 3.8.5-2.7 2.6.6 3.8L8 10.5l-3.2 1.9.6-3.8L2.7 6l3.8-.5z"
        stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  );
}

export function IcoCode({ size = 14, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...p}>
      <path d="M5.5 5L2 8l3.5 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.5 5L14 8l-3.5 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 3l-2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

export function IcoCert({ size = 14, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...p}>
      <circle cx="8" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M5.5 10L4 15l4-2 4 2-1.5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IcoLang({ size = 14, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...p}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M8 2c-2 2.5-2 9.5 0 12M8 2c2 2.5 2 9.5 0 12M2 8h12" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  );
}

export function IcoHeart({ size = 14, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...p}>
      <path d="M8 13S2.5 9.5 2.5 6a3 3 0 015.5-1.5A3 3 0 0113.5 6C13.5 9.5 8 13 8 13z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  );
}

export function IcoFlag({ size = 14, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...p}>
      <path d="M3 2v12M3 3h9l-2.5 3.5L12 10H3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IcoText({ size = 14, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...p}>
      <path d="M2 4h12M2 7.5h9M2 11h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

export function IcoPlus({ size = 14, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...p}>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IcoTrash({ size = 14, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...p}>
      <path d="M3 4.5h10M6 4.5V3h4v1.5M5 4.5l.5 8h5l.5-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IcoChevron({ size = 14, dir = 'down', ...p }) {
  const r = { down: 0, up: 180, right: -90, left: 90 }[dir] ?? 0;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
      style={{ transform: `rotate(${r}deg)`, transition: 'transform 0.2s', ...(p.style || {}) }} {...p}>
      <path d="M4.5 6.5L8 10l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IcoSparkle({ size = 13, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...p}>
      <path d="M8 1v3M8 12v3M1 8h3M12 8h3M3.2 3.2l2.1 2.1M10.7 10.7l2.1 2.1M3.2 12.8l2.1-2.1M10.7 5.3l2.1-2.1"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

export function IcoSun({ size = 15, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...p}>
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3 3l1.1 1.1M11.9 11.9L13 13M3 13l1.1-1.1M11.9 4.1L13 3"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

export function IcoMoon({ size = 15, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...p}>
      <path d="M13.5 10A6 6 0 016 2.5a6 6 0 100 11 6 6 0 007.5-3.5z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  );
}

export function IcoDownload({ size = 14, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...p}>
      <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IcoEye({ size = 14, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...p}>
      <path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z"
        stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  );
}

export function IcoEdit({ size = 13, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...p}>
      <path d="M10.5 2.5l3 3-8 8H2.5v-3l8-8z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  );
}

export function IcoGrip({ size = 13, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...p}>
      <circle cx="5.5" cy="5" r="1" fill="currentColor"/>
      <circle cx="10.5" cy="5" r="1" fill="currentColor"/>
      <circle cx="5.5" cy="8" r="1" fill="currentColor"/>
      <circle cx="10.5" cy="8" r="1" fill="currentColor"/>
      <circle cx="5.5" cy="11" r="1" fill="currentColor"/>
      <circle cx="10.5" cy="11" r="1" fill="currentColor"/>
    </svg>
  );
}
