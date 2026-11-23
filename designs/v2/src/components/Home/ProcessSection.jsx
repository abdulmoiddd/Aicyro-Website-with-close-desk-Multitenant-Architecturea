"use client";

// Redesign v3: the four real stages as a connected timeline of cards. Every stage is
// visible at once (no tabs), numbered in a gradient badge, joined by a gradient rule.
import React from "react";
import { Compass, PenTool, GitBranch, Rocket } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Discovery & Strategy",
    desc: "We dive deep into your business goals, user personas, and technical requirements to build a roadmap that ensures success from Day 1.",
    icon: <Compass aria-hidden="true" />,
  },
  {
    id: "02",
    title: "Design & Architecture",
    desc: "Our architects design scalable cloud systems while our designers create intuitive, high-converting UI/UX prototypes. This serves as the unshakeable blueprint for your product.",
    icon: <PenTool aria-hidden="true" />,
  },
  {
    id: "03",
    title: "Agile Development & QA",
    desc: "We execute in rapid 2-week sprints. Continuous Integration (CI/CD) and automated testing mean you get bug-free features delivered faster, keeping you ahead of the market.",
    icon: <GitBranch aria-hidden="true" />,
  },
  {
    id: "04",
    title: "Launch & Long-Term Scale",
    desc: "We monitor performance 24/7, optimize infrastructure costs, and provide ongoing support to scale your user base securely.",
    icon: <Rocket aria-hidden="true" />,
  }
];

const ProcessSection = () => {
  return (
    <section className="ax-section" aria-labelledby="process-title">
      <div className="ax-container">
        <div className="ax-head ax-head--center">
          <p className="ax-eyebrow">
            <span>How we work</span>
          </p>
          <h2 id="process-title" className="ax-h2">
            The Aicyro <span className="ax-grad">Blueprint</span>
          </h2>
          <p className="ax-lead">
            A battle-tested workflow designed to eliminate risk and deliver high-performance software on time and on budget.
          </p>
        </div>

        <ol className="hm-steps">
          {steps.map((step, index) => (
            <li key={step.id} className="ax-card ax-spot hm-step" data-reveal style={{ "--i": index }}>
              <div className="hm-step__top">
                <span className="hm-step__num" aria-hidden="true">{step.id}</span>
                <span className="ax-icon-tile">{step.icon}</span>
              </div>
              <h3 className="ax-h3">{step.title}</h3>
              <p className="ax-body">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ProcessSection;
