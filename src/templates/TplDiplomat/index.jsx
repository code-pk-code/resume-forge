// src/templates/TplDiplomat/index.jsx
import './TplDiplomat.css';
import { BASE_STYLE, A4_PAD_V, A4_PAD_H, secActive, BulletList } from '../shared.jsx';

export default function TplDiplomat({ d, sec, accent }) {
  const a = accent || '#7F77DD';
  const H = ({ label }) => (
    <div className="tpl-diplomat__heading">
      <div className="tpl-diplomat__heading-label" style={{ color: a }}>{label}</div>
      <div className="tpl-diplomat__heading-rule" style={{ background: a }} />
    </div>
  );
  return (
    <div style={{ ...BASE_STYLE }} className="resume-a4 tpl-diplomat">
      {/* Main */}
      <div className="tpl-diplomat__main" style={{ padding: `${A4_PAD_V}px ${A4_PAD_H * 0.5}px ${A4_PAD_V}px ${A4_PAD_H}px`, borderRight: `2px solid ${a}` }}>
        <div className="tpl-diplomat__name-block" style={{ borderBottom: `1px solid ${a}30` }}>
          <div className="tpl-diplomat__name">{d.name || 'Your Name'}</div>
          <div className="tpl-diplomat__title" style={{ color: a }}>{d.title || 'Job Title'}</div>
        </div>
        {secActive(sec, 'summary') && d.summary && (
          <div className="tpl-diplomat__section"><H label="Profile" />
            <p style={{ fontSize: 10.5, color: '#3a3a3a', lineHeight: 1.7, margin: 0 }}>{d.summary}</p>
          </div>
        )}
        {secActive(sec, 'experience') && (d.experience || []).length > 0 && (
          <div className="tpl-diplomat__section"><H label="Professional Experience" />
            {d.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 13 }}>
                <div className="tpl-diplomat__exp-header">
                  <div style={{ flex: 1 }}>
                    <div className="tpl-diplomat__exp-role">{exp.role}</div>
                    <div className="tpl-diplomat__exp-company">{exp.company}{exp.location ? ' · ' + exp.location : ''}</div>
                  </div>
                  <div className="tpl-diplomat__exp-date" style={{ color: a }}>{exp.from}{exp.to ? <><br />{exp.to}</> : ''}</div>
                </div>
                <BulletList items={exp.bullets} color={a} />
              </div>
            ))}
          </div>
        )}
        {secActive(sec, 'education') && (d.education || []).length > 0 && (
          <div className="tpl-diplomat__section"><H label="Education" />
            {d.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div className="tpl-diplomat__exp-header">
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700 }}>{edu.degree}</div>
                    <div style={{ fontSize: 10, color: '#555' }}>{edu.school}</div>
                    {edu.grade && <div style={{ fontSize: 9, color: '#888' }}>{edu.grade}</div>}
                  </div>
                  <span className="tpl-diplomat__exp-date" style={{ color: a }}>{edu.from}{edu.to ? ' – ' + edu.to : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {secActive(sec, 'projects') && (d.projects || []).length > 0 && (
          <div className="tpl-diplomat__section"><H label="Key Projects" />
            {d.projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700 }}>{p.name}{p.tech ? <span style={{ fontWeight: 400, color: '#888', fontSize: 9.5 }}> ({p.tech})</span> : ''}</div>
                {p.description && <div style={{ fontSize: 10, color: '#555', marginTop: 2, lineHeight: 1.5 }}>{p.description}</div>}
              </div>
            ))}
          </div>
        )}
        {secActive(sec, 'achievements') && d.achievements && (
          <div className="tpl-diplomat__section"><H label="Achievements" />
            {String(d.achievements).split('\n').filter(Boolean).map((line, i) => (
              <div key={i} className="tpl-diplomat__bullet-line">
                <span style={{ color: a, fontWeight: 700, fontSize: 10, lineHeight: '16px', flexShrink: 0 }}>›</span>
                <span style={{ fontSize: 10, color: '#333', lineHeight: 1.5 }}>{line}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Sidebar */}
      <div className="tpl-diplomat__sidebar" style={{ padding: `${A4_PAD_V}px ${A4_PAD_H}px ${A4_PAD_V}px ${A4_PAD_H * 0.5}px`, background: `${a}08` }}>
        <div className="tpl-diplomat__sb-contact-block" style={{ borderBottom: `1px solid ${a}30` }}>
          <div className="tpl-diplomat__sb-heading" style={{ color: a }}>Contact</div>
          {[d.email, d.phone, d.location, d.linkedin, d.website].filter(Boolean).map((c, i) => (
            <div key={i} className="tpl-diplomat__sb-contact-item">{c}</div>
          ))}
        </div>
        {secActive(sec, 'skills') && (d.skillCategories || []).length > 0 && (
          <div className="tpl-diplomat__sb-section">
            <div className="tpl-diplomat__sb-heading" style={{ color: a }}>Skills</div>
            {d.skillCategories.map((cat, ci) => (
              <div key={ci} className="tpl-diplomat__sb-skill-cat">
                {cat.name && <div className="tpl-diplomat__sb-skill-cat-name">{cat.name}</div>}
                <div className="tpl-diplomat__sb-pills">
                  {(cat.items || []).map((s, si) => (
                    <span key={si} className="tpl-diplomat__sb-pill" style={{ background: a + '18', color: a }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {secActive(sec, 'languages') && (d.languages || []).length > 0 && (
          <div className="tpl-diplomat__sb-section">
            <div className="tpl-diplomat__sb-heading" style={{ color: a }}>Languages</div>
            {d.languages.map((l, i) => (
              <div key={i} className="tpl-diplomat__sb-lang-row">
                <span className="tpl-diplomat__sb-lang-name">{l.name}</span>
                <span className="tpl-diplomat__sb-lang-badge" style={{ background: `${a}18` }}>{l.level}</span>
              </div>
            ))}
          </div>
        )}
        {secActive(sec, 'certifications') && (d.certifications || []).length > 0 && (
          <div className="tpl-diplomat__sb-section">
            <div className="tpl-diplomat__sb-heading" style={{ color: a }}>Certifications</div>
            {d.certifications.map((c, i) => (
              <div key={i} className="tpl-diplomat__sb-cert">
                <div className="tpl-diplomat__sb-cert-name">{c.name}</div>
                <div className="tpl-diplomat__sb-cert-sub">{c.issuer}{c.year ? ' · ' + c.year : ''}</div>
              </div>
            ))}
          </div>
        )}
        {secActive(sec, 'volunteer') && d.volunteer && (
          <div className="tpl-diplomat__sb-section">
            <div className="tpl-diplomat__sb-heading" style={{ color: a }}>Volunteer</div>
            {String(d.volunteer).split('\n').filter(Boolean).map((line, i) => (
              <div key={i} style={{ fontSize: 9, color: '#555', marginBottom: 4, lineHeight: 1.5 }}>› {line}</div>
            ))}
          </div>
        )}
        {secActive(sec, 'interests') && d.interests && (
          <div className="tpl-diplomat__sb-section">
            <div className="tpl-diplomat__sb-heading" style={{ color: a }}>Interests</div>
            <div style={{ fontSize: 9.5, color: '#555', lineHeight: 1.6 }}>{d.interests}</div>
          </div>
        )}
      </div>
    </div>
  );
}
