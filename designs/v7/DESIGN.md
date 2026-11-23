# Design: CloseDesk (Final Aicyro Pro)

> **Public website: Obsidian (redesign 2026-11-23).** The public site no longer follows the "Public website" variant at the end of this file; it uses the Obsidian system below. The operator app (/lg, chatbot widget) is unchanged, and the super admin portal (/mes, /messages) keeps the frozen pre-redesign kit.

## Obsidian (public website)
- **Scope:** `.www` on public routes (`_app.jsx`). Admin routes render under `.www-legacy` with `src/styles/www-legacy.css`, generated from `scripts/legacy/*.pre-redesign.css` by `scripts/scope-www-legacy.js`, and use `components/Essntials/legacy/Legacy{Navbar,Footer}.jsx`.
- **Isolation rule:** every public stylesheet (`www.css`, `www/*.css`) is scoped with `node scripts/scope-www.js <file>` after editing (selectors become `:where(.www) ...`, specificity unchanged), so nothing reaches the admin portal.
- **Palette** (`www.css`, `.www`): canvas `--ob-0` #09090B, slate `--ob-2` #18181B, ink `--ob-ink` #F8FAFC, muted `--ob-ink-2`, labels `--ob-ink-3`, hairlines `--ob-line(-2)`. Accent is `var(--primary)` (brand violet, tenant hues keep working) as `--ob-accent`, `--ob-accent-soft` (small text, icons, focus) and `--ob-accent-glow`. The public site is dark only; the light/dark switch was removed from its nav.
- **Type:** Unbounded 400-600 (`--font-display`, h1/h2), Geist (`--font-body`), Geist Mono (`--font-mono`, eyebrows, labels, figures). Loaded with next/font in `_app.jsx`; the 3D hero reads `public/fonts/unbounded-{400,600}.woff`.
- **Primitives:** the `ax-*` kit (same class API, restyled), plus `ob-eyebrow` ("01 / Section"), `ob-banner` + `ob-ambient` (inner-page hero with accent glow and perspective grid), `ob-card` (glass card with a cursor-tracking border glow via `--mx/--my`), `ob-nav` (floating glass bar; renders a spacer unless `overlay`), `ob-foot` (four columns and the outline wordmark). Primary button is an off-white pill; quiet button is a glass outline.
- **Motion:** Lenis smooth scroll on the GSAP ticker (`components/motion/SmoothScroll.jsx`, off under reduced motion, paused while the page is locked); `data-reveal` fade-and-rise; `Magnetic` wrapper for CTAs; GSAP ScrollTrigger for the statement word reveal and KPI count-up. Everything has a reduced-motion end state.
- **Home hero:** `components/hero/WalkInHero.jsx` (500vh track, sticky stage, HUD, skip control, static fallback) + `walkInScene.js` (vanilla three + troika-three-text, client only via next/dynamic, full disposal on unmount). The scene writes its progress to `--wh-p`; overlays in `www/walkin.css` derive from it. Beat copy lives in `walkInScene.js` (BEATS) and `beatsCopy.js`; change both.
- **Home sections:** `components/Home/obsidian/*` (Statement, Capabilities, SelectedWork, Proof, ClosingCTA) plus the reused ProcessSection, EstimatorTeaser, Testimonial, client logos and tech stack; styles in `www/home.css`.

---


The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System
- Genre: modern-minimal
- Public site (Aicyro website): shape "work index" (Index-First, job: hire), `src/styles/www.css`, scoped under `.www` (set on public routes in `_app.jsx`); kit classes are prefixed `ax-`. The old "night shift" `site.css` is engine-only now (scoped to `html.cd-root`)
- Operator app (`/lg`, super admin, chatbot widget): shape "app screen" (`src/styles/closedesk.css`, scoped under `.cd-app`, widget under `.cdw`)
- Theme: brand. CloseDesk violet `#8a2be2` is the default signal, and every tenant hue (Appearance: mode, hue, shade) replaces it through `--primary`
- Axes: light/grotesk-sans/chromatic-violet · posture: restrained (the accent marks the primary action, the current selection, focus and the one chart series that argues, nothing else)

## Tokens
`src/styles/tokens.css` is the source of truth. It maps every role onto the tenant theme variables in `globals.css`, so never hard-code a colour.
```css
:root {
  --color-paper: var(--background);  --color-paper-2: mix(card, background);  --color-paper-3: var(--card-bg);
  --color-ink: var(--foreground);  --color-ink-2: var(--foreground-muted);  --color-muted: var(--foreground-muted);  --color-rule: var(--border-color);
  --color-accent: var(--primary);  --color-accent-ink: var(--on-primary);  --color-focus: var(--primary);
}
.cd-app, .cdw {   /* closedesk.css */
  --font-body: Instrument Sans;  --font-display: Bricolage Grotesque (wordmark only);  --font-mono: system mono (code, IDs, timestamps only);
  --text-2xs 12px · --text-xs 13 · --text-sm 14 (app body) · --text-md 16 · --text-lg 19.2 · --text-xl 23 (screen title) · --text-2xl 27.6 (figures)
  --radius-panel: 12px;  --radius-control: 8px;  --radius-chip: 6px;  --control-h: 36px;  --control-h-sm: 30px;
  --color-danger, --color-warn, --color-success (+ -wash), --color-hover, --color-selected;
}
```
Tailwind names: `bg-paper`, `bg-paper-2`, `bg-paper-3`, `text-ink`, `text-ink-2`, `border-rule`, `text-signal`, `bg-signal`, `text-signal-ink`, `bg-signal-wash`, `text-danger`, `text-success`, `text-warn`, `bg-hover`, `bg-selected`, `rounded-panel`, `rounded-control`, `rounded-chip`, `font-body`, `font-display`, `font-mono`. Spacing uses Tailwind's 4px steps.

