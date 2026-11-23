"use client";

// HQ tour · the floor slab between two floors. A strip of the same facade as the hero
// tower: the floor number, a row of windows, and the floor's sign. The windows switch on
// one by one when the strip comes into view, so going down the page feels like going up
// the building, floor by floor. Decoration only (aria-hidden); the floors keep their own
// headings. Day/night colours come from the building tokens in hq.css.
import React, { useEffect, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";

// lit windows on each floor, in a pattern that shifts with the floor number
const KINDS = ["code", "glow", "dark", "chart", "code", "dark", "glow", "code", "chart", "glow", "dark", "code", "glow", "chart"];

export default function FloorSlab({ n, label }) {
  const ref = useRef(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setLit(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLit(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -18% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shift = Number(n) || 0;

  return (
    <div ref={ref} className="ax-container hq-slab-wrap" aria-hidden="true">
      <div className={`hq-slab${lit ? " is-lit" : ""}`}>
        <span className="hq-slab__num">{n}</span>
        <span className="hq-slab__wins">
          {KINDS.map((_, i) => {
            const kind = KINDS[(i + shift * 3) % KINDS.length];
            return <span key={i} className={`hq-win hq-win--${kind}`} style={{ "--d": `${i * 65}ms` }} />;
          })}
        </span>
        <span className="hq-slab__sign">
          <ChevronUp size={13} />
          Floor {n} · {label}
        </span>
      </div>
    </div>
  );
}
