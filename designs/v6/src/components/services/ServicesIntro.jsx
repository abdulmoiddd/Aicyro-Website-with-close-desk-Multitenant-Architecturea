import React from "react";

// Hallmark redesign: Banner hero for /services. The head and its line, nothing behind them.
const ServicesIntro = () => {
  return (
    <section className="svc-banner svc-banner--index" aria-labelledby="services-title">
      <div className="ax-container svc-banner__copy">
        <h1 id="services-title" className="ax-h1--s">
          Engineering Intelligence for Complex Business Problems.
        </h1>

        <p className="ax-lead svc-banner__wide">
          We build for ambitious startups and enterprises who need more than just code. Whether you need to
          secure your infrastructure, automate operations, or scale your product, we provide the technical
          foundation to make it happen.
        </p>
      </div>
    </section>
  );
};

export default ServicesIntro;
