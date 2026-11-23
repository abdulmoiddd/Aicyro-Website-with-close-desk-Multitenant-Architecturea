"use client";

// HQ tour · floor 02, the product floor (3D card zoom).
// The six practices are team pods standing in a row through the depth of the floor. As
// you scroll, the row glides: the next pod zooms in from the depth to the front while the
// one you have seen turns away to the side. Each pod HOLDS dead centre for a stretch of
// scroll with no 3D transform at all, so its text is rendered at full size and stays
// sharp (the old board was drawn small and scaled up, which blurred it). No will-change
// on the cards for the same reason. Same six services and words as before.
// Reduced motion: the pods as a plain grid.
import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { Code2, Bot, Rocket, MonitorSmartphone, CloudCog, ShieldCheck, ArrowUpRight, ArrowRight } from "lucide-react";
import { SCROLL_SPRING } from "./motion";
import CityView from "./CityView";

const pods = [
  { title: "Custom Software Development", desc: "Tailor-made platforms designed to improve operations and customer experience.", icon: Code2, href: "/services", team: "Platform team" },
  { title: "AI & Machine Learning Solutions", desc: "Intelligent systems that automate workflows and unlock growth.", icon: Bot, href: "/services/ai-solutions", team: "AI team" },
  { title: "SaaS Product Development", desc: "Launch and scale your SaaS product faster with modern architecture.", icon: Rocket, href: "/services/saas-development", team: "Product team" },
  { title: "Web & Mobile App Development", desc: "High-performance apps built for speed, usability, and cross-platform compatibility.", icon: MonitorSmartphone, href: "/services/app-development", team: "Apps team" },
  { title: "Cloud & DevOps Engineering", desc: "Secure infrastructure and deployment pipelines for 99.9% uptime.", icon: CloudCog, href: "/services/cloud-devops", team: "Cloud team" },
  { title: "Cybersecurity Services", desc: "Protect your systems, users, and data with enterprise-grade security protocols.", icon: ShieldCheck, href: "/services/cybersecurity-data-protection", team: "Security team" },
];

const N = pods.length;
// Scroll -> row position, with a flat hold on every pod so it rests exactly centred
const SPAN_START = 0.06;
const SPAN_END = 0.94;
const PER = (SPAN_END - SPAN_START) / N;
const HOLD = 0.55; // share of each pod's slot spent resting at the front
const posIn = [0];
const posOut = [0];
for (let i = 0; i < N; i += 1) {
  const a = SPAN_START + i * PER;
  posIn.push(a, a + PER * HOLD);
  posOut.push(i, i);
}
posIn.push(1);
posOut.push(N - 1);

function PodCard({ pod, i, inert }) {
  const Icon = pod.icon;
  return (
    <article className="hq-pod__card">
      <header className="hq-pod__head">
        <span className="hq-pod__room">Pod {String(i + 1).padStart(2, "0")}</span>
        <span className="hq-pod__team"><i aria-hidden="true" />{pod.team}</span>
      </header>
      <span className="hq-pod__icon"><Icon size={26} aria-hidden="true" /></span>
      <h3 className="hq-pod__title">{pod.title}</h3>
      <p className="hq-pod__desc">{pod.desc}</p>
      <Link href={pod.href} className="hq-pod__link" tabIndex={inert ? -1 : undefined}>
        Visit this pod <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}

function Pod({ pod, i, pos, active }) {
  const d = useTransform(pos, (v) => i - v);
  const x = useTransform(d, (v) => `${v * 64}%`);
  const z = useTransform(d, (v) => -Math.min(Math.abs(v), 3) * 280);
  const rotateY = useTransform(d, (v) => Math.max(-62, Math.min(62, -v * 40)));
  const opacity = useTransform(d, (v) => {
    const a = Math.abs(v);
    return a < 1.6 ? 1 : Math.max(0, 1 - (a - 1.6) * 1.2);
  });
  const zIndex = useTransform(d, (v) => 100 - Math.round(Math.abs(v) * 10));
  return (
    <motion.li className={`hq-pod${active === i ? " is-front" : ""}`} style={{ x, z, rotateY, opacity, zIndex }}>
      <PodCard pod={pod} i={i} inert={active !== i} />
    </motion.li>
  );
}

export default function ProductFloor() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, SCROLL_SPRING);
  const pos = useTransform(p, posIn, posOut);
  const rail = useTransform(pos, [0, N - 1], [0, 1]);

  useMotionValueEvent(pos, "change", (v) => {
    const now = Math.min(N - 1, Math.max(0, Math.round(v)));
    setActive((a) => (a === now ? a : now));
  });

  if (reduce) {
    return (
      <section id="hq-floor" className="hq-section" aria-labelledby="floor-title">
        <div className="ax-container">
          <FloorHead />
          <ul className="hq-pods-still">
            {pods.map((pod, i) => (
              <li key={pod.title}><PodCard pod={pod} i={i} /></li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="hq-floor" className="hq-floor" aria-labelledby="floor-title">
      <div className="hq-floor__stage">
        <CityView />
        <div className="ax-container hq-floor__head">
          <FloorHead />
        </div>

        <div className="hq-floor__room">
          <ol className="hq-floor__row">
            {pods.map((pod, i) => (
              <Pod key={pod.title} pod={pod} i={i} pos={pos} active={active} />
            ))}
          </ol>
        </div>

        <div className="ax-container hq-floor__hud" aria-hidden="true">
          <span className="hq-tag">Pod {String(active + 1).padStart(2, "0")} of {String(N).padStart(2, "0")}</span>
          <span className="hq-floor__rail"><motion.i style={{ scaleX: rail }} /></span>
          <Link href="/services" className="hq-floor__all" tabIndex={-1}>
            All services <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <nav className="sr-only" aria-label="Services">
        <ul>
          {pods.map((pod) => (
            <li key={pod.title}><Link href={pod.href}>{pod.title}</Link></li>
          ))}
          <li><Link href="/services">All services</Link></li>
        </ul>
      </nav>
    </section>
  );
}

function FloorHead() {
  return (
    <div className="hq-head">
      <p className="hq-floor-label"><span>02</span> Product floor</p>
      <h2 id="floor-title" className="hq-h2">End-to-End Technical Expertise</h2>
      <p className="ax-lead">Six teams under one roof. Walk the floor and meet each one.</p>
    </div>
  );
}
