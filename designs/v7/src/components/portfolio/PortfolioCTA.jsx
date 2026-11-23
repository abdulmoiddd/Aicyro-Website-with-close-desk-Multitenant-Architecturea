import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Magnetic from "../motion/Magnetic";

// Obsidian: the close is the job, contact. A centred full-width banner over the
// ambient architecture (accent glow, perspective grid), with a magnetic primary action.
const PortfolioCTA = () => {
  return (
    <section className="pf-close ob-ambient" aria-labelledby="portfolio-cta-title">
      <div className="ax-container pf-close__inner">
        <p className="ob-eyebrow">Next step</p>
        <h2 id="portfolio-cta-title" className="pf-close__title" data-reveal>
          Have a complex challenge?
        </h2>
        <p className="ax-lead" data-reveal style={{ "--i": 1 }}>
          We specialize in solving the problems that others can’t. Let’s discuss your architecture, bottlenecks, and growth goals.
        </p>
        <div className="pf-close__actions" data-reveal style={{ "--i": 2 }}>
          <Magnetic strength={0.3}>
            <Link href="/contact" className="ax-btn pf-close__btn">
              Let’s Build Your Solution
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
};

export default PortfolioCTA;
