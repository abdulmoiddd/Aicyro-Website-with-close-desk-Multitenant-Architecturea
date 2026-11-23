import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, CircleCheck, FileText } from "lucide-react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";
import Seo from "../../components/Essntials/Seo";

// Firebase
import { ref, push, serverTimestamp } from "firebase/database";
import { database } from "../../lib/firebase12";

// Hallmark redesign: the checklist is a working control. Each safeguard is a real
// checkbox in a hairline list; the live score is held beside it. The scoring, the
// lead write and the submitted state are unchanged.
const checklistSections = [
  {
    category: "Authentication & Access Control",
    items: [
      { id: "mfa", label: "Multi-Factor Authentication (MFA) enforced for all team and admin accounts", critical: true },
      { id: "rbac", label: "Granular Role-Based Access Control (RBAC) with principle of least privilege", critical: true },
      { id: "sessions", label: "Secure session management (HTTP-only, secure, SameSite cookies with strict TTL)", critical: false },
      { id: "password_policy", label: "Strong password policies with brute-force rate-limiting and account lockouts", critical: false },
    ],
  },
  {
    category: "Data Protection & Encryption",
    items: [
      { id: "aes256", label: "AES-256 encryption at rest for databases, backups, and file storage", critical: true },
      { id: "tls13", label: "TLS 1.3 enforced for all data in transit with strict HTTPS redirect", critical: true },
      { id: "pii_masking", label: "PII masking and tokenization for customer-identifiable information", critical: true },
      { id: "backup_dr", label: "Automated, encrypted daily backups with tested disaster recovery plan", critical: false },
    ],
  },
  {
    category: "API & Infrastructure Security",
    items: [
      { id: "rate_limiting", label: "API rate limiting and DDoS protection (Cloudflare / WAF)", critical: true },
      { id: "input_validation", label: "Strict server-side input validation and SQL/NoSQL injection sanitization", critical: true },
      { id: "cors", label: "Strict CORS policies restricted to authorized production domains only", critical: false },
      { id: "secrets", label: "Zero secrets/keys in code; centralized vault (AWS Secrets Manager / Doppler)", critical: true },
    ],
  },
  {
    category: "Compliance & Monitoring",
    items: [
      { id: "audit_logs", label: "Immutable audit logging for all authentication and privileged actions", critical: true },
      { id: "vuln_scan", label: "Automated dependency vulnerability scanning (Dependabot / Snyk) in CI/CD", critical: false },
      { id: "soc2_ready", label: "SOC2 / GDPR / HIPAA privacy controls documented and reviewed", critical: false },
      { id: "incident_resp", label: "Documented Incident Response Plan with defined severity escalation", critical: false },
    ],
  },
];

