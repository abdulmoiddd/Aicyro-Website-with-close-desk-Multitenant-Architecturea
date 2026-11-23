"use client";

// The Tour · stop 07, the departures board (why Aicyro).
// The five reasons are posted on a split-flap board like the one in a station hall. When a
// row comes into view its letters clatter through the alphabet and settle on the reason,
// row after row; the detail sits on the line beneath. The client logos follow at the foot.
// The letters are decoration (aria-hidden); the real words are in the same row for screen
// readers. Reduced motion: the board shows the words at once. Same five reasons as before.
import React, { useEffect, useRef, useState } from "react";
import ClientLoo from "./clienlogos";

const reasons = [
  { title: "Expert Engineers", subtitle: "AI + Cloud Native", desc: "We don’t outsource. Our team combines deep AI expertise with modern cloud engineering." },
  { title: "Business-First Approach", subtitle: "ROI > Code", desc: "Every line of code is written with your revenue and growth goals in mind." },
  { title: "Secure & Scalable", subtitle: "Enterprise Grade", desc: "We embed security best practices from Day 1 to protect your data and reputation." },
  { title: "Transparent Communication", subtitle: "No Black Boxes", desc: "Expect clear timelines, honest updates, and direct access to your project lead." },
  { title: "Proven Results", subtitle: "Across Industries", desc: "From FinTech to Healthcare, we have a track record of delivering complex software." },
];

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ&+>-0123456789";

// One line of flaps. Starts blank, flips through glyphs, settles left to right.
function Flaps({ text, go, delay = 0 }) {
  const target = text.toUpperCase();
  const [shown, setShown] = useState(() => target.replace(/[^ ]/g, " "));

  useEffect(() => {
    if (!go) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(target);
      return;
    }
    let frame = 0;
    let timer;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        frame += 1;
        let done = true;
        const next = target
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (frame >= 6 + i * 1.4) return ch;
            done = false;
            return GLYPHS[(frame * 7 + i * 13) % GLYPHS.length];
          })
          .join("");
        setShown(next);
        if (done) clearInterval(timer);
      }, 45);
    }, delay);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [go, target, delay]);

  // Group the cells into words so a line only ever wraps between words
  const words = [];
  let at = 0;
  target.split(" ").forEach((w) => {
    words.push({ start: at, len: w.length });
    at += w.length + 1;
  });

  return (
    <span className="tr-flaps" aria-hidden="true">
      {words.map((w) => (
        <span key={w.start} className="tr-flaps__word">
          {shown
            .slice(w.start, w.start + w.len)
            .split("")
            .map((ch, k) => (
              <span key={k} className={`tr-flap${ch === target[w.start + k] ? " is-set" : ""}`}>
                {ch === " " ? " " : ch}
              </span>
            ))}
        </span>
      ))}
    </span>
  );
}

function Row({ item, i }) {
  const ref = useRef(null);
  const [go, setGo] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setGo(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <li ref={ref} className={`tr-board__row${go ? " is-on" : ""}`}>
      <span className="tr-board__no ax-num">{String(i + 1).padStart(2, "0")}</span>
      <div className="tr-board__reason">
        <h3 className="sr-only">{item.title}</h3>
        <Flaps text={item.title} go={go} delay={120} />
      </div>
      <div className="tr-board__note">
        <span className="sr-only">{item.subtitle}</span>
        <Flaps text={item.subtitle} go={go} delay={420} />
      </div>
      <p className="tr-board__desc">{item.desc}</p>
    </li>
  );
}

const WhyChooseSection = () => {
  return (
    <section id="stop-board" className="tr-boardroom" aria-labelledby="why-title">
      <div className="ax-container">
        <div className="tr-head tr-head--split">
          <div className="tr-head">
            <p className="tr-sign"><span className="tr-sign__num">07</span>Departures board</p>
            <h2 id="why-title" className="tr-h2">Why Leading Brands Choose Aicyro</h2>
          </div>
        </div>

        <div className="tr-board">
          <div className="tr-board__bar" aria-hidden="true">
            <span>Departures</span>
            <span className="tr-board__clock">Aicyro studio</span>
          </div>
          <div className="tr-board__cols" aria-hidden="true">
            <span>No.</span>
            <span>Reason</span>
            <span>Detail</span>
          </div>
          <ol className="tr-board__rows">
            {reasons.map((item, i) => (
              <Row key={item.title} item={item} i={i} />
            ))}
          </ol>
        </div>
      </div>
      <div className="ax-container hm-why__clients">
        <ClientLoo />
      </div>
    </section>
  );
};

export default WhyChooseSection;
