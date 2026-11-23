import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Check, CircleCheck, BarChart3, Mail } from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";

// Redesign v3 (Aurora Studio): a centred glass success card with a gradient check
// tile and the score set large in the brand gradient, then the two next steps as
// cards. The score logic and the levels are unchanged.
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
        <section className="ms-done" aria-labelledby="ai-ty-title">
          <span className="ax-gridbg" aria-hidden="true" />
          <div className="ax-container">
            <div className="ms-done__card">
              <span className="ms-check ax-rise" style={{ "--i": 0 }} aria-hidden="true">
                <Check strokeWidth={2.5} />
              </span>

              <p className="ms-status ax-rise" role="status" style={{ "--i": 1 }}>
                <CircleCheck size={16} aria-hidden="true" />
                <span>Assessment Complete</span>
              </p>

              <h1 id="ai-ty-title" className="ax-h1--s ax-rise" style={{ "--i": 2 }}>
                Your AI <span className="ax-grad">Readiness Score</span>
              </h1>

              {/* SCORE */}
              <div className="ms-well ax-rise" style={{ "--i": 3 }}>
                <p className="ms-figure-row">
                  <span className="ms-figure">{finalScore}</span>
                  <span className="ax-meta">out of 100</span>
                </p>
                <div
                  className={`ms-meter ms-meter--${readinessTone}`}
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
          </div>
        </section>

        {/* NEXT */}
        <section className="ax-section" aria-label="Next steps">
          <div className="ax-container">
            <div className="ms-next">
              <div className="ax-card ax-spot" data-reveal style={{ "--i": 0 }}>
                <div className="ms-next__head">
                  <span className="ax-icon-tile" aria-hidden="true">
                    <Mail />
                  </span>
                  <h2 className="ax-h3">Full Report Sent</h2>
                  <p className="ax-body">
                    We’ve emailed you a detailed breakdown of your score, including suggested use cases and a risk mitigation checklist.
                  </p>
                </div>
              </div>

              <div className="ax-card ax-spot" data-reveal style={{ "--i": 1 }}>
                <div className="ms-next__head">
                  <span className="ax-icon-tile ax-icon-tile--solid" aria-hidden="true">
                    <BarChart3 />
                  </span>
                  <h2 className="ax-h3">Ready to discuss your score?</h2>
                </div>
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
