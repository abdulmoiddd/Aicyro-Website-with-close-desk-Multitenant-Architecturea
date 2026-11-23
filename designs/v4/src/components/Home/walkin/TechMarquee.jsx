"use client";

// Walk-in · the hallway between the gallery and the problem: the technologies the studio
// builds with, on two tracks that run sideways in opposite directions. They drift on their
// own and speed up (and turn round) with the speed and direction of your scroll.
// The first copy of the list is the accessible one; the repeats are decoration.
// Reduced motion: one still, wrapped row.
import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";
import { TECH_STACK } from "../teckstack";

const wrap = (min, max, v) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

function Track({ items, base = 3, reverse = false, label }) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const dir = useRef(reverse ? -1 : 1);

  useAnimationFrame((_, delta) => {
    let move = dir.current * base * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = reverse ? 1 : -1;
    else if (f > 0) dir.current = reverse ? -1 : 1;
    move += dir.current * move * Math.abs(f);
    x.set(wrap(-25, 0, x.get() + move));
  });

  const tx = useTransform(x, (v) => `${v}%`);

  return (
    <div className="wk-tech__track">
      <motion.ul className="wk-tech__row" style={{ x: tx }} aria-label={label}>
        {[0, 1, 2, 3].map((copy) =>
          items.map((t) => (
            <li key={`${copy}-${t.name}`} aria-hidden={copy > 0 ? "true" : undefined}>
              {t.component}
              <span>{t.name}</span>
            </li>
          ))
        )}
      </motion.ul>
    </div>
  );
}

export default function TechMarquee() {
  const reduce = useReducedMotion();
  const half = Math.ceil(TECH_STACK.length / 2);
  const a = TECH_STACK.slice(0, half);
  const b = TECH_STACK.slice(half);

  return (
    <section className="wk-tech" aria-labelledby="stack-title">
      <div className="ax-container wk-tech__head">
        <p className="ax-eyebrow">The hallway</p>
        <h2 id="stack-title" className="wk-tech__title">Technologies we build with</h2>
      </div>
      {reduce ? (
        <div className="ax-container">
          <ul className="wk-tech__still">
            {TECH_STACK.map((t) => (
              <li key={t.name}>
                {t.component}
                <span>{t.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="wk-tech__tracks">
          <Track items={a} base={2.4} label="Technologies, part one" />
          <Track items={b} base={2.4} reverse label="Technologies, part two" />
        </div>
      )}
    </section>
  );
}
