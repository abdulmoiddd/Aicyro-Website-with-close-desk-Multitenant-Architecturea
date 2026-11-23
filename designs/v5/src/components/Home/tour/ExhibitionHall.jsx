"use client";

// The Tour · stop 02, the exhibition hall (3D card zoom).
// The six services hang as framed exhibits on one gallery wall, seen from the doorway in
// perspective. Scrolling walks you up to the wall: the camera zooms into exhibit 01 until
// it fills the view, steps back a little, glides to 02, zooms in again, and so on, then
// pulls back to the whole wall. A plaque at the foot names the exhibit in view.
// Same six services and words as before. Reduced motion: the wall as a plain grid.
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { Code2, Bot, Rocket, MonitorSmartphone, CloudCog, ShieldCheck, ArrowRight, ArrowUpRight } from "lucide-react";

const services = [
  { title: "Custom Software Development", desc: "Tailor-made platforms designed to improve operations and customer experience.", icon: Code2, href: "/services" },
  { title: "AI & Machine Learning Solutions", desc: "Intelligent systems that automate workflows and unlock growth.", icon: Bot, href: "/services/ai-solutions" },
  { title: "SaaS Product Development", desc: "Launch and scale your SaaS product faster with modern architecture.", icon: Rocket, href: "/services/saas-development" },
  { title: "Web & Mobile App Development", desc: "High-performance apps built for speed, usability, and cross-platform compatibility.", icon: MonitorSmartphone, href: "/services/app-development" },
  { title: "Cloud & DevOps Engineering", desc: "Secure infrastructure and deployment pipelines for 99.9% uptime.", icon: CloudCog, href: "/services/cloud-devops" },
  { title: "Cybersecurity Services", desc: "Protect your systems, users, and data with enterprise-grade security protocols.", icon: ShieldCheck, href: "/services/cybersecurity-data-protection" },
];

const N = services.length;
const START = 0.12; // the overview before the first zoom
const STEP = 0.125; // scroll spent per exhibit
const HOLD = 0.06; // of which: standing in front of it

// Where each exhibit sits on the wall, as a share of the wall (centre = 0)
function centreOf(i, cols) {
  const rows = Math.ceil(N / cols);
  const c = i % cols;
  const r = Math.floor(i / cols);
  return { x: ((c + 0.5) / cols - 0.5) * 100, y: ((r + 0.5) / rows - 0.5) * 100 };
}

// The camera path as keyframes: overview, then in, hold, half-out-and-glide, in ...
function buildPath(zoom, cols) {
  const at = [0, START - 0.02];
  const s = [0.62, 0.62];
  const x = [0, 0];
  const y = [0, 0];
  const tilt = [14, 14];
  for (let i = 0; i < N; i += 1) {
    const { x: cx, y: cy } = centreOf(i, cols);
    const arrive = START + i * STEP;
    if (i > 0) {
      const prev = centreOf(i - 1, cols);
      at.push(arrive - (STEP - HOLD) / 2);
      s.push(zoom * 0.72);
      x.push((-(cx + prev.x) / 2) * zoom * 0.72);
      y.push((-(cy + prev.y) / 2) * zoom * 0.72);
      tilt.push(4);
    }
    at.push(arrive, arrive + HOLD);
    s.push(zoom, zoom);
    // translate is applied after the scale, so the shift is the scaled distance
    x.push(-cx * zoom, -cx * zoom);
    y.push(-cy * zoom, -cy * zoom);
    tilt.push(0, 0);
  }
  at.push(Math.min(0.97, START + (N - 1) * STEP + HOLD + 0.09), 1);
  s.push(0.62, 0.62);
  x.push(0, 0);
  y.push(0, 0);
  tilt.push(14, 14);
  return { at, s, x, y, tilt };
}

function Exhibit({ s, i, active, inert }) {
  const Icon = s.icon;
  return (
    <li className={`tr-exhibit${active ? " is-active" : ""}`}>
      <article className="tr-exhibit__frame">
        <span className="tr-exhibit__plate ax-num">Exhibit {String(i + 1).padStart(2, "0")}</span>
        <span className="tr-exhibit__icon"><Icon size={22} aria-hidden="true" /></span>
        <h3 className="tr-exhibit__title">{s.title}</h3>
        <p className="tr-exhibit__desc">{s.desc}</p>
        <Link href={s.href} className="tr-exhibit__link" tabIndex={inert ? -1 : undefined}>
          Explore <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </article>
    </li>
  );
}

