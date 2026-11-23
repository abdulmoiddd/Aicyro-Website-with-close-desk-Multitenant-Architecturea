import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Check, CircleCheck, FileText } from "lucide-react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";
import Seo from "../../components/Essntials/Seo";

// Firebase
import { ref, push, serverTimestamp } from "firebase/database";
import { database } from "../../lib/firebase12";

// Obsidian redesign: the checklist is a working control. Each category is a glass card of
// real checkboxes; the live score is a ring meter held beside it (docked above the list on
// small screens). The scoring, the lead write and the submitted state are unchanged.
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
        <header className="ob-banner ob-ambient rs-hero rs-hero--s">
          <div className="ax-container">
            <div className="ob-banner__inner">
              <p className="ob-eyebrow" data-reveal>
                <ShieldCheck size={14} aria-hidden="true" />
                <span>For CTOs, Founders &amp; Dev Teams</span>
              </p>
              <h1 className="ob-banner__title" data-reveal style={{ "--i": 1 }}>
                The Ultimate SaaS Security Checklist
              </h1>
              <p className="ob-banner__lead" data-reveal style={{ "--i": 2 }}>
                70% of breaches happen due to missed configuration steps. Check off each safeguard below to calculate your current security score and export your remediation roadmap.
              </p>
            </div>
          </div>
        </header>

        {/* Checklist beside the live score */}
        <section className="rs-tool" aria-label="Checklist">
          <div className="ax-container rs-calc">
            <aside
              className="rs-aside rs-aside--dock ob-card rs-panel rs-score"
              aria-labelledby="score-title"
              data-reveal
              style={{ "--i": 1 }}
            >
              <h2 id="score-title" className="rs-kicker">Your Security Score</h2>
              <div
                className="rs-ring"
                data-tone={scoreTone}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={scorePercent}
                aria-labelledby="score-title"
                style={{ "--rs-p": scorePercent / 100 }}
              >
                <p className="rs-figure ax-num" aria-live="polite">
                  {scorePercent}%
                </p>
              </div>
              <div className="rs-score__meta">
                <p className="ax-meta ax-num">
                  {completedItems} of {totalItems} safeguards active
                </p>
                <p>
                  <span className="ax-chip rs-tone" data-tone={scoreTone}>
                    {scorePercent >= 80 ? "Audit-Ready" : scorePercent >= 50 ? "Moderate Risk" : "High Vulnerability"}
                  </span>
                </p>
              </div>
            </aside>

            <div className="rs-main rs-groups">
              {checklistSections.map((section, sIdx) => {
                const groupDone = section.items.filter((item) => checkedItems[item.id]).length;
                return (
                  <div
                    key={sIdx}
                    className="rs-check-group ob-card"
                    data-reveal
                    style={{ "--i": sIdx }}
                  >
                    <div className="rs-check-group__head">
                      <span className="rs-step__num" aria-hidden="true">
                        {String(sIdx + 1).padStart(2, "0")}
                      </span>
                      <h2>{section.category}</h2>
                      <span className="rs-check-group__count" aria-hidden="true">
                        <b>{groupDone}</b>/{section.items.length}
                      </span>
                    </div>
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
                              <span className="rs-box" aria-hidden="true">
                                <Check size={14} strokeWidth={3} />
                              </span>
                              <span className="rs-check__text">{item.label}</span>
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
                );
              })}
            </div>
          </div>
        </section>

        {/* Lead Capture & Custom Report */}
        <section className="ax-band ob-ambient rs-lead-band" aria-labelledby="plan-title">
          <div className="ax-container rs-lead">
            {!submitted ? (
              <>
                <div className="rs-lead__head" data-reveal>
                  <p className="ob-eyebrow">
                    <FileText size={14} aria-hidden="true" />
                    <span>Free Security Remediation Report</span>
                  </p>
                  <h2 id="plan-title" className="ax-h2">
                    Get Your Custom Action Plan
                  </h2>
                  <p className="ax-lead">
                    Enter your details to receive a prioritized remediation roadmap tailored to your SaaS architecture.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="ob-card rs-panel rs-form" data-reveal style={{ "--i": 1 }}>
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
                  <button
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                    className="ax-btn ax-btn--block"
                  >
                    {loading ? "Generating Report…" : (<><span className="hidden sm:inline">Download Action Plan &amp; Book Security Review</span><span className="sm:hidden">Download Action Plan</span></>)}
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="rs-lead__head" role="status">
                  <span className="rs-badge" aria-hidden="true">
                    <CircleCheck size={30} strokeWidth={1.5} />
                  </span>
                  <h2 id="plan-title" className="ax-h2">Checklist Submitted!</h2>
                  <p className="ax-lead">
                    Thank you {formData.name}. Our security team will review your posture ({scorePercent}% score) and email you a customized security remediation roadmap.
                  </p>
                </div>
                <div className="rs-lead__actions">
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
