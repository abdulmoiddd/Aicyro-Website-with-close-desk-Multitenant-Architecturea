import React from "react";
// Redesign v3 (Aurora Studio): the page hero for the blogs index. The Navbar renders here, once.
import Navbar from "../Essntials/Navbar";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

// The page body is passed as children so the hero and the posts share one <main>.
const BlogHero = ({ children }) => {
  return (
    <>
      <Navbar />

      <main id="main">
        <section
          className="ax-pagehero ax-pagehero--center"
          aria-labelledby="blogs-title"
        >
          <span className="ax-gridbg" aria-hidden="true" />
          <div className="ax-container ax-pagehero__inner">
            <nav aria-label="Breadcrumb">
              <ul className="ax-crumbs">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li aria-current="page">Blog</li>
              </ul>
            </nav>

            <p className="ax-eyebrow ax-rise">
              <span>Aicyro Blog</span>
            </p>

            <h1
              id="blogs-title"
              className="ax-h1 ax-rise"
              style={{ "--i": 1 }}
            >
              Insights &amp; <span className="ax-grad">Updates</span>
            </h1>

            <p className="ax-lead ax-rise" style={{ "--i": 2 }}>
              Explore expert articles on SaaS development, AI integration, and
              cybersecurity strategies from the Aicyro Solutions team.
            </p>

            <div
              className="ax-pagehero__actions ax-rise"
              style={{ "--i": 3 }}
            >
              <a href="#blog-index-title" className="ax-btn">
                Browse articles
                <ArrowDown size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
        {children}
      </main>
    </>
  );
};

export default BlogHero;
