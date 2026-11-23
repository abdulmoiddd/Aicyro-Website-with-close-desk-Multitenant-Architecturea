// Redesign v3: the home page's close. The free audit offer in a glowing CTA card with
// the one action, which goes to contact (the site's job).
import React from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";

const LeadMagnet = () => {
  return (
    <section className="ax-section" aria-labelledby="audit-title">
      <div className="ax-container">
        <div className="ax-cta" data-reveal>
          <span className="ax-icon-tile ax-icon-tile--solid" aria-hidden="true">
            <ShieldCheck />
          </span>
          <h2 id="audit-title" className="ax-cta__title">
            Get a Free <span className="ax-grad">AI &amp; Cybersecurity Audit</span>
          </h2>
          <p className="ax-lead">
            We review your current systems and provide actionable insights to
            improve security, performance, and automation.
          </p>
          <div className="ax-cta__actions">
            <a href="/contact" className="ax-btn">
              Claim Free Audit
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
