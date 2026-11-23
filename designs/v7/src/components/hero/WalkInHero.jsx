"use client";

// Obsidian redesign: the 360° walk-in scroll hero. A 500vh track holds a sticky 100vh
// stage; the WebGL scene (walkInScene.js, client only) orbits the camera through four
// beats while this component keeps everything a person or a crawler needs in HTML: the
// CMS headline as the page's h1, the four statements as a list, the two CMS actions, a
// HUD (progress ring and 01 / 04 counter) and a keyboard "Skip to content" control.
// Reduced motion, or no WebGL, gets a static architectural hero with the same words.
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ref, onValue } from "firebase/database";
import { ArrowDown, ArrowRight, FileText } from "lucide-react";
import { database } from "../../lib/firebase12";
import { scrollToTarget } from "../motion/SmoothScroll";
import { BEATS_COPY } from "./beatsCopy";

const WalkInCanvas = dynamic(() => import("./WalkInCanvas"), { ssr: false });

const DEFAULT_HERO = {
  headingLine1: "Custom AI-Driven Software Solutions",
  headingLine2: "That Help Businesses Scale Faster",
  subheading:
    "Aicyro builds secure, scalable web, mobile, and AI-powered applications for startups, SMBs, and enterprises worldwide.",
  primaryCta: "Get a Free Strategy Call",
  secondaryCta: "Get MVP Blueprint",
};

const RING = 2 * Math.PI * 20; // HUD ring circumference (r = 20)

// The current theme (data-theme on <html>) plus any tenant --primary override
const readThemeKey = () => {
  const root = document.documentElement;
  return `${root.getAttribute("data-theme") || "light"}|${root.style.getPropertyValue("--primary")}`;
};
const subscribeTheme = (onChange) => {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "style"] });
  return () => mo.disconnect();
};

const beatOf = (p) => (p < 0.235 ? 0 : p < 0.5 ? 1 : p < 0.76 ? 2 : 3);

export default function WalkInHero({ contentId = "content" }) {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const beatRef = useRef(0);
  const liveRef = useRef(false);

  const [hero, setHero] = useState(DEFAULT_HERO);
  const [mode, setMode] = useState("3d"); // "3d" | "static"
  const [readyKey, setReadyKey] = useState(null);
  const [beat, setBeat] = useState(0);
  const [ctaLive, setCtaLive] = useState(false);
  // The scene reads its colours from the theme; a theme or hue change rebuilds it
  const themeKey = useSyncExternalStore(subscribeTheme, readThemeKey, () => "");
  const ready = readyKey !== null && readyKey === themeKey;

  // Same CMS read as before (heroSection)
  useEffect(() => {
    const off = onValue(ref(database, "heroSection"), (snap) => {
      if (snap.exists()) setHero({ ...DEFAULT_HERO, ...snap.val() });
    });
    return () => off && off();
  }, []);

  // Reduced motion: the static hero, decided before any WebGL starts
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMode(mq.matches ? "static" : "3d");
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const onFrame = useCallback((p) => {
    stageRef.current?.style.setProperty("--wh-p", p.toFixed(4));
    const b = beatOf(p);
    if (b !== beatRef.current) {
      beatRef.current = b;
      setBeat(b);
    }
    const live = p > 0.84;
    if (live !== liveRef.current) {
      liveRef.current = live;
      setCtaLive(live);
    }
  }, []);
  const onReady = useCallback(() => setReadyKey(readThemeKey()), []);
  const onFail = useCallback(() => setMode("static"), []);

  const skip = () => {
    const el = document.getElementById(contentId);
    if (!el) return;
    scrollToTarget(el, {
      onComplete: () => el.focus({ preventScroll: true }),
    });
  };

  const is3d = mode === "3d";
  const headline = `${hero.headingLine1} ${hero.headingLine2}`.trim();

  return (
    <section
      className="wh"
      data-mode={mode}
      data-ready={ready ? "true" : "false"}
      aria-labelledby="wh-title"
    >
      <div ref={trackRef} className="wh-track">
        <div ref={stageRef} className="wh-stage" style={{ "--wh-p": 0 }}>
          {/* Poster: the static architecture, shown until the scene's first frame and as
              the whole hero under reduced motion or without WebGL */}
          <div className="wh-poster" aria-hidden="true">
            <div className="wh-poster__floor" />
            <div className="wh-poster__rings">
              <span />
              <span />
              <span />
            </div>
            <div className="wh-poster__beam" />
            <p className="wh-poster__mark">AICYRO</p>
          </div>

          {is3d && themeKey && <WalkInCanvas key={themeKey} trackRef={trackRef} onFrame={onFrame} onReady={onReady} onFail={onFail} />}

          <div className="wh-veil" aria-hidden="true" />

          {/* Entry copy, under the 3D wordmark */}
          <header className="wh-intro">
            <p className="wh-eyebrow">Aicyro Solutions · AI, cybersecurity and software</p>
            <h1 id="wh-title" className="wh-title">
              {headline}
            </h1>
            <p className="wh-cue" aria-hidden="true">
              <span className="wh-cue__line" />
              Scroll to enter
            </p>
          </header>

          {/* The four beats as text: read by screen readers in 3D, shown in the static hero */}
          <ol className="wh-beats">
            {BEATS_COPY.map((b, i) => (
              <li key={b.title}>
                <span className="wh-beats__num" aria-hidden="true">
                  0{i + 1}
                </span>
                <span className="wh-beats__title">{b.title}</span>
                <span className="wh-beats__sub">{b.sub}</span>
              </li>
            ))}
          </ol>

          {/* Final reveal: the CMS line and both actions */}
          <div className="wh-final" data-live={!is3d || ctaLive ? "true" : "false"} inert={is3d && !ctaLive}>
            <p className="wh-final__lead">{hero.subheading}</p>
            <div className="wh-final__actions">
              <Link href="/contact" className="ax-btn ob-magnetic">
                {hero.primaryCta}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/resources/mvp-blueprint" className="ax-btn ax-btn--quiet">
                <FileText size={18} aria-hidden="true" />
                {hero.secondaryCta}
              </Link>
            </div>
          </div>

          {/* HUD */}
          <div className="wh-hud">
            <div className="wh-hud__meter" aria-hidden="true">
              <svg viewBox="0 0 48 48" width="48" height="48">
                <circle cx="24" cy="24" r="20" className="wh-hud__track" />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="wh-hud__fill"
                  style={{ strokeDasharray: RING, "--ring": `${RING}px` }}
                />
              </svg>
              <span className="wh-hud__count">
                <b>0{beat + 1}</b> / 04
              </span>
            </div>
            <button type="button" className="wh-skip" onClick={skip}>
              <span className="wh-skip__label">Skip to content</span>
              <ArrowDown size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="wh-bridge" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
