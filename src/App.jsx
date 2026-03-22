import { useState, useEffect, useRef } from "react";
import {
  APP, CAPACITY, RESUME, FEATURES, DEFAULTS, COLOR_PRESETS,
} from "../config/app.config.js";

/* ═══════════════════════════════════════════════════════════
   RESUME FORGE  v2.0
   9 Professional A4 Templates · Configurable · PDF Download
═══════════════════════════════════════════════════════════ */

const { pageWidthPx: A4_W, pageHeightPx: A4_H, maxPages: MAX_PAGES } = RESUME;
const { maxWorkers: MAX_WORKERS, slotTtlMs: SLOT_TTL, heartbeatMs: HB_MS, storageKey: SLOT_KEY } = CAPACITY;

/* ── Capacity management ─────────────────────────────────── */
function readSlots() {
  try {
    const raw = JSON.parse(localStorage.getItem(SLOT_KEY) || "{}");
    const now = Date.now();
    return Object.fromEntries(Object.entries(raw).filter(([, ts]) => now - ts < SLOT_TTL));
  } catch { return {}; }
}
function writeSlots(s) { try { localStorage.setItem(SLOT_KEY, JSON.stringify(s)); } catch {} }
function claimSlot() {
  const slots = readSlots();
  if (Object.keys(slots).length >= MAX_WORKERS) return null;
  const id = crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  slots[id] = Date.now(); writeSlots(slots); return id;
}
function refreshSlot(id) { const s = readSlots(); if (id && id in s) { s[id] = Date.now(); writeSlots(s); } }
function releaseSlot(id) { const s = readSlots(); delete s[id]; writeSlots(s); }
function liveCount() { return Object.keys(readSlots()).length; }

/* ── Sanitise ────────────────────────────────────────────── */
const clean = (v, max = 300) => String(v ?? "").replace(/<[^>]*>/g, "").slice(0, max);

/* ── Default resume data ─────────────────────────────────── */
const DEF = {
  name: "Alex Johnson", title: "Senior Software Engineer",
  email: "alex@example.com", phone: "+1 (555) 234-5678",
  location: "San Francisco, CA", linkedin: "linkedin.com/in/alexjohnson",
  github: "github.com/alexjohnson", website: "alexjohnson.dev",
  summary: "Innovative Senior Software Engineer with 6+ years of experience designing and delivering high-impact web applications. Expert in React, Node.js and AWS. Proven track record of reducing system latency by 45% and leading cross-functional teams of 8+ engineers.",
  experience: [
    { id: 1, role: "Senior Software Engineer", company: "Google LLC", location: "Mountain View, CA", duration: "Mar 2021 – Present",
      bullets: ["Led migration of monolithic architecture to microservices, reducing deployment time by 60%.", "Built real-time data pipeline processing 5M+ events/day using Kafka and Apache Flink.", "Mentored team of 6 engineers, improving sprint velocity by 35%."] },
    { id: 2, role: "Software Engineer II", company: "Stripe Inc.", location: "San Francisco, CA", duration: "Jan 2019 – Feb 2021",
      bullets: ["Developed fraud detection ML model achieving 94% accuracy, saving $2M annually.", "Optimised PostgreSQL queries reducing p99 latency from 800ms to 120ms.", "Shipped 12 A/B-tested features across payments dashboard used by 500K merchants."] },
    { id: 3, role: "Software Engineer", company: "Startup Hub", location: "Remote", duration: "Jun 2017 – Dec 2018",
      bullets: ["Built full-stack MVP in 6 weeks using React, Node.js and MongoDB.", "Integrated Stripe and PayPal payment systems processing $500K in transactions."] },
  ],
  education: [{ id: 1, degree: "B.S. Computer Science", school: "University of California, Berkeley", duration: "2013 – 2017", grade: "GPA: 3.8 / 4.0", notes: "Dean's List · ACM Chapter President" }],
  skills: {
    Languages: ["JavaScript", "TypeScript", "Python", "Go", "SQL"],
    Frontend:  ["React", "Next.js", "Redux", "Tailwind CSS", "GraphQL"],
    Backend:   ["Node.js", "Express", "FastAPI", "PostgreSQL", "Redis"],
    Cloud:     ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
  },
  skillLevels: { JavaScript: 95, TypeScript: 88, Python: 82, React: 92, "Node.js": 90, AWS: 80, Docker: 85, PostgreSQL: 88 },
  projects: [
    { id: 1, name: "OpenMetrics Dashboard", tech: "React, D3.js, Node.js, WebSocket", link: "github.com/alex/openmetrics", desc: "Real-time infrastructure monitoring dashboard. 2,000+ GitHub stars, adopted by 50+ companies." },
    { id: 2, name: "AutoScale CLI", tech: "Go, Kubernetes API, Terraform", link: "github.com/alex/autoscale", desc: "CLI tool for intelligent auto-scaling of Kubernetes workloads. 800+ weekly downloads on npm." },
  ],
  certifications: [
    { id: 1, name: "AWS Solutions Architect – Professional", issuer: "Amazon Web Services", year: "2023" },
    { id: 2, name: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF", year: "2022" },
  ],
  achievements: [
    { id: 1, text: "Winner, Google Hackathon 2023 — Best DevOps Tool (500+ participants)" },
    { id: 2, text: "Speaker, NodeConf 2022 — 'Building Zero-Downtime Deploys at Scale'" },
    { id: 3, text: "Open source contributor — 3 merged PRs to React core repository" },
  ],
  languages: [{ id: 1, name: "English", level: "Native" }, { id: 2, name: "Spanish", level: "Professional" }],
  volunteer: [{ id: 1, role: "Technical Mentor", org: "Code.org", duration: "2020 – Present", desc: "Mentoring underserved students in web development fundamentals." }],
  interests: ["System Design", "Open Source", "Rock Climbing", "Photography"],
};

const ALL_SECTIONS = [
  { key: "summary",        label: "Summary"        },
  { key: "experience",     label: "Experience"     },
  { key: "education",      label: "Education"      },
  { key: "skills",         label: "Skills"         },
  { key: "projects",       label: "Projects"       },
  { key: "certifications", label: "Certifications" },
  { key: "achievements",   label: "Achievements"   },
  { key: "languages",      label: "Languages"      },
  ...(FEATURES.enableVolunteer  ? [{ key: "volunteer",  label: "Volunteer"  }] : []),
  ...(FEATURES.enableInterests  ? [{ key: "interests",  label: "Interests"  }] : []),
];

const TEMPLATES = [
  { id: "nova",      name: "Nova",       desc: "Sidebar · Skill bars",     accent: "#2D6BE4" },
  { id: "executive", name: "Executive",  desc: "Navy · Two-column",        accent: "#1a2744" },
  { id: "carbon",    name: "Carbon",     desc: "Dark sidebar · Gold",      accent: "#1c1c1c" },
  { id: "emerald",   name: "Emerald",    desc: "Green · Progress bars",    accent: "#0a6e5a" },
  { id: "minimal",   name: "Minimal",    desc: "Clean serif · ATS-safe",   accent: "#222222" },
  { id: "creative",  name: "Creative",   desc: "Bold header · Asymmetric", accent: "#C0392B" },
  { id: "tech",      name: "Tech",       desc: "Monospace · Dev-focused",  accent: "#6C3FC5" },
  { id: "diplomat",  name: "Diplomat",   desc: "Centred serif · Gold rule", accent: "#8B6914" },
  { id: "timeline",  name: "Timeline",   desc: "Dot timeline · Teal",      accent: "#0891b2" },
];

/* ══════════════════════════════════════════════════════
   SHARED RESUME PRIMITIVES
══════════════════════════════════════════════════════ */

function SkillBar({ name, pct = 75, color = "#2D6BE4" }) {
  if (!FEATURES.enableSkillBars) return null;
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "7.5pt", fontWeight: 600, color: "#222", marginBottom: 2 }}>
        <span>{name}</span><span style={{ color, fontWeight: 500 }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: "#e4e4e8", borderRadius: 2 }}>
        <div style={{ height: 4, width: `${pct}%`, background: color, borderRadius: 2 }} />
      </div>
    </div>
  );
}

function Pill({ name, color = "#2D6BE4" }) {
  return <span style={{ display: "inline-block", background: `${color}18`, color, border: `1px solid ${color}44`, borderRadius: 3, padding: "2px 8px", fontSize: "7.5pt", fontWeight: 600, marginRight: 4, marginBottom: 4 }}>{name}</span>;
}

function SH({ label, color = "#2D6BE4", mode = "underline" }) {
  if (mode === "line") return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0 8px" }}>
      <span style={{ fontSize: "8pt", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color, whiteSpace: "nowrap" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: `${color}44` }} />
    </div>
  );
  if (mode === "dot") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "14px 0 8px" }}>
      <div style={{ width: 8, height: 8, background: color, borderRadius: "50%" }} />
      <span style={{ fontSize: "8pt", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#222" }}>{label}</span>
    </div>
  );
  return <div style={{ fontSize: "8pt", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color, borderBottom: `2px solid ${color}`, paddingBottom: 4, margin: "14px 0 8px" }}>{label}</div>;
}

