import React from "react";
// Obsidian: the Insights index banner (ambient glow and grid floor), the breadcrumb as a
// mono label above the display title. The Navbar renders here, once.
import Navbar from "../Essntials/Navbar";
import Link from "next/link";

// The page body is passed as children so the hero and the posts share one <main>.
const BlogHero = ({ children }) => {
  return (
    <>
      <Navbar />

      <main id="main">
        <header className="ob-banner ob-ambient blog-hero">
          <div className="ax-container ob-banner__inner">
            <nav aria-label="Breadcrumb" className="blog-crumbs" data-reveal>
              <ol>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li aria-current="page">Blog</li>
              </ol>
            </nav>

            <h1 className="ob-banner__title blog-hero__title" data-reveal style={{ "--i": 1 }}>
              Insights &amp; Updates
            </h1>

            <p className="ob-banner__lead" data-reveal style={{ "--i": 2 }}>
              Explore expert articles on SaaS development, AI integration, and
              cybersecurity strategies from the Aicyro Solutions team.
            </p>
          </div>
        </header>
        {children}
      </main>
    </>
  );
};

export default BlogHero;
