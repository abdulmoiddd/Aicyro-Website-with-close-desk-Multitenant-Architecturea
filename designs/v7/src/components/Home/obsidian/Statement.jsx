"use client";

// Obsidian home: the editorial brand statement. Oversized display type whose words light
// up one by one as the section scrolls through (GSAP ScrollTrigger, scrubbed), then the
// five problems Aicyro fixes and the first action. Copy from the previous problem section
// and the CMS hero line. Words are fully visible without script and under reduced motion.
import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Clock, Users, Activity, ShieldAlert, BrainCircuit } from "lucide-react";
import Magnetic from "../../motion/Magnetic";

// Words wrapped in * are set in the accent
const STATEMENT =
  "Aicyro builds *secure,* *scalable* web, mobile and *AI-powered* software for startups, SMBs and enterprises, designed specifically for your growth stage.";

const PROBLEMS = [
  { icon: Clock, title: "Projects going over budget or deadline", desc: "Missed milestones and creeping costs killing your momentum." },
  { icon: Users, title: "Difficulty finding the right technical team", desc: "Sifting through freelancers who don’t understand your vision." },
  { icon: Activity, title: "Poor performance & scalability issues", desc: "Apps that crash or lag when your user base starts to grow." },
  { icon: ShieldAlert, title: "Security and compliance concerns", desc: "Vulnerabilities that put your user data and business at risk." },
  { icon: BrainCircuit, title: "Lack of AI expertise in execution", desc: "Falling behind competitors who are leveraging AI effectively." },
];

export default function Statement() {
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".ob-word"),
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.6 },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const words = STATEMENT.split(" ");

  return (
    <section id="content" tabIndex={-1} className="ob-statement" aria-labelledby="statement-title">
      <div className="ax-container">
        <h2 id="statement-title" className="ob-eyebrow">
          01 / Who we are
        </h2>
        <p ref={textRef} className="ob-statement__text">
          {words.map((w, i) => {
            const accent = w.startsWith("*");
            const clean = w.replace(/\*/g, "");
            return (
              <span key={i} className={`ob-word${accent ? " ob-word--accent" : ""}`}>
                {clean}{" "}
              </span>
            );
          })}
        </p>

        <div className="ob-problems">
          <div className="ob-problems__head">
            <h3 className="ob-problems__title">Struggling to build reliable software that actually drives business growth?</h3>
            <p className="ax-body">That’s where Aicyro comes in. We build software designed specifically for your growth stage.</p>
            <Magnetic>
              <Link href="/contact" className="ax-btn">
                Start Building with Aicyro
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </Magnetic>
          </div>
          <ul className="ob-problems__list">
            {PROBLEMS.map(({ icon: Icon, title, desc }, i) => (
              <li key={title} data-reveal style={{ "--i": i }}>
                <span className="ob-problems__num" aria-hidden="true">0{i + 1}</span>
                <Icon size={20} aria-hidden="true" />
                <div>
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
