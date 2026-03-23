# ResumeForge

> Free professional resume builder — 9 templates · A4 PDF · Configurable · Self-hostable

---

## Table of Contents

1. [Features](#features)
2. [Quick Start](#quick-start)
3. [Project Structure](#project-structure)
4. [Configuration Reference](#configuration-reference)
5. [Environment Variables](#environment-variables)
6. [Feature Flags](#feature-flags)
7. [Deploy to Vercel](#deploy-to-vercel)
8. [Deploy to Netlify](#deploy-to-netlify)
9. [Deploy to GitHub Pages](#deploy-to-github-pages)
10. [Custom Domain Setup](#custom-domain-setup)
11. [Downloading PDF](#downloading-pdf)
12. [Customising Templates](#customising-templates)
13. [Capacity System](#capacity-system)
14. [Security](#security)
15. [Troubleshooting](#troubleshooting)
16. [FAQ](#faq)

---

## Features

| Feature | Detail |
|---|---|
| **9 Templates** | Nova, Executive, Carbon, Emerald, Minimal, Creative, Tech, Diplomat, Timeline |
| **15 Accent Colors** | Swap any template's color in one click |
| **10 Resume Sections** | Toggle on/off: Summary, Experience, Education, Skills, Projects, Certifications, Achievements, Languages, Volunteer, Interests |
| **Skill Bars** | Visual proficiency bars in sidebar templates |
| **Bullet Points** | Per-job bullet point editor |
| **Categorised Skills** | Group skills into named categories (e.g. Languages, Frameworks) |
| **A4 PDF** | Browser print → Save as PDF at exact A4 dimensions |
| **2-Page Limit** | Live page counter warns when content exceeds 2 pages |
| **Capacity System** | Handles up to 10,000 concurrent users; shows busy screen at limit |
| **Fully Configurable** | All limits, labels, colors, defaults editable via env vars |
| **Zero Backend** | Pure static app — no server, no database, no login |
| **Security Headers** | CSP, HSTS, X-Frame-Options on all responses |

---

## Quick Start

### Prerequisites

- **Node.js 18+** — check with `node --version`
- **npm 9+** — check with `npm --version`

### Install and run

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Copy env template and customise
cp .env.example .env.local
# Edit .env.local with your preferred values

# 3. Start dev server
npm run dev
# → Opens at http://localhost:3000
```

### Build for production

```bash
npm run build
# Output is in /dist — ready to deploy to any static host
```

### Preview the production build locally

```bash
npm run preview
# → Opens at http://localhost:4173
```

---

## Project Structure

```
resume-forge/
│
├── config/
│   └── app.config.js        ← All tuneable settings (read this first)
│
├── src/
│   ├── App.jsx              ← Complete app (templates, form, state)
│   ├── main.jsx             ← React entry point
│   └── index.css            ← Minimal reset only
│
├── public/
│   └── favicon.svg
│
├── docs/                    ← (this folder) additional documentation
│
├── index.html               ← HTML shell with meta tags
├── vite.config.js           ← Build, dev server, environment config
├── vercel.json              ← Vercel deployment + security headers
├── netlify.toml             ← Netlify deployment + security headers + caching
├── .env.example             ← All environment variables documented
├── .gitignore
└── package.json
```

---

## Configuration Reference

All settings live in **`config/app.config.js`**.
You can edit that file directly, or override any value via environment variables.

### APP

| Key | Default | Description |
|---|---|---|
| `APP.name` | `"ResumeForge"` | App name shown in nav bar and browser tab |
| `APP.tagline` | `"Free · A4 · No ads"` | Short tagline in nav |
| `APP.description` | (long) | Meta description for SEO |
| `APP.siteUrl` | `"https://resumeforge.vercel.app"` | Base URL for Open Graph tags |
| `APP.supportEmail` | `""` | Support email (empty = hidden) |
| `APP.githubUrl` | `""` | GitHub link (empty = hidden) |

### CAPACITY

| Key | Default | Description |
|---|---|---|
| `CAPACITY.maxWorkers` | `10000` | Max simultaneous active users |
| `CAPACITY.slotTtlMs` | `55000` | Slot expiry in ms (inactive tab timeout) |
| `CAPACITY.heartbeatMs` | `20000` | How often active tabs refresh their slot |
| `CAPACITY.storageKey` | `"rf_slots_v4"` | localStorage key for slots |

### RESUME

| Key | Default | Description |
|---|---|---|
| `RESUME.pageWidthPx` | `794` | A4 width at 96dpi |
| `RESUME.pageHeightPx` | `1123` | A4 height at 96dpi |
| `RESUME.maxPages` | `2` | Max pages before over-limit warning |
| `RESUME.fontsUrl` | Google Fonts URL | Set to `""` to use system fonts |

### FEATURES

| Key | Default | Description |
|---|---|---|
| `FEATURES.showCapacityBadge` | `true` | Live user counter in nav |
| `FEATURES.showColorPicker` | `true` | Accent color swatches |
| `FEATURES.showTemplatePicker` | `true` | Template grid |
| `FEATURES.showSectionToggles` | `true` | Section on/off buttons |
| `FEATURES.enableInterests` | `true` | Interests section option |
| `FEATURES.enableVolunteer` | `true` | Volunteer section option |
| `FEATURES.enableSkillBars` | `true` | Skill proficiency bars |

### DEFAULTS

| Key | Default | Description |
|---|---|---|
| `DEFAULTS.template` | `"nova"` | Template shown on first load |
| `DEFAULTS.sections` | (7 sections) | Sections enabled on first load |
| `DEFAULTS.accentColor` | `"#2D6BE4"` | Accent color on first load |

### COLOR_PRESETS

Array of hex strings shown in the color picker.
Override via `VITE_COLOR_PRESETS` (comma-separated hex values).

---

## Environment Variables

Copy `.env.example` to `.env.local` for local development.
On Vercel/Netlify, set these in the dashboard — no file needed.

```bash
cp .env.example .env.local
```

All variables are **optional**. The app works with zero env vars using built-in defaults.

### Examples

**Rebrand the app:**
```env
VITE_APP_NAME=MyResumeBuilder
VITE_APP_TAGLINE=Built with ❤ in Pune
VITE_SITE_URL=https://myresume.example.com
```

**Lower capacity for a smaller server:**
```env
VITE_MAX_WORKERS=500
VITE_SLOT_TTL_MS=30000
```

**Change the default template and colour:**
```env
VITE_DEFAULT_TEMPLATE=minimal
VITE_DEFAULT_ACCENT=#222222
VITE_DEFAULT_SECTIONS=summary,experience,education,skills,projects
```

**Disable features you don't want:**
```env
VITE_SHOW_CAPACITY_BADGE=false
VITE_ENABLE_INTERESTS=false
VITE_ENABLE_VOLUNTEER=false
```

**Custom accent colors only:**
```env
VITE_COLOR_PRESETS=#1a2744,#0a6e5a,#C0392B,#6C3FC5,#8B6914
```

---

## Feature Flags

Feature flags let you disable parts of the UI without touching code.
Set any flag to `"false"` in your `.env.local` or hosting dashboard.

| Flag | Effect when false |
|---|---|
| `VITE_SHOW_CAPACITY_BADGE` | Hides the live user counter in the nav |
| `VITE_SHOW_COLOR_PICKER` | Hides accent color swatches |
| `VITE_SHOW_TEMPLATE_PICKER` | Hides the template grid (locks to default template) |
| `VITE_SHOW_SECTION_TOGGLES` | Hides section on/off buttons (locks to default sections) |
| `VITE_ENABLE_INTERESTS` | Removes Interests from available sections |
| `VITE_ENABLE_VOLUNTEER` | Removes Volunteer from available sections |
| `VITE_ENABLE_SKILL_BARS` | Disables skill proficiency bars in templates |

---

## Deploy to Vercel

**Recommended.** Free Hobby plan is more than enough.

### Option A — GitHub (recommended, auto-deploy on every push)

1. Push the project to a GitHub repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. Click **Import** → select your repository
4. Framework preset is auto-detected as **Vite**
5. Under **Environment Variables**, add any vars from `.env.example` you want to override
6. Click **Deploy**

Every push to `main` auto-deploys. Pull requests get preview URLs.

### Option B — Vercel CLI

```bash
# Install CLI
npm install -g vercel

# Login
vercel login

# Deploy (first time — follow the prompts)
vercel

# Set environment variables (repeat for each)
vercel env add VITE_APP_NAME

# Deploy to production
vercel --prod
```

### Vercel environment variables

In the Vercel dashboard: **Project → Settings → Environment Variables**

Add each `VITE_*` variable from `.env.example` that you want to customise.
Mark them as **Production** (and optionally Preview/Development).

After adding variables, **redeploy** the project for them to take effect.

---

## Deploy to Netlify

### Option A — Netlify UI (recommended)

1. Go to [app.netlify.com](https://app.netlify.com)
2. **Add new site → Import an existing project**
3. Connect to your GitHub repo
4. Build settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Site configuration → Environment variables → Add a variable**
   — add any vars from `.env.example` you want to override
6. Click **Deploy site**

### Option B — Netlify CLI

```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Link to a site (first time)
netlify init

# Set environment variables
netlify env:set VITE_APP_NAME MyResumeBuilder
netlify env:set VITE_MAX_WORKERS 500

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

---

## Deploy to GitHub Pages

GitHub Pages requires a base URL if your repo is not at the root domain.

1. Add to `vite.config.js` inside `defineConfig`:
   ```js
   base: '/your-repo-name/',
   ```

2. Install the deploy helper:
   ```bash
   npm install -D gh-pages
   ```

3. Add to `package.json` scripts:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

5. In GitHub: **Settings → Pages → Source → gh-pages branch**

> Note: GitHub Pages does not support custom response headers,
> so the security headers in `vercel.json` / `netlify.toml` won't apply.
> Use Vercel or Netlify for production with proper security headers.

---

## Custom Domain Setup

### On Vercel

1. **Project → Settings → Domains → Add**
2. Enter your domain (e.g. `resumeforge.in`)
3. Add the DNS records shown:
   - For apex domain: **A record** pointing to Vercel's IP
   - For subdomain (e.g. `www`): **CNAME** pointing to `cname.vercel-dns.com`
4. HTTPS is provisioned automatically (Let's Encrypt, renews automatically)

### On Netlify

1. **Site configuration → Domain management → Add custom domain**
2. Enter your domain
3. Point your DNS to Netlify's nameservers or add the provided CNAME/A record
4. HTTPS is automatic

### Where to buy a domain (India)

| Registrar | Price (approx.) |
|---|---|
| GoDaddy | ₹800–1,200/year for `.in` |
| Namecheap | $8–12/year for `.com` |
| Cloudflare Registrar | At cost (cheapest for `.com`) |
| BigRock | ₹700–900/year for `.in` |

---

## Downloading PDF

1. Click **Download PDF (A4)** in the form panel
2. Your browser's print dialog opens
3. Configure these settings for best results:

| Setting | Value |
|---|---|
| Destination / Printer | **Save as PDF** |
| Paper size | **A4** |
| Margins | **None** (or Minimum) |
| Background graphics | **ON** (checked) |
| Scale | **100%** (default) |

4. Click **Save**

### Browser-specific notes

| Browser | Notes |
|---|---|
| **Chrome / Edge** | Best results. Use "More settings" to find background graphics toggle |
| **Firefox** | Works well. Check "Print backgrounds" in the print dialog |
| **Safari** | Works. Set margins to "None" manually |

### Why not use a PDF library?

Libraries like `jsPDF` or `html2canvas` produce lower-quality PDFs with font rendering issues. Browser print uses the native PDF engine and produces pixel-perfect output at the correct A4 size.

---

## Customising Templates

### Change a template's default layout

Each template is a function in `src/App.jsx` named `Tpl<Name>` (e.g. `TplNova`, `TplMinimal`).

They accept three props:
- `d` — the resume data object
- `sec` — a `Set<string>` of active section keys
- `accent` — the current accent color hex string

### Add a new template

1. In `src/App.jsx`, write a new function:
   ```jsx
   function TplMyTemplate({ d, sec, accent }) {
     return (
       <div style={{ fontFamily: "'DM Sans',sans-serif", background: "white", minHeight: A4_H, padding: "40px" }}>
         <h1 style={{ color: accent }}>{d.name}</h1>
         {/* ... rest of template ... */}
       </div>
     );
   }
   ```

2. Register it in `TPL_MAP`:
   ```js
   const TPL_MAP = {
     // ... existing templates ...
     mytemplate: TplMyTemplate,
   };
   ```

3. Add it to `TEMPLATES` array:
   ```js
   { id: "mytemplate", name: "My Template", desc: "Custom layout", accent: "#123456" },
   ```

### Change default accent color per template

In the `TEMPLATES` array in `App.jsx`, update the `accent` field for any template.
When the user selects that template, the accent switches automatically.

---

## Capacity System

### How it works

The capacity system uses `localStorage` to coordinate slot allocation across browser tabs on the same device — and across different devices on the same shared session storage.

1. When a user opens the app, `claimSlot()` is called
2. It reads current active slots from `localStorage[SLOT_KEY]`
3. Slots older than `SLOT_TTL` (55s) are pruned as stale
4. If `liveCount >= MAX_WORKERS`, the busy screen is shown
5. Otherwise, a new UUID slot is written with the current timestamp
6. Every `HB_MS` (20s), the active tab refreshes its slot timestamp
7. When the tab closes, `releaseSlot()` removes the slot immediately

### Important notes

- This is **client-side enforcement only**. A determined user can bypass it by clearing localStorage.
- It is designed to prevent casual overload and provide a good UX signal, not hard security.
- For hard enforcement, add a lightweight Supabase or Firebase counter that `claimSlot()` calls before allocating locally.

### Tuning capacity

```env
# Allow 500 users (smaller server / free tier)
VITE_MAX_WORKERS=500

# Allow 50,000 users (enterprise)
VITE_MAX_WORKERS=50000

# Shorten slot TTL so busy periods resolve faster
VITE_SLOT_TTL_MS=30000

# More frequent heartbeat (uses slightly more CPU)
VITE_HEARTBEAT_MS=10000
```

---

## Security

### Headers applied on every response

| Header | Value | Purpose |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing |
| `X-Frame-Options` | `DENY` | Blocks clickjacking |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Blocks unnecessary APIs |
| `Strict-Transport-Security` | `max-age=63072000; preload` | Forces HTTPS for 2 years |
| `Content-Security-Policy` | (see vercel.json) | Restricts script/style/font sources |

These are set in `vercel.json` (Vercel) and `netlify.toml` (Netlify).

### Input sanitisation

Every user input is passed through `clean()` before being stored in state:

```js
const clean = (v, max = 300) =>
  String(v ?? "").replace(/<[^>]*>/g, "").slice(0, max);
```

This strips all HTML tags and enforces a character limit, preventing XSS via resume content.

### No tracking, no analytics, no ads

The app makes no external requests except:
- Google Fonts (optional, disable by setting `VITE_FONTS_URL=""`)

There is no tracking, no cookies, no analytics, and no ads.

---

## Troubleshooting

### `npm install` fails

Ensure you have Node.js 18 or later:
```bash
node --version   # should print v18.x.x or higher
npm --version    # should print 9.x.x or higher
```

If Node is outdated, use [nvm](https://github.com/nvm-sh/nvm):
```bash
nvm install 20
nvm use 20
```

### Dev server doesn't open

Check if port 3000 is already in use:
```bash
lsof -i :3000     # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

Change the port in `vite.config.js` or set `PORT=3001` in `.env.local`.

### PDF looks wrong (cut off, wrong size)

- Ensure **Margins** is set to **None** in the print dialog
- Ensure **Background graphics** is **ON**
- Use Chrome or Edge for best results
- Set scale to **100%**

### Resume overflows 2 pages

- Shorten job descriptions — aim for 2–3 bullet points per role
- Remove optional sections (Volunteer, Interests)
- Use the **Minimal** or **Executive** templates (more content per page)
- The over-limit warning in the form panel shows exactly when you cross the threshold

### Capacity badge shows wrong count

The counter uses `localStorage` and only reflects activity on the **same browser** (same origin). It is a best-effort UX feature, not a precise real-time counter.

### Fonts don't load offline

The app loads fonts from Google Fonts. To work offline, either:
1. Download the fonts and serve them locally (put in `/public/fonts/`)
2. Update `VITE_FONTS_URL=""` to use system fonts

### Vite build fails

Run `npm run lint` first to catch any syntax errors, then retry `npm run build`.

---

## FAQ

**Is this really free to host?**
Yes. Vercel and Netlify both offer free tiers with generous bandwidth (100 GB/month on Vercel). A static site this small comfortably serves thousands of users per month at zero cost.

**Do users' resume data get stored anywhere?**
No. All data lives in React state in the user's browser. Nothing is sent to any server. When the user closes the tab, the data is gone. (This is a feature — zero data liability.)

**Can I add a "save and come back later" feature?**
Yes. Store the resume data in `localStorage` on every change. On mount, check if saved data exists and pre-fill the form. This requires no backend.

**How do I change the font used in resumes?**
In `src/App.jsx`, find the template you want to change and update the `fontFamily` in the inline styles. Remember to add the font to `RESUME.fontsUrl` in `config/app.config.js`.

**Can I remove templates I don't want?**
Yes. Remove the entry from the `TEMPLATES` array in `src/App.jsx` and delete the corresponding `TplXxx` function and entry in `TPL_MAP`.

**How do I add a logo to the resume?**
The `Nova` and `Carbon` templates have an initials avatar. To add a real image, replace the initials `<div>` with an `<img>` tag and add an image upload field to the form.

**Can I self-host on a VPS (Nginx, Apache)?**
Yes. Run `npm run build` and serve the `/dist` folder as a static site.

Nginx example:
```nginx
server {
  listen 80;
  server_name resumeforge.example.com;
  root /var/www/resume-forge/dist;
  index index.html;
  location / { try_files $uri $uri/ /index.html; }
}
```

Add SSL with Certbot: `certbot --nginx -d resumeforge.example.com`
