import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ArrowRight, Check, Lock } from "lucide-react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";

// Firebase
import { ref, push, serverTimestamp } from "firebase/database";
import { database } from "../../lib/firebase12";

// Obsidian redesign: a stepped form of glass step cards beside a sticky track that
// holds the submit. The fields, values, scoring and submit flow are unchanged; team
// size, data and goal are radios in the flow (same name, same values, same handleChange).
const TEAM_SIZES = [
  { value: "1-10", label: "1-10 Employees" },
  { value: "11-50", label: "11-50 Employees" },
  { value: "51-200", label: "51-200 Employees" },
  { value: "200+", label: "200+ Employees" },
];

const DATA_STATES = [
  { value: "spreadsheets", label: "Mostly Spreadsheets / Manual" },
  { value: "cloud", label: "Centralized Cloud (AWS/Azure/GCP)" },
  { value: "mixed", label: "Mixed (SaaS tools + Spreadsheets)" },
  { value: "chaotic", label: "Scattered / Unsure" },
];

const GOALS = [
  { value: "automation", label: "Automate Repetitive Tasks" },
  { value: "insights", label: "Better Data Insights / Reporting" },
  { value: "customer-service", label: "Customer Support (Chatbots)" },
  { value: "product", label: "Enhance Product Features" },
];

const TRACK = [
  { id: "ai-step-1", title: "Business Context" },
  { id: "ai-step-2", title: "Data & Goals" },
  { id: "ai-step-3", title: "Where should we send the report?" },
];

