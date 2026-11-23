#!/usr/bin/env node
/**
 * Aicyro Designer: builds every folder in ../designs/ into one static site.
 *
 *   designs/v1  ->  dist/v1   (served at  https://<site>/v1/)
 *   designs/v2  ->  dist/v2   (served at  https://<site>/v2/)
 *   ...
 *   dist/index.html            gallery that links to every design
 *
 * Each design is a full copy of the Next.js website. It is built as a static
 * export with basePath "/<folder name>", so designers never have to change
 * their next.config.js. All designs share ONE set of environment variables
 * (Netlify site env vars, or Designer/.env locally). API calls (/api/*) are
 * proxied to the shared backend set in DESIGNER_API_ORIGIN.
 *
 * Usage:
 *   node builder/build-designs.mjs              build everything (cached designs are reused)
 *   node builder/build-designs.mjs --only v3    rebuild only v3 (others come from cache)
 *   node builder/build-designs.mjs --no-cache   ignore the cache and rebuild all
 */
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const BUILDER_VERSION = "1"; // bump to invalidate every cached design build
const BUILDER_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(BUILDER_DIR, "..");
const DESIGNS_DIR = path.join(ROOT, "designs");
const DIST = path.join(ROOT, "dist");
const CACHE = path.join(ROOT, ".designer-cache");
const WORK = path.join(BUILDER_DIR, ".build");

// Never copied into a build and never part of the content hash.
const SKIP_DIRS = new Set(["node_modules", ".next", "out", ".git", ".netlify", ".hallmark", ".claude", ".vercel", ".turbo"]);
const isEnvFile = (name) => name === ".env" || name.startsWith(".env.");
// Folder names that would clash with site-level routes.
const RESERVED = new Set(["api", "_next", "404", "index", "designs"]);

const args = process.argv.slice(2);
const ONLY = (() => {
  const i = args.indexOf("--only");
  return i >= 0 ? new Set((args[i + 1] || "").split(",").filter(Boolean)) : null;
})();
const NO_CACHE = args.includes("--no-cache");

const log = (...m) => console.log("[designer]", ...m);
const warn = (...m) => console.warn("[designer] WARNING:", ...m);

// ---------------------------------------------------------------- env ---------

/** Loads Designer/.env and Designer/.env.local (local builds). Real env vars win. */
function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    const p = path.join(ROOT, file);
    if (!fs.existsSync(p)) continue;
    for (const raw of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const m = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      let val = m[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
      if (process.env[m[1]] === undefined) process.env[m[1]] = val;
    }
    log(`loaded env from ${file}`);
  }
}

function apiOrigin() {
  const candidates = [process.env.DESIGNER_API_ORIGIN, process.env.NEXT_PUBLIC_SITE_URL, process.env.NEXT_PUBLIC_APP_URL];
  for (const c of candidates) {
    if (!c) continue;
    try {
      const u = new URL(c.trim());
      if (u.protocol === "https:" && !/^(localhost|127\.|\[::1\])/.test(u.hostname)) return u.origin;
      if (c === process.env.DESIGNER_API_ORIGIN) return u.origin; // explicit wins even if http
    } catch {
      /* ignore bad URL */
    }
  }
  return null;
}

/** Only NEXT_PUBLIC_* values are baked into the static output, so only they affect the cache. */
function publicEnvFingerprint() {
  const keys = Object.keys(process.env).filter((k) => k.startsWith("NEXT_PUBLIC_")).sort();
  const h = crypto.createHash("sha256");
  for (const k of keys) h.update(`${k}=${process.env[k]}\n`);
  return h.digest("hex");
}

// ------------------------------------------------------------- files ---------

