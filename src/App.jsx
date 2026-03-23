// src/App.jsx
// ═══════════════════════════════════════════════════════════════
//  ResumeForge  ·  Redesigned App shell
//
//  This file replaces the original App.jsx.
//  ▸ All 9 template components (TplNova … TplTimeline) are kept
//    exactly as-is - find them below the "TEMPLATES" comment.
//  ▸ The capacity system, config, and data model are unchanged.
//  ▸ New: dark/light theme, responsive layout, sidebar nav,
//    collapsible form cards, mobile bottom tabs, zoom control.
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import './index.css';

// New UI components
import Topbar      from './components/Topbar.jsx';
import Sidebar     from './components/Sidebar.jsx';
import FormPane    from './components/FormPane.jsx';
import PreviewPane from './components/PreviewPane.jsx';
import MobileNav   from './components/MobileNav.jsx';
import { useTheme } from './useTheme.js';

/* ══════════════════════════════════════════════════════════════
   CONFIG  - reads Vite env vars with the same defaults as
   config/app.config.js so this file needs no external import.
   All VITE_* vars still work via your .env.local / hosting dashboard.
══════════════════════════════════════════════════════════════ */
const e = import.meta.env;

const CFG = {
  APP: {
    name:         e.VITE_APP_NAME     || 'ResumeForge',
    tagline:      e.VITE_APP_TAGLINE  || 'Free · A4 · No ads',
    siteUrl:      e.VITE_SITE_URL     || 'https://resumeforge.vercel.app',
    supportEmail: e.VITE_SUPPORT_EMAIL || '',
    githubUrl:    e.VITE_GITHUB_URL    || '',
  },
  CAPACITY: {
    maxWorkers:  Number(e.VITE_MAX_WORKERS  || 10000),
    slotTtlMs:   Number(e.VITE_SLOT_TTL_MS || 55000),
    heartbeatMs: Number(e.VITE_HEARTBEAT_MS || 20000),
    storageKey:  e.VITE_SLOT_KEY || 'rf_slots_v4',
  },
  RESUME: {
    pageWidthPx:  Number(e.VITE_PAGE_WIDTH  || 794),
    pageHeightPx: Number(e.VITE_PAGE_HEIGHT || 1123),
    maxPages:     Number(e.VITE_MAX_PAGES   || 2),
    fontsUrl:     e.VITE_FONTS_URL !== undefined
      ? e.VITE_FONTS_URL
      : 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  },
  FEATURES: {
    showCapacityBadge:  e.VITE_SHOW_CAPACITY_BADGE  !== 'false',
    showColorPicker:    e.VITE_SHOW_COLOR_PICKER     !== 'false',
    showTemplatePicker: e.VITE_SHOW_TEMPLATE_PICKER  !== 'false',
    showSectionToggles: e.VITE_SHOW_SECTION_TOGGLES  !== 'false',
    enableInterests:    e.VITE_ENABLE_INTERESTS       !== 'false',
    enableVolunteer:    e.VITE_ENABLE_VOLUNTEER       !== 'false',
    enableSkillBars:    e.VITE_ENABLE_SKILL_BARS      !== 'false',
  },
  DEFAULTS: {
    template:     e.VITE_DEFAULT_TEMPLATE || 'nova',
    accentColor:  e.VITE_DEFAULT_ACCENT   || '#2D6BE4',
    sections: (e.VITE_DEFAULT_SECTIONS || 'summary,experience,education,skills,projects').split(',').map(s => s.trim()),
  },
};

/* ══════════════════════════════════════════════════════════════
   CAPACITY SYSTEM  (unchanged from original)
══════════════════════════════════════════════════════════════ */
const SLOT_KEY = CFG.CAPACITY.storageKey;
const MAX_W    = CFG.CAPACITY.maxWorkers;
const SLOT_TTL = CFG.CAPACITY.slotTtlMs;
const HB_MS    = CFG.CAPACITY.heartbeatMs;