export default function ExhibitionHall() {
  const ref = useRef(null);
  const wallRef = useRef(null);
  const reduce = useReducedMotion();
  const [cols, setCols] = useState(3);
  const [zoom, setZoom] = useState(2.2);
  const [active, setActive] = useState(-1);

  // Layout: 3 x 2 on wide screens, 2 x 3 on phones; zoom so one exhibit fills the view
  useEffect(() => {
    const measure = () => {
      const narrow = window.innerWidth < 700;
      const c = narrow ? 2 : 3;
      setCols(c);
      const wall = wallRef.current;
      if (!wall) return;
      const w = wall.offsetWidth / c;
      const h = wall.offsetHeight / Math.ceil(N / c);
      setZoom(Math.max(1.4, Math.min((window.innerWidth * 0.88) / w, (window.innerHeight * 0.7) / h, 2.3)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 100, damping: 26, mass: 0.4 });
  const path = buildPath(zoom, cols);
  const scale = useTransform(p, path.at, path.s);
  const xv = useTransform(useTransform(p, path.at, path.x), (v) => `${v}%`);
  const yv = useTransform(useTransform(p, path.at, path.y), (v) => `${v}%`);
  const rotateX = useTransform(p, path.at, path.tilt);
  const headOpacity = useTransform(p, [0, START - 0.03, START, 0.9, 0.96], [1, 1, 0, 0, 1]);

  useMotionValueEvent(p, "change", (v) => {
    let now = -1;
    for (let i = 0; i < N; i += 1) {
      const arrive = START + i * STEP;
      if (v >= arrive - 0.03 && v <= arrive + HOLD + 0.03) now = i;
    }
    setActive((a) => (a === now ? a : now));
  });

  if (reduce) {
    return (
      <section id="stop-hall" className="tr-hall tr-hall--still" aria-labelledby="hall-title">
        <div className="ax-container">
          <HallHead />
          <ol className="tr-hall__wall tr-hall__wall--still">
            {services.map((s, i) => (
              <Exhibit key={s.title} s={s} i={i} active={false} />
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="stop-hall" className="tr-hall" aria-labelledby="hall-title">
      <div className="tr-hall__stage">
        <motion.div className="ax-container tr-hall__head" style={{ opacity: headOpacity }}>
          <HallHead />
        </motion.div>

        <div className="tr-hall__room">
          <motion.ol
            ref={wallRef}
            className={`tr-hall__wall${active >= 0 ? " is-zoomed" : ""}`}
            style={{ scale, x: xv, y: yv, rotateX, "--cols": cols }}
          >
            {services.map((s, i) => (
              <Exhibit key={s.title} s={s} i={i} active={active === i} inert={active !== i} />
            ))}
          </motion.ol>
          <div className="tr-hall__floor" aria-hidden="true" />
        </div>

        <div className={`tr-hall__plaque${active >= 0 ? " is-on" : ""}`} aria-hidden="true">
          <span className="tr-sign">
            <span className="tr-sign__num">{active >= 0 ? String(active + 1).padStart(2, "0") : "02"}</span>
            {active >= 0 ? services[active].title : "Exhibition hall"}
          </span>
          <Link href="/services" className="tr-hall__all" tabIndex={-1}>
            All services <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* The same services as a plain list for keyboards and screen readers */}
      <nav className="sr-only" aria-label="Services">
        <ul>
          {services.map((s) => (
            <li key={s.title}><Link href={s.href}>{s.title}</Link></li>
          ))}
          <li><Link href="/services">All services</Link></li>
        </ul>
      </nav>
    </section>
  );
}

function HallHead() {
  return (
    <div className="tr-head">
      <p className="tr-sign"><span className="tr-sign__num">02</span>Exhibition hall</p>
      <h2 id="hall-title" className="tr-h2">End-to-End Technical Expertise</h2>
      <p className="ax-lead">Six disciplines on one wall. Keep walking to look at each one up close.</p>
    </div>
  );
}
