"use client";

// The Tour · stop 03, the manifesto wall (line-by-line reveal).
// The question is painted on the wall one line at a time: each line rises out of its own
// slot as it reaches the lower part of the screen. Then the five pains come in the same
// way, and as each one climbs past the upper third a bar in the accent strikes it out,
// because this is the part Aicyro fixes. The answer lands last.
// Same words as the old problem section. Reduced motion: everything in place, unstruck.
import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const question = ["Struggling to Build", "Reliable Software That", "Actually Drives", "Business Growth?"];

const problems = [
  { title: "Projects going over budget or deadline", desc: "Missed milestones and creeping costs killing your momentum." },
  { title: "Difficulty finding the right technical team", desc: "Sifting through freelancers who don’t understand your vision." },
  { title: "Poor performance & scalability issues", desc: "Apps that crash or lag when your user base starts to grow." },
  { title: "Security and compliance concerns", desc: "Vulnerabilities that put your user data and business at risk." },
  { title: "Lack of AI expertise in execution", desc: "Falling behind competitors who are leveraging AI effectively." },
];

function RiseLine({ children, still, className = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "start 0.6"] });
  const y = useTransform(scrollYProgress, [0, 1], ["105%", "0%"]);
  const rot = useTransform(scrollYProgress, [0, 1], [4, 0]);
  return (
    <span ref={ref} className={`tr-line ${className}`}>
      <motion.span className="tr-line__in" style={still ? undefined : { y, rotate: rot }}>
        {children}
      </motion.span>
    </span>
  );
}

function Pain({ item, i, still }) {
  const ref = useRef(null);
  const { scrollYProgress: inP } = useScroll({ target: ref, offset: ["start 0.95", "start 0.62"] });
  const { scrollYProgress: strikeP } = useScroll({ target: ref, offset: ["start 0.42", "start 0.22"] });
  const y = useTransform(inP, [0, 1], ["105%", "0%"]);
  const strike = useTransform(strikeP, [0, 1], [0, 1]);
  const fade = useTransform(strikeP, [0, 1], [1, 0.42]);
  return (
    <li ref={ref} className="tr-pain">
      <span className="tr-pain__num ax-num">{String(i + 1).padStart(2, "0")}</span>
      <span className="tr-line tr-pain__title-wrap">
        <motion.span className="tr-line__in" style={still ? undefined : { y }}>
          <motion.h3 className="tr-pain__title" style={still ? undefined : { opacity: fade }}>
            {item.title}
          </motion.h3>
          {!still && <motion.span className="tr-pain__strike" style={{ scaleX: strike }} aria-hidden="true" />}
        </motion.span>
      </span>
      <p className="tr-pain__desc">{item.desc}</p>
    </li>
  );
}

export default function ManifestoWall() {
  const still = !!useReducedMotion();
  return (
    <section id="stop-wall" className="tr-wall" aria-labelledby="problem-title">
      <div className="ax-container">
        <p className="tr-sign"><span className="tr-sign__num">03</span>Manifesto wall</p>

        <h2 id="problem-title" className="tr-wall__question">
          {question.map((l, i) => (
            <RiseLine key={l} still={still} className={i === question.length - 1 ? "is-last" : ""}>
              {l}
            </RiseLine>
          ))}
        </h2>

        <ol className="tr-wall__pains">
          {problems.map((item, i) => (
            <Pain key={item.title} item={item} i={i} still={still} />
          ))}
        </ol>

        <div className="tr-wall__answer">
          <p className="tr-wall__answer-title">
            <RiseLine still={still}>That’s where</RiseLine>
            <RiseLine still={still} className="tr-accent-line">Aicyro comes in.</RiseLine>
          </p>
          <div className="tr-wall__answer-body">
            <p className="ax-lead">We build software designed specifically for your growth stage.</p>
            <Link href="/contact" className="ax-btn tr-btn">
              Start Building with Aicyro <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
