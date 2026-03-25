// src/templates/index.js
// ─────────────────────────────────────────────────────────────
// Single import point for all resume templates.
// App.jsx imports ONLY from here — never from individual template
// folders — so adding / removing a template is a one-file change.
// ─────────────────────────────────────────────────────────────

export { default as TplNova      } from './TplNova/index.jsx';
export { default as TplMinimal   } from './TplMinimal/index.jsx';
export { default as TplExecutive } from './TplExecutive/index.jsx';
export { default as TplCarbon    } from './TplCarbon/index.jsx';
export { default as TplEmerald   } from './TplEmerald/index.jsx';
export { default as TplTech      } from './TplTech/index.jsx';
export { default as TplCreative  } from './TplCreative/index.jsx';
export { default as TplDiplomat  } from './TplDiplomat/index.jsx';
export { default as TplTimeline  } from './TplTimeline/index.jsx';

// ── Template registry ────────────────────────────────────────
// Add a new template: create src/templates/TplFoo/, export above,
// add an entry here. Nothing else needs to change.
import TplNova      from './TplNova/index.jsx';
import TplMinimal   from './TplMinimal/index.jsx';
import TplExecutive from './TplExecutive/index.jsx';
import TplCarbon    from './TplCarbon/index.jsx';
import TplEmerald   from './TplEmerald/index.jsx';
import TplTech      from './TplTech/index.jsx';
import TplCreative  from './TplCreative/index.jsx';
import TplDiplomat  from './TplDiplomat/index.jsx';
import TplTimeline  from './TplTimeline/index.jsx';

export const TPL_MAP = {
  nova:      TplNova,
  minimal:   TplMinimal,
  executive: TplExecutive,
  carbon:    TplCarbon,
  emerald:   TplEmerald,
  tech:      TplTech,
  creative:  TplCreative,
  diplomat:  TplDiplomat,
  timeline:  TplTimeline,
};

export const TEMPLATES = [
  { id: 'nova',      name: 'Nova',      accent: '#2D6BE4' },
  { id: 'executive', name: 'Executive', accent: '#1a2744' },
  { id: 'minimal',   name: 'Minimal',   accent: '#222222' },
  { id: 'carbon',    name: 'Carbon',    accent: '#1a1a1a' },
  { id: 'emerald',   name: 'Emerald',   accent: '#1D9E75' },
  { id: 'tech',      name: 'Tech',      accent: '#0ea5e9' },
  { id: 'creative',  name: 'Creative',  accent: '#D85A30' },
  { id: 'diplomat',  name: 'Diplomat',  accent: '#7F77DD' },
  { id: 'timeline',  name: 'Timeline',  accent: '#BA7517' },
];
