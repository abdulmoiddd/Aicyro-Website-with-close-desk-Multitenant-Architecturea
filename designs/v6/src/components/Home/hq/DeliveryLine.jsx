"use client";

// HQ tour · floor 04, the delivery line (sideways text).
// The Aicyro Blueprint is a corridor of four rooms, one per stage. The screen holds still
// while the corridor slides sideways past a "you are here" marker; the room at the marker
// lights up, the conveyor belt under it rolls, and the giant stage words drift the other
// way behind. One spring, transforms only. Same four stages and words as before.
// Reduced motion: the rooms as a plain list.
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin, DoorOpen } from "lucide-react";
import { SCROLL_SPRING } from "./motion";

const steps = [
  { id: "01", word: "Discover", title: "Discovery & Strategy", desc: "We dive deep into your business goals, user personas, and technical requirements to build a roadmap that ensures success from Day 1." },
  { id: "02", word: "Design", title: "Design & Architecture", desc: "Our architects design scalable cloud systems while our designers create intuitive, high-converting UI/UX prototypes. This serves as the unshakeable blueprint for your product." },
  { id: "03", word: "Build", title: "Agile Development & QA", desc: "We execute in rapid 2-week sprints. Continuous Integration (CI/CD) and automated testing mean you get bug-free features delivered faster, keeping you ahead of the market." },
  { id: "04", word: "Launch", title: "Launch & Long-Term Scale", desc: "We monitor performance 24/7, optimize infrastructure costs, and provide ongoing support to scale your user base securely." },
];

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function DeliveryLine() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const roomRefs = useRef([]);
  const reduce = useReducedMotion();
  const [distance, setDistance] = useState(0);
  const [here, setHere] = useState(-1);

  useIso(() => {
    if (reduce) return;
    const measure = () => {
      const t = trackRef.current;
      if (t) setDistance(Math.max(0, t.scrollWidth - window.innerWidth));
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
  const p = useSpring(scrollYProgress, SCROLL_SPRING);
  const x = useTransform(p, [0, 1], [0, -distance]);
  const wordsX = useTransform(p, [0, 1], ["-4%", "-42%"]);
  const belt = useTransform(p, [0, 1], [0, -1600]);

  // the room under the marker (the middle of the screen)
  useMotionValueEvent(x, "change", (v) => {
    const mid = window.innerWidth / 2;
    let now = -1;
    roomRefs.current.forEach((el, i) => {
      if (!el) return;
      const left = el.offsetLeft + v;
      if (left <= mid && left + el.offsetWidth >= mid) now = i;
    });
    setHere((h) => (h === now ? h : now));
  });

  if (reduce) {
    return (
      <section id="hq-line" className="hq-section" aria-labelledby="process-title">
        <div className="ax-container">
          <LineHead />
          <ol className="hq-rooms-still">
            {steps.map((s) => (
              <li key={s.id}><RoomCard s={s} /></li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="hq-line"
      className="hq-line-floor"
      aria-labelledby="process-title"
      style={{ height: `calc(100svh + ${distance}px)` }}
    >
      <div className="hq-line-floor__stage">
        <motion.p className="hq-line-floor__words" style={{ x: wordsX }} aria-hidden="true">
          {steps.map((s) => (
            <span key={s.id}>{s.word}</span>
          ))}
        </motion.p>

        <motion.ol ref={trackRef} className="hq-line-floor__track" style={{ x }}>
          <li className="hq-line-floor__intro">
            <LineHead />
            <span className="hq-line-floor__hint" aria-hidden="true">Walk the line <ArrowRight size={15} /></span>
          </li>
          {steps.map((s, i) => (
            <li key={s.id} ref={(el) => (roomRefs.current[i] = el)} className={`hq-room${here === i ? " is-here" : ""}${here > i ? " is-done" : ""}`}>
              <RoomCard s={s} />
            </li>
          ))}
          <li className="hq-line-floor__end">
            <p className="hq-floor-label"><span>04</span> End of the line</p>
            <p className="hq-line-floor__end-title">Ready when you are.</p>
            <Link href="/contact" className="ax-btn hq-btn">
              Get a Free Strategy Call <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </li>
        </motion.ol>

        <div className="hq-line-floor__marker" aria-hidden="true">
          <span className="hq-line-floor__pin"><MapPin size={14} /> You are here</span>
        </div>
        <div className="hq-line-floor__belt" aria-hidden="true"><motion.span style={{ x: belt }} /></div>
      </div>
    </section>
  );
}

function RoomCard({ s }) {
  return (
    <article className="hq-room__card">
      <header className="hq-room__plate">
        <span><DoorOpen size={15} aria-hidden="true" /> Room 4.{Number(s.id)}</span>
        <span className="hq-room__stage">Stage {s.id}</span>
      </header>
      <span className="hq-room__num" aria-hidden="true">{s.id}</span>
      <h3 className="hq-room__title">{s.title}</h3>
      <p className="hq-room__desc">{s.desc}</p>
    </article>
  );
}

function LineHead() {
  return (
    <div className="hq-head">
      <p className="hq-floor-label"><span>04</span> Delivery line</p>
      <h2 id="process-title" className="hq-h2">The Aicyro Blueprint</h2>
      <p className="ax-lead">
        A battle-tested workflow designed to eliminate risk and deliver high-performance software on time and on budget.
      </p>
    </div>
  );
}
