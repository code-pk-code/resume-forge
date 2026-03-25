// src/templates/TplExecutive/index.jsx
// Executive — dark left sidebar + main content column.
import './TplExecutive.css';
import { BASE_STYLE, A4_PAD_V, A4_PAD_H, secActive, BulletList } from '../shared.jsx';

export default function TplExecutive({ d, sec, accent }) {
  const a = accent || '#1a2744';

  const H = ({ label }) => (
    <div className="tpl-executive__heading">
      <div className="tpl-executive__heading-label" style={{ color: a }}>{label}</div>
      <div className="tpl-executive__heading-rule" style={{ background: a }} />
    </div>
  );

  return (
    <div style={{ ...BASE_STYLE }} className="resume-a4 tpl-executive">

      {/* ── Sidebar ── */}
      <div className="tpl-executive__sidebar" style={{ background: a, padding: `${A4_PAD_V}px 20px` }}>
        <div className="tpl-executive__avatar">{(d.name || 'Y').charAt(0).toUpperCase()}</div>
        <div className="tpl-executive__sb-name">{d.name || 'Your Name'}</div>
        <div className="tpl-executive__sb-title">{d.title || 'Job Title'}</div>

        <div className="tpl-executive__sb-section">
          <div className="tpl-executive__sb-heading">Contact</div>
          {[d.email, d.phone, d.location, d.linkedin, d.website].filter(Boolean).map((c, i) => (
            <div key={i} className="tpl-executive__sb-contact-item">{c}</div>
          ))}
        </div>

        {secActive(sec, 'skills') && (d.skillCategories || []).length > 0 && (
          <div className="tpl-executive__sb-section">
            <div className="tpl-executive__sb-heading">Skills</div>
            {d.skillCategories.flatMap(c => c.items || []).map((s, i) => (
              <div key={i} className="tpl-executive__sb-skill-item">• {s}</div>
            ))}
          </div>
        )}

        {secActive(sec, 'languages') && (d.languages || []).length > 0 && (
          <div className="tpl-executive__sb-section">
            <div className="tpl-executive__sb-heading">Languages</div>
            {d.languages.map((l, i) => (
              <div key={i} className="tpl-executive__sb-lang-row">
                <span className="tpl-executive__sb-lang-name">{l.name}</span>
                <span className="tpl-executive__sb-lang-level">{l.level}</span>
              </div>
            ))}
          </div>
        )}

        {secActive(sec, 'certifications') && (d.certifications || []).length > 0 && (
          <div className="tpl-executive__sb-section">
            <div className="tpl-executive__sb-heading">Certifications</div>
            {d.certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 8.5, opacity: 0.9, fontWeight: 600 }}>{c.name}</div>
                {c.issuer && <div style={{ fontSize: 8, opacity: 0.6 }}>{c.issuer}{c.year ? ' · ' + c.year : ''}</div>}
              </div>
            ))}
          </div>
        )}

        {secActive(sec, 'interests') && d.interests && (
          <div className="tpl-executive__sb-section">
            <div className="tpl-executive__sb-heading">Interests</div>
            <div style={{ fontSize: 8.5, opacity: 0.8, lineHeight: 1.5 }}>{d.interests}</div>
          </div>
        )}
      </div>

      {/* ── Main ── */}
      <div className="tpl-executive__main" style={{ padding: `${A4_PAD_V}px ${A4_PAD_H * 0.6}px ${A4_PAD_V}px ${A4_PAD_H * 0.55}px` }}>

        {secActive(sec, 'summary') && d.summary && (
          <div className="tpl-executive__section">
            <H label="Profile" />
            <p style={{ fontSize: 10.5, color: '#444', lineHeight: 1.65, margin: 0 }}>{d.summary}</p>
          </div>
        )}

        {secActive(sec, 'experience') && (d.experience || []).length > 0 && (
          <div className="tpl-executive__section">
            <H label="Experience" />
            {d.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div className="tpl-executive__exp-header">
                  <div>
                    <div className="tpl-executive__exp-role">{exp.role}</div>
                    <div className="tpl-executive__exp-company">{exp.company}{exp.location ? ' · ' + exp.location : ''}</div>
                  </div>
                  <div className="tpl-executive__exp-date" style={{ color: a, fontWeight: 600, fontSize: 9 }}>
                    {exp.from}{exp.to ? <><br />{exp.to}</> : ''}
                  </div>
                </div>
                <BulletList items={exp.bullets} color={a} />
              </div>
            ))}
          </div>
        )}

        {secActive(sec, 'education') && (d.education || []).length > 0 && (
          <div className="tpl-executive__section">
            <H label="Education" />
            {d.education.map((edu, i) => (
              <div key={i} className="tpl-executive__edu-row">
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>{edu.degree}</div>
                  <div style={{ fontSize: 9.5, color: '#555' }}>{edu.school}{edu.grade ? ' · ' + edu.grade : ''}</div>
                </div>
                <span style={{ fontSize: 9, color: a, fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 8, flexShrink: 0 }}>
                  {edu.from}{edu.to ? ' – ' + edu.to : ''}
                </span>
              </div>
            ))}
          </div>
        )}

        {secActive(sec, 'projects') && (d.projects || []).length > 0 && (
          <div className="tpl-executive__section">
            <H label="Projects" />
            {d.projects.map((p, i) => (
              <div key={i} className="tpl-executive__proj-row">
                <div>
                  <span className="tpl-executive__proj-name">{p.name}</span>
                  {p.tech && <span style={{ fontWeight: 400, color: '#888', fontSize: 9.5, marginLeft: 5 }}>({p.tech})</span>}
                </div>
                {p.description && <div style={{ fontSize: 10, color: '#555', marginTop: 2, lineHeight: 1.5 }}>{p.description}</div>}
              </div>
            ))}
          </div>
        )}

        {secActive(sec, 'achievements') && d.achievements && (
          <div className="tpl-executive__section">
            <H label="Achievements" />
            {String(d.achievements).split('\n').filter(Boolean).map((line, i) => (
              <div key={i} className="tpl-executive__bullet-line">
                <span style={{ color: a, fontWeight: 700, fontSize: 10, lineHeight: '16px', flexShrink: 0 }}>›</span>
                <span style={{ fontSize: 10, color: '#333', lineHeight: 1.45 }}>{line}</span>
              </div>
            ))}
          </div>
        )}

        {secActive(sec, 'volunteer') && d.volunteer && (
          <div className="tpl-executive__section">
            <H label="Volunteer" />
            {String(d.volunteer).split('\n').filter(Boolean).map((line, i) => (
              <div key={i} className="tpl-executive__bullet-line">
                <span style={{ color: a, fontWeight: 700, fontSize: 10, lineHeight: '16px', flexShrink: 0 }}>›</span>
                <span style={{ fontSize: 10, color: '#444', lineHeight: 1.45 }}>{line}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
