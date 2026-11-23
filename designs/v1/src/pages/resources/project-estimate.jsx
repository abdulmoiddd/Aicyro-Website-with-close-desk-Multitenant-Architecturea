import React, { useState } from "react";
import Head from "next/head";
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
} from "lucide-react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";

// Firebase
import { ref, push, serverTimestamp } from "firebase/database";
import { database } from "../../lib/firebase12";

// Aurora redesign: a four-step calculator in an elevated tool card with a gradient
// meter; the live range sits beside it as an ax-stats card. The steps, the cost logic, the
// validation, the lead write and the redirect are unchanged; the selection tiles
// are checkboxes and radios in the flow, and the live range is held beside the steps.
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

  return (
    <>
      <Head>
        <title>Project Cost Estimator | Aicyro Solutions</title>
      </Head>

      <Navbar />

      <main id="main">
        <section className="ax-banner ax-aurora" aria-labelledby="est-title">
          <div className="ax-container">
            <p className="ax-eyebrow">
              <span className="ax-eyebrow__dot">
                <Calculator aria-hidden="true" />
              </span>
              Free planning tool
            </p>
            <h1 id="est-title" className="ax-h1">
              Project Cost <span className="ax-gradient-text">Estimator</span>
            </h1>
          </div>
        </section>

        <section className="ax-section pt-0" aria-label="Estimator">
          <div className="ax-container rs-calc">
            {/* Live range, held beside the steps */}
            <aside className="rs-aside" aria-label="Estimated Range">
              <div className="ax-stats rs-stat-card" style={{ "--cols": 1 }}>
                <div className="rs-stat rs-stat--s">
                  <p className="rs-stat__label ax-meta">
                    <span className="ax-icon-tile">
                      <Calculator aria-hidden="true" />
                    </span>
                    Estimated Range
                  </p>
                  <b className="ax-num" aria-live="polite">
                    ${currentEstimate.min.toLocaleString()} - $
                    {currentEstimate.max.toLocaleString()}
                  </b>
                </div>
                {formData.projectType.length + formData.features.length > 0 && (
                  <div className="rs-stat">
                    <ul className="rs-chips">
                      {[...formData.projectType, ...formData.features].map((item) => (
                        <li key={item} className="ax-chip">
                          <Check size={14} aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>

            <form onSubmit={handleSubmit} className="rs-main ax-panel rs-tool">
              <div className="rs-tool__top">
                <div className="rs-tool__row">
                  <ol className="rs-dots" aria-hidden="true">
                    {[1, 2, 3, 4].map((n) => (
                      <li key={n} data-on={n <= step}>
                        {n}
                      </li>
                    ))}
                  </ol>
                  <p className="ax-meta ax-num">Step {step} of 4</p>
                </div>
                <div
                  className="rs-meter"
                  role="progressbar"
                  aria-valuemin={1}
                  aria-valuemax={4}
                  aria-valuenow={step}
                  aria-label={`Step ${step} of 4`}
                >
                  <span style={{ "--p": step / 4 }} />
                </div>
              </div>

              {/* STEP 1: PLATFORM */}
              {step === 1 && (
                <fieldset className="rs-tstep__body" aria-describedby="est-error">
                  <legend className="rs-tool__head">
                    <h2 className="ax-h3">What are we building?</h2>
                    <span className="block ax-meta">Select at least one option.</span>
                  </legend>

                  <div className="rs-picks">
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
                        <label key={item.id} className="rs-pick rs-pick--tile">
                          <input
                            type="checkbox"
                            name="projectType"
                            value={item.id}
                            checked={formData.projectType.includes(item.id)}
                            onChange={() => toggleSelection("projectType", item.id)}
                          />
                          <span>
                            <span className="ax-icon-tile">
                              <Icon aria-hidden="true" />
                            </span>
                            <span className="rs-pick__text">
                              <b>{item.id}</b>
                              <small>{item.desc}</small>
                            </span>
                            <span className="rs-pick__check" aria-hidden="true">
                              <Check strokeWidth={3} />
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {/* STEP 2: FEATURES */}
              {step === 2 && (
                <fieldset className="rs-tstep__body" aria-describedby="est-error">
                  <legend className="rs-tool__head">
                    <h2 className="ax-h3">Key Features?</h2>
                    <span className="block ax-meta">Select the functionalities you need.</span>
                  </legend>

                  <div className="rs-pills">
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
                    ].map((feature) => (
                      <label key={feature} className="rs-pick">
                        <input
                          type="checkbox"
                          name="features"
                          value={feature}
                          checked={formData.features.includes(feature)}
                          onChange={() => toggleSelection("features", feature)}
                        />
                        <span>
                          <span className="rs-pick__check" aria-hidden="true">
                            <Check strokeWidth={3} />
                          </span>
                          {feature}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {/* STEP 3: TIMELINE & BUDGET */}
              {step === 3 && (
                <div className="rs-tstep__body">
                  <h2 className="ax-h3">Timeline &amp; Budget</h2>

                  <fieldset className="rs-seg-wrap">
                    <legend className="ax-label">Ideal Timeline</legend>
                    <div className="rs-seg">
                      {["< 2 months", "3-6 months", "6+ months", "ASAP"].map(
                        (opt) => (
                          <label key={opt} className="rs-pick">
                            <input
                              type="radio"
                              name="timeline"
                              value={opt}
                              checked={formData.timeline === opt}
                              onChange={() =>
                                setFormData({ ...formData, timeline: opt })
                              }
                            />
                            <span>{opt}</span>
                          </label>
                        ),
                      )}
                    </div>
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
                <div className="rs-tstep__body">
                  <div className="rs-tool__head">
                    <h2 className="ax-h3">Final Step</h2>
                    <p className="ax-meta">Where should we send the estimate?</p>
                  </div>

                  <div className="rs-grid2">
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
                    <div className="ax-field rs-full">
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
                </div>
              )}

              {/* Validation message */}
              <p id="est-error" className="ax-help ax-help--error" role="alert">
                {error}
              </p>

              {/* NAVIGATION BUTTONS */}
              <div className="rs-tool__actions">
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
