import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation"; // 1. Import useRouter
import { Send, Mail, CalendarDays, ArrowUpRight, ChevronDown } from "lucide-react";

import { ref, onValue, push, serverTimestamp } from "firebase/database";
import { database } from "../../lib/firebase12";

// Obsidian redesign: an ambient banner (the CMS heading and line, booking and email
// as actions), then the form in a glass card beside the contact details column
// (emails, strategy call, what happens next). Every field, handler, the redirect and
// the write to `inquiries` are unchanged; only the markup and classes moved.

// --- UPDATED SERVICE DATA ---
const SERVICES_DATA = [
  {
    id: "ai",
    title: "AI Solutions & Automation",
    subServices: [
      "AI model integration",
      "Workflow automation",
      "Chatbots and copilots",
      "Predictive analytics",
      "Intelligent dashboards",
    ],
  },
  {
    id: "security",
    title: "Cybersecurity Services",
    subServices: [
      "Penetration testing",
      "Vulnerability assessments",
      "Threat monitoring",
      "Security audits",
      "Compliance support (ISO, SOC)",
    ],
  },
  {
    id: "dev",
    title: "Custom Software Development",
    subServices: [
      "SaaS development",
      "MVP development",
      "API integrations",
      "Cloud-native applications",
      "System modernization",
    ],
  },
  {
    id: "others",
    title: "Other Capabilities",
    subServices: [
      "DevOps & Cloud Security",
      "Data Engineering",
      "System Architecture",
      "Performance Optimization",
      "Technical Advisory",
    ],
  },
];

// The three steps after sending, shown beside the form
const NEXT_STEPS = [
  "Your message reaches our team.",
  "We reply by email to talk through your scope.",
  "If it helps, we set up a strategy call.",
];

