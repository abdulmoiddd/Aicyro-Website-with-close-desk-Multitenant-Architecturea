import React from "react";
import { ShieldCheck, Zap, Target } from "lucide-react";

// Redesign v3 (Aurora Studio): the story as a split. The eyebrow, heading and line
// on the left; the two core values as glass cards in a lit frame on the right.
// "Our Commitment" is exported as a card and shown beside the vision in the
// mission-and-vision bento (vision.jsx); its words still live here.
const MissionSplit = () => {
  return (
    <section className="ax-section" aria-labelledby="mission-title">
      <div className="ax-container ax-split ax-split--even ab-story">
        <div className="ab-story__copy" data-reveal>
          <p className="ax-eyebrow">
            <span>Our story</span>
          </p>
          <h2 id="mission-title" className="ax-h2">
            Engineering meaningful{" "}
            <span className="ax-grad">digital transformation.</span>
          </h2>

          <p className="ax-lead">
            In a world of rapid technological change, stability is our currency.
            We exist to provide the engineering rigor required to build platforms
            that last, scale, and perform under pressure.
          </p>
        </div>

        <div className="ab-story__visual" data-reveal style={{ "--i": 1 }}>
          <span className="ax-gridbg" aria-hidden="true" />
          <span className="ab-orb" aria-hidden="true" />
          {/* Core values */}
          <ul className="ab-values" aria-label="Core values">
            <li className="ax-card ax-spot">
              <span className="ax-icon-tile ax-icon-tile--solid">
                <ShieldCheck aria-hidden="true" />
              </span>
              <span className="ab-values__title">Security First Mindset</span>
            </li>
            <li className="ax-card ax-spot">
              <span className="ax-icon-tile ax-icon-tile--solid">
                <Zap aria-hidden="true" />
              </span>
              <span className="ab-values__title">Performance Optimization</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

// The commitment, as the first large card of the mission-and-vision bento
export const MissionCommitmentCard = () => {
  return (
    <li className="ax-card ax-spot is-half" data-reveal>
      <div className="ab-pillar__top">
        <span className="ax-chip">
          <Target size={14} aria-hidden="true" />
          Mission
        </span>
        <h2 className="ax-h3">Our Commitment</h2>
      </div>
      <blockquote className="ab-pillar__quote">
        <p>
          “To deliver engineering excellence that lets our clients scale
          without technical debt, ensuring that every line of code serves a
          business purpose.”
        </p>
      </blockquote>
    </li>
  );
};

export default MissionSplit;
