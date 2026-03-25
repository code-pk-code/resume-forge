// src/templates/TplMinimal/index.jsx
// Minimal — clean single-column, typography-first, no decoration.
import './TplMinimal.css';
import { BASE_STYLE, A4_PAD_V, A4_PAD_H, secActive, BulletList } from '../shared.jsx';

export default function TplMinimal({ d, sec, accent }) {
  const a = accent || '#222222';

  const H = ({ label }) => (
    <div className="tpl-minimal__heading">
      <div className="tpl-minimal__heading-label" style={{ color: a }}>{label}</div>
      <div className="tpl-minimal__heading-rule" style={{ background: a }} />
    </div>
  );

  const allSkills = (d.skillCategories || []).flatMap(c => c.items || []);

  return (
    <div style={{ ...BASE_STYLE, padding: `${A4_PAD_V}px ${A4_PAD_H}px` }} className="resume-a4">

      {/* ── Header ── */}
      <div className="tpl-minimal__header" style={{ borderBottom: `2px solid ${a}` }}>
        <div className="tpl-minimal__name">{d.name || 'Your Name'}</div>
        <div className="tpl-minimal__title">{d.title || 'Job Title'}</div>
        <div className="tpl-minimal__contacts">
          {[d.email, d.phone, d.location, d.linkedin, d.website].filter(Boolean).map((c, i) => (
            <span key={i} className="tpl-minimal__contact-item">{c}</span>
          ))}
        </div>
      </div>

      {secActive(sec, 'summary') && d.summary && (
        <div className="tpl-minimal__section">
          <H label="Profile" />
          <p className="tpl-minimal__plain-text" style={{ margin: 0, fontSize: 11, lineHeight: 1.65 }}>{d.summary}</p>
        </div>
      )}

      {secActive(sec, 'experience') && (d.experience || []).length > 0 && (
        <div className="tpl-minimal__section">
          <H label="Experience" />
          {d.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 11 }}>
              <div className="tpl-minimal__exp-header">
                <div>
                  <span className="tpl-minimal__exp-role">{exp.role}</span>
                  <span className="tpl-minimal__exp-company">{exp.company}{exp.location ? ' · ' + exp.location : ''}</span>
                </div>
                <span className="tpl-minimal__exp-date">{exp.from}{exp.to ? ' – ' + exp.to : ''}</span>
              </div>
              <BulletList items={exp.bullets} color={a} />
            </div>
          ))}
        </div>
      )}

      {secActive(sec, 'education') && (d.education || []).length > 0 && (
        <div className="tpl-minimal__section">
          <H label="Education" />
          {d.education.map((edu, i) => (
            <div key={i} className="tpl-minimal__edu-row">
              <div>
                <div className="tpl-minimal__edu-degree">{edu.degree}</div>
                <div className="tpl-minimal__edu-school">{edu.school}{edu.grade ? ' · ' + edu.grade : ''}</div>
              </div>
              <span className="tpl-minimal__exp-date">{edu.from}{edu.to ? ' – ' + edu.to : ''}</span>
            </div>
          ))}
        </div>
      )}

      {secActive(sec, 'skills') && allSkills.length > 0 && (
        <div className="tpl-minimal__section">
          <H label="Skills" />
          <div className="tpl-minimal__skills-text">{allSkills.join(' · ')}</div>
        </div>
      )}

      {secActive(sec, 'projects') && (d.projects || []).length > 0 && (
        <div className="tpl-minimal__section">
          <H label="Projects" />
          {d.projects.map((p, i) => (
            <div key={i} className="tpl-minimal__proj-row">
              <span className="tpl-minimal__proj-title">{p.name}</span>
              {p.tech && <span className="tpl-minimal__proj-tech">({p.tech})</span>}
              {p.description && <div className="tpl-minimal__proj-desc">{p.description}</div>}
            </div>
          ))}
        </div>
      )}

      {secActive(sec, 'certifications') && (d.certifications || []).length > 0 && (
        <div className="tpl-minimal__section">
          <H label="Certifications" />
          {d.certifications.map((c, i) => (
            <div key={i} className="tpl-minimal__cert-row">
              <div>
                <span style={{ fontSize: 10, fontWeight: 600 }}>{c.name}</span>
                {c.issuer && <span style={{ fontSize: 9, color: '#666', marginLeft: 5 }}>{c.issuer}</span>}
              </div>
              <span style={{ fontSize: 9, color: '#888', flexShrink: 0, marginLeft: 8 }}>{c.year}</span>
            </div>
          ))}
        </div>
      )}

      {secActive(sec, 'languages') && (d.languages || []).length > 0 && (
        <div className="tpl-minimal__section">
          <H label="Languages" />
          <div className="tpl-minimal__lang-row">
            {d.languages.map((l, i) => (
              <span key={i} style={{ fontSize: 10 }}>
                <span style={{ fontWeight: 700 }}>{l.name}</span>
                {l.level && <span style={{ color: '#777' }}> — {l.level}</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {secActive(sec, 'achievements') && d.achievements && (
        <div className="tpl-minimal__section">
          <H label="Achievements" />
          {String(d.achievements).split('\n').filter(Boolean).map((line, i) => (
            <div key={i} className="tpl-minimal__bullet-line">
              <span style={{ color: a, fontWeight: 700, fontSize: 10, lineHeight: '16px', flexShrink: 0 }}>›</span>
              <span style={{ fontSize: 10, color: '#444', lineHeight: 1.45 }}>{line}</span>
            </div>
          ))}
        </div>
      )}

      {secActive(sec, 'volunteer') && d.volunteer && (
        <div className="tpl-minimal__section">
          <H label="Volunteer" />
          {String(d.volunteer).split('\n').filter(Boolean).map((line, i) => (
            <div key={i} className="tpl-minimal__bullet-line">
              <span style={{ color: a, fontWeight: 700, fontSize: 10, lineHeight: '16px', flexShrink: 0 }}>›</span>
              <span style={{ fontSize: 10, color: '#444', lineHeight: 1.45 }}>{line}</span>
            </div>
          ))}
        </div>
      )}

      {secActive(sec, 'interests') && d.interests && (
        <div className="tpl-minimal__section">
          <H label="Interests" />
          <div className="tpl-minimal__plain-text">{d.interests}</div>
        </div>
      )}
    </div>
  );
}
