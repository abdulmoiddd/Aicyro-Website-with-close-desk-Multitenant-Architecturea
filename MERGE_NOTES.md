# Final Aicyro website: merge notes

`Final Aicyro website` = **public website UI from `Aicyro website latest`** + **Closedesk engine from `New Final`** (Aicyro Pulse dashboard at `/lg`, super admin, multi-tenant chatbot widget, `/embed/chatbot`, `widget.js`, APIs, libs, security hardening).

The earlier merge that produced `New Final` is documented in `docs/MERGE_NOTES_closedesk_engine.md`.

## What came from where

| Area | Source | Notes |
| --- | --- | --- |
| Project base (configs, `functions/`, `scripts/`, `docs/`, `database.rules.json`, `public/widget.js`) | New Final | Copied whole, without `node_modules` and `.next` |
| `src/Closedesk/` (Pulse dashboard, super admin, chatbot widget, ThemeProvider, GlobalActivityTracker) | New Final | Unchanged |
| `src/lib/` | New Final | Plus `firebase12.js` from latest (the website's content database) |
| `src/pages/api/` | New Final | Plus latest-only routes the website needs: `schedule`, `send-ai-assessment`, `send-blueprint`, `send-estimate` |
| `src/pages/lg.jsx`, `logs.jsx`, `embed/`, `e2e-report.jsx` | New Final | Unchanged |
| Every other page (home, about, services, portfolio, blogs, resources, contact, thank-you, terms, privacy, cookie, 404, free-website-audit, sitemap, MeetingScheduler, mes, messages) | Aicyro website latest | Unchanged |
| `src/components/` | Aicyro website latest, without `Dashboard/` | Two files merged, three removed (see below) |
| `src/assets/`, `src/database.json`, missing `public/` files | Aicyro website latest | |
| `src/styles/` | New Final | Rewired so engine styles cannot leak onto the website (see below) |
| `_app.jsx`, `_document.jsx`, `layout.jsx` | Hand-merged | |

New Final's own marketing pages and components (`components/Essential`, the night-shift `components/Home/*`, `components/Form/PopupModel`, `termofuse.jsx`) were dropped. They are still in `New Final` if needed.

## Hand-merged files

- **`pages/_app.jsx`**
  - Public pages get latest's shell: Poppins, splash logo animation, default SEO head, `GoogleOAuthProvider` (for the meeting scheduler) and visit tracking.
  - Internal routes (`/lg`, `/logs`, `/embed`, `/e2e-report`, from `lib/routeScopes.js`) get New Final's shell unchanged.
  - Both use the Closedesk `ThemeProvider` and `GlobalActivityTracker`, which were byte-identical to latest's copies.
  - The Closedesk fonts (Bricolage Grotesque, Instrument Sans) load on every page, because the chatbot widget also needs them on public pages.
- **`pages/layout.jsx`**
  - Public pages: latest's overlays (cookie banner, sticky estimate button) plus New Final's multi-tenant `AicyroChatbot` for the `default` tenant.
  - Internal routes: children only.
- **`pages/_document.jsx`**: New Final's version. Its pre-paint script also adds `cd-root` to `<html>` on internal routes.
- **`components/Essntials/CookieConsentBanner.jsx`**: latest's markup with New Final's tracking logic:
  - dual IP providers;
  - GPS with a network fallback;
  - ingest through `/api/cookie-consent` with tenant partitioning and same-device merge;
  - no location prompt after "reject".

  This logic is what feeds the Pulse cookie map.
- **`components/Form/Popupform.jsx`**: latest's markup with New Final's submit logic (`lib/foundingApplicationClient` → `/api/founding-application`). New Final's database rules block direct client writes to `founding_applications`, so latest's original version would fail.

Removed from latest's components (superseded by `src/Closedesk/`): `Chatbot/AicyroChatbot.jsx`, `ThemeProvider.jsx`, `GlobalActivityTracker.jsx`.

## Styles: keeping the two UIs apart

New Final's `base.css` and `site.css` set global element styles. Unscoped, they would restyle every page of latest's website, for example:

- `h1 { max-width: 20ch }`;
- `p { margin: 0 }`;
- `.container`, `.btn` and `[data-reveal]` (hidden until revealed).

The dashboard still needs them for `.btn`, `.icon-btn`, `.seg` and its base typography. So:

- `globals.css` imports `base.scoped.css` and `site.scoped.css`. These are generated copies with every selector prefixed by `:where(html.cd-root)`.
  - `:where()` adds zero specificity, so the dashboard cascades exactly as before.
  - `html.cd-root` is only set on internal routes.
- **After editing `base.css` or `site.css`, run `npm run css:scope`** (`scripts/scope-closedesk-css.js`).
- `closedesk.css` and `closedesk-widget.css` were already scoped to `.cd-app` and `.cdw`, so they load unchanged.
- New Final's global tweaks now apply on internal routes only. These are smooth scroll, `overflow-x: clip`, slim scrollbars and `button { white-space: nowrap }`. Public pages keep latest's behaviour.
- `tailwind.config.js`: New Final's version. `font-mono` falls back to Tailwind's monospace stack, because `--font-mono` only exists inside the dashboard and latest uses `font-mono` about 50 times.

## Config

- **`package.json`**: New Final's versions and scripts, plus latest's extra dependencies:
  - `googleapis`, `nodemailer`, `@react-oauth/google`, `@react-pdf/renderer`, `react-pageflip`, `react-hot-toast`, `tailwind-merge`, `formidable`, `node-fetch`, `@aws-sdk/client-transcribe`;
  - `@netlify/plugin-nextjs`.

  The lockfile is New Final's, updated by `npm install`.
- **`next.config.js`**: New Final's CORS for `/api` and `/widget.js`, plus latest's image domains, redirects and security headers.
  - The security headers skip `/embed`, `/api` and `/widget.js`, so tenant sites can still iframe the chatbot.
  - The old `/terms → /termofuse` redirect is reversed, because latest's `/terms` page is the live one.
- **`netlify.toml`**: New Final's headers, Node 22, and the Next.js plugin.
- **`.env.local`**: New Final's values, which point Firebase at the dashboard project. The keys only latest had are appended (Google and Microsoft OAuth, lead webhook).
  - Website content (hero, portfolio, services, testimonials, inquiries) still comes from the separate `aicyroweb` project through `lib/firebase12.js`.
  - Neither source project defined `EMAIL_USER`, `EMAIL_PASS`, `REDIRECT_URI` or `NEXT_PUBLIC_GOOGLE_CLIENT_ID`. They are listed in `example.env`.

## Verified

- `next build` compiles all routes.
- In the dev server (`npm run dev`, webpack):
  - `/` renders latest's UI with no engine styles applied, and shows the Closedesk chatbot launcher and the sticky estimate button.
  - `/lg` renders the Aicyro Pulse login with `cd-root` scoping and no public chatbot or cookie banner.
  - `/embed/chatbot` renders the widget.
  - The server logged no errors.
- Not verified: signed-in dashboard flows, the super admin console, and live chat or voice. These need real credentials.
- `/grid-pattern.svg` returns 404. It was already missing in `Aicyro website latest`.

## Hallmark redesign of the public website (2026-11-18)

The public pages were redesigned at full depth with the Hallmark skill, on the locked CloseDesk system in `DESIGN.md`, so the website and the Pulse dashboard read as one product. A copy of the project from before the redesign is in `Final Aicyro website (pre-redesign snapshot)/`.

What changed:
- **System:** `src/styles/www.css` holds the stamp and the public kit (`ax-` classes). It is scoped under `.www`, a wrapper `_app.jsx` sets on public routes. Each page group has its own file in `src/styles/www/` (home, about, services, portfolio, blogs, resources).
  - Tailwind gained the type roles (`text-display`, `text-section` and others) and the rhythm spacing (`py-section-s` and others).
  - `DESIGN.md` § Variants documents all of this.
- **Chrome:** `Navbar.jsx` is a sticky three-part bar with a services disclosure and the theme switch. `footer.jsx` is a statement footer. Every public page has one `<main id="main">`, which the skip link targets.
- **Home:** the hero shows the owner's CMS headline beside a live index of real case studies. Eight sections follow and the page ends on contact. The home page now renders its content without JavaScript, while the splash still plays on a first visit.
- **Shared templates:**
  - `src/components/services/ServiceTemplate.jsx` serves the 8 service pages.
  - `src/components/portfolio/CaseStudy.jsx` serves the 15 case studies.
  - `src/components/blogs/article.jsx` serves 12 of the blog posts.
- **Kept:** every link, form field, handler, Firebase read and write, `/api/*` call, SEO tag, the splash, the cookie banner logic and the light/dark switch. The `/lg`, `/logs`, `/embed` and `/e2e-report` routes and the chatbot widget are untouched.
- **Copy:** lines were changed only where a Hallmark copy gate named them: eyebrows, tracked caps, em and en dashes, buzzwords, glued arrows and straight quotes.
  - The blog dash and buzzword changes are listed line by line in `.hallmark/copy-changes-blogs.txt`.
  - The other groups' changes are listed in the handoff.

Tools:
- `scripts/shoot-returning-visitor.mjs` takes screenshots with the splash and the cookie choice already dismissed. Example: `MSYS_NO_PATHCONV=1 node scripts/shoot-returning-visitor.mjs http://localhost:3300 .hallmark/shots/www final / /about`.
- `.hallmark/compare.html` shows the before and after screenshots side by side.
