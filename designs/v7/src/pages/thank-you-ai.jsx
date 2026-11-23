import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { CircleCheck, BarChart3, Mail } from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";

// Obsidian redesign: the score set large inside a ring meter (a glass results panel),
// beside what happens next as two glass cards. The score logic and the levels are unchanged.
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
        <header className="ob-banner ob-ambient rs-hero">
          <div className="ax-container">
            <div className="ob-banner__inner">
              <p className="rs-status" role="status" data-reveal>
                <CircleCheck size={16} aria-hidden="true" />
                <span>Assessment Complete</span>
              </p>
              <h1 className="ob-banner__title" data-reveal style={{ "--i": 1 }}>
                Your AI Readiness Score
              </h1>
            </div>
          </div>
        </header>

        <section className="rs-tool" aria-labelledby="level-title">
          <div className="ax-container rs-score-split">
            {/* SCORE */}
            <div className="ob-card rs-panel rs-score-card" data-reveal>
              <div
                className="rs-ring rs-ring--lg"
                data-tone={readinessTone}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Number(finalScore)}
                aria-labelledby="level-title"
                style={{ "--rs-p": Math.min(Number(finalScore) || 0, 100) / 100 }}
              >
                <p className="rs-ring__value">
                  <span className="rs-figure ax-num">{finalScore}</span>
                  <span className="rs-kicker">out of 100</span>
                </p>
              </div>
              <h2 id="level-title" className={`rs-form__title ${readinessColor}`}>
                {readinessLevel}
              </h2>
              <p className="ax-body">
                Based on your infrastructure and goals, your business shows {readinessLevel.toLowerCase()} for AI adoption.
              </p>
            </div>

            {/* NEXT */}
            <div className="rs-side">
              <div className="ob-card rs-panel rs-next-card" data-reveal style={{ "--i": 1 }}>
                <span className="rs-next__icon" aria-hidden="true">
                  <Mail size={22} />
                </span>
                <div className="grid gap-2">
                  <h2 className="rs-form__title">Full Report Sent</h2>
                  <p className="ax-body">
                    We’ve emailed you a detailed breakdown of your score, including suggested use cases and a risk mitigation checklist.
                  </p>
                </div>
              </div>

              <div className="ob-card rs-panel rs-next-card" data-reveal style={{ "--i": 2 }}>
                <p className="rs-form__title">Ready to discuss your score?</p>
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
