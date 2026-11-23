"use client";

// The Tour · stop 01, the entrance (layered parallax).
// You stand at the mouth of a long corridor: six door frames recede to a lit far wall,
// with wayfinding signs mounted on them and one sign hanging from the ceiling. Every
// frame is its own layer; as you scroll the near frames rush past you faster than the
// far ones, the hanging sign lifts away and the welcome words step back, so scrolling
// reads as walking down the hall. The pointer adds a little depth on hover devices.
// The words come from the CMS (heroSection) with the same defaults as before.
// Reduced motion: one still screen.
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ref, onValue } from "firebase/database";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, ArrowUpLeft, FileText } from "lucide-react";
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

// Frames from near (0) to far (5): their resting scale, and the signs mounted on them
// (signs sit on the two outer frames, clear of the words)
const frames = [
  { s: 1, signs: [{ pos: "tl", text: "AI & ML", Icon: ArrowUpLeft }, { pos: "br", text: "Cloud & DevOps", Icon: ArrowUpRight }] },
  { s: 0.8, signs: [{ pos: "tr", text: "Cybersecurity", Icon: ArrowUpRight }, { pos: "bl", text: "SaaS", Icon: ArrowUpLeft }] },
  { s: 0.63, signs: [] },
  { s: 0.49, signs: [] },
  { s: 0.38, signs: [] },
  { s: 0.29, signs: [] },
];

function Frame({ f, i, p, px, py, still }) {
  // Near frames travel further (and so faster) than far ones: the parallax of a corridor
  const grow = useTransform(p, [0, 1], [f.s, f.s * (2.6 + (5 - i) * 0.55)]);
  const opacity = useTransform(grow, [1.4, 2.4], [1, 0]);
  const x = useTransform(px, (v) => v * (i + 1) * -6);
  const y = useTransform(py, (v) => v * (i + 1) * -4);
  return (
    <motion.div
      className={`tr-frame tr-frame--${i}`}
      style={still ? { scale: f.s } : { scale: grow, opacity, x, y }}
      aria-hidden="true"
    >
      {f.signs.map((sg) => (
        <span key={sg.pos} className={`tr-frame__sign tr-frame__sign--${sg.pos}`}>
          {sg.pos.endsWith("l") && <sg.Icon size={16} />}
          {sg.text}
          {sg.pos.endsWith("r") && <sg.Icon size={16} />}
        </span>
      ))}
    </motion.div>
  );
}

const HeroPage = ({ ready = true }) => {
  const router = useRouter();
  const [heroData, setHeroData] = useState(defaultData);
  const sectionRef = useRef(null);
  const reduce = useReducedMotion();
  const still = !!reduce;

  useEffect(() => {
    const heroRef = ref(database, "heroSection");
    const off = onValue(heroRef, (snapshot) => {
      if (snapshot.exists()) setHeroData({ ...defaultData, ...snapshot.val() });
    });
    return () => off && off();
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 60, damping: 18 });
  const py = useSpring(my, { stiffness: 60, damping: 18 });
  useEffect(() => {
    if (still || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [still, mx, my]);

  const lightScale = useTransform(p, [0, 1], [1, 2.2]);
  const hangY = useTransform(p, [0, 0.5], ["0vh", "-40vh"]);
  const wordsScale = useTransform(p, [0, 0.6], [1, 0.82]);
  const wordsY = useTransform(p, [0, 0.6], ["0vh", "-8vh"]);
  const wordsOpacity = useTransform(p, [0, 0.3, 0.55], [1, 1, 0]);
  const cueOpacity = useTransform(p, [0, 0.1], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="stop-entrance"
      className={`tr-entrance${still ? " is-still" : ""}${ready ? " is-ready" : ""}`}
      aria-labelledby="hero-title"
    >
      <div className="tr-entrance__stage">
        {/* the far wall, lit */}
        <motion.div className="tr-entrance__light" style={still ? undefined : { scale: lightScale }} aria-hidden="true" />

        {/* the corridor: frames from far to near so the near ones paint on top */}
        <div className="tr-entrance__hall">
          {frames
            .map((f, i) => ({ f, i }))
            .reverse()
            .map(({ f, i }) => (
              <Frame key={i} f={f} i={i} p={p} px={px} py={py} still={still} />
            ))}
        </div>

        {/* the sign hanging from the ceiling */}
        <motion.div className="tr-hang" style={still ? undefined : { y: hangY }} aria-hidden="true">
          <span className="tr-hang__wire" />
          <span className="tr-sign tr-sign--lg">
            <span className="tr-sign__num">01</span>
            Studio tour starts here
            <ArrowRight size={18} />
          </span>
        </motion.div>

        {/* the welcome */}
        <motion.div
          className="ax-container tr-entrance__words"
          style={still ? undefined : { scale: wordsScale, y: wordsY, opacity: wordsOpacity }}
        >
          {heroData.welcomeText && <p className="tr-kicker">{heroData.welcomeText}</p>}
          <h1 id="hero-title" className="tr-entrance__title">
            <span className="tr-reveal"><span>{heroData.headingLine1}</span></span>
            <span className="tr-reveal"><span className="tr-accent">{heroData.headingLine2}</span></span>
          </h1>
          <p className="ax-lead tr-entrance__lead">{heroData.subheading}</p>
          <div className="tr-entrance__actions">
            <button type="button" onClick={() => router.push("/contact")} className="ax-btn tr-btn">
              {heroData.primaryCta}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => router.push("/resources/mvp-blueprint")}
              className="ax-btn ax-btn--quiet tr-btn"
            >
              <FileText size={18} aria-hidden="true" />
              {heroData.secondaryCta}
            </button>
          </div>
        </motion.div>

        <motion.p className="tr-entrance__cue" style={still ? undefined : { opacity: cueOpacity }} aria-hidden="true">
          <span className="tr-entrance__cue-bar" />
          Walk in
        </motion.p>
      </div>
    </section>
  );
};

export default HeroPage;
