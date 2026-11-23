import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Check,
  Lock,
  User,
  Users,
  Building,
  Building2,
  FileSpreadsheet,
  Cloud,
  Layers,
  Shuffle,
  Workflow,
  ChartColumn,
  MessagesSquare,
  Sparkles,
  Server,
  TrendingUp,
  Map as MapIcon,
  ArrowRight,
} from "lucide-react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";

// Firebase
import { ref, push, serverTimestamp } from "firebase/database";
import { database } from "../../lib/firebase12";

// Redesign v3 (Aurora Studio): a page hero, then the assessment in one large card
// with three numbered sections and selectable option cards. The fields, values,
// scoring and submit flow are unchanged (same names, same values, same handleChange).
const TEAM_SIZES = [
  { value: "1-10", label: "1-10 Employees", icon: User },
  { value: "11-50", label: "11-50 Employees", icon: Users },
  { value: "51-200", label: "51-200 Employees", icon: Building },
  { value: "200+", label: "200+ Employees", icon: Building2 },
];

const DATA_STATES = [
  { value: "spreadsheets", label: "Mostly Spreadsheets / Manual", icon: FileSpreadsheet },
  { value: "cloud", label: "Centralized Cloud (AWS/Azure/GCP)", icon: Cloud },
  { value: "mixed", label: "Mixed (SaaS tools + Spreadsheets)", icon: Layers },
  { value: "chaotic", label: "Scattered / Unsure", icon: Shuffle },
];

