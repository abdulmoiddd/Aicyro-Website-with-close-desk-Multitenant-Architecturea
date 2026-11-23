import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Redesign v3 (Aurora Studio): the close, the kit's CTA band. The question with
// one phrase in the brand gradient, the line and the page's one primary action.
const AboutusCTA = () => {
  return (
    <section className="ax-section" aria-labelledby="about-cta-title">
      <div className="ax-container">
        <div className="ax-cta" data-reveal>
          <h2 id="about-cta-title" className="ax-cta__title">
            Have a <span className="ax-grad">complex challenge?</span>
          </h2>
          <p className="ax-lead">
            We specialize in solving the problems that others can’t. Let’s discuss your architecture, bottlenecks, and growth goals.
          </p>
          <div className="ax-cta__actions">
            <Link href="/contact" className="ax-btn">
              Let’s Build Your Solution
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutusCTA;
