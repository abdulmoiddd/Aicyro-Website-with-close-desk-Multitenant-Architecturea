// Scope public-site CSS to .www in place, keeping specificity (via :where()), so kit and
// page rules never reach the super admin portal (/mes, /messages render under .www-legacy).
// Idempotent: selectors that already mention .www, html, :root or body are left alone.
// Usage: node scripts/scope-www.js <file.css> [more.css...]
const path = require("path");
const fs = require("fs");
const postcss = require(path.resolve(__dirname, "..", "node_modules", "postcss"));

function scopeSelector(sel) {
  const s = sel.trim();
  if (!s) return s;
  if (/\.www(?![\w-])/.test(s) || /^(html|body|:root)\b/.test(s)) return s;
  if (s.startsWith(".js ")) return `.js :where(.www) ${s.slice(4)}`;
  if (s.startsWith(".lenis")) return s;
  return `:where(.www) ${s}`;
}
const insideKeyframes = (node) => {
  for (let p = node.parent; p; p = p.parent) if (p.type === "atrule" && /keyframes$/i.test(p.name)) return true;
  return false;
};

for (const file of process.argv.slice(2)) {
  const root = postcss.parse(fs.readFileSync(file, "utf8"));
  root.walkRules((rule) => {
    if (insideKeyframes(rule)) return;
    rule.selectors = rule.selectors.map(scopeSelector);
  });
  fs.writeFileSync(file, root.toString());
  console.log("scoped", file);
}
