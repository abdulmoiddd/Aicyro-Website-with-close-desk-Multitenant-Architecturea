import React from "react";
import { Briefcase } from "lucide-react";

// Aurora redesign: the centred Banner for /portfolio. Kept short so the work
// (CaseStudiesSection) starts near the first screen.
const PortfolioIntro = () => {
  return (
    <section className="ax-banner ax-aurora pf-banner" aria-labelledby="portfolio-title">
      <div className="ax-container">
        <p className="ax-eyebrow" data-reveal>
          <Briefcase aria-hidden="true" />
          Our work
        </p>
        <h1 id="portfolio-title" className="ax-h1" data-reveal style={{ "--i": 1 }}>
          <span className="pf-line">We don’t just ship code.</span>
          <span className="pf-line ax-gradient-text">We deliver outcomes.</span>
        </h1>
        <p className="ax-lead" data-reveal style={{ "--i": 2 }}>
          Real metrics, tangible ROI, and engineering aimed directly at your business goals.
        </p>
      </div>
    </section>
  );
};

export default PortfolioIntro;
