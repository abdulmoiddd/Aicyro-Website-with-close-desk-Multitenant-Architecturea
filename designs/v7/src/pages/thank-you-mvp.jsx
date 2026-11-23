import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Download, Calendar, CircleCheck } from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";

// Obsidian redesign: a confirmation banner with the success badge and the direct
// download, then one band for the next step. The file link and the contact route are
// unchanged.
const ThankYouMVP = () => {
  return (
    <>
      <Head>
        <title>Here is your Blueprint | Aicyro Solutions</title>
        <meta name="robots" content="noindex" />
      </Head>

      <Navbar />

      <main id="main">
        <section className="ob-banner ob-ambient rs-confirm" aria-labelledby="mvp-ty-title">
          <div className="ax-container">
            <div className="ob-banner__inner">
              <span className="rs-badge" data-reveal aria-hidden="true">
                <CircleCheck size={32} strokeWidth={1.5} />
              </span>

              <h1 id="mvp-ty-title" className="ob-banner__title" data-reveal style={{ "--i": 1 }}>
                You’re In!
              </h1>
              <p className="ob-banner__lead" data-reveal style={{ "--i": 2 }}>
                The <strong>MVP Launch Blueprint</strong> has been sent to your email.
                <br />
                (Check your spam folder just in case!)
              </p>

              {/* Download Button (Direct) */}
              <div className="rs-confirm__extra" data-reveal style={{ "--i": 3 }}>
                <h2 className="rs-legend">Don’t want to wait?</h2>
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
        <section className="ax-band" aria-labelledby="mvp-next-title">
          <div className="ax-container rs-lead">
            <div className="rs-lead__head" data-reveal>
              <h2 id="mvp-next-title" className="ax-h2">
                Need help executing this blueprint?
              </h2>
              <p className="ax-lead">
                Our engineering team specializes in turning these blueprints into live, scalable SaaS products in 30-45 days.
              </p>
            </div>

            <div className="rs-lead__actions rs-lead__actions--end" data-reveal style={{ "--i": 1 }}>
              <Link href="/contact" className="ax-btn">
                <Calendar size={18} aria-hidden="true" />
                Book a Free Feasibility Call
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ThankYouMVP;
