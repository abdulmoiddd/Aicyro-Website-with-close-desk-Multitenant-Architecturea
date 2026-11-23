import React, { useState } from "react";
import Link from "next/link"; // Changed to next/link
import { Server, Database, Workflow, Zap, Briefcase, ArrowRight, ArrowUpRight } from "lucide-react";
import { trackGlow, pad } from "./glow";

// --- DATA ---
export const CAPABILITIES_DATA = [
  { id: 1, title: "DevOps & Cloud Security", icon: Server, description: "Streamlined CI/CD pipelines, container orchestration (Docker/Kubernetes), and infrastructure-as-code (Terraform) secured with industry-best practices." },
  { id: 2, title: "Data Engineering", icon: Database, description: "ETL pipelines, data warehousing solutions, and real-time analytics architectures designed to turn raw data into actionable business insights." },
  { id: 3, title: "System Architecture", icon: Workflow, description: "Expert guidance on microservices adoption, legacy system migration, and designing scalable, fault-tolerant architectures for high-traffic applications." },
  { id: 4, title: "Performance Optimization", icon: Zap, description: "Deep-dive analysis into bottlenecks, database query optimization, load balancing strategies, and frontend performance tuning to reduce latency." },
  { id: 5, title: "Technical Advisory", icon: Briefcase, description: "Strategic technology roadmapping, vendor selection, and CTO-level guidance to align technical decisions with your long-term business goals." },
];

// Obsidian: a switcher on the band. The five areas as numbered rows on the left (the
// chosen one lit with the accent rail), the chosen one set large in a glass card on the
// right with its index as a ghost numeral; same state, same contact links.
const AdditionalCapabilitiesTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const active = CAPABILITIES_DATA[activeTab];
  const ActiveIcon = active.icon;

  return (
    <section id="capabilities" className="ax-band svc-sec svc-capab" aria-labelledby="capabilities-title">
      <div className="ax-container">
        <div className="ob-head ob-head--row" data-reveal>
          <div>
            <p className="ob-eyebrow">02 / Specialisms</p>
            <h2 id="capabilities-title" className="ax-h2">
              Capabilities
            </h2>
          </div>
          <p className="ax-lead">Select a specialized area to learn more.</p>
        </div>

        <div className="svc-capab__grid">
          {/* LEFT COLUMN: NAVIGATION LIST */}
          <div
            className="svc-capab__tabs"
            role="tablist"
            aria-label="Capabilities"
            aria-orientation="vertical"
            data-reveal
            style={{ "--i": 1 }}
          >
            {CAPABILITIES_DATA.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`capab-tab-${item.id}`}
                aria-selected={activeTab === index}
                aria-controls="capab-panel"
                onClick={() => setActiveTab(index)}
                className="svc-capab__tab"
              >
                <span className="svc-capab__n" aria-hidden="true">
                  {pad(index + 1)}
                </span>
                <item.icon size={20} aria-hidden="true" />
                <span className="svc-capab__label">{item.title}</span>
                <ArrowRight size={18} aria-hidden="true" className="svc-capab__chev" />
              </button>
            ))}
          </div>

          {/* RIGHT COLUMN: CONTENT DISPLAY */}
          <div
            className="ob-card svc-capab__panel"
            role="tabpanel"
            id="capab-panel"
            aria-labelledby={`capab-tab-${active.id}`}
            onPointerMove={trackGlow}
            data-reveal
            style={{ "--i": 2 }}
          >
            <span className="svc-capab__ghost" aria-hidden="true">
              {pad(activeTab + 1)}
            </span>
            <div key={activeTab} className="svc-capab__body">
              <span className="svc-icon svc-icon--l">
                <ActiveIcon size={26} aria-hidden="true" className="svc-capab__icon" />
              </span>
              <h3 className="svc-capab__title">{active.title}</h3>
              <p className="ax-lead">{active.description}</p>
            </div>

            <div className="svc-capab__foot">
              {/* CHANGED TO LINK TO CONTACT PAGE WITH PARAMS */}
              <Link
                href={`/contact?service=others&sub=${encodeURIComponent(active.title)}`}
                className="svc-capab__link"
              >
                <span>Learn more about {active.title.split(" ")[0]}</span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <span className="svc-capab__count" aria-hidden="true">
                {pad(activeTab + 1)} / {pad(CAPABILITIES_DATA.length)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdditionalCapabilitiesTabs;
