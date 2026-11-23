import React from "react";
import { Telescope } from "lucide-react";
import { MissionCommitmentCard } from "./Mission";

// Redesign v3 (Aurora Studio): mission and vision as a bento of two large cards on
// a tinted band. The commitment card comes from Mission.jsx; the vision card is lit
// with the lead gradient and carries the vision statement and its paragraph.
const VisionWatermark = () => {
  return (
    <section className="ax-band" aria-label="Mission and vision">
      <div className="ax-container">
        <ul className="ax-bento ab-pillars">
          <MissionCommitmentCard />

          <li className="ax-card ax-spot is-half ab-pillar--accent" data-reveal style={{ "--i": 1 }}>
            <div className="ab-pillar__top">
              <span className="ax-chip">
                <Telescope size={14} aria-hidden="true" />
                Vision
              </span>
              <h2 id="vision-title" className="ab-pillar__title">
                We are building the{" "}
                <span className="ax-grad">operating system for growth.</span>
              </h2>
            </div>

            <p className="ax-lead">
              Our long-term vision is to democratize high-availability architecture.
              We believe that in the next decade, every company will be a software company,
              and we will be the foundation they build upon.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default VisionWatermark;
