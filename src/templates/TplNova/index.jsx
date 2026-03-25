// src/templates/TplNova/index.jsx
// Nova — full-bleed colored header, single-column body, avatar initial.
import './TplNova.css';
import { BASE_STYLE, A4_PAD_V, A4_PAD_H, secActive, BulletList } from '../shared.jsx';

export default function TplNova({ d, sec, accent }) {
  const a = accent || '#2D6BE4';

  const SectionHeading = ({ label }) => (
    <>
      <div className="tpl-nova__section-label" style={{ color: a }}>{label}</div>
      <div className="tpl-nova__section-rule" style={{ background: a }} />
    </>
  );

  return (
    <div style={{ ...BASE_STYLE }} className="resume-a4 tpl-nova">

      {/* ── Header ── */}
      <div className="tpl-nova__header" style={{
        background: a,
        padding: `${A4_PAD_V * 0.75}px ${A4_PAD_H}px ${A4_PAD_V * 0.5}px`,
      }}>
        <div className="tpl-nova__name-row">
          <div className="tpl-nova__avatar">
            {(d.name || 'Y').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="tpl-nova__name">{d.name || 'Your Name'}</div>
            <div className="tpl-nova__title">{d.title || 'Job Title'}</div>
          </div>
        </div>
        <div className="tpl-nova__contacts">
          {[d.email, d.phone, d.location, d.linkedin, d.website].filter(Boolean).map((c, i) => (
            <span key={i} className="tpl-nova__contact-item">{c}</span>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="tpl-nova__body" style={{ padding: `${A4_PAD_V * 0.5}px ${A4_PAD_H}px ${A4_PAD_V}px` }}>

        {secActive(sec, 'summary') && d.summary && (
          <div className="tpl-nova__section">
            <SectionHeading label="Summary" />
            <p className="tpl-nova__plain-text" style={{ margin: 0 }}>{d.summary}</p>
          </div>
        )}

        {secActive(sec, 'experience') && (d.experience || []).length > 0 && (
          <div className="tpl-nova__section">
            <SectionHeading label="Experience" />
            {d.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div className="tpl-nova__exp-row">
                  <div>
                    <span className="tpl-nova__exp-role">{exp.role}</span>
                    <span className="tpl-nova__exp-company">{exp.company}{exp.location ? ' · ' + exp.location : ''}</span>
                  </div>
                  <span className="tpl-nova__exp-date">{exp.from}{exp.to ? ' – ' + exp.to : ''}</span>
                </div>
                <BulletList items={exp.bullets} color={a} />
              </div>
            ))}
          </div>
        )}

        {secActive(sec, 'education') && (d.education || []).length > 0 && (
          <div className="tpl-nova__section">
            <SectionHeading label="Education" />
            {d.education.map((edu, i) => (
              <div key={i} className="tpl-nova__edu-row">
                <div>
                  <div className="tpl-nova__edu-degree">{edu.degree}</div>
                  <div className="tpl-nova__edu-school">{edu.school}{edu.grade ? ' · ' + edu.grade : ''}</div>
                </div>
                <span className="tpl-nova__exp-date">{edu.from}{edu.to ? ' – ' + edu.to : ''}</span>
              </div>
            ))}
          </div>
        )}

        {secActive(sec, 'skills') && (d.skillCategories || []).length > 0 && (
          <div className="tpl-nova__section">
            <SectionHeading label="Skills" />
            {d.skillCategories.map((cat, ci) => (
              <div key={ci} className="tpl-nova__skill-row">
                {cat.name && <span className="tpl-nova__skill-cat">{cat.name}</span>}
                <div className="tpl-nova__skill-pills">
                  {(cat.items || []).map((s, si) => (
                    <span key={si} className="tpl-nova__skill-pill" style={{ background: a + '14', color: a, border: `0.5px solid ${a}35` }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {secActive(sec, 'projects') && (d.projects || []).length > 0 && (
          <div className="tpl-nova__section">
            <SectionHeading label="Projects" />
            {d.projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div className="tpl-nova__proj-row">
                  <div>
                    <span className="tpl-nova__proj-name">{p.name}</span>
                    {p.tech && <span className="tpl-nova__proj-tech">({p.tech})</span>}
                  </div>
                  {p.url && <span className="tpl-nova__proj-url" style={{ color: a }}>{p.url}</span>}
                </div>
                {p.description && <div className="tpl-nova__proj-desc">{p.description}</div>}
              </div>
            ))}
          </div>
        )}

        {secActive(sec, 'certifications') && (d.certifications || []).length > 0 && (
          <div className="tpl-nova__section">
            <SectionHeading label="Certifications" />
            {d.certifications.map((c, i) => (
              <div key={i} className="tpl-nova__two-col-row">
                <div>
                  <span style={{ fontSize: 10, fontWeight: 600 }}>{c.name}</span>
                  {c.issuer && <span style={{ fontSize: 9, color: '#666', marginLeft: 5 }}>{c.issuer}</span>}
                </div>
                <span style={{ fontSize: 9, color: '#777', flexShrink: 0, marginLeft: 8 }}>{c.year}</span>
              </div>
            ))}
          </div>
        )}

        {secActive(sec, 'languages') && (d.languages || []).length > 0 && (
          <div className="tpl-nova__section">
            <SectionHeading label="Languages" />
            <div className="tpl-nova__lang-pills">
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
          <div className="tpl-nova__section">
            <SectionHeading label="Achievements" />
            {String(d.achievements).split('\n').filter(Boolean).map((line, i) => (
              <div key={i} className="tpl-nova__bullet-line">
                <span style={{ color: a, fontWeight: 700, fontSize: 10, lineHeight: '16px', flexShrink: 0 }}>›</span>
                <span style={{ fontSize: 10, color: '#444', lineHeight: 1.45 }}>{line}</span>
              </div>
            ))}
          </div>
        )}

        {secActive(sec, 'volunteer') && d.volunteer && (
          <div className="tpl-nova__section">
            <SectionHeading label="Volunteer" />
            {String(d.volunteer).split('\n').filter(Boolean).map((line, i) => (
              <div key={i} className="tpl-nova__bullet-line">
                <span style={{ color: a, fontWeight: 700, fontSize: 10, lineHeight: '16px', flexShrink: 0 }}>›</span>
                <span style={{ fontSize: 10, color: '#444', lineHeight: 1.45 }}>{line}</span>
              </div>
            ))}
          </div>
        )}

        {secActive(sec, 'interests') && d.interests && (
          <div className="tpl-nova__section">
            <SectionHeading label="Interests" />
            <div className="tpl-nova__plain-text">{d.interests}</div>
          </div>
        )}
      </div>
    </div>
  );
}
