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

// Obsidian redesign: a four-step wizard in a glass panel (HUD, segmented meter, large
// option cards, back / next) beside a held result panel with the live range. The steps,
// the cost logic, the validation, the lead write and the redirect are unchanged; the
// selection tiles are checkboxes and radios in the flow.
const PLATFORMS = [
  { id: "Web App", icon: Monitor, desc: "SaaS, Dashboard, Portal" },
  { id: "Mobile App", icon: Smartphone, desc: "iOS & Android" },
  { id: "E-commerce", icon: Globe, desc: "Online Store, Marketplace" },
  { id: "Internal Tool", icon: Database, desc: "CRM, ERP, Workflow" },
];

// The cursor-tracking glow for the option cards (the CSS reads --mx / --my)
const glow = (e) => {
  const card = e.target?.closest?.(".rs-choice > span");
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - r.left}px`);
  card.style.setProperty("--my", `${e.clientY - r.top}px`);
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

  return (
    <>
      <Head>
        <title>Project Cost Estimator | Aicyro Solutions</title>
      </Head>

      <Navbar />

      <main id="main">
        <header className="ob-banner ob-ambient rs-hero">
          <div className="ax-container">
            <div className="ob-banner__inner">
              <p className="ob-eyebrow" data-reveal>
                Resources
              </p>
              <h1 className="ob-banner__title" data-reveal style={{ "--i": 1 }}>
                Project Cost Estimator
              </h1>
            </div>
          </div>
        </header>

        <section className="rs-tool" aria-label="Estimator">
          <div className="ax-container rs-calc">
            {/* Live range, held beside the steps (docked above them on small screens) */}
            <aside
              className="rs-aside rs-aside--dock ob-card rs-panel rs-result"
              aria-label="Estimated Range"
              data-reveal
              style={{ "--i": 2 }}
            >
              <p className="rs-kicker">Estimated Range</p>
              <p className="rs-figure rs-range ax-num" aria-live="polite">
                <span>${currentEstimate.min.toLocaleString()}</span>
                <span className="rs-range__to">
                  {" "}- ${currentEstimate.max.toLocaleString()}
                </span>
              </p>
              {formData.projectType.length + formData.features.length > 0 && (
                <ul className="rs-picks rs-hide-docked">
                  {[...formData.projectType, ...formData.features].map((pick) => (
                    <li key={pick} className="ax-chip">
                      {pick}
                    </li>
                  ))}
                </ul>
              )}
            </aside>

            <form
              onSubmit={handleSubmit}
              className="rs-main ob-card rs-panel rs-wizard"
              data-reveal
              style={{ "--i": 1 }}
            >
              <div className="rs-hud">
                <p className="rs-hud__count">Step {step} of 4</p>
                <p className="rs-hud__count" aria-hidden="true">
                  <b>{String(step).padStart(2, "0")}</b> / 04
                </p>
              </div>
              <div
                className="rs-progress rs-meter"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={4}
                aria-valuenow={step}
                aria-label={`Step ${step} of 4`}
                style={{ "--n": 4 }}
              >
                {[1, 2, 3, 4].map((n) => (
                  <i
                    key={n}
                    data-state={n < step ? "done" : n === step ? "current" : undefined}
                  />
                ))}
              </div>

              {/* STEP 1: PLATFORM */}
              {step === 1 && (
                <fieldset className="rs-q" aria-describedby="est-error">
                  <legend className="rs-stepper__head">
                    <h2 className="rs-question">What are we building?</h2>
                    <span className="block ax-meta">Select at least one option.</span>
                  </legend>

                  <div className="rs-choices rs-choices--tiles" onPointerMove={glow}>
                    {PLATFORMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <label key={item.id} className="rs-choice">
                          <input
                            type="checkbox"
                            name="projectType"
                            value={item.id}
                            checked={formData.projectType.includes(item.id)}
                            onChange={() => toggleSelection("projectType", item.id)}
                          />
                          <span>
                            <span className="rs-choice__icon" aria-hidden="true">
                              <Icon size={22} />
                            </span>
                            <span className="rs-choice__text">
                              <b>{item.id}</b>
                              <small>{item.desc}</small>
                            </span>
                            <span className="rs-mark rs-mark--box" aria-hidden="true">
                              <Check size={14} strokeWidth={3} className="rs-tick" />
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
                <fieldset className="rs-q" aria-describedby="est-error">
                  <legend className="rs-stepper__head">
                    <h2 className="rs-question">Key Features?</h2>
                    <span className="block ax-meta">Select the functionalities you need.</span>
                  </legend>

                  <div
                    className="rs-choices rs-choices--pair rs-choices--c3"
                    style={{ "--cols": 3 }}
                    onPointerMove={glow}
                  >
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
                      <label key={feature} className="rs-choice">
                        <input
                          type="checkbox"
                          name="features"
                          value={feature}
                          checked={formData.features.includes(feature)}
                          onChange={() => toggleSelection("features", feature)}
                        />
                        <span>
                          <span className="rs-choice__text">{feature}</span>
                          <span className="rs-mark rs-mark--box" aria-hidden="true">
                            <Check size={14} strokeWidth={3} className="rs-tick" />
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {/* STEP 3: TIMELINE & BUDGET */}
              {step === 3 && (
                <div className="rs-q">
                  <h2 className="rs-question">Timeline &amp; Budget</h2>

                  <fieldset
                    className="rs-choices rs-choices--pair rs-choices--c4"
                    style={{ "--cols": 4 }}
                    onPointerMove={glow}
                  >
                    <legend className="rs-legend">Ideal Timeline</legend>
                    {["< 2 months", "3-6 months", "6+ months", "ASAP"].map(
                      (opt) => (
                        <label key={opt} className="rs-choice">
                          <input
                            type="radio"
                            name="timeline"
                            value={opt}
                            checked={formData.timeline === opt}
                            onChange={() =>
                              setFormData({ ...formData, timeline: opt })
                            }
                          />
                          <span>
                            <span className="rs-choice__text">{opt}</span>
                            <span className="rs-mark" aria-hidden="true">
                              <Check size={14} strokeWidth={3} className="rs-tick" />
                            </span>
                          </span>
                        </label>
                      ),
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
                <div className="rs-q">
                  <div className="rs-stepper__head">
                    <h2 className="rs-question">Final Step</h2>
                    <p className="ax-meta">Where should we send the estimate?</p>
                  </div>

                  <div className="rs-fields">
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
                    <div className="ax-field rs-span">
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

              {/* Validation message, next to the options it is about */}
              <p id="est-error" className="ax-help ax-help--error rs-error" role="alert">
                {error}
              </p>

              {/* NAVIGATION BUTTONS */}
              <div className="rs-actions">
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
