import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Magnetic from "../motion/Magnetic";

// Obsidian redesign: the close. Centred over the ambient glow and grid floor, the
// question at display scale, its line and the page's one action (magnetic).
const AboutusCTA = () => {
  return (
    <section className="ab-close ob-ambient" aria-labelledby="about-cta-title">
      <div className="ax-container ab-close__inner">
        <p className="ob-eyebrow" data-reveal>
          04 / Start here
        </p>
        <h2 id="about-cta-title" className="ab-close__title" data-reveal style={{ "--i": 1 }}>
          Have a complex challenge?
        </h2>

        <p className="ax-lead" data-reveal style={{ "--i": 2 }}>
          We specialize in solving the problems that others can’t. Let’s discuss your architecture, bottlenecks, and growth goals.
        </p>
        <div className="ab-close__actions" data-reveal style={{ "--i": 3 }}>
          <Magnetic strength={0.35}>
            <Link href="/contact" className="ax-btn ab-close__btn">
              Let’s Build Your Solution
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
};

export default AboutusCTA;
