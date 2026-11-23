"use client";

// HQ tour · the building directory, by the lifts: the technologies the studio builds with,
// listed like the tenant board in an office lobby (logo, name, a dotted leader to what it
// is for). Same list as teckstack.jsx. Rows step in as you pass.
import React from "react";
import { TECH_STACK } from "../teckstack";

const ROLE_OF = {
  "Tailwind CSS": "Frontend", MongoDB: "Data", React: "Frontend", Python: "Backend · AI", PostgreSQL: "Data",
  GitHub: "DevOps", JavaScript: "Frontend", PyTorch: "AI", TensorFlow: "AI", "Next.js": "Frontend", OpenAI: "AI",
};

export default function TechDirectory() {
  return (
    <section className="hq-directory" aria-labelledby="stack-title">
      <div className="ax-container">
        <div className="hq-board">
          <div className="hq-board__head">
            <p className="hq-board__kicker">Building directory</p>
            <h2 id="stack-title" className="hq-board__title">Technologies we build with</h2>
          </div>
          <ul className="hq-board__list">
            {TECH_STACK.map((t, i) => (
              <li key={t.name} data-reveal style={{ "--i": i % 6 }}>
                <span className="hq-board__logo">{t.component}</span>
                <span className="hq-board__name">{t.name}</span>
                <span className="hq-board__dots" aria-hidden="true" />
                <span className="hq-board__floor">{ROLE_OF[t.name] || "Engineering"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
