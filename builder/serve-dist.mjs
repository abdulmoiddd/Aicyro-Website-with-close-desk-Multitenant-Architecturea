#!/usr/bin/env node
/**
 * Local preview of Designer/dist that behaves like Netlify:
 * static files first, then the rules in dist/_redirects (splats, :placeholders,
 * 200 rewrites, 200 proxies, 301/302, 404, "!" force and Cookie= conditions).
 *
 *   npm run preview            -> http://localhost:4400
 *   PORT=5000 npm run preview
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
const PORT = Number(process.env.PORT) || 4400;

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif",
  ".webp": "image/webp", ".avif": "image/avif", ".ico": "image/x-icon", ".mp4": "video/mp4", ".webm": "video/webm",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf", ".xml": "application/xml", ".pdf": "application/pdf",
  ".mp3": "audio/mpeg", ".wasm": "application/wasm",
};

function loadRules() {
  const file = path.join(DIST, "_redirects");
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8").split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#")).map((l) => {
    const parts = l.split(/\s+/);
    const [from, to] = parts;
    let status = 301, force = false;
    const cookies = [];
    for (const p of parts.slice(2)) {
      if (/^\d{3}!?$/.test(p)) { status = parseInt(p, 10); force = p.endsWith("!"); }
      else if (p.startsWith("Cookie=")) cookies.push(...p.slice(7).split(",").map((c) => c.toLowerCase()));
    }
    return { from, to, status, force, cookies };
  });
}

function matchRule(rule, pathname) {
  const fromParts = rule.from.replace(/\/+$/, "").split("/");
  const pathParts = pathname.replace(/\/+$/, "").split("/");
  const params = {};
  for (let i = 0; i < fromParts.length; i++) {
    const f = fromParts[i];
    if (f === "*") { params.splat = pathParts.slice(i).join("/"); return params; }
    if (i >= pathParts.length) return null;
    if (f.startsWith(":")) params[f.slice(1)] = decodeURIComponent(pathParts[i]);
    else if (f !== pathParts[i]) return null;
  }
  return fromParts.length === pathParts.length ? params : null;
}

function cookieNames(req) {
  return new Set((req.headers.cookie || "").split(";").map((c) => c.split("=")[0].trim().toLowerCase()).filter(Boolean));
}

function resolveFile(pathname) {
  let p;
  try { p = decodeURIComponent(pathname); } catch { return null; }
  const base = path.join(DIST, p);
  if (!base.startsWith(DIST)) return null;
  for (const c of [base, path.join(base, "index.html"), base.replace(/\/$/, "") + ".html"]) {
    try { if (fs.statSync(c).isFile()) return c; } catch { /* next */ }
  }
  return null;
}

function sendFile(res, file, status = 200) {
  res.writeHead(status, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-cache" });
  fs.createReadStream(file).pipe(res);
}

async function proxy(req, res, target) {
  try {
    const headers = { ...req.headers };
    delete headers.host;
    const hasBody = !["GET", "HEAD"].includes(req.method);
    const upstream = await fetch(target, { method: req.method, headers, body: hasBody ? Readable.toWeb(req) : undefined, duplex: hasBody ? "half" : undefined, redirect: "manual" });
    const out = {};
    upstream.headers.forEach((v, k) => { if (!["content-encoding", "content-length", "transfer-encoding"].includes(k)) out[k] = v; });
    res.writeHead(upstream.status, out);
    if (upstream.body) Readable.fromWeb(upstream.body).pipe(res); else res.end();
  } catch (e) {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end(`Proxy error: ${e.message}`);
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const rules = loadRules();
  const cookies = cookieNames(req);
  let pathname = url.pathname;

  for (let hop = 0; hop < 5; hop++) {
    const file = resolveFile(pathname);
    let handled = false;
    for (const rule of rules) {
      if (file && !rule.force) continue; // shadowing: a real file wins unless forced
      if (rule.cookies.length && !rule.cookies.some((c) => cookies.has(c))) continue;
      const params = matchRule(rule, pathname);
      if (!params) continue;
      let to = rule.to;
      for (const [k, v] of Object.entries(params)) to = to.replace(`:${k}`, v);
      if (/^https?:\/\//.test(to)) {
        if (rule.status === 200) return proxy(req, res, to + url.search);
        res.writeHead(rule.status, { Location: to + url.search });
        return res.end();
      }
      if (rule.status === 301 || rule.status === 302) {
        res.writeHead(rule.status, { Location: to + url.search });
        return res.end();
      }
      const target = resolveFile(to);
      if (rule.status === 404) return target ? sendFile(res, target, 404) : (res.writeHead(404), res.end("Not found"));
      if (target) return sendFile(res, target, rule.status);
      pathname = to; // rewrite to a path that has its own rules
      handled = true;
      break;
    }
    if (handled) continue;
    if (file) return sendFile(res, file);
    break;
  }
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

if (!fs.existsSync(DIST)) {
  console.error("dist/ does not exist yet. Run `npm run build` first.");
  process.exit(1);
}
server.listen(PORT, () => console.log(`[designer] previewing dist/ at http://localhost:${PORT}`));
