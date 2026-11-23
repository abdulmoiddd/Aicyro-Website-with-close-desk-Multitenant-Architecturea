"use client";

// Walk-in · scene 3, the wall (line-by-line reveal).
// The question and the five pains are set as one large wall of lines. Each line waits
// dim, then fills with ink from left to right while it rises into place as you scroll
// it up to the middle of the screen, so the page reads to you one line at a time.
// The answer ("That's where Aicyro comes in.") lands last in the accent, with the action.
// Same words as the old problem section. Reduced motion: every line is lit at once.
import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Clock, Users, Activity, ShieldAlert, BrainCircuit, ArrowRight } from "lucide-react";

const question = ["Struggling to Build", "Reliable Software That", "Actually Drives", "Business Growth?"];

const problems = [
  { icon: Clock, title: "Projects going over budget or deadline", desc: "Missed milestones and creeping costs killing your momentum." },
  { icon: Users, title: "Difficulty finding the right technical team", desc: "Sifting through freelancers who don’t understand your vision." },
  { icon: Activity, title: "Poor performance & scalability issues", desc: "Apps that crash or lag when your user base starts to grow." },
  { icon: ShieldAlert, title: "Security and compliance concerns", desc: "Vulnerabilities that put your user data and business at risk." },
  { icon: BrainCircuit, title: "Lack of AI expertise in execution", desc: "Falling behind competitors who are leveraging AI effectively." },
];

// One line: dim base text, an ink layer clipped from the left that opens with scroll
function Line({ children, as: Tag = "span", className = "", still, accent = false }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.92", "start 0.42"] });
  const clip = useTransform(scrollYProgress, [0, 1], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  const y = useTransform(scrollYProgress, [0, 1], [26, 0]);
  const rot = useTransform(scrollYProgress, [0, 1], [8, 0]);
  const baseOpacity = useTransform(scrollYProgress, [0, 0.3], [0.08, 0.18]);

  return (
    <Tag ref={ref} className={`wk-wall__line ${className}`}>
      <motion.span className="wk-wall__base" style={still ? undefined : { y, rotateX: rot, opacity: baseOpacity }}>
        {children}
      </motion.span>
      <motion.span
        className={`wk-wall__ink${accent ? " ax-ink-grad" : ""}`}
        style={still ? { clipPath: "none" } : { y, rotateX: rot, clipPath: clip }}
        aria-hidden="true"
      >
        {children}
      </motion.span>
    </Tag>
  );
}

function Pain({ item, index, still }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.5"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.15, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [-40, 0]);
  const Icon = item.icon;
  return (
    <motion.li ref={ref} className="wk-wall__pain" style={still ? undefined : { opacity, x }}>
      <span className="wk-wall__pain-num ax-num">{String(index + 1).padStart(2, "0")}</span>
      <span className="wk-wall__pain-icon"><Icon size={20} aria-hidden="true" /></span>
      <h3 className="wk-wall__pain-title">{item.title}</h3>
      <p className="wk-wall__pain-desc">{item.desc}</p>
    </motion.li>
  );
}

export default function LineReveal() {
  const still = !!useReducedMotion();

  return (
    <section className="wk-wall" aria-labelledby="problem-title">
      <div className="ax-container">
        <p className="ax-eyebrow wk-wall__eyebrow"><b>03</b> The problem</p>

        {/* The real heading is read once; the lit layers are decoration */}
        <h2 id="problem-title" className="wk-wall__question">
          {question.map((l) => (
            <Line key={l} still={still}>{l}</Line>
          ))}
        </h2>

        <ul className="wk-wall__pains">
          {problems.map((item, i) => (
            <Pain key={item.title} item={item} index={i} still={still} />
          ))}
        </ul>

        <div className="wk-wall__answer">
          <p className="wk-wall__answer-title">
            <Line still={still}>That’s where</Line>
            <Line still={still} accent>Aicyro comes in.</Line>
          </p>
          <div className="wk-wall__answer-body">
            <p className="ax-lead">We build software designed specifically for your growth stage.</p>
            <Link href="/contact" className="ax-btn">
              Start Building with Aicyro <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