## Kit (closedesk.css)
Shell `cd-shell`, `cd-side`, `cd-nav-item` (`aria-current="page"`), `cd-top`, `cd-main`. Page `cd-page`, `cd-page__head`, `cd-h1`, `cd-h2`, `cd-h3`, `cd-sub`, `cd-meta`, `cd-num`, `cd-grid` with `cd-span-*`. Surfaces `cd-panel` (`__head`, `__body`, `__foot`), `cd-well`, `cd-divider`. Figures `cd-stats` (`--cols`) with `cd-stat`, `__label`, `__value`, `__note`; `cd-dl`; `cd-bar`. Tables `cd-table-wrap`, `cd-table`. Controls `cd-btn` (primary), `--quiet`, `--ghost`, `--danger`, `--sm`, `--block`; `cd-icon-btn`; `cd-link`; `cd-seg` and `cd-tabs` (state on `aria-pressed`, `aria-selected` or `data-active`). Fields `cd-field`, `cd-label`, `cd-input`, `cd-select`, `cd-textarea`, `cd-help` (`--error`), `cd-check`, `cd-switch`. Status `cd-badge` (`--signal`, `--success`, `--danger`, `--warn`), `cd-alert`, `cd-empty`, `cd-skel`, `cd-spinner keep-motion`. Overlays `cd-overlay`, `cd-dialog`, `cd-popover`, `cd-toast`. Login `cd-auth`.

## Rules
- Surface ladder: page paper, then a `cd-panel` (one 1px rule, no shadow), then a `cd-well` or hairlines inside it. Never a panel inside a panel, never a border and a shadow together, no glows, blurs, glass or gradients.
- Figures sit in a `cd-stats` row parted by hairlines, never a wall of cards. Tables have rules only, sentence-case heads, tabular numerals.
- Labels, table heads, badges and nav are sentence case, never uppercase, never tracked. Mono only for codes, IDs and timestamps.
- One filled primary button per screen or dialog. Delete and destructive actions use `cd-btn--danger`.
- Icons are inline SVG with `aria-hidden="true"` (or lucide-react); never emoji. No decorative status dots or pinging dots.
- Motion is state only: `transition-colors`, `transition-opacity` or `transition-transform`, never `transition-all`; no hover lifts or scales on cards; every keyframe has a reduced-motion fallback (`motion-safe:` / `motion-reduce:`).
- Every region that loads data keeps the loading, empty and error states it already has logic for.

## Controls
- Primary: accent fill · 8px radius · 36px (30px small)
- Secondary: paper-3 with a rule border, same radius and height

## Motion
- Character: brisk, state only; under reduced motion everything ends at once.

## Variants
### Public website (`.www`, `src/styles/www.css`)
Same tokens, accent and posture as the operator app; the website differs only in scale and chrome.
- Faces: `--font-display` Bricolage Grotesque 700 for h1 to h3; `--font-body` Instrument Sans 400 and 600. Three weights in running use, no more.
- Type roles: `.ax-h1` (`--text-display`), `.ax-h1--s` (`--text-display-s`), `.ax-h2` (`--text-section`, about 52px at 1440), `.ax-h3` (`--text-title`), `.ax-lead`, `.ax-body`, `.ax-meta`. Tailwind: `text-display`, `text-display-s`, `text-section`, `text-title`, `text-lead`.
- Canvas: `.ax-container` (1440 cap, 64px gutter, 24 under 60rem, 16 under 40rem); sections `.ax-section` (`--section-gap-s` block padding) and `.ax-band` (a change of paper, `--color-paper-3` with hairlines). Tailwind spacing `py-section-s`, `py-section`, `py-section-l`, `px-gutter`.
- Compositions: `.ax-split` (5/7), `--even`, `--wide` (4/8); `.ax-rows` (hairline rows, title on 5 columns, text on 7); `.ax-stats` (owner's figures only); `.ax-dl`; `.ax-shot` (a picture frame, 12px radius, inset outline); `.ax-prose` (posts and legal, 68ch, 1.7 leading); `.ax-panel` and `.ax-well` (one level, never nested).
- Controls: `.ax-btn` (accent fill, pill, 48px), `.ax-btn--quiet` (rule outline), `--sm` (40px, nav only), `.ax-link`, `.ax-icon-btn`, `.ax-chip`; fields `.ax-field`, `.ax-label`, `.ax-input`, `.ax-select`, `.ax-textarea`, `.ax-help` (`--error`). One filled primary per screen.
- Chrome: `Navbar.jsx` (a sticky three-part bar, services disclosure, theme switch, Contact) and `footer.jsx` (a statement footer). Every page renders `<main id="main">` for the skip link.
- Hero: Index on the home page (the shipped-work index from the CMS portfolio); Banner on inner pages (head, one line, the page's action, the first section in view by 640px).
- Motion: one reveal, `data-reveal` (fade and 8px rise, staggered by `--i`), visible without script and under reduced motion; no hover lifts or scales; no glows, orbs, gradient text, badge pills or tracked-caps labels.
- Page-specific CSS: `src/styles/www/<group>.css` (home, about, services, portfolio, blogs, resources), imported by `globals.css` after `www.css`.

## Exports
`tokens.css` and `closedesk.css` in this project; Tailwind names in `tailwind.config.js`.
