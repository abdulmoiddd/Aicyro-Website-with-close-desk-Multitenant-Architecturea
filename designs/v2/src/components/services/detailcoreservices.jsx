import React from "react";
import Link from "next/link";
import { Bot, ShieldCheck, Terminal, ArrowUpRight } from "lucide-react";

// --- DATA CONFIGURATION ---
const DETAILED_SERVICES = [
  {
    id: "ai",
    title: "AI Solutions & Automation",
    subtitle: "Intelligence that scales.",
    icon: Bot,
    subServices: [
      { title: "AI model integration" },
      { title: "Workflow automation" },
      { title: "Chatbots and copilots" },
      { title: "Predictive analytics" },
      { title: "Intelligent dashboards" },
    ],
  },
  {
    id: "security",
    title: "Cybersecurity Services",
    subtitle: "Defense in depth.",
    icon: ShieldCheck,
    subServices: [
      { title: "Penetration testing" },
      { title: "Vulnerability assessments" },
      { title: "Threat monitoring" },
      { title: "Security audits" },
      { title: "Compliance support (ISO, SOC)" },
    ],
  },
  {
    id: "dev",
    title: "Custom Software Development",
    subtitle: "Built for performance.",
    icon: Terminal,
    subServices: [
      { title: "SaaS development" },
      { title: "MVP development" },
      { title: "API integrations" },
      { title: "Cloud-native applications" },
      { title: "System modernization" },
    ],
  },
];

// Redesign v3 (Aurora Studio): three glass cards, each with a solid icon tile, its
// line and its five sub-services as link rows. Every row still opens the contact
// form pre-filled.
const ServiceColumn = ({ service, index }) => {
  const Icon = service.icon;
  return (
    <article
      className="ax-card ax-spot svc-core__col"
      data-reveal
      style={{ "--i": index }}
      aria-labelledby={`core-${service.id}`}
    >
      <div className="svc-core__head">
        <span className="ax-icon-tile ax-icon-tile--solid" aria-hidden="true">
          <Icon />
        </span>
        <h3 id={`core-${service.id}`} className="ax-h3 svc-core__title">
          {service.title}
        </h3>
        <p className="ax-meta">{service.subtitle}</p>
      </div>

      <ul className="svc-core__list">
        {service.subServices.map((item, idx) => (
          <li key={idx}>
            <Link href={`/contact?service=${service.id}&sub=${encodeURIComponent(item.title)}`}>
              <span>{item.title}</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
};

const DetailedCoreServices = () => {
  return (
    <section className="ax-band svc-core" aria-labelledby="core-services-title">
      <div className="ax-container">
        <div className="ax-head" data-reveal>
          <p className="ax-eyebrow">
            <span>Core practice</span>
          </p>
          <h2 id="core-services-title" className="ax-h2">
            Core <span className="ax-grad">Services</span>
          </h2>
        </div>

        <div className="svc-core__grid">
          {DETAILED_SERVICES.map((service, index) => (
            <ServiceColumn key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailedCoreServices;
