"use client";

// The Tour · the route map. A metro-style line of stops fixed to the right edge of the home
// page: a filled stop marks where you are ("You are here"), and any stop takes you there.
// Worked out from the layout on every scroll, so stops that swap their element after their
// data loads are still found. Wide screens only; put away at the footer.
import React, { useEffect, useState } from "react";

export const STOPS = [
  { id: "stop-entrance", n: "01", label: "Entrance" },
  { id: "stop-hall", n: "02", label: "Exhibition hall" },
  { id: "stop-wall", n: "03", label: "Manifesto wall" },
  { id: "stop-walkway", n: "04", label: "Moving walkway" },
  { id: "stop-archive", n: "05", label: "The archive" },
  { id: "stop-desk", n: "06", label: "Information desk" },
  { id: "stop-board", n: "07", label: "Departures board" },
  { id: "stop-guestbook", n: "08", label: "Guestbook" },
  { id: "stop-exit", n: "09", label: "Exit" },
];

export default function TourMap() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let now = 0;
      STOPS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= mid) now = i;
      });
      setCurrent((c) => (c === now ? c : now));
      const foot = document.querySelector(".ax-foot");
      const atFoot = foot ? foot.getBoundingClientRect().top < window.innerHeight * 0.6 : false;
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
    <nav
      className={`tr-map${visible ? " is-on" : ""}`}
      aria-label="Stops on this page"
      style={{ "--done": current / (STOPS.length - 1) }}
    >
      <span className="tr-map__line" aria-hidden="true"><i /></span>
      <ol>
        {STOPS.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => go(s.id)}
              aria-current={i === current ? "location" : undefined}
              className={`tr-map__stop${i < current ? " is-past" : ""}`}
            >
              <span className="tr-map__dot" aria-hidden="true" />
              <span className="tr-map__label">
                <span className="tr-map__n ax-num">{s.n}</span>
                {s.label}
                {i === current && <span className="tr-map__here">You are here</span>}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
