import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowDownRight } from "lucide-react";

// Redesign v3 (Aurora Studio): the /services page hero. Breadcrumbs, a glass
// eyebrow, the head with its second phrase in the brand gradient, the line and
// two actions (contact, and a jump to the service bento below).
const ServicesIntro = () => {
  return (
    <section className="ax-pagehero ax-pagehero--center svc-index-hero" aria-labelledby="services-title">
      <span className="ax-gridbg" aria-hidden="true" />
      <div className="ax-container ax-pagehero__inner">
        <nav aria-label="Breadcrumb" className="ax-rise">
          <ul className="ax-crumbs">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-current="page">Services</li>
          </ul>
        </nav>

        <p className="ax-eyebrow ax-rise" style={{ "--i": 1 }}>
          <span>Services</span>
        </p>

        <h1 id="services-title" className="ax-h1 ax-rise" style={{ "--i": 2 }}>
          Engineering Intelligence for <span className="ax-grad">Complex Business Problems.</span>
        </h1>

        <p className="ax-lead ax-rise" style={{ "--i": 3 }}>
          We build for ambitious startups and enterprises who need more than just code. Whether you need to
          secure your infrastructure, automate operations, or scale your product, we provide the technical
          foundation to make it happen.
        </p>

        <div className="ax-pagehero__actions ax-rise" style={{ "--i": 4 }}>
          <Link href="/contact" className="ax-btn">
            Book Free Consultation
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <a href="#all-services" className="ax-btn ax-btn--quiet">
            Explore services
            <ArrowDownRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesIntro;
