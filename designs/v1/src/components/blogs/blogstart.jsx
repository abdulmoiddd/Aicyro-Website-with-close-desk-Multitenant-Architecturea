import React from "react";
// Aurora redesign: the centred Banner hero for the blogs index. The Navbar renders here, once.
import Navbar from "../Essntials/Navbar";
import Link from "next/link";
import { BookOpen } from "lucide-react";

// The page body is passed as children so the hero and the posts share one <main>.
const BlogHero = ({ children }) => {
  return (
    <>
      <Navbar />

      <main id="main">
        <header className="ax-banner ax-aurora blog-banner">
          <div className="ax-container">
            <p className="ax-eyebrow">
              <BookOpen aria-hidden="true" />
              Blog
            </p>

            <h1 className="ax-h1">Insights &amp; Updates</h1>

            <p className="ax-lead">
              Explore expert articles on SaaS development, AI integration, and
              cybersecurity strategies from the Aicyro Solutions team.
            </p>

            <nav aria-label="Breadcrumb" className="blog-crumbs">
              <ol>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li aria-current="page">Blog</li>
              </ol>
            </nav>
          </div>
        </header>
        {children}
      </main>
    </>
  );
};

export default BlogHero;
