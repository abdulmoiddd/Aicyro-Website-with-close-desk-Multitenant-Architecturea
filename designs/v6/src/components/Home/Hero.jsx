"use client";

// HQ tour · 01, the entrance (layered parallax, walk-in).
// You stand on the street outside the Aicyro HQ building. Its windows switch on floor by
// floor as the page loads (the office waking up); the city sits behind, lamp posts in
// front. Scrolling walks you in: the city drifts slowly, the lamp posts pass you fast,
// the building turns to face you and the camera walks up the path to the front door; the
// glass doors slide apart and you step through into the light, which hands you over to
// the product floor. The words stay on the left and only move and fade, so they stay
// sharp. Words from the CMS (heroSection), same defaults as before.
// Colours: globals.css theme variables only. Reduced motion: one still street scene.
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ref, onValue } from "firebase/database";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { ArrowRight, FileText, DoorOpen } from "lucide-react";
import { database } from "../../lib/firebase12";
import { SCROLL_SPRING } from "./hq/motion";

const defaultData = {
  welcomeText: "TRUSTED BY STARTUPS & ENTERPRISES",
  headingLine1: "Custom AI-Driven Software Solutions",
  headingLine2: "That Help Businesses Scale Faster",
  subheading:
    "Aicyro builds secure, scalable web, mobile, and AI-powered applications for startups, SMBs, and enterprises worldwide.",
  primaryCta: "Get a Free Strategy Call",
  secondaryCta: "Get MVP Blueprint",
};

// The office floors above the lobby, top down: each window is lit with what that team
// is working on (code, a chart, a design) or left dark
const FLOORS = [
  { n: "09", w: ["code", "dark", "chart", "glow"] },
  { n: "08", w: ["glow", "code", "dark", "code"] },
  { n: "07", w: ["chart", "glow", "code", "dark"] },
  { n: "06", w: ["dark", "chart", "glow", "code"] },
  { n: "05", w: ["code", "glow", "dark", "chart"] },
  { n: "04", w: ["glow", "dark", "code", "glow"] },
  { n: "03", w: ["chart", "code", "glow", "dark"] },
  { n: "02", w: ["code", "glow", "chart", "code"] },
];

