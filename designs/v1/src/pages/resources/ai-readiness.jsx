import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Check, Lock, BarChart3 } from "lucide-react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";

// Firebase
import { ref, push, serverTimestamp } from "firebase/database";
import { database } from "../../lib/firebase12";

// Aurora redesign: an Aurora banner, then the assessment as one elevated tool card
// with a gradient meter and numbered steps; the options are selectable cards. The
// fields, values, scoring and submit flow are unchanged; team size, data and goal
// are radios (same name, same values, same handleChange).
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

  const radio = (name, opt) => (
    <label key={opt.value} className="rs-pick">
      <input
        type="radio"
        name={name}
        value={opt.value}
        checked={formData[name] === opt.value}
        onChange={handleChange}
      />
      <span>
        <span className="rs-pick__text">{opt.label}</span>
        <span className="rs-pick__check" aria-hidden="true">
          <Check strokeWidth={3} />
        </span>
      </span>
    </label>
  );

  // Display only: how many of the required fields are filled, for the meter.
  const filled = [formData.company, formData.name, formData.email].filter(Boolean).length;

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
        <section className="ax-banner ax-aurora" aria-labelledby="ai-title">
          <div className="ax-container">
            <p className="ax-eyebrow">
              <span className="ax-eyebrow__dot">
                <BarChart3 aria-hidden="true" />
              </span>
              Free assessment tool
            </p>
            <h1 id="ai-title" className="ax-h1">
              Discover Your AI <br />
              <span className="ax-gradient-text">Opportunity Score</span>
            </h1>
            <p className="ax-lead">
              Answer 5 simple questions to get a personalized report on your
              infrastructure, potential ROI, and implementation roadmap.
            </p>
          </div>
        </section>

        <section className="ax-section pt-0" aria-label="Assessment">
          <div className="ax-container ax-container--narrow">
            <form onSubmit={handleSubmit} className="ax-panel rs-tool">
              <div className="rs-meter" aria-hidden="true">
                <span style={{ "--p": filled / 3 }} />
              </div>

              <ol className="rs-tsteps">
                {/* STEP 1: BUSINESS INFO */}
                <li className="rs-tstep">
                  <span className="rs-tstep__no" aria-hidden="true">1</span>
                  <div className="rs-tstep__body">
                    <div className="rs-tstep__headrow">
                      <h2 id="ai-step-1" className="rs-tstep__title">
                        Business Context
                      </h2>
                    </div>
                    <fieldset className="rs-tstep__body" aria-labelledby="ai-step-1">
                      <div className="rs-grid2">
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

                      <fieldset className="rs-picks rs-picks--4 rs-picks--pair" style={{ "--cols": 4 }}>
                        <legend className="ax-label">Team Size</legend>
                        {TEAM_SIZES.map((opt) => radio("teamSize", opt))}
                      </fieldset>
                    </fieldset>
                  </div>
                </li>

                {/* STEP 2: TECH STATE */}
                <li className="rs-tstep">
                  <span className="rs-tstep__no" aria-hidden="true">2</span>
                  <div className="rs-tstep__body">
                    <div className="rs-tstep__headrow">
                      <h2 id="ai-step-2" className="rs-tstep__title">
                        Data &amp; Goals
                      </h2>
                    </div>
                    <fieldset className="rs-tstep__body" aria-labelledby="ai-step-2">
                      <fieldset className="rs-picks">
                        <legend className="ax-label">
                          Where does your data is stored ?
                        </legend>
                        {DATA_STATES.map((opt) => radio("dataState", opt))}
                      </fieldset>

                      <fieldset className="rs-picks">
                        <legend className="ax-label">Primary Goal for AI?</legend>
                        {GOALS.map((opt) => radio("primaryGoal", opt))}
                      </fieldset>
                    </fieldset>
                  </div>
                </li>

                {/* STEP 3: CONTACT */}
                <li className="rs-tstep">
                  <span className="rs-tstep__no" aria-hidden="true">3</span>
                  <div className="rs-tstep__body">
                    <div className="rs-tstep__headrow">
                      <h2 id="ai-step-3" className="rs-tstep__title">
                        Where should we send the report?
                      </h2>
                    </div>
                    <fieldset className="rs-tstep__body" aria-labelledby="ai-step-3">
                      <div className="rs-grid2">
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
                  </div>
                </li>
              </ol>

              {/* Submit */}
              <div className="rs-tool__actions">
                <p className="rs-note">
                  <Lock size={16} aria-hidden="true" />
                  <span>We respect your privacy. No spam.</span>
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="ax-btn ax-btn--lg"
                >
                  {loading ? "Analyzing…" : "Generate My Score"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AIReadiness;