async function walk(dir, base = dir, out = []) {
  for (const ent of await fsp.readdir(dir, { withFileTypes: true })) {
    if (ent.isDirectory() && SKIP_DIRS.has(ent.name)) continue;
    if (isEnvFile(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) await walk(full, base, out);
    else if (ent.isFile()) out.push(path.relative(base, full).split(path.sep).join("/"));
  }
  return out;
}

async function hashDesign(dir) {
  const files = (await walk(dir)).sort();
  const h = crypto.createHash("sha256");
  h.update(`builder:${BUILDER_VERSION}\nenv:${publicEnvFingerprint()}\n`);
  for (const rel of files) {
    h.update(rel + "\0");
    h.update(await fsp.readFile(path.join(dir, rel)));
  }
  return h.digest("hex").slice(0, 16);
}

async function copyTree(src, dest, filter = () => true) {
  await fsp.cp(src, dest, {
    recursive: true,
    filter: (p) => {
      const name = path.basename(p);
      if (SKIP_DIRS.has(name) && fs.statSync(p).isDirectory()) return false;
      if (isEnvFile(name)) return false;
      return filter(p);
    },
  });
}

const rm = (p) => fsp.rm(p, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });

async function listFiles(dir, ext) {
  const out = [];
  for (const ent of await fsp.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...(await listFiles(full, ext)));
    else if (ent.name.endsWith(ext)) out.push(full);
  }
  return out;
}

// ----------------------------------------------------------- designs ---------

function naturalCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

async function discoverDesigns() {
  if (!fs.existsSync(DESIGNS_DIR)) return [];
  const found = [];
  for (const ent of await fsp.readdir(DESIGNS_DIR, { withFileTypes: true })) {
    if (!ent.isDirectory() || ent.name.startsWith(".") || ent.name.startsWith("_")) continue;
    const dir = path.join(DESIGNS_DIR, ent.name);
    if (!fs.existsSync(path.join(dir, "package.json"))) {
      warn(`designs/${ent.name} has no package.json, skipped`);
      continue;
    }
    const slug = ent.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
    if (!slug || RESERVED.has(slug)) {
      warn(`designs/${ent.name} uses a reserved or empty name, skipped (rename the folder, e.g. v7)`);
      continue;
    }
    if (slug !== ent.name) warn(`designs/${ent.name} will be served at /${slug}/ (folder names should be lowercase, no spaces)`);
    let meta = {};
    const metaFile = path.join(dir, "designer.json");
    if (fs.existsSync(metaFile)) {
      try {
        meta = JSON.parse(fs.readFileSync(metaFile, "utf8"));
      } catch (e) {
        warn(`designs/${ent.name}/designer.json is not valid JSON: ${e.message}`);
      }
    }
    found.push({ folder: ent.name, slug, dir, meta });
  }
  const seen = new Set();
  return found
    .sort((a, b) => naturalCompare(a.slug, b.slug))
    .filter((d) => {
      if (seen.has(d.slug)) {
        warn(`two folders map to /${d.slug}/, keeping the first`);
        return false;
      }
      seen.add(d.slug);
      return true;
    });
}

// ------------------------------------------------------- next config ---------

const CONFIG_NAMES = ["next.config.js", "next.config.cjs", "next.config.mjs", "next.config.ts", "next.config.mts"];

/** Imports a design's own next.config (js/cjs/mjs only) to read its redirects. */
async function loadOriginalConfig(configPath) {
  if (!configPath || /\.m?ts$/.test(configPath)) return null;
  try {
    const mod = await import(pathToFileURL(configPath).href + `?t=${Date.now()}`);
    let cfg = mod.default ?? mod;
    if (typeof cfg === "function") cfg = await cfg("phase-production-build", { defaultConfig: {} });
    return cfg;
  } catch (e) {
    warn(`could not evaluate ${path.basename(configPath)} for redirects: ${e.message}`);
    return null;
  }
}

/**
 * Replaces the design's next.config with a wrapper that keeps everything the
 * designer configured but forces a static export under /<slug>.
 */
