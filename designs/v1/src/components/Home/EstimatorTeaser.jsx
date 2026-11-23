// Aurora redesign: the home page's planning tools, three cards on a band (the middle
// one tinted): the AI readiness score, the cost estimator (this file's own content)
// and the MVP blueprint. The two shared teasers render here with
// variant="tile"; elsewhere they are bands of their own.
import React from "react";
import Link from "next/link";
import { Calculator, Clock, DollarSign, Compass } from "lucide-react";
import AIReadinessTeaser from "./AIReadinessTeaser";
import MVPBlueprint from "./MVPBlueprint";

const EstimatorTile = () => (
  <li>
    <span className="ax-icon-tile ax-icon-tile--solid">
      <Calculator aria-hidden="true" />
    </span>
    <h3 className="ax-h3">Curious about costs?</h3>
    <ul className="hm-res__facts ax-body">
      <li>
        <Clock size={16} aria-hidden="true" />
        <span>Takes 2 minutes</span>
      </li>
      <li>
        <DollarSign size={16} aria-hidden="true" />
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
            <Compass aria-hidden="true" />
            Free planning tools
          </p>
          <h2 id="resources-title" className="ax-h2">Plan your project before we talk</h2>
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
