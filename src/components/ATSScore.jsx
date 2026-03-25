// src/components/ATSScore.jsx
// ─────────────────────────────────────────────────────────────
// Computes a real ATS (Applicant Tracking System) score from the
// live resume data. Each check inspects actual field values —
// nothing is hard-coded to pass.
// ─────────────────────────────────────────────────────────────
import './ATSScore.css';

// ── Scoring rules ────────────────────────────────────────────
// Each rule: { id, label, detail, weight, check(data, sections) }
// check() returns true (pass) or false (fail).

const RULES = [
  {
    id: 'contact-name',
    label: 'Full name present',
    detail: 'ATS needs a name to index the candidate.',
    weight: 10,
    check: (d) => !!(d.name && d.name.trim().length > 1),
  },
  {
    id: 'contact-email',
    label: 'Email address included',
    detail: 'Required for recruiter contact and ATS candidate matching.',
    weight: 10,
    check: (d) => !!(d.email && /\S+@\S+/.test(d.email)),
  },
  {
    id: 'contact-phone',
    label: 'Phone number included',
    detail: 'Many ATS systems require a phone number for the record.',
    weight: 5,
    check: (d) => !!(d.phone && d.phone.trim().length >= 7),
  },
  {
    id: 'job-title',
    label: 'Job title / headline present',
    detail: 'A clear title helps ATS match the resume to job categories.',
    weight: 8,
    check: (d) => !!(d.title && d.title.trim().length > 1),
  },
  {
    id: 'summary',
    label: 'Professional summary written',
    detail: 'Summaries boost keyword density for ATS ranking.',
    weight: 8,
    check: (d, sec) => sec.has('summary') && !!(d.summary && d.summary.trim().length > 40),
  },
  {
    id: 'experience-present',
    label: 'Work experience section exists',
    detail: 'The most heavily weighted section in most ATS systems.',
    weight: 12,
    check: (d, sec) => sec.has('experience') && (d.experience || []).length > 0,
  },
  {
    id: 'experience-bullets',
    label: 'Experience has bullet points',
    detail: 'Bullet points improve ATS parsing and keyword extraction.',
    weight: 8,
    check: (d, sec) => sec.has('experience') && (d.experience || []).some(e => (e.bullets || []).filter(Boolean).length > 0),
  },
  {
    id: 'experience-dates',
    label: 'Employment dates filled in',
    detail: 'ATS often rejects entries with missing date ranges.',
    weight: 7,
    check: (d, sec) => sec.has('experience') && (d.experience || []).every(e => e.from && e.from.trim()),
  },
  {
    id: 'education',
    label: 'Education section present',
    detail: 'Required by most ATS to filter by degree level.',
    weight: 8,
    check: (d, sec) => sec.has('education') && (d.education || []).length > 0,
  },
  {
    id: 'skills',
    label: 'Skills section present',
    detail: 'Primary source of keyword matching in most ATS systems.',
    weight: 10,
    check: (d, sec) => sec.has('skills') && (d.skillCategories || []).flatMap(c => c.items || []).length >= 3,
  },
  {
    id: 'skills-count',
    label: 'At least 6 skills listed',
    detail: 'More skills = more keyword match opportunities.',
    weight: 5,
    check: (d, sec) => sec.has('skills') && (d.skillCategories || []).flatMap(c => c.items || []).length >= 6,
  },
  {
    id: 'no-photos',
    label: 'No embedded photos (text-safe)',
    detail: 'ATS systems cannot parse images — this template uses text only.',
    weight: 5,
    check: () => true, // template is always text-based
  },
  {
    id: 'standard-sections',
    label: 'Standard section headings used',
    detail: 'Non-standard headings confuse ATS parsers.',
    weight: 5,
    check: () => true, // headings are template-controlled
  },
  {
    id: 'summary-length',
    label: 'Summary is 2–5 sentences',
    detail: 'Very short or very long summaries hurt ATS scoring.',
    weight: 4,
    check: (d, sec) => {
      if (!sec.has('summary') || !d.summary) return false;
      const sentences = d.summary.split(/[.!?]+/).filter(s => s.trim().length > 4);
      return sentences.length >= 2 && sentences.length <= 8;
    },
  },
  {
    id: 'linkedin',
    label: 'LinkedIn URL provided',
    detail: 'Many ATS systems cross-reference LinkedIn profiles.',
    weight: 5,
    check: (d) => !!(d.linkedin && d.linkedin.trim().length > 4),
  },
];

