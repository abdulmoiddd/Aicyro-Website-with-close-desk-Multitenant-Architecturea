"use client";

// Hallmark redesign: rows (the client logos follow as its foot). The head on four columns beside five hairline rows,
// each reason with its short line beneath the title and the detail beside it.
import React from "react";
import ClientLoo from "./clienlogos";

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
    <section className="hm-section-xl hm-why" aria-labelledby="why-title">
      <div className="ax-container ax-split ax-split--wide hm-why__grid">
        <div className="ax-head hm-why__head">
          <p className="ax-eyebrow"><b>07</b> Why Aicyro</p>
          <h2 id="why-title" className="ax-h2">
            Why Leading Brands Choose Aicyro
          </h2>
        </div>

        <ul className="ax-rows">
          {reasons.map((item, index) => (
            <li key={index} data-reveal style={{ "--i": index }}>
              <div>
                <h3 className="ax-h3">{item.title}</h3>
                <p className="ax-meta hm-why__sub">{item.subtitle}</p>
              </div>
              <p className="ax-body">{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="ax-container hm-why__clients">
        <ClientLoo />
      </div>
    </section>
  );
};

export default WhyChooseSection;
