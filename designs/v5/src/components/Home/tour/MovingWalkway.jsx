"use client";

// The Tour · stop 04, the moving walkway (sideways text).
// The screen holds still while you ride a walkway past the Aicyro Blueprint: the four
// stage words, set enormous, slide sideways across the room; an outlined second line runs
// the other way above them; the floor stripes roll under you. A "you are here" marker
// stands in the middle, and the sign beneath it shows the stage passing it.
// Same four stages and words as before. Reduced motion: the stages as a plain list.
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

const steps = [
  { id: "01", word: "Discover", title: "Discovery & Strategy", desc: "We dive deep into your business goals, user personas, and technical requirements to build a roadmap that ensures success from Day 1." },
  { id: "02", word: "Design", title: "Design & Architecture", desc: "Our architects design scalable cloud systems while our designers create intuitive, high-converting UI/UX prototypes. This serves as the unshakeable blueprint for your product." },
  { id: "03", word: "Build", title: "Agile Development & QA", desc: "We execute in rapid 2-week sprints. Continuous Integration (CI/CD) and automated testing mean you get bug-free features delivered faster, keeping you ahead of the market." },
  { id: "04", word: "Launch", title: "Launch & Long-Term Scale", desc: "We monitor performance 24/7, optimize infrastructure costs, and provide ongoing support to scale your user base securely." },
];

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function MovingWalkway() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const wordRefs = useRef([]);
  const reduce = useReducedMotion();
  const [geo, setGeo] = useState({ travel: 0, centres: [] });
  const [active, setActive] = useState(0);

  // Measure how far the word track travels, and where each word's centre sits on it
  useIso(() => {
    if (reduce) return;
    const measure = () => {
      const t = trackRef.current;
      if (!t) return;
      const vw = window.innerWidth;
      const first = wordRefs.current[0];
      const last = wordRefs.current[steps.length - 1];
      if (!first || !last) return;
      // start with the first word centred under the marker, end with the last one
      const c = wordRefs.current.map((w) => w.offsetLeft + w.offsetWidth / 2);
      setGeo({ start: vw / 2 - c[0], travel: c[c.length - 1] - c[0], centres: c.map((x) => x - c[0]) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    document.fonts?.ready?.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduce]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.35 });
  const x = useTransform(p, [0.04, 0.96], [geo.start || 0, (geo.start || 0) - geo.travel]);
  const echoX = useTransform(p, [0, 1], ["-30%", "5%"]);
  const floor = useTransform(p, [0, 1], ["0px", "-2400px"]);

  useMotionValueEvent(p, "change", (v) => {
    if (!geo.travel) return;
    const passed = Math.min(1, Math.max(0, (v - 0.04) / 0.92)) * geo.travel;
    let best = 0;
    geo.centres.forEach((c, i) => {
      if (Math.abs(c - passed) < Math.abs(geo.centres[best] - passed)) best = i;
    });
    setActive((a) => (a === best ? a : best));
  });

  if (reduce) {
    return (
      <section id="stop-walkway" className="ax-section tr-walk--still" aria-labelledby="process-title">
        <div className="ax-container">
          <WalkHead />
          <ol className="tr-walk__list">
            {steps.map((s) => (
              <li key={s.id}>
                <span className="tr-sign"><span className="tr-sign__num">{s.id}</span>{s.title}</span>
                <p className="ax-body">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  const cur = steps[active];

  return (
    <section ref={sectionRef} id="stop-walkway" className="tr-walk" aria-labelledby="process-title">
      <div className="tr-walk__stage">
        <div className="ax-container tr-walk__top">
          <WalkHead />
        </div>

        <motion.p className="tr-walk__echo" style={{ x: echoX }} aria-hidden="true">
          Strategy · Architecture · Sprints · QA · Launch · Scale · Strategy · Architecture · Sprints · QA
        </motion.p>

        <motion.ol ref={trackRef} className="tr-walk__track" style={{ x }} aria-hidden="true">
          {steps.map((s, i) => (
            <li
              key={s.id}
              ref={(el) => (wordRefs.current[i] = el)}
              className={`tr-walk__word${i === active ? " is-here" : ""}`}
            >
              <span className="tr-walk__word-num">{s.id}</span>
              {s.word}
              <ArrowRight className="tr-walk__arrow" />
            </li>
          ))}
        </motion.ol>

        <div className="tr-walk__marker" aria-hidden="true">
          <span className="tr-walk__pin"><MapPin size={16} /> You are here</span>
        </div>

        <div className="ax-container tr-walk__info">
          <div className="tr-walk__card" key={cur.id}>
            <p className="tr-walk__card-kicker">Stage {cur.id} of 04</p>
            <h3 className="tr-walk__card-title">{cur.title}</h3>
            <p className="tr-walk__card-desc">{cur.desc}</p>
          </div>
          <Link href="/contact" className="ax-btn tr-btn tr-walk__cta">
            Get a Free Strategy Call <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <motion.div className="tr-walk__floor" style={{ backgroundPositionX: floor }} aria-hidden="true" />
      </div>

      {/* the four stages in full, for screen readers (the moving track is decoration) */}
      <ol className="sr-only">
        {steps.map((s) => (
          <li key={s.id}>
            <h3>Stage {s.id}: {s.title}</h3>
            <p>{s.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function WalkHead() {
  return (
    <div className="tr-head tr-head--row">
      <p className="tr-sign"><span className="tr-sign__num">04</span>Moving walkway</p>
      <h2 id="process-title" className="tr-h2">The Aicyro Blueprint</h2>
      <p className="ax-lead">
        A battle-tested workflow designed to eliminate risk and deliver high-performance software on time and on budget.
      </p>
    </div>
  );
}