function ExpEntry({ e, accent, showDot = false }) {
  const bullets = Array.isArray(e.bullets) && e.bullets.filter(Boolean).length > 0
    ? e.bullets.filter(Boolean) : e.desc ? [e.desc] : [];
  return (
    <div style={{ marginBottom: 13, paddingLeft: showDot ? 18 : 0, position: "relative" }}>
      {showDot && <div style={{ position: "absolute", left: 5, top: 5, width: 7, height: 7, borderRadius: "50%", background: accent, border: "2px solid white", outline: `2px solid ${accent}` }} />}
      {showDot && <div style={{ position: "absolute", left: 8, top: 15, width: 1, bottom: -8, background: `${accent}30` }} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div>
          <div style={{ fontSize: "10pt", fontWeight: 700, color: "#111", lineHeight: 1.3 }}>{e.role}</div>
          <div style={{ fontSize: "8.5pt", fontWeight: 500, color: "#555", marginTop: 1 }}>{e.company}{e.location ? ` · ${e.location}` : ""}</div>
        </div>
        <div style={{ fontSize: "7.5pt", color: accent, whiteSpace: "nowrap", fontWeight: 600, background: `${accent}14`, padding: "2px 8px", borderRadius: 3, flexShrink: 0 }}>{e.duration}</div>
      </div>
      {bullets.length > 0 && <ul style={{ margin: "5px 0 0 14px", padding: 0 }}>{bullets.map((b, i) => <li key={i} style={{ fontSize: "8.5pt", color: "#333", lineHeight: 1.55, marginBottom: 3 }}>{b}</li>)}</ul>}
    </div>
  );
}

function EduEntry({ e, accent }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div>
          <div style={{ fontSize: "10pt", fontWeight: 700, color: "#111" }}>{e.degree}</div>
          <div style={{ fontSize: "8.5pt", fontWeight: 500, color: "#555", marginTop: 1 }}>{e.school}</div>
          {e.notes && <div style={{ fontSize: "8pt", color: "#777", marginTop: 2 }}>{e.notes}</div>}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: "7.5pt", color: accent, fontWeight: 600, background: `${accent}14`, padding: "2px 8px", borderRadius: 3 }}>{e.duration}</div>
          {e.grade && <div style={{ fontSize: "7.5pt", color: "#666", marginTop: 3, fontWeight: 500 }}>{e.grade}</div>}
        </div>
      </div>
    </div>
  );
}

function SkillsBlock({ skills, accent, mode = "pills" }) {
  const isObj = typeof skills === "object" && !Array.isArray(skills);
  if (!isObj) return <div>{(Array.isArray(skills) ? skills : []).map((s, i) => <Pill key={i} name={s} color={accent} />)}</div>;
  return (
    <div>
      {Object.entries(skills).map(([cat, list]) => (
        <div key={cat} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: "7.5pt", fontWeight: 700, color: "#444", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 5 }}>{cat}</div>
          {mode === "bar"
            ? (Array.isArray(list) ? list : []).map((s, i) => <SkillBar key={i} name={s} pct={Math.max(65, (75 + s.length * 2) % 35 + 65)} color={accent} />)
            : <div>{(Array.isArray(list) ? list : []).map((s, i) => <Pill key={i} name={s} color={accent} />)}</div>}
        </div>
      ))}
    </div>
  );
}

function CertBlock({ items, accent }) {
  return (items || []).map(c => (
    <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f0f0f0", fontSize: "8.5pt" }}>
      <span style={{ fontWeight: 700, color: "#111" }}>{c.name}</span>
      <span style={{ color: "#666", fontSize: "8pt" }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</span>
    </div>
  ));
}

function AchievBlock({ items }) {
  return (items || []).map(a => <div key={a.id} style={{ fontSize: "8.5pt", color: "#333", padding: "4px 0 4px 10px", borderBottom: "1px solid #f5f5f5", borderLeft: "3px solid #e0e0e0", marginBottom: 4, lineHeight: 1.5 }}>{a.text}</div>);
}

function LangBlock({ items }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {(items || []).map(l => <div key={l.id} style={{ fontSize: "8pt", padding: "3px 10px", background: "#f5f5f5", borderRadius: 3, fontWeight: 500 }}><span style={{ fontWeight: 700, color: "#111" }}>{l.name}</span>{l.level && <span style={{ color: "#888" }}> · {l.level}</span>}</div>)}
    </div>
  );
}

function VolBlock({ items, accent }) {
  return (items || []).map(v => (
    <div key={v.id} style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div><div style={{ fontSize: "9.5pt", fontWeight: 700, color: "#111" }}>{v.role}</div><div style={{ fontSize: "8pt", color: "#555", fontWeight: 500 }}>{v.org}</div></div>
        <div style={{ fontSize: "7.5pt", color: accent, fontWeight: 600, whiteSpace: "nowrap" }}>{v.duration}</div>
      </div>
      {v.desc && <div style={{ fontSize: "8pt", color: "#444", marginTop: 3, lineHeight: 1.5 }}>{v.desc}</div>}
    </div>
  ));
}

function ProjectBlock({ items, accent }) {
  return (items || []).map(p => (
    <div key={p.id} style={{ marginBottom: 11 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ fontSize: "9.5pt", fontWeight: 700, color: "#111" }}>{p.name}</div>
        {p.link && <div style={{ fontSize: "7pt", color: accent, fontFamily: "monospace", whiteSpace: "nowrap", flexShrink: 0 }}>{p.link}</div>}
      </div>
      {p.tech && <div style={{ marginTop: 3 }}>{p.tech.split(",").map((t, i) => <span key={i} style={{ display: "inline-block", fontSize: "7pt", fontWeight: 600, color: accent, background: `${accent}14`, padding: "1px 7px", borderRadius: 2, marginRight: 3, marginBottom: 2 }}>{t.trim()}</span>)}</div>}
      {p.desc && <div style={{ fontSize: "8.5pt", color: "#444", marginTop: 4, lineHeight: 1.55 }}>{p.desc}</div>}
    </div>
  ));
}

function InterestBlock({ items }) {
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>{(items || []).map((t, i) => <span key={i} style={{ fontSize: "8pt", padding: "3px 10px", background: "#f5f5f5", borderRadius: 100, color: "#555", fontWeight: 500 }}>{t}</span>)}</div>;
}

/* ══════════════════════════════════════════════════════
   9 TEMPLATE RENDERERS
══════════════════════════════════════════════════════ */

function TplNova({ d, sec, accent }) {
  const contacts = [d.email, d.phone, d.location, d.linkedin, d.github, d.website].filter(Boolean);
  const initials = d.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: A4_H, fontFamily: "'DM Sans',sans-serif", fontSize: "9.5pt" }}>
      <div style={{ background: accent, color: "white", padding: "28px 20px" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,.18)", border: "3px solid rgba(255,255,255,.4)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11pt", fontWeight: 700, color: "rgba(255,255,255,.75)" }}>{initials}</div>
        <div style={{ fontSize: "14pt", fontWeight: 800, color: "white", textAlign: "center", lineHeight: 1.2, marginBottom: 4 }}>{d.name}</div>
        <div style={{ fontSize: "8pt", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,.65)", textAlign: "center", marginBottom: 20 }}>{d.title}</div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.2)", paddingTop: 14, marginBottom: 16 }}>
          <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,.45)", marginBottom: 10 }}>Contact</div>
          {contacts.map((c, i) => <div key={i} style={{ fontSize: "8pt", color: "rgba(255,255,255,.82)", marginBottom: 6, wordBreak: "break-all" }}>{c}</div>)}
        </div>
        {sec.has("skills") && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,.2)", paddingTop: 14, marginBottom: 16 }}>
            <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,.45)", marginBottom: 10 }}>Skills</div>
            {typeof d.skills === "object" && !Array.isArray(d.skills)
              ? Object.entries(d.skills).map(([cat, list]) => (
                <div key={cat} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: "6.5pt", color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>{cat}</div>
                  {(Array.isArray(list) ? list : []).map((s, i) => (
                    <div key={i} style={{ marginBottom: 5 }}>
                      <div style={{ fontSize: "7.5pt", color: "rgba(255,255,255,.85)", marginBottom: 2, fontWeight: 500 }}>{s}</div>
                      <div style={{ height: 3, background: "rgba(255,255,255,.2)", borderRadius: 2 }}><div style={{ height: 3, width: `${d.skillLevels?.[s] || 75}%`, background: "rgba(255,255,255,.78)", borderRadius: 2 }} /></div>
                    </div>
                  ))}
                </div>
              ))
              : (Array.isArray(d.skills) ? d.skills : []).map((s, i) => (
                <div key={i} style={{ marginBottom: 5 }}>
                  <div style={{ fontSize: "7.5pt", color: "rgba(255,255,255,.85)", marginBottom: 2, fontWeight: 500 }}>{s}</div>
                  <div style={{ height: 3, background: "rgba(255,255,255,.2)", borderRadius: 2 }}><div style={{ height: 3, width: `${d.skillLevels?.[s] || 75}%`, background: "rgba(255,255,255,.78)", borderRadius: 2 }} /></div>
                </div>
              ))}
          </div>
        )}
        {sec.has("languages") && d.languages?.length > 0 && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,.2)", paddingTop: 14, marginBottom: 14 }}>
            <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,.45)", marginBottom: 10 }}>Languages</div>
            {d.languages.map(l => <div key={l.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><span style={{ fontSize: "8pt", color: "rgba(255,255,255,.85)", fontWeight: 500 }}>{l.name}</span><span style={{ fontSize: "7.5pt", color: "rgba(255,255,255,.45)" }}>{l.level}</span></div>)}
          </div>
        )}
        {sec.has("interests") && d.interests?.length > 0 && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,.2)", paddingTop: 14 }}>
            <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,.45)", marginBottom: 10 }}>Interests</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>{d.interests.map((t, i) => <span key={i} style={{ fontSize: "7.5pt", padding: "2px 8px", background: "rgba(255,255,255,.15)", borderRadius: 100, color: "rgba(255,255,255,.8)", fontWeight: 500 }}>{t}</span>)}</div>
          </div>
        )}
      </div>
      <div style={{ padding: "28px 28px", background: "white" }}>
        {sec.has("summary") && d.summary && <><SH label="Professional Summary" color={accent} /><p style={{ fontSize: "9.5pt", color: "#333", lineHeight: 1.65, margin: 0 }}>{d.summary}</p></>}
        {sec.has("experience") && d.experience?.length > 0 && <><SH label="Work Experience" color={accent} />{d.experience.map(e => <ExpEntry key={e.id} e={e} accent={accent} />)}</>}
        {sec.has("education") && d.education?.length > 0 && <><SH label="Education" color={accent} />{d.education.map(e => <EduEntry key={e.id} e={e} accent={accent} />)}</>}
        {sec.has("projects") && d.projects?.length > 0 && <><SH label="Key Projects" color={accent} /><ProjectBlock items={d.projects} accent={accent} /></>}
        {sec.has("certifications") && d.certifications?.length > 0 && <><SH label="Certifications" color={accent} /><CertBlock items={d.certifications} accent={accent} /></>}
        {sec.has("achievements") && d.achievements?.length > 0 && <><SH label="Achievements" color={accent} /><AchievBlock items={d.achievements} /></>}
        {sec.has("volunteer") && d.volunteer?.length > 0 && <><SH label="Volunteer Work" color={accent} /><VolBlock items={d.volunteer} accent={accent} /></>}
      </div>
    </div>
  );
}

