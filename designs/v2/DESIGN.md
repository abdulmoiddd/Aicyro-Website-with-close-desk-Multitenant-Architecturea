# Design: CloseDesk (Final Aicyro Pro)

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System
- Genre: modern-minimal
- Public site (Aicyro website): redesign v3 "Aurora Studio" (see Variants), `src/styles/www.css`, scoped under `.www` (set on public routes in `_app.jsx`); kit classes are prefixed `ax-`. The old "night shift" `site.css` is engine-only now (scoped to `html.cd-root`)
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
### Public website (`.www`, `src/styles/www.css`), redesign v3 "Aurora Studio" (2026-11-19)
Replaces the earlier restrained Hallmark public variant. Built with ui-ux-pro-max (Motion-Driven + Bento, scroll storytelling) and 21st inspiration (floating glass pill nav, spotlight hero with grid, bento grids, CTA bands). The operator app rules above are unchanged and do not apply to `.www`.
- Colour: only the theme variables in `globals.css` (`--background`, `--foreground`, `--foreground-muted`, `--primary`, `--secondary`, `--accent-blue`, `--card-bg`, `--border-color`, `--grid-line`, `--spotlight-opacity`, `--footer-bg`, `--hero-*`, `--lead-*`, `--card-gradient-*`, `--on-primary`) and values derived from them in `.www` (`--www-grad`, `--www-grad-soft`, `--www-wash`, `--www-wash-2`, `--www-ring`, `--www-glass`, `--www-card`, `--www-shadow(-lg)`, `--www-glow(-lg)`, `--www-grid`). No literals, so light, dark and every tenant hue repaint the site.
- Faces: Space Grotesk (display, `--font-www-d`) and Plus Jakarta Sans (body, `--font-www-b`), loaded in `_app.jsx` for public routes only.
- Canvas: 1280 container; an aurora (`.www::before`) behind the nav and first section on every page; `ax-gridbg` faded grid; `ax-band` tinted sections.
- Type: `ax-h1`, `ax-h1--s`, `ax-h2`, `ax-h3`, `ax-lead`, `ax-body`, `ax-meta`; `ax-grad` paints one phrase of a heading with the brand gradient; `ax-eyebrow` glass pill label.
- Surfaces: `ax-card` (+ `ax-spot` pointer spotlight from `_app.jsx`, + `ax-card--link` lift), `ax-panel`, `ax-well`, `ax-icon-tile` (+ `--solid`), `ax-bento` (6 columns, `is-half`, `is-wide`, `is-full`, `is-tall`), `ax-rows` (stacked cards), `ax-stats` (gradient figures, owner's numbers only), `ax-shot`, `ax-prose`, `ax-chip`, `ax-marquee`.
- Heroes: home `ax-hero` is full screen (100dvh, slides under the floating nav): CMS copy left with service chips, a pointer-tilted 3D stage of the first three case-study pictures and the live case-study count right (orbit of service icons as the fallback), a cursor glow, and the scroll cue plus client-logo marquee on the bottom edge; on phones the stage is hidden so the hero stays one screen; inner pages `ax-pagehero` (crumbs, eyebrow, title, lead, actions). Closing call to action: `ax-cta`.
- Controls: `ax-btn` gradient pill with glow (one primary per view), `--quiet` glass, `--sm`, `--block`; `ax-link`; `ax-icon-btn`; fields `ax-field`, `ax-label`, `ax-input`, `ax-select`, `ax-textarea` (52px, focus ring), `ax-help`.
- Chrome: `Navbar.jsx` floating glass pill with a gliding hover pill (framer-motion), services mega panel with icons and a consultation card, theme switch, Contact; `footer.jsx` statement plus booking button, link columns, large faded wordmark, legal row.
- Motion: above the fold `ax-rise` (CSS only, runs before hydration); below the fold `data-reveal` (fade, 18px rise, unblur, staggered by `--i`); marquees; hover lifts on link cards; everything stops under reduced motion.
- Page CSS: `src/styles/www/<group>.css` (home `hm-`, about `ab-`, services `svc-`, portfolio `pf-`, blogs `blog-`, resources `rs-`, misc `ms-`).
- Out of scope (unchanged UI): `/lg` Pulse dashboard and its login, super admin, `/logs`, `/mes`, `/messages`, `/embed`, `/e2e-report`, the chatbot widget.

## Exports
`tokens.css` and `closedesk.css` in this project; Tailwind names in `tailwind.config.js`.
