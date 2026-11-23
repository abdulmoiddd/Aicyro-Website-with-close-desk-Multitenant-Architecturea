import React from "react";
import { ArrowDown, Layers3 } from "lucide-react";

// Aurora redesign: the centred banner for /services over the aurora glow and grid,
// with in-page jumps to the two sections that follow.
const ServicesIntro = () => {
  return (
    <section className="ax-banner ax-aurora svc-banner" aria-labelledby="services-title">
      <div className="ax-container">
        <p className="ax-eyebrow">
          <Layers3 aria-hidden="true" />
          Our services
        </p>
        <h1 id="services-title" className="ax-h1--s">
          Engineering Intelligence for Complex Business Problems.
        </h1>

        <p className="ax-lead svc-banner__wide">
          We build for ambitious startups and enterprises who need more than just code. Whether you need to
          secure your infrastructure, automate operations, or scale your product, we provide the technical
          foundation to make it happen.
        </p>

        <div className="ax-banner__actions">
          <a href="#core-services" className="ax-btn">
            Core Services
            <ArrowDown size={18} aria-hidden="true" />
          </a>
          <a href="#capabilities" className="ax-btn ax-btn--quiet">
            Capabilities
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesIntro;
