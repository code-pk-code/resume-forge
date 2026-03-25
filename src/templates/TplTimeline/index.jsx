// src/templates/TplTimeline/index.jsx
import './TplTimeline.css';
import { BASE_STYLE, A4_PAD_V, A4_PAD_H, secActive, BulletList } from '../shared.jsx';

export default function TplTimeline({ d, sec, accent }) {
  const a = accent || '#BA7517';
  const H = ({ label }) => (
    <div className="tpl-timeline__heading">
      <span className="tpl-timeline__heading-label" style={{ color: a }}>{label}</span>
      <div className="tpl-timeline__heading-rule" style={{ background: a }} />
    </div>
  );
  const Dot = ({ filled }) => (
    <div className={`tpl-timeline__dot${filled ? ' tpl-timeline__dot--filled' : ''}`}
      style={{ border: `2px solid ${a}`, color: a }} />
  );
  const allSkills = (d.skillCategories || []).flatMap(c => c.items || []);
  return (
    <div style={{ ...BASE_STYLE }} className="resume-a4 tpl-timeline">
      <div className="tpl-timeline__header" style={{ padding: `${A4_PAD_V * 0.75}px ${A4_PAD_H}px ${A4_PAD_V * 0.45}px` }}>
        <div className="tpl-timeline__header-inner">
          <div>
            <div className="tpl-timeline__name">{d.name || 'Your Name'}</div>
            <div className="tpl-timeline__title-row">
              <div className="tpl-timeline__title-bar" style={{ background: a }} />
              <div className="tpl-timeline__title" style={{ color: a }}>{d.title || 'Job Title'}</div>
            </div>
          </div>
          <div className="tpl-timeline__contacts">
            {[d.email, d.phone, d.location, d.linkedin, d.website].filter(Boolean).map((c, i) => (
              <span key={i} className="tpl-timeline__contact-item">{c}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="tpl-timeline__body" style={{ padding: `${A4_PAD_V * 0.5}px ${A4_PAD_H}px ${A4_PAD_V}px` }}>
        {secActive(sec, 'summary') && d.summary && (
          <div className="tpl-timeline__section"><H label="Summary" />
            <p style={{ fontSize: 10, color: '#444', lineHeight: 1.65, margin: 0 }}>{d.summary}</p>
          </div>
        )}
        {secActive(sec, 'experience') && (d.experience || []).length > 0 && (
          <div className="tpl-timeline__section"><H label="Experience" />
            <div className="tpl-timeline__spine" style={{ borderLeft: `2px solid ${a}40` }}>
              {d.experience.map((exp, i) => (
                <div key={i} className="tpl-timeline__entry">
                  <Dot filled={false} />
                  <div className="tpl-timeline__entry-date" style={{ color: a }}>{exp.from}{exp.to ? ' – ' + exp.to : ' – Present'}</div>
                  <div className="tpl-timeline__entry-role">{exp.role}</div>
                  <div className="tpl-timeline__entry-sub">{exp.company}{exp.location ? ' · ' + exp.location : ''}</div>
                  <BulletList items={exp.bullets} color={a} />
                </div>
              ))}
            </div>
          </div>
        )}
        {secActive(sec, 'education') && (d.education || []).length > 0 && (
          <div className="tpl-timeline__section"><H label="Education" />
            <div className="tpl-timeline__spine" style={{ borderLeft: `2px solid ${a}40` }}>
              {d.education.map((edu, i) => (
                <div key={i} className="tpl-timeline__entry">
                  <Dot filled={false} />
                  <div className="tpl-timeline__entry-date" style={{ color: a }}>{edu.from}{edu.to ? ' – ' + edu.to : ''}</div>
                  <div className="tpl-timeline__entry-role">{edu.degree}</div>
                  <div className="tpl-timeline__entry-sub">{edu.school}{edu.grade ? ' · ' + edu.grade : ''}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {secActive(sec, 'skills') && allSkills.length > 0 && (
          <div className="tpl-timeline__section"><H label="Skills" />
            <div className="tpl-timeline__skills-grid">
              {allSkills.map((s, i) => (
                <div key={i} className="tpl-timeline__skill-item">
                  <div className="tpl-timeline__skill-dot" style={{ background: a }} />
                  <span className="tpl-timeline__skill-label">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {secActive(sec, 'projects') && (d.projects || []).length > 0 && (
          <div className="tpl-timeline__section"><H label="Projects" />
            <div className="tpl-timeline__spine" style={{ borderLeft: `2px solid ${a}40` }}>
              {d.projects.map((p, i) => (
                <div key={i} className="tpl-timeline__entry">
                  <Dot filled={true} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700 }}>{p.name}</span>
                    {p.tech && <span style={{ fontSize: 8.5, color: '#888', marginLeft: 6, flexShrink: 0 }}>{p.tech}</span>}
                  </div>
                  {p.description && <div style={{ fontSize: 9.5, color: '#555', marginTop: 2, lineHeight: 1.45 }}>{p.description}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="tpl-timeline__two-col">
          {secActive(sec, 'certifications') && (d.certifications || []).length > 0 && (
            <div><H label="Certifications" />
              {d.certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: 5 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 8.5, color: '#666' }}>{c.issuer}{c.year ? ' · ' + c.year : ''}</div>
                </div>
              ))}
            </div>
          )}
          {secActive(sec, 'languages') && (d.languages || []).length > 0 && (
            <div><H label="Languages" />
              {d.languages.map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 600 }}>{l.name}</span>
                  <span style={{ fontSize: 9, color: '#777' }}>{l.level}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {secActive(sec, 'achievements') && d.achievements && (
          <div className="tpl-timeline__section"><H label="Achievements" />
            {String(d.achievements).split('\n').filter(Boolean).map((line, i) => (
              <div key={i} className="tpl-timeline__bullet-line">
                <span style={{ color: a, fontWeight: 700, fontSize: 10, lineHeight: '16px', flexShrink: 0 }}>›</span>
                <span style={{ fontSize: 10, color: '#444', lineHeight: 1.45 }}>{line}</span>
              </div>
            ))}
          </div>
        )}
        {secActive(sec, 'volunteer') && d.volunteer && (
          <div className="tpl-timeline__section"><H label="Volunteer" />
            {String(d.volunteer).split('\n').filter(Boolean).map((line, i) => (
              <div key={i} className="tpl-timeline__bullet-line">
                <span style={{ color: a, fontWeight: 700, fontSize: 10, lineHeight: '16px', flexShrink: 0 }}>›</span>
                <span style={{ fontSize: 10, color: '#444', lineHeight: 1.45 }}>{line}</span>
              </div>
            ))}
          </div>
        )}
        {secActive(sec, 'interests') && d.interests && (
          <div className="tpl-timeline__section"><H label="Interests" />
            <div style={{ fontSize: 10, color: '#555' }}>{d.interests}</div>
          </div>
        )}
      </div>
    </div>
  );
}