function TplExecutive({ d, sec, accent }) {
  const contacts = [d.email, d.phone, d.location, d.linkedin, d.github].filter(Boolean);
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "white", minHeight: A4_H }}>
      <div style={{ background: accent, padding: "28px 36px 22px", color: "white" }}>
        <div style={{ fontFamily: "Georgia,serif", fontSize: "28pt", fontWeight: 400, color: "white", letterSpacing: "-.3px", lineHeight: 1.1 }}>{d.name}</div>
        <div style={{ fontSize: "9pt", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,.65)", marginTop: 5, fontWeight: 600 }}>{d.title}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 12 }}>{contacts.map((c, i) => <span key={i} style={{ fontSize: "8pt", color: "rgba(255,255,255,.8)" }}>{c}</span>)}</div>
      </div>
      <div style={{ padding: "22px 36px" }}>
        {sec.has("summary") && d.summary && <><SH label="Professional Summary" color={accent} /><p style={{ fontSize: "9.5pt", color: "#2a2a2a", lineHeight: 1.65, margin: 0 }}>{d.summary}</p></>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 28px" }}>
          <div>
            {sec.has("experience") && d.experience?.length > 0 && <><SH label="Experience" color={accent} />{d.experience.map(e => <ExpEntry key={e.id} e={e} accent={accent} />)}</>}
            {sec.has("projects") && d.projects?.length > 0 && <><SH label="Projects" color={accent} /><ProjectBlock items={d.projects} accent={accent} /></>}
            {sec.has("achievements") && d.achievements?.length > 0 && <><SH label="Achievements" color={accent} /><AchievBlock items={d.achievements} /></>}
          </div>
          <div>
            {sec.has("education") && d.education?.length > 0 && <><SH label="Education" color={accent} />{d.education.map(e => <EduEntry key={e.id} e={e} accent={accent} />)}</>}
            {sec.has("skills") && <><SH label="Skills" color={accent} /><SkillsBlock skills={d.skills} accent={accent} /></>}
            {sec.has("certifications") && d.certifications?.length > 0 && <><SH label="Certifications" color={accent} /><CertBlock items={d.certifications} accent={accent} /></>}
            {sec.has("languages") && d.languages?.length > 0 && <><SH label="Languages" color={accent} /><LangBlock items={d.languages} /></>}
            {sec.has("volunteer") && d.volunteer?.length > 0 && <><SH label="Volunteer" color={accent} /><VolBlock items={d.volunteer} accent={accent} /></>}
          </div>
        </div>
      </div>
    </div>
  );
}

function TplCarbon({ d, sec, accent }) {
  const gold = "#D4A843";
  const contacts = [d.email, d.phone, d.location, d.linkedin, d.github].filter(Boolean);
  const initials = d.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", minHeight: A4_H, fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ background: "#1c1c1c", padding: "28px 18px", color: "white" }}>
        <div style={{ width: 68, height: 68, borderRadius: "50%", border: `3px solid ${gold}`, background: "#2a2a2a", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10pt", fontWeight: 700, color: gold }}>{initials}</div>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: "13pt", fontWeight: 800, color: "white", lineHeight: 1.2 }}>{d.name}</div>
          <div style={{ fontSize: "7.5pt", fontWeight: 600, color: gold, letterSpacing: "2px", textTransform: "uppercase", marginTop: 4 }}>{d.title}</div>
        </div>
        <div style={{ borderTop: `1px solid ${gold}30`, paddingTop: 14, marginBottom: 14 }}>{contacts.map((c, i) => <div key={i} style={{ fontSize: "7.5pt", color: "rgba(255,255,255,.75)", marginBottom: 6, wordBreak: "break-all" }}>{c}</div>)}</div>
        {sec.has("skills") && (
          <div style={{ borderTop: `1px solid ${gold}30`, paddingTop: 14, marginBottom: 14 }}>
            <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: gold, marginBottom: 10 }}>Skills</div>
            {typeof d.skills === "object" && !Array.isArray(d.skills)
              ? Object.entries(d.skills).map(([cat, list]) => (
                <div key={cat} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: "6.5pt", color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>{cat}</div>
                  {(Array.isArray(list) ? list : []).map((s, i) => <span key={i} style={{ display: "inline-block", fontSize: "7pt", fontWeight: 600, color: "rgba(255,255,255,.8)", background: `${gold}22`, border: `1px solid ${gold}44`, borderRadius: 2, padding: "1px 6px", marginRight: 3, marginBottom: 3 }}>{s}</span>)}
                </div>
              )) : null}
          </div>
        )}
        {sec.has("certifications") && d.certifications?.length > 0 && (
          <div style={{ borderTop: `1px solid ${gold}30`, paddingTop: 14 }}>
            <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: gold, marginBottom: 10 }}>Certifications</div>
            {d.certifications.map(c => <div key={c.id} style={{ marginBottom: 7 }}><div style={{ fontSize: "8pt", fontWeight: 700, color: "rgba(255,255,255,.85)" }}>{c.name}</div><div style={{ fontSize: "7pt", color: "rgba(255,255,255,.45)" }}>{c.issuer} · {c.year}</div></div>)}
          </div>
        )}
      </div>
      <div style={{ padding: "28px 28px", background: "white" }}>
        {sec.has("summary") && d.summary && <><SH label="Profile" color={gold} mode="line" /><p style={{ fontSize: "9.5pt", color: "#333", lineHeight: 1.65, margin: 0 }}>{d.summary}</p></>}
        {sec.has("experience") && d.experience?.length > 0 && <><SH label="Experience" color={gold} mode="line" />{d.experience.map(e => <ExpEntry key={e.id} e={e} accent={gold} />)}</>}
        {sec.has("education") && d.education?.length > 0 && <><SH label="Education" color={gold} mode="line" />{d.education.map(e => <EduEntry key={e.id} e={e} accent={gold} />)}</>}
        {sec.has("projects") && d.projects?.length > 0 && <><SH label="Projects" color={gold} mode="line" /><ProjectBlock items={d.projects} accent={gold} /></>}
        {sec.has("achievements") && d.achievements?.length > 0 && <><SH label="Achievements" color={gold} mode="line" /><AchievBlock items={d.achievements} /></>}
        {sec.has("languages") && d.languages?.length > 0 && <><SH label="Languages" color={gold} mode="line" /><LangBlock items={d.languages} /></>}
        {sec.has("volunteer") && d.volunteer?.length > 0 && <><SH label="Volunteer" color={gold} mode="line" /><VolBlock items={d.volunteer} accent={gold} /></>}
      </div>
    </div>
  );
}

