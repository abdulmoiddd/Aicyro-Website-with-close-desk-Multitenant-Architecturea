import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { CircleCheck, BarChart3, Mail, Gauge } from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";

// Aurora redesign: the score set large in a centred success card on the aurora
// stage, then the next steps as two cards. The score logic and the levels are
// unchanged.
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
        <section className="ax-aurora ut-stage" aria-labelledby="ai-ty-title">
          <div className="ax-container">
            <div className="ut-success" data-reveal>
              <span className="ax-eyebrow">
                <Gauge aria-hidden="true" />
                AI readiness
              </span>

              <h1 id="ai-ty-title" className="ax-h1--s">Your AI Readiness Score</h1>

              <p className="ax-chip ut-chip--success" role="status">
                <CircleCheck size={16} aria-hidden="true" />
                <span>Assessment Complete</span>
              </p>

              {/* SCORE */}
              <p className="ut-score">
                <span className="ut-figure">{finalScore}</span>
                <span className="ax-meta">out of 100</span>
              </p>
              <div
                className={`ut-progress ut-progress--${readinessTone}`}
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
          </div>
        </section>

        {/* NEXT */}
        <section className="ax-section pt-0" aria-label="Next steps">
          <div className="ax-container ax-container--narrow">
            <div className="ax-bento ut-next">
              <div className="ax-card ax-span-6" data-reveal style={{ "--i": 0 }}>
                <span className="ax-icon-tile">
                  <Mail aria-hidden="true" />
                </span>
                <h2 className="ax-h3">Full Report Sent</h2>
                <p className="ax-body">
                  We’ve emailed you a detailed breakdown of your score, including suggested use cases and a risk mitigation checklist.
                </p>
              </div>

              <div className="ax-card ax-card--tint ax-span-6" data-reveal style={{ "--i": 1 }}>
                <span className="ax-icon-tile ax-icon-tile--solid">
                  <BarChart3 aria-hidden="true" />
                </span>
                <p className="ax-h3">Ready to discuss your score?</p>
                <div className="ax-card__foot">
                  <Link href="/contact" className="ax-btn">
                    <BarChart3 size={18} aria-hidden="true" />
                    Book Strategy Session
                  </Link>
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

export default ThankYouAI;
