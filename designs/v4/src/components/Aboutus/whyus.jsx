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

// Hallmark redesign: Rows. The head on four columns beside three hairline rows,
// each a title with its inline icon and the line that backs it.
const WhyAicyro = () => {
  return (
    <section className="ax-section" aria-labelledby="why-title">
      <div className="ax-container ax-split ax-split--wide about-why">
        <h2 id="why-title" className="ax-h2">
          Why Aicyro?
        </h2>

        <ul className="ax-rows">
          {WHY_POINTS.map((item, index) => (
            <li key={index} data-reveal style={{ "--i": index }}>
              <h3 className="ax-h3 about-why__title">
                <item.icon size={24} aria-hidden="true" />
                <span>{item.title}</span>
              </h3>
              <p className="ax-body">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default WhyAicyro;