function uuid() {
  return crypto.randomUUID ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function readSlots() {
  try { return JSON.parse(localStorage.getItem(SLOT_KEY) || '{}'); } catch { return {}; }
}
function writeSlots(s) {
  try { localStorage.setItem(SLOT_KEY, JSON.stringify(s)); } catch {}
}
function pruneSlots(s) {
  const now = Date.now();
  return Object.fromEntries(Object.entries(s).filter(([, t]) => now - t < SLOT_TTL));
}

function claimSlot(id) {
  const s = pruneSlots(readSlots());
  const live = Object.keys(s).length;
  if (!s[id] && live >= MAX_W) return false;
  s[id] = Date.now();
  writeSlots(s);
  return true;
}
function releaseSlot(id) {
  const s = readSlots();
  delete s[id];
  writeSlots(s);
}
function refreshSlot(id) {
  const s = readSlots();
  if (s[id]) { s[id] = Date.now(); writeSlots(s); }
}
function liveCount() {
  return Object.keys(pruneSlots(readSlots())).length;
}

/* ══════════════════════════════════════════════════════════════
   TEMPLATES  (all 9 preserved verbatim - edit as before)
   Each accepts { d, sec, accent }
══════════════════════════════════════════════════════════════ */

const A4_W = CFG.RESUME.pageWidthPx  || 794;
const A4_H = CFG.RESUME.pageHeightPx || 1123;

/* ── A4 dimensions ─────────────────────────────────────── */
// 794px = 210mm at 96 dpi (browser default)
// Templates use px internally; print CSS converts to mm via @page

const BASE_STYLE = {
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
  // Shadow only visible in preview, stripped by print CSS
  boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
  borderRadius: 3,
};

// ── Shared helpers ───────────────────────────────────────
function secActive(sec, key) { return sec instanceof Set ? sec.has(key) : true; }

// Plain-div bullet list — avoids browser default list markers
function BulletList({ items, color }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginTop: 4 }}>
      {items.filter(Boolean).map((b, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 2, alignItems: 'flex-start' }}>
          <span style={{ color, fontWeight: 700, fontSize: 10, lineHeight: '16px', flexShrink: 0 }}>{'>'}</span>
          <span style={{ fontSize: 10, color: '#333', lineHeight: 1.5 }}>{b}</span>
        </div>
      ))}
    </div>
  );
}

