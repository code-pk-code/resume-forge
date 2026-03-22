/**
 * app.config.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Central configuration file for ResumeForge.
 *
 * HOW TO CUSTOMISE
 * ────────────────
 * 1. Edit values here directly (works for everything).
 * 2. Override via environment variables (Vercel / Netlify dashboard or .env.local).
 *    Any key that has an import.meta.env counterpart can be set in .env files.
 *    See .env.example for the full list.
 *
 * SECTIONS
 * ────────
 *  APP      — branding, metadata
 *  CAPACITY — concurrent-user cap & slot timing
 *  RESUME   — A4 page dimensions, max pages, font URL
 *  FEATURES — toggle UI features on/off
 *  DEFAULTS — which template / sections / colors are pre-selected
 * ─────────────────────────────────────────────────────────────────────────────
 */

const env = import.meta.env; // Vite inlines these at build time

/* ── APP ──────────────────────────────────────────────────────────────────── */
export const APP = {
  /** Displayed in the nav bar and browser tab */
  name: env.VITE_APP_NAME || "ResumeForge",

  /** Short tagline shown in the nav */
  tagline: env.VITE_APP_TAGLINE || "Free · A4 · No ads",

  /** Shown in <meta name="description"> */
  description:
    env.VITE_APP_DESCRIPTION ||
    "Professional resume builder — 9 templates, A4 PDF, free forever.",

  /** Base URL used in Open Graph tags (no trailing slash) */
  siteUrl: env.VITE_SITE_URL || "https://resumeforge.vercel.app",

  /** Contact / support email shown in the footer (set to "" to hide) */
  supportEmail: env.VITE_SUPPORT_EMAIL || "",

  /** GitHub repo URL (set to "" to hide the link) */
  githubUrl: env.VITE_GITHUB_URL || "",
};

/* ── CAPACITY ─────────────────────────────────────────────────────────────── */
export const CAPACITY = {
  /**
   * Maximum number of simultaneous active users.
   * When live_count >= maxWorkers the busy screen is shown.
   * Free-tier Vercel/Netlify can handle this comfortably because
   * all enforcement is client-side (localStorage slots).
   * Increase if you have a paid hosting plan.
   */
  maxWorkers: parseInt(env.VITE_MAX_WORKERS || "10000"),

  /**
   * How long (ms) a slot stays alive without a heartbeat.
   * If the user closes their tab, their slot expires after this time.
   * Default: 55 seconds.
   */
  slotTtlMs: parseInt(env.VITE_SLOT_TTL_MS || "55000"),

  /**
   * How often (ms) the active tab refreshes its slot.
   * Must be less than slotTtlMs.
   * Default: 20 seconds.
   */
  heartbeatMs: parseInt(env.VITE_HEARTBEAT_MS || "20000"),

  /**
   * localStorage key used to store active slots.
   * Change this if you have multiple apps on the same domain.
   */
  storageKey: env.VITE_SLOT_KEY || "rf_slots_v4",
};

/* ── RESUME ───────────────────────────────────────────────────────────────── */
export const RESUME = {
  /**
   * A4 dimensions in pixels at 96 dpi.
   * Do NOT change unless you want a different paper size
   * (e.g. US Letter = 816 × 1056).
   */
  pageWidthPx: 794,
  pageHeightPx: 1123,

  /** Maximum allowed pages before the over-limit warning fires */
  maxPages: parseInt(env.VITE_MAX_PAGES || "2"),

  /**
   * Google Fonts URL loaded in the app <style> tag.
   * Replace with a self-hosted URL or set to "" to use system fonts.
   */
  fontsUrl:
    env.VITE_FONTS_URL ||
    "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap",
};

/* ── FEATURES ─────────────────────────────────────────────────────────────── */
export const FEATURES = {
  /** Show the live user counter in the nav bar */
  showCapacityBadge: (env.VITE_SHOW_CAPACITY_BADGE ?? "true") !== "false",

  /** Show the color accent picker */
  showColorPicker: (env.VITE_SHOW_COLOR_PICKER ?? "true") !== "false",

  /** Allow users to switch templates */
  showTemplatePicker: (env.VITE_SHOW_TEMPLATE_PICKER ?? "true") !== "false",

  /** Show the section toggle panel */
  showSectionToggles: (env.VITE_SHOW_SECTION_TOGGLES ?? "true") !== "false",

  /** Show the Interests section option */
  enableInterests: (env.VITE_ENABLE_INTERESTS ?? "true") !== "false",

  /** Show the Volunteer section option */
  enableVolunteer: (env.VITE_ENABLE_VOLUNTEER ?? "true") !== "false",

  /** Show skill proficiency bars (only relevant in sidebar templates) */
  enableSkillBars: (env.VITE_ENABLE_SKILL_BARS ?? "true") !== "false",
};

/* ── DEFAULTS ─────────────────────────────────────────────────────────────── */
export const DEFAULTS = {
  /**
   * Template shown when the app first loads.
   * Must be one of: nova | executive | carbon | emerald | minimal |
   *                 creative | tech | diplomat | timeline
   */
  template: env.VITE_DEFAULT_TEMPLATE || "nova",

  /**
   * Sections enabled by default (comma-separated string in env).
   * Example: VITE_DEFAULT_SECTIONS="summary,experience,education,skills,projects"
   */
  sections: (
    env.VITE_DEFAULT_SECTIONS ||
    "summary,experience,education,skills,projects,certifications,achievements"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  /**
   * Default accent color (hex).
   * Should match the accent of DEFAULTS.template above.
   */
  accentColor: env.VITE_DEFAULT_ACCENT || "#2D6BE4",
};

/* ── COLOR PRESETS ────────────────────────────────────────────────────────── */
/**
 * Accent color swatches shown in the form panel.
 * Add, remove, or reorder as needed.
 * Format: array of hex strings.
 */
export const COLOR_PRESETS = (env.VITE_COLOR_PRESETS || "")
  .split(",")
  .map((c) => c.trim())
  .filter((c) => /^#[0-9a-fA-F]{6}$/.test(c)).length
  ? (env.VITE_COLOR_PRESETS || "").split(",").map((c) => c.trim())
  : [
      "#2D6BE4", "#1a2744", "#1c1c1c", "#0a6e5a", "#222222",
      "#C0392B", "#6C3FC5", "#8B6914", "#0891b2", "#7C3AED",
      "#DC2626", "#0284C7", "#059669", "#D97706", "#BE185D",
    ];
