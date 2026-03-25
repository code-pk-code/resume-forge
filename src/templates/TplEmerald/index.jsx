// src/templates/TplEmerald/index.jsx
// Emerald — header with accent underline, two-column body (main + sidebar).
import './TplEmerald.css';
import { BASE_STYLE, A4_PAD_V, A4_PAD_H, secActive, BulletList } from '../shared.jsx';

export default function TplEmerald({ d, sec, accent }) {
  const a = accent || '#1D9E75';

  const H = ({ label }) => (
    <div className="tpl-emerald__heading">
      <div className="tpl-emerald__heading-label" style={{ color: a }}>{label}</div>
      <div className="tpl-emerald__heading-rule" style={{ background: a }} />
    </div>
  );

  return (
    <div style={{ ...BASE_STYLE }} className="resume-a4 tpl-emerald">

      {/* ── Header ── */}
      <div className="tpl-emerald__header" style={{ padding: `${A4_PAD_V * 0.8}px ${A4_PAD_H}px ${A4_PAD_V * 0.4}px`, borderBottom: `3px solid ${a}` }}>
        <div className="tpl-emerald__name">{d.name || 'Your Name'}</div>
        <div className="tpl-emerald__title" style={{ color: a }}>{d.title || 'Job Title'}</div>
        <div className="tpl-emerald__contacts">
          {[d.email, d.phone, d.location, d.linkedin, d.website].filter(Boolean).map((c, i) => (
            <span key={i} className="tpl-emerald__contact-item">
              <span style={{ color: a }}>•</span> {c}
            </span>
          ))}
        </div>
      </div>

      {/* ── Two-column body ── */}
      <div className="tpl-emerald__body">
        {/* Main */}
        <div className="tpl-emerald__main" style={{ padding: `${A4_PAD_V * 0.5}px ${A4_PAD_H * 0.5}px ${A4_PAD_V}px ${A4_PAD_H}px`, borderRight: `1px solid ${a}22` }}>

          {secActive(sec, 'summary') && d.summary && (
            <div className="tpl-emerald__section">
              <H label="Profile" />
              <p style={{ fontSize: 10, color: '#444', lineHeight: 1.6, margin: 0 }}>{d.summary}</p>
            </div>
          )}

          {secActive(sec, 'experience') && (d.experience || []).length > 0 && (
            <div className="tpl-emerald__section">
              <H label="Experience" />
              {d.experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: 11 }}>
                  <div className="tpl-emerald__exp-row">
                    <div>
                      <span className="tpl-emerald__exp-role">{exp.role}</span>
                      <span className="tpl-emerald__exp-company">{exp.company}{exp.location ? ' · ' + exp.location : ''}</span>
                    </div>
                    <span className="tpl-emerald__exp-date" style={{ color: a }}>{exp.from}{exp.to ? ' – ' + exp.to : ''}</span>
                  </div>
                  <BulletList items={exp.bullets} color={a} />
                </div>
              ))}
            </div>
          )}

          {secActive(sec, 'education') && (d.education || []).length > 0 && (
            <div className="tpl-emerald__section">
              <H label="Education" />
              {d.education.map((edu, i) => (
                <div key={i} style={{ marginBottom: 7 }}>
                  <div className="tpl-emerald__exp-row">
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700 }}>{edu.degree}</div>
                      <div style={{ fontSize: 9, color: '#666' }}>{edu.school}{edu.grade ? ' · ' + edu.grade : ''}</div>
                    </div>
                    <span className="tpl-emerald__exp-date" style={{ color: a }}>{edu.from}{edu.to ? ' – ' + edu.to : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {secActive(sec, 'projects') && (d.projects || []).length > 0 && (
            <div className="tpl-emerald__section">
              <H label="Projects" />
              {d.projects.map((p, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div className="tpl-emerald__exp-row">
                    <span style={{ fontSize: 10.5, fontWeight: 700 }}>{p.name}</span>
                    {p.tech && <span style={{ fontSize: 8.5, color: '#888', flexShrink: 0, marginLeft: 6 }}>{p.tech}</span>}
                  </div>
                  {p.description && <div style={{ fontSize: 9.5, color: '#555', marginTop: 2, lineHeight: 1.45 }}>{p.description}</div>}
                </div>
              ))}
            </div>
          )}

          {secActive(sec, 'achievements') && d.achievements && (
            <div className="tpl-emerald__section">
              <H label="Achievements" />
              {String(d.achievements).split('\n').filter(Boolean).map((line, i) => (
                <div key={i} className="tpl-emerald__bullet-line">
                  <span style={{ color: a, fontWeight: 700, fontSize: 10, lineHeight: '16px', flexShrink: 0 }}>›</span>
                  <span style={{ fontSize: 10, color: '#444', lineHeight: 1.45 }}>{line}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="tpl-emerald__sidebar" style={{ padding: `${A4_PAD_V * 0.5}px ${A4_PAD_H}px ${A4_PAD_V}px ${A4_PAD_H * 0.5}px` }}>

          {secActive(sec, 'skills') && (d.skillCategories || []).length > 0 && (
            <div className="tpl-emerald__section">
              <H label="Skills" />
              {d.skillCategories.map((cat, ci) => (
                <div key={ci}>
                  {cat.name && <div className="tpl-emerald__sb-cat-name">{cat.name}</div>}
                  <div className="tpl-emerald__sb-pills">
                    {(cat.items || []).map((s, si) => (
                      <span key={si} className="tpl-emerald__sb-pill" style={{ background: a + '18', color: '#1a6b50', border: `0.5px solid ${a}40` }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {secActive(sec, 'languages') && (d.languages || []).length > 0 && (
            <div className="tpl-emerald__section">
              <H label="Languages" />
              {d.languages.map((l, i) => (
                <div key={i} className="tpl-emerald__sb-lang-row">
                  <span className="tpl-emerald__sb-lang-name">{l.name}</span>
                  <span className="tpl-emerald__sb-lang-badge">{l.level}</span>
                </div>
              ))}
            </div>
          )}

          {secActive(sec, 'certifications') && (d.certifications || []).length > 0 && (
            <div className="tpl-emerald__section">
              <H label="Certifications" />
              {d.certifications.map((c, i) => (
                <div key={i} className="tpl-emerald__sb-cert">
                  <div className="tpl-emerald__sb-cert-name">{c.name}</div>
                  <div className="tpl-emerald__sb-cert-sub">{c.issuer}{c.year ? ' · ' + c.year : ''}</div>
                </div>
              ))}
            </div>
          )}

          {secActive(sec, 'volunteer') && d.volunteer && (
            <div className="tpl-emerald__section">
              <H label="Volunteer" />
              {String(d.volunteer).split('\n').filter(Boolean).map((line, i) => (
                <div key={i} style={{ fontSize: 9, color: '#555', marginBottom: 3, lineHeight: 1.5 }}>› {line}</div>
              ))}
            </div>
          )}

          {secActive(sec, 'interests') && d.interests && (
            <div className="tpl-emerald__section">
              <H label="Interests" />
              <div className="tpl-emerald__plain-text">{d.interests}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
