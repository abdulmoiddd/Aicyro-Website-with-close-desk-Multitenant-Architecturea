"use client";

// Walk-in · scene 1, the doorway (layered parallax).
// Five layers sit at different depths inside one sticky stage: the lit sky, the floor
// grid, the far wordmark, the floating fragments of what Aicyro builds, and the
// headline in front. Scrolling walks you through the doorway: the front layer grows
// and dissolves past you, the fragments spread to the sides, the far layers barely
// move. The pointer adds a little depth on devices that hover.
// The words still come from the CMS (heroSection) with the same defaults as before.
// Under reduced motion the stage is one still screen.
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ref, onValue } from "firebase/database";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, FileText, ShieldCheck, Bot, CloudCog, Smartphone, GitBranch, Code2 } from "lucide-react";
import { database } from "../../lib/firebase12";

const defaultData = {
  welcomeText: "TRUSTED BY STARTUPS & ENTERPRISES",
  headingLine1: "Custom AI-Driven Software Solutions",
  headingLine2: "That Help Businesses Scale Faster",
  subheading:
    "Aicyro builds secure, scalable web, mobile, and AI-powered applications for startups, SMBs, and enterprises worldwide.",
  primaryCta: "Get a Free Strategy Call",
  secondaryCta: "Get MVP Blueprint",
};

// The floating fragments: each one is a piece of the studio's real offer.
// depth: how strongly it reacts (1 = near, 0.3 = far); dir: which way it leaves.
const fragments = [
  { id: "code", cls: "wk-frag--code", depth: 0.9, dir: [-1, -0.4] },
  { id: "shield", cls: "wk-frag--shield", depth: 0.6, dir: [1, -0.6] },
  { id: "ai", cls: "wk-frag--ai", depth: 1, dir: [1.1, 0.5] },
  { id: "sprint", cls: "wk-frag--sprint", depth: 0.75, dir: [-1.1, 0.6] },
  { id: "cloud", cls: "wk-frag--cloud", depth: 0.4, dir: [0.6, -1] },
  { id: "mobile", cls: "wk-frag--mobile", depth: 0.5, dir: [-0.7, -1] },
];

function FragmentBody({ id }) {
  switch (id) {
    case "code":
      return (
        <>
          <span className="wk-frag__dots" aria-hidden="true"><i /><i /><i /></span>
          <code className="wk-frag__code">
            <span><b>$</b> aicyro build --ai --secure</span>
            <span className="is-ok">tests passed</span>
            <span className="is-ok">deployed to production</span>
          </code>
        </>
      );
    case "shield":
      return (
        <>
          <ShieldCheck size={22} aria-hidden="true" />
          <span className="wk-frag__title">Security from Day 1</span>
          <span className="wk-frag__meta">Cybersecurity services</span>
        </>
      );
    case "ai":
      return (
        <>
          <Bot size={22} aria-hidden="true" />
          <span className="wk-frag__title">AI &amp; Machine Learning</span>
          <span className="wk-frag__bars" aria-hidden="true">
            <i style={{ "--h": "38%" }} /><i style={{ "--h": "62%" }} /><i style={{ "--h": "48%" }} /><i style={{ "--h": "80%" }} /><i style={{ "--h": "70%" }} /><i style={{ "--h": "96%" }} />
          </span>
        </>
      );
    case "sprint":
      return (
        <>
          <GitBranch size={20} aria-hidden="true" />
          <span className="wk-frag__title">2-week sprints</span>
          <span className="wk-frag__rail" aria-hidden="true"><i /></span>
          <span className="wk-frag__meta">Agile Development &amp; QA</span>
        </>
      );
    case "cloud":
      return (
        <>
          <CloudCog size={20} aria-hidden="true" />
          <span className="wk-frag__title">Cloud &amp; DevOps</span>
        </>
      );
    case "mobile":
      return (
        <>
          <Smartphone size={20} aria-hidden="true" />
          <span className="wk-frag__title">Web &amp; Mobile</span>
        </>
      );
    default:
      return <Code2 size={20} aria-hidden="true" />;
  }
}

function Fragment({ frag, progress, px, py, still }) {
  const spread = useTransform(progress, [0, 1], [0, 1]);
  const x = useTransform([spread, px], ([s, p]) => s * frag.dir[0] * 46 * frag.depth + p * 28 * frag.depth);
  const y = useTransform([spread, py], ([s, p]) => s * frag.dir[1] * 40 * frag.depth + p * 22 * frag.depth);
  const scale = useTransform(progress, [0, 1], [1, 1 + 0.9 * frag.depth]);
  const opacity = useTransform(progress, [0, 0.55, 0.9], [1, 0.9, 0]);
  const xv = useTransform(x, (v) => `${v}vw`);
  const yv = useTransform(y, (v) => `${v}vh`);

  return (
    <motion.div
      className={`wk-frag ${frag.cls}`}
      style={still ? undefined : { x: xv, y: yv, scale, opacity }}
      aria-hidden="true"
    >
      <div className="wk-frag__card">
        <FragmentBody id={frag.id} />
      </div>
    </motion.div>
  );
}

