// src/App.jsx
// ─────────────────────────────────────────────────────────────
// ResumeForge · App shell
// Templates live in src/templates/<TplName>/ — each with its own
// .jsx and .css. Add a new template only in src/templates/index.js.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react';
import './index.css';

// UI shell components
import Topbar      from './components/Topbar.jsx';
import Sidebar     from './components/Sidebar.jsx';
import FormPane    from './components/FormPane.jsx';
import PreviewPane from './components/PreviewPane.jsx';
import MobileNav   from './components/MobileNav.jsx';
import { useTheme } from './useTheme.js';

// Templates — imported from the barrel, never directly from template folders
import { TPL_MAP, TEMPLATES } from './templates/index.js';

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

/* ══════════════════════════════════════════════════════════════
   DEFAULT DATA  - pre-filled sample resume
══════════════════════════════════════════════════════════════ */

const A4_H = 1123; // 297mm @ 96 dpi — used for page-count calculation

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
  const TplComponent  = TPL_MAP[template] || TPL_MAP['nova'];

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
          resumeData={data}
          enabledSections={sections}
        >
          {ResumeOutput}
        </PreviewPane>
      </div>

      {/* Mobile bottom navigation (shown < 768px only via CSS) */}
      <MobileNav activeTab={mobileTab} onTabChange={setMobileTab} />
    </>
  );
}