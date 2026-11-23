import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { CircleCheck, BarChart3, Mail } from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";

// Hallmark redesign: the score set large as the page's figure, beside what
// happens next. The score logic and the levels are unchanged.
const ThankYouAI = () => {
  const router = useRouter();
  const { score } = router.query; // Get score from URL

  // Default to a middle score if accessed directly
  const finalScore = score || 65;

  // Determine readiness level text
  let readinessLevel = "Moderate Potential";
  let readinessColor = "text-warn";
  let readinessTone = "warn";
  if (finalScore > 80) {
    readinessLevel = "High Readiness";
    readinessColor = "text-success";
    readinessTone = "success";
  } else if (finalScore < 50) {
    readinessLevel = "Foundational Stage";
    readinessColor = "text-danger";
    readinessTone = "danger";
  }

  return (
    <>
      <Head>
        <title>Your AI Score | Aicyro Solutions</title>
        <meta name="robots" content="noindex" />
      </Head>

      <Navbar />

      <main id="main">
        <header className="ax-container rs-banner">
          <h1 className="ax-h1">Your AI Readiness Score</h1>
          <p className="rs-note" role="status">
            <CircleCheck size={16} className="text-success" aria-hidden="true" />
            <span>Assessment Complete</span>
          </p>
        </header>

        <section className="ax-section pt-0" aria-labelledby="level-title">
          <div className="ax-container ax-split items-start">
            {/* SCORE */}
            <div className="ax-well grid gap-6">
              <p className="flex items-baseline gap-3">
                <span className="rs-numeral ax-num">{finalScore}</span>
                <span className="ax-meta">out of 100</span>
              </p>
              <div
                className={`rs-progress rs-progress--${readinessTone}`}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Number(finalScore)}
                aria-labelledby="level-title"
              >
                <span style={{ "--p": Math.min(Number(finalScore) || 0, 100) / 100 }} />
              </div>
              <h2 id="level-title" className={`ax-h3 ${readinessColor}`}>
                {readinessLevel}
              </h2>
              <p className="ax-body">
                Based on your infrastructure and goals, your business shows {readinessLevel.toLowerCase()} for AI adoption.
              </p>
            </div>

            {/* NEXT */}
            <div className="grid gap-10 content-start">
              <div className="flex items-start gap-4">
                <Mail size={24} className="shrink-0 mt-1 text-ink-2" aria-hidden="true" />
                <div className="grid gap-2">
                  <h2 className="ax-h3">Full Report Sent</h2>
                  <p className="ax-body">
                    We’ve emailed you a detailed breakdown of your score, including suggested use cases and a risk mitigation checklist.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 justify-items-start pt-8 border-t border-rule">
                <p className="font-semibold">Ready to discuss your score?</p>
                <Link href="/contact" className="ax-btn">
                  <BarChart3 size={18} aria-hidden="true" />
                  Book Strategy Session
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

export default ThankYouAI;
