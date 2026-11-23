import React from "react";
import Link from "next/link";
import Head from "next/head";
import { CircleCheck, Home, FileText } from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";

// Obsidian redesign: a confirmation banner over the ambient glow and grid floor, the
// success badge, then the two routes. The words and the routes are unchanged.
const ThankYou = () => {
  return (
    <>
      {/* --- SEO: NoIndex is important for Thank You pages to avoid analytics skew --- */}
      <Head>
        <title>Thank You | Aicyro Solutions</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Navbar />

      <main id="main">
        <section className="ob-banner ob-ambient rs-confirm" aria-labelledby="ty-title">
          <div className="ax-container">
            <div className="ob-banner__inner">
              <span className="rs-badge" data-reveal aria-hidden="true">
                <CircleCheck size={32} strokeWidth={1.5} />
              </span>

              <h1 id="ty-title" className="ob-banner__title" data-reveal style={{ "--i": 1 }}>
                Message Received!
              </h1>

              <p className="ob-banner__lead" data-reveal style={{ "--i": 2 }}>
                Thanks for reaching out. Our team is reviewing your inquiry and will get back to you within <strong>24 hours</strong>.
              </p>

              {/* Next Steps / Calls to Action */}
              <div className="ob-banner__actions" data-reveal style={{ "--i": 3 }}>
                <Link href="/" className="ax-btn">
                  <Home size={18} aria-hidden="true" />
                  <span>Return Home</span>
                </Link>

                <Link href="/blogs" className="ax-btn ax-btn--quiet">
                  <FileText size={18} aria-hidden="true" />
                  <span>Read Our Blog</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ThankYou;
