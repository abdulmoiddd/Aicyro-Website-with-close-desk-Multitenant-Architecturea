import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Check, CircleCheck, Calendar, Mail } from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";

// Redesign v3 (Aurora Studio): a centred glass success card with a gradient check
// tile and the range set large in the brand gradient, the disclaimer under it
// verbatim, then the two next steps as cards. Formatting and routes unchanged.
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
        <section className="ms-done" aria-labelledby="est-ty-title">
          <span className="ax-gridbg" aria-hidden="true" />
          <div className="ax-container">
            <div className="ms-done__card">
              <span className="ms-check ax-rise" style={{ "--i": 0 }} aria-hidden="true">
                <Check strokeWidth={2.5} />
              </span>

              <p className="ms-status ax-rise" role="status" style={{ "--i": 1 }}>
                <CircleCheck size={16} aria-hidden="true" />
                <span>Calculation Complete</span>
              </p>

              <h1 id="est-ty-title" className="ax-h1--s ax-rise" style={{ "--i": 2 }}>
                Your Estimated <span className="ax-grad">Budget Range</span>
              </h1>
              <p className="ax-lead ax-rise" style={{ "--i": 3 }}>Based on the features and platform selected.</p>

              {/* PRICE */}
              <div className="ms-well ax-rise" role="group" aria-label="Estimated range" style={{ "--i": 4 }}>
                <p className="ms-figure ms-figure--range">
                  {min ? formatCurrency(min) : "$…"} - {max ? formatCurrency(max) : "$…"}
                </p>
                <p className="ms-disclaimer">
                  *This is a preliminary estimate. Final costs may vary based on specific design requirements and third-party integrations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NEXT STEPS */}
        <section className="ax-section" aria-label="Next steps">
          <div className="ax-container">
            <div className="ms-next">
              {/* OPTION 1: Book Call */}
              <div className="ax-card ax-spot" data-reveal style={{ "--i": 0 }}>
                <div className="ms-next__head">
                  <span className="ax-icon-tile ax-icon-tile--solid" aria-hidden="true">
                    <Calendar />
                  </span>
                  <h2 className="ax-h3">Validate this Quote</h2>
                  <p className="ax-body">Talk to an engineer to firm up this number and get a technical proposal.</p>
                </div>
                <Link href="/contact" className="ax-btn">
                  <Calendar size={18} aria-hidden="true" />
                  Book Feasibility Call
                </Link>
              </div>

              {/* OPTION 2: Email */}
              <div className="ax-card ax-spot" data-reveal style={{ "--i": 1 }}>
                <div className="ms-next__head">
                  <span className="ax-icon-tile" aria-hidden="true">
                    <Mail />
                  </span>
                  <h2 className="ax-h3">Check your Email</h2>
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
