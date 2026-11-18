# Hallmark redesign brief: the public Aicyro website (page groups)

You are redesigning one group of pages of the public Aicyro website at **full depth** with the Hallmark skill. The system, the chrome and the home hero are already built. Your job is your group's pages and components, nothing else.

Project root: `D:\Software House 01\Claude workspace for Aicyrowork website\Final Aicyro website` (Next.js 16 pages router, Tailwind 3, JS/JSX). A dev server is already running at `http://localhost:3300` (webpack, hot reload). Do not start, stop or restart it. Do not run `next build` (it shares `.next` with the dev server); the lead runs the build at the end.

## Read first (in this order)
1. `DESIGN.md` at the project root: the locked system. Read § Variants › Public website closely: it lists every kit class.
2. `src/styles/www.css`: the kit itself (`ax-` classes) and the stamp at the top. Read it whole; build with these classes.
3. Hallmark references, only these: `C:\Users\moids\.claude\skills\hallmark\references\redesign.md` (§ What a redesign keeps), `layout.md`, `craft.md`, `gates.md` § 4 (the gate table), `patterns.md`. Do not read `review-*.md`.
4. As examples of the finished style: `src/components/Home/Hero.jsx`, `src/components/Essntials/Navbar.jsx`, `src/components/Essntials/footer.jsx`.

## The direction (decided; do not re-pick)
- Genre modern-minimal. Theme: brand, locked (CloseDesk violet `--primary`, Bricolage Grotesque display 700, Instrument Sans body 400/600). Posture restrained: the accent is the primary button, the current nav item, focus, links on hover. Light and dark themes both work through the tokens; never hard-code a colour.
- The site's job is **hire** (a software studio): the work is the proof; contact is the action. Lead each page with its strongest real content.
- Inner pages: a **Banner** hero (the page's `h1` at `ax-h1` or `ax-h1--s`, one `ax-lead` line, the page's one action if it has one), the first section starting within 640px of the top at 1440x900.
- Chrome is done: every page already renders `<Navbar />` and `<Footer />`; keep those imports and calls. Wrap the page body in `<main id="main">` (exactly one `main` per page; the skip link targets it). Remove any extra top padding that existed only to clear the old absolutely positioned navbar (the new nav is sticky and in flow, 72px).

## What you keep (a redesign, not a rewrite of the business)
- **Every word** the page states, unless a copy gate names it (19, 54, 58, 63, 67, 69). When you cut or reword a line for a gate, record it (see Report). Never invent a fact, figure, quote, client, logo, date or price. Terms, disclaimers and consent text are never reworded.
- **The wiring**: every `href`, route, form, field `name`/`id`/`type`, `onClick`/`onSubmit` handler, `useState`/`useEffect` logic, Firebase read/write (`firebase12` `database`, `lib/firebase` `db`), `fetch` to `/api/*`, router push, `<Head>`/SEO tags and JSON-LD, analytics. Edit markup inside the component that owns it. Never rename a prop, move logic, or change what is written to the database or posted to an API.
- **Content loaded from the CMS** (Firebase `aicyroweb`: hero, services subpages, portfolio, testimonials, contact section, lead magnets): keep loading it exactly as now; redesign how it is shown. Keep existing loading, empty and error states (restyle them).
- **Files**: do not delete or rename any file; do not touch files outside your group. Unused components (for example `components/Home/extra/*`, `components/ThemeToggle.jsx`, `components/components.jsx`) stay as they are.

## What changes (full depth)
The composition and the system: each section becomes one idea shown at its best (`layout.md` § 4 and § 5: Split, Showcase, Grid, Rows, Table, Figures only for given numbers, Steps for a real process, Statement, Band, Form, Index, Switcher). Three to six different compositions per page, never the same one twice in a row; six to nine sections on a long page (merge or fold where the old page had more, without dropping content). Section heads at `ax-h2` (about 52px at 1440), item titles `ax-h3`, one `ax-lead` line under a head at most.

Remove on sight (each is a gate): blurred orbs and glows (`blur-3xl` blobs, glow shadows), gradient text and purple-to-blue gradients, animated background grids, badge pills and eyebrows above headings (an `uppercase tracking-*` label, `TRUSTED BY…`, `What we deliver`), uppercase or tracked small labels anywhere, emoji used as icons (use `lucide-react`, 16/20/24px, `aria-hidden="true"`), icons in coloured tiles above headings, `transition-all`, hover scale or lift on cards and images, `animate-bounce`, overshoot easing, `min-h-screen` (use `min-h-dvh` only if truly needed), `font-mono` on labels, text under 12px, colour literals (`#hex`, `rgb()`, `bg-white`, `text-gray-*`, `text-white`, any Tailwind palette colour), a card inside a card, a border and a wide shadow together, middle-dot meta strings, arrows glued to link text (`Read more →`), "All rights reserved", straight quotes and `...` in prose (use ’ “ ” …), em or en dashes in copy you write.

