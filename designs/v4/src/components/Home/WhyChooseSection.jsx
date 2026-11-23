"use client";

// Walk-in · room 07, the corridor of doors.
// Five doors stand side by side, one for each reason. As you scroll, they swing open one
// after another (hinged on the left, in perspective), and behind each one is a lit room
// with the reason in full. Driven by one scroll value (--p) and choreographed in
// walkin.css. On narrow screens the doors stack and each opens as it reaches the middle
// of the screen; under reduced motion every door is open. Same five reasons as before;
// the client logos follow at the foot of the room.
import React, { useEffect, useRef, useState } from "react";
import ClientLoo from "./clienlogos";
import useScrollVar from "./walkin/useScrollVar";

const reasons = [
  {
    title: "Expert Engineers",
    subtitle: "AI + Cloud Native",
    desc: "We don’t outsource. Our team combines deep AI expertise with modern cloud engineering.",
  },
  {
    title: "Business-First Approach",
    subtitle: "ROI > Code",
    desc: "Every line of code is written with your revenue and growth goals in mind.",
  },
  {
    title: "Secure & Scalable",
    subtitle: "Enterprise Grade",
    desc: "We embed security best practices from Day 1 to protect your data and reputation.",
  },
  {
    title: "Transparent Communication",
    subtitle: "No Black Boxes",
    desc: "Expect clear timelines, honest updates, and direct access to your project lead.",
  },
  {
    title: "Proven Results",
    subtitle: "Across Industries",
    desc: "From FinTech to Healthcare, we have a track record of delivering complex software.",
  },
];

// On phones each door opens on its own as it reaches the middle of the screen
function useOpenOnView(enabled) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!enabled || !ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOpen(true), {
      rootMargin: "0px 0px -45% 0px",
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [enabled]);
  return [ref, open];
}

function Door({ item, i, stacked }) {
  const [ref, open] = useOpenOnView(stacked);
  return (
    <li ref={ref} className={`wk-door-item${stacked && open ? " is-open" : ""}`} style={{ "--i": i }}>
      {/* behind the door: the room, with the reason in full */}
      <div className="wk-door-item__room">
        <p className="wk-door-item__sub">{item.subtitle}</p>
        <h3 className="wk-door-item__title">{item.title}</h3>
        <p className="wk-door-item__desc">{item.desc}</p>
      </div>
      {/* the door itself: decoration that swings away */}
      <div className="wk-door-item__leaf" aria-hidden="true">
        <span className="wk-door-item__num ax-num">{String(i + 1).padStart(2, "0")}</span>
        <span className="wk-door-item__name">{item.title}</span>
        <span className="wk-door-item__handle" />
        <span className="wk-door-item__panel wk-door-item__panel--a" />
        <span className="wk-door-item__panel wk-door-item__panel--b" />
      </div>
    </li>
  );
}

const WhyChooseSection = () => {
  const sceneRef = useRef(null);
  const reduce = useScrollVar(sceneRef, ["start start", "end end"]);
  const [stacked, setStacked] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 60rem)");
    const sync = () => setStacked(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <section id="room-why" className="wk-why" aria-labelledby="why-title">
      <div ref={sceneRef} className={`wk-why__scene${stacked ? " is-stacked" : ""}`}>
        <div className="wk-why__stage">
          <div className="ax-container wk-why__head">
            <p className="ax-eyebrow"><b>07</b> Why Aicyro</p>
            <h2 id="why-title" className="ax-h2">Why Leading Brands Choose Aicyro</h2>
          </div>
          <ol className="ax-container wk-why__doors" style={{ "--n": reasons.length }}>
            {reasons.map((item, i) => (
              <Door key={item.title} item={item} i={i} stacked={stacked || !!reduce} />
            ))}
          </ol>
          <div className="wk-why__floor" aria-hidden="true" />
        </div>
      </div>
      <div className="ax-container hm-why__clients">
        <ClientLoo />
      </div>
    </section>
  );
};

export default WhyChooseSection;