const GOALS = [
  { value: "automation", label: "Automate Repetitive Tasks", icon: Workflow },
  { value: "insights", label: "Better Data Insights / Reporting", icon: ChartColumn },
  { value: "customer-service", label: "Customer Support (Chatbots)", icon: MessagesSquare },
  { value: "product", label: "Enhance Product Features", icon: Sparkles },
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

  const radio = (name, opt) => {
    const Icon = opt.icon;
    return (
      <label key={opt.value} className="rs2-choice">
        <input
          type="radio"
          name={name}
          value={opt.value}
          checked={formData[name] === opt.value}
          onChange={handleChange}
        />
        <span className="rs2-opt rs2-opt--compact">
          {Icon && (
            <span className="rs2-opt__tile" aria-hidden="true">
              <Icon />
            </span>
          )}
          <span className="rs2-opt__text">{opt.label}</span>
          <span className="rs2-opt__check" aria-hidden="true">
            <Check strokeWidth={3} />
          </span>
        </span>
      </label>
    );
  };

  // Display only: which numbered sections have their required answers
  const sections = [
    { id: "ai-step-1", label: "Business Context", done: !!formData.company.trim() },
    { id: "ai-step-2", label: "Data & Goals", done: !!formData.company.trim() },
    {
      id: "ai-step-3",
      label: "Your report",
      done: !!formData.name.trim() && !!formData.email.trim(),
    },
  ];
  const doneCount = sections.filter((s) => s.done).length;
  const currentIdx = sections.findIndex((s) => !s.done);

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
        <section className="ax-pagehero ax-pagehero--center" aria-labelledby="ai-title">
          <span className="ax-gridbg" aria-hidden="true" />
          <div className="ax-container ax-pagehero__inner">
            <ul className="ax-crumbs ax-rise" style={{ "--i": 0 }}>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-current="page">AI Readiness Assessment</li>
            </ul>
            <p className="ax-eyebrow ax-rise" style={{ "--i": 1 }}>
              <span>Free assessment</span>
            </p>
            <h1 id="ai-title" className="ax-h1 ax-rise" style={{ "--i": 2 }}>
              Discover Your AI <br />
              <span className="ax-grad">Opportunity Score</span>
            </h1>
            <p className="ax-lead ax-rise" style={{ "--i": 3 }}>
              Answer 5 simple questions to get a personalized report on your
              infrastructure, potential ROI, and implementation roadmap.
            </p>
            <ul
              className="rs2-facts ax-rise"
              aria-label="What the report covers"
              style={{ "--i": 4 }}
            >
              <li className="ax-chip">
                <Server size={16} aria-hidden="true" />
                Infrastructure
              </li>
              <li className="ax-chip">
                <TrendingUp size={16} aria-hidden="true" />
                Potential ROI
              </li>
              <li className="ax-chip">
                <MapIcon size={16} aria-hidden="true" />
                Implementation roadmap
              </li>
            </ul>
          </div>
        </section>

        <section className="ax-section pt-0" aria-label="Assessment">
          <div className="ax-container max-w-[60rem]">
            <form onSubmit={handleSubmit} className="ax-card ax-spot rs2-tool ax-rise">
              <div className="rs2-progress">
                <ol className="rs2-stepper" aria-label="Assessment sections">
                  {sections.map((s, i) => (
                    <li
                      key={s.id}
                      data-state={s.done ? "done" : i === currentIdx ? "current" : "todo"}
                    >
                      <span className="rs2-stepper__dot" aria-hidden="true">
                        {s.done ? <Check strokeWidth={3} /> : i + 1}
                      </span>
                      <span className="rs2-stepper__label">{s.label}</span>
                    </li>
                  ))}
                </ol>
                <div className="rs2-meter" aria-hidden="true">
                  <span style={{ "--p": doneCount / sections.length }} />
                </div>
              </div>

              {/* STEP 1: BUSINESS INFO */}
              <section className="rs2-sec" aria-labelledby="ai-step-1">
                <div className="rs2-sec__head">
                  <span className="rs2-sec__num" aria-hidden="true">1</span>
                  <h2 id="ai-step-1" className="rs2-sec__title">
                    Business Context
                  </h2>
                </div>
                <fieldset className="rs2-fieldset" aria-labelledby="ai-step-1">
                  <div className="rs2-fields">
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

                  <fieldset className="rs2-choices rs2-choices--4">
                    <legend className="ax-label">Team Size</legend>
                    {TEAM_SIZES.map((opt) => radio("teamSize", opt))}
                  </fieldset>
                </fieldset>
              </section>

              {/* STEP 2: TECH STATE */}
              <section className="rs2-sec" aria-labelledby="ai-step-2">
                <div className="rs2-sec__head">
                  <span className="rs2-sec__num" aria-hidden="true">2</span>
                  <h2 id="ai-step-2" className="rs2-sec__title">
                    Data &amp; Goals
                  </h2>
                </div>
                <fieldset className="rs2-fieldset" aria-labelledby="ai-step-2">
                  <fieldset className="rs2-choices">
                    <legend className="ax-label">Where does your data is stored ?</legend>
                    {DATA_STATES.map((opt) => radio("dataState", opt))}
                  </fieldset>

                  <fieldset className="rs2-choices">
                    <legend className="ax-label">Primary Goal for AI?</legend>
                    {GOALS.map((opt) => radio("primaryGoal", opt))}
                  </fieldset>
                </fieldset>
              </section>

              {/* STEP 3: CONTACT */}
              <section className="rs2-sec" aria-labelledby="ai-step-3">
                <div className="rs2-sec__head">
                  <span className="rs2-sec__num" aria-hidden="true">3</span>
                  <h2 id="ai-step-3" className="rs2-sec__title">
                    Where should we send the report?
                  </h2>
                </div>
                <fieldset className="rs2-fieldset" aria-labelledby="ai-step-3">
                  <div className="rs2-fields">
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
              </section>

              {/* Submit */}
              <div className="rs2-actions rs2-actions--start">
                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="ax-btn max-sm:w-full"
                >
                  {loading ? "Analyzing…" : "Generate My Score"}
                  {!loading && <ArrowRight size={18} aria-hidden="true" />}
                </button>
                <p className="rs2-note">
                  <Lock size={16} aria-hidden="true" />
                  <span>We respect your privacy. No spam.</span>
                </p>
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
