import React from "react";
import { ShieldCheck, Zap, Quote } from "lucide-react";

// Obsidian redesign: 01 / Mission. Who we are on the left (head, line, the two
// values as glass pills), the commitment set large in a glass card on the right,
// its border glow following the pointer.
const trackGlow = (e) => {
  const card = e.currentTarget;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - r.left}px`);
  card.style.setProperty("--my", `${e.clientY - r.top}px`);
};

const MissionSplit = () => {
  return (
    <section className="ab-section" aria-labelledby="mission-title">
      <div className="ax-container ab-mission">
        <div className="ab-mission__copy">
          <p className="ob-eyebrow" data-reveal>
            01 / Mission
          </p>
          <h2 id="mission-title" className="ax-h2" data-reveal style={{ "--i": 1 }}>
            Engineering meaningful digital transformation.
          </h2>

          <p className="ax-lead" data-reveal style={{ "--i": 2 }}>
            In a world of rapid technological change, stability is our currency.
            We exist to provide the engineering rigor required to build platforms
            that last, scale, and perform under pressure.
          </p>

          {/* Core values */}
          <ul className="ab-values" aria-label="Core values" data-reveal style={{ "--i": 3 }}>
            <li>
              <span className="ab-values__icon">
                <ShieldCheck size={18} aria-hidden="true" />
              </span>
              <span>Security First Mindset</span>
            </li>
            <li>
              <span className="ab-values__icon">
                <Zap size={18} aria-hidden="true" />
              </span>
              <span>Performance Optimization</span>
            </li>
          </ul>
        </div>

        <div className="ob-card ab-commit" onPointerMove={trackGlow} data-reveal style={{ "--i": 2 }}>
          <div className="ab-commit__top">
            <h3 className="ab-label">Our Commitment</h3>
            <Quote size={28} className="ab-commit__mark" aria-hidden="true" />
          </div>
          <blockquote>
            <p>
              “To deliver engineering excellence that lets our clients scale
              without technical debt, ensuring that every line of code serves a
              business purpose.”
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default MissionSplit;
