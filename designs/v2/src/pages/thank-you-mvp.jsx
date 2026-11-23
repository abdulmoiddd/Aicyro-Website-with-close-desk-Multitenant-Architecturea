import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Download, Calendar, Check } from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";

// Redesign v3 (Aurora Studio): a centred glass success card with a gradient check
// tile and the direct download, then the closing call to action. The file link and
// the contact route are unchanged.
const ThankYouMVP = () => {
  return (
    <>
      <Head>
        <title>Here is your Blueprint | Aicyro Solutions</title>
        <meta name="robots" content="noindex" />
      </Head>

      <Navbar />

      <main id="main">
        <section className="ms-done" aria-labelledby="mvp-ty-title">
          <span className="ax-gridbg" aria-hidden="true" />
          <div className="ax-container">
            <div className="ms-done__card">
              <span className="ms-check ax-rise" style={{ "--i": 0 }} aria-hidden="true">
                <Check strokeWidth={2.5} />
              </span>

              <h1 id="mvp-ty-title" className="ax-h1--s ax-rise" style={{ "--i": 1 }}>
                You’re <span className="ax-grad">In!</span>
              </h1>
              <p className="ax-lead ax-rise" style={{ "--i": 2 }}>
                The <strong className="text-ink">MVP Launch Blueprint</strong> has been sent to your email.
                <br />
                (Check your spam folder just in case!)
              </p>

              {/* Download Button (Direct) */}
              <div className="ms-done__split ax-rise" style={{ "--i": 3 }}>
                <h2>Don’t want to wait?</h2>
                <a
                  href="/assets/Aicyro_MVP_Blueprint.pdf" // Ensure this file exists in /public/assets/
                  download
                  className="ax-btn ax-btn--quiet"
                >
                  <Download size={18} aria-hidden="true" />
                  Download PDF Now
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* NEXT STEP CTA: The "Backend" Strategy */}
        <section className="ax-section" aria-labelledby="mvp-next-title">
          <div className="ax-container">
            <div className="ax-cta" data-reveal>
              <h2 id="mvp-next-title" className="ax-cta__title">
                Need help <span className="ax-grad">executing this blueprint?</span>
              </h2>
              <p className="ax-lead">
                Our engineering team specializes in turning these blueprints into live, scalable SaaS products in 30-45 days.
              </p>
              <div className="ax-cta__actions">
                <Link href="/contact" className="ax-btn">
                  <Calendar size={18} aria-hidden="true" />
                  Book a Free Feasibility Call
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

export default ThankYouMVP;