function TplEmerald({ d, sec, accent }) {
  const contacts = [d.email, d.phone, d.location, d.linkedin, d.github].filter(Boolean);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "210px 1fr", minHeight: A4_H, fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ background: accent, padding: "28px 18px", color: "white" }}>
        <div style={{ fontSize: "14pt", fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: 4 }}>{d.name}</div>
        <div style={{ fontSize: "7.5pt", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,.65)", marginBottom: 18, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,.2)" }}>{d.title}</div>
        <div style={{ marginBottom: 16 }}>{contacts.map((c, i) => <div key={i} style={{ fontSize: "7.5pt", color: "rgba(255,255,255,.8)", marginBottom: 5, wordBreak: "break-all" }}>{c}</div>)}</div>
        {sec.has("skills") && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,.2)", paddingTop: 14, marginBottom: 14 }}>
            <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginBottom: 10 }}>Skills</div>
            {typeof d.skills === "object" && !Array.isArray(d.skills)
              ? Object.entries(d.skills).map(([cat, list]) => (
                <div key={cat} style={{ marginBottom: 9 }}>
                  <div style={{ fontSize: "6.5pt", color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 5 }}>{cat}</div>
                  {(Array.isArray(list) ? list : []).map((s, i) => (
                    <div key={i} style={{ marginBottom: 5 }}>
                      <div style={{ fontSize: "7.5pt", color: "rgba(255,255,255,.85)", fontWeight: 500, marginBottom: 2 }}>{s}</div>
                      <div style={{ height: 3, background: "rgba(255,255,255,.2)", borderRadius: 2 }}><div style={{ height: 3, width: `${d.skillLevels?.[s] || 75}%`, background: "rgba(255,255,255,.75)", borderRadius: 2 }} /></div>
                    </div>
                  ))}
                </div>
              )) : null}
          </div>
        )}
        {sec.has("languages") && d.languages?.length > 0 && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,.2)", paddingTop: 14, marginBottom: 14 }}>
            <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginBottom: 10 }}>Languages</div>
            {d.languages.map(l => <div key={l.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><span style={{ fontSize: "8pt", color: "rgba(255,255,255,.85)", fontWeight: 500 }}>{l.name}</span><span style={{ fontSize: "7.5pt", color: "rgba(255,255,255,.45)" }}>{l.level}</span></div>)}
          </div>
        )}
        {sec.has("certifications") && d.certifications?.length > 0 && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,.2)", paddingTop: 14 }}>
            <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginBottom: 10 }}>Certifications</div>
            {d.certifications.map(c => <div key={c.id} style={{ marginBottom: 7 }}><div style={{ fontSize: "7.5pt", fontWeight: 700, color: "rgba(255,255,255,.85)" }}>{c.name}</div><div style={{ fontSize: "7pt", color: "rgba(255,255,255,.45)" }}>{c.issuer} · {c.year}</div></div>)}
          </div>
        )}
      </div>
      <div style={{ padding: "28px 26px", background: "white" }}>
        {sec.has("summary") && d.summary && <><SH label="Summary" color={accent} /><p style={{ fontSize: "9.5pt", color: "#333", lineHeight: 1.65, margin: 0 }}>{d.summary}</p></>}
        {sec.has("experience") && d.experience?.length > 0 && <><SH label="Work Experience" color={accent} />{d.experience.map(e => <ExpEntry key={e.id} e={e} accent={accent} />)}</>}
        {sec.has("education") && d.education?.length > 0 && <><SH label="Education" color={accent} />{d.education.map(e => <EduEntry key={e.id} e={e} accent={accent} />)}</>}
        {sec.has("projects") && d.projects?.length > 0 && <><SH label="Projects" color={accent} /><ProjectBlock items={d.projects} accent={accent} /></>}
        {sec.has("achievements") && d.achievements?.length > 0 && <><SH label="Achievements" color={accent} /><AchievBlock items={d.achievements} /></>}
        {sec.has("volunteer") && d.volunteer?.length > 0 && <><SH label="Volunteer" color={accent} /><VolBlock items={d.volunteer} accent={accent} /></>}
        {sec.has("interests") && d.interests?.length > 0 && <><SH label="Interests" color={accent} /><InterestBlock items={d.interests} /></>}
      </div>
    </div>
  );
}

