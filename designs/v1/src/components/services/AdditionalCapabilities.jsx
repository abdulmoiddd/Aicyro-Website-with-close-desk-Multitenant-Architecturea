import React, { useState } from "react";
import Link from "next/link"; // Changed to next/link
import { ArrowRight, Server, Database, Workflow, Zap, Briefcase, Sparkles } from "lucide-react";

// --- DATA ---
const CAPABILITIES_DATA = [
  { id: 1, title: "DevOps & Cloud Security", icon: Server, description: "Streamlined CI/CD pipelines, container orchestration (Docker/Kubernetes), and infrastructure-as-code (Terraform) secured with industry-best practices." },
  { id: 2, title: "Data Engineering", icon: Database, description: "ETL pipelines, data warehousing solutions, and real-time analytics architectures designed to turn raw data into actionable business insights." },
  { id: 3, title: "System Architecture", icon: Workflow, description: "Expert guidance on microservices adoption, legacy system migration, and designing scalable, fault-tolerant architectures for high-traffic applications." },
  { id: 4, title: "Performance Optimization", icon: Zap, description: "Deep-dive analysis into bottlenecks, database query optimization, load balancing strategies, and frontend performance tuning to reduce latency." },
  { id: 5, title: "Technical Advisory", icon: Briefcase, description: "Strategic technology roadmapping, vendor selection, and CTO-level guidance to align technical decisions with your long-term business goals." },
];

// Aurora redesign: a switcher on a band. The five areas as icon-tile tab cards on
// the left, the chosen one on an elevated card on the right; same state, same contact links.
const AdditionalCapabilitiesTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const active = CAPABILITIES_DATA[activeTab];
  const ActiveIcon = active.icon;

  return (
    <section id="capabilities" className="ax-band svc-capab" aria-labelledby="capabilities-title">
      <div className="ax-container">
        <div className="ax-head ax-head--split">
          <div className="svc-head__lead">
            <p className="ax-eyebrow">
              <Sparkles aria-hidden="true" />
              Specialized areas
            </p>
            <h2 id="capabilities-title" className="ax-h2">
              Capabilities
            </h2>
          </div>
          <p className="ax-lead">Select a specialized area to learn more.</p>
        </div>

        <div className="svc-capab__grid">
          {/* LEFT COLUMN: NAVIGATION LIST */}
          <div className="svc-capab__tabs" role="tablist" aria-label="Capabilities" aria-orientation="vertical">
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
                <span className="ax-icon-tile svc-capab__tile" aria-hidden="true">
                  <item.icon aria-hidden="true" />
                </span>
                <span>{item.title}</span>
              </button>
            ))}
          </div>

          {/* RIGHT COLUMN: CONTENT DISPLAY */}
          <div
            className="ax-panel svc-capab__panel"
            role="tabpanel"
            id="capab-panel"
            aria-labelledby={`capab-tab-${active.id}`}
          >
            <div key={activeTab} className="svc-capab__body">
              <span className="ax-icon-tile ax-icon-tile--solid svc-capab__icon" aria-hidden="true">
                <ActiveIcon aria-hidden="true" />
              </span>
              <h3 className="ax-h3 svc-capab__title">{active.title}</h3>
              <p className="ax-lead">{active.description}</p>
            </div>

            <div className="svc-capab__foot">
              {/* CHANGED TO LINK TO CONTACT PAGE WITH PARAMS */}
              <Link
                href={`/contact?service=others&sub=${encodeURIComponent(active.title)}`}
                className="ax-link"
              >
                Learn more about {active.title.split(" ")[0]}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdditionalCapabilitiesTabs;
