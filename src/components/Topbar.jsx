// src/components/Topbar.jsx
import { IcoSun, IcoMoon, IcoDownload } from '../icons.jsx';

/**
 * Props:
 *   theme        'light' | 'dark'
 *   onToggleTheme  () => void
 *   onDownload     () => void
 *   appName        string
 *   tagline        string
 *   completionPct  number  0-100
 *   saved          boolean
 */
export default function Topbar({
  theme,
  onToggleTheme,
  onDownload,
  appName = 'ResumeForge',
  tagline = 'Free · A4 · No ads',
  completionPct = 0,
  saved = true,
}) {
  return (
    <header className="topbar">
      {/* Logo */}
      <a href="/" className="topbar-logo" aria-label={appName}>
        <div className="logo-mark" aria-hidden="true">
          <svg viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="6" rx="1" fill="white" fillOpacity="0.9"/>
            <rect x="1" y="9" width="5" height="4" rx="1" fill="white" fillOpacity="0.6"/>
            <rect x="8" y="1" width="5" height="4" rx="1" fill="white" fillOpacity="0.6"/>
            <rect x="8" y="7" width="5" height="6" rx="1" fill="white" fillOpacity="0.9"/>
          </svg>
        </div>
        {appName}
        <span className="topbar-tagline no-print">{tagline}</span>
      </a>

      {/* Mobile progress indicator */}
      <div className="topbar-progress" aria-label={`${completionPct}% complete`}>
        <div className="topbar-prog-track" role="progressbar" aria-valuenow={completionPct} aria-valuemin={0} aria-valuemax={100}>
          <div className="topbar-prog-fill" style={{ width: `${completionPct}%` }} />
        </div>
        <span>{completionPct}%</span>
      </div>

      {/* Right actions */}
      <div className="topbar-actions no-print">
        {/* Autosave */}
        {saved && (
          <span className="autosave-chip" aria-live="polite">
            <span className="autosave-dot" />
            Saved
          </span>
        )}

        {/* Theme toggle */}
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? <IcoSun size={15} /> : <IcoMoon size={15} />}
        </button>

        {/* Download */}
        <button className="btn btn-primary btn-sm" onClick={onDownload} aria-label="Download PDF">
          <IcoDownload size={13} />
          <span>Download PDF</span>
        </button>
      </div>
    </header>
  );
}