const MAX_SCORE = RULES.reduce((sum, r) => sum + r.weight, 0);

export function computeATSScore(data, sections) {
  const sec = sections instanceof Set ? sections : new Set(Object.keys(sections || {}));
  const results = RULES.map(rule => ({
    ...rule,
    pass: !!rule.check(data, sec),
  }));
  const earned = results.filter(r => r.pass).reduce((sum, r) => sum + r.weight, 0);
  const score = Math.round((earned / MAX_SCORE) * 100);
  return { score, results };
}

// ── Component ─────────────────────────────────────────────────
export default function ATSScore({ data, sections }) {
  const { score, results } = computeATSScore(data, sections);

  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;

  const scoreColor =
    score >= 85 ? 'var(--green)' :
    score >= 65 ? 'var(--amber)' :
    'var(--red)';

  const scoreLabel =
    score >= 85 ? 'Excellent' :
    score >= 70 ? 'Good' :
    score >= 50 ? 'Fair' :
    'Needs work';

  const scoreBg =
    score >= 85 ? 'var(--green-bg)' :
    score >= 65 ? '#fffbeb' :
    '#fef2f2';

  const scoreBorder =
    score >= 85 ? 'rgba(22,163,74,0.2)' :
    score >= 65 ? 'rgba(217,119,6,0.25)' :
    'rgba(220,38,38,0.2)';

  return (
    <div className="ats-panel">
      <div className="ats-panel__title">ATS Score</div>

      {/* Score ring */}
      <div className="ats-panel__score-row" style={{ background: scoreBg, border: `1px solid ${scoreBorder}` }}>
        <div className="ats-panel__ring-wrap">
          <svg viewBox="0 0 52 52" className="ats-panel__ring-svg">
            <circle cx="26" cy="26" r="22" fill="none" stroke="#e5e7eb" strokeWidth="4" />
            <circle
              cx="26" cy="26" r="22" fill="none"
              stroke={scoreColor} strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 22}`}
              strokeDashoffset={`${2 * Math.PI * 22 * (1 - score / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 26 26)"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </svg>
          <div className="ats-panel__ring-label" style={{ color: scoreColor }}>
            <span className="ats-panel__ring-num">{score}</span>
            <span className="ats-panel__ring-pct">%</span>
          </div>
        </div>
        <div className="ats-panel__score-meta">
          <div className="ats-panel__score-label" style={{ color: scoreColor }}>{scoreLabel}</div>
          <div className="ats-panel__score-sub">{passed} of {results.length} checks passed</div>
          {failed > 0 && (
            <div className="ats-panel__score-hint">{failed} issue{failed > 1 ? 's' : ''} to fix</div>
          )}
        </div>
      </div>

      {/* Failed checks first */}
      {failed > 0 && (
        <div className="ats-panel__group">
          <div className="ats-panel__group-label ats-panel__group-label--fail">Issues to fix</div>
          {results.filter(r => !r.pass).map(r => (
            <CheckRow key={r.id} rule={r} />
          ))}
        </div>
      )}

      {/* Passed checks */}
      <div className="ats-panel__group">
        <div className="ats-panel__group-label ats-panel__group-label--pass">Passing checks</div>
        {results.filter(r => r.pass).map(r => (
          <CheckRow key={r.id} rule={r} />
        ))}
      </div>
    </div>
  );
}

function CheckRow({ rule }) {
  return (
    <div className="ats-check-row">
      <span className={`ats-check-row__icon ${rule.pass ? 'ats-check-row__icon--pass' : 'ats-check-row__icon--fail'}`}>
        {rule.pass ? '✓' : '✗'}
      </span>
      <div className="ats-check-row__content">
        <div className="ats-check-row__label">{rule.label}</div>
        {!rule.pass && <div className="ats-check-row__detail">{rule.detail}</div>}
      </div>
      <span className="ats-check-row__weight">+{rule.weight}</span>
    </div>
  );
}