const SecurityChecklistPage = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleItem = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalItems = checklistSections.reduce((acc, s) => acc + s.items.length, 0);
  const completedItems = Object.values(checkedItems).filter(Boolean).length;
  const scorePercent = Math.round((completedItems / totalItems) * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const leadsRef = ref(database, "leadMagnets/securityChecklist");
      await push(leadsRef, {
        ...formData,
        score: scorePercent,
        completedCount: completedItems,
        totalCount: totalItems,
        checkedItems,
        timestamp: serverTimestamp(),
        source: "security-checklist-page",
        status: "new",
      });

      setSubmitted(true);
      setLoading(false);
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitted(true);
      setLoading(false);
    }
  };

  // Same thresholds as the old score ring
  const scoreTone = scorePercent >= 70 ? "success" : scorePercent >= 40 ? "warn" : "danger";

  return (
    <>
      <Seo
        title="Ultimate SaaS Security Checklist | Aicyro Solutions"
        description="Audit your SaaS security posture. Verify encryption, RBAC, API protection, and SOC2/HIPAA readiness before launch."
        url="/resources/security-checklist"
        keywords="SaaS security checklist, cybersecurity audit, SOC2 readiness, cloud security, Aicyro Solutions"
      />

      <Navbar />

      <main id="main">
        {/* Banner */}
        <header className="ax-container rs-banner">
          <h1 className="ax-h1--s">The Ultimate SaaS Security Checklist</h1>
          <p className="ax-lead">
            70% of breaches happen due to missed configuration steps. Check off each safeguard below to calculate your current security score and export your remediation roadmap.
          </p>
          <p className="rs-note">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>For CTOs, Founders &amp; Dev Teams</span>
          </p>
        </header>

        {/* Checklist beside the live score */}
        <section className="ax-section pt-0" aria-label="Checklist">
          <div className="ax-container rs-calc">
            <aside className="rs-aside ax-well" aria-labelledby="score-title">
              <h2 id="score-title" className="ax-label">Your Security Score</h2>
              <p className="rs-figure rs-figure--xl ax-num" aria-live="polite">
                {scorePercent}%
              </p>
              <div
                className={`rs-progress rs-progress--${scoreTone}`}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={scorePercent}
                aria-labelledby="score-title"
              >
                <span style={{ "--p": scorePercent / 100 }} />
              </div>
              <p className="ax-meta ax-num">
                {completedItems} of {totalItems} safeguards active
              </p>
              <p>
                <span className="ax-chip">
                  {scorePercent >= 80 ? "Audit-Ready" : scorePercent >= 50 ? "Moderate Risk" : "High Vulnerability"}
                </span>
              </p>
            </aside>

            <div className="rs-main">
              {checklistSections.map((section, sIdx) => (
                <div key={sIdx} className="rs-check-group">
                  <h2>{section.category}</h2>
                  <ul className="rs-check-list">
                    {section.items.map((item) => {
                      const isChecked = !!checkedItems[item.id];
                      return (
                        <li key={item.id}>
                          <label className="rs-check">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleItem(item.id)}
                            />
                            <span>{item.label}</span>
                            {item.critical ? (
                              <span className="rs-tag rs-tag--danger">Critical</span>
                            ) : (
                              <span aria-hidden="true" />
                            )}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lead Capture & Custom Report */}
        <section className="ax-band" aria-labelledby="plan-title">
          <div className="ax-container ax-split">
            {!submitted ? (
              <>
                <div className="grid gap-6 content-start self-start">
                  <h2 id="plan-title" className="ax-h2">
                    Get Your Custom Action Plan
                  </h2>
                  <p className="ax-lead">
                    Enter your details to receive a prioritized remediation roadmap tailored to your SaaS architecture.
                  </p>
                  <p className="rs-note">
                    <FileText size={16} aria-hidden="true" />
                    <span>Free Security Remediation Report</span>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6">
                  <div className="ax-field">
                    <label htmlFor="sc-name" className="ax-label">Full Name</label>
                    <input
                      id="sc-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="ax-input"
                    />
                  </div>
                  <div className="ax-field">
                    <label htmlFor="sc-email" className="ax-label">Work Email</label>
                    <input
                      id="sc-email"
                      type="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="ax-input"
                    />
                  </div>
                  <div className="ax-field">
                    <label htmlFor="sc-company" className="ax-label">Company Name</label>
                    <input
                      id="sc-company"
                      type="text"
                      autoComplete="organization"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="ax-input"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      aria-busy={loading}
                      className="ax-btn max-sm:w-full max-sm:whitespace-normal max-sm:py-3 max-sm:text-center"
                    >
                      {loading ? "Generating Report…" : (<><span className="hidden sm:inline">Download Action Plan &amp; Book Security Review</span><span className="sm:hidden">Download Action Plan</span></>)}
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="grid gap-6 content-start self-start" role="status">
                  <CircleCheck size={24} className="text-success" aria-hidden="true" />
                  <h2 id="plan-title" className="ax-h2">Checklist Submitted!</h2>
                  <p className="ax-lead">
                    Thank you {formData.name}. Our security team will review your posture ({scorePercent}% score) and email you a customized security remediation roadmap.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 self-center">
                  <Link href="/contact" className="ax-btn">
                    Book Free Security Consultation
                  </Link>
                  <Link
                    href="/services/cybersecurity-data-protection"
                    className="ax-btn ax-btn--quiet"
                  >
                    Explore Security Services
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default SecurityChecklistPage;
