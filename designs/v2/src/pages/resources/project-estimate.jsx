import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Calculator,
  Check,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Monitor,
  Globe,
  Database,
  KeyRound,
  CreditCard,
  LayoutDashboard,
  Bot,
  Search,
  MessagesSquare,
  Upload,
  ChartColumn,
  Plug,
  Timer,
  CalendarDays,
  CalendarRange,
  Zap,
} from "lucide-react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";

// Firebase
import { ref, push, serverTimestamp } from "firebase/database";
import { database } from "../../lib/firebase12";

// Redesign v3 (Aurora Studio): a page hero, then the four-step calculator in a large
// card with a stepper and a gradient meter; the live range is held beside it as a
// stat card. The steps, the cost logic, the validation, the lead write and the
// redirect are unchanged; the selection tiles are checkboxes and radios in the flow.
const STEP_LABELS = ["Platform", "Features", "Timeline & Budget", "Contact"];

const FEATURE_ICONS = {
  "User Auth": KeyRound,
  Payments: CreditCard,
  "Admin Panel": LayoutDashboard,
  "AI / Chatbot": Bot,
  "Search / Filter": Search,
  "Real-time Chat": MessagesSquare,
  "File Uploads": Upload,
  Analytics: ChartColumn,
  "3rd Party API": Plug,
};

const TIMELINE_ICONS = {
  "< 2 months": Timer,
  "3-6 months": CalendarDays,
  "6+ months": CalendarRange,
  ASAP: Zap,
};