async function writeWrapperConfig(workDir, slug) {
  const existing = CONFIG_NAMES.find((n) => fs.existsSync(path.join(workDir, n)));
  let importLine = "const original = {};";
  let wrapperName = "next.config.mjs";
  if (existing) {
    const ext = path.extname(existing);
    const renamed = `next.config.designer-original${ext}`;
    await fsp.rename(path.join(workDir, existing), path.join(workDir, renamed));
    if (ext === ".ts" || ext === ".mts") {
      wrapperName = "next.config.ts";
      importLine = `import * as mod from "./next.config.designer-original";\nconst original: any = (mod as any).default ?? mod;`;
    } else {
      importLine = `import * as mod from "./${renamed}";\nconst original = mod.default ?? mod;`;
    }
  }
  const body = `// Generated by Designer/builder/build-designs.mjs. Do not edit.
${importLine}
export default async function designerConfig(phase, ctx) {
  const base = typeof original === "function" ? await original(phase, ctx) : { ...original };
  const cfg = { ...base };
  delete cfg.headers;   // not supported by static export (Netlify _headers is used instead)
  delete cfg.redirects; // translated into Netlify _redirects by the builder
  delete cfg.rewrites;  // not supported by static export
  delete cfg.i18n;      // not supported by static export
  return {
    ...cfg,
    output: "export",
    basePath: "/${slug}",
    assetPrefix: undefined,
    trailingSlash: true,
    distDir: ".next",
    outputFileTracingRoot: ${JSON.stringify(BUILDER_DIR)},
    images: { ...(cfg.images || {}), unoptimized: true },
    env: { ...(cfg.env || {}), NEXT_PUBLIC_DESIGN_VERSION: "${slug}" },
  };
}
`;
  const finalBody = wrapperName.endsWith(".ts") ? body.replace("designerConfig(phase, ctx)", "designerConfig(phase: string, ctx: any)") : body;
  await fsp.writeFile(path.join(workDir, wrapperName), finalBody);
  return existing ? path.join(workDir, `next.config.designer-original${path.extname(existing)}`) : null;
}

/** Next.js redirects() -> Netlify _redirects lines scoped to /<slug>. */
function translateRedirects(slug, redirects) {
  const lines = [];
  for (const r of redirects || []) {
    if (!r || typeof r.source !== "string" || typeof r.destination !== "string") continue;
    if (r.has || r.missing || /[()?{}+]/.test(r.source) || r.basePath === false) {
      warn(`/${slug}: redirect ${r.source} uses advanced matching and was skipped`);
      continue;
    }
    const splat = r.source.match(/:([A-Za-z0-9_]+)\*$/);
    let from = r.source.replace(/\/:([A-Za-z0-9_]+)\*$/, "/*");
    let to = r.destination;
    if (splat) to = to.replace(new RegExp(`:${splat[1]}\\*`, "g"), ":splat");
    from = `/${slug}${from === "/" ? "" : from}`;
    if (!/^https?:\/\//.test(to)) to = `/${slug}${to.startsWith("/") ? to : "/" + to}`;
    const status = r.statusCode || (r.permanent ? 301 : 302);
    lines.push(`${from}  ${to}  ${status}!`);
  }
  return lines;
}

// -------------------------------------------------------------- build ---------

function run(cmd, cmdArgs, opts) {
  return new Promise((resolve) => {
    const child = spawn(cmd, cmdArgs, { ...opts, stdio: ["ignore", "pipe", "pipe"] });
    const tail = [];
    const onData = (prefix) => (buf) => {
      for (const line of buf.toString().split(/\r?\n/)) {
        if (!line) continue;
        console.log(`${prefix} ${line}`);
        tail.push(line);
        if (tail.length > 40) tail.shift();
      }
    };
    child.stdout.on("data", onData(opts.prefix));
    child.stderr.on("data", onData(opts.prefix));
    child.on("error", (e) => resolve({ code: 1, tail: [String(e)] }));
    child.on("close", (code) => resolve({ code, tail }));
  });
}

/** True when every dependency of the design resolves from the shared builder/node_modules. */
function missingDeps(workDir) {
  const pkg = JSON.parse(fs.readFileSync(path.join(workDir, "package.json"), "utf8"));
  // Deploy-only packages (Netlify's Next.js runtime) are not needed for a static export.
  const names = Object.keys({ ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) }).filter((n) => !n.startsWith("@netlify/"));
  const req = createRequire(path.join(workDir, "package.json"));
  return names.filter((n) => {
    try {
      req.resolve(`${n}/package.json`);
      return false;
    } catch {
      // Some packages do not export package.json; fall back to a folder check.
      return !fs.existsSync(path.join(BUILDER_DIR, "node_modules", n));
    }
  });
}

