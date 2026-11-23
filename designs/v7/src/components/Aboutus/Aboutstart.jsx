import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowDown, ChevronRight } from "lucide-react";
import Magnetic from "../motion/Magnetic";

// Obsidian redesign: the about banner. Breadcrumb and eyebrow, "About Us" at hero
// scale over the ambient grid, the founding line and the two ways forward (contact,
// or down to why Aicyro). The Navbar renders once, in pages/about.jsx.
const Aboutstart = () => {
  return (
    <section className="ob-banner ob-ambient ab-hero" aria-labelledby="about-title">
      <div className="ax-container ab-hero__inner">
        <nav aria-label="Breadcrumb" className="ab-crumbs">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={14} />
            </li>
            <li aria-current="page">About</li>
          </ol>
        </nav>

        <div className="ab-hero__grid">
          <div className="ab-hero__head">
            <p className="ob-eyebrow" data-reveal>
              Aicyro Solutions
            </p>
            <h1 id="about-title" className="ab-hero__title" data-reveal style={{ "--i": 1 }}>
              About Us
            </h1>
          </div>

          <div className="ab-hero__side" data-reveal style={{ "--i": 2 }}>
            <p className="ob-banner__lead">
              Aicyro Solutions was founded to design and secure technology that
              makes businesses stronger.
            </p>
            <div className="ob-banner__actions">
              <Magnetic strength={0.3}>
                <Link href="/contact" className="ax-btn">
                  Let’s Build Your Solution
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </Magnetic>
              <a href="#why" className="ax-btn ax-btn--quiet">
                Why Aicyro?
                <ArrowDown size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Aboutstart;