const ProjectEstimate = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // State for validation errors

  // Form State
  const [formData, setFormData] = useState({
    projectType: [],
    features: [],
    timeline: "3-6 months",
    budget: "$10k - $25k",
    name: "",
    email: "",
    details: "",
  });

  // Toggle Selection Helper
  const toggleSelection = (category, value) => {
    setFormData((prev) => {
      const list = prev[category];
      if (list.includes(value)) {
        return { ...prev, [category]: list.filter((item) => item !== value) };
      } else {
        return { ...prev, [category]: [...list, value] };
      }
    });
    setError(""); // Clear error on selection
  };

  // Cost Logic
  const calculateEstimate = () => {
    let min = 5000;
    let max = 10000;

    // Platform Multipliers
    if (formData.projectType.includes("Web App")) {
      min += 5000;
      max += 10000;
    }
    if (formData.projectType.includes("Mobile App")) {
      min += 8000;
      max += 15000;
    }
    if (formData.projectType.includes("E-commerce")) {
      min += 4000;
      max += 8000;
    }

    // Feature Add-ons
    if (formData.features.includes("AI / Chatbot")) {
      min += 5000;
      max += 12000;
    }
    if (formData.features.includes("Payments")) {
      min += 2000;
      max += 4000;
    }
    if (formData.features.includes("User Auth")) {
      min += 1000;
      max += 2000;
    }
    if (formData.features.includes("Admin Panel")) {
      min += 3000;
      max += 6000;
    }

    return { min, max };
  };

  // Get current estimate for display
  const currentEstimate = calculateEstimate();

  // --- UPDATED: Validation Logic ---
  const handleNext = () => {
    // Validate Step 1
    if (step === 1 && formData.projectType.length === 0) {
      setError("Please select at least one project type to continue.");
      return;
    }

    // Validate Step 2
    if (step === 2 && formData.features.length === 0) {
      setError("Please select at least one feature.");
      return;
    }

    setError("");
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const estimate = calculateEstimate();

    try {
      const leadsRef = ref(database, "leadMagnets/projectEstimator");
      await push(leadsRef, {
        ...formData,
        estimatedMin: estimate.min,
        estimatedMax: estimate.max,
        timestamp: serverTimestamp(),
        source: "estimator-tool",
        status: "new",
      });

      fetch("/api/send-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, estimate }),
      });

      router.push(
        `/thank-you-estimate?min=${estimate.min}&max=${estimate.max}`,
      );
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  // Display only: what is picked so far
  const picked = [...formData.projectType, ...formData.features];

  const check = (box) => (
    <span
      className={`rs2-opt__check${box ? " rs2-opt__check--box" : ""}`}
      aria-hidden="true"
    >
      <Check strokeWidth={3} />
    </span>
  );

  return (
    <>
      <Head>
        <title>Project Cost Estimator | Aicyro Solutions</title>
      </Head>

      <Navbar />

      <main id="main">
        <section className="ax-pagehero ax-pagehero--center" aria-labelledby="est-title">
          <span className="ax-gridbg" aria-hidden="true" />
          <div className="ax-container ax-pagehero__inner">
            <ul className="ax-crumbs ax-rise" style={{ "--i": 0 }}>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-current="page">Project Cost Estimator</li>
            </ul>
            <p className="ax-eyebrow ax-rise" style={{ "--i": 1 }}>
              <span>Free tool</span>
            </p>
            <h1 id="est-title" className="ax-h1 ax-rise" style={{ "--i": 2 }}>
              Project Cost <span className="ax-grad">Estimator</span>
            </h1>
            <ul className="rs2-facts ax-rise" aria-label="How it works" style={{ "--i": 3 }}>
              {STEP_LABELS.map((label, i) => (
                <li key={label} className="ax-chip">
                  <span className="ax-num" aria-hidden="true">{i + 1}</span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ax-section pt-0" aria-label="Estimator">
          <div className="ax-container rs2-calc">
            {/* Live range and progress, held beside the steps */}
            <aside className="rs2-aside" aria-label="Estimated Range">
              <div className="rs2-stat">
                <p className="rs2-stat__label">Estimated Range</p>
                <p className="rs2-figure" aria-live="polite">
                  <span>${currentEstimate.min.toLocaleString()}</span> -{" "}
                  <span>${currentEstimate.max.toLocaleString()}</span>
                </p>
                <div className="rs2-progress">
                  <div className="rs2-progress__row">
                    <span>Step {step} of 4</span>
                    <b>{STEP_LABELS[step - 1]}</b>
                  </div>
                  <div
                    className="rs2-meter"
                    role="progressbar"
                    aria-valuemin={1}
                    aria-valuemax={4}
                    aria-valuenow={step}
                    aria-label={`Step ${step} of 4`}
                  >
                    <span style={{ "--p": step / 4 }} />
                  </div>
                </div>
                {picked.length > 0 && (
                  <ul className="rs2-picked" aria-label="Selected">
                    {picked.map((p) => (
                      <li key={p} className="ax-chip">
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>

            <form onSubmit={handleSubmit} className="rs2-main ax-card ax-spot rs2-tool">
              <ol className="rs2-stepper" aria-label="Steps">
                {STEP_LABELS.map((label, i) => {
                  const n = i + 1;
                  const state = n < step ? "done" : n === step ? "current" : "todo";
                  return (
                    <li
                      key={label}
                      data-state={state}
                      aria-current={state === "current" ? "step" : undefined}
                    >
                      <span className="rs2-stepper__dot" aria-hidden="true">
                        {state === "done" ? <Check strokeWidth={3} /> : n}
                      </span>
                      <span className="rs2-stepper__label">{label}</span>
                    </li>
                  );
                })}
              </ol>

              {/* STEP 1: PLATFORM */}
              {step === 1 && (
                <fieldset className="rs2-fieldset" aria-describedby="est-error">
                  <legend className="rs2-tool__head">
                    <h2 className="ax-h3">What are we building?</h2>
                    <span className="block ax-meta">Select at least one option.</span>
                  </legend>

                  <div className="rs2-choices">
                    {[
                      {
                        id: "Web App",
                        icon: Monitor,
                        desc: "SaaS, Dashboard, Portal",
                      },
                      {
                        id: "Mobile App",
                        icon: Smartphone,
                        desc: "iOS & Android",
                      },
                      {
                        id: "E-commerce",
                        icon: Globe,
                        desc: "Online Store, Marketplace",
                      },
                      {
                        id: "Internal Tool",
                        icon: Database,
                        desc: "CRM, ERP, Workflow",
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <label key={item.id} className="rs2-choice">
                          <input
                            type="checkbox"
                            name="projectType"
                            value={item.id}
                            checked={formData.projectType.includes(item.id)}
                            onChange={() => toggleSelection("projectType", item.id)}
                          />
                          <span className="rs2-opt">
                            <span className="rs2-opt__tile" aria-hidden="true">
                              <Icon />
                            </span>
                            <span className="rs2-opt__text">
                              <b>{item.id}</b>
                              <small>{item.desc}</small>
                            </span>
                            {check(true)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {/* STEP 2: FEATURES */}
              {step === 2 && (
                <fieldset className="rs2-fieldset" aria-describedby="est-error">
                  <legend className="rs2-tool__head">
                    <h2 className="ax-h3">Key Features?</h2>
                    <span className="block ax-meta">Select the functionalities you need.</span>
                  </legend>

                  <div className="rs2-choices rs2-choices--3">
                    {[
                      "User Auth",
                      "Payments",
                      "Admin Panel",
                      "AI / Chatbot",
                      "Search / Filter",
                      "Real-time Chat",
                      "File Uploads",
                      "Analytics",
                      "3rd Party API",
                    ].map((feature) => {
                      const Icon = FEATURE_ICONS[feature];
                      return (
                        <label key={feature} className="rs2-choice">
                          <input
                            type="checkbox"
                            name="features"
                            value={feature}
                            checked={formData.features.includes(feature)}
                            onChange={() => toggleSelection("features", feature)}
                          />
                          <span className="rs2-opt rs2-opt--compact">
                            {Icon && (
                              <span className="rs2-opt__tile" aria-hidden="true">
                                <Icon />
                              </span>
                            )}
                            <span className="rs2-opt__text">{feature}</span>
                            {check(true)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {/* STEP 3: TIMELINE & BUDGET */}
              {step === 3 && (
                <div className="rs2-fieldset">
                  <h2 className="ax-h3">Timeline &amp; Budget</h2>

                  <fieldset className="rs2-choices rs2-choices--4 rs2-choices--pair">
                    <legend className="ax-label">Ideal Timeline</legend>
                    {["< 2 months", "3-6 months", "6+ months", "ASAP"].map(
                      (opt) => {
                        const Icon = TIMELINE_ICONS[opt];
                        return (
                          <label key={opt} className="rs2-choice">
                            <input
                              type="radio"
                              name="timeline"
                              value={opt}
                              checked={formData.timeline === opt}
                              onChange={() =>
                                setFormData({ ...formData, timeline: opt })
                              }
                            />
                            <span className="rs2-opt rs2-opt--stack">
                              {Icon && (
                                <span className="rs2-opt__tile" aria-hidden="true">
                                  <Icon />
                                </span>
                              )}
                              <span className="rs2-opt__text">
                                <b>{opt}</b>
                              </span>
                              {check(false)}
                            </span>
                          </label>
                        );
                      },
                    )}
                  </fieldset>

                  <div className="ax-field">
                    <label htmlFor="est-budget" className="ax-label">
                      Rough Budget Range
                    </label>
                    <select
                      id="est-budget"
                      className="ax-select"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                    >
                      <option value="$5k - $10k">$5k - $10k (MVP)</option>
                      <option value="$10k - $25k">
                        $10k - $25k (Standard)
                      </option>
                      <option value="$25k - $50k">
                        $25k - $50k (Advanced)
                      </option>
                      <option value="$50k+">$50k+ (Enterprise)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 4: CONTACT */}
              {step === 4 && (
                <div className="rs2-fieldset">
                  <div className="rs2-tool__head">
                    <h2 className="ax-h3">Final Step</h2>
                    <p className="ax-meta">Where should we send the estimate?</p>
                  </div>

                  <div className="rs2-fields">
                    <div className="ax-field">
                      <label htmlFor="est-name" className="ax-label">
                        Your Name
                      </label>
                      <input
                        id="est-name"
                        required
                        type="text"
                        autoComplete="name"
                        className="ax-input"
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="ax-field">
                      <label htmlFor="est-email" className="ax-label">
                        Work Email
                      </label>
                      <input
                        id="est-email"
                        required
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        className="ax-input"
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="ax-field">
                    <label htmlFor="est-details" className="ax-label">
                      Any specific details? (Optional)
                    </label>
                    <textarea
                      id="est-details"
                      className="ax-textarea"
                      onChange={(e) =>
                        setFormData({ ...formData, details: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Validation message */}
              <p id="est-error" className="ax-help ax-help--error" role="alert">
                {error}
              </p>

              {/* NAVIGATION BUTTONS */}
              <div className="rs2-actions">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="ax-btn ax-btn--quiet"
                  >
                    <ArrowLeft size={18} aria-hidden="true" /> Back
                  </button>
                ) : (
                  <div /> // Spacer
                )}

                {step < 4 ? (
                  <button
                    key="next"
                    type="button"
                    onClick={handleNext}
                    className="ax-btn"
                  >
                    Next Step <ArrowRight size={18} aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    key="submit"
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                    className="ax-btn"
                  >
                    {loading ? "Calculating…" : "Get My Estimate"}{" "}
                    <Calculator size={18} aria-hidden="true" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ProjectEstimate;
