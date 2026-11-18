import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Download, Calendar, CircleCheck } from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";

// Hallmark redesign: a Banner confirmation with the direct download, then one
// band for the next step. The file link and the contact route are unchanged.
const ThankYouMVP = () => {
  return (
    <>
      <Head>
        <title>Here is your Blueprint | Aicyro Solutions</title>
        <meta name="robots" content="noindex" />
      </Head>

      <Navbar />

      <main id="main">
        <section aria-labelledby="mvp-ty-title">
          <div className="ax-container rs-banner">
            <CircleCheck size={48} strokeWidth={1.5} className="text-success" aria-hidden="true" />

            <div className="grid gap-6 justify-items-start max-w-[64rem]">
              <h1 id="mvp-ty-title" className="ax-h1">
                You’re In!
              </h1>
              <p className="ax-lead">
                The <strong className="text-ink">MVP Launch Blueprint</strong> has been sent to your email.
                <br />
                (Check your spam folder just in case!)
              </p>

              {/* Download Button (Direct) */}
              <div className="grid gap-3 justify-items-start pt-6 mt-2 border-t border-rule w-full">
                <h2 className="ax-label text-lg">Don’t want to wait?</h2>
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
          <div className="ax-container ax-split items-end">
            <div className="grid gap-6">
              <h2 id="mvp-next-title" className="ax-h2">
                Need help executing this blueprint?
              </h2>
              <p className="ax-lead">
                Our engineering team specializes in turning these blueprints into live, scalable SaaS products in 30-45 days.
              </p>
            </div>

            <div className="lg:justify-self-end">
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
