import React from "react";
import { Search, PenTool, Code2, ShieldCheck, TrendingUp } from "lucide-react";
import { pad } from "./glow";

export const PROCESS_STEPS = [
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

// Obsidian: a real ordered list of the five stages on one rail. Wide screens run them
// across the width (a node per stage on a horizontal rail); narrower screens stack them
// on a vertical rail. Each stage: large numeral, its icon, title and line.
const ProcessPipeline = () => {
  return (
    <section id="process" className="ob-section svc-sec svc-process" aria-labelledby="process-title">
      <div className="ax-container">
        <div className="ob-head ob-head--row" data-reveal>
          <div>
            <p className="ob-eyebrow">03 / How we work</p>
            <h2 id="process-title" className="ax-h2">
              The Engineering Workflow
            </h2>
          </div>
          <p className="ax-lead">
            From initial concept to global scale, our process is designed for transparency, velocity, and
            uncompromised quality.
          </p>
        </div>

        <ol className="svc-flow">
          {PROCESS_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.id} className="svc-flow__step" data-reveal style={{ "--i": index }}>
                <span className="svc-flow__node" aria-hidden="true" />
                <div className="svc-flow__top">
                  <span className="svc-flow__num" aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                  <span className="svc-icon">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                </div>
                <h3 className="svc-flow__title">{step.title}</h3>
                <p className="svc-flow__text">{step.description}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default ProcessPipeline;
