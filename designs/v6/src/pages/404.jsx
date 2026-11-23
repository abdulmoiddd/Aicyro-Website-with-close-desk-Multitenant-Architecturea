import React from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";
import Favicon from "../assets/favicon.png";

// Hallmark redesign: the number set at graphic scale beside the way back. The
// words and routes are unchanged; the grid, spotlight and gradient loop are gone.
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
        <section className="ax-section" aria-labelledby="nf-title">
          <div className="ax-container ax-split items-center">
            {/* Main 404 Display */}
            <h1 className="rs-numeral ax-num">
              404
            </h1>

            <div className="grid gap-6 justify-items-start">
              {/* Professional Copy */}
              <h2 id="nf-title" className="ax-h2">
                Page not found
              </h2>
              <p className="ax-lead">
                The page you are looking for might have been removed, had its name
                changed, or is temporarily unavailable.
              </p>

              {/* Action Area */}
              <div className="flex flex-wrap gap-3 mt-2">
                <Link href="/" className="ax-btn">
                  Go to Homepage
                </Link>
                <Link href="/contact" className="ax-btn ax-btn--quiet">
                  Contact Support
                </Link>
              </div>

              {/* Quick Links */}
              <nav className="grid gap-4 w-full pt-8 mt-4 border-t border-rule" aria-labelledby="nf-links">
                <h3 id="nf-links" className="ax-label">
                  Helpful Links
                </h3>
                <ul className="rs-links">
                  {[
                    { name: "Services", href: "/services" },
                    { name: "Portfolio", href: "/portfolio" },
                    { name: "About Us", href: "/about" },
                    { name: "Blogs", href: "/blogs" },
                  ].map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="ax-link">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default NotFoundPage;
