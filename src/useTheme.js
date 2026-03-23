// src/useTheme.js
// ─────────────────────────────────────────────────────────────
// Custom hook: dark / light theme toggle
// • Reads saved preference from localStorage
// • Falls back to OS preference (prefers-color-scheme)
// • Writes [data-theme] on <html> so CSS variables respond
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'rf_theme_v1';

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch (_) { /* localStorage blocked */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme);

  // Apply to DOM whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}
  }, [theme]);

  // Listen for OS preference change (only if user hasn't saved a preference)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) setThemeState(e.matches ? 'dark' : 'light');
      } catch (_) {}
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(t => t === 'dark' ? 'light' : 'dark');
  }, []);

  const setTheme = useCallback((t) => {
    if (t === 'dark' || t === 'light') setThemeState(t);
  }, []);

  return { theme, toggleTheme, setTheme, isDark: theme === 'dark' };
}
