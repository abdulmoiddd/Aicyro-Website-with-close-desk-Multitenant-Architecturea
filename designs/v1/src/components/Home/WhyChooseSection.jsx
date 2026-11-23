"use client";

// Aurora redesign: the head (sticky on wide screens) beside five reason cards, each
// with its icon, title, short line and detail; the client logos now sit at the foot of the hero.
import React from "react";
import Link from "next/link";
import { ArrowRight, Award, BarChart3, Cpu, MessagesSquare, ShieldCheck, Target } from "lucide-react";

const reasons = [
  {
    title: "Expert Engineers",
    subtitle: "AI + Cloud Native",
    desc: "We don’t outsource. Our team combines deep AI expertise with modern cloud engineering.",
    Icon: Cpu,
  },
  {
    title: "Business-First Approach",
    subtitle: "ROI > Code",
    desc: "Every line of code is written with your revenue and growth goals in mind.",
    Icon: Target,
  },
  {
    title: "Secure & Scalable",
    subtitle: "Enterprise Grade",
    desc: "We embed security best practices from Day 1 to protect your data and reputation.",
    Icon: ShieldCheck,
  },
  {
    title: "Transparent Communication",
    subtitle: "No Black Boxes",
    desc: "Expect clear timelines, honest updates, and direct access to your project lead.",
    Icon: MessagesSquare,
  },
  {
    title: "Proven Results",
    subtitle: "Across Industries",
    desc: "From FinTech to Healthcare, we have a track record of delivering complex software.",
    Icon: BarChart3,
  }
];

const WhyChooseSection = () => {
  return (
    <section className="ax-section hm-why" aria-labelledby="why-title">
      <div className="ax-container ax-split ax-split--wide hm-why__grid">
        <div className="hm-why__head">
          <p className="ax-eyebrow">
            <Award aria-hidden="true" />
            Why Aicyro
          </p>
          <h2 id="why-title" className="ax-h2">
            Why Leading Brands Choose <span className="ax-gradient-text">Aicyro</span>
          </h2>
          <Link href="/about" className="ax-link">
            About the studio
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <ul className="ax-rows">
          {reasons.map((item, index) => (
            <li key={index} data-reveal style={{ "--i": index }}>
              <span className="ax-icon-tile">
                <item.Icon aria-hidden="true" />
              </span>
              <div>
                <h3 className="ax-h3">{item.title}</h3>
                <p className="ax-meta hm-why__sub">{item.subtitle}</p>
              </div>
              <p className="ax-body">{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default WhyChooseSection;
