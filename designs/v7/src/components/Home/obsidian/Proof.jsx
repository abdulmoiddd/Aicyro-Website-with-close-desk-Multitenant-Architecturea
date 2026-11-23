"use client";

// Obsidian home: social proof. A KPI strip that counts up once when it scrolls into view
// (the owner's figures, from the previous counter: 100+ projects, 70+ clients, 4+ years,
// 4.8 / 5 rating), the five reasons clients choose Aicyro, the CMS testimonials and the
// client logos in monochrome.
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Testimonial from "../Testimonial";
import ClientLoo from "../clienlogos";

const KPIS = [
  { value: 100, decimals: 0, suffix: "+", label: "Completed projects" },
  { value: 70, decimals: 0, suffix: "+", label: "Happy clients" },
  { value: 4, decimals: 0, suffix: "+", label: "Years of experience" },
  { value: 4.8, decimals: 1, suffix: " / 5", label: "Client ratings" },
];

const REASONS = [
  { title: "Expert Engineers", subtitle: "AI + Cloud Native", desc: "We don’t outsource. Our team combines deep AI expertise with modern cloud engineering." },
  { title: "Business-First Approach", subtitle: "ROI > Code", desc: "Every line of code is written with your revenue and growth goals in mind." },
  { title: "Secure & Scalable", subtitle: "Enterprise Grade", desc: "We embed security best practices from Day 1 to protect your data and reputation." },
  { title: "Transparent Communication", subtitle: "No Black Boxes", desc: "Expect clear timelines, honest updates, and direct access to your project lead." },
  { title: "Proven Results", subtitle: "Across Industries", desc: "From FinTech to Healthcare, we have a track record of delivering complex software." },
];

export default function Proof() {
  const stripRef = useRef(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      strip.querySelectorAll("[data-count]").forEach((el) => {
        const end = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        const counter = { v: 0 };
        el.textContent = (0).toFixed(decimals);
        gsap.to(counter, {
          v: end,
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: { trigger: strip, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = counter.v.toFixed(decimals);
          },
        });
      });
    }, strip);
    return () => ctx.revert();
  }, []);

  return (
    <section className="ob-section ob-proof" aria-labelledby="proof-title">
      <div className="ax-container">
        <div className="ob-head">
          <p className="ob-eyebrow">05 / Proof</p>
          <h2 id="proof-title" className="ax-h2">
            Why Leading Brands Choose Aicyro
          </h2>
        </div>

        <dl ref={stripRef} className="ob-kpis">
          {KPIS.map((k) => (
            <div key={k.label} className="ob-kpi">
              <dt>{k.label}</dt>
              <dd>
                <span data-count={k.value} data-decimals={k.decimals}>
                  {k.value.toFixed(k.decimals)}
                </span>
                <small>{k.suffix}</small>
              </dd>
            </div>
          ))}
        </dl>

        <ul className="ob-reasons">
          {REASONS.map((r, i) => (
            <li key={r.title} data-reveal style={{ "--i": i }}>
              <span className="ob-reasons__sub">{r.subtitle}</span>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </li>
          ))}
        </ul>
      </div>

      <Testimonial />

      <div className="ax-container ob-proof__logos">
        <ClientLoo />
      </div>
    </section>
  );
}
