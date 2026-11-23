import React from "react";
import { ShieldCheck, Zap, Target, Quote } from "lucide-react";

// Aurora redesign: the mission as a tinted card (paired with the vision card in
// pages/about.jsx), and the commitment as a wide statement card beneath the pair.
// Both sit in the about page's mission-and-vision bento.
const MissionSplit = () => {
  return (
    <article
      className="ax-card ax-card--tint ax-span-6 about-mv__card"
      aria-labelledby="mission-title"
      data-reveal
    >
      <p className="ax-eyebrow">
        <Target aria-hidden="true" />
        Our mission
      </p>

      <h2 id="mission-title" className="about-mv__title">
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
          <span className="ax-icon-tile">
            <ShieldCheck aria-hidden="true" />
          </span>
          <span>Security First Mindset</span>
        </li>
        <li>
          <span className="ax-icon-tile">
            <Zap aria-hidden="true" />
          </span>
          <span>Performance Optimization</span>
        </li>
      </ul>
    </article>
  );
};

export const Commitment = () => {
  return (
    <figure className="ax-panel ax-span-12 about-commitment" data-reveal style={{ "--i": 2 }}>
      <div className="about-commitment__head">
        <span className="ax-icon-tile ax-icon-tile--solid">
          <Quote aria-hidden="true" />
        </span>
        <h2 className="ax-h3">Our Commitment</h2>
      </div>
      <blockquote>
        <p>
          “To deliver engineering excellence that lets our clients scale
          without technical debt, ensuring that every line of code serves a
          business purpose.”
        </p>
      </blockquote>
    </figure>
  );
};

export default MissionSplit;
