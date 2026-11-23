import React from "react";

// Obsidian redesign: 02 / Vision. The vision sentence set at statement scale over
// a soft accent glow, "operating system" lit in the accent, the paragraph beneath
// it on the right behind a hairline.
const VisionWatermark = () => {
  return (
    <section className="ab-section ab-vision" aria-labelledby="vision-title">
      <div className="ax-container">
        <p className="ob-eyebrow" data-reveal>
          02 / Vision
        </p>
        <h2 id="vision-title" className="ab-vision__title" data-reveal style={{ "--i": 1 }}>
          We are building the <span className="ob-accent">operating system</span> for growth.
        </h2>

        <div className="ab-vision__foot">
          <span className="ab-vision__rule" aria-hidden="true" />
          <p className="ax-lead" data-reveal style={{ "--i": 2 }}>
            Our long-term vision is to democratize high-availability architecture.
            We believe that in the next decade, every company will be a software company,
            and we will be the foundation they build upon.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VisionWatermark;
