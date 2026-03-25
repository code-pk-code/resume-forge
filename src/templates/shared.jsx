// src/templates/shared.jsx
// ─────────────────────────────────────────────────────────────
// Shared constants, helpers and tiny components used by every
// template. Changing this file affects ALL templates — keep it
// to truly common primitives only.
// ─────────────────────────────────────────────────────────────

export const A4_W = 794;   // 210mm @ 96 dpi
export const A4_H = 1123;  // 297mm @ 96 dpi
export const A4_PAD_V = 52;  // top / bottom margin ≈ 13.7mm
export const A4_PAD_H = 60;  // left / right margin ≈ 15.9mm

export const BASE_STYLE = {
  width: A4_W,
  minHeight: A4_H,
  background: '#ffffff',
  color: '#1a1a1a',
  position: 'relative',
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: 12,
  lineHeight: 1.5,
  boxSizing: 'border-box',
  colorScheme: 'light',
  boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
  borderRadius: 3,
};

/** Check if a section is active in the enabled-sections Set. */
export function secActive(sec, key) {
  return sec instanceof Set ? sec.has(key) : true;
}

/** Bullet list — plain divs, no browser list markers. */
export function BulletList({ items, color }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginTop: 3 }}>
      {items.filter(Boolean).map((b, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 2, alignItems: 'flex-start' }}>
          <span style={{ color, fontWeight: 700, fontSize: 9.5, lineHeight: '16px', flexShrink: 0 }}>▸</span>
          <span style={{ fontSize: 10, color: '#333', lineHeight: 1.5 }}>{b}</span>
        </div>
      ))}
    </div>
  );
}
