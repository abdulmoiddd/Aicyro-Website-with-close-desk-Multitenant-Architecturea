import React, { useRef } from "react";
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

// Obsidian redesign: 03 / Why Aicyro. The head over three glass cards (icon tile,
// mono index, title, the line that backs it); one pointer glow runs across the row.
const WhyAicyro = () => {
  const gridRef = useRef(null);

  const onPointerMove = (e) => {
    const grid = gridRef.current;
    if (!grid) return;
    grid.querySelectorAll(".ob-card").forEach((card) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  };

  return (
    <section id="why" className="ab-section ab-why" aria-labelledby="why-title">
      <div className="ax-container">
        <div className="ab-head">
          <p className="ob-eyebrow" data-reveal>
            03 / Why Aicyro
          </p>
          <h2 id="why-title" className="ax-h2" data-reveal style={{ "--i": 1 }}>
            Why Aicyro?
          </h2>
        </div>

        <ul ref={gridRef} className="ab-why__grid" onPointerMove={onPointerMove}>
          {WHY_POINTS.map((item, index) => (
            <li key={index} className="ob-card ab-why__card" data-reveal style={{ "--i": index }}>
              <div className="ab-why__top">
                <span className="ab-icon">
                  <item.icon size={22} aria-hidden="true" />
                </span>
                <span className="ab-index" aria-hidden="true">
                  0{index + 1}
                </span>
              </div>
              <div className="ab-why__copy">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default WhyAicyro;
