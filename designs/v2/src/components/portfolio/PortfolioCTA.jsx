import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Redesign v3 (Aurora Studio): the closing call to action on /portfolio and every case study.
const PortfolioCTA = () => {
  return (
    <section className="ax-section pf-cta" aria-labelledby="portfolio-cta-title">
      <div className="ax-container">
        <div className="ax-cta" data-reveal>
          <span className="ax-eyebrow">
            <span>Let’s talk</span>
          </span>
          <h2 id="portfolio-cta-title" className="ax-cta__title">
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

export default PortfolioCTA;
