import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation"; // 1. Import useRouter
import { Send } from "lucide-react";

import { ref, onValue, push, serverTimestamp } from "firebase/database";
import { database } from "../../lib/firebase12";

// Hallmark redesign: Banner (the CMS heading and line), then Form: the ways to
// reach Aicyro on the left, the fields on the right. Every field, handler and the
// write to `inquiries` are unchanged; only the markup and classes moved.

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
      <section className="ax-section" aria-busy="true">
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
      <section className="about-banner" aria-labelledby="contact-title">
        <div className="ax-container">
          <div className="ax-head ax-head--split mb-0">
            <h1 id="contact-title" className="ax-h1--s">
              {formContent?.heading || "Contact Us"}
            </h1>
            <p className="ax-lead">
              {formContent?.subHeading || "We’d love to hear from you."}
            </p>
          </div>
        </div>
      </section>

      <section className="ax-section" aria-label="Ways to reach Aicyro">
        <div className="ax-container ax-split contact-grid">
          {/* WAYS TO REACH AICYRO */}
          <dl className="contact-ways">
            <div>
              <dt>Email</dt>
              <dd>
                <a href="mailto:info@aicyro.com">info@aicyro.com</a>
              </dd>
              <dd>
                <a href="mailto:contact@aicyro.com">contact@aicyro.com</a>
              </dd>
            </div>
            <div>
              <dt>Strategy call</dt>
              <dd>
                <Link href="/MeetingScheduler">Book a Strategy Call</Link>
              </dd>
            </div>
          </dl>

          {/* THE FORM */}
          <form onSubmit={handleSubmit} className="ax-panel contact-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
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

              <div className="ax-field md:col-span-2">
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

              <div className="ax-field md:col-span-2">
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
            <p className="ax-help ax-help--error mt-4" role="alert">
              {submissionStatus === "error" ? "Something went wrong. Please try again." : ""}
            </p>

            <div className="mt-2 pt-6 border-t border-rule">
              <button
                type="submit"
                disabled={submissionStatus === "submitting"}
                aria-busy={submissionStatus === "submitting"}
                className="ax-btn w-full sm:w-auto"
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
        </div>
      </section>
    </>
  );
};

export default ContactSection;