// The cursor-tracking glow for the option cards (the CSS reads --mx / --my)
const glow = (e) => {
  const card = e.target?.closest?.(".rs-choice > span");
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - r.left}px`);
  card.style.setProperty("--my", `${e.clientY - r.top}px`);
};

const AIReadiness = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Assessment State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    industry: "SaaS / Tech",
    teamSize: "1-10",
    dataState: "spreadsheets", // spreadsheets, cloud, mixed, chaotic
    primaryGoal: "automation", // automation, insights, customer-service
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateScore = () => {
    // Simple mock logic to generate a score for the Thank You page
    let score = 40; // Base score
    if (formData.dataState === "cloud") score += 30;
    if (formData.dataState === "mixed") score += 15;
    if (formData.primaryGoal === "automation") score += 10;
    if (formData.teamSize !== "1-10") score += 10; // Larger teams often have more data
    return Math.min(score, 98);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const score = calculateScore();

    try {
      // 1. Save to Firebase
      const leadsRef = ref(database, "leadMagnets/aiReadiness");
      await push(leadsRef, {
        ...formData,
        score: score,
        timestamp: serverTimestamp(),
        source: "ai-assessment-page",
        status: "new",
      });

      // 2. Trigger Email API
      fetch("/api/send-ai-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, score }),
      });

      // 3. Redirect with Score as Query Param
      router.push(`/thank-you-ai?score=${score}`);
    } catch (error) {
      console.error("Error submitting assessment:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // Each radio is a glass option card; the label carries the checked state
  const radio = (name, opt) => (
    <label key={opt.value} className="rs-choice">
      <input
        type="radio"
        name={name}
        value={opt.value}
        checked={formData[name] === opt.value}
        onChange={handleChange}
      />
      <span>
        <span className="rs-choice__text">{opt.label}</span>
        <span className="rs-mark" aria-hidden="true">
          <Check size={14} strokeWidth={3} className="rs-tick" />
        </span>
      </span>
    </label>
  );

  // Read-only progress for the step track (derived, no new state): a step counts
  // as done once its fields hold a value.
  const stepsDone = [
    Boolean(formData.company && formData.industry && formData.teamSize),
    Boolean(formData.dataState && formData.primaryGoal),
    Boolean(formData.name && formData.email),
  ];
  const doneCount = stepsDone.filter(Boolean).length;

  return (
    <>
      <Head>
        <title>AI Readiness Assessment | Aicyro Solutions</title>
        <meta
          name="description"
          content="Take our free assessment to see if your business is ready for AI automation."
        />
      </Head>

      <Navbar />

      <main id="main">
        <header className="ob-banner ob-ambient rs-hero">
          <div className="ax-container">
            <div className="ob-banner__inner">
              <p className="ob-eyebrow" data-reveal>
                AI Readiness Assessment
              </p>
              <h1 className="ob-banner__title" data-reveal style={{ "--i": 1 }}>
                Discover Your AI <br />
                Opportunity Score
              </h1>
              <p className="ob-banner__lead" data-reveal style={{ "--i": 2 }}>
                Answer 5 simple questions to get a personalized report on your
                infrastructure, potential ROI, and implementation roadmap.
              </p>
            </div>
          </div>
        </header>

        <section className="rs-tool" aria-label="Assessment">
          <form onSubmit={handleSubmit} className="ax-container rs-calc">
            <ol className="rs-main rs-steps">
              {/* STEP 1: BUSINESS INFO */}
              <li id="ai-step-1-card" className="rs-step ob-card" data-reveal>
                <div className="rs-step__head">
                  <span className="rs-step__num" aria-hidden="true">
                    01
                  </span>
                  <h2 id="ai-step-1" className="rs-step__title">
                    Business Context
                  </h2>
                </div>
                <fieldset className="rs-step__body" aria-labelledby="ai-step-1">
                  <div className="rs-fields">
                    <div className="ax-field">
                      <label htmlFor="ai-company" className="ax-label">
                        Company Name
                      </label>
                      <input
                        id="ai-company"
                        type="text"
                        name="company"
                        required
                        autoComplete="organization"
                        className="ax-input"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="ax-field">
                      <label htmlFor="ai-industry" className="ax-label">
                        Industry
                      </label>
                      <select
                        id="ai-industry"
                        name="industry"
                        className="ax-select"
                        onChange={handleChange}
                      >
                        <option value="SaaS / Tech">SaaS / Technology</option>
                        <option value="Ecommerce">Ecommerce / Retail</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance / Fintech</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <fieldset
                    className="rs-choices rs-choices--pair rs-choices--c4"
                    style={{ "--cols": 4 }}
                    onPointerMove={glow}
                  >
                    <legend className="rs-legend">Team Size</legend>
                    {TEAM_SIZES.map((opt) => radio("teamSize", opt))}
                  </fieldset>
                </fieldset>
              </li>

              {/* STEP 2: TECH STATE */}
              <li id="ai-step-2-card" className="rs-step ob-card" data-reveal style={{ "--i": 1 }}>
                <div className="rs-step__head">
                  <span className="rs-step__num" aria-hidden="true">
                    02
                  </span>
                  <h2 id="ai-step-2" className="rs-step__title">
                    Data &amp; Goals
                  </h2>
                </div>
                <fieldset className="rs-step__body" aria-labelledby="ai-step-2">
                  <fieldset className="rs-choices" onPointerMove={glow}>
                    <legend className="rs-legend">
                      Where does your data is stored ?
                    </legend>
                    {DATA_STATES.map((opt) => radio("dataState", opt))}
                  </fieldset>

                  <fieldset className="rs-choices" onPointerMove={glow}>
                    <legend className="rs-legend">Primary Goal for AI?</legend>
                    {GOALS.map((opt) => radio("primaryGoal", opt))}
                  </fieldset>
                </fieldset>
              </li>

              {/* STEP 3: CONTACT */}
              <li id="ai-step-3-card" className="rs-step ob-card" data-reveal style={{ "--i": 2 }}>
                <div className="rs-step__head">
                  <span className="rs-step__num" aria-hidden="true">
                    03
                  </span>
                  <h2 id="ai-step-3" className="rs-step__title">
                    Where should we send the report?
                  </h2>
                </div>
                <fieldset className="rs-step__body" aria-labelledby="ai-step-3">
                  <div className="rs-fields">
                    <div className="ax-field">
                      <label htmlFor="ai-name" className="ax-label">
                        Your Name
                      </label>
                      <input
                        id="ai-name"
                        type="text"
                        name="name"
                        required
                        autoComplete="name"
                        className="ax-input"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="ax-field">
                      <label htmlFor="ai-email" className="ax-label">
                        Work Email
                      </label>
                      <input
                        id="ai-email"
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        className="ax-input"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </fieldset>
              </li>
            </ol>

            {/* The step track and the submit, held beside the steps */}
            <aside className="rs-aside ob-card rs-panel" data-reveal style={{ "--i": 3 }}>
              <p className="rs-hud__count" aria-hidden="true">
                <b>{String(doneCount).padStart(2, "0")}</b> / 03
              </p>
              <div className="rs-meter" style={{ "--n": 3 }} aria-hidden="true">
                {stepsDone.map((done, i) => (
                  <i key={i} data-state={done ? "done" : undefined} />
                ))}
              </div>
              <ol className="rs-track">
                {TRACK.map((t, i) => (
                  <li key={t.id} data-state={stepsDone[i] ? "done" : undefined}>
                    <a href={`#${t.id}-card`}>
                      <span className="rs-track__dot" aria-hidden="true">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span>{t.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
              <hr className="rs-divider" />
              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="ax-btn ax-btn--block"
              >
                {loading ? "Analyzing…" : "Generate My Score"}
                {!loading && <ArrowRight size={18} aria-hidden="true" />}
              </button>
              <p className="rs-note">
                <Lock size={16} aria-hidden="true" />
                <span>We respect your privacy. No spam.</span>
              </p>
            </aside>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AIReadiness;
