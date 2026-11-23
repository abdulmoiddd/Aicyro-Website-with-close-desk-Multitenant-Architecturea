import React from "react";
import Link from "next/link";
import Head from "next/head";
import { CircleCheck, Home, FileText, MailCheck } from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";

// Aurora redesign: a centred success card on the aurora stage. The words and
// the two routes are unchanged.
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
        <section className="ax-aurora ut-stage" aria-labelledby="ty-title">
          <div className="ax-container">
            <div className="ut-success" data-reveal>
              <span className="ut-badge">
                <CircleCheck strokeWidth={1.75} aria-hidden="true" />
              </span>

              <span className="ax-eyebrow">
                <MailCheck aria-hidden="true" />
                Inquiry sent
              </span>

              <h1 id="ty-title" className="ax-h1--s">
                Message Received!
              </h1>

              <p className="ax-lead">
                Thanks for reaching out. Our team is reviewing your inquiry and will get back to you within <strong>24 hours</strong>.
              </p>

              {/* Next Steps / Calls to Action */}
              <div className="ut-actions">
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
