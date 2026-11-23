// Redesign v3: the home page's planning tools on a tinted band, three cards across:
// the AI readiness score, the cost estimator (this file's own content) and the MVP
// blueprint. The two shared teasers render here with variant="tile"; elsewhere they
// are promo bands of their own.
import React from "react";
import Link from "next/link";
import { Calculator, Clock, DollarSign } from "lucide-react";
import AIReadinessTeaser from "./AIReadinessTeaser";
import MVPBlueprint from "./MVPBlueprint";

const EstimatorTile = () => (
  <li className="ax-card ax-spot hm-tool hm-tool--featured" data-reveal style={{ "--i": 1 }}>
    <span className="ax-icon-tile ax-icon-tile--solid" aria-hidden="true">
      <Calculator />
    </span>
    <h3 className="ax-h3">Curious about costs?</h3>
    <ul className="hm-res__facts">
      <li className="ax-chip">
        <Clock size={14} aria-hidden="true" />
        <span>Takes 2 minutes</span>
      </li>
      <li className="ax-chip">
        <DollarSign size={14} aria-hidden="true" />
        <span>Instant ball-park</span>
      </li>
    </ul>
    <Link href="/resources/project-estimate" className="ax-btn">
      <Calculator size={18} aria-hidden="true" />
      <span>Start Estimator</span>
    </Link>
  </li>
);

const EstimatorTeaser = () => {
  return (
    <section className="ax-band" aria-labelledby="resources-title">
      <div className="ax-container">
        <div className="ax-head ax-head--center">
          <p className="ax-eyebrow">
            <span>Free tools</span>
          </p>
          <h2 id="resources-title" className="ax-h2">
            Plan your project <span className="ax-grad">before we talk</span>
          </h2>
        </div>

        <ul className="hm-res">
          <AIReadinessTeaser variant="tile" />
          <EstimatorTile />
          <MVPBlueprint variant="tile" />
        </ul>
      </div>
    </section>
  );
};

export default EstimatorTeaser;
