"use client";

// Hallmark redesign: steps. The four real stages across as a numbered list (a real
// <ol> counted in CSS); each opens its full description beneath, one at a time, so
// every word stays and the screen carries one stage at a time. The first is open
// without script.
import React, { useState } from "react";

const steps = [
  {
    id: "01",
    title: "Discovery & Strategy",
    desc: "We dive deep into your business goals, user personas, and technical requirements to build a roadmap that ensures success from Day 1.",
  },
  {
    id: "02",
    title: "Design & Architecture",
    desc: "Our architects design scalable cloud systems while our designers create intuitive, high-converting UI/UX prototypes. This serves as the unshakeable blueprint for your product.",
  },
  {
    id: "03",
    title: "Agile Development & QA",
    desc: "We execute in rapid 2-week sprints. Continuous Integration (CI/CD) and automated testing mean you get bug-free features delivered faster, keeping you ahead of the market.",
  },
  {
    id: "04",
    title: "Launch & Long-Term Scale",
    desc: "We monitor performance 24/7, optimize infrastructure costs, and provide ongoing support to scale your user base securely.",
  }
];

const ProcessSection = () => {
  const [active, setActive] = useState(0);

  const onKeyDown = (event, index) => {
    const last = steps.length - 1;
    let next = null;
    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    document.getElementById(`step-tab-${steps[next].id}`)?.focus();
  };

  const current = steps[active];

  return (
    <section className="ax-section" aria-labelledby="process-title">
      <div className="ax-container">
        <div className="ax-head ax-head--split">
          <div className="ob-head">
            <p className="ob-eyebrow">04 / Process</p>
            <h2 id="process-title" className="ax-h2">The Aicyro Blueprint</h2>
          </div>
          <p className="ax-lead">
            A battle-tested workflow designed to eliminate risk and deliver high-performance software on time and on budget.
          </p>
        </div>

        <ol className="hm-steps" role="tablist" aria-label="The four stages">
          {steps.map((step, index) => (
            <li key={step.id} role="presentation">
              <button
                type="button"
                role="tab"
                id={`step-tab-${step.id}`}
                aria-selected={active === index}
                aria-controls="step-panel"
                tabIndex={active === index ? 0 : -1}
                className="hm-step"
                onClick={() => setActive(index)}
                onKeyDown={(e) => onKeyDown(e, index)}
              >
                <span className="hm-step__num" aria-hidden="true">0{index + 1}</span>
                <span className="hm-step__title">{step.title}</span>
              </button>
            </li>
          ))}
        </ol>

        <div
          id="step-panel"
          role="tabpanel"
          aria-labelledby={`step-tab-${current.id}`}
          className="hm-steps__panel"
        >
          {/* The active tab already names the step; the panel carries only its line */}
          <p className="ax-lead">{current.desc}</p>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
