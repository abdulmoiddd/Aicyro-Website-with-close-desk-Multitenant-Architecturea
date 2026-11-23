# Aicyro Designer

One repository and one Netlify site for every design of the Aicyro website.

```
designs/v1/   ->  https://<your-site>.netlify.app/v1/
designs/v2/   ->  https://<your-site>.netlify.app/v2/
designs/v3/   ->  https://<your-site>.netlify.app/v3/
                  https://<your-site>.netlify.app/     (gallery of all designs)
```

## Add a new design

1. Copy your whole website folder into `designs/` and name it after the URL you want, for example `designs/v3`.
   Use lowercase letters, numbers and dashes only (`v3`, `v3-dark`, `aurora`).
   You do not need to copy `node_modules`, `.next` or any `.env` file.
2. Optional: add `designs/v3/designer.json` so the gallery shows a title:
   ```json
   {
     "title": "Midnight",
     "description": "Dark theme with a large video hero.",
     "author": "Sara",
     "cover": "assets/cover.png"
   }
   ```
   `cover` is an image path inside that design's `public/` folder.
3. Commit and push. Netlify builds the new design and it is live at `/v3/`.

Designs that did not change are not rebuilt, so adding one more design only costs that one build.
To remove a design, delete its folder and push.

You never need to edit `next.config.js` or change links in your design. The builder sets the
`/v3` base path for you.

## Environment variables (shared by all designs)

Set them once in Netlify: **Site configuration > Environment variables**. Every design is built with the
same values. The list is in [.env.example](.env.example).

- `NEXT_PUBLIC_*` values (Firebase, Google Maps, app URL) are built into each design.
- `DESIGNER_API_ORIGIN` is the live website that runs the API routes, for example `https://aicyro.com`.
  Every `/api/...` call from any design (contact form, chat, estimates, logins) is forwarded there, so
  server secrets such as `OPENAI_API_KEY` stay on the live site and are not needed here.
  If it is not set, `NEXT_PUBLIC_APP_URL` is used.

For local builds, copy `.env.example` to `.env` and fill it in.

## Netlify setup (one time)

1. Push this `Designer` folder to a Git repository.
2. In Netlify: **Add new site > Import an existing project**, pick the repository.
   If `Designer` is a subfolder of the repository, set **Base directory** to `Designer`.
   Build command and publish directory come from `netlify.toml`.
3. Add the environment variables above.
4. If Google sign-in or Firebase auth is used in a design, add the Netlify domain to the
   Firebase console's **Authorized domains** and the Google OAuth client's allowed origins.

## Run it locally

```bash
npm run setup      # once: installs the shared packages into builder/node_modules
npm run build      # builds every design into dist/
npm run preview    # serves dist/ at http://localhost:4400 with the same routing as Netlify
```

Rebuild one design only: `npm run build:only -- v3`.
Designers can still work inside their own folder as usual (`npm install`, `npm run dev`).

## How it works

- Each design is built as a static export with `basePath` set to its folder name. The design's own
  `next.config.js` is kept; only export settings are added on top.
- `src/pages/api` is left out of the static build; `/api/*` goes to `DESIGNER_API_ORIGIN`.
- Redirects from each design's `next.config.js` are copied into Netlify `_redirects` under that design.
- Links written as plain root paths (`window.location.href = "/contact"`, `"/assets/logo.png"`) still work:
  every design page remembers which design is open, and Netlify sends root paths back into that design.
- If a new upload fails to build, the previous successful build of that design stays online and the
  gallery marks it. The build log shows the error.
- The whole preview site is `noindex`, so it will not compete with the live site in Google.
- All designs share the packages in `builder/package.json`. If a design needs a package that is not
  there, the builder installs it for that design only. Add common packages to `builder/package.json`
  to keep builds fast.

## Limits of a preview

- The previews are static. Pages that need server code (`getServerSideProps`, API routes) only work
  through the live backend.
- Admin dashboards and logins depend on the live backend's cookies and may not work on the preview
  domain. The previews are meant for reviewing the public website design.