// Pointer position for the glass card's border glow (.ob-card reads --mx / --my)
const trackGlow = (e) => {
  const card = e.currentTarget;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - r.left}px`);
  card.style.setProperty("--my", `${e.clientY - r.top}px`);
};

const ContactSection = () => {
  const searchParams = useSearchParams();
  const router = useRouter(); // 2. Initialize Router
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    coreService: "",
    subService: "",
    message: "",
  });

  const [submissionStatus, setSubmissionStatus] = useState("");

  // --- 1. FETCH DATA FROM FIREBASE ---
  useEffect(() => {
    const contactRef = ref(database, "contactSection");
    const unsubscribe = onValue(
      contactRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setContactData(snapshot.val());
        } else {
          setContactData({
            formContent: {
              heading: "Get in Touch",
              subHeading: "Let's build something great.",
              submitButtonText: "Send Message",
              successMessage: "Message sent!",
            },
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firebase error:", error);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  // --- 2. HANDLE URL PARAMS & AUTO-SELECT ---
  useEffect(() => {
    const serviceParam = searchParams.get("service");
    const subParam = searchParams.get("sub");

    if (serviceParam) {
      const isValidService = SERVICES_DATA.some((s) => s.id === serviceParam);
      if (isValidService) {
        setFormData((prev) => ({
          ...prev,
          coreService: serviceParam,
          subService: subParam || "",
        }));
      }
    }
  }, [searchParams]);

  // --- 3. HANDLE INPUT ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "coreService") {
      setFormData({ ...formData, coreService: value, subService: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // --- 4. HANDLE SUBMIT WITH REDIRECT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus("submitting");

    if (!formData.name || !formData.email || !formData.message) {
      setSubmissionStatus("error");
      setTimeout(() => setSubmissionStatus(""), 5000);
      return;
    }

    try {
      const inquiriesRef = ref(database, "inquiries");
      await push(inquiriesRef, {
        ...formData,
        timestamp: serverTimestamp(),
        status: "new",
      });

      setSubmissionStatus("success");

      // Clear form immediately
      setFormData({
        name: "",
        email: "",
        company: "",
        coreService: "",
        subService: "",
        message: "",
      });

      // 3. EXECUTE REDIRECT FLOW
      // Redirects to the Thank You page to track conversions
      router.push("/thank-you");
    } catch (error) {
      console.error("Error submitting form: ", error);
      setSubmissionStatus("error");
      setTimeout(() => setSubmissionStatus(""), 5000);
    }
  };

  const currentSubServices =
    SERVICES_DATA.find((s) => s.id === formData.coreService)?.subServices || [];

  if (loading) {
    return (
      <section className="ob-banner ob-ambient ct-loading" aria-busy="true">
        <div className="ax-container flex items-center gap-4" role="status">
          <span
            className="keep-motion inline-block w-6 h-6 rounded-full border-2 border-rule border-t-transparent motion-safe:animate-spin"
            aria-hidden="true"
          />
          <p className="ax-meta">Loading…</p>
        </div>
      </section>
    );
  }

  const { formContent } = contactData || {};

  return (
    <>
      <section className="ob-banner ob-ambient ab-hero ab-hero--contact" aria-labelledby="contact-title">
        <div className="ax-container ab-hero__inner">
          <div className="ab-hero__grid">
            <div className="ab-hero__head">
              <p className="ob-eyebrow" data-reveal>
                Contact
              </p>
              <h1 id="contact-title" className="ob-banner__title" data-reveal style={{ "--i": 1 }}>
                {formContent?.heading || "Contact Us"}
              </h1>
            </div>

            <div className="ab-hero__side" data-reveal style={{ "--i": 2 }}>
              <p className="ob-banner__lead">
                {formContent?.subHeading || "We’d love to hear from you."}
              </p>
              <div className="ob-banner__actions">
                <Link href="/MeetingScheduler" className="ax-btn">
                  <CalendarDays size={18} aria-hidden="true" />
                  Book a Strategy Call
                </Link>
                <a href="mailto:info@aicyro.com" className="ax-btn ax-btn--quiet">
                  <Mail size={18} aria-hidden="true" />
                  info@aicyro.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ab-section ct-section" aria-label="Ways to reach Aicyro">
        <div className="ax-container ct-grid">
          {/* THE FORM */}
          <form
            id="contact-form"
            onSubmit={handleSubmit}
            onPointerMove={trackGlow}
            className="ob-card ct-form"
            data-reveal
          >
            <div className="ct-form__head">
              <p className="ob-eyebrow">01 / Project inquiry</p>
            </div>

            <div className="ct-fields">
              <div className="ax-field">
                <label htmlFor="contact-name" className="ax-label">Full name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  className="ax-input"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="ax-field">
                <label htmlFor="contact-email" className="ax-label">Work email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  className="ax-input"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="ax-field ct-fields__full">
                <label htmlFor="contact-company" className="ax-label ct-label">
                  Company name
                  <span className="ct-optional">Optional</span>
                </label>
                <input
                  id="contact-company"
                  type="text"
                  name="company"
                  autoComplete="organization"
                  className="ax-input"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              {/* CORE SERVICE DROPDOWN */}
              <div className="ax-field">
                <label htmlFor="contact-core" className="ax-label">Core service</label>
                <div className="ct-select">
                  <select
                    id="contact-core"
                    name="coreService"
                    value={formData.coreService}
                    onChange={handleChange}
                    className="ax-select"
                  >
                    <option value="" disabled>
                      Select Core Service
                    </option>
                    {SERVICES_DATA.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={18} aria-hidden="true" />
                </div>
              </div>

              {/* SUB SERVICE DROPDOWN */}
              <div className="ax-field">
                <label htmlFor="contact-sub" className="ax-label">Specific service</label>
                <div className="ct-select">
                  <select
                    id="contact-sub"
                    name="subService"
                    value={formData.subService}
                    onChange={handleChange}
                    disabled={!formData.coreService}
                    className="ax-select"
                  >
                    <option value="" disabled>
                      Select Specific Service
                    </option>
                    {currentSubServices.map((sub, idx) => (
                      <option key={idx} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={18} aria-hidden="true" />
                </div>
              </div>

              <div className="ax-field ct-fields__full">
                <label htmlFor="contact-message" className="ax-label">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows="4"
                  className="ax-textarea"
                  placeholder="How can we help you scale?"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="ct-form__foot">
              {/* Error Message Only (Success handled by redirect) */}
              <p className="ax-help ax-help--error ct-form__error" role="alert">
                {submissionStatus === "error" ? "Something went wrong. Please try again." : ""}
              </p>

              <button
                type="submit"
                disabled={submissionStatus === "submitting"}
                aria-busy={submissionStatus === "submitting"}
                className="ax-btn ct-form__submit"
              >
                <span>
                  {submissionStatus === "submitting"
                    ? "Sending…"
                    : formContent?.submitButtonText || "Send Message"}
                </span>
                <Send size={16} aria-hidden="true" />
              </button>
            </div>
          </form>

          {/* WAYS TO REACH AICYRO */}
          <aside className="ct-aside" aria-label="Contact details">
            <dl className="ct-ways">
              <div className="ct-way" data-reveal style={{ "--i": 1 }}>
                <dt>
                  <Mail size={16} aria-hidden="true" />
                  Email
                </dt>
                <dd>
                  <a href="mailto:info@aicyro.com">
                    info@aicyro.com
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                </dd>
                <dd>
                  <a href="mailto:contact@aicyro.com">
                    contact@aicyro.com
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                </dd>
              </div>
              <div className="ct-way" data-reveal style={{ "--i": 2 }}>
                <dt>
                  <CalendarDays size={16} aria-hidden="true" />
                  Strategy call
                </dt>
                <dd>
                  <Link href="/MeetingScheduler">
                    Book a Strategy Call
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                </dd>
              </div>
            </dl>

            <div className="ct-next" data-reveal style={{ "--i": 3 }}>
              <h2 className="ab-label">What happens next</h2>
              <ol>
                {NEXT_STEPS.map((step, i) => (
                  <li key={step}>
                    <span className="ab-index" aria-hidden="true">0{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

export default ContactSection;
