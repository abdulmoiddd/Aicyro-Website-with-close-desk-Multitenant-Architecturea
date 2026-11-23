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

// Hallmark redesign: Steps. A real ordered list of the five stages across the width.
const ProcessPipeline = () => {
  return (
    <section className="ax-section svc-process" aria-labelledby="process-title">
      <div className="ax-container">
        <div className="ax-head ax-head--split">
          <h2 id="process-title" className="ax-h2">
            The Engineering Workflow
          </h2>
          <p className="ax-lead">
            From initial concept to global scale, our process is designed for transparency, velocity, and
            uncompromised quality.
          </p>
        </div>

        <ol className="svc-process__list">
          {PROCESS_STEPS.map((step, index) => (
            <li key={step.id} data-reveal style={{ "--i": index }}>
              <h3 className="ax-h3">{step.title}</h3>
              <p className="ax-body">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ProcessPipeline;
