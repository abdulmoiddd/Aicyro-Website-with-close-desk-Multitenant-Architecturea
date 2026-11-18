import React from "react";
import Link from "next/link";
import Head from "next/head";
import { CircleCheck, Home, FileText } from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";

// Hallmark redesign: a Banner confirmation. The words and the two routes are
// unchanged; the glow, the grid pattern and the spring entrance are gone.
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
        <section aria-labelledby="ty-title">
          <div className="ax-container rs-banner">
            <CircleCheck size={48} strokeWidth={1.5} className="text-success" aria-hidden="true" />

            <div className="grid gap-6 justify-items-start max-w-[64rem]">
              <h1 id="ty-title" className="ax-h1">
                Message Received!
              </h1>

              <p className="ax-lead">
                Thanks for reaching out. Our team is reviewing your inquiry and will get back to you within <strong className="text-ink">24 hours</strong>.
              </p>

              {/* Next Steps / Calls to Action */}
              <div className="flex flex-wrap gap-3 mt-2">
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
