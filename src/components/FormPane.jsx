// src/components/FormPane.jsx
import { useState, useRef, useCallback } from 'react';
import {
  IcoPlus, IcoTrash, IcoChevron, IcoSparkle, IcoGrip,
} from '../icons.jsx';

/* ── tiny helpers ──────────────────────────────────────────── */
const clean = (v, max = 500) =>
  String(v ?? '').replace(/<[^>]*>/g, '').slice(0, max);

function CharHint({ value, max }) {
  const len = String(value ?? '').length;
  const cls = len > max ? 'char-hint over' : len > max * 0.85 ? 'char-hint warn' : 'char-hint';
  return <div className={cls}>{len} / {max}</div>;
}

function SectionCard({ id, title, icon, badge, badgeType = 'done', children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="sec-card" id={`card-${id}`}>
      <div
        className="sec-card-head"
        onClick={() => setOpen(o => !o)}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={`card-body-${id}`}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setOpen(o => !o)}
      >
        <span className="sec-card-title">
          {icon && <span style={{ opacity: 0.65 }} aria-hidden="true">{icon}</span>}
          {title}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {badge && <span className={`badge badge-${badgeType}`}>{badge}</span>}
          <IcoChevron size={13} dir={open ? 'up' : 'down'} style={{ color: 'var(--tx-muted)', flexShrink: 0 }} />
        </div>
      </div>
      <div
        id={`card-body-${id}`}
        className={`sec-card-body${open ? '' : ' collapsed'}`}
        aria-hidden={!open}
      >
        {children}
      </div>
    </div>
  );
}

function FieldRow({ children, cols }) {
  const cls = cols === 3 ? 'field-row cols3' : cols === 1 ? 'field-row full' : 'field-row';
  return <div className={cls}>{children}</div>;
}

