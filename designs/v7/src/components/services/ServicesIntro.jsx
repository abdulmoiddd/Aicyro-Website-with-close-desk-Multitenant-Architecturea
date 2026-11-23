import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { DETAILED_SERVICES } from "./detailcoreservices";
import { CAPABILITIES_DATA } from "./AdditionalCapabilities";
import { PROCESS_STEPS } from "./ProcessSection";
import { pad } from "./glow";

// Obsidian: the /services hero. The head and its line over the ambient glow and grid floor,
// the contact action, and an index of the three sections below (each a jump link).
const INDEX = [
  { href: "#core-services", count: DETAILED_SERVICES.length, label: "Core services" },
  { href: "#capabilities", count: CAPABILITIES_DATA.length, label: "Capabilities" },
  { href: "#process", count: PROCESS_STEPS.length, label: "Workflow stages" },
];

const ServicesIntro = () => {
  return (
    <section className="ob-banner ob-ambient svc-hero" aria-labelledby="services-title">
      <div className="ax-container">
        <div className="ob-banner__inner">
          <p className="ob-eyebrow" data-reveal>
            Services
          </p>
          <h1 id="services-title" className="ob-banner__title svc-hero__title" data-reveal style={{ "--i": 1 }}>
            Engineering Intelligence for Complex Business Problems.
          </h1>

          <p className="ob-banner__lead" data-reveal style={{ "--i": 2 }}>
            We build for ambitious startups and enterprises who need more than just code. Whether you need to
            secure your infrastructure, automate operations, or scale your product, we provide the technical
            foundation to make it happen.
          </p>

          <div className="ob-banner__actions" data-reveal style={{ "--i": 3 }}>
            <Link href="/contact" className="ax-btn">
              Book Free Consultation
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <nav className="svc-hero__index" aria-label="On this page" data-reveal style={{ "--i": 4 }}>
          <ul>
            {INDEX.map((item) => (
              <li key={item.href}>
                <a href={item.href}>
                  <b>{pad(item.count)}</b>
                  <span>{item.label}</span>
                  <ArrowDown size={16} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default ServicesIntro;
