import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Aurora redesign: the close, on the brand-gradient CTA band. The question, its
// line and the page's one action.
const AboutusCTA = () => {
  return (
    <section className="ax-section about-close" aria-labelledby="about-cta-title">
      <div className="ax-container">
        <div className="ax-cta" data-reveal>
          <h2 id="about-cta-title" className="ax-h2">
            Have a complex challenge?
          </h2>
          <p className="ax-lead">
            We specialize in solving the problems that others can’t. Let’s discuss your architecture, bottlenecks, and growth goals.
          </p>
          <div className="ax-cta__actions">
            <Link href="/contact" className="ax-btn ax-btn--light ax-btn--lg">
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