async function buildDesign(d) {
  const prefix = `[${d.slug}]`;
  const workDir = path.join(WORK, d.slug);
  await rm(workDir);
  await fsp.mkdir(workDir, { recursive: true });

  // Copy the design without API routes: they cannot be statically exported and
  // the shared backend answers /api/* for every design.
  const apiDirs = ["src/pages/api", "pages/api", "src/app/api", "app/api"].map((p) => path.join(d.dir, ...p.split("/")));
  await copyTree(d.dir, workDir, (p) => !apiDirs.includes(p));

  const originalConfigPath = await writeWrapperConfig(workDir, d.slug);
  const originalCfg = await loadOriginalConfig(originalConfigPath);
  let redirects = [];
  if (originalCfg?.redirects) {
    try {
      redirects = translateRedirects(d.slug, await originalCfg.redirects());
    } catch (e) {
      warn(`${prefix} redirects() threw: ${e.message}`);
    }
  }
  if (originalCfg?.rewrites) warn(`${prefix} next.config rewrites are ignored in static previews`);

  const missing = missingDeps(workDir);
  if (missing.length) {
    log(`${prefix} needs packages not in the shared set (${missing.join(", ")}), running npm install for this design`);
    const npm = process.platform === "win32" ? "npm.cmd" : "npm";
    const res = await run(npm, ["install", "--no-audit", "--no-fund", "--legacy-peer-deps"], { cwd: workDir, prefix, env: process.env, shell: process.platform === "win32" });
    if (res.code !== 0) return { ok: false, error: res.tail.slice(-15).join("\n") };
  }

  const req = createRequire(path.join(workDir, "package.json"));
  let nextBin, nextMajor;
  try {
    const nextPkg = req("next/package.json");
    nextMajor = parseInt(nextPkg.version, 10);
    nextBin = path.join(path.dirname(req.resolve("next/package.json")), "dist", "bin", "next");
  } catch {
    return { ok: false, error: "next is not installed (missing from package.json?)" };
  }

  log(`${prefix} building with Next.js ${nextMajor} (basePath /${d.slug})`);
  const env = { ...process.env, NEXT_TELEMETRY_DISABLED: "1", NEXT_PUBLIC_DESIGN_VERSION: d.slug, NODE_ENV: "production" };
  const buildArgs = [nextBin, "build", ...(nextMajor >= 16 ? ["--webpack"] : [])];
  const res = await run(process.execPath, buildArgs, { cwd: workDir, prefix, env });
  const outDir = path.join(workDir, "out");
  if (res.code !== 0 || !fs.existsSync(outDir)) {
    return { ok: false, error: res.tail.slice(-15).join("\n") || `next build exited with ${res.code}` };
  }
  return { ok: true, outDir, redirects };
}

/** First thing in <head>: remember which design the visitor is viewing (see _redirects). */
function headScript(slug) {
  return `<script>(function(){try{var v=${JSON.stringify(slug)},c=document.cookie.split(";");for(var i=0;i<c.length;i++){var k=c[i].split("=")[0].trim();if(k.indexOf("dv_")===0&&k!=="dv_"+v)document.cookie=k+"=;path=/;max-age=0";}document.cookie="dv_"+v+"=1;path=/;max-age=86400;samesite=lax";}catch(e){}})();</script>`;
}

async function injectHead(dir, slug) {
  const tag = headScript(slug);
  for (const file of await listFiles(dir, ".html")) {
    const html = await fsp.readFile(file, "utf8");
    if (html.includes('indexOf("dv_")')) continue;
    const next = html.replace(/<head(\s[^>]*)?>/i, (m) => m + tag);
    if (next !== html) await fsp.writeFile(file, next);
  }
}

