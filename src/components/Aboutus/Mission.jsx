import React from "react";
import { ShieldCheck, Zap } from "lucide-react";

// Hallmark redesign: Split. Who we are on the left (head, line, the two values),
// the commitment set large in a well on the right.
const MissionSplit = () => {
  return (
    <section className="ax-section" aria-labelledby="mission-title">
      <div className="ax-container ax-split ax-split--even about-mission">
        <div className="grid gap-6" data-reveal>
          <h2 id="mission-title" className="ax-h2">
            Engineering meaningful digital transformation.
          </h2>

          <p className="ax-body">
            In a world of rapid technological change, stability is our currency.
            We exist to provide the engineering rigor required to build platforms
            that last, scale, and perform under pressure.
          </p>

          {/* Core values */}
          <ul className="about-values" aria-label="Core values">
            <li>
              <ShieldCheck size={20} aria-hidden="true" />
              <span>Security First Mindset</span>
            </li>
            <li>
              <Zap size={20} aria-hidden="true" />
              <span>Performance Optimization</span>
            </li>
          </ul>
        </div>

        <div className="ax-well about-commitment" data-reveal style={{ "--i": 1 }}>
          <h3 className="ax-h3">Our Commitment</h3>
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
