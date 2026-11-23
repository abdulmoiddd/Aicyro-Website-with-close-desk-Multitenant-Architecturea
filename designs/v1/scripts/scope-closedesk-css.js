// Prefix every selector in a CSS file with `html.cd-root` so the rules only
// apply on internal (Closedesk) routes. Usage: node scripts/scope-closedesk-css.js <projectDir> <in> <out>
const path = require("path");
const fs = require("fs");
const [, , projectDir, inFile, outFile] = process.argv;
const postcss = require(path.resolve(projectDir, "node_modules", "postcss"));

const SCOPE = "html.cd-root";

// :where() adds zero specificity, so the scoped rules cascade against the
// dashboard's own .cd-* rules exactly as the unscoped originals did.
const W = `:where(${SCOPE})`;
function scopeSelector(sel) {
  const s = sel.trim();
  if (!s) return s;
  // :root variable overrides must keep winning over tokens.css
  if (s.startsWith(":root")) return SCOPE + s.slice(5);
  if (/^html\b/.test(s)) return "html:where(.cd-root)" + s.slice(4);
  // Classes / attributes that live on <html> itself
  if (s.startsWith(".js") && !/^\.js[\w-]/.test(s)) return W + s;
  if (s.startsWith("[data-theme")) return W + s;
  return `${W} ${s}`;
}

function insideKeyframes(node) {
  for (let p = node.parent; p; p = p.parent) {
    if (p.type === "atrule" && /keyframes$/i.test(p.name)) return true;
  }
  return false;
}

const css = fs.readFileSync(inFile, "utf8");
const root = postcss.parse(css);
root.walkRules((rule) => {
  if (insideKeyframes(rule)) return;
  rule.selectors = rule.selectors.map(scopeSelector);
});
const header =
  "/* Generated: scoped to html.cd-root (internal Closedesk routes: /lg, /logs, /embed, /e2e-report)\n" +
  "   so these engine styles never restyle the public Aicyro website. */\n";
fs.writeFileSync(outFile, header + root.toString());
console.log("scoped", inFile, "->", outFile);
