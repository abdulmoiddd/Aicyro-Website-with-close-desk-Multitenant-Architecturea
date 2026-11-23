// Aurora redesign review helper: screenshots of a public route as a returning visitor,
// cut into viewport-height segments so each one can be read at full size.
// Usage: node scripts/shoot-segments.mjs <baseUrl> <outDir> <route> [width=1440] [theme=light|dark] [maxSegments=12]
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer-core");

const [base, outDir, route, w = "1440", theme = "light", maxSeg = "12"] = process.argv.slice(2);
const width = Number(w);
const height = width < 600 ? 812 : 900;
const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument((t) => {
    try {
      localStorage.setItem("theme", t);
      localStorage.setItem("closeDesk-theme", t);
      sessionStorage.setItem("aicyro_visited", "true");
      sessionStorage.setItem("hasSeenSplash", "true");
      document.cookie = "aicyro_cookie_consent=" + encodeURIComponent(JSON.stringify({ status: "rejected", timestamp: Date.now() })) + "; path=/; max-age=3600";
    } catch (e) {}
  }, theme);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 120000 });
  await new Promise((r) => setTimeout(r, 4000));
  await page.addStyleTag({ content: ".cdw-teaser{display:none!important} .js .www [data-reveal]{opacity:1!important;transform:none!important}" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 1500));
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  const slug = (route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-")) || "home";
  const n = Math.min(Number(maxSeg), Math.ceil(total / height));
  for (let i = 0; i < n; i++) {
    const file = path.join(outDir, `${slug}-${width}-${theme}-${String(i).padStart(2, "0")}.png`);
    await page.screenshot({ path: file, clip: { x: 0, y: i * height, width, height: Math.min(height, total - i * height) }, captureBeyondViewport: true });
  }
  console.log(`${route} @${width} ${theme}: ${n} segments of ${total}px, scrollWidth ${sw}${errors.length ? ", errors: " + errors.join(" | ") : ""}`);
} finally {
  await browser.close();
}
