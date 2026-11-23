import React from "react";
import Link from "next/link";

// Hallmark redesign: the close, a band. The question on the left, the line and
// the page's one action on the right.
const AboutusCTA = () => {
  return (
    <section className="ax-band about-band--last" aria-labelledby="about-cta-title">
      <div className="ax-container ax-split about-close">
        <h2 id="about-cta-title" className="ax-h2" data-reveal>
          Have a complex challenge?
        </h2>

        <div className="grid gap-8 justify-items-start" data-reveal style={{ "--i": 1 }}>
          <p className="ax-lead">
            We specialize in solving the problems that others can’t. Let’s discuss your architecture, bottlenecks, and growth goals.
          </p>
          <Link href="/contact" className="ax-btn">
            Let’s Build Your Solution
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutusCTA;
