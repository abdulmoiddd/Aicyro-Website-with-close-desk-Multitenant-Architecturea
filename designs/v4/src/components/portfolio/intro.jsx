import React from "react";

// Hallmark redesign: Banner hero for /portfolio. Kept short so the work
// (CaseStudiesSection) starts in the first screen.
const PortfolioIntro = () => {
  return (
    <header className="pf-banner pf-banner--index">
      <div className="ax-container pf-banner__grid pf-banner__grid--index">
        <h1 className="ax-h1--s">
          <span className="pf-line">We don’t just ship code.</span>
          <span className="pf-line">We deliver outcomes.</span>
        </h1>
        <p className="ax-lead">
          Real metrics, tangible ROI, and engineering aimed directly at your business goals.
        </p>
      </div>
    </header>
  );
};

export default PortfolioIntro;
