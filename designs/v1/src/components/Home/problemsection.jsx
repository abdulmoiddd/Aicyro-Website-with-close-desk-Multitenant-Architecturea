"use client";

// Aurora redesign: a centred head, the five pains as a bento of cards, then the
// answer on a tinted card with the one way forward (contact).
import React from "react";
import Link from "next/link";
import { Clock, Users, Activity, ShieldAlert, BrainCircuit, ArrowRight, Target } from "lucide-react";

const problems = [
  {
    icon: <Clock size={20} aria-hidden="true" />,
    title: "Projects going over budget or deadline",
    desc: "Missed milestones and creeping costs killing your momentum."
  },
  {
    icon: <Users size={20} aria-hidden="true" />,
    title: "Difficulty finding the right technical team",
    desc: "Sifting through freelancers who don’t understand your vision."
  },
  {
    icon: <Activity size={20} aria-hidden="true" />,
    title: "Poor performance & scalability issues",
    desc: "Apps that crash or lag when your user base starts to grow."
  },
  {
    icon: <ShieldAlert size={20} aria-hidden="true" />,
    title: "Security and compliance concerns",
    desc: "Vulnerabilities that put your user data and business at risk."
  },
  {
    icon: <BrainCircuit size={20} aria-hidden="true" />,
    title: "Lack of AI expertise in execution",
    desc: "Falling behind competitors who are leveraging AI effectively."
  }
];

const ProblemSection = () => {
  return (
    <section className="ax-section" aria-labelledby="problem-title">
      <div className="ax-container">
        <div className="ax-head ax-head--center">
          <p className="ax-eyebrow">
            <Target aria-hidden="true" />
            Sound familiar?
          </p>
          <h2 id="problem-title" className="ax-h2">
            Struggling to Build Reliable Software That Actually Drives Business Growth?
          </h2>
        </div>

        <ul className="ax-bento hm-pains">
          {problems.map((item, index) => (
            <li
              key={index}
              className={`ax-card ${index < 3 ? "ax-span-4" : "ax-span-6"}`}
              data-reveal
              style={{ "--i": index }}
            >
              <span className="ax-icon-tile">{item.icon}</span>
              <h3 className="ax-h3">{item.title}</h3>
              <p className="ax-body">{item.desc}</p>
            </li>
          ))}
        </ul>

        <div className="hm-answer" data-reveal>
          <h3 className="hm-answer__title">
            That’s where <span className="ax-gradient-text">Aicyro</span> comes in.
          </h3>
          <div className="hm-answer__body">
            <p className="ax-lead">
              We build software designed specifically for your growth stage.
            </p>
            <Link href="/contact" className="ax-btn">
              Start Building with Aicyro
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
