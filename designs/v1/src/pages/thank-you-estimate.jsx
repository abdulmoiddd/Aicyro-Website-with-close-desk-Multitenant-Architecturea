import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { CircleCheck, Calendar, Mail, Calculator } from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";

// Aurora redesign: the range set large in a centred success card on the aurora
// stage, the disclaimer under it verbatim, then the two next steps as cards.
// Formatting and routes unchanged.
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
        <section className="ax-aurora ut-stage" aria-labelledby="est-ty-title">
          <div className="ax-container">
            <div className="ut-success" data-reveal>
              <span className="ax-eyebrow">
                <Calculator aria-hidden="true" />
                Project estimate
              </span>

              <h1 id="est-ty-title" className="ax-h1--s">Your Estimated Budget Range</h1>
              <p className="ax-lead">Based on the features and platform selected.</p>
              <p className="ax-chip ut-chip--success" role="status">
                <CircleCheck size={16} aria-hidden="true" />
                <span>Calculation Complete</span>
              </p>

              {/* PRICE */}
              <div className="ut-divider" role="group" aria-label="Estimated range">
                <p className="ut-figure ut-figure--range">
                  {min ? formatCurrency(min) : "$…"} - {max ? formatCurrency(max) : "$…"}
                </p>
                <p className="ax-meta max-w-[60ch]">
                  *This is a preliminary estimate. Final costs may vary based on specific design requirements and third-party integrations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NEXT STEPS */}
        <section className="ax-section pt-0" aria-label="Next steps">
          <div className="ax-container ax-container--narrow">
            <div className="ax-bento ut-next">
              {/* OPTION 1: Book Call */}
              <div className="ax-card ax-card--tint ax-span-6" data-reveal style={{ "--i": 0 }}>
                <span className="ax-icon-tile ax-icon-tile--solid">
                  <Calendar aria-hidden="true" />
                </span>
                <h2 className="ax-h3">Validate this Quote</h2>
                <p className="ax-body">Talk to an engineer to firm up this number and get a technical proposal.</p>
                <div className="ax-card__foot">
                  <Link href="/contact" className="ax-btn">
                    <Calendar size={18} aria-hidden="true" />
                    Book Feasibility Call
                  </Link>
                </div>
              </div>

              {/* OPTION 2: Email */}
              <div className="ax-card ax-span-6" data-reveal style={{ "--i": 1 }}>
                <span className="ax-icon-tile">
                  <Mail aria-hidden="true" />
                </span>
                <h2 className="ax-h3">Check your Email</h2>
                <p className="ax-body">We sent a PDF summary of your selected features and timeline.</p>
                <div className="ax-card__foot">
                  <button type="button" disabled className="ax-btn ax-btn--quiet">
                    <Mail size={18} aria-hidden="true" />
                    Sent to Inbox
                  </button>
                </div>
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
