"use client";

// Redesign v3: the head pinned beside a bento of the five reasons, each with an icon
// tile and its short line as a chip. (The client logos moved to the hero marquee.)
import React from "react";
import { Cpu, Target, ShieldCheck, MessagesSquare, Trophy } from "lucide-react";

const ICONS = [Cpu, Target, ShieldCheck, MessagesSquare, Trophy];

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
  }
];

const WhyChooseSection = () => {
  return (
    <section className="ax-section hm-why" aria-labelledby="why-title">
      <div className="ax-container hm-why__grid">
        <div className="hm-why__head">
          <p className="ax-eyebrow">
            <span>Why Aicyro</span>
          </p>
          <h2 id="why-title" className="ax-h2">
            Why Leading Brands <span className="ax-grad">Choose Aicyro</span>
          </h2>
        </div>

        <ul className="ax-bento hm-why__list">
          {reasons.map((item, index) => {
            const Icon = ICONS[index] || Cpu;
            return (
              <li
                key={index}
                className={`ax-card ax-spot ${index === 0 ? "is-full hm-why__lead" : "is-half"}`}
                data-reveal
                style={{ "--i": index }}
              >
                <div className="hm-why__top">
                  <span className="ax-icon-tile">
                    <Icon aria-hidden="true" />
                  </span>
                  <span className="ax-chip">{item.subtitle}</span>
                </div>
                <h3 className="ax-h3">{item.title}</h3>
                <p className="ax-body">{item.desc}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default WhyChooseSection;
