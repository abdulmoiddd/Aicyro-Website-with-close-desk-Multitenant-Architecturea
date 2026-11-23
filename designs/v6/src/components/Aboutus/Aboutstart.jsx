import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Hallmark redesign: Banner hero. The breadcrumb, the page's h1 and its one line,
// with the first section in view by 640px. The Navbar now renders once, in pages/about.jsx.
const Aboutstart = () => {
  return (
    <section className="about-banner" aria-labelledby="about-title">
      <div className="ax-container">
        <nav aria-label="Breadcrumb" className="ax-meta">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="ax-link">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="flex">
              <ChevronRight size={16} />
            </li>
            <li aria-current="page">About</li>
          </ol>
        </nav>

        <div className="ax-head ax-head--split mt-10 mb-0">
          <h1 id="about-title" className="ax-h1">
            About Us
          </h1>
          <p className="ax-lead">
            Aicyro Solutions was founded to design and secure technology that
            makes businesses stronger.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Aboutstart;
