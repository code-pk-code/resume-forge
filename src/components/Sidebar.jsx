// src/components/Sidebar.jsx
import {
  IcoUser, IcoText, IcoBriefcase, IcoGradCap, IcoStar,
  IcoCode, IcoCert, IcoLang, IcoHeart, IcoFlag,
} from '../icons.jsx';

const SECTION_META = {
  basics:          { label: 'Basics',          icon: IcoUser,      bg: '#EEF3FC', color: '#2D6BE4', group: 'core' },
  summary:         { label: 'Summary',          icon: IcoText,      bg: '#F5F4F1', color: '#52525B', group: 'core' },
  experience:      { label: 'Experience',       icon: IcoBriefcase, bg: '#E1F5EE', color: '#1D9E75', group: 'core' },
  education:       { label: 'Education',        icon: IcoGradCap,   bg: '#EEEDFE', color: '#7F77DD', group: 'core' },
  skills:          { label: 'Skills',           icon: IcoStar,      bg: '#FAEEDA', color: '#BA7517', group: 'core' },
  projects:        { label: 'Projects',         icon: IcoCode,      bg: '#FAECE7', color: '#D85A30', group: 'optional' },
  certifications:  { label: 'Certifications',   icon: IcoCert,      bg: '#F0FDF4', color: '#16A34A', group: 'optional' },
  achievements:    { label: 'Achievements',     icon: IcoFlag,      bg: '#FEF2F2', color: '#DC2626', group: 'optional' },
  languages:       { label: 'Languages',        icon: IcoLang,      bg: '#F5F4F1', color: '#52525B', group: 'optional' },
  volunteer:       { label: 'Volunteer',        icon: IcoHeart,     bg: '#FFF1F0', color: '#E8593C', group: 'optional' },
  interests:       { label: 'Interests',        icon: IcoHeart,     bg: '#F5F4F1', color: '#888780', group: 'optional' },
};

const CORE_SECTIONS     = ['basics','summary','experience','education','skills'];
const OPTIONAL_SECTIONS = ['projects','certifications','achievements','languages','volunteer','interests'];

/**
 * Props:
 *   activeSection   string — currently focused section key
 *   enabledSections Set<string>
 *   onSectionClick  (key) => void
 *   onToggle        (key) => void
 *   completionPct   number
 *   visibleSections string[] — which optional sections to show (from feature flags)
 */
export default function Sidebar({
  activeSection,
  enabledSections,
  onSectionClick,
  onToggle,
  completionPct = 0,
  visibleSections = Object.keys(SECTION_META),
}) {
  const renderItem = (key) => {
    const meta = SECTION_META[key];
    if (!meta) return null;
    if (!visibleSections.includes(key)) return null;

    const isActive  = activeSection === key;
    const isEnabled = enabledSections.has(key);

    return (
      <div
        key={key}
        className={`sec-item${isActive ? ' active' : ''}`}
        onClick={() => onSectionClick(key)}
        role="button"
        tabIndex={0}
        aria-pressed={isActive}
        aria-label={`Go to ${meta.label} section`}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSectionClick(key)}
      >
        <div className="sec-left">
          <div
            className="sec-icon"
            style={{ background: meta.bg }}
            aria-hidden="true"
          >
            <meta.icon size={12} style={{ color: meta.color }} />
          </div>
          <span className="sec-label">{meta.label}</span>
        </div>

        {/* Only non-basics sections can be toggled */}
        {key !== 'basics' && (
          <button
            className={`toggle${isEnabled ? ' on' : ''}`}
            onClick={e => { e.stopPropagation(); onToggle(key); }}
            aria-label={`${isEnabled ? 'Disable' : 'Enable'} ${meta.label} section`}
            aria-pressed={isEnabled}
          />
        )}
      </div>
    );
  };

  return (
    <nav className="sidebar" aria-label="Resume sections">
      {/* Progress */}
      <div className="sidebar-head">
        <div className="progress-label">
          <span>Profile complete</span>
          <span>{completionPct}%</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={completionPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Profile completion"
        >
          <div className="progress-fill" style={{ width: `${completionPct}%` }} />
        </div>
      </div>

      <div className="sidebar-scroll">
        {/* Core sections */}
        <div className="sidebar-group-label">Core</div>
        {CORE_SECTIONS.map(renderItem)}

        <div className="sec-divider" />

        {/* Optional sections */}
        <div className="sidebar-group-label">Optional</div>
        {OPTIONAL_SECTIONS.map(renderItem)}
      </div>
    </nav>
  );
}
