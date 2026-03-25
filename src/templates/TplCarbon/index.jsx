// src/templates/TplCarbon/index.jsx
import './TplCarbon.css';
import { BASE_STYLE, A4_PAD_V, A4_PAD_H, secActive, BulletList } from '../shared.jsx';

export default function TplCarbon({ d, sec, accent }) {
  const a = accent || '#1a1a1a';

  const H = ({ label }) => (
    <div className="tpl-carbon__heading">
      <div className="tpl-carbon__heading-bar" style={{ background: a }} />
      <span className="tpl-carbon__heading-label" style={{ color: a }}>{label}</span>
      <div className="tpl-carbon__heading-rule" style={{ background: a }} />
    </div>
  );

  const EntryBorder = ({ children }) => (
    <div className="tpl-carbon__entry" style={{ borderLeft: `2px solid ${a}22` }}>{children}</div>
  );

  const allSkills = (d.skillCategories || []).flatMap(c => c.items || []);

  return (
    <div style={{ ...BASE_STYLE }} className="resume-a4 tpl-carbon">
      <div className="tpl-carbon__header" style={{ background: a, padding: `${A4_PAD_V * 0.75}px ${A4_PAD_H}px ${A4_PAD_V * 0.5}px` }}>
        <div>
          <div className="tpl-carbon__name">{d.name || 'Your Name'}</div>
          <div className="tpl-carbon__title">{d.title || 'Job Title'}</div>
        </div>
        <div className="tpl-carbon__contacts">
          {[d.email, d.phone, d.location, d.linkedin, d.website].filter(Boolean).map((c, i) => (
            <span key={i} className="tpl-carbon__contact-item">{c}</span>
          ))}
        </div>
      </div>

      <div className="tpl-carbon__rule" style={{ background: `linear-gradient(90deg,${a}cc,${a}11)` }} />

      <div className="tpl-carbon__body" style={{ padding: `${A4_PAD_V * 0.55}px ${A4_PAD_H}px ${A4_PAD_V}px` }}>

        {secActive(sec, 'summary') && d.summary && (
          <div className="tpl-carbon__section">
            <H label="Summary" />
            <p className="tpl-carbon__plain-text" style={{ margin: 0, paddingLeft: 10 }}>{d.summary}</p>
          </div>
        )}

        {secActive(sec, 'experience') && (d.experience || []).length > 0 && (
          <div className="tpl-carbon__section">
            <H label="Experience" />
            {d.experience.map((exp, i) => (
              <EntryBorder key={i}>
                <div className="tpl-carbon__exp-row">
                  <div>
                    <span className="tpl-carbon__exp-role">{exp.role}</span>
                    <span className="tpl-carbon__exp-company">{exp.company}{exp.location ? ' · ' + exp.location : ''}</span>
                  </div>
                  <span className="tpl-carbon__exp-date">{exp.from}{exp.to ? ' – ' + exp.to : ''}</span>
                </div>
                <BulletList items={exp.bullets} color={a} />
              </EntryBorder>
            ))}
          </div>
        )}

        {secActive(sec, 'education') && (d.education || []).length > 0 && (
          <div className="tpl-carbon__section">
            <H label="Education" />
            {d.education.map((edu, i) => (
              <EntryBorder key={i}>
                <div className="tpl-carbon__exp-row">
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700 }}>{edu.degree}</div>
                    <div style={{ fontSize: 9, color: '#666' }}>{edu.school}{edu.grade ? ' · ' + edu.grade : ''}</div>
                  </div>
                  <span className="tpl-carbon__exp-date">{edu.from}{edu.to ? ' – ' + edu.to : ''}</span>
                </div>
              </EntryBorder>
            ))}
          </div>
        )}

        {secActive(sec, 'skills') && allSkills.length > 0 && (
          <div className="tpl-carbon__section">
            <H label="Skills" />
            <div className="tpl-carbon__skill-pills">
              {allSkills.map((s, i) => <span key={i} className="tpl-carbon__skill-pill">{s}</span>)}
            </div>
          </div>
        )}

        {secActive(sec, 'projects') && (d.projects || []).length > 0 && (
          <div className="tpl-carbon__section">
            <H label="Projects" />
            {d.projects.map((p, i) => (
              <EntryBorder key={i}>
                <div className="tpl-carbon__exp-row">
                  <span style={{ fontSize: 10.5, fontWeight: 700 }}>{p.name}</span>
                  {p.tech && <span style={{ fontSize: 8.5, color: '#888', flexShrink: 0, marginLeft: 6 }}>{p.tech}</span>}
                </div>
                {p.description && <div style={{ fontSize: 9.5, color: '#555', marginTop: 2, lineHeight: 1.45 }}>{p.description}</div>}
              </EntryBorder>
            ))}
          </div>
        )}

        {secActive(sec, 'certifications') && (d.certifications || []).length > 0 && (
          <div className="tpl-carbon__section">
            <H label="Certifications" />
            {d.certifications.map((c, i) => (
              <div key={i} className="tpl-carbon__two-col">
                <div><span style={{ fontSize: 10, fontWeight: 600 }}>{c.name}</span>{c.issuer && <span style={{ fontSize: 9, color: '#666', marginLeft: 5 }}>{c.issuer}</span>}</div>
                <span style={{ fontSize: 9, color: '#888', flexShrink: 0, marginLeft: 8 }}>{c.year}</span>
              </div>
            ))}
          </div>
        )}

        {secActive(sec, 'languages') && (d.languages || []).length > 0 && (
          <div className="tpl-carbon__section">
            <H label="Languages" />
            <div className="tpl-carbon__lang-row">
              {d.languages.map((l, i) => (
                <span key={i} style={{ fontSize: 10 }}><span style={{ fontWeight: 700 }}>{l.name}</span>{l.level && <span style={{ color: '#777' }}> · {l.level}</span>}</span>
              ))}
            </div>
          </div>
        )}

        {secActive(sec, 'achievements') && d.achievements && (
          <div className="tpl-carbon__section">
            <H label="Achievements" />
            {String(d.achievements).split('\n').filter(Boolean).map((line, i) => (
              <div key={i} className="tpl-carbon__bullet-line">
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