function TplMinimal({ d, sec, accent }) {
  const contacts = [d.email, d.phone, d.location, d.linkedin, d.github, d.website].filter(Boolean);
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "white", padding: "44px 48px", minHeight: A4_H }}>
      <div style={{ borderBottom: "2px solid #111", paddingBottom: 18, marginBottom: 20 }}>
        <div style={{ fontFamily: "Georgia,serif", fontSize: "30pt", fontWeight: 400, color: "#111", letterSpacing: "-.5px", lineHeight: 1, marginBottom: 6 }}>{d.name}</div>
        <div style={{ fontSize: "9pt", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#555", marginBottom: 12 }}>{d.title}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 16px" }}>{contacts.map((c, i) => <span key={i} style={{ fontSize: "8pt", color: "#666" }}>{c}</span>)}</div>
      </div>
      {sec.has("summary") && d.summary && <><div style={{ fontSize: "8pt", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#999", margin: "0 0 8px" }}>Profile</div><p style={{ fontSize: "9.5pt", color: "#333", lineHeight: 1.7, margin: "0 0 16px" }}>{d.summary}</p></>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: "0 32px" }}>
        <div>
          {sec.has("experience") && d.experience?.length > 0 && <><div style={{ fontSize: "8pt", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#999", margin: "0 0 8px" }}>Experience</div>{d.experience.map(e => <ExpEntry key={e.id} e={e} accent="#222" />)}</>}
          {sec.has("projects") && d.projects?.length > 0 && <><div style={{ fontSize: "8pt", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#999", margin: "14px 0 8px" }}>Projects</div><ProjectBlock items={d.projects} accent="#222" /></>}
          {sec.has("achievements") && d.achievements?.length > 0 && <><div style={{ fontSize: "8pt", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#999", margin: "14px 0 8px" }}>Achievements</div><AchievBlock items={d.achievements} /></>}
          {sec.has("volunteer") && d.volunteer?.length > 0 && <><div style={{ fontSize: "8pt", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#999", margin: "14px 0 8px" }}>Volunteer</div><VolBlock items={d.volunteer} accent="#222" /></>}
        </div>
        <div>
          {sec.has("education") && d.education?.length > 0 && <><div style={{ fontSize: "8pt", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#999", margin: "0 0 8px" }}>Education</div>{d.education.map(e => <EduEntry key={e.id} e={e} accent="#222" />)}</>}
          {sec.has("skills") && <><div style={{ fontSize: "8pt", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#999", margin: "14px 0 8px" }}>Skills</div><SkillsBlock skills={d.skills} accent="#333" /></>}
          {sec.has("certifications") && d.certifications?.length > 0 && <><div style={{ fontSize: "8pt", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#999", margin: "14px 0 8px" }}>Certifications</div><CertBlock items={d.certifications} accent="#222" /></>}
          {sec.has("languages") && d.languages?.length > 0 && <><div style={{ fontSize: "8pt", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#999", margin: "14px 0 8px" }}>Languages</div><LangBlock items={d.languages} /></>}
          {sec.has("interests") && d.interests?.length > 0 && <><div style={{ fontSize: "8pt", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#999", margin: "14px 0 8px" }}>Interests</div><InterestBlock items={d.interests} /></>}
        </div>
      </div>
    </div>
  );
}

function TplCreative({ d, sec, accent }) {
  const contacts = [d.email, d.phone, d.location, d.linkedin].filter(Boolean);
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "white", minHeight: A4_H }}>
      <div style={{ background: accent, padding: "32px 36px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, background: "rgba(255,255,255,.06)", borderRadius: "50%" }} />
        <div style={{ fontFamily: "'Arial Black',Arial,sans-serif", fontSize: "28pt", fontWeight: 900, color: "white", letterSpacing: "-1px", lineHeight: 1, marginBottom: 6 }}>{d.name}</div>
        <div style={{ fontSize: "9.5pt", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,.7)", marginBottom: 14 }}>{d.title}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 18px" }}>{contacts.map((c, i) => <span key={i} style={{ fontSize: "8pt", color: "rgba(255,255,255,.8)" }}>{c}</span>)}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 230px" }}>
        <div style={{ padding: "24px 24px 24px 36px" }}>
          {sec.has("summary") && d.summary && <><SH label="About Me" color={accent} mode="dot" /><p style={{ fontSize: "9.5pt", color: "#333", lineHeight: 1.65, margin: 0 }}>{d.summary}</p></>}
          {sec.has("experience") && d.experience?.length > 0 && <><SH label="Experience" color={accent} mode="dot" />{d.experience.map(e => <ExpEntry key={e.id} e={e} accent={accent} />)}</>}
          {sec.has("projects") && d.projects?.length > 0 && <><SH label="Projects" color={accent} mode="dot" /><ProjectBlock items={d.projects} accent={accent} /></>}
          {sec.has("achievements") && d.achievements?.length > 0 && <><SH label="Achievements" color={accent} mode="dot" /><AchievBlock items={d.achievements} /></>}
          {sec.has("volunteer") && d.volunteer?.length > 0 && <><SH label="Volunteer" color={accent} mode="dot" /><VolBlock items={d.volunteer} accent={accent} /></>}
        </div>
        <div style={{ padding: "24px 24px 24px 0", borderLeft: `3px solid ${accent}18` }}>
          {sec.has("education") && d.education?.length > 0 && <><SH label="Education" color={accent} mode="dot" />{d.education.map(e => <EduEntry key={e.id} e={e} accent={accent} />)}</>}
          {sec.has("skills") && <><SH label="Skills" color={accent} mode="dot" /><SkillsBlock skills={d.skills} accent={accent} mode="bar" /></>}
          {sec.has("certifications") && d.certifications?.length > 0 && <><SH label="Certifications" color={accent} mode="dot" />{d.certifications.map(c => <div key={c.id} style={{ marginBottom: 7 }}><div style={{ fontSize: "8pt", fontWeight: 700, color: "#111" }}>{c.name}</div><div style={{ fontSize: "7.5pt", color: "#777" }}>{c.issuer} · {c.year}</div></div>)}</>}
          {sec.has("languages") && d.languages?.length > 0 && <><SH label="Languages" color={accent} mode="dot" /><LangBlock items={d.languages} /></>}
          {sec.has("interests") && d.interests?.length > 0 && <><SH label="Interests" color={accent} mode="dot" /><InterestBlock items={d.interests} /></>}
        </div>
      </div>
    </div>
  );
}

function TplTech({ d, sec, accent }) {
  const contacts = [d.email, d.phone, d.location, d.github, d.website].filter(Boolean);
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "white", minHeight: A4_H, padding: "36px" }}>
      <div style={{ borderBottom: `3px solid ${accent}`, paddingBottom: 16, marginBottom: 20 }}>
        <div style={{ fontFamily: "monospace", fontSize: "24pt", fontWeight: 700, color: "#111", letterSpacing: "-1px", marginBottom: 4 }}>{d.name}</div>
        <div style={{ fontFamily: "monospace", fontSize: "9pt", fontWeight: 500, color: accent, letterSpacing: "1px", marginBottom: 10 }}>{`> ${d.title}`}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 16px" }}>{contacts.map((c, i) => <span key={i} style={{ fontFamily: "monospace", fontSize: "7.5pt", color: "#555" }}>{c}</span>)}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 210px", gap: "0 28px" }}>
        <div>
          {sec.has("summary") && d.summary && <><div style={{ fontFamily: "monospace", fontSize: "7.5pt", fontWeight: 500, color: accent, letterSpacing: "2px", margin: "0 0 8px" }}>{"// summary"}</div><p style={{ fontSize: "9.5pt", color: "#333", lineHeight: 1.65, margin: "0 0 14px" }}>{d.summary}</p></>}
          {sec.has("experience") && d.experience?.length > 0 && <><div style={{ fontFamily: "monospace", fontSize: "7.5pt", fontWeight: 500, color: accent, letterSpacing: "2px", margin: "14px 0 8px" }}>{"// experience"}</div>{d.experience.map(e => <ExpEntry key={e.id} e={e} accent={accent} />)}</>}
          {sec.has("projects") && d.projects?.length > 0 && <><div style={{ fontFamily: "monospace", fontSize: "7.5pt", fontWeight: 500, color: accent, letterSpacing: "2px", margin: "14px 0 8px" }}>{"// projects"}</div><ProjectBlock items={d.projects} accent={accent} /></>}
          {sec.has("achievements") && d.achievements?.length > 0 && <><div style={{ fontFamily: "monospace", fontSize: "7.5pt", fontWeight: 500, color: accent, letterSpacing: "2px", margin: "14px 0 8px" }}>{"// achievements"}</div><AchievBlock items={d.achievements} /></>}
        </div>
        <div>
          {sec.has("skills") && <><div style={{ fontFamily: "monospace", fontSize: "7.5pt", fontWeight: 500, color: accent, letterSpacing: "2px", margin: "0 0 8px" }}>{"// skills"}</div><SkillsBlock skills={d.skills} accent={accent} mode="bar" /></>}
          {sec.has("education") && d.education?.length > 0 && <><div style={{ fontFamily: "monospace", fontSize: "7.5pt", fontWeight: 500, color: accent, letterSpacing: "2px", margin: "14px 0 8px" }}>{"// education"}</div>{d.education.map(e => <EduEntry key={e.id} e={e} accent={accent} />)}</>}
          {sec.has("certifications") && d.certifications?.length > 0 && <><div style={{ fontFamily: "monospace", fontSize: "7.5pt", fontWeight: 500, color: accent, letterSpacing: "2px", margin: "14px 0 8px" }}>{"// certs"}</div><CertBlock items={d.certifications} accent={accent} /></>}
          {sec.has("languages") && d.languages?.length > 0 && <><div style={{ fontFamily: "monospace", fontSize: "7.5pt", fontWeight: 500, color: accent, letterSpacing: "2px", margin: "14px 0 8px" }}>{"// languages"}</div><LangBlock items={d.languages} /></>}
        </div>
      </div>
    </div>
  );
}

function TplDiplomat({ d, sec, accent }) {
  const contacts = [d.email, d.phone, d.location, d.linkedin].filter(Boolean);
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "white", minHeight: A4_H, padding: "40px 44px" }}>
      <div style={{ textAlign: "center", borderBottom: `3px double ${accent}`, paddingBottom: 18, marginBottom: 22 }}>
        <div style={{ fontFamily: "Georgia,serif", fontSize: "32pt", fontWeight: 400, color: "#111", letterSpacing: "1px", marginBottom: 6 }}>{d.name}</div>
        <div style={{ fontSize: "9.5pt", fontWeight: 600, letterSpacing: "4px", textTransform: "uppercase", color: accent, marginBottom: 12 }}>{d.title}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 20px", justifyContent: "center" }}>{contacts.map((c, i) => <span key={i} style={{ fontSize: "8pt", color: "#555" }}>{c}</span>)}</div>
      </div>
      {sec.has("summary") && d.summary && <p style={{ fontSize: "10pt", color: "#333", lineHeight: 1.75, margin: "0 0 20px", textAlign: "center", maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>{d.summary}</p>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px", borderTop: `1px solid ${accent}44`, paddingTop: 16 }}>
        <div>
          {sec.has("experience") && d.experience?.length > 0 && <><SH label="Experience" color={accent} mode="line" />{d.experience.map(e => <ExpEntry key={e.id} e={e} accent={accent} />)}</>}
          {sec.has("projects") && d.projects?.length > 0 && <><SH label="Projects" color={accent} mode="line" /><ProjectBlock items={d.projects} accent={accent} /></>}
          {sec.has("achievements") && d.achievements?.length > 0 && <><SH label="Achievements" color={accent} mode="line" /><AchievBlock items={d.achievements} /></>}
          {sec.has("volunteer") && d.volunteer?.length > 0 && <><SH label="Volunteer" color={accent} mode="line" /><VolBlock items={d.volunteer} accent={accent} /></>}
        </div>
        <div>
          {sec.has("education") && d.education?.length > 0 && <><SH label="Education" color={accent} mode="line" />{d.education.map(e => <EduEntry key={e.id} e={e} accent={accent} />)}</>}
          {sec.has("skills") && <><SH label="Skills" color={accent} mode="line" /><SkillsBlock skills={d.skills} accent={accent} /></>}
          {sec.has("certifications") && d.certifications?.length > 0 && <><SH label="Certifications" color={accent} mode="line" /><CertBlock items={d.certifications} accent={accent} /></>}
          {sec.has("languages") && d.languages?.length > 0 && <><SH label="Languages" color={accent} mode="line" /><LangBlock items={d.languages} /></>}
          {sec.has("interests") && d.interests?.length > 0 && <><SH label="Interests" color={accent} mode="line" /><InterestBlock items={d.interests} /></>}
        </div>
      </div>
    </div>
  );
}

function TplTimeline({ d, sec, accent }) {
  const contacts = [d.email, d.phone, d.location, d.linkedin, d.github].filter(Boolean);
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "white", minHeight: A4_H }}>
      <div style={{ background: accent, padding: "28px 36px 22px", color: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20 }}>
          <div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: "28pt", fontWeight: 400, color: "white", lineHeight: 1.1, marginBottom: 5 }}>{d.name}</div>
            <div style={{ fontSize: "9pt", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,.75)" }}>{d.title}</div>
          </div>
          <div style={{ textAlign: "right" }}>{contacts.slice(0, 4).map((c, i) => <div key={i} style={{ fontSize: "8pt", color: "rgba(255,255,255,.8)", marginBottom: 3 }}>{c}</div>)}</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px" }}>
        <div style={{ padding: "22px 24px 22px 36px", borderRight: "1px solid #eee" }}>
          {sec.has("summary") && d.summary && <><SH label="Summary" color={accent} /><p style={{ fontSize: "9.5pt", color: "#333", lineHeight: 1.65, margin: 0 }}>{d.summary}</p></>}
          {sec.has("experience") && d.experience?.length > 0 && <><SH label="Experience" color={accent} /><div style={{ paddingLeft: 4 }}>{d.experience.map(e => <ExpEntry key={e.id} e={e} accent={accent} showDot />)}</div></>}
          {sec.has("projects") && d.projects?.length > 0 && <><SH label="Projects" color={accent} /><ProjectBlock items={d.projects} accent={accent} /></>}
          {sec.has("achievements") && d.achievements?.length > 0 && <><SH label="Achievements" color={accent} /><AchievBlock items={d.achievements} /></>}
          {sec.has("volunteer") && d.volunteer?.length > 0 && <><SH label="Volunteer" color={accent} /><VolBlock items={d.volunteer} accent={accent} /></>}
        </div>
        <div style={{ padding: "22px 20px" }}>
          {sec.has("education") && d.education?.length > 0 && <><SH label="Education" color={accent} />{d.education.map(e => <EduEntry key={e.id} e={e} accent={accent} />)}</>}
          {sec.has("skills") && <><SH label="Skills" color={accent} /><SkillsBlock skills={d.skills} accent={accent} mode="bar" /></>}
          {sec.has("certifications") && d.certifications?.length > 0 && <><SH label="Certs" color={accent} /><CertBlock items={d.certifications} accent={accent} /></>}
          {sec.has("languages") && d.languages?.length > 0 && <><SH label="Languages" color={accent} /><LangBlock items={d.languages} /></>}
          {sec.has("interests") && d.interests?.length > 0 && <><SH label="Interests" color={accent} /><InterestBlock items={d.interests} /></>}
        </div>
      </div>
    </div>
  );
}

const TPL_MAP = { nova: TplNova, executive: TplExecutive, carbon: TplCarbon, emerald: TplEmerald, minimal: TplMinimal, creative: TplCreative, tech: TplTech, diplomat: TplDiplomat, timeline: TplTimeline };

/* ══════════════════════════════════════════════════════
   FORM HELPERS
══════════════════════════════════════════════════════ */

const inputSt = { width: "100%", background: "#060612", border: "1px solid #1c1c2c", borderRadius: 6, padding: "7px 9px", color: "#d8d4cc", fontSize: 12, fontFamily: "inherit", outline: "none" };

function Field({ label, value, onChange, type = "text", multi, ph }) {
  return (
    <div style={{ marginBottom: 8 }}>
      {label && <div style={{ fontSize: 10, color: "#666", marginBottom: 3 }}>{label}</div>}
      {multi
        ? <textarea value={value} onChange={e => onChange(clean(e.target.value, 600))} placeholder={ph || label} rows={3} style={{ ...inputSt, resize: "vertical", lineHeight: 1.5 }} />
        : <input type={type} value={value} onChange={e => onChange(clean(e.target.value))} placeholder={ph || label} style={inputSt} />}
    </div>
  );
}

function TagInput({ tags, onAdd, onRemove, ph }) {
  const [v, setV] = useState("");
  const add = () => { const t = v.trim(); if (t) { onAdd(clean(t)); setV(""); } };
  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
        {tags.map((t, i) => <span key={i} style={{ background: "#13112a", border: "1px solid #28284a", borderRadius: 100, padding: "2px 8px", fontSize: 10, color: "#b8b4c8", display: "flex", alignItems: "center", gap: 4 }}>{t}<button onClick={() => onRemove(t)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 11, padding: 0, lineHeight: 1 }}>×</button></span>)}
      </div>
      <div style={{ display: "flex", gap: 5 }}>
        <input value={v} onChange={e => setV(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder={ph || "Type and press Enter"} style={{ ...inputSt, flex: 1 }} />
        <button onClick={add} style={{ background: "none", border: "1px dashed #1c1c2c", borderRadius: 6, color: "#555", padding: "0 10px", cursor: "pointer", fontSize: 12 }}>+</button>
      </div>
    </>
  );
}

function SkillEditor({ skills, onChange }) {
  const isObj = typeof skills === "object" && !Array.isArray(skills);
  if (!isObj) return (<><TagInput tags={skills || []} onAdd={v => onChange([...(skills || []), v])} onRemove={v => onChange((skills || []).filter(x => x !== v))} ph="Add skill" /><button onClick={() => onChange({})} style={{ marginTop: 5, background: "none", border: "1px dashed #1c1c2c", borderRadius: 6, color: "#555", padding: "4px 10px", cursor: "pointer", fontSize: 10, width: "100%" }}>Switch to categories</button></>);
  const addCat = () => { const n = prompt("Category name (e.g. Languages):"); if (n?.trim()) onChange({ ...skills, [n.trim()]: [] }); };
  const rmCat = c => { const s = { ...skills }; delete s[c]; onChange(s); };
  const addS = (c, v) => v && onChange({ ...skills, [c]: [...(skills[c] || []), v] });
  const rmS = (c, v) => onChange({ ...skills, [c]: (skills[c] || []).filter(x => x !== v) });
  return (<>{Object.keys(skills).map(cat => (<div key={cat} style={{ background: "#060612", border: "1px solid #18182a", borderRadius: 7, padding: "9px 10px", marginBottom: 6 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}><span style={{ fontSize: 11, color: "#d4a843", fontWeight: 600 }}>{cat}</span><button onClick={() => rmCat(cat)} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 13 }}>×</button></div><TagInput tags={skills[cat] || []} onAdd={v => addS(cat, v)} onRemove={v => rmS(cat, v)} ph={`Add ${cat} skill`} /></div>))}<div style={{ display: "flex", gap: 5 }}><button onClick={addCat} style={{ flex: 1, background: "none", border: "1px dashed #1c1c2c", borderRadius: 6, color: "#666", padding: "5px 10px", cursor: "pointer", fontSize: 11 }}>+ Add Category</button><button onClick={() => onChange(Object.values(skills).flat())} style={{ background: "none", border: "1px dashed #1c1c2c", borderRadius: 6, color: "#666", padding: "5px 10px", cursor: "pointer", fontSize: 11, whiteSpace: "nowrap" }}>Flatten</button></div></>);
}

function EntryEditor({ entries, onChange, fields, addLabel, hasBullets = false }) {
  const add = () => onChange([...entries, { id: Date.now(), ...Object.fromEntries(fields.map(f => [f.key, ""])), ...(hasBullets ? { bullets: [] } : {}) }]);
  const rm = id => onChange(entries.filter(e => e.id !== id));
  const set = (id, key, val) => onChange(entries.map(e => e.id === id ? { ...e, [key]: clean(val, key === "desc" || key === "text" ? 500 : 200) } : e));
  const addBullet = id => { const e = entries.find(x => x.id === id); if (e) onChange(entries.map(x => x.id === id ? { ...x, bullets: [...(x.bullets || []), ""] } : x)); };
  const setBullet = (id, i, val) => onChange(entries.map(e => e.id === id ? { ...e, bullets: (e.bullets || []).map((b, j) => j === i ? clean(val, 200) : b) } : e));
  const rmBullet = (id, i) => onChange(entries.map(e => e.id === id ? { ...e, bullets: (e.bullets || []).filter((_, j) => j !== i) } : e));
  return (<>{entries.map(e => (<div key={e.id} style={{ background: "#060612", border: "1px solid #18182a", borderRadius: 7, padding: "10px", marginBottom: 6, overflow: "hidden" }}><button onClick={() => rm(e.id)} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: 13, float: "right", lineHeight: 1 }}>×</button>{fields.map(f => <Field key={f.key} label={f.label} value={e[f.key] || ""} onChange={v => set(e.id, f.key, v)} multi={f.multi} ph={f.ph} />)}{hasBullets && (<div style={{ marginTop: 6 }}><div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>Bullet points</div>{(e.bullets || []).map((b, i) => (<div key={i} style={{ display: "flex", gap: 5, marginBottom: 4 }}><input value={b} onChange={ev => setBullet(e.id, i, ev.target.value)} placeholder="Key achievement or responsibility…" style={{ ...inputSt, flex: 1, fontSize: 11 }} /><button onClick={() => rmBullet(e.id, i)} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: 13 }}>×</button></div>))}<button onClick={() => addBullet(e.id)} style={{ width: "100%", marginTop: 3, background: "none", border: "1px dashed #1c1c2c", borderRadius: 5, color: "#555", padding: "4px 8px", cursor: "pointer", fontSize: 10 }}>+ Add bullet</button></div>)}</div>))}<button onClick={add} style={{ width: "100%", background: "none", border: "1px dashed #1c1c2c", borderRadius: 6, color: "#555", padding: "6px 10px", cursor: "pointer", fontSize: 11 }}>+ {addLabel}</button></>);
}

/* ══════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════ */

export default function App() {
  const [slotId,    setSlotId]    = useState(null);
  const [isBusy,    setIsBusy]    = useState(false);
  const [liveUsers, setLiveUsers] = useState(0);
  const [tpl,       setTpl]       = useState(DEFAULTS.template);
  const [accent,    setAccent]    = useState(DEFAULTS.accentColor);
  const [sections,  setSections]  = useState(new Set(DEFAULTS.sections));
  const [data,      setData]      = useState(DEF);
  const [pageCount, setPageCount] = useState(1);
  const [overLimit, setOverLimit] = useState(false);
  const resumeRef = useRef(null);
  const hbRef     = useRef(null);

  useEffect(() => {
    const count = liveCount(); setLiveUsers(count + 1);
    if (count >= MAX_WORKERS) { setIsBusy(true); return; }
    const id = claimSlot();
    if (!id) { setIsBusy(true); return; }
    setSlotId(id);
    hbRef.current = setInterval(() => { refreshSlot(id); setLiveUsers(liveCount()); }, HB_MS);
    return () => { clearInterval(hbRef.current); releaseSlot(id); };
  }, []);

  useEffect(() => {
    const el = resumeRef.current; if (!el) return;
    const obs = new ResizeObserver(() => { const p = Math.ceil(el.scrollHeight / A4_H); setPageCount(p); setOverLimit(p > MAX_PAGES); });
    obs.observe(el); return () => obs.disconnect();
  }, [data, sections, tpl, accent]);

  const setF = k => v => setData(d => ({ ...d, [k]: v }));
  const toggleSec = k => setSections(s => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });

  const retry = () => {
    const count = liveCount(); setLiveUsers(count + 1);
    if (count >= MAX_WORKERS) { setIsBusy(true); return; }
    const id = claimSlot();
    if (!id) { setIsBusy(true); return; }
    setSlotId(id); setIsBusy(false);
    hbRef.current = setInterval(() => { refreshSlot(id); setLiveUsers(liveCount()); }, HB_MS);
  };

  const fillPct  = Math.min(100, Math.round((liveUsers / MAX_WORKERS) * 100));
  const dotColor = fillPct >= 90 ? "#f87171" : fillPct >= 70 ? "#f59e0b" : "#4ade80";
  const dotAnim  = fillPct < 90 ? "pulse 2s infinite" : "none";
  const badgeBg  = overLimit ? "#1a0a0a" : pageCount >= 2 ? "#1a1200" : "#0d1a0d";
  const badgeClr = overLimit ? "#f87171" : pageCount >= 2 ? "#f59e0b" : "#4ade80";
  const Resume   = TPL_MAP[tpl];
  const curTpl   = TEMPLATES.find(t => t.id === tpl);

  const GLOBAL_CSS = `
    @import url('${RESUME.fontsUrl}');
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
    * { box-sizing: border-box; }
    body { background:#0c0c12; color:#d8d4cc; font-family:'DM Sans',sans-serif; margin:0; }
    ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-thumb { background:#2a2a38; border-radius:3px; }
    input,textarea,button,select { font-family:'DM Sans',sans-serif; }
    input:focus,textarea:focus { border-color:#d4a843 !important; }
    @media print {
      *,-webkit-print-color-adjust { -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; }
      @page { size:A4 portrait; margin:0; }
      html,body { background:white!important; margin:0!important; padding:0!important; }
      /* Hide every UI element */
      #rf-nav,
      #rf-form,
      #rf-pvhdr,
      #rf-shell,
      #rf-pv { display:none!important; }
      /* Show only the dedicated print container */
      #rf-print { display:block!important; }
      #rf-print .print-page {
        width:210mm;
        min-height:297mm;
        page-break-after:always;
        page-break-inside:avoid;
        overflow:hidden;
        background:white;
        margin:0;
        padding:0;
      }
      #rf-print .print-page:last-child { page-break-after:avoid; }
    }
    @media(max-width:960px) {
      #rf-shell { flex-direction:column!important; padding:12px!important; }
      #rf-form  { width:100%!important; max-height:none!important; position:static!important; margin-bottom:16px; }
    }
  `;

  const fsHead = { fontSize: 8.5, letterSpacing: "2.5px", textTransform: "uppercase", color: "#d4a843", fontWeight: 600, borderBottom: "1px solid #18182a", paddingBottom: 4, marginBottom: 10 };
  const secSt = on => ({ display: "inline-flex", alignItems: "center", gap: 3, background: on ? "#14120a" : "#0d0d18", border: `1px solid ${on ? "#d4a843" : "#1c1c28"}`, borderRadius: 100, padding: "3px 9px", fontSize: 10, color: on ? "#d4a843" : "#666", cursor: "pointer", margin: "0 4px 4px 0", fontWeight: on ? 500 : 400, userSelect: "none" });

  if (isBusy) return (
    <><style>{GLOBAL_CSS}</style>
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#0c0c12" }}>
        <div style={{ background: "#0e0e18", border: "1px solid #2a1818", borderRadius: 18, padding: "48px 40px", maxWidth: 400, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>⚙</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: "#f0ece4", marginBottom: 8 }}>All Workers Are Busy</div>
          <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, marginBottom: 20 }}>{APP.name} is at capacity ({MAX_WORKERS.toLocaleString()} concurrent users). Slots open frequently — please retry shortly.</p>
          <div style={{ height: 7, background: "#1a1a22", borderRadius: 100, overflow: "hidden", marginBottom: 5 }}><div style={{ height: 7, width: "100%", borderRadius: 100, background: "linear-gradient(90deg,#e87070,#c04040)" }} /></div>
          <div style={{ fontFamily: "monospace", fontSize: 10, color: "#444", marginBottom: 24 }}><b style={{ color: "#e87070" }}>{MAX_WORKERS.toLocaleString()}</b> / {MAX_WORKERS.toLocaleString()} workers active</div>
          <button onClick={retry} style={{ background: "linear-gradient(135deg,#d4a843,#c08828)", border: "none", borderRadius: 10, padding: "12px 28px", fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: "#0a0a0e", cursor: "pointer" }}>Retry</button>
        </div>
      </div>
    </>
  );

  return (
    <><style>{GLOBAL_CSS}</style>

      {/* ── PRINT-ONLY: hidden in browser, shown only during window.print() ── */}
      <div id="rf-print" style={{ display: "none" }}>
        <div className="print-page">
          <Resume d={data} sec={sections} accent={accent} />
        </div>
      </div>

      {/* NAV */}
      <nav id="rf-nav" style={{ position: "sticky", top: 0, zIndex: 200, background: "rgba(12,12,18,.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid #1a1a24", display: "flex", alignItems: "center", padding: "13px 32px", gap: 16 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 19, fontWeight: 800, background: "linear-gradient(135deg,#d4a843,#f0c060)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginRight: 8, whiteSpace: "nowrap" }}>{APP.name}</div>

        {FEATURES.showCapacityBadge && (
          <div style={{ display: "flex", alignItems: "center", gap: 9, background: "#0e0e18", border: "1px solid #1c1c28", borderRadius: 100, padding: "5px 14px 5px 10px" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor, animation: dotAnim, flexShrink: 0 }} />
            <span style={{ fontFamily: "monospace", fontSize: 11, color: "#666", whiteSpace: "nowrap" }}>
              <b style={{ color: "#d4a843", fontWeight: 500 }}>{liveUsers.toLocaleString()}</b> / {MAX_WORKERS.toLocaleString()} active
            </span>
            <div style={{ width: 64, height: 3, background: "#1c1c28", borderRadius: 100, overflow: "hidden" }}>
              <div style={{ height: 3, width: `${fillPct}%`, background: dotColor, borderRadius: 100, transition: "width .6s,background .6s" }} />
            </div>
          </div>
        )}

        <span style={{ marginLeft: "auto", fontFamily: "monospace", fontSize: 10, color: "#2a2a38" }}>{APP.tagline}</span>
      </nav>

      {/* SHELL */}
      <div id="rf-shell" style={{ display: "flex", maxWidth: 1440, margin: "0 auto", padding: "24px 28px 60px", alignItems: "flex-start", gap: 20 }}>

        {/* FORM */}
        <div id="rf-form" style={{ width: 308, flexShrink: 0, background: "#0d0d16", border: "1px solid #18182a", borderRadius: 14, padding: 18, maxHeight: "calc(100vh - 88px)", overflowY: "auto", position: "sticky", top: 66 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: "#d8d4cc", marginBottom: 14 }}>Build Your Resume</div>

          {/* Template picker */}
          {FEATURES.showTemplatePicker && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 8, letterSpacing: "2.5px", textTransform: "uppercase", color: "#3a3a4a", marginBottom: 8, fontWeight: 600 }}>Template</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 14 }}>
                {TEMPLATES.map(t => (
                  <div key={t.id} onClick={() => { setTpl(t.id); setAccent(t.accent); }} style={{ cursor: "pointer", border: `1.5px solid ${tpl === t.id ? "#d4a843" : "#1c1c28"}`, borderRadius: 8, padding: "8px 9px", background: tpl === t.id ? "#13110a" : "#09090f", position: "relative", transition: "all .15s" }}>
                    <div style={{ height: 32, borderRadius: 4, background: t.accent, marginBottom: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.5)" }}>{t.name[0]}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: tpl === t.id ? "#d4a843" : "#aaa", marginBottom: 1 }}>{t.name}</div>
                    <div style={{ fontSize: 9, color: "#444" }}>{t.desc.split("·")[0].trim()}</div>
                    {tpl === t.id && <div style={{ position: "absolute", top: 4, right: 6, fontSize: 9, color: "#d4a843", fontWeight: 700 }}>✓</div>}
                  </div>
                ))}
              </div>

              {FEATURES.showColorPicker && (
                <>
                  <div style={{ fontSize: 8, letterSpacing: "2.5px", textTransform: "uppercase", color: "#3a3a4a", marginBottom: 7, fontWeight: 600 }}>Accent Color</div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 4 }}>
                    {COLOR_PRESETS.map(c => (
                      <div key={c} onClick={() => setAccent(c)} title={c} style={{ width: 22, height: 22, borderRadius: "50%", background: c, cursor: "pointer", border: accent === c ? "2.5px solid white" : "2px solid transparent", transform: accent === c ? "scale(1.15)" : "scale(1)", transition: "transform .15s", flexShrink: 0 }} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Section toggles */}
          {FEATURES.showSectionToggles && (
            <div style={{ background: "#09090f", border: "1px solid #18182a", borderRadius: 9, padding: 11, marginBottom: 16 }}>
              <div style={{ fontSize: 8, letterSpacing: "2px", textTransform: "uppercase", color: "#3a3a4a", marginBottom: 8, fontWeight: 600 }}>Sections</div>
              <div>{ALL_SECTIONS.map(s => <span key={s.key} style={secSt(sections.has(s.key))} onClick={() => toggleSec(s.key)}>{sections.has(s.key) ? "✓" : "+"} {s.label}</span>)}</div>
            </div>
          )}

          {/* Personal */}
          <div style={{ marginBottom: 18 }}>
            <div style={fsHead}>Personal Details</div>
            <Field label="Full Name"   value={data.name}      onChange={setF("name")} />
            <Field label="Job Title"   value={data.title}     onChange={setF("title")} />
            <Field label="Email"       value={data.email}     onChange={setF("email")}   type="email" />
            <Field label="Phone"       value={data.phone}     onChange={setF("phone")}   type="tel" />
            <Field label="Location"    value={data.location}  onChange={setF("location")} />
            <Field label="LinkedIn"    value={data.linkedin}  onChange={setF("linkedin")} />
            <Field label="GitHub"      value={data.github}    onChange={setF("github")} />
            <Field label="Website"     value={data.website}   onChange={setF("website")} />
          </div>

          {sections.has("summary") && <div style={{ marginBottom: 18 }}><div style={fsHead}>Professional Summary</div><Field value={data.summary} onChange={setF("summary")} multi ph="3–4 sentences: your role, key strengths, and biggest impact." /></div>}

          {sections.has("experience") && <div style={{ marginBottom: 18 }}><div style={fsHead}>Work Experience</div><EntryEditor entries={data.experience} onChange={setF("experience")} addLabel="Add Position" hasBullets fields={[{ key: "role", label: "Job Title", ph: "Senior Software Engineer" }, { key: "company", label: "Company" }, { key: "location", label: "Location", ph: "City / Remote" }, { key: "duration", label: "Duration", ph: "Jan 2022 – Present" }]} /></div>}

          {sections.has("education") && <div style={{ marginBottom: 18 }}><div style={fsHead}>Education</div><EntryEditor entries={data.education} onChange={setF("education")} addLabel="Add Degree" fields={[{ key: "degree", label: "Degree", ph: "B.S. Computer Science" }, { key: "school", label: "University" }, { key: "duration", label: "Year", ph: "2013 – 2017" }, { key: "grade", label: "GPA / Grade" }, { key: "notes", label: "Activities / Honors" }]} /></div>}

          {sections.has("skills") && <div style={{ marginBottom: 18 }}><div style={fsHead}>Skills</div><SkillEditor skills={data.skills} onChange={setF("skills")} /></div>}

          {sections.has("projects") && <div style={{ marginBottom: 18 }}><div style={fsHead}>Projects</div><EntryEditor entries={data.projects} onChange={setF("projects")} addLabel="Add Project" fields={[{ key: "name", label: "Project Name" }, { key: "tech", label: "Tech Stack", ph: "React, Node.js, PostgreSQL" }, { key: "link", label: "Link", ph: "github.com/…" }, { key: "desc", label: "Description", multi: true }]} /></div>}

          {sections.has("certifications") && <div style={{ marginBottom: 18 }}><div style={fsHead}>Certifications</div><EntryEditor entries={data.certifications} onChange={setF("certifications")} addLabel="Add Certification" fields={[{ key: "name", label: "Certificate Name" }, { key: "issuer", label: "Issuer", ph: "AWS / Google / Microsoft" }, { key: "year", label: "Year", ph: "2023" }]} /></div>}

          {sections.has("achievements") && <div style={{ marginBottom: 18 }}><div style={fsHead}>Achievements</div><EntryEditor entries={data.achievements} onChange={setF("achievements")} addLabel="Add Achievement" fields={[{ key: "text", label: "Achievement", multi: true, ph: "Winner, Hackathon 2023 — 500+ participants" }]} /></div>}

          {sections.has("languages") && <div style={{ marginBottom: 18 }}><div style={fsHead}>Languages</div><EntryEditor entries={data.languages} onChange={setF("languages")} addLabel="Add Language" fields={[{ key: "name", label: "Language", ph: "English" }, { key: "level", label: "Proficiency", ph: "Native / Fluent / Intermediate" }]} /></div>}

          {sections.has("volunteer") && <div style={{ marginBottom: 18 }}><div style={fsHead}>Volunteer Work</div><EntryEditor entries={data.volunteer} onChange={setF("volunteer")} addLabel="Add Role" fields={[{ key: "role", label: "Role" }, { key: "org", label: "Organisation" }, { key: "duration", label: "Duration" }, { key: "desc", label: "Description", multi: true }]} /></div>}

          {sections.has("interests") && <div style={{ marginBottom: 18 }}><div style={fsHead}>Interests</div><TagInput tags={data.interests || []} onAdd={v => setF("interests")([...(data.interests || []), v])} onRemove={v => setF("interests")((data.interests || []).filter(x => x !== v))} ph="Add interest" /></div>}

          {overLimit && <div style={{ background: "#14100a", border: "1px solid #3a2a0a", borderRadius: 7, padding: "9px 11px", fontSize: 11, color: "#d4a843", marginBottom: 10, fontWeight: 500 }}>⚠ Resume exceeds {MAX_PAGES} pages. Shorten descriptions or remove sections.</div>}

          <button
            onClick={() => {
              // Small delay lets React flush any pending state before printing
              setTimeout(() => window.print(), 120);
            }}
            style={{ width: "100%", marginTop: 12, background: "linear-gradient(135deg,#d4a843,#b88830)", border: "none", borderRadius: 10, padding: 12, fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: "#0a0a0e", cursor: "pointer" }}>
            ⬇ Download PDF (A4)
          </button>
          <div style={{ textAlign: "center", fontSize: 9.5, color: "#2a2a3a", marginTop: 6, lineHeight: 1.6 }}>
            Print dialog → <b style={{ color: "#555" }}>Save as PDF</b> · Paper: <b style={{ color: "#555" }}>A4</b> · Margins: <b style={{ color: "#555" }}>None</b> · Background graphics: <b style={{ color: "#555" }}>ON</b>
          </div>
        </div>

        {/* PREVIEW */}
        <div id="rf-pv" style={{ flex: 1, minWidth: 0 }}>
          <div id="rf-pvhdr" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontFamily: "monospace", fontSize: 10, color: "#3a3a4a", letterSpacing: 1 }}>A4 LIVE PREVIEW · 794×1123px · {curTpl?.name?.toUpperCase()} · MAX {MAX_PAGES} PAGES</span>
            <span style={{ fontFamily: "monospace", fontSize: 10, padding: "3px 10px", borderRadius: 100, border: `1px solid ${badgeClr}44`, color: badgeClr, background: badgeBg }}>
              {overLimit ? `${pageCount} pages — over limit` : pageCount === 1 ? "1 page" : `${pageCount} pages`}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="pg-wrap">
              <div style={{ fontFamily: "monospace", fontSize: 9, color: "#2a2a38", marginBottom: 5, letterSpacing: 1 }}>Page 1</div>
              <div style={{ boxShadow: "0 8px 48px rgba(0,0,0,.55)", width: A4_W, overflow: "hidden", background: "white" }}>
                <div ref={resumeRef}><Resume d={data} sec={sections} accent={accent} /></div>
              </div>
            </div>
            {pageCount >= 2 && (
              <div className="pg-wrap">
                <div style={{ fontFamily: "monospace", fontSize: 9, color: overLimit ? "#f87171" : "#4ade80", marginBottom: 5, letterSpacing: 1 }}>Page 2{overLimit ? " — over limit" : ""}</div>
                <div style={{ boxShadow: "0 8px 48px rgba(0,0,0,.55)", width: A4_W, height: 56, background: "#f8f8f8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 10, color: "#aaa" }}>Content continues on page 2 in the printed PDF</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
