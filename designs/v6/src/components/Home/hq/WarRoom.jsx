"use client";

// HQ tour · floor 03, the war room (line-by-line reveal).
// The question is written on the glass wall one line at a time: each line is uncovered
// left to right, like a marker stroke, as it scrolls up the screen. Below, the team's
// kanban board: the five pains wait as cards in "Your backlog", and one by one, as you
// scroll each into the middle of the screen, the card slides across to "Shipped by
// Aicyro" and turns green. The answer lands last.
// Transform and clip only, one shared spring. Same words as before.
// Reduced motion: lines written, cards in their lanes.
import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { ArrowRight, CircleDot, CircleCheck } from "lucide-react";
import { SCROLL_SPRING } from "./motion";

const question = ["Struggling to Build Reliable", "Software That Actually Drives", "Business Growth?"];

const problems = [
  { title: "Projects going over budget or deadline", desc: "Missed milestones and creeping costs killing your momentum." },
  { title: "Difficulty finding the right technical team", desc: "Sifting through freelancers who don’t understand your vision." },
  { title: "Poor performance & scalability issues", desc: "Apps that crash or lag when your user base starts to grow." },
  { title: "Security and compliance concerns", desc: "Vulnerabilities that put your user data and business at risk." },
  { title: "Lack of AI expertise in execution", desc: "Falling behind competitors who are leveraging AI effectively." },
];

// One written line: the ink is uncovered left to right as the line rises up the screen
function WrittenLine({ children, still, accent = false }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.92", "start 0.5"] });
  const sp = useSpring(scrollYProgress, SCROLL_SPRING);
  const clip = useTransform(sp, [0, 1], ["inset(-10% 100% -20% 0%)", "inset(-10% 0% -20% 0%)"]);
  const marker = useTransform(sp, [0, 1], ["0%", "100%"]); // moves a full-width track
  const markerOpacity = useTransform(sp, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);
  return (
    <span ref={ref} className={`hq-line${accent ? " is-accent" : ""}`}>
      <span className="hq-line__ghost" aria-hidden="true">{children}</span>
      <motion.span className="hq-line__ink" style={still ? undefined : { clipPath: clip }}>
        {children}
      </motion.span>
      {!still && (
        <motion.span className="hq-line__track" style={{ x: marker, opacity: markerOpacity }} aria-hidden="true">
          <span className="hq-line__marker" />
        </motion.span>
      )}
    </span>
  );
}

function Ticket({ item, i, still }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.78", "start 0.42"] });
  const sp = useSpring(scrollYProgress, SCROLL_SPRING);
  // the card crosses from the left lane to the right lane (--move, composed in hq.css)
  const done = useTransform(sp, [0, 0.6, 1], [0, 0, 1]);
  const todo = useTransform(done, (v) => 1 - v);
  return (
    <li ref={ref} className="hq-kanban__row">
      <motion.article className="hq-ticket" style={still ? undefined : { "--move": sp }}>
        <motion.span className="hq-ticket__done-wash" style={still ? undefined : { opacity: done }} aria-hidden="true" />
        <span className="hq-ticket__state" aria-hidden="true">
          <motion.span style={still ? undefined : { opacity: todo }}><CircleDot size={18} /></motion.span>
          <motion.span className="is-done" style={still ? { opacity: 0 } : { opacity: done }}><CircleCheck size={18} /></motion.span>
        </span>
        <div className="hq-ticket__body">
          <p className="hq-ticket__id">AIC-{String(i + 1).padStart(2, "0")}</p>
          <h3 className="hq-ticket__title">{item.title}</h3>
          <p className="hq-ticket__desc">{item.desc}</p>
        </div>
      </motion.article>
    </li>
  );
}

export default function WarRoom() {
  const still = !!useReducedMotion();
  return (
    <section id="hq-war" className="hq-section hq-war" aria-labelledby="problem-title">
      <div className="ax-container">
        <p className="hq-floor-label"><span>03</span> War room</p>

        <h2 id="problem-title" className="hq-war__question">
          {question.map((l, i) => (
            <WrittenLine key={l} still={still} accent={i === question.length - 1}>{l}</WrittenLine>
          ))}
        </h2>

        <div className="hq-kanban">
          <div className="hq-kanban__cols" aria-hidden="true">
            <p><CircleDot size={15} /> Your backlog <b>{problems.length}</b></p>
            <p><CircleCheck size={15} /> Shipped by Aicyro</p>
          </div>
          <ol className="hq-kanban__rows">
            {problems.map((item, i) => (
              <Ticket key={item.title} item={item} i={i} still={still} />
            ))}
          </ol>
        </div>

        <div className="hq-war__answer">
          <p className="hq-war__answer-title">
            <WrittenLine still={still}>That’s where</WrittenLine>
            <WrittenLine still={still} accent>Aicyro comes in.</WrittenLine>
          </p>
          <div className="hq-war__answer-body">
            <p className="ax-lead">We build software designed specifically for your growth stage.</p>
            <Link href="/contact" className="ax-btn hq-btn">
              Start Building with Aicyro <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
