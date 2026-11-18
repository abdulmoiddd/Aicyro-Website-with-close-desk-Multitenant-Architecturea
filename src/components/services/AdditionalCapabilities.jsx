import React, { useState } from "react";
import Link from "next/link"; // Changed to next/link
import { Server, Database, Workflow, Zap, Briefcase } from "lucide-react";

// --- DATA ---
const CAPABILITIES_DATA = [
  { id: 1, title: "DevOps & Cloud Security", icon: Server, description: "Streamlined CI/CD pipelines, container orchestration (Docker/Kubernetes), and infrastructure-as-code (Terraform) secured with industry-best practices." },
  { id: 2, title: "Data Engineering", icon: Database, description: "ETL pipelines, data warehousing solutions, and real-time analytics architectures designed to turn raw data into actionable business insights." },
  { id: 3, title: "System Architecture", icon: Workflow, description: "Expert guidance on microservices adoption, legacy system migration, and designing scalable, fault-tolerant architectures for high-traffic applications." },
  { id: 4, title: "Performance Optimization", icon: Zap, description: "Deep-dive analysis into bottlenecks, database query optimization, load balancing strategies, and frontend performance tuning to reduce latency." },
  { id: 5, title: "Technical Advisory", icon: Briefcase, description: "Strategic technology roadmapping, vendor selection, and CTO-level guidance to align technical decisions with your long-term business goals." },
];

// Hallmark redesign: a Switcher on a change of paper. The five areas on the left,
// the chosen one set large on the right; same state, same contact links.
const AdditionalCapabilitiesTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const active = CAPABILITIES_DATA[activeTab];
  const ActiveIcon = active.icon;

  return (
    <section className="ax-band svc-capab" aria-labelledby="capabilities-title">
      <div className="ax-container">
        <div className="ax-head ax-head--split">
          <h2 id="capabilities-title" className="ax-h2">
            Capabilities
          </h2>
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
                <item.icon size={20} aria-hidden="true" />
                <span>{item.title}</span>
              </button>
            ))}
          </div>

          {/* RIGHT COLUMN: CONTENT DISPLAY */}
          <div
            className="svc-capab__panel"
            role="tabpanel"
            id="capab-panel"
            aria-labelledby={`capab-tab-${active.id}`}
          >
            <div key={activeTab} className="svc-capab__body">
              <ActiveIcon size={24} aria-hidden="true" className="svc-capab__icon" />
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
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdditionalCapabilitiesTabs;
