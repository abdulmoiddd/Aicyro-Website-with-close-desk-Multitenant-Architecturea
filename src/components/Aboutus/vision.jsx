import React from "react";

// Hallmark redesign: Statement on a change of paper. The vision sentence set at
// display size across the width, the paragraph beneath it on the right.
const VisionWatermark = () => {
  return (
    <section className="ax-band" aria-labelledby="vision-title">
      <div className="ax-container about-vision">
        <h2 id="vision-title" className="ax-h1--s" data-reveal>
          We are building the operating system for growth.
        </h2>

        <p className="ax-lead" data-reveal style={{ "--i": 1 }}>
          Our long-term vision is to democratize high-availability architecture.
          We believe that in the next decade, every company will be a software company,
          and we will be the foundation they build upon.
        </p>
      </div>
    </section>
  );
};

export default VisionWatermark;