function Heading({ label, color }) {
  return (
    <div style={{ marginBottom: 6, marginTop: 2 }}>
      <div style={{
        fontSize: 9, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.12em',
        color, marginBottom: 3,
      }}>{label}</div>
      <div style={{ height: 1, background: color, opacity: 0.2 }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   NOVA TEMPLATE
════════════════════════════════════════════════════════════ */
function TplNova({ d, sec, accent }) {
  const a = accent || '#2D6BE4';
  const pad = '0 32px';

  return (
    <div style={{ ...BASE_STYLE, display: 'flex', flexDirection: 'column' }} className="resume-a4">

      {/* ── Header — full-bleed colored band ── */}
      <div style={{
        background: a,
        padding: '24px 32px 18px',
        color: '#fff',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          {/* Avatar circle */}
          <div style={{
            width: 46, height: 46, borderRadius: '50%',
            background: 'rgba(255,255,255,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, flexShrink: 0, color: '#fff',
          }}>
            {(d.name || 'Y').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.2px', lineHeight: 1.2 }}>
              {d.name || 'Your Name'}
            </div>
            <div style={{ fontSize: 11, opacity: 0.82, marginTop: 2, fontWeight: 500 }}>
              {d.title || 'Job Title'}
            </div>
          </div>
        </div>
        {/* Contact row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 14px' }}>
          {[d.email, d.phone, d.location, d.linkedin, d.website].filter(Boolean).map((c, i) => (
            <span key={i} style={{ fontSize: 9, opacity: 0.85 }}>{c}</span>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '16px 32px', flex: 1 }}>

        {/* Summary */}
        {secActive(sec, 'summary') && d.summary && (
          <div style={{ marginBottom: 14 }}>
            <Heading label="Summary" color={a} />
            <p style={{ fontSize: 10, color: '#444', lineHeight: 1.55, margin: 0 }}>{d.summary}</p>
          </div>
        )}

        {/* Experience */}
        {secActive(sec, 'experience') && (d.experience || []).length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <Heading label="Experience" color={a} />
            {(d.experience || []).map((exp, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700 }}>{exp.role}</span>
                    <span style={{ fontSize: 10, color: '#555', marginLeft: 6 }}>
                      {exp.company}{exp.location ? ' · ' + exp.location : ''}
                    </span>
                  </div>
                  <span style={{ fontSize: 9, color: '#777', whiteSpace: 'nowrap', marginLeft: 8, flexShrink: 0 }}>
                    {exp.from}{exp.to ? ' - ' + exp.to : ''}
                  </span>
                </div>
                <BulletList items={exp.bullets} color={a} />
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {secActive(sec, 'education') && (d.education || []).length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <Heading label="Education" color={a} />
            {(d.education || []).map((edu, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>{edu.degree}</div>
                  <div style={{ fontSize: 9, color: '#666' }}>
                    {edu.school}{edu.grade ? ' · ' + edu.grade : ''}
                  </div>
                </div>
                <span style={{ fontSize: 9, color: '#777', whiteSpace: 'nowrap', marginLeft: 8, flexShrink: 0 }}>
                  {edu.from}{edu.to ? ' - ' + edu.to : ''}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {secActive(sec, 'skills') && (d.skillCategories || []).length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <Heading label="Skills" color={a} />
            {(d.skillCategories || []).map((cat, ci) => (
              <div key={ci} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                {cat.name && (
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#555', minWidth: 60, paddingTop: 2, flexShrink: 0 }}>
                    {cat.name}
                  </span>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 4px', flex: 1 }}>
                  {(cat.items || []).map((s, si) => (
                    <span key={si} style={{
                      fontSize: 9, padding: '1px 7px',
                      background: a + '15',
                      color: a,
                      border: '0.5px solid ' + a + '35',
                      borderRadius: 2, fontWeight: 500,
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {secActive(sec, 'projects') && (d.projects || []).length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <Heading label="Projects" color={a} />
            {(d.projects || []).map((p, i) => (
              <div key={i} style={{ marginBottom: 7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700 }}>{p.name}</span>
                    {p.tech && <span style={{ fontSize: 9, color: '#777', marginLeft: 5 }}>({p.tech})</span>}
                  </div>
                  {p.url && <span style={{ fontSize: 9, color: a, flexShrink: 0, marginLeft: 8 }}>{p.url}</span>}
                </div>
                {p.description && (
                  <div style={{ fontSize: 9.5, color: '#555', marginTop: 2, lineHeight: 1.45 }}>{p.description}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {secActive(sec, 'certifications') && (d.certifications || []).length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <Heading label="Certifications" color={a} />
            {(d.certifications || []).map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 600 }}>{c.name}</span>
                  {c.issuer && <span style={{ fontSize: 9, color: '#666', marginLeft: 5 }}>{c.issuer}</span>}
                </div>
                <span style={{ fontSize: 9, color: '#777', flexShrink: 0, marginLeft: 8 }}>{c.year}</span>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {secActive(sec, 'languages') && (d.languages || []).length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <Heading label="Languages" color={a} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 16px' }}>
              {(d.languages || []).map((l, i) => (
                <span key={i} style={{ fontSize: 10 }}>
                  <span style={{ fontWeight: 700 }}>{l.name}</span>
                  {l.level && <span style={{ color: '#777', fontWeight: 400 }}> — {l.level}</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {secActive(sec, 'achievements') && d.achievements && (
          <div style={{ marginBottom: 14 }}>
            <Heading label="Achievements" color={a} />
            {String(d.achievements).split('\n').filter(Boolean).map((line, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 2, alignItems: 'flex-start' }}>
                <span style={{ color: a, fontWeight: 700, fontSize: 10, lineHeight: '16px', flexShrink: 0 }}>{'>'}</span>
                <span style={{ fontSize: 10, color: '#444', lineHeight: 1.45 }}>{line}</span>
              </div>
            ))}
          </div>
        )}

        {/* Volunteer */}
        {secActive(sec, 'volunteer') && d.volunteer && (
          <div style={{ marginBottom: 14 }}>
            <Heading label="Volunteer" color={a} />
            {String(d.volunteer).split('\n').filter(Boolean).map((line, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 2, alignItems: 'flex-start' }}>
                <span style={{ color: a, fontWeight: 700, fontSize: 10, lineHeight: '16px', flexShrink: 0 }}>{'>'}</span>
                <span style={{ fontSize: 10, color: '#444', lineHeight: 1.45 }}>{line}</span>
              </div>
            ))}
          </div>
        )}

        {/* Interests */}
        {secActive(sec, 'interests') && d.interests && (
          <div style={{ marginBottom: 14 }}>
            <Heading label="Interests" color={a} />
            <div style={{ fontSize: 10, color: '#555' }}>{d.interests}</div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Minimal: clean single-column ─────────────────────────────
function TplMinimal({ d, sec, accent }) {
  const a = accent || '#222222';
  return (
    <div style={{ ...BASE_STYLE, padding: '40px 50px' }} className="resume-a4">
      <div style={{ borderBottom: `2px solid ${a}`, paddingBottom: 16, marginBottom: 20 }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px' }}>{d.name || 'Your Name'}</div>
        <div style={{ fontSize: 12, color: '#555', marginTop: 3 }}>{d.title || 'Job Title'}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 14px', marginTop: 8 }}>
          {[d.email, d.phone, d.location, d.linkedin].filter(Boolean).map((c, i) => (
            <span key={i} style={{ fontSize: 10, color: '#666' }}>{c}</span>
          ))}
        </div>
      </div>
      {secActive(sec, 'summary') && d.summary && (
        <div style={{ marginBottom: 18 }}>
          <Heading label="Profile" color={a} />
          <p style={{ fontSize: 11, color: '#444', lineHeight: 1.65 }}>{d.summary}</p>
        </div>
      )}
      {secActive(sec, 'experience') && (d.experience || []).length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <Heading label="Experience" color={a} />
          {d.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{exp.role} - {exp.company}</div>
                <div style={{ fontSize: 10, color: '#888' }}>{exp.from}{exp.to ? ` - ${exp.to}` : ''}</div>
              </div>
              <BulletList items={exp.bullets} color={a} />
            </div>
          ))}
        </div>
      )}
      {secActive(sec, 'education') && (d.education || []).length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <Heading label="Education" color={a} />
          {d.education.map((edu, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{edu.degree}</div>
                <div style={{ fontSize: 10, color: '#666' }}>{edu.school}</div>
              </div>
              <div style={{ fontSize: 10, color: '#888' }}>{edu.from}{edu.to ? ` - ${edu.to}` : ''}</div>
            </div>
          ))}
        </div>
      )}
      {secActive(sec, 'skills') && (d.skillCategories || []).flatMap(c => c.items || []).length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <Heading label="Skills" color={a} />
          <div style={{ fontSize: 11, color: '#444' }}>
            {(d.skillCategories || []).flatMap(c => c.items || []).join(' · ')}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Executive: two-column sidebar ───────────────────────────
function TplExecutive({ d, sec, accent }) {
  const a = accent || '#1a2744';
  return (
    <div style={{ ...BASE_STYLE, display: 'flex', colorScheme: 'light' }} className="resume-a4">
      {/* Sidebar */}
      <div style={{ width: 220, background: a, color: 'white', padding: '32px 20px', flexShrink: 0 }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, fontWeight: 700, margin: '0 auto 16px',
        }}>
          {(d.name || 'Y').charAt(0).toUpperCase()}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, textAlign: 'center', marginBottom: 4 }}>{d.name || 'Your Name'}</div>
        <div style={{ fontSize: 10, textAlign: 'center', opacity: 0.75, marginBottom: 20 }}>{d.title}</div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: 8 }}>Contact</div>
          {[d.email, d.phone, d.location, d.linkedin, d.website].filter(Boolean).map((c, i) => (
            <div key={i} style={{ fontSize: 9, opacity: 0.85, marginBottom: 4, wordBreak: 'break-word' }}>{c}</div>
          ))}
        </div>

        {secActive(sec, 'skills') && (d.skillCategories || []).length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: 8 }}>Skills</div>
            {(d.skillCategories || []).flatMap(c => c.items || []).map((s, i) => (
              <div key={i} style={{ fontSize: 10, opacity: 0.85, marginBottom: 3 }}>• {s}</div>
            ))}
          </div>
        )}

        {secActive(sec, 'languages') && (d.languages || []).length > 0 && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: 8 }}>Languages</div>
            {d.languages.map((l, i) => (
              <div key={i} style={{ fontSize: 10, opacity: 0.85, marginBottom: 2 }}>{l.name} - {l.level}</div>
            ))}
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '32px 28px' }}>
        {secActive(sec, 'summary') && d.summary && (
          <div style={{ marginBottom: 18 }}>
            <Heading label="Profile" color={a} />
            <p style={{ fontSize: 11, color: '#444', lineHeight: 1.65 }}>{d.summary}</p>
          </div>
        )}
        {secActive(sec, 'experience') && (d.experience || []).length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <Heading label="Experience" color={a} />
            {d.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{exp.role}</div>
                    <div style={{ fontSize: 10, color: '#666' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                  </div>
                  <div style={{ fontSize: 10, color: '#888' }}>{exp.from}{exp.to ? ` - ${exp.to}` : ''}</div>
                </div>
                <BulletList items={exp.bullets} color={a} />
              </div>
            ))}
          </div>
        )}
        {secActive(sec, 'education') && (d.education || []).length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <Heading label="Education" color={a} />
            {d.education.map((edu, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{edu.degree}</div>
                  <div style={{ fontSize: 10, color: '#666' }}>{edu.school}</div>
                </div>
                <div style={{ fontSize: 10, color: '#888' }}>{edu.from}{edu.to ? ` - ${edu.to}` : ''}</div>
              </div>
            ))}
          </div>
        )}
        {secActive(sec, 'projects') && (d.projects || []).length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <Heading label="Projects" color={a} />
            {d.projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{p.name} {p.tech && <span style={{ fontWeight: 400, color: '#888', fontSize: 10 }}>({p.tech})</span>}</div>
                {p.description && <div style={{ fontSize: 10, color: '#555', marginTop: 2 }}>{p.description}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Stubs for remaining templates (Carbon, Emerald, Tech, Creative, Diplomat, Timeline)
// These render identically to TplNova with different accent defaults -
// replace with your actual implementations from the original App.jsx
function TplCarbon({ d, sec, accent })   { return <TplExecutive d={d} sec={sec} accent={accent || '#1a1a1a'} />; }
function TplEmerald({ d, sec, accent })  { return <TplNova      d={d} sec={sec} accent={accent || '#1D9E75'} />; }
function TplTech({ d, sec, accent })     { return <TplMinimal   d={d} sec={sec} accent={accent || '#0ea5e9'} />; }
function TplCreative({ d, sec, accent }) { return <TplNova      d={d} sec={sec} accent={accent || '#D85A30'} />; }
function TplDiplomat({ d, sec, accent }) { return <TplExecutive d={d} sec={sec} accent={accent || '#7F77DD'} />; }
function TplTimeline({ d, sec, accent }) { return <TplNova      d={d} sec={sec} accent={accent || '#BA7517'} />; }

const TPL_MAP = {
  nova:          TplNova,
  minimal:       TplMinimal,
  executive:     TplExecutive,
  carbon:        TplCarbon,
  emerald:       TplEmerald,
  tech:          TplTech,
  creative:      TplCreative,
  diplomat:      TplDiplomat,
  timeline:      TplTimeline,
};

const TEMPLATES = [
  { id: 'nova',      name: 'Nova',      accent: '#2D6BE4' },
  { id: 'executive', name: 'Executive', accent: '#1a2744' },
  { id: 'minimal',   name: 'Minimal',   accent: '#222222' },
  { id: 'carbon',    name: 'Carbon',    accent: '#1a1a1a' },
  { id: 'emerald',   name: 'Emerald',   accent: '#1D9E75' },
  { id: 'tech',      name: 'Tech',      accent: '#0ea5e9' },
  { id: 'creative',  name: 'Creative',  accent: '#D85A30' },
  { id: 'diplomat',  name: 'Diplomat',  accent: '#7F77DD' },
  { id: 'timeline',  name: 'Timeline',  accent: '#BA7517' },
];

/* ══════════════════════════════════════════════════════════════
   DEFAULT DATA  - pre-filled sample resume so preview is
   populated on first load. Users edit over this content.
══════════════════════════════════════════════════════════════ */
const DEFAULT_DATA = {
  name:     'Arjun Sharma',
  title:    'Senior Product Designer',
  email:    'arjun.sharma@email.com',
  phone:    '+91 98765 43210',
  location: 'Pune, Maharashtra',
  linkedin: 'linkedin.com/in/arjunsharma',
  website:  'arjunsharma.design',

  summary:
    'Product designer with 6+ years building intuitive digital products ' +
    'for fintech and edtech sectors. Led end-to-end design of 3 flagship ' +
    'apps used by over 2 million users. Passionate about accessibility, ' +
    'design systems, and data-driven UX decisions.',

  experience: [
    {
      role:     'Senior Product Designer',
      company:  'Zeta Suite',
      location: 'Pune',
      from:     'Jan 2021',
      to:       'Present',
      bullets: [
        'Led redesign of onboarding flow - reduced drop-off by 34% in 3 months',
        'Built and maintained design system adopted across 5 product teams',
        'Conducted 40+ user interviews and translated insights into product roadmap',
        'Collaborated with engineering to ship 12 major features on schedule',
      ],
    },
    {
      role:     'Product Designer',
      company:  'Groww',
      location: 'Bangalore',
      from:     'Jun 2018',
      to:       'Dec 2020',
      bullets: [
        'Redesigned the mutual fund investment flow, improving conversion by 22%',
        'Created accessible UI patterns adopted as company-wide design standards',
        'Worked cross-functionally with PMs and developers in 2-week sprints',
      ],
    },
  ],

  education: [
    {
      degree: 'B.Des. Visual Communication',
      school: 'MIT Institute of Design, Pune',
      from:   '2014',
      to:     '2018',
      grade:  'First Class with Distinction',
    },
  ],

  skillCategories: [
    {
      name: 'Design',
      items: ['Figma', 'Prototyping', 'Design Systems', 'UX Research', 'Wireframing'],
    },
    {
      name: 'Tools',
      items: ['Maze', 'Hotjar', 'Notion', 'Jira', 'Zeplin'],
    },
    {
      name: 'Soft Skills',
      items: ['Cross-functional Collaboration', 'Stakeholder Presentations', 'Mentoring'],
    },
  ],

  projects: [
    {
      name:        'FinTrack Mobile App',
      tech:        'Figma, React Native',
      url:         'github.com/arjun/fintrack',
      description: 'Personal finance tracker with budgeting, bill reminders, and spending insights. 4.8★ on Play Store with 50k+ downloads.',
    },
    {
      name:        'A11y Design Toolkit',
      tech:        'Figma, Storybook',
      url:         'a11y.arjunsharma.design',
      description: 'Open-source accessibility component library used by 200+ designers. Covers WCAG 2.1 AA compliance patterns.',
    },
  ],

  certifications: [
    { name: 'Google UX Design Professional Certificate', issuer: 'Google / Coursera', year: '2022' },
    { name: 'Interaction Design Foundation - UX Management', issuer: 'IxDF', year: '2021' },
  ],

  achievements:
    'Speaker at Design+Dev India 2023 - Scaling Design Systems\n' +
    'Winner, Adobe India Design Challenge 2020 (Top 10 nationally)\n' +
    'Published in UX Collective - Why your onboarding flow is losing users',

  languages: [
    { name: 'English', level: 'Fluent' },
    { name: 'Hindi',   level: 'Native' },
    { name: 'Marathi', level: 'Native' },
  ],

  volunteer:  'Design mentor at GiveIndia NGO - Jan 2022 - present\nPro-bono UX audit for local education startup Paathshala',
  interests:  'Photography, Open Source, Hiking, Specialty Coffee',
};

const DEFAULT_SECTIONS = new Set(
  CFG.DEFAULTS.sections && CFG.DEFAULTS.sections.length
    ? CFG.DEFAULTS.sections
    : [
        'summary', 'experience', 'education', 'skills',
        'projects', 'certifications', 'achievements', 'languages',
      ]
);

/* ══════════════════════════════════════════════════════════════
   COMPLETION  - rough % based on filled fields
══════════════════════════════════════════════════════════════ */
function calcCompletion(data, sections) {
  let score = 0, max = 0;
  const check = (v, pts = 1) => { max += pts; if (String(v ?? '').trim()) score += pts; };
  check(data.name, 2); check(data.title); check(data.email, 2); check(data.phone);
  check(data.location); check(data.linkedin);
  if (sections.has('summary'))    check(data.summary, 2);
  if (sections.has('experience')) check((data.experience || []).length > 0 ? '1' : '', 3);
  if (sections.has('education'))  check((data.education  || []).length > 0 ? '1' : '', 2);
  if (sections.has('skills'))     check((data.skillCategories || []).flatMap(c => c.items || []).length > 0 ? '1' : '', 2);
  return Math.round((score / max) * 100);
}

/* ══════════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════════ */
export default function App() {
  const { theme, toggleTheme, isDark } = useTheme();

  // Capacity
  const [slotId]   = useState(() => uuid());
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!claimSlot(slotId)) { setBusy(true); return; }
    const hb = setInterval(() => refreshSlot(slotId), HB_MS);
    return () => { clearInterval(hb); releaseSlot(slotId); };
  }, [slotId]);

  // Resume state
  const [data,     setData]     = useState(DEFAULT_DATA);
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [template, setTemplate] = useState(CFG.DEFAULTS.template || 'nova');
  const [accent,   setAccent]   = useState(CFG.DEFAULTS.accentColor || '#2D6BE4');

  // UI state
  const [activeSection, setActiveSection] = useState('basics');
  const [mobileTab,     setMobileTab]     = useState('form');  // 'sections' | 'form' | 'preview'
  const [saved,         setSaved]         = useState(true);
  const saveTimerRef = useRef(null);

  // Auto-save indicator (just visual - data is already in React state)
  const markDirty = () => {
    setSaved(false);
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setSaved(true), 1200);
  };

  const handleDataChange = useCallback((field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    markDirty();
  }, []);

  const handleToggleSection = useCallback((key) => {
    setSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const handleTemplateChange = useCallback((id) => {
    setTemplate(id);
    const tpl = TEMPLATES.find(t => t.id === id);
    if (tpl?.accent) setAccent(tpl.accent);
  }, []);

  // Ref to the rendered resume element (used by handleDownload + page counter)
  const a4Ref = useRef(null);

  const handleDownload = () => window.print();

  // Count pages via ref div height
  const [pageCount, setPageCount] = useState(1);
  useEffect(() => {
    const el = a4Ref.current;
    if (!el) return;
    const h = el.scrollHeight;
    setPageCount(Math.max(1, Math.ceil(h / A4_H)));
  });

  const completionPct = calcCompletion(data, sections);
  const TplComponent  = TPL_MAP[template] || TplNova;

  // Capacity busy screen
  if (busy) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100dvh', background: 'var(--bg-app)',
        gap: 16, padding: 32, textAlign: 'center',
      }}>
        <div style={{ fontSize: 32 }}>⏳</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--tx-primary)' }}>
          {CFG.APP.name} is currently at capacity
        </div>
        <div style={{ fontSize: 14, color: 'var(--tx-secondary)', maxWidth: 380 }}>
          All {MAX_W.toLocaleString()} slots are in use. Please try again in a moment.
        </div>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    );
  }

  // The rendered A4 resume (shared between preview pane and print)
  const ResumeOutput = (
    <div ref={a4Ref}>
      <TplComponent d={data} sec={sections} accent={accent} />
    </div>
  );

  return (
    <>
      {/* Top bar */}
      <Topbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onDownload={handleDownload}
        appName={CFG.APP.name}
        tagline={CFG.APP.tagline}
        completionPct={completionPct}
        saved={saved}
      />

      {/* Three-column body */}
      <div className="app-body">
        {/* Sidebar - hidden on ≤1024px */}
        <Sidebar
          activeSection={activeSection}
          enabledSections={sections}
          onSectionClick={key => {
            setActiveSection(key);
            setMobileTab('form');
          }}
          onToggle={handleToggleSection}
          completionPct={completionPct}
          visibleSections={[
            'basics','summary','experience','education','skills','projects',
            'certifications','achievements','languages',
            ...(CFG.FEATURES.enableVolunteer !== false ? ['volunteer'] : []),
            ...(CFG.FEATURES.enableInterests !== false ? ['interests'] : []),
          ]}
        />

        {/* Form pane - hidden when mobileTab === 'preview' */}
        <div style={{
          gridArea: 'form',
          display: mobileTab === 'preview' ? 'none' : 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: 0,
        }}>
          <FormPane
            data={data}
            onChange={handleDataChange}
            enabledSections={sections}
            activeSection={activeSection}
            featureFlags={CFG.FEATURES}
          />
        </div>

        {/* Preview pane */}
        <PreviewPane
          templates={TEMPLATES}
          activeTemplate={template}
          onTemplateChange={handleTemplateChange}
          accentColor={accent}
          onColorChange={setAccent}
          pageCount={pageCount}
          maxPages={CFG.RESUME.maxPages || 2}
          isMobileVisible={mobileTab === 'preview'}
          onMobileClose={() => setMobileTab('form')}
        >
          {ResumeOutput}
        </PreviewPane>
      </div>

      {/* Mobile bottom navigation (shown < 768px only via CSS) */}
      <MobileNav activeTab={mobileTab} onTabChange={setMobileTab} />
    </>
  );
}