const HeroPage = ({ ready = true }) => {
  const router = useRouter();
  const [heroData, setHeroData] = useState(defaultData);
  const sectionRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const heroRef = ref(database, "heroSection");
    const off = onValue(heroRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setHeroData({ ...defaultData, ...data });
      }
    });
    return () => off && off();
  }, []);

  // Scroll: 0 at the top of the doorway, 1 once you have walked through it
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  // Pointer depth (hover devices only)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 60, damping: 18 });
  const py = useSpring(my, { stiffness: 60, damping: 18 });
  useEffect(() => {
    if (reduce || typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  // Layer speeds: far layers move least
  const skyY = useTransform(p, [0, 1], ["0%", "18%"]);
  const skyScale = useTransform(p, [0, 1], [1, 1.25]);
  const floorY = useTransform(p, [0, 1], ["0%", "-12%"]);
  const floorShift = useTransform(p, [0, 1], ["0px", "320px"]);
  const markY = useTransform(p, [0, 1], ["0%", "-30%"]);
  const markScale = useTransform(p, [0, 1], [1, 1.6]);
  const markOpacity = useTransform(p, [0, 0.7], [1, 0]);
  const markX = useTransform(px, (v) => `${v * -2}vw`);
  const frontScale = useTransform(p, [0, 0.8], [1, 1.45]);
  const frontY = useTransform(p, [0, 0.8], ["0vh", "-14vh"]);
  const frontOpacity = useTransform(p, [0, 0.35, 0.7], [1, 1, 0]);
  const frontBlur = useTransform(p, [0.3, 0.75], ["blur(0px)", "blur(10px)"]);
  const cueOpacity = useTransform(p, [0, 0.12], [1, 0]);
  const doorClip = useTransform(p, [0, 1], ["inset(0% 0% 0% 0% round 0px)", "inset(6% 4% 6% 4% round 40px)"]);

  const still = !!reduce;

  return (
    <section
      ref={sectionRef}
      className={`wk-door${still ? " is-still" : ""}${ready ? " is-ready" : ""}`}
      aria-labelledby="hero-title"
    >
      <motion.div className="wk-door__stage" style={still ? undefined : { clipPath: doorClip }}>
        {/* layer 0: the lit sky */}
        <motion.div className="wk-door__sky" style={still ? undefined : { y: skyY, scale: skyScale }} aria-hidden="true">
          <span className="wk-orb wk-orb--a" />
          <span className="wk-orb wk-orb--b" />
          <span className="wk-orb wk-orb--c" />
        </motion.div>

        {/* layer 1: the floor, receding to the horizon */}
        <motion.div
          className="wk-door__floor"
          style={still ? undefined : { y: floorY, backgroundPositionY: floorShift }}
          aria-hidden="true"
        />

        {/* layer 2: the far wordmark */}
        <motion.p
          className="wk-door__mark"
          style={still ? undefined : { y: markY, x: markX, scale: markScale, opacity: markOpacity }}
          aria-hidden="true"
        >
          Aicyro
        </motion.p>

        {/* layer 3: fragments of the work */}
        <div className="wk-door__frags">
          {fragments.map((f) => (
            <Fragment key={f.id} frag={f} progress={p} px={px} py={py} still={still} />
          ))}
        </div>

        {/* layer 4: the words, in front */}
        <motion.div
          className="ax-container wk-door__front"
          style={still ? undefined : { scale: frontScale, y: frontY, opacity: frontOpacity, filter: frontBlur }}
        >
          {heroData.welcomeText && (
            <p className="wk-door__kicker">
              <span className="wk-door__pulse" aria-hidden="true" />
              {heroData.welcomeText}
            </p>
          )}
          <h1 id="hero-title" className="wk-door__title">
            <span className="wk-line"><span>{heroData.headingLine1}</span></span>
            <span className="wk-line"><span className="ax-ink-grad">{heroData.headingLine2}</span></span>
          </h1>
          <p className="ax-lead wk-door__lead">{heroData.subheading}</p>
          <div className="wk-door__actions">
            <button type="button" onClick={() => router.push("/contact")} className="ax-btn">
              {heroData.primaryCta}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => router.push("/resources/mvp-blueprint")}
              className="ax-btn ax-btn--quiet"
            >
              <FileText size={18} aria-hidden="true" />
              {heroData.secondaryCta}
            </button>
          </div>
        </motion.div>

        <motion.div className="wk-door__cue" style={still ? undefined : { opacity: cueOpacity }} aria-hidden="true">
          <span className="wk-door__cue-line" />
          Scroll to walk in
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroPage;
