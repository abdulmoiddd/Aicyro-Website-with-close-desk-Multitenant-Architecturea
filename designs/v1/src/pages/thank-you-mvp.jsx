import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Download, Calendar, CircleCheck, FileText } from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";

// Aurora redesign: a centred success card with the direct download, then the
// gradient call-to-action band for the next step. The file link and the
// contact route are unchanged.
const ThankYouMVP = () => {
  return (
    <>
      <Head>
        <title>Here is your Blueprint | Aicyro Solutions</title>
        <meta name="robots" content="noindex" />
      </Head>

      <Navbar />

      <main id="main">
        <section className="ax-aurora ut-stage" aria-labelledby="mvp-ty-title">
          <div className="ax-container">
            <div className="ut-success" data-reveal>
              <span className="ut-badge">
                <CircleCheck strokeWidth={1.75} aria-hidden="true" />
              </span>

              <span className="ax-eyebrow">
                <FileText aria-hidden="true" />
                Blueprint sent
              </span>

              <h1 id="mvp-ty-title" className="ax-h1--s">
                You’re In!
              </h1>
              <p className="ax-lead">
                The <strong>MVP Launch Blueprint</strong> has been sent to your email.
                <br />
                (Check your spam folder just in case!)
              </p>

              {/* Download Button (Direct) */}
              <div className="ut-divider">
                <h2>Don’t want to wait?</h2>
                <div className="ut-actions">
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
          </div>
        </section>

        {/* NEXT STEP CTA: The "Backend" Strategy */}
        <section className="ax-section pt-0" aria-labelledby="mvp-next-title">
          <div className="ax-container">
            <div className="ax-cta" data-reveal>
              <h2 id="mvp-next-title" className="ax-h2">
                Need help executing this blueprint?
              </h2>
              <p className="ax-lead">
                Our engineering team specializes in turning these blueprints into live, scalable SaaS products in 30-45 days.
              </p>
              <div className="ax-cta__actions">
                <Link href="/contact" className="ax-btn ax-btn--light ax-btn--lg ut-cta-btn">
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
