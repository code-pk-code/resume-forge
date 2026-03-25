// src/templates/TplCreative/index.jsx
import './TplCreative.css';
import { BASE_STYLE, A4_PAD_V, A4_PAD_H, secActive, BulletList } from '../shared.jsx';

export default function TplCreative({ d, sec, accent }) {
  const a = accent || '#D85A30';
  const H = ({ label }) => (
    <div className="tpl-creative__heading">
      <span className="tpl-creative__heading-label" style={{ color: a }}>{label}</span>
      <div className="tpl-creative__heading-rule" style={{ background: `linear-gradient(90deg,${a}50,transparent)` }} />
    </div>
  );
  const allSkills = (d.skillCategories || []).flatMap(c => c.items || []);
  const STRIP_W = 8;
  return (
    <div style={{ ...BASE_STYLE }} className="resume-a4 tpl-creative">
      {/* Header with left strip */}
      <div className="tpl-creative__strip-header">
        <div className="tpl-creative__strip" style={{ width: STRIP_W, background: a, minHeight: 130 }} />
        <div className="tpl-creative__header-content" style={{ padding: `${A4_PAD_V * 0.8}px ${A4_PAD_H}px ${A4_PAD_V * 0.4}px ${A4_PAD_H - STRIP_W}px` }}>
          <div className="tpl-creative__header-top">
            <div>
              <div className="tpl-creative__name">{d.name || 'Your Name'}</div>
              <div className="tpl-creative__title" style={{ color: a }}>{d.title || 'Job Title'}</div>
            </div>
            <div className="tpl-creative__avatar" style={{ background: a }}>{(d.name || 'Y').charAt(0).toUpperCase()}</div>
          </div>
          <div className="tpl-creative__contacts">
            {[d.email, d.phone, d.location, d.linkedin, d.website].filter(Boolean).map((c, i) => (
              <span key={i} className="tpl-creative__contact-item">{c}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="tpl-creative__divider" style={{ background: `linear-gradient(90deg,${a},${a}00)` }} />
      {/* Body with faint strip */}
      <div className="tpl-creative__strip-body">
        <div className="tpl-creative__strip-faint" style={{ width: STRIP_W, background: `${a}18` }} />
        <div className="tpl-creative__body" style={{ padding: `${A4_PAD_V * 0.5}px ${A4_PAD_H}px ${A4_PAD_V}px ${A4_PAD_H - STRIP_W}px` }}>
          {secActive(sec, 'summary') && d.summary && (
            <div className="tpl-creative__section"><H label="About" />
              <p style={{ fontSize: 10, color: '#444', lineHeight: 1.65, margin: 0 }}>{d.summary}</p>
            </div>
          )}
          {secActive(sec, 'experience') && (d.experience || []).length > 0 && (
            <div className="tpl-creative__section"><H label="Experience" />
              {d.experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: 11 }}>
                  <div className="tpl-creative__exp-row">
                    <div>
                      <span className="tpl-creative__exp-role">{exp.role}</span>
                      <span className="tpl-creative__exp-company">{exp.company}{exp.location ? ' · ' + exp.location : ''}</span>
                    </div>
                    <span className="tpl-creative__exp-date" style={{ color: a }}>{exp.from}{exp.to ? ' – ' + exp.to : ''}</span>
                  </div>
                  <BulletList items={exp.bullets} color={a} />
                </div>
              ))}
            </div>
          )}
          {secActive(sec, 'skills') && allSkills.length > 0 && (
            <div className="tpl-creative__section"><H label="Skills" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 6px' }}>
                {allSkills.map((s, i) => (
                  <span key={i} className="tpl-creative__skill-pill" style={{
                    background: i % 3 === 0 ? a : i % 3 === 1 ? a + '18' : '#f3f4f6',
                    color: i % 3 === 0 ? '#fff' : i % 3 === 1 ? a : '#555',
                  }}>{s}</span>
                ))}
              </div>
            </div>
          )}
          {secActive(sec, 'projects') && (d.projects || []).length > 0 && (
            <div className="tpl-creative__section"><H label="Projects" />
              {d.projects.map((p, i) => (
                <div key={i} className="tpl-creative__proj-card" style={{ border: `1px solid ${a}20` }}>
                  <div className="tpl-creative__proj-row">
                    <span className="tpl-creative__proj-name">{p.name}</span>
                    {p.tech && <span style={{ fontSize: 8.5, color: '#888', flexShrink: 0 }}>{p.tech}</span>}
                  </div>
                  {p.description && <div style={{ fontSize: 9.5, color: '#555', marginTop: 3, lineHeight: 1.45 }}>{p.description}</div>}
                  {p.url && <div style={{ fontSize: 8.5, color: a, marginTop: 3 }}>{p.url}</div>}
                </div>
              ))}
            </div>
          )}
          {secActive(sec, 'education') && (d.education || []).length > 0 && (
            <div className="tpl-creative__section"><H label="Education" />
              {d.education.map((edu, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700 }}>{edu.degree}</div>
                    <div style={{ fontSize: 9, color: '#666' }}>{edu.school}{edu.grade ? ' · ' + edu.grade : ''}</div>
                  </div>
                  <span style={{ fontSize: 9, color: a, fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 8, flexShrink: 0 }}>{edu.from}{edu.to ? ' – ' + edu.to : ''}</span>
                </div>
              ))}
            </div>
          )}
          {secActive(sec, 'certifications') && (d.certifications || []).length > 0 && (
            <div className="tpl-creative__section"><H label="Certifications" />
              {d.certifications.map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <div><span style={{ fontSize: 10, fontWeight: 600 }}>{c.name}</span>{c.issuer && <span style={{ fontSize: 9, color: '#666', marginLeft: 5 }}>{c.issuer}</span>}</div>
                  <span style={{ fontSize: 9, color: a, flexShrink: 0, marginLeft: 8 }}>{c.year}</span>
                </div>
              ))}
            </div>
          )}
          {secActive(sec, 'languages') && (d.languages || []).length > 0 && (
            <div className="tpl-creative__section"><H label="Languages" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 16px' }}>
                {d.languages.map((l, i) => (
                  <span key={i} style={{ fontSize: 10 }}><span style={{ fontWeight: 700 }}>{l.name}</span>{l.level && <span style={{ color: '#777' }}> — {l.level}</span>}</span>
                ))}
              </div>
            </div>
          )}
          {secActive(sec, 'achievements') && d.achievements && (
            <div className="tpl-creative__section"><H label="Achievements" />
              {String(d.achievements).split('\n').filter(Boolean).map((line, i) => (
                <div key={i} className="tpl-creative__bullet-line">
                  <span style={{ color: a, fontWeight: 700, fontSize: 10, lineHeight: '16px', flexShrink: 0 }}>›</span>
                  <span style={{ fontSize: 10, color: '#444', lineHeight: 1.45 }}>{line}</span>
                </div>
              ))}
            </div>
          )}
          {secActive(sec, 'volunteer') && d.volunteer && (
            <div className="tpl-creative__section"><H label="Volunteer" />
              {String(d.volunteer).split('\n').filter(Boolean).map((line, i) => (
                <div key={i} className="tpl-creative__bullet-line">
                  <span style={{ color: a, fontWeight: 700, fontSize: 10, lineHeight: '16px', flexShrink: 0 }}>›</span>
                  <span style={{ fontSize: 10, color: '#444', lineHeight: 1.45 }}>{line}</span>
                </div>
              ))}
            </div>
          )}
          {secActive(sec, 'interests') && d.interests && (
            <div className="tpl-creative__section"><H label="Interests" />
              <div style={{ fontSize: 10, color: '#555' }}>{d.interests}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