function Field({ label, hint, children }) {
  return (
    <div className="field">
      <label className="field-label">
        {label}
        {hint && <span className="field-hint">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

/* ── Main component ────────────────────────────────────────── */
/**
 * Props:
 *   data               object  — full resume data
 *   onChange           (path, value) => void
 *   enabledSections    Set<string>
 *   activeSection      string
 *   onSectionActivate  (key) => void
 *   featureFlags       object  { enableSkillBars, enableInterests, enableVolunteer }
 */
export default function FormPane({
  data,
  onChange,
  enabledSections,
  activeSection,
  featureFlags = {},
}) {
  /* ── scroll to card on activeSection change ── */
  const scrollRef = useRef(null);

  const scrollToSection = useCallback((key) => {
    const el = document.getElementById(`card-${key}`);
    if (el && scrollRef.current) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Expose scroll method via ref for parent
  // (parent calls this after clicking sidebar)
  const prevActive = useRef('');
  if (activeSection !== prevActive.current) {
    prevActive.current = activeSection;
    setTimeout(() => scrollToSection(activeSection), 50);
  }

  /* ── helpers ── */
  const inp  = (field, max = 200) => ({
    className: 'inp',
    value: data[field] ?? '',
    onChange: e => onChange(field, clean(e.target.value, max)),
    'aria-label': field,
  });

  const txa = (field, max = 1000) => ({
    className: 'txa',
    value: data[field] ?? '',
    onChange: e => onChange(field, clean(e.target.value, max)),
    'aria-label': field,
  });

  /* ── Experience entries ── */
  const [expOpen, setExpOpen] = useState([true]);

  /* ── Education entries ── */
  const [eduOpen, setEduOpen] = useState([true]);

  /* ── Skill input ── */
  const [skillInput, setSkillInput] = useState('');

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s) return;
    const cats = data.skillCategories || [];
    if (cats.length === 0) {
      onChange('skillCategories', [{ name: 'Skills', items: [s] }]);
    } else {
      const updated = cats.map((c, i) =>
        i === 0 ? { ...c, items: [...(c.items || []), s] } : c
      );
      onChange('skillCategories', updated);
    }
    setSkillInput('');
  };

  const removeSkill = (catIdx, itemIdx) => {
    const cats = (data.skillCategories || []).map((c, ci) =>
      ci === catIdx
        ? { ...c, items: c.items.filter((_, ii) => ii !== itemIdx) }
        : c
    );
    onChange('skillCategories', cats);
  };

  const allSkills = (data.skillCategories || []).flatMap((c, ci) =>
    (c.items || []).map((s, ii) => ({ s, ci, ii }))
  );

  /* ── Completion badge helper ── */
  const fieldFilled = (...fields) => fields.every(f => String(data[f] ?? '').trim().length > 0);

  return (
    <div className="form-pane">
      <div className="form-scroll" ref={scrollRef}>

        {/* ── BASICS ───────────────────────────────────────── */}
        <SectionCard
          id="basics"
          title="Personal info"
          badge={fieldFilled('name','email','phone','location') ? 'Complete' : 'Incomplete'}
          badgeType={fieldFilled('name','email','phone','location') ? 'done' : 'partial'}
        >
          <FieldRow>
            <Field label="Full name">
              <input {...inp('name', 100)} placeholder="e.g. Arjun Sharma" />
            </Field>
            <Field label="Job title">
              <input {...inp('title', 100)} placeholder="e.g. Senior Designer" />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label="Email">
              <input {...inp('email', 120)} type="email" placeholder="you@example.com" />
            </Field>
            <Field label="Phone">
              <input {...inp('phone', 30)} type="tel" placeholder="+91 98765 43210" />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label="Location">
              <input {...inp('location', 80)} placeholder="City, Country" />
            </Field>
            <Field label="LinkedIn / Portfolio">
              <input {...inp('linkedin', 120)} placeholder="linkedin.com/in/you" />
            </Field>
          </FieldRow>
          <FieldRow cols={1}>
            <Field label="GitHub / Website" hint="optional">
              <input {...inp('website', 120)} placeholder="github.com/you" />
            </Field>
          </FieldRow>
        </SectionCard>

        {/* ── SUMMARY ──────────────────────────────────────── */}
        {enabledSections.has('summary') && (
          <SectionCard
            id="summary"
            title="Professional summary"
            badge={String(data.summary ?? '').trim().length > 20 ? 'Added' : 'Empty'}
            badgeType={String(data.summary ?? '').trim().length > 20 ? 'done' : 'empty'}
          >
            <Field label="Summary" hint="2–4 sentences, under 300 chars">
              <textarea {...txa('summary', 300)} rows={4}
                placeholder="Experienced professional with X years in... Passionate about..." />
              <CharHint value={data.summary} max={300} />
            </Field>
          </SectionCard>
        )}

        {/* ── EXPERIENCE ───────────────────────────────────── */}
        {enabledSections.has('experience') && (
          <SectionCard
            id="experience"
            title="Experience"
            badge={`${(data.experience || []).length} ${(data.experience || []).length === 1 ? 'role' : 'roles'}`}
            badgeType={(data.experience || []).length > 0 ? 'done' : 'empty'}
          >
            {(data.experience || []).map((exp, idx) => (
              <div className="entry-block" key={idx}>
                <div className="entry-block-handle">
                  <IcoGrip size={12} style={{ color: 'var(--tx-hint)', cursor: 'grab' }} title="Drag to reorder" />
                  <button
                    className="btn-icon btn"
                    onClick={() => {
                      const updated = (data.experience || []).filter((_, i) => i !== idx);
                      onChange('experience', updated);
                    }}
                    aria-label={`Remove role ${idx + 1}`}
                    title="Remove"
                    style={{ marginLeft: 2 }}
                  >
                    <IcoTrash size={12} />
                  </button>
                </div>

                <FieldRow>
                  <Field label="Job title">
                    <input
                      className="inp"
                      value={exp.role ?? ''}
                      onChange={e => {
                        const updated = [...(data.experience || [])];
                        updated[idx] = { ...updated[idx], role: clean(e.target.value, 100) };
                        onChange('experience', updated);
                      }}
                      placeholder="e.g. Senior Designer"
                    />
                  </Field>
                  <Field label="Company">
                    <input
                      className="inp"
                      value={exp.company ?? ''}
                      onChange={e => {
                        const updated = [...(data.experience || [])];
                        updated[idx] = { ...updated[idx], company: clean(e.target.value, 100) };
                        onChange('experience', updated);
                      }}
                      placeholder="e.g. Acme Corp"
                    />
                  </Field>
                </FieldRow>
                <FieldRow>
                  <Field label="Start date">
                    <input
                      className="inp"
                      value={exp.from ?? ''}
                      onChange={e => {
                        const updated = [...(data.experience || [])];
                        updated[idx] = { ...updated[idx], from: clean(e.target.value, 20) };
                        onChange('experience', updated);
                      }}
                      placeholder="Jan 2021"
                    />
                  </Field>
                  <Field label="End date">
                    <input
                      className="inp"
                      value={exp.to ?? ''}
                      onChange={e => {
                        const updated = [...(data.experience || [])];
                        updated[idx] = { ...updated[idx], to: clean(e.target.value, 20) };
                        onChange('experience', updated);
                      }}
                      placeholder="Present"
                    />
                  </Field>
                </FieldRow>
                <Field label="Location" hint="optional">
                  <input
                    className="inp"
                    value={exp.location ?? ''}
                    onChange={e => {
                      const updated = [...(data.experience || [])];
                      updated[idx] = { ...updated[idx], location: clean(e.target.value, 80) };
                      onChange('experience', updated);
                    }}
                    placeholder="City or Remote"
                  />
                </Field>
                <Field label="Bullet points" hint="one per line">
                  <textarea
                    className="txa"
                    rows={3}
                    value={(exp.bullets || []).join('\n')}
                    onChange={e => {
                      const updated = [...(data.experience || [])];
                      updated[idx] = {
                        ...updated[idx],
                        bullets: e.target.value.split('\n').map(l => clean(l, 200)),
                      };
                      onChange('experience', updated);
                    }}
                    placeholder="Led redesign of checkout — reduced drop-off by 34%&#10;Managed design system across 5 teams"
                  />
                </Field>
              </div>
            ))}

            <button
              className="btn btn-dashed btn-sm"
              onClick={() => {
                onChange('experience', [
                  ...(data.experience || []),
                  { role: '', company: '', from: '', to: '', location: '', bullets: [] },
                ]);
              }}
            >
              <IcoPlus size={12} />
              Add role
            </button>
          </SectionCard>
        )}

        {/* ── EDUCATION ────────────────────────────────────── */}
        {enabledSections.has('education') && (
          <SectionCard
            id="education"
            title="Education"
            badge={`${(data.education || []).length} ${(data.education || []).length === 1 ? 'entry' : 'entries'}`}
            badgeType={(data.education || []).length > 0 ? 'done' : 'empty'}
          >
            {(data.education || []).map((edu, idx) => (
              <div className="entry-block" key={idx}>
                <div className="entry-block-handle">
                  <button
                    className="btn-icon btn"
                    onClick={() => {
                      const updated = (data.education || []).filter((_, i) => i !== idx);
                      onChange('education', updated);
                    }}
                    aria-label={`Remove education ${idx + 1}`}
                    title="Remove"
                  >
                    <IcoTrash size={12} />
                  </button>
                </div>

                <FieldRow>
                  <Field label="Degree / Qualification">
                    <input
                      className="inp"
                      value={edu.degree ?? ''}
                      onChange={e => {
                        const updated = [...(data.education || [])];
                        updated[idx] = { ...updated[idx], degree: clean(e.target.value, 120) };
                        onChange('education', updated);
                      }}
                      placeholder="B.Des. Visual Communication"
                    />
                  </Field>
                  <Field label="Institution">
                    <input
                      className="inp"
                      value={edu.school ?? ''}
                      onChange={e => {
                        const updated = [...(data.education || [])];
                        updated[idx] = { ...updated[idx], school: clean(e.target.value, 120) };
                        onChange('education', updated);
                      }}
                      placeholder="MIT Institute of Design"
                    />
                  </Field>
                </FieldRow>
                <FieldRow>
                  <Field label="Start year">
                    <input
                      className="inp"
                      value={edu.from ?? ''}
                      onChange={e => {
                        const updated = [...(data.education || [])];
                        updated[idx] = { ...updated[idx], from: clean(e.target.value, 10) };
                        onChange('education', updated);
                      }}
                      placeholder="2015"
                    />
                  </Field>
                  <Field label="End year">
                    <input
                      className="inp"
                      value={edu.to ?? ''}
                      onChange={e => {
                        const updated = [...(data.education || [])];
                        updated[idx] = { ...updated[idx], to: clean(e.target.value, 10) };
                        onChange('education', updated);
                      }}
                      placeholder="2019"
                    />
                  </Field>
                </FieldRow>
                <Field label="Grade / GPA" hint="optional">
                  <input
                    className="inp"
                    value={edu.grade ?? ''}
                    onChange={e => {
                      const updated = [...(data.education || [])];
                      updated[idx] = { ...updated[idx], grade: clean(e.target.value, 30) };
                      onChange('education', updated);
                    }}
                    placeholder="8.5 CGPA or First Class"
                  />
                </Field>
              </div>
            ))}

            <button
              className="btn btn-dashed btn-sm"
              onClick={() => {
                onChange('education', [
                  ...(data.education || []),
                  { degree: '', school: '', from: '', to: '', grade: '' },
                ]);
              }}
            >
              <IcoPlus size={12} />
              Add education
            </button>
          </SectionCard>
        )}

        {/* ── SKILLS ───────────────────────────────────────── */}
        {enabledSections.has('skills') && (
          <SectionCard
            id="skills"
            title="Skills"
            badge={`${allSkills.length} added`}
            badgeType={allSkills.length > 0 ? 'done' : 'empty'}
          >
            <div className="skill-pills">
              {allSkills.map(({ s, ci, ii }) => (
                <span key={`${ci}-${ii}`} className="skill-pill">
                  {s}
                  <button
                    className="skill-pill-remove"
                    onClick={() => removeSkill(ci, ii)}
                    aria-label={`Remove skill ${s}`}
                  >×</button>
                </span>
              ))}
              <span
                className="skill-pill skill-pill-add"
                role="button"
                tabIndex={0}
                onClick={() => document.getElementById('skill-inp')?.focus()}
              >
                <IcoPlus size={11} /> Add skill
              </span>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <input
                id="skill-inp"
                className="inp"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                placeholder="Type a skill and press Enter"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); }}}
                style={{ flex: 1 }}
              />
              <button className="btn btn-ghost btn-sm" onClick={addSkill}>Add</button>
            </div>
          </SectionCard>
        )}

        {/* ── PROJECTS ─────────────────────────────────────── */}
        {enabledSections.has('projects') && (
          <SectionCard
            id="projects"
            title="Projects"
            badge={`${(data.projects || []).length} added`}
            badgeType={(data.projects || []).length > 0 ? 'done' : 'empty'}
            defaultOpen={false}
          >
            {(data.projects || []).map((proj, idx) => (
              <div className="entry-block" key={idx}>
                <div className="entry-block-handle">
                  <button
                    className="btn-icon btn"
                    onClick={() => {
                      const updated = (data.projects || []).filter((_, i) => i !== idx);
                      onChange('projects', updated);
                    }}
                    title="Remove"
                  >
                    <IcoTrash size={12} />
                  </button>
                </div>
                <FieldRow>
                  <Field label="Project name">
                    <input
                      className="inp"
                      value={proj.name ?? ''}
                      onChange={e => {
                        const updated = [...(data.projects || [])];
                        updated[idx] = { ...updated[idx], name: clean(e.target.value, 100) };
                        onChange('projects', updated);
                      }}
                      placeholder="Project name"
                    />
                  </Field>
                  <Field label="Tech / Stack">
                    <input
                      className="inp"
                      value={proj.tech ?? ''}
                      onChange={e => {
                        const updated = [...(data.projects || [])];
                        updated[idx] = { ...updated[idx], tech: clean(e.target.value, 100) };
                        onChange('projects', updated);
                      }}
                      placeholder="React, Node.js"
                    />
                  </Field>
                </FieldRow>
                <FieldRow>
                  <Field label="URL" hint="optional">
                    <input
                      className="inp"
                      value={proj.url ?? ''}
                      onChange={e => {
                        const updated = [...(data.projects || [])];
                        updated[idx] = { ...updated[idx], url: clean(e.target.value, 150) };
                        onChange('projects', updated);
                      }}
                      placeholder="github.com/you/project"
                    />
                  </Field>
                </FieldRow>
                <Field label="Description">
                  <textarea
                    className="txa"
                    rows={2}
                    value={proj.description ?? ''}
                    onChange={e => {
                      const updated = [...(data.projects || [])];
                      updated[idx] = { ...updated[idx], description: clean(e.target.value, 300) };
                      onChange('projects', updated);
                    }}
                    placeholder="What it does and your impact"
                  />
                </Field>
              </div>
            ))}

            <button
              className="btn btn-dashed btn-sm"
              onClick={() => {
                onChange('projects', [
                  ...(data.projects || []),
                  { name: '', tech: '', url: '', description: '' },
                ]);
              }}
            >
              <IcoPlus size={12} />
              Add project
            </button>
          </SectionCard>
        )}

        {/* ── CERTIFICATIONS ───────────────────────────────── */}
        {enabledSections.has('certifications') && (
          <SectionCard
            id="certifications"
            title="Certifications"
            badge={`${(data.certifications || []).length} added`}
            badgeType={(data.certifications || []).length > 0 ? 'done' : 'empty'}
            defaultOpen={false}
          >
            {(data.certifications || []).map((cert, idx) => (
              <div className="entry-block" key={idx}>
                <div className="entry-block-handle">
                  <button
                    className="btn-icon btn"
                    onClick={() => {
                      const updated = (data.certifications || []).filter((_, i) => i !== idx);
                      onChange('certifications', updated);
                    }}
                    title="Remove"
                  >
                    <IcoTrash size={12} />
                  </button>
                </div>
                <FieldRow>
                  <Field label="Certification name">
                    <input
                      className="inp"
                      value={cert.name ?? ''}
                      onChange={e => {
                        const updated = [...(data.certifications || [])];
                        updated[idx] = { ...updated[idx], name: clean(e.target.value, 120) };
                        onChange('certifications', updated);
                      }}
                      placeholder="AWS Solutions Architect"
                    />
                  </Field>
                  <Field label="Issuer">
                    <input
                      className="inp"
                      value={cert.issuer ?? ''}
                      onChange={e => {
                        const updated = [...(data.certifications || [])];
                        updated[idx] = { ...updated[idx], issuer: clean(e.target.value, 80) };
                        onChange('certifications', updated);
                      }}
                      placeholder="Amazon Web Services"
                    />
                  </Field>
                </FieldRow>
                <Field label="Year">
                  <input
                    className="inp"
                    value={cert.year ?? ''}
                    onChange={e => {
                      const updated = [...(data.certifications || [])];
                      updated[idx] = { ...updated[idx], year: clean(e.target.value, 10) };
                      onChange('certifications', updated);
                    }}
                    placeholder="2023"
                    style={{ width: '50%' }}
                  />
                </Field>
              </div>
            ))}

            <button
              className="btn btn-dashed btn-sm"
              onClick={() => {
                onChange('certifications', [
                  ...(data.certifications || []),
                  { name: '', issuer: '', year: '' },
                ]);
              }}
            >
              <IcoPlus size={12} />
              Add certification
            </button>
          </SectionCard>
        )}

        {/* ── LANGUAGES ────────────────────────────────────── */}
        {enabledSections.has('languages') && (
          <SectionCard
            id="languages"
            title="Languages"
            badge={`${(data.languages || []).length} added`}
            badgeType={(data.languages || []).length > 0 ? 'done' : 'empty'}
            defaultOpen={false}
          >
            {(data.languages || []).map((lang, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <div className="field" style={{ flex: 2 }}>
                  <label className="field-label">Language</label>
                  <input
                    className="inp"
                    value={lang.name ?? ''}
                    onChange={e => {
                      const updated = [...(data.languages || [])];
                      updated[idx] = { ...updated[idx], name: clean(e.target.value, 50) };
                      onChange('languages', updated);
                    }}
                    placeholder="English"
                  />
                </div>
                <div className="field" style={{ flex: 2 }}>
                  <label className="field-label">Level</label>
                  <select
                    className="inp"
                    value={lang.level ?? 'Fluent'}
                    onChange={e => {
                      const updated = [...(data.languages || [])];
                      updated[idx] = { ...updated[idx], level: e.target.value };
                      onChange('languages', updated);
                    }}
                  >
                    <option>Native</option>
                    <option>Fluent</option>
                    <option>Advanced</option>
                    <option>Intermediate</option>
                    <option>Basic</option>
                  </select>
                </div>
                <button
                  className="btn btn-icon"
                  onClick={() => {
                    onChange('languages', (data.languages || []).filter((_, i) => i !== idx));
                  }}
                  style={{ marginBottom: 1 }}
                >
                  <IcoTrash size={12} />
                </button>
              </div>
            ))}

            <button
              className="btn btn-dashed btn-sm"
              onClick={() => {
                onChange('languages', [...(data.languages || []), { name: '', level: 'Fluent' }]);
              }}
            >
              <IcoPlus size={12} />
              Add language
            </button>
          </SectionCard>
        )}

        {/* ── ACHIEVEMENTS ─────────────────────────────────── */}
        {enabledSections.has('achievements') && (
          <SectionCard
            id="achievements"
            title="Achievements"
            badge={String(data.achievements ?? '').trim().length > 0 ? 'Added' : 'Empty'}
            badgeType={String(data.achievements ?? '').trim().length > 0 ? 'done' : 'empty'}
            defaultOpen={false}
          >
            <Field label="Achievements" hint="one per line">
              <textarea
                className="txa"
                rows={4}
                value={data.achievements ?? ''}
                onChange={e => onChange('achievements', clean(e.target.value, 1000))}
                placeholder="Won XYZ Hackathon 2023&#10;Published paper in IEEE conference"
              />
            </Field>
          </SectionCard>
        )}

        {/* ── VOLUNTEER (if enabled) ───────────────────────── */}
        {enabledSections.has('volunteer') && featureFlags.enableVolunteer !== false && (
          <SectionCard
            id="volunteer"
            title="Volunteer"
            badge={String(data.volunteer ?? '').trim().length > 0 ? 'Added' : 'Empty'}
            badgeType={String(data.volunteer ?? '').trim().length > 0 ? 'done' : 'empty'}
            defaultOpen={false}
          >
            <Field label="Volunteer work" hint="one per line">
              <textarea
                className="txa"
                rows={3}
                value={data.volunteer ?? ''}
                onChange={e => onChange('volunteer', clean(e.target.value, 600))}
                placeholder="Mentor at NGO · 2021–present"
              />
            </Field>
          </SectionCard>
        )}

        {/* ── INTERESTS (if enabled) ───────────────────────── */}
        {enabledSections.has('interests') && featureFlags.enableInterests !== false && (
          <SectionCard
            id="interests"
            title="Interests"
            badge={String(data.interests ?? '').trim().length > 0 ? 'Added' : 'Empty'}
            badgeType={String(data.interests ?? '').trim().length > 0 ? 'done' : 'empty'}
            defaultOpen={false}
          >
            <Field label="Interests" hint="comma-separated">
              <input
                className="inp"
                value={data.interests ?? ''}
                onChange={e => onChange('interests', clean(e.target.value, 200))}
                placeholder="Photography, Hiking, Open Source"
              />
            </Field>
          </SectionCard>
        )}

        {/* Bottom padding */}
        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}