// ------------------------------------------------------- site files ---------

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function galleryHtml(results, builtAt) {
  const cards = results
    .map((r) => {
      const title = r.meta.title || r.slug.toUpperCase();
      const status = r.status === "built" || r.status === "cached" ? "" : r.status === "stale" ? `<span class="badge warn">Latest upload failed to build, showing previous version</span>` : `<span class="badge err">Build failed</span>`;
      const cover = r.meta.cover && r.status !== "failed" ? `<img class="cover" src="/${esc(r.slug)}/${esc(String(r.meta.cover).replace(/^\/+/, ""))}" alt="" loading="lazy">` : `<div class="cover ph"><span>/${esc(r.slug)}</span></div>`;
      const open = r.status === "failed" ? "" : `<a class="btn primary" href="/${esc(r.slug)}/">Open design</a><button class="btn" data-copy="/${esc(r.slug)}/">Copy link</button>`;
      return `<article class="card">
  ${cover}
  <div class="body">
    <div class="row"><span class="tag">/${esc(r.slug)}/</span>${status}</div>
    <h2>${esc(title)}</h2>
    ${r.meta.description ? `<p>${esc(r.meta.description)}</p>` : ""}
    ${r.meta.author ? `<p class="muted">By ${esc(r.meta.author)}</p>` : ""}
    <div class="actions">${open}</div>
  </div>
</article>`;
    })
    .join("\n");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Aicyro Design Previews</title>
<style>
  :root { --bg:#f6f7fb; --card:#fff; --ink:#12141c; --muted:#5d6475; --line:#e3e6ee; --accent:#4f46e5; --accent-ink:#fff; --warn:#a15c00; --warn-bg:#fff4e0; --err:#b42318; --err-bg:#fdecea; }
  @media (prefers-color-scheme: dark) { :root { --bg:#0d0f15; --card:#151822; --ink:#eef0f6; --muted:#9aa1b2; --line:#262a36; --accent:#818cf8; --accent-ink:#0d0f15; --warn:#ffc46b; --warn-bg:#3a2a10; --err:#ff8a80; --err-bg:#3a1714; } }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--ink); font:16px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  main { max-width:1120px; margin:0 auto; padding:48px 16px 64px; }
  header h1 { margin:0 0 6px; font-size:clamp(26px,4vw,34px); letter-spacing:-0.02em; }
  header p { margin:0; color:var(--muted); }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:20px; margin-top:32px; }
  .card { background:var(--card); border:1px solid var(--line); border-radius:14px; overflow:hidden; display:flex; flex-direction:column; }
  .cover { width:100%; aspect-ratio:16/9; object-fit:cover; display:block; border-bottom:1px solid var(--line); }
  .ph { display:grid; place-items:center; background:linear-gradient(135deg, color-mix(in srgb, var(--accent) 18%, var(--card)), var(--card)); }
  .ph span { font-size:34px; font-weight:700; letter-spacing:-0.03em; color:var(--accent); }
  .body { padding:16px 18px 18px; display:flex; flex-direction:column; gap:6px; flex:1; }
  .row { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
  .tag { font:600 12px/1 ui-monospace, monospace; padding:5px 8px; border-radius:6px; background:var(--bg); color:var(--muted); }
  .badge { font-size:12px; padding:4px 8px; border-radius:6px; }
  .warn { color:var(--warn); background:var(--warn-bg); } .err { color:var(--err); background:var(--err-bg); }
  h2 { margin:4px 0 0; font-size:19px; }
  .body p { margin:0; } .muted { color:var(--muted); font-size:14px; }
  .actions { display:flex; gap:8px; margin-top:auto; padding-top:12px; flex-wrap:wrap; }
  .btn { font:inherit; font-size:14px; font-weight:600; padding:8px 14px; border-radius:9px; border:1px solid var(--line); background:transparent; color:var(--ink); cursor:pointer; text-decoration:none; }
  .btn.primary { background:var(--accent); border-color:var(--accent); color:var(--accent-ink); }
  .btn:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
  footer { margin-top:40px; color:var(--muted); font-size:13px; }
  .empty { margin-top:32px; padding:32px; border:1px dashed var(--line); border-radius:14px; color:var(--muted); }
</style>
</head>
<body>
<main>
  <header>
    <h1>Aicyro Design Previews</h1>
    <p>${results.length} design${results.length === 1 ? "" : "s"} of the Aicyro website. Open one, or copy its link to share.</p>
  </header>
  ${results.length ? `<section class="grid">\n${cards}\n</section>` : `<div class="empty">No designs yet. Add a folder such as <code>designs/v1</code> and push.</div>`}
  <footer>Last built ${esc(builtAt)}</footer>
</main>
<script>
  document.cookie.split(";").forEach(function (c) { var k = c.split("=")[0].trim(); if (k.indexOf("dv_") === 0) document.cookie = k + "=;path=/;max-age=0"; });
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var url = location.origin + b.getAttribute("data-copy");
      (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(
        function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy link"; }, 1500); },
        function () { prompt("Copy this link", url); }
      );
    });
  });
</script>
</body>
</html>
`;
}

function notFoundHtml(slugs) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>Page not found</title>
<script>
  // A design page linked to a root path such as /contact. Send the visitor back into the design they were viewing.
  (function () {
    var designs = ${JSON.stringify(slugs)};
    var m = document.cookie.match(/(?:^|;\\s*)dv_([^=;]+)=/);
    var v = m && m[1];
    if (v && designs.indexOf(v) !== -1 && location.pathname.indexOf("/" + v + "/") !== 0) {
      location.replace("/" + v + location.pathname + location.search + location.hash);
    }
  })();
</script>
<style>
  :root { --bg:#f6f7fb; --ink:#12141c; --muted:#5d6475; --accent:#4f46e5; }
  @media (prefers-color-scheme: dark) { :root { --bg:#0d0f15; --ink:#eef0f6; --muted:#9aa1b2; --accent:#818cf8; } }
  body { margin:0; min-height:100vh; display:grid; place-items:center; background:var(--bg); color:var(--ink); font:16px/1.5 system-ui, sans-serif; padding:16px; }
  a { color:var(--accent); font-weight:600; }
</style></head>
<body><div><h1>Page not found</h1><p>This page does not exist in any design. <a href="/">See all designs</a></p></div></body></html>
`;
}

