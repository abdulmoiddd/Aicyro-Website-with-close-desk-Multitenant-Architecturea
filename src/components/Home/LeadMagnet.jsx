// Hallmark redesign: the home page's close. The free audit offer set large beside
// its line and the one action, which goes to contact (the site's job).
import React from "react";

const LeadMagnet = () => {
  return (
    <section className="hm-section-l" aria-labelledby="audit-title">
      <div className="ax-container ax-split hm-close">
        <h2 id="audit-title" className="hm-close__title">
          Get a Free AI &amp; Cybersecurity Audit
        </h2>

        <div className="hm-close__body">
          <p className="ax-lead">
            We review your current systems and provide actionable insights to
            improve security, performance, and automation.
          </p>
          <a href="/contact" className="ax-btn">
            Claim Free Audit
          </a>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
