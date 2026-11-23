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
### Public website: "Walk-in" (redesign 2026-11-23, by the owner's request; supersedes the next section for public pages)
The public site is a building you walk into. It keeps the theme variables (every light, dark and tenant hue repaints it) but is no longer restrained: depth, glass, light pools, gradient ink and scroll choreography are the point.
- Scope: `.www` (public routes). Pulse (`/lg`, closedesk.css) and the super admin portal (`/mes`, `/messages`) are excluded; the admin routes render under `.www-legacy` with the frozen pre-redesign kit `src/styles/www-legacy.css` (a one-time snapshot of the old www.css and resources.css made by `scripts/scope-www-legacy.js`; edit it by hand if the admin pages ever need a change) plus `www-legacy-shim.css` for the shared footer.
- Faces: Space Grotesk 500/700 (`--font-walk-display`), DM Sans 400/500/700 (`--font-walk-body`), loaded in `_app.jsx`. Mono only for room labels (`.ax-eyebrow`) and code.
- Materials (www.css tokens on `.www`): `--wk-glass`, `--wk-glass-strong`, `--wk-room`, `--wk-edge`, `--wk-glow`, `--wk-grad`, shadows `--wk-shadow-1..3`. Radii: panels 24, rooms 24 to 40, controls pill.
- Ambient: a fixed backdrop (`.www::before/::after`) of two light pools and a faint floor grid behind every page.
- Rooms: `.ax-band` is an inset rounded room with its own perspective floor; inner-page banners (`about/svc/pf/blog-banner`) open on a receding grid floor with the title rising out of depth.
- Motion: Lenis smooth scroll + a top progress hairline (`components/walkin/WalkInScroll.jsx`); `main` walks in on every route; `data-reveal` items step out of depth (rotateX + translateZ); sections rise in with scroll-driven `animation-timeline: view()` where supported. Everything has a reduced-motion still state.
- Home page: "HQ tour" (fifth pass, 2026-11-23, by request: a software-house tour, smooth animation, no blur). A guided tour of the Aicyro office floor by floor, colours from the globals.css theme variables only. 01 entrance (layered parallax walk-in: the street outside the HQ building, windows switching on floor by floor; scrolling turns the building to face you, walks up the path and through the sliding glass doors into the light, `Hero.jsx`; the building has no will-change so it re-renders sharp at every zoom); building directory of technologies (`hq/TechDirectory.jsx`); 02 product floor (3D card zoom as a coverflow of team pods, `hq/ProductFloor.jsx`); 03 war room (line-by-line: lines written on glass, pains moved across a kanban, `hq/WarRoom.jsx`); 04 delivery line (sideways: a corridor of stage rooms past a "you are here" marker, `hq/DeliveryLine.jsx`); 05 showroom monitors (`CaseSection.jsx`); 06 help desk tickets (`EstimatorTeaser.jsx`); 07 culture wall frames (`WhyChooseSection.jsx`); 08 client lounge screen (`Testimonial.jsx`); 09 lift doors that slide open on the audit offer (`LeadMagnet.jsx`); lift panel page map (`hq/ElevatorPanel.jsx`). Styles `www/hq.css` (prefix `hq-`).
- Day and night: the hero tower's facade (`--hq-dark`, with `--hq-win-*`, `--hq-glass`, `--hq-lamp`, `--hq-orb`, `--hq-stars` in hq.css) is the material for the whole home page. Light themes render it as daytime (pale facade, sky-blue glass, sun); dark themes as night (dark facade, lit windows, moon and stars). Every floor reuses it: floor signs are the entrance canopy (`.hq-floor-label`), `hq/FloorSlab.jsx` strips of facade sit between floors with windows that switch on as you pass, `hq/CityView.jsx` shows the same city through office glass on the product floor and the lift lobby, and cards carry facade plates.
- Motion rules for the home page (fixing blur and jank): every scroll scene smooths with the one spring in `hq/motion.js`; moving parts animate transform and opacity only (no filters, backdrop blur, background-position or layout properties); a card that is read at the front must rest with no transform and no `will-change` (the product-floor pods hold at `transform: none`), never be drawn small and scaled up; home `[data-reveal]` uses a flat slide, not a 3D tilt. Lenis runs at `lerp 0.085`.
- Inner-page materials: `www/walkin-pages.css` (services, portfolio, blogs, about/contact, resources).

### Public website, pre-redesign (`.www-legacy` only now)
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
