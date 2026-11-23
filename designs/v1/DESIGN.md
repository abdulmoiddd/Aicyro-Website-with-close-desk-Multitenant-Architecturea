# Design: CloseDesk (Final Aicyro Pro)

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
### Public website (`.www`, `src/styles/www.css`): Aurora (2026-11-19)
The public site was redesigned as "Aurora", a modern AI-studio look. It shares the colour themes with the operator app (every colour comes from the `globals.css` theme variables) but not its posture: the website is expressive (brand gradient on primary buttons and the CTA band, aurora glow and grid behind heroes, elevated cards with hover lift). Pulse, super admin and the login screens are untouched and do not read `www.css`.
- Face: Plus Jakarta Sans (`--font-aurora`, loaded in `_app.jsx`) for display and body; headings 700, h1/h2 800 with tight tracking; body 400/500/600.
- Colour: only theme variables or the `--color-*` roles. Blends defined in `.www`: `--brand-gradient` (primary, secondary, accent-blue), `--brand-gradient-soft` (tinted card), `--aurora-1..3`, `--glass-bg`, `--card-border`, `--card-border-hover`, `--shadow-sm|md|lg|glow`. Never hex, rgb or Tailwind palette colours (`bg-white`, `text-gray-*`, `text-purple-*`...).
- Type roles: `.ax-h1`, `.ax-h1--s`, `.ax-h2`, `.ax-h3`, `.ax-lead`, `.ax-body`, `.ax-meta`, `.ax-num`; `.ax-gradient-text` (a brand-blend phrase inside a head, at most one per head); `.ax-eyebrow` (a soft pill label above a head, sentence case, with a 16px lucide icon; `.ax-eyebrow__dot` for a filled icon dot).
- Canvas: `.ax-container` (`--narrow` 1040px), `.ax-section` (`--l`), `.ax-band` (tinted full-bleed section), `.ax-head` (`--split`, `--center`), `.ax-split` (`--even`, `--wide`), `.ax-grid`, `.ax-bento` (12 columns; children `ax-span-3..8|12`, `ax-row-2`; collapses to 2 then 1 column).
- Surfaces: `.ax-card` (the workhorse: 20px radius, card border, small shadow; `--hover` or a link inside with `.ax-card__link` lifts it; `--tint` brand-soft fill; `--flush` + `.ax-card__body` for image cards; `.ax-card__foot`), `.ax-panel` (elevated), `.ax-well` (tinted inset), `.ax-glass`, `.ax-rows` (each row a card: title beside text), `.ax-stats` (figures in one card, gradient numbers, owner's figures only), `.ax-dl`, `.ax-checks` (check-mark list), `.ax-shot` (picture frame), `.ax-prose` (posts and legal), `.ax-icon-tile` (`--solid`), `.ax-chip` (`--accent`).
- Heroes: home `.ax-hero` is full screen (100svh under the glass nav): copy on the left, the studio console on the right as a self-playing service tour (5s steps, pause button, stops on pick, holds on hover/focus, still under reduced motion), two floating glass badges, and the client logo strip on the bottom edge; inner pages `.ax-banner` on a section with `.ax-aurora`: centred eyebrow, h1, one lead, actions in `.ax-banner__actions`.
- Closers: `.ax-cta` (brand-gradient card; buttons `ax-btn--light` and `ax-btn--outline-light`; `.ax-cta__actions`).
- Controls: `.ax-btn` (gradient pill, 48px; `--quiet` white card button, `--ghost`, `--light`, `--outline-light`, `--sm` 40px, `--lg` 56px, `--block`), `.ax-link` (with a trailing `ArrowRight` icon element when it leads on), `.ax-icon-btn`, `.ax-tabs` + `.ax-tab` (state on `aria-selected` / `aria-pressed` / `data-active`). Fields `.ax-field`, `.ax-label`, `.ax-input`, `.ax-select`, `.ax-textarea` (50px, focus ring), `.ax-help` (`--error`).
- Strips: `.ax-marquee` > `.ax-marquee__track` (two copies, the second `aria-hidden`; static under reduced motion).
- Motion: `data-reveal` (fade and 16px rise, stagger with `style={{"--i": n}}`), visible without script and under reduced motion; card lift and button sheen on hover; `transition-colors|opacity|transform` only, never `transition-all`; every keyframe has a reduced-motion fallback.
- Rules kept from before: one `<main id="main">` per page; icons are lucide-react (or inline SVG) with `aria-hidden="true"`, never emoji; every `<button>` has a `type`; inputs labelled; images have width, height, alt and `loading="lazy"` below the fold; nothing under 12px; no `min-h-screen`; keep every word, link, handler, data read and SEO tag.
- Page CSS: `src/styles/www/<group>.css` (home `hm-`, about, services, portfolio, blogs, resources `rs-`, utility for thank-you, 404, legal and overlays).

## Exports
`tokens.css` and `closedesk.css` in this project; Tailwind names in `tailwind.config.js`.
