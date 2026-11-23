import React from "react";
import { Telescope } from "lucide-react";

// Aurora redesign: the vision as the second tinted card beside the mission, in the
// about page's mission-and-vision bento.
const VisionWatermark = () => {
  return (
    <article
      className="ax-card ax-card--tint ax-span-6 about-mv__card about-mv__card--vision"
      aria-labelledby="vision-title"
      data-reveal
      style={{ "--i": 1 }}
    >
      <p className="ax-eyebrow">
        <Telescope aria-hidden="true" />
        Our vision
      </p>

      <h2 id="vision-title" className="about-mv__title">
        We are building the operating system for growth.
      </h2>

      <p className="ax-body">
        Our long-term vision is to democratize high-availability architecture.
        We believe that in the next decade, every company will be a software company,
        and we will be the foundation they build upon.
      </p>
    </article>
  );
};

export default VisionWatermark;
