// src/templates/TplTech/index.jsx
import './TplTech.css';
import { BASE_STYLE, A4_PAD_V, A4_PAD_H, secActive, BulletList } from '../shared.jsx';

const MONO = "'JetBrains Mono','Fira Mono','Consolas',monospace";

export default function TplTech({ d, sec, accent }) {
  const a = accent || '#0ea5e9';
  const H = ({ label }) => (
    <div className="tpl-tech__heading">
      <span style={{ fontFamily: MONO, fontSize: 8.5, color: '#94a3b8' }}>//</span>
      <span className="tpl-tech__heading-label" style={{ fontFamily: MONO, fontSize: 9.5, color: a }}>{label}</span>
      <div className="tpl-tech__heading-rule" style={{ background: a }} />
    </div>
  );
  return (
    <div style={{ ...BASE_STYLE }} className="resume-a4 tpl-tech">
      <div className="tpl-tech__header" style={{ padding: `${A4_PAD_V * 0.75}px ${A4_PAD_H}px ${A4_PAD_V * 0.45}px` }}>
        <div className="tpl-tech__prompt-row">
          <span style={{ fontFamily: MONO, fontSize: 13, color: a, fontWeight: 700 }}>$</span>
          <span style={{ fontFamily: MONO, fontSize: 19, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px' }}>{d.name || 'Your Name'}</span>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10, color: '#64748b', marginLeft: 22, marginBottom: 7 }}>{d.title || 'Job Title'}</div>
        <div style={{ fontFamily: MONO, fontSize: 8.5, color: '#94a3b8', marginLeft: 22, display: 'flex', flexWrap: 'wrap' }}>
          {[d.email, d.phone, d.location, d.linkedin, d.website].filter(Boolean).map((c, i, arr) => (
            <span key={i}>{c}{i < arr.length - 1 && <span style={{ color: '#cbd5e1', margin: '0 8px' }}>|</span>}</span>
          ))}
        </div>
      </div>
      <div className="tpl-tech__body" style={{ padding: `${A4_PAD_V * 0.5}px ${A4_PAD_H}px ${A4_PAD_V}px` }}>
        {secActive(sec, 'summary') && d.summary && (
          <div className="tpl-tech__section"><H label="ABOUT" />
            <p style={{ fontSize: 10, color: '#374151', lineHeight: 1.65, margin: 0 }}>{d.summary}</p>
          </div>
        )}
        {secActive(sec, 'skills') && (d.skillCategories || []).length > 0 && (
          <div className="tpl-tech__section"><H label="STACK" />
            {d.skillCategories.map((cat, ci) => (
              <div key={ci} className="tpl-tech__skill-cat-row">
                {cat.name && <span style={{ fontFamily: MONO, fontSize: 8.5, color: '#94a3b8', minWidth: 58, paddingTop: 2, flexShrink: 0 }}>{cat.name.toLowerCase()}:</span>}
                <div className="tpl-tech__skill-pills">
                  {(cat.items || []).map((s, si) => (
                    <span key={si} style={{ fontFamily: MONO, fontSize: 8.5, padding: '1px 6px', background: a + '12', color: a, border: `1px solid ${a}30`, borderRadius: 3 }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {secActive(sec, 'experience') && (d.experience || []).length > 0 && (
          <div className="tpl-tech__section"><H label="EXPERIENCE" />
            {d.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 11, paddingLeft: 12, borderLeft: `2px solid ${a}30` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{exp.role}</span>
                    <span style={{ fontFamily: MONO, fontSize: 9, color: '#64748b', marginLeft: 8 }}>@ {exp.company}{exp.location ? ` (${exp.location})` : ''}</span>
                  </div>
                  <span style={{ fontFamily: MONO, fontSize: 8.5, color: a, whiteSpace: 'nowrap', marginLeft: 8, flexShrink: 0 }}>{exp.from}{exp.to ? ' → ' + exp.to : ''}</span>
                </div>
                <BulletList items={exp.bullets} color={a} />
              </div>
            ))}
          </div>
        )}
        {secActive(sec, 'projects') && (d.projects || []).length > 0 && (
          <div className="tpl-tech__section"><H label="PROJECTS" />
            {d.projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 8, paddingLeft: 12, borderLeft: `2px solid ${a}30` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, color: '#0f172a' }}>{p.name}</span>
                  {p.tech && <span style={{ fontFamily: MONO, fontSize: 8.5, color: '#94a3b8', marginLeft: 8, flexShrink: 0 }}>{p.tech}</span>}
                </div>
                {p.url && <div style={{ fontFamily: MONO, fontSize: 8, color: a, marginTop: 1 }}>{p.url}</div>}
                {p.description && <div style={{ fontSize: 9.5, color: '#4b5563', marginTop: 3, lineHeight: 1.5 }}>{p.description}</div>}
              </div>
            ))}
          </div>
        )}
        {secActive(sec, 'education') && (d.education || []).length > 0 && (
          <div className="tpl-tech__section"><H label="EDUCATION" />
            {d.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 6, paddingLeft: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700 }}>{edu.degree}</div>
                    <div style={{ fontFamily: MONO, fontSize: 9, color: '#64748b' }}>{edu.school}{edu.grade ? ' · ' + edu.grade : ''}</div>
                  </div>
                  <span style={{ fontFamily: MONO, fontSize: 8.5, color: a, whiteSpace: 'nowrap', marginLeft: 8, flexShrink: 0 }}>{edu.from}{edu.to ? ' → ' + edu.to : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {secActive(sec, 'certifications') && (d.certifications || []).length > 0 && (
          <div className="tpl-tech__section"><H label="CERTIFICATIONS" />
            {d.certifications.map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4, paddingLeft: 12 }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 600 }}>{c.name}</span>
                  {c.issuer && <span style={{ fontFamily: MONO, fontSize: 8.5, color: '#94a3b8', marginLeft: 6 }}>{c.issuer}</span>}
                </div>
                <span style={{ fontFamily: MONO, fontSize: 8.5, color: a, flexShrink: 0, marginLeft: 8 }}>{c.year}</span>
              </div>
            ))}
          </div>
        )}
        {secActive(sec, 'languages') && (d.languages || []).length > 0 && (
          <div className="tpl-tech__section"><H label="LANGUAGES" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 8px', paddingLeft: 12 }}>
              {d.languages.map((l, i) => (
                <span key={i} style={{ fontFamily: MONO, fontSize: 9 }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{l.name}</span>
                  {l.level && <span style={{ color: '#94a3b8' }}> ({l.level})</span>}
                </span>
              ))}
            </div>
          </div>
        )}
        {secActive(sec, 'achievements') && d.achievements && (
          <div className="tpl-tech__section"><H label="ACHIEVEMENTS" />
            {String(d.achievements).split('\n').filter(Boolean).map((line, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 2, paddingLeft: 12 }}>
                <span style={{ fontFamily: MONO, color: a, fontSize: 10, lineHeight: '16px', flexShrink: 0 }}>›</span>
                <span style={{ fontSize: 10, color: '#374151', lineHeight: 1.45 }}>{line}</span>
              </div>
            ))}
          </div>
        )}
        {secActive(sec, 'interests') && d.interests && (
          <div className="tpl-tech__section"><H label="INTERESTS" />
            <div style={{ fontFamily: MONO, fontSize: 9.5, color: '#4b5563', paddingLeft: 12 }}>{d.interests}</div>
          </div>
        )}
      </div>
    </div>
  );
}
