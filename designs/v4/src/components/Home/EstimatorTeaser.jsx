// Hallmark redesign: the home page's planning tools, merged into one section on a band.
// Three across, parted by hairlines: the AI readiness score, the cost estimator (this
// file's own content) and the MVP blueprint. The two shared teasers render here with
// variant="tile"; elsewhere they are bands of their own.
import React, { useRef } from "react";
import Link from "next/link";
import { Calculator, Clock, DollarSign } from "lucide-react";
import AIReadinessTeaser from "./AIReadinessTeaser";
import MVPBlueprint from "./MVPBlueprint";
import useScrollVar from "./walkin/useScrollVar";

const EstimatorTile = () => (
  <li>
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
    <Link href="/resources/project-estimate" className="ax-btn ax-btn--quiet">
      <Calculator size={18} aria-hidden="true" />
      <span>Start Estimator</span>
    </Link>
  </li>
);

// Walk-in · room 06, the planning room: the three tools rise out of the floor one after
// another as the room comes into view (choreographed in walkin.css from --p).
const EstimatorTeaser = () => {
  const roomRef = useRef(null);
  useScrollVar(roomRef, ["start end", "center center"]);
  return (
    <section ref={roomRef} id="room-planning" className="ax-band wk-planroom" aria-labelledby="resources-title">
      <div className="ax-container">
        <div className="ax-head">
          <p className="ax-eyebrow"><b>06</b> The planning room</p>
          <h2 id="resources-title" className="ax-h2">Plan your project before we talk</h2>
          <p className="ax-lead">Three free tools to size up your project before the first call.</p>
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
