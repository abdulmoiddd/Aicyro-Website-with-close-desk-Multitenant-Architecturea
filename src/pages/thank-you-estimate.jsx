import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { CircleCheck, Calendar, Mail } from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";

// Hallmark redesign: the range set large as the page's figure, the disclaimer
// under it verbatim, then the two next steps. Formatting and routes unchanged.
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
        <header className="ax-container rs-banner">
          <h1 className="ax-h1">Your Estimated Budget Range</h1>
          <p className="ax-lead">Based on the features and platform selected.</p>
          <p className="rs-note" role="status">
            <CircleCheck size={16} className="text-success" aria-hidden="true" />
            <span>Calculation Complete</span>
          </p>
        </header>

        {/* PRICE */}
        <section className="ax-band" aria-label="Estimated range">
          <div className="ax-container grid gap-6">
            <p className="rs-figure rs-figure--display ax-num">
              {min ? formatCurrency(min) : "$…"} - {max ? formatCurrency(max) : "$…"}
            </p>
            <p className="ax-meta max-w-[65ch]">
              *This is a preliminary estimate. Final costs may vary based on specific design requirements and third-party integrations.
            </p>
          </div>
        </section>

        {/* NEXT STEPS */}
        <section className="ax-section" aria-label="Next steps">
          <div className="ax-container ax-split--even ax-split items-stretch">
            {/* OPTION 1: Book Call */}
            <div className="ax-panel grid gap-6 content-between justify-items-start">
              <div className="grid gap-2">
                <h2 className="ax-h3">Validate this Quote</h2>
                <p className="ax-body">Talk to an engineer to firm up this number and get a technical proposal.</p>
              </div>
              <Link href="/contact" className="ax-btn">
                <Calendar size={18} aria-hidden="true" />
                Book Feasibility Call
              </Link>
            </div>

            {/* OPTION 2: Email */}
            <div className="ax-panel grid gap-6 content-between justify-items-start">
              <div className="grid gap-2">
                <h2 className="ax-h3">Check your Email</h2>
                <p className="ax-body">We sent a PDF summary of your selected features and timeline.</p>
              </div>
              <button type="button" disabled className="ax-btn ax-btn--quiet">
                <Mail size={18} aria-hidden="true" />
                Sent to Inbox
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ThankYouEstimate;
