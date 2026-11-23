import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  CircleCheck,
  FileText,
  Check,
  KeyRound,
  LockKeyhole,
  Server,
  ClipboardCheck,
  ListChecks,
} from "lucide-react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";
import Seo from "../../components/Essntials/Seo";

// Firebase
import { ref, push, serverTimestamp } from "firebase/database";
import { database } from "../../lib/firebase12";

// Redesign v3 (Aurora Studio): a page hero, then the checklist as four group cards
// of selectable safeguard rows beside a live score ring; the lead capture closes
// the page as a gradient band. The scoring, the lead write and the submitted state
// are unchanged.
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

// One icon per group, in the same order as checklistSections
const GROUP_ICONS = [KeyRound, LockKeyhole, Server, ClipboardCheck];

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
        <section className="ax-pagehero" aria-labelledby="sc-title">
          <span className="ax-gridbg" aria-hidden="true" />
          <div className="ax-container ax-pagehero__inner">
            <ul className="ax-crumbs ax-rise" style={{ "--i": 0 }}>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-current="page">SaaS Security Checklist</li>
            </ul>
            <p className="ax-eyebrow ax-rise" style={{ "--i": 1 }}>
              <span>For CTOs, Founders &amp; Dev Teams</span>
            </p>
            <h1 id="sc-title" className="ax-h1--s ax-rise" style={{ "--i": 2 }}>
              The Ultimate <span className="ax-grad">SaaS Security</span> Checklist
            </h1>
            <p className="ax-lead ax-rise" style={{ "--i": 3 }}>
              70% of breaches happen due to missed configuration steps. Check off each safeguard below to calculate your current security score and export your remediation roadmap.
            </p>
            <ul className="rs2-facts ax-rise" aria-label="Checklist" style={{ "--i": 4 }}>
              <li className="ax-chip">
                <ListChecks size={16} aria-hidden="true" />
                <span className="ax-num">{totalItems}</span> safeguards
              </li>
              <li className="ax-chip">
                <ShieldCheck size={16} aria-hidden="true" />
                <span className="ax-num">{checklistSections.length}</span> categories
              </li>
            </ul>
          </div>
        </section>

        {/* Checklist beside the live score */}
        <section className="ax-section pt-0" aria-label="Checklist">
          <div className="ax-container rs2-calc">
            <aside className="rs2-aside" aria-labelledby="score-title">
              <div className="rs2-stat justify-items-center text-center">
                <h2 id="score-title" className="rs2-stat__label">Your Security Score</h2>
                <div
                  className="rs2-ring"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={scorePercent}
                  aria-labelledby="score-title"
                  style={{ "--rs2-p": scorePercent / 100 }}
                >
                  <span className="rs2-ring__num ax-num" aria-live="polite">
                    {scorePercent}%
                  </span>
                </div>
                <p className="ax-meta ax-num">
                  {completedItems} of {totalItems} safeguards active
                </p>
                <p className="ax-chip rs2-tone" data-tone={scoreTone}>
                  {scorePercent >= 80 ? "Audit-Ready" : scorePercent >= 50 ? "Moderate Risk" : "High Vulnerability"}
                </p>
              </div>
            </aside>

            <div className="rs2-main rs2-groups">
              {checklistSections.map((section, sIdx) => {
                const Icon = GROUP_ICONS[sIdx] || ShieldCheck;
                const groupDone = section.items.filter((it) => checkedItems[it.id]).length;
                return (
                  <div key={sIdx} className="ax-card ax-spot rs2-group">
                    <div className="rs2-group__head">
                      <span className="ax-icon-tile" aria-hidden="true">
                        <Icon />
                      </span>
                      <h2>{section.category}</h2>
                      <span className="ax-chip ax-num" aria-label={`${groupDone} of ${section.items.length} checked`}>
                        {groupDone}/{section.items.length}
                      </span>
                    </div>
                    <ul className="rs2-checks">
                      {section.items.map((item) => {
                        const isChecked = !!checkedItems[item.id];
                        return (
                          <li key={item.id}>
                            <label className="rs2-check">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleItem(item.id)}
                              />
                              <span className="rs2-check__box" aria-hidden="true">
                                <Check strokeWidth={3} />
                              </span>
                              <span className="rs2-check__text">{item.label}</span>
                              {item.critical ? (
                                <span className="rs2-tag">Critical</span>
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
        <section className="ax-section" aria-labelledby="plan-title">
          <div className="ax-container">
            <div className="rs2-capture">
              {!submitted ? (
                <>
                  <div className="rs2-capture__copy">
                    <p className="ax-eyebrow">
                      <span>Free Security Remediation Report</span>
                    </p>
                    <h2 id="plan-title" className="ax-h2">
                      Get Your Custom <span className="ax-grad">Action Plan</span>
                    </h2>
                    <p className="ax-lead">
                      Enter your details to receive a prioritized remediation roadmap tailored to your SaaS architecture.
                    </p>
                    <p className="rs2-note">
                      <FileText size={16} aria-hidden="true" />
                      <span className="ax-num">Your score: {scorePercent}%</span>
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="rs2-capture__form">
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
                      className="ax-btn ax-btn--block whitespace-normal text-center"
                    >
                      {loading ? "Generating Report…" : (<><span className="hidden sm:inline">Download Action Plan &amp; Book Security Review</span><span className="sm:hidden">Download Action Plan</span></>)}
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="rs2-capture__copy" role="status">
                    <span className="ax-icon-tile ax-icon-tile--solid" aria-hidden="true">
                      <CircleCheck />
                    </span>
                    <h2 id="plan-title" className="ax-h2">Checklist <span className="ax-grad">Submitted!</span></h2>
                    <p className="ax-lead">
                      Thank you {formData.name}. Our security team will review your posture ({scorePercent}% score) and email you a customized security remediation roadmap.
                    </p>
                  </div>
                  <div className="rs2-capture__actions">
                    <Link href="/contact" className="ax-btn">
                      Book Free Security Consultation
                      <ArrowRight size={18} aria-hidden="true" />
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
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default SecurityChecklistPage;
