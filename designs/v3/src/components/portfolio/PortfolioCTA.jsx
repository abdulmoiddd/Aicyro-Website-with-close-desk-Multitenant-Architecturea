import React from "react";
import Link from "next/link";

// Hallmark redesign: the close is the job, contact, set as a band.
const PortfolioCTA = () => {
  return (
    <section className="ax-band pf-cta" aria-labelledby="portfolio-cta-title">
      <div className="ax-container pf-cta__grid">
        <h2 id="portfolio-cta-title" className="ax-h2">
          Have a complex challenge?
        </h2>
        <div className="pf-cta__body">
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

export default PortfolioCTA;
