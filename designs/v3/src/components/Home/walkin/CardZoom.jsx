"use client";

// Walk-in · scene 2, the gallery (3D card zoom).
// The six services hang in a corridor, one behind another, alternating left and right.
// Scrolling moves you down the corridor: each card starts as a small far shape, comes up
// to full size in front of you, then grows past you and dissolves. A counter and a rail
// show which room of the gallery you are in. Same six services and words as before.
// Under reduced motion (and without script) the cards are a plain grid.
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useMotionValueEvent,
} from "framer-motion";
import { Code2, Bot, Rocket, MonitorSmartphone, CloudCog, ShieldCheck, ArrowRight } from "lucide-react";

const services = [
  { title: "Custom Software Development", desc: "Tailor-made platforms designed to improve operations and customer experience.", icon: Code2, href: "/services" },
  { title: "AI & Machine Learning Solutions", desc: "Intelligent systems that automate workflows and unlock growth.", icon: Bot, href: "/services/ai-solutions" },
  { title: "SaaS Product Development", desc: "Launch and scale your SaaS product faster with modern architecture.", icon: Rocket, href: "/services/saas-development" },
  { title: "Web & Mobile App Development", desc: "High-performance apps built for speed, usability, and cross-platform compatibility.", icon: MonitorSmartphone, href: "/services/app-development" },
  { title: "Cloud & DevOps Engineering", desc: "Secure infrastructure and deployment pipelines for 99.9% uptime.", icon: CloudCog, href: "/services/cloud-devops" },
  { title: "Cybersecurity Services", desc: "Protect your systems, users, and data with enterprise-grade security protocols.", icon: ShieldCheck, href: "/services/cybersecurity-data-protection" },
];

const N = services.length;
// The share of the scene's scroll spent on the intro title before the first card arrives
const INTRO = 0.12;
// Spacing between cards along the scroll; the last card has left by about 0.97
const STEP = (0.97 - INTRO) / (N + 0.9);
// Progress at which card i stands right in front of you
const centerOf = (i) => INTRO + STEP * (i + 1.05);

function ZoomCard({ s, i, progress, narrow }) {
  // Card i is visible from two steps before its centre until it has passed you
  const c = centerOf(i);
  const start = c - STEP * 2;
  const end = c + STEP * 0.85;
  const appear = Math.max(start + STEP * 0.45, INTRO + 0.02);
  const side = i % 2 === 0 ? -1 : 1;

  const z = useTransform(progress, [start, c, end], [-2600, 0, 900]);
  // On phones the card is nearly screen-wide, so it stays close to the centre line
  const k = narrow ? [40, 3, 30] : [62, 14, 44];
  const x = useTransform(progress, [start, c, end], [side * k[0], side * k[1], side * k[2]]);
  const xv = useTransform(x, (v) => `${v}vw`);
  const rotY = useTransform(progress, [start, c, end], [side * -28, side * -8, side * -30]);
  const opacity = useTransform(progress, [Math.min(start, appear - 0.01), appear, c + STEP * 0.35, end], [0, 1, 1, 0]);
  const Icon = s.icon;

  return (
    <motion.li
      className="wk-zoom__card"
      style={{ z, x: xv, rotateY: rotY, opacity, "--accent-shift": `${i * 22}deg` }}
    >
      <article className="wk-zcard">
        <span className="wk-zcard__num ax-num">{String(i + 1).padStart(2, "0")}</span>
        <span className="wk-zcard__icon"><Icon size={26} aria-hidden="true" /></span>
        <h3 className="wk-zcard__title">{s.title}</h3>
        <p className="wk-zcard__desc">{s.desc}</p>
        <Link href={s.href} className="wk-zcard__link" tabIndex={-1}>
          Explore <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </article>
    </motion.li>
  );
}

export default function CardZoom() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.35 });
  const [current, setCurrent] = useState(0);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 40rem)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useMotionValueEvent(p, "change", (v) => {
    const idx = Math.min(N - 1, Math.max(0, Math.round((v - centerOf(0)) / STEP)));
    setCurrent((c) => (c === idx ? c : idx));
  });

  const introOpacity = useTransform(p, [0, INTRO * 0.5, INTRO], [1, 1, 0]);
  const introScale = useTransform(p, [0, INTRO], [1, 0.8]);
  const introZ = useTransform(p, [0, INTRO], [0, -400]);
  const rail = useTransform(p, [INTRO, 1], [0, 1]);
  const floorPos = useTransform(p, [0, 1], ["0px", "1400px"]);
  const outroOpacity = useTransform(p, [0.9, 1], [0, 1]);

  if (reduce) {
    return (
      <section className="ax-section wk-zoom-static" aria-labelledby="services-title">
        <div className="ax-container">
          <div className="ax-head">
            <p className="ax-eyebrow"><b>02</b> The gallery</p>
            <h2 id="services-title" className="ax-h2">End-to-End Technical Expertise</h2>
          </div>
          <ul className="wk-zoom-static__grid">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.title}>
                  <article className="wk-zcard">
                    <span className="wk-zcard__num ax-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="wk-zcard__icon"><Icon size={26} aria-hidden="true" /></span>
                    <h3 className="wk-zcard__title">{s.title}</h3>
                    <p className="wk-zcard__desc">{s.desc}</p>
                    <Link href={s.href} className="wk-zcard__link">Explore <ArrowRight size={16} aria-hidden="true" /></Link>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="wk-zoom" aria-labelledby="services-title">
      <div className="wk-zoom__stage">
        <motion.div className="wk-zoom__floor" style={{ backgroundPositionY: floorPos }} aria-hidden="true" />

        <motion.div className="wk-zoom__intro ax-container" style={{ opacity: introOpacity, scale: introScale, z: introZ }}>
          <p className="ax-eyebrow"><b>02</b> The gallery</p>
          <h2 id="services-title" className="ax-h2 wk-zoom__title">End-to-End Technical Expertise</h2>
          <p className="ax-lead">Six disciplines under one roof. Keep scrolling to walk through them.</p>
        </motion.div>

        <ul className="wk-zoom__world">
          {services.map((s, i) => (
            <ZoomCard key={s.title} s={s} i={i} progress={p} narrow={narrow} />
          ))}
        </ul>

        <div className="wk-zoom__hud" aria-hidden="true">
          <span className="wk-zoom__count ax-num">
            <b>{String(current + 1).padStart(2, "0")}</b> / {String(N).padStart(2, "0")}
          </span>
          <span className="wk-zoom__rail"><motion.i style={{ scaleX: rail }} /></span>
          <span className="wk-zoom__now">{services[current].title}</span>
        </div>

        <motion.div className="wk-zoom__outro" style={{ opacity: outroOpacity }}>
          <Link href="/services" className="ax-btn">
            All services <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>

      {/* The same services as a plain list for keyboards and screen readers */}
      <nav className="sr-only" aria-label="Services">
        <ul>
          {services.map((s) => (
            <li key={s.href + s.title}>
              <Link href={s.href}>{s.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
