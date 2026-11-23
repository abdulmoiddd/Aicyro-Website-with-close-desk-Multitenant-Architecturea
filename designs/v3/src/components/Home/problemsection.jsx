"use client";

// Hallmark redesign: a split. The question beside the five pains as hairline rows,
// then the answer and the one way forward (contact).
import React from "react";
import Link from "next/link";
import { Clock, Users, Activity, ShieldAlert, BrainCircuit } from "lucide-react";

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
    <section className="hm-section-xl" aria-labelledby="problem-title">
      <div className="ax-container">
        <div className="ax-split hm-problem">
          <h2 id="problem-title" className="ax-h2 hm-problem__head">
            Struggling to Build Reliable Software That Actually Drives Business Growth?
          </h2>

          <ul className="hm-pains">
            {problems.map((item, index) => (
              <li key={index} data-reveal style={{ "--i": index }}>
                {item.icon}
                <h3 className="ax-h3">{item.title}</h3>
                <p className="ax-body">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="ax-split hm-answer">
          <h3 className="hm-answer__title">That’s where Aicyro comes in.</h3>
          <div className="hm-answer__body">
            <p className="ax-lead">
              We build software designed specifically for your growth stage.
            </p>
            <Link href="/contact" className="ax-btn">
              Start Building with Aicyro
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
