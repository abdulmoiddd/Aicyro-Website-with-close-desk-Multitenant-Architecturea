// Hallmark redesign: the security checklist teaser as a band (cybersecurity service
// page): the question beside the line, four of the checks it covers, and the action.
import React from "react";
import Link from "next/link";
import { ShieldCheck, FileText } from "lucide-react";

const CHECKS = [
  "Data Encryption (AES-256)",
  "Role-Based Access (RBAC)",
  "API Rate Limiting",
  "Vulnerability Scan",
];

const SecurityChecklistTeaser = () => {
  return (
    <section className="ax-band" aria-labelledby="security-checklist-title">
      <div className="ax-container ax-split hm-teaser">
        <div className="hm-teaser__head">
          <h2 id="security-checklist-title" className="ax-h2">
            Is Your SaaS Secure?
          </h2>
          <p className="ax-meta">For CTOs &amp; dev teams</p>
        </div>

        <div className="hm-teaser__body">
          <p className="ax-lead">
            70% of breaches happen due to missed configuration steps. Download our{" "}
            <strong className="font-semibold text-ink">Ultimate SaaS Security Checklist</strong>{" "}
            to audit your infrastructure, compliance (SOC2/HIPAA), and data protection before you launch.
          </p>

          <ul className="hm-teaser__list" aria-label="Security Audit">
            {CHECKS.map((label) => (
              <li key={label}>
                <ShieldCheck size={16} aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>

          <Link href="/resources/security-checklist" className="ax-btn">
            <FileText size={20} aria-hidden="true" />
            <span>Get the Checklist</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SecurityChecklistTeaser;
