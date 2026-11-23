import React from "react";
import { ShieldCheck, Cpu, Target, BadgeCheck } from "lucide-react";

const WHY_POINTS = [
  {
    icon: ShieldCheck,
    title: "Security-First Mindset",
    description: "We don’t treat security as an afterthought. From architecture to deployment, every line of code is written with rigorous compliance and data protection protocols baked in."
  },
  {
    icon: Cpu,
    title: "AI-Native Solutions",
    description: "We leverage cutting-edge Large Language Models and automation agents to build intelligent systems that adapt, learn, and optimize themselves over time."
  },
  {
    icon: Target,
    title: "Business-Aligned Delivery",
    description: "We speak code, but we think in ROI. Every technical decision we make is directly mapped to your specific business KPIs, ensuring tangible value from day one."
  }
];

// Aurora redesign: a centred head over a bento of icon cards. The first point is a
// tall feature card; the other two stack beside it with the icon next to the text.
const WhyAicyro = () => {
  return (
    <section className="ax-band" aria-labelledby="why-title">
      <div className="ax-container">
        <div className="ax-head ax-head--center">
          <p className="ax-eyebrow">
            <BadgeCheck aria-hidden="true" />
            What sets us apart
          </p>
          <h2 id="why-title" className="ax-h2">
            Why <span className="ax-gradient-text">Aicyro</span>?
          </h2>
        </div>

        <ul className="ax-bento about-why">
          {WHY_POINTS.map((item, index) => (
            <li
              key={index}
              className={
                index === 0
                  ? "ax-card ax-card--hover ax-span-5 ax-row-2 about-why__feature"
                  : "ax-card ax-card--hover ax-span-7 about-why__item"
              }
              data-reveal
              style={{ "--i": index }}
            >
              <span className={index === 0 ? "ax-icon-tile ax-icon-tile--solid" : "ax-icon-tile"}>
                <item.icon aria-hidden="true" />
              </span>
              <div className="about-why__text">
                <h3 className="ax-h3">{item.title}</h3>
                <p className="ax-body">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default WhyAicyro;
