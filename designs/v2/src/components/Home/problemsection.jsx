"use client";

// Redesign v3: the question pinned beside five pain cards, then the answer as a
// glowing card with the one way forward (contact).
import React from "react";
import Link from "next/link";
import { Clock, Users, Activity, ShieldAlert, BrainCircuit, ArrowRight, Sparkles } from "lucide-react";

const problems = [
  {
    icon: <Clock aria-hidden="true" />,
    title: "Projects going over budget or deadline",
    desc: "Missed milestones and creeping costs killing your momentum."
  },
  {
    icon: <Users aria-hidden="true" />,
    title: "Difficulty finding the right technical team",
    desc: "Sifting through freelancers who don’t understand your vision."
  },
  {
    icon: <Activity aria-hidden="true" />,
    title: "Poor performance & scalability issues",
    desc: "Apps that crash or lag when your user base starts to grow."
  },
  {
    icon: <ShieldAlert aria-hidden="true" />,
    title: "Security and compliance concerns",
    desc: "Vulnerabilities that put your user data and business at risk."
  },
  {
    icon: <BrainCircuit aria-hidden="true" />,
    title: "Lack of AI expertise in execution",
    desc: "Falling behind competitors who are leveraging AI effectively."
  }
];

const ProblemSection = () => {
  return (
    <section className="ax-section hm-problem-sec" aria-labelledby="problem-title">
      <div className="ax-container">
        <div className="hm-problem">
          <div className="hm-problem__head">
            <p className="ax-eyebrow">
              <span>The problem</span>
            </p>
            <h2 id="problem-title" className="ax-h2">
              Struggling to Build Reliable Software That <span className="ax-grad">Actually Drives Business Growth?</span>
            </h2>
          </div>

          <ul className="hm-pains">
            {problems.map((item, index) => (
              <li key={index} className="ax-card ax-spot" data-reveal style={{ "--i": index }}>
                <span className="ax-icon-tile">{item.icon}</span>
                <h3 className="ax-h3">{item.title}</h3>
                <p className="ax-body">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="hm-answer" data-reveal>
          <span className="ax-icon-tile ax-icon-tile--solid" aria-hidden="true">
            <Sparkles />
          </span>
          <div className="hm-answer__copy">
            <h3 className="hm-answer__title">That’s where Aicyro comes in.</h3>
            <p className="ax-lead">We build software designed specifically for your growth stage.</p>
          </div>
          <Link href="/contact" className="ax-btn">
            Start Building with Aicyro
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
