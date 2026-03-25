// src/components/PreviewPane.jsx
import { useState, useRef } from 'react';
import ATSScore from './ATSScore.jsx';

const COLOR_PRESETS = [
  { hex: '#2D6BE4', label: 'Blue'    },
  { hex: '#1D9E75', label: 'Teal'    },
  { hex: '#D85A30', label: 'Coral'   },
  { hex: '#7F77DD', label: 'Purple'  },
  { hex: '#BA7517', label: 'Amber'   },
  { hex: '#16A34A', label: 'Green'   },
  { hex: '#E8593C', label: 'Orange'  },
  { hex: '#222222', label: 'Slate'   },
];

/**
 * Props:
 *   templates       array  { id, name }
 *   activeTemplate  string
 *   onTemplateChange (id) => void
 *   accentColor     string  hex
 *   onColorChange   (hex) => void
 *   pageCount       number
 *   maxPages        number
 *   isMobileVisible boolean
 *   onMobileClose   () => void
 *   children        ReactNode  — the rendered A4 resume component
 *   colorPresets    array  { hex, label }[]  (optional override)
 */
export default function PreviewPane({
  templates = [],
  activeTemplate,
  onTemplateChange,
  accentColor,
  onColorChange,
  pageCount = 1,
  maxPages = 2,
  isMobileVisible = false,
  onMobileClose,
  children,
  colorPresets = COLOR_PRESETS,
  resumeData = {},
  enabledSections = new Set(),
}) {
  const [zoom, setZoom] = useState(75);
  const [activeTab, setActiveTab] = useState('preview');

  const previewScrollRef = useRef(null);

  const changeZoom = (delta) => {
    setZoom(z => Math.max(40, Math.min(150, z + delta)));
  };

  const resetZoom = () => setZoom(75);

  const pageWarning  = pageCount > maxPages;
  const pageExact    = pageCount === maxPages;
  const counterClass = pageWarning ? 'page-counter over' : pageExact ? 'page-counter warn' : 'page-counter';
  const counterMsg   = pageWarning
    ? `⚠ ${pageCount} pages — exceeds ${maxPages}-page limit`
    : pageExact
    ? `${pageCount} of ${maxPages} pages — at limit`
    : `Page ${pageCount} of ${maxPages}`;

  return (
    <div className={`preview-pane${isMobileVisible ? ' mobile-visible' : ''}`} role="region" aria-label="Resume preview">

      {/* Template chip rail */}
      <div className="tpl-rail" role="tablist" aria-label="Template selector">
        {templates.map(tpl => (
          <button
            key={tpl.id}
            className={`tpl-chip${activeTemplate === tpl.id ? ' active' : ''}`}
            onClick={() => onTemplateChange(tpl.id)}
            role="tab"
            aria-selected={activeTemplate === tpl.id}
            aria-label={`${tpl.name} template`}
          >
            {tpl.name}
          </button>
        ))}
      </div>

      {/* Color rail */}
      <div className="color-rail" role="group" aria-label="Accent color picker">
        <span className="color-label">Accent</span>
        {colorPresets.map(({ hex, label }) => (
          <button
            key={hex}
            className={`color-dot${accentColor === hex ? ' active' : ''}`}
            style={{ background: hex }}
            onClick={() => onColorChange(hex)}
            aria-label={`${label} accent color${accentColor === hex ? ' (selected)' : ''}`}
            title={label}
          />
        ))}
      </div>

      {/* Toolbar: tabs + zoom */}
      <div className="preview-toolbar no-print">
        <div className="preview-tabs" role="tablist">
          <button
            className={`preview-tab${activeTab === 'preview' ? ' active' : ''}`}
            onClick={() => setActiveTab('preview')}
            role="tab" aria-selected={activeTab === 'preview'}
          >
            Live preview
          </button>
          <button
            className={`preview-tab${activeTab === 'ats' ? ' active' : ''}`}
            onClick={() => setActiveTab('ats')}
            role="tab" aria-selected={activeTab === 'ats'}
          >
            ATS check
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Mobile close */}
          {isMobileVisible && (
            <button className="btn btn-ghost btn-sm no-print" onClick={onMobileClose}>
              ✕ Close
            </button>
          )}
          {/* Zoom */}
          <div className="zoom-controls no-print" aria-label="Zoom controls">
            <button className="zoom-btn" onClick={() => changeZoom(-10)} aria-label="Zoom out">−</button>
            <span
              className="zoom-val"
              title="Double-click to reset"
              onDoubleClick={resetZoom}
              style={{ cursor: 'pointer' }}
              aria-live="polite"
            >{zoom}%</span>
            <button className="zoom-btn" onClick={() => changeZoom(10)} aria-label="Zoom in">+</button>
          </div>
        </div>
      </div>

      {/* Preview area — screen view (zoomed) */}
      <div className="preview-scroll no-print" ref={previewScrollRef}>
        {activeTab === 'preview' ? (
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease',
              // Reserve space so scroll area doesn't collapse when scaled down
              marginBottom: `${(zoom / 100 - 1) * -100}%`,
            }}
            className="resume-a4-wrapper"
          >
            {children}
          </div>
        ) : (
          <ATSScore data={resumeData} sections={enabledSections} />
        )}
      </div>

      {/* Print-only view — no zoom transform, renders directly to paper */}
      <div className="print-only-resume">
        {children}
      </div>

      {/* Page counter */}
      <div className={counterClass} role="status" aria-live="polite">
        {counterMsg}
      </div>
    </div>
  );
}

/* ── ATS placeholder panel ─────────────────────────────────── */
