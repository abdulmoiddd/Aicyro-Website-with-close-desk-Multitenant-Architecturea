import React from "react";
import Link from "next/link";
import Head from "next/head";
import { Check, Home, FileText } from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";

// Redesign v3 (Aurora Studio): a centred glass success card with a gradient check
// tile. The words and the two routes are unchanged.
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
        <section className="ms-done" aria-labelledby="ty-title">
          <span className="ax-gridbg" aria-hidden="true" />
          <div className="ax-container">
            <div className="ms-done__card">
              <span className="ms-check ax-rise" style={{ "--i": 0 }} aria-hidden="true">
                <Check strokeWidth={2.5} />
              </span>

              <h1 id="ty-title" className="ax-h1--s ax-rise" style={{ "--i": 1 }}>
                Message <span className="ax-grad">Received!</span>
              </h1>

              <p className="ax-lead ax-rise" style={{ "--i": 2 }}>
                Thanks for reaching out. Our team is reviewing your inquiry and will get back to you within <strong className="text-ink">24 hours</strong>.
              </p>

              {/* Next Steps / Calls to Action */}
              <div className="ms-done__actions ax-rise" style={{ "--i": 3 }}>
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
