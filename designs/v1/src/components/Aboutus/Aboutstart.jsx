import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";

// Aurora redesign: the centred Banner over the aurora glow. The breadcrumb, an
// eyebrow pill, the page's h1 and its one line. The Navbar renders once, in pages/about.jsx.
const Aboutstart = () => {
  return (
    <section className="ax-banner ax-aurora" aria-labelledby="about-title">
      <div className="ax-container">
        <nav aria-label="Breadcrumb" className="ax-meta about-crumbs">
          <ol>
            <li>
              <Link href="/" className="ax-link">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={16} />
            </li>
            <li aria-current="page">About</li>
          </ol>
        </nav>

        <p className="ax-eyebrow">
          <Sparkles aria-hidden="true" />
          Our story
        </p>

        <h1 id="about-title" className="ax-h1">
          About Us
        </h1>
        <p className="ax-lead">
          Aicyro Solutions was founded to design and secure technology that
          makes businesses stronger.
        </p>
      </div>
    </section>
  );
};

export default Aboutstart;
