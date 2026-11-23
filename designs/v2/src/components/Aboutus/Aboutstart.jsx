import React from "react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

// Redesign v3 (Aurora Studio): the about page hero. Breadcrumbs, a glass eyebrow,
// the h1 with one phrase in the brand gradient, the page's one line, and a quiet
// jump to the "Why Aicyro?" cards. The Navbar renders once, in pages/about.jsx.
const Aboutstart = () => {
  return (
    <section className="ax-pagehero ab-hero" aria-labelledby="about-title">
      <span className="ax-gridbg" aria-hidden="true" />
      <div className="ax-container ax-pagehero__inner">
        <nav aria-label="Breadcrumb" className="ax-rise">
          <ul className="ax-crumbs">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-current="page">About</li>
          </ul>
        </nav>

        <p className="ax-eyebrow ax-rise" style={{ "--i": 1 }}>
          <span>About Aicyro Solutions</span>
        </p>

        <h1 id="about-title" className="ax-h1 ax-rise" style={{ "--i": 2 }}>
          About <span className="ax-grad">Us</span>
        </h1>

        <p className="ax-lead ax-rise" style={{ "--i": 3 }}>
          Aicyro Solutions was founded to design and secure technology that
          makes businesses stronger.
        </p>

        <div className="ax-pagehero__actions ax-rise" style={{ "--i": 4 }}>
          <a href="#why-title" className="ax-btn ax-btn--quiet">
            Why Aicyro?
            <ArrowDown size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Aboutstart;
