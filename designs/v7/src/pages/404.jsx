import React from "react";
import Head from "next/head";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";
import Favicon from "../assets/favicon.png";

// Obsidian redesign: one centred screen over the ambient glow and grid floor. The
// number at graphic scale in the display face, the line, the way back (home,
// contact) and the helpful links as pills. The words and routes are unchanged.
const NotFoundPage = () => {
  return (
    <>
      <Head>
        <title>Page Not Found | Aicyro Solutions</title>
        <meta
          name="description"
          content="The page you are looking for might have been removed or is temporarily unavailable."
        />
        <link rel="icon" href={Favicon.src} />
      </Head>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main id="main">
        <section className="nf ob-ambient" aria-labelledby="nf-title">
          <div className="ax-container nf__inner">
            {/* Main 404 Display */}
            <h1 className="nf__num ax-num" data-reveal>
              404
            </h1>

            {/* Professional Copy */}
            <h2 id="nf-title" className="nf__title" data-reveal style={{ "--i": 1 }}>
              Page not found
            </h2>
            <p className="ax-lead" data-reveal style={{ "--i": 2 }}>
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>

            {/* Action Area */}
            <div className="nf__actions" data-reveal style={{ "--i": 3 }}>
              <Link href="/" className="ax-btn">
                Go to Homepage
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/contact" className="ax-btn ax-btn--quiet">
                Contact Support
              </Link>
            </div>

            {/* Quick Links */}
            <nav className="nf__links" aria-labelledby="nf-links" data-reveal style={{ "--i": 4 }}>
              <h3 id="nf-links" className="ab-label">
                Helpful Links
              </h3>
              <ul>
                {[
                  { name: "Services", href: "/services" },
                  { name: "Portfolio", href: "/portfolio" },
                  { name: "About Us", href: "/about" },
                  { name: "Blogs", href: "/blogs" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={item.href}>
                      {item.name}
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default NotFoundPage;
