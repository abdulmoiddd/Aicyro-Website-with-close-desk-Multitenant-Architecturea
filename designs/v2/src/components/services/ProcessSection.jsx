import React from "react";
import { Search, PenTool, Code2, ShieldCheck, TrendingUp } from "lucide-react";

const PROCESS_STEPS = [
  {
    id: 1,
    title: "Discovery",
    description: "Analyzing goals, requirements, and identifying potential bottlenecks.",
    icon: Search,
  },
  {
    id: 2,
    title: "Design",
    description: "Architecting scalable systems and crafting intuitive UX workflows.",
    icon: PenTool,
  },
  {
    id: 3,
    title: "Build",
    description: "Agile development cycles producing clean, maintainable code.",
    icon: Code2,
  },
  {
    id: 4,
    title: "Secure",
    description: "Rigorous penetration testing and automated security hardening.",
    icon: ShieldCheck,
  },
  {
    id: 5,
    title: "Scale",
    description: "Global deployment, real-time monitoring, and optimization.",
    icon: TrendingUp,
  },
];

// Redesign v3 (Aurora Studio): a numbered timeline. A real ordered list of the five
// stages joined by a gradient rail; each stage a card with its number and icon.
const ProcessPipeline = () => {
  return (
    <section className="ax-band svc-process" aria-labelledby="process-title">
      <div className="ax-container">
        <div className="ax-head ax-head--center" data-reveal>
          <p className="ax-eyebrow">
            <span>How we work</span>
          </p>
          <h2 id="process-title" className="ax-h2">
            The <span className="ax-grad">Engineering Workflow</span>
          </h2>
          <p className="ax-lead">
            From initial concept to global scale, our process is designed for transparency, velocity, and
            uncompromised quality.
          </p>
        </div>

        <ol className="svc-process__list">
          {PROCESS_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.id} data-reveal style={{ "--i": index }}>
                <span className="ax-icon-tile ax-icon-tile--solid svc-process__dot" aria-hidden="true">
                  <Icon />
                </span>
                <div className="ax-card ax-spot svc-process__card">
                  <span className="svc-process__n ax-num" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="ax-h3">{step.title}</h3>
                  <p className="ax-body">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default ProcessPipeline;
