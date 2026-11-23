import React from "react";
import Link from "next/link";

// Redesign v3 (Aurora Studio): the /portfolio page hero. Same words as before;
// the second line carries the brand gradient. The work starts right under it.
const PortfolioIntro = () => {
  return (
    <section className="ax-pagehero pf-hero" aria-labelledby="portfolio-title">
      <span className="ax-gridbg" aria-hidden="true" />
      <div className="ax-container ax-pagehero__inner">
        <nav aria-label="Breadcrumb" className="ax-rise" style={{ "--i": 0 }}>
          <ul className="ax-crumbs">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-current="page">Portfolio</li>
          </ul>
        </nav>
        <p className="ax-eyebrow ax-rise" style={{ "--i": 1 }}>
          <span>Portfolio</span>
        </p>
        <h1 id="portfolio-title" className="ax-h1 ax-rise" style={{ "--i": 2 }}>
          <span className="pf-line">We don’t just ship code.</span>
          <span className="pf-line ax-grad">We deliver outcomes.</span>
        </h1>
        <p className="ax-lead ax-rise" style={{ "--i": 3 }}>
          Real metrics, tangible ROI, and engineering aimed directly at your business goals.
        </p>
      </div>
    </section>
  );
};

export default PortfolioIntro;
