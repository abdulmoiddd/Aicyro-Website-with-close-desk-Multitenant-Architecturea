import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { CircleCheck, Calendar, Mail } from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";

// Obsidian redesign: the range set large in a glass results panel, the disclaimer under it
// verbatim, then the two next steps as glass cards. Formatting and routes unchanged.
const ThankYouEstimate = () => {
  const router = useRouter();
  const { min, max } = router.query;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 }).format(val);
  };

  return (
    <>
      <Head>
        <title>Your Project Estimate | Aicyro Solutions</title>
        <meta name="robots" content="noindex" />
      </Head>

      <Navbar />

      <main id="main">
        <header className="ob-banner ob-ambient rs-hero">
          <div className="ax-container">
            <div className="ob-banner__inner">
              <p className="rs-status" role="status" data-reveal>
                <CircleCheck size={16} aria-hidden="true" />
                <span>Calculation Complete</span>
              </p>
              <h1 className="ob-banner__title" data-reveal style={{ "--i": 1 }}>
                Your Estimated Budget Range
              </h1>
              <p className="ob-banner__lead" data-reveal style={{ "--i": 2 }}>
                Based on the features and platform selected.
              </p>
            </div>
          </div>
        </header>

        <section className="rs-tool" aria-label="Estimated range">
          <div className="ax-container grid gap-4">
            {/* PRICE */}
            <div className="ob-card rs-result-hero" data-reveal>
              <p className="rs-figure rs-figure--display rs-range ax-num">
                <span>{min ? formatCurrency(min) : "$…"}</span>
                <span className="rs-range__to">
                  {" "}- {max ? formatCurrency(max) : "$…"}
                </span>
              </p>
              <p className="ax-meta">
                *This is a preliminary estimate. Final costs may vary based on specific design requirements and third-party integrations.
              </p>
            </div>

            {/* NEXT STEPS */}
            <div className="rs-next" aria-label="Next steps" role="group">
              {/* OPTION 1: Book Call */}
              <div className="ob-card rs-panel" data-reveal style={{ "--i": 1 }}>
                <span className="rs-next__icon" aria-hidden="true">
                  <Calendar size={22} />
                </span>
                <div className="grid gap-2">
                  <h2>Validate this Quote</h2>
                  <p className="ax-body">Talk to an engineer to firm up this number and get a technical proposal.</p>
                </div>
                <Link href="/contact" className="ax-btn">
                  <Calendar size={18} aria-hidden="true" />
                  Book Feasibility Call
                </Link>
              </div>

              {/* OPTION 2: Email */}
              <div className="ob-card rs-panel" data-reveal style={{ "--i": 2 }}>
                <span className="rs-next__icon" aria-hidden="true">
                  <Mail size={22} />
                </span>
                <div className="grid gap-2">
                  <h2>Check your Email</h2>
                  <p className="ax-body">We sent a PDF summary of your selected features and timeline.</p>
                </div>
                <button type="button" disabled className="ax-btn ax-btn--quiet">
                  <Mail size={18} aria-hidden="true" />
                  Sent to Inbox
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ThankYouEstimate;