function redirectsFile(results, origin) {
  const live = results.filter((r) => r.status !== "failed");
  const out = ["# Generated by Designer/builder/build-designs.mjs. Do not edit; it is rebuilt on every deploy.", ""];
  out.push("# 1. Every design calls /api/* on the shared backend (one set of server env vars).");
  if (origin) out.push(`/api/*  ${origin}/api/:splat  200!`);
  else out.push("# (DESIGNER_API_ORIGIN is not set, so API calls from the previews will fail)");
  out.push("", "# 2. Redirects from each design's next.config.js");
  for (const r of live) out.push(...r.redirects);
  out.push("", "# 3. Unknown pages inside a design show that design's own 404 page");
  for (const r of live) out.push(`/${r.slug}/*  /${r.slug}/404.html  404`);
  out.push("", "# 4. Root paths such as /contact or /assets/logo.png requested from inside a design", "#    go back to the design the visitor is viewing (cookie set by every design page)");
  for (const r of live) out.push(`/*  /${r.slug}/:splat  302  Cookie=dv_${r.slug}`);
  out.push("", "# 5. Anything else", "/*  /404.html  404", "");
  return out.join("\n");
}

const HEADERS_FILE = `# Generated by Designer/builder/build-designs.mjs
/*
  X-Robots-Tag: noindex, nofollow
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
`;

// --------------------------------------------------------------- main ---------