Use: the `ax-` kit classes, and Tailwind only with token names: `bg-paper`, `bg-paper-2`, `bg-paper-3`, `text-ink`, `text-ink-2`, `border-rule`, `text-signal`, `bg-signal`, `text-signal-ink`, `bg-signal-wash`, `text-danger`, `text-success`, `font-display`, `font-body`, `text-display`, `text-display-s`, `text-section`, `text-title`, `text-lead`, `py-section-s`, `py-section`, `px-gutter`, `max-w-container`, `rounded-frame`, `rounded-panel`, plus Tailwind's spacing scale and layout utilities. Motion: `transition-colors`, `transition-opacity` or `transition-transform` with `motion-reduce:` fallbacks; at most the one reveal (`data-reveal`, with `style={{"--i": n}}` for stagger), and content visible without it. framer-motion entrance animations: remove them or make them start visible (no content hidden at rest).

Pictures: show the real thing at size. Case-study images (`imageUrl`/`imageSrc` from the CMS) and service images the code already uses are the owner's pictures; frame them in `figure.ax-shot` (aspect-ratio set, `object-fit: cover`), never hover-zoomed. No stock photos, no drawn SVG illustrations, no fake browser/phone frames, no empty frames, no invented logos. A non-hero image is `loading="lazy"`; every `<img>` has `width`, `height` and `alt`.

Forms: keep every field and handler; restyle with `ax-field`, `ax-label`, `ax-input`/`ax-select`/`ax-textarea`, `ax-help`; inputs 48px; every field labelled; `type` on every button; one filled primary per screen. Never print a success message unless a request really succeeded (the existing handlers decide this; do not add fake success).

Page-specific CSS: only in your group's file `src/styles/www/<group>.css` (already created and imported). Keep the first line of that file as it is. Use tokens only (`var(--color-*)`, `var(--space-*)`, `var(--text-*)`, `var(--radius-*)`), never literals. Prefer kit classes and Tailwind token utilities; add CSS only for what they cannot do.

## Do not touch (owned by the lead)
`src/styles/www.css`, `src/styles/globals.css`, `src/styles/tokens.css`, `tailwind.config.js`, `src/pages/_app.jsx`, `src/pages/_document.jsx`, `src/pages/layout.jsx`, `src/components/Essntials/Navbar.jsx`, `src/components/Essntials/footer.jsx`, `src/components/Home/Hero.jsx`, anything in `src/Closedesk/`, `src/lib/`, `src/pages/api/`, `src/pages/lg.jsx`, `logs.jsx`, `embed/`, `e2e-report.jsx`, `DESIGN.md`, and other groups' files. If you need a kit class that does not exist, write the rule in your group CSS file under a group-prefixed name and mention it in your report.

## Check your work (required)
1. Static and render lint on your files and routes (Git Bash: prefix with `MSYS_NO_PATHCONV=1` so route paths are not mangled):
   `cd "D:\Software House 01\Claude workspace for Aicyrowork website\Final Aicyro website"`
   `MSYS_NO_PATHCONV=1 node "C:/Users/moids/.claude/skills/hallmark/scripts/sloplint.mjs" <your files and folders> src/styles/www.css src/styles/www/<group>.css --genre modern-minimal --url http://localhost:3300/<route> [--url ...]`
   Fix every `FAIL` in your files and every `REFLEX` you can; for a Reflex you keep, note the reason in your report. Ignore findings in files you do not own, and these known site-wide ones: the render screenshots show the first-visit splash logo and cookie banner (kept by the owner), the "Ask Aicyro" chatbot launcher, the "Project Cost Calculator" sticky pill.
2. Look at the pages as a returning visitor (splash and banner already dismissed):
   `MSYS_NO_PATHCONV=1 node scripts/shoot-returning-visitor.mjs http://localhost:3300 .hallmark/shots/www <group> /<route> [/<route> ...]`
   It writes a 1440 full-page shot and a 375 first screen per route into `.hallmark/shots/www/`. Open them and fix what you see: overlaps, horizontal scroll at 375, wrapped buttons, empty frames, tiny heads, sections with no mass, dead space. On groups with many similar pages, shoot the index page and at least three detail pages, all of them if time allows.
3. Make sure nothing throws: after edits, load each route once (`curl -s -o NUL -w "%{http_code}" http://localhost:3300/<route>` should print 200) and fix compile errors.

## Report (your final message; it is all the lead sees)
Plain text, short:
- Files changed (paths).
- Routes checked, and the final sloplint summary line for them (`N FAIL, N REFLEX, N WARN`), with any remaining REFLEX/WARN and why.
- Copy changes: every line you cut or reworded, before → after, and the gate that named it. Content you moved or merged.
- Anything dropped (should be none) and anything you could not keep working, with the reason.
- Any kit gaps you filled in your group CSS.
- Anything the owner must supply or check (an image that does not load, a figure to verify).
