"use client";

// HQ tour · floor 07, the culture wall (why Aicyro).
// The five reasons hang as framed values on the wall of the team area: a large frame for
// the first, four beside it, each with its number, icon and tag. The frames step out as
// you reach them and lift on hover. The client logos follow as "teams we have built for".
// Same five reasons as before.
import React from "react";
import { Users, Target, ShieldCheck, MessagesSquare, TrendingUp } from "lucide-react";
import ClientLoo from "./clienlogos";

const reasons = [
  { title: "Expert Engineers", subtitle: "AI + Cloud Native", desc: "We don’t outsource. Our team combines deep AI expertise with modern cloud engineering.", icon: Users },
  { title: "Business-First Approach", subtitle: "ROI > Code", desc: "Every line of code is written with your revenue and growth goals in mind.", icon: Target },
  { title: "Secure & Scalable", subtitle: "Enterprise Grade", desc: "We embed security best practices from Day 1 to protect your data and reputation.", icon: ShieldCheck },
  { title: "Transparent Communication", subtitle: "No Black Boxes", desc: "Expect clear timelines, honest updates, and direct access to your project lead.", icon: MessagesSquare },
  { title: "Proven Results", subtitle: "Across Industries", desc: "From FinTech to Healthcare, we have a track record of delivering complex software.", icon: TrendingUp },
];

const WhyChooseSection = () => {
  return (
    <section id="hq-culture" className="hq-section hq-culture" aria-labelledby="why-title">
      <div className="ax-container">
        <div className="hq-head">
          <p className="hq-floor-label"><span>07</span> Culture wall</p>
          <h2 id="why-title" className="hq-h2">Why Leading Brands Choose Aicyro</h2>
        </div>

        <ul className="hq-frames">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <li key={r.title} className={`hq-frame hq-frame--${i + 1}`} data-reveal style={{ "--i": i }}>
                <div className="hq-frame__art">
                  <div className="hq-frame__top">
                    <span className="hq-frame__icon"><Icon size={20} aria-hidden="true" /></span>
                    <span className="hq-frame__no">Value {String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="hq-frame__title">{r.title}</h3>
                  <p className="hq-frame__desc">{r.desc}</p>
                  <p className="hq-tag">{r.subtitle}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="ax-container hm-why__clients">
        <ClientLoo />
      </div>
    </section>
  );
};

export default WhyChooseSection;
