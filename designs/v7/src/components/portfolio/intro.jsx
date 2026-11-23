import React from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";

// Obsidian: the /portfolio hero. Ambient banner (accent glow, perspective grid floor),
// the promise set large over two lines, the lead and two ways in: down to the work,
// or straight to contact.
const PortfolioIntro = () => {
  return (
    <header className="ob-banner ob-ambient pf-hero">
      <div className="ax-container ob-banner__inner pf-hero__inner">
        <p className="ob-eyebrow" data-reveal>
          Portfolio
        </p>
        <h1 className="ob-banner__title pf-hero__title" data-reveal style={{ "--i": 1 }}>
          <span className="pf-line">We don’t just ship code.</span>
          <span className="pf-line ob-accent">We deliver outcomes.</span>
        </h1>
        <div className="pf-hero__foot" data-reveal style={{ "--i": 2 }}>
          <p className="ob-banner__lead">
            Real metrics, tangible ROI, and engineering aimed directly at your business goals.
          </p>
          <div className="ob-banner__actions">
            <a href="#case-studies" className="ax-btn">
              Case Studies
              <ArrowDown size={18} aria-hidden="true" />
            </a>
            <Link href="/contact" className="ax-btn ax-btn--quiet">
              Let’s Build Your Solution
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PortfolioIntro;
