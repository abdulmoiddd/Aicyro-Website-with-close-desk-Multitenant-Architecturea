// First-screen screenshots of a public route at several viewport sizes, as a returning visitor.
// Usage: node scripts/shoot-first-screen.mjs <baseUrl> <outDir> <route> <theme> <WxH> [WxH ...]
// Prints, per size, the hero's height against the viewport and the page's scrollWidth.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer-core");

const [base, outDir, route, theme = "light", ...sizes] = process.argv.slice(2);
const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
try {
  for (const size of sizes) {
    const [width, height] = size.split("x").map(Number);
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
    await new Promise((r) => setTimeout(r, 4500));
    await page.addStyleTag({ content: ".cdw-teaser{display:none!important}" });
    await new Promise((r) => setTimeout(r, 1200));
    const info = await page.evaluate(() => {
      const h = document.querySelector(".ax-hero");
      const r = h ? h.getBoundingClientRect() : null;
      return { hero: r ? Math.round(r.height) : null, top: r ? Math.round(r.top) : null, sw: document.documentElement.scrollWidth };
    });
    const slug = (route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-")) || "home";
    await page.screenshot({ path: path.join(outDir, `${slug}-${width}x${height}-${theme}.png`) });
    console.log(`${size} ${theme}: hero ${info.hero}px from y=${info.top}, viewport ${height}, scrollWidth ${info.sw}${errors.length ? ", errors: " + errors.join(" | ") : ""}`);
    await page.close();
  }
} finally {
  await browser.close();
}
