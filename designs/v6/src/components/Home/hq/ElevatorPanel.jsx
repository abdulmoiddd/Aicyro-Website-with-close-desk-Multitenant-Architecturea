"use client";

// HQ tour · the lift panel. Fixed to the right edge of the home page on wide screens: a
// floor display shows the floor you are on and its name, and a column of round lift
// buttons (09 at the top, 01 at the bottom) takes you to any floor. Worked out from the
// layout on every scroll; put away at the footer.
import React, { useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export const FLOORS = [
  { id: "hq-lobby", label: "Entrance" },
  { id: "hq-floor", label: "Product floor" },
  { id: "hq-war", label: "War room" },
  { id: "hq-line", label: "Delivery line" },
  { id: "hq-showroom", label: "Showroom" },
  { id: "hq-desk", label: "Help desk" },
  { id: "hq-culture", label: "Culture wall" },
  { id: "hq-lounge", label: "Client lounge" },
  { id: "hq-exit", label: "Exit" },
];

export default function ElevatorPanel() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    let lastY = window.scrollY;
    const measure = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let now = 0;
      FLOORS.forEach((f, i) => {
        const el = document.getElementById(f.id);
        if (el && el.getBoundingClientRect().top <= mid) now = i;
      });
      setCurrent((c) => (c === now ? c : now));
      const y = window.scrollY;
      if (Math.abs(y - lastY) > 2) {
        const d = y > lastY ? 1 : -1;
        setDir((v) => (v === d ? v : d));
        lastY = y;
      }
      const foot = document.querySelector(".ax-foot");
      const atFoot = foot ? foot.getBoundingClientRect().top < window.innerHeight * 0.7 : false;
      const on = window.scrollY > window.innerHeight * 0.5 && !atFoot;
      setVisible((v) => (v === on ? v : on));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const go = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (window.__wkLenis && !reduce) {
      window.__wkLenis.scrollTo(el, { duration: 1.6 });
      return;
    }
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <nav className={`hq-elevator${visible ? " is-on" : ""}`} aria-label="Floors on this page">
      <div className="hq-elevator__display" aria-hidden="true">
        {dir > 0 ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        <span className="hq-elevator__num">{String(current + 1).padStart(2, "0")}</span>
        <span className="hq-elevator__name">{FLOORS[current].label}</span>
      </div>
      <ol className="hq-elevator__buttons">
        {FLOORS.map((f, i) => ({ f, i }))
          .reverse()
          .map(({ f, i }) => (
            <li key={f.id}>
              <button
                type="button"
                onClick={() => go(f.id)}
                aria-current={i === current ? "location" : undefined}
                aria-label={`Floor ${i + 1}: ${f.label}`}
                className="hq-elevator__btn"
              >
                {String(i + 1).padStart(2, "0")}
                <span className="hq-elevator__tip" aria-hidden="true">{f.label}</span>
              </button>
            </li>
          ))}
      </ol>
    </nav>
  );
}