async function main() {
  const started = Date.now();
  loadEnvFiles();
  const origin = apiOrigin();
  const designs = await discoverDesigns();
  log(`found ${designs.length} design(s): ${designs.map((d) => d.slug).join(", ") || "none"}`);
  if (!origin) warn("DESIGNER_API_ORIGIN is not set. Forms, chat and logins in the previews will not reach a backend.");

  await rm(DIST);
  await fsp.mkdir(DIST, { recursive: true });
  await fsp.mkdir(CACHE, { recursive: true });

  const results = [];
  for (const d of designs) {
    const cacheDir = path.join(CACHE, d.slug);
    const cacheMeta = path.join(cacheDir, "meta.json");
    const cached = fs.existsSync(cacheMeta) ? JSON.parse(fs.readFileSync(cacheMeta, "utf8")) : null;
    const hash = await hashDesign(d.dir);
    const wantBuild = !ONLY || ONLY.has(d.slug) || ONLY.has(d.folder);
    const base = { slug: d.slug, meta: d.meta, redirects: [] };

    if (cached && cached.hash === hash && !NO_CACHE) {
      log(`[${d.slug}] unchanged, reusing cached build`);
      await fsp.cp(path.join(cacheDir, "out"), path.join(DIST, d.slug), { recursive: true });
      results.push({ ...base, status: "cached", redirects: cached.redirects || [] });
      continue;
    }
    if (!wantBuild) {
      if (cached) {
        log(`[${d.slug}] not selected with --only, using its previous build`);
        await fsp.cp(path.join(cacheDir, "out"), path.join(DIST, d.slug), { recursive: true });
        results.push({ ...base, status: "cached", redirects: cached.redirects || [] });
      } else {
        log(`[${d.slug}] not selected with --only and never built, left out`);
      }
      continue;
    }

    const t0 = Date.now();
    const res = await buildDesign(d);
    if (res.ok) {
      await injectHead(res.outDir, d.slug);
      await rm(cacheDir);
      await fsp.mkdir(cacheDir, { recursive: true });
      await fsp.cp(res.outDir, path.join(cacheDir, "out"), { recursive: true });
      await fsp.writeFile(cacheMeta, JSON.stringify({ hash, redirects: res.redirects, builtAt: new Date().toISOString() }, null, 2));
      await fsp.cp(res.outDir, path.join(DIST, d.slug), { recursive: true });
      await rm(path.join(WORK, d.slug));
      log(`[${d.slug}] built in ${Math.round((Date.now() - t0) / 1000)}s`);
      results.push({ ...base, status: "built", redirects: res.redirects });
    } else {
      console.error(`[designer] [${d.slug}] BUILD FAILED:\n${res.error}`);
      if (cached) {
        warn(`[${d.slug}] serving its last successful build instead`);
        await fsp.cp(path.join(cacheDir, "out"), path.join(DIST, d.slug), { recursive: true });
        results.push({ ...base, status: "stale", redirects: cached.redirects || [] });
      } else {
        results.push({ ...base, status: "failed" });
      }
    }
  }

  // Drop cache entries for designs that were deleted.
  for (const name of await fsp.readdir(CACHE)) {
    if (!designs.some((d) => d.slug === name)) await rm(path.join(CACHE, name));
  }

  const builtAt = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";
  await fsp.writeFile(path.join(DIST, "index.html"), galleryHtml(results, builtAt));
  await fsp.writeFile(path.join(DIST, "404.html"), notFoundHtml(results.filter((r) => r.status !== "failed").map((r) => r.slug)));
  await fsp.writeFile(path.join(DIST, "_redirects"), redirectsFile(results, origin));
  await fsp.writeFile(path.join(DIST, "_headers"), HEADERS_FILE);
  await fsp.writeFile(path.join(DIST, "robots.txt"), "User-agent: *\nDisallow: /\n");
  await fsp.writeFile(
    path.join(DIST, "designs.json"),
    JSON.stringify(results.map((r) => ({ slug: r.slug, path: `/${r.slug}/`, status: r.status, ...r.meta })), null, 2)
  );

  log("");
  log("summary:");
  for (const r of results) log(`  /${r.slug}/  ${r.status}`);
  log(`done in ${Math.round((Date.now() - started) / 1000)}s`);
  if (results.length && results.every((r) => r.status === "failed")) {
    console.error("[designer] every design failed to build");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
