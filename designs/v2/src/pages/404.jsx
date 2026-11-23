import React from "react";
import Head from "next/head";
import Link from "next/link";
import { ArrowUpRight, Home, MessageSquareText } from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";
import Favicon from "../assets/favicon.png";

// Redesign v3 (Aurora Studio): a centred hero with the number in the brand gradient
// over a soft glow, the same words, the two actions and the helpful links as a glass
// card of tiles. Every route is unchanged.
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
        <section className="ms-404" aria-labelledby="nf-title">
          <span className="ax-gridbg" aria-hidden="true" />
          <div className="ax-container ms-404__inner">
            {/* Main 404 Display */}
            <div className="ms-404__stage ax-rise" style={{ "--i": 0 }}>
              <h1 className="ms-404__num">404</h1>
            </div>

            {/* Professional Copy */}
            <h2 id="nf-title" className="ax-h2 ax-rise" style={{ "--i": 1 }}>
              Page <span className="ax-grad">not found</span>
            </h2>
            <p className="ax-lead ax-rise" style={{ "--i": 2 }}>
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>

            {/* Action Area */}
            <div className="ms-404__actions ax-rise" style={{ "--i": 3 }}>
              <Link href="/" className="ax-btn">
                <Home size={18} aria-hidden="true" />
                Go to Homepage
              </Link>
              <Link href="/contact" className="ax-btn ax-btn--quiet">
                <MessageSquareText size={18} aria-hidden="true" />
                Contact Support
              </Link>
            </div>

            {/* Quick Links */}
            <nav className="ms-404__links ax-rise" aria-labelledby="nf-links" style={{ "--i": 4 }}>
              <h3 id="nf-links">Helpful Links</h3>
              <ul>
                {[
                  { name: "Services", href: "/services" },
                  { name: "Portfolio", href: "/portfolio" },
                  { name: "About Us", href: "/about" },
                  { name: "Blogs", href: "/blogs" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <span>{item.name}</span>
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