const HeroPage = ({ ready = true }) => {
  const router = useRouter();
  const [heroData, setHeroData] = useState(defaultData);
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const camRef = useRef(null);
  const doorRef = useRef(null);
  const still = !!useReducedMotion();
  // where the camera has to travel so the front door ends up mid-screen
  const [aim, setAim] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const off = onValue(ref(database, "heroSection"), (snap) => {
      if (snap.exists()) setHeroData({ ...defaultData, ...snap.val() });
    });
    return () => off && off();
  }, []);

  // Layout positions only (offsetLeft/Top ignore transforms), so this is right at any scroll
  useEffect(() => {
    if (still) return;
    const measure = () => {
      const stage = stageRef.current;
      const cam = camRef.current;
      const door = doorRef.current;
      if (!stage || !cam || !door) return;
      let x = door.offsetWidth / 2;
      let y = door.offsetHeight / 2;
      let el = door;
      while (el && el !== cam) {
        x += el.offsetLeft;
        y += el.offsetTop;
        el = el.offsetParent;
      }
      x += cam.offsetLeft;
      y += cam.offsetTop;
      setAim({ x: stage.offsetWidth / 2 - x, y: stage.offsetHeight * 0.56 - y });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);
    document.fonts?.ready?.then(measure);
    return () => ro.disconnect();
  }, [still]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, SCROLL_SPRING);

  // the walk: turn to face the building, walk up the path, through the doors
  const camX = useTransform(p, [0, 0.5, 1], [0, aim.x, aim.x]);
  const camY = useTransform(p, [0, 0.5, 1], [0, aim.y, aim.y]);
  const scale = useTransform(p, [0, 0.22, 0.5, 0.74, 0.9], [1, 1.35, 2.8, 7, 9]);
  const rotateY = useTransform(p, [0, 0.3], [-16, 0]);
  const leafL = useTransform(p, [0.42, 0.66], ["0%", "-104%"]);
  const leafR = useTransform(p, [0.42, 0.66], ["0%", "104%"]);
  const insideGlow = useTransform(p, [0.4, 0.7], [0.35, 1]);
  const flood = useTransform(p, [0.68, 0.88], [0, 1]);
  // parallax layers: the city barely moves, the lamp posts pass you fast
  const cityY = useTransform(p, [0, 1], ["0%", "10%"]);
  const cityScale = useTransform(p, [0, 1], [1, 1.25]);
  const cityOpacity = useTransform(p, [0.3, 0.6], [1, 0]);
  const lampL = useTransform(p, [0, 0.45], ["0vw", "-40vw"]);
  const lampR = useTransform(p, [0, 0.45], ["0vw", "40vw"]);
  const lampScale = useTransform(p, [0, 0.45], [1, 2.4]);
  const lampOpacity = useTransform(p, [0.25, 0.45], [1, 0]);
  // the words step aside
  const wordsX = useTransform(p, [0, 0.35], ["0px", "-80px"]);
  const wordsOpacity = useTransform(p, [0, 0.12, 0.32], [1, 1, 0]);
  const cueOpacity = useTransform(p, [0, 0.08], [1, 0]);

  const m = (style) => (still ? undefined : style);

  return (
    <section
      ref={sectionRef}
      id="hq-lobby"
      className={`hq-entry${still ? " is-still" : ""}${ready ? " is-ready" : ""}`}
      aria-labelledby="hero-title"
    >
      <div ref={stageRef} className="hq-entry__stage">
        {/* the sky and the city behind */}
        <div className="hq-entry__sky" aria-hidden="true" />
        <motion.div className="hq-entry__city" style={m({ y: cityY, scale: cityScale, opacity: cityOpacity })} aria-hidden="true">
          <i style={{ "--w": "6%", "--h": "30%", "--x": "50%" }} />
          <i style={{ "--w": "5%", "--h": "46%", "--x": "56.5%" }} />
          <i style={{ "--w": "6%", "--h": "26%", "--x": "62%" }} />
          <i style={{ "--w": "5%", "--h": "38%", "--x": "93%" }} />
          <i style={{ "--w": "4%", "--h": "24%", "--x": "97%" }} />
        </motion.div>
        <div className="hq-entry__street" aria-hidden="true" />

        {/* the building, on its own camera so it can be walked into */}
        <motion.div ref={camRef} className="hq-entry__cam" style={m({ x: camX, y: camY })} aria-hidden="true">
          <motion.div className="hq-bld" style={still ? { rotateY: -12, transformPerspective: 1400 } : { scale, rotateY, transformPerspective: 1400 }}>
            <div className="hq-bld__roof">
              <span className="hq-bld__antenna" />
              <span className="hq-bld__sign">AICYRO</span>
            </div>
            <div className="hq-bld__body">
              <span className="hq-bld__side" />
              <div className="hq-bld__face">
                {FLOORS.map((f, fi) => (
                  <div key={f.n} className="hq-bld__floor">
                    <span className="hq-bld__num">{f.n}</span>
                    {f.w.map((kind, wi) => (
                      <span
                        key={wi}
                        className={`hq-win hq-win--${kind}`}
                        style={{ "--d": `${(FLOORS.length - fi) * 140 + wi * 60}ms` }}
                      />
                    ))}
                  </div>
                ))}
                <div className="hq-bld__lobby">
                  <span className="hq-bld__canopy">
                    <DoorOpen size={12} /> Aicyro HQ · Entrance
                  </span>
                  <span className="hq-bld__glass" />
                  <div ref={doorRef} className="hq-bld__door">
                    <motion.span className="hq-bld__inside" style={m({ opacity: insideGlow })} />
                    <motion.span className="hq-bld__leaf hq-bld__leaf--l" style={m({ x: leafL })} />
                    <motion.span className="hq-bld__leaf hq-bld__leaf--r" style={m({ x: leafR })} />
                  </div>
                  <span className="hq-bld__glass" />
                </div>
              </div>
            </div>
            <span className="hq-bld__path" />
          </motion.div>
        </motion.div>

        {/* lamp posts in front of you */}
        <motion.span className="hq-lamp hq-lamp--l" style={m({ x: lampL, scale: lampScale, opacity: lampOpacity })} aria-hidden="true" />
        <motion.span className="hq-lamp hq-lamp--r" style={m({ x: lampR, scale: lampScale, opacity: lampOpacity })} aria-hidden="true" />

        {/* the words */}
        <div className="ax-container hq-entry__inner">
          <motion.div className="hq-entry__copy" style={m({ x: wordsX, opacity: wordsOpacity })}>
            {heroData.welcomeText && (
              <p className="hq-badge">
                <span className="hq-badge__dot" aria-hidden="true" />
                {heroData.welcomeText}
              </p>
            )}
            <h1 id="hero-title" className="hq-entry__title">
              <span className="hq-mask"><span>{heroData.headingLine1}</span></span>
              <span className="hq-mask"><span className="hq-grad">{heroData.headingLine2}</span></span>
            </h1>
            <p className="ax-lead hq-entry__lead">{heroData.subheading}</p>
            <div className="hq-entry__actions">
              <button type="button" onClick={() => router.push("/contact")} className="ax-btn hq-btn">
                {heroData.primaryCta}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => router.push("/resources/mvp-blueprint")} className="ax-btn ax-btn--quiet hq-btn">
                <FileText size={18} aria-hidden="true" />
                {heroData.secondaryCta}
              </button>
            </div>
          </motion.div>
        </div>

        <motion.p className="hq-entry__cue" style={m({ opacity: cueOpacity })} aria-hidden="true">
          <span className="hq-entry__cue-line" />
          Scroll to walk in
        </motion.p>

        {/* stepping through the door: the light fills the view */}
        <motion.div className="hq-entry__flood" style={still ? { opacity: 0 } : { opacity: flood }} aria-hidden="true" />
      </div>
    </section>
  );
};

export default HeroPage;
