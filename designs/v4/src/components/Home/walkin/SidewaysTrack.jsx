"use client";

// Walk-in · scene 4, the corridor turns (sideways text).
// The screen holds still while scrolling down slides the Aicyro Blueprint sideways:
// the head, then the four real stages as tall panels, each with its number. Behind them
// a giant line of type ("Discover · Design · Build · Launch") drifts the other way, and
// a second line under the track runs with it, so the words travel across the room.
// Same four stages and words as the old process section. Reduced motion: a plain list.
import React, { useLayoutEffect, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const steps = [
  { id: "01", title: "Discovery & Strategy", word: "Discover", desc: "We dive deep into your business goals, user personas, and technical requirements to build a roadmap that ensures success from Day 1." },
  { id: "02", title: "Design & Architecture", word: "Design", desc: "Our architects design scalable cloud systems while our designers create intuitive, high-converting UI/UX prototypes. This serves as the unshakeable blueprint for your product." },
  { id: "03", title: "Agile Development & QA", word: "Build", desc: "We execute in rapid 2-week sprints. Continuous Integration (CI/CD) and automated testing mean you get bug-free features delivered faster, keeping you ahead of the market." },
  { id: "04", title: "Launch & Long-Term Scale", word: "Launch", desc: "We monitor performance 24/7, optimize infrastructure costs, and provide ongoing support to scale your user base securely." },
];

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function SidewaysTrack() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const reduce = useReducedMotion();

  // How far the track must travel: its full width less one screen
  useIsoLayoutEffect(() => {
    if (reduce) return;
    const measure = () => {
      const t = trackRef.current;
      if (!t) return;
      setDistance(Math.max(0, t.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduce]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.35 });
  const x = useTransform(p, [0, 1], [0, -distance]);
  const bigX = useTransform(p, [0, 1], ["-4%", "-46%"]);
  const lowX = useTransform(p, [0, 1], ["-40%", "0%"]);
  const rail = useTransform(p, [0, 1], [0, 1]);

  if (reduce) {
    return (
      <section id="room-blueprint" className="ax-section" aria-labelledby="process-title">
        <div className="ax-container">
          <div className="ax-head ax-head--split">
            <div className="ax-head">
              <p className="ax-eyebrow"><b>04</b> The blueprint</p>
              <h2 id="process-title" className="ax-h2">The Aicyro Blueprint</h2>
            </div>
            <p className="ax-lead">A battle-tested workflow designed to eliminate risk and deliver high-performance software on time and on budget.</p>
          </div>
          <ol className="wk-side-static">
            {steps.map((s) => (
              <li key={s.id} className="wk-side__panel">
                <span className="wk-side__num ax-num">{s.id}</span>
                <h3 className="wk-side__title">{s.title}</h3>
                <p className="wk-side__desc">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="room-blueprint"
      className="wk-side"
      aria-labelledby="process-title"
      style={{ height: `calc(100svh + ${distance}px)` }}
    >
      <div className="wk-side__stage">
        {/* giant type, drifting against the track */}
        <motion.p className="wk-side__big" style={{ x: bigX }} aria-hidden="true">
          {steps.map((s) => (
            <span key={s.id}>{s.word}<i>·</i></span>
          ))}
          <span>Repeat</span>
        </motion.p>

        <motion.ol ref={trackRef} className="wk-side__track" style={{ x }}>
          <li className="wk-side__intro">
            <p className="ax-eyebrow"><b>04</b> The blueprint</p>
            <h2 id="process-title" className="wk-side__head">The Aicyro Blueprint</h2>
            <p className="ax-lead">
              A battle-tested workflow designed to eliminate risk and deliver high-performance software on time and on budget.
            </p>
            <span className="wk-side__hint" aria-hidden="true">
              Keep scrolling <ArrowRight size={16} />
            </span>
          </li>
          {steps.map((s) => (
            <li key={s.id} className="wk-side__panel">
              <span className="wk-side__num ax-num" aria-hidden="true">{s.id}</span>
              <h3 className="wk-side__title">
                <span className="sr-only">Stage {s.id}: </span>
                {s.title}
              </h3>
              <p className="wk-side__desc">{s.desc}</p>
            </li>
          ))}
          <li className="wk-side__end">
            <p className="wk-side__end-title">Ready when you are.</p>
            <Link href="/contact" className="ax-btn">
              Get a Free Strategy Call <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </li>
        </motion.ol>

        <motion.p className="wk-side__low" style={{ x: lowX }} aria-hidden="true">
          Strategy — Architecture — Sprints — QA — Launch — Scale — Strategy — Architecture — Sprints — QA — Launch — Scale
        </motion.p>

        <span className="wk-side__rail" aria-hidden="true"><motion.i style={{ scaleX: rail }} /></span>
      </div>
    </section>
  );
}
