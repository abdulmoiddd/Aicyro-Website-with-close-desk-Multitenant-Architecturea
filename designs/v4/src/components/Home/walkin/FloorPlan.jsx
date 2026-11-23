"use client";

// Walk-in · the floor plan. A fixed column of room numbers on the right edge of the home
// page that shows where you are in the building and takes you to any room. It also
// writes the current room onto the page wrapper (data-room) so the ambient light can
// change colour from room to room, and moves a soft spotlight with the pointer.
// Hidden on narrow screens; the spotlight is off on touch and under reduced motion.
import React, { useEffect, useState } from "react";

export const ROOMS = [
  { id: "room-doorway", n: "01", label: "The doorway" },
  { id: "room-gallery", n: "02", label: "The gallery" },
  { id: "room-problem", n: "03", label: "The problem" },
  { id: "room-blueprint", n: "04", label: "The blueprint" },
  { id: "room-work", n: "05", label: "The work" },
  { id: "room-planning", n: "06", label: "The planning room" },
  { id: "room-why", n: "07", label: "Why Aicyro" },
  { id: "room-voices", n: "08", label: "Voices" },
  { id: "room-exit", n: "09", label: "The way out" },
];

export default function FloorPlan({ wrapperRef }) {
  const [current, setCurrent] = useState("01");
  const [visible, setVisible] = useState(false);

  // Which room is under the middle of the screen. Read from the layout on every scroll
  // (not cached), because some rooms swap their element once their data loads.
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let now = ROOMS[0].n;
      for (const r of ROOMS) {
        const el = document.getElementById(r.id);
        if (el && el.getBoundingClientRect().top <= mid) now = r.n;
      }
      setCurrent((c) => (c === now ? c : now));
      // Shown once you are past the doorway, put away again at the footer
      const foot = document.querySelector(".ax-foot");
      const atFoot = foot ? foot.getBoundingClientRect().top < window.innerHeight * 0.6 : false;
      const on = window.scrollY > window.innerHeight * 0.6 && !atFoot;
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

  useEffect(() => {
    wrapperRef?.current?.setAttribute("data-room", current);
  }, [current, wrapperRef]);

  // The spotlight follows the pointer (fine pointers, motion allowed)
  useEffect(() => {
    const el = wrapperRef?.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${e.clientX}px`);
        el.style.setProperty("--my", `${e.clientY}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    el.classList.add("has-spot");
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      el.classList.remove("has-spot");
    };
  }, [wrapperRef]);

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
    <nav className={`wk-plan${visible ? " is-on" : ""}`} aria-label="Rooms on this page">
      <ol>
        {ROOMS.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => go(r.id)}
              aria-current={current === r.n ? "location" : undefined}
              className="wk-plan__room"
            >
              <span className="wk-plan__label">{r.label}</span>
              <span className="wk-plan__n ax-num">{r.n}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
