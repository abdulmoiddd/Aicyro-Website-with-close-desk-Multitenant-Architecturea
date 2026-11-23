import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation"; // 1. Import useRouter
import { Send, Mail, CalendarClock, ArrowRight } from "lucide-react";

import { ref, onValue, push, serverTimestamp } from "firebase/database";
import { database } from "../../lib/firebase12";

// Redesign v3 (Aurora Studio): the page hero (the CMS heading, its last word in the
// brand gradient, and line), then the form in a card beside a column of contact-method
// cards. Every field, handler and the write to `inquiries` are unchanged; only the
// markup and classes moved.

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
      <section className="ax-pagehero ab-hero" aria-busy="true">
        <span className="ax-gridbg" aria-hidden="true" />
        <div className="ax-container ax-pagehero__inner">
          <span className="ab-skel ab-skel--h" aria-hidden="true" />
          <span className="ab-skel ab-skel--p" aria-hidden="true" />
          <div className="ab-hero__status" role="status">
            <span className="keep-motion ab-spinner motion-safe:animate-spin" aria-hidden="true" />
            <p className="ax-meta">Loading…</p>
          </div>
        </div>
      </section>
    );
  }

  const { formContent } = contactData || {};

  // One phrase of the CMS heading in the brand gradient: its last word
  const heading = String(formContent?.heading || "Contact Us").trim();
  const headingWords = heading.split(/\s+/);
  const headingLead = headingWords.slice(0, -1).join(" ");
  const headingLast = headingWords[headingWords.length - 1];

  return (
    <>
      <section className="ax-pagehero ab-hero" aria-labelledby="contact-title">
        <span className="ax-gridbg" aria-hidden="true" />
        <div className="ax-container ax-pagehero__inner">
          <nav aria-label="Breadcrumb" className="ax-rise">
            <ul className="ax-crumbs">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-current="page">Contact</li>
            </ul>
          </nav>

          <p className="ax-eyebrow ax-rise" style={{ "--i": 1 }}>
            <span>Contact</span>
          </p>

          <h1 id="contact-title" className="ax-h1--s ax-rise" style={{ "--i": 2 }}>
            {headingLead ? `${headingLead} ` : null}
            <span className="ax-grad">{headingLast}</span>
          </h1>
          <p className="ax-lead ax-rise" style={{ "--i": 3 }}>
            {formContent?.subHeading || "We’d love to hear from you."}
          </p>
        </div>
      </section>

      <section className="ax-section" aria-label="Ways to reach Aicyro">
        <div className="ax-container ab-duo">
          {/* THE FORM */}
          <form onSubmit={handleSubmit} className="ax-card ab-form" data-reveal>
            <div className="ab-form__grid">
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

              <div className="ax-field ab-span">
                <label htmlFor="contact-company" className="ax-label">Company name</label>
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
              </div>

              {/* SUB SERVICE DROPDOWN */}
              <div className="ax-field">
                <label htmlFor="contact-sub" className="ax-label">Specific service</label>
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
              </div>

              <div className="ax-field ab-span">
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

            {/* Error Message Only (Success handled by redirect) */}
            <p className="ax-help ax-help--error" role="alert">
              {submissionStatus === "error" ? "Something went wrong. Please try again." : ""}
            </p>

            <div className="ab-form__foot">
              <button
                type="submit"
                disabled={submissionStatus === "submitting"}
                aria-busy={submissionStatus === "submitting"}
                className="ax-btn"
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
          <ul className="ab-methods ab-duo__aside">
            <li className="ax-card ax-spot ab-method" data-reveal style={{ "--i": 1 }}>
              <span className="ax-icon-tile">
                <Mail aria-hidden="true" />
              </span>
              <div className="ab-method__body">
                <h2 className="ab-method__label">Email</h2>
                <ul className="ab-method__links">
                  <li>
                    <a href="mailto:info@aicyro.com" className="ax-link">info@aicyro.com</a>
                  </li>
                  <li>
                    <a href="mailto:contact@aicyro.com" className="ax-link">contact@aicyro.com</a>
                  </li>
                </ul>
              </div>
            </li>
            <li data-reveal style={{ "--i": 2 }}>
              <Link href="/MeetingScheduler" className="ax-card ax-spot ab-method">
                <span className="ax-icon-tile ax-icon-tile--solid">
                  <CalendarClock aria-hidden="true" />
                </span>
                <div className="ab-method__body">
                  <h2 className="ab-method__label">Strategy call</h2>
                  <span className="ax-link ab-method__cta">
                    Book a Strategy Call
                    <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default ContactSection;
