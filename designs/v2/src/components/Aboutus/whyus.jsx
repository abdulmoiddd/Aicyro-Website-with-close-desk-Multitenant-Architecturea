import React from "react";
import { ShieldCheck, Cpu, Target } from "lucide-react";

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

// Redesign v3 (Aurora Studio): why us as an icon card grid. A centred head, then
// three spotlight cards, each an icon tile, its title and the line that backs it.
const WhyAicyro = () => {
  return (
    <section className="ax-section" aria-labelledby="why-title">
      <div className="ax-container">
        <div className="ax-head ax-head--center" data-reveal>
          <p className="ax-eyebrow">
            <span>Why us</span>
          </p>
          <h2 id="why-title" className="ax-h2">
            Why <span className="ax-grad">Aicyro?</span>
          </h2>
        </div>

        <ul className="ax-bento ab-why">
          {WHY_POINTS.map((item, index) => (
            <li key={index} className="ax-card ax-spot" data-reveal style={{ "--i": index }}>
              <span className="ab-why__num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="ax-icon-tile">
                <item.icon aria-hidden="true" />
              </span>
              <h3 className="ax-h3">{item.title}</h3>
              <p className="ax-body">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default WhyAicyro;
