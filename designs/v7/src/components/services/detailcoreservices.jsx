import React from "react";
import Link from "next/link";
import { Bot, ShieldCheck, Terminal, ArrowUpRight } from "lucide-react";
import { trackGlow, pad } from "./glow";

// --- DATA CONFIGURATION ---
export const DETAILED_SERVICES = [
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

// Obsidian: three glass cards (a bento of equal weight; at tablet width the third spans
// the row with its list in two columns). Each card: icon tile, mono index, the service and
// its line, then its five sub-services as hairline rows. Every row still opens the contact
// form pre-filled.
const ServiceColumn = ({ service, index }) => {
  const Icon = service.icon;
  return (
    <article
      className="ob-card svc-core__card"
      data-reveal
      style={{ "--i": index }}
      aria-labelledby={`core-${service.id}`}
    >
      <div className="svc-core__top">
        <span className="svc-icon">
          <Icon size={22} aria-hidden="true" />
        </span>
        <span className="svc-core__num" aria-hidden="true">
          {pad(index + 1)}
        </span>
      </div>

      <div className="svc-core__head">
        <h3 id={`core-${service.id}`} className="svc-core__title">
          {service.title}
        </h3>
        <p className="svc-core__sub">{service.subtitle}</p>
      </div>

      <ul className="svc-core__list">
        {service.subServices.map((item, idx) => (
          <li key={idx}>
            <Link href={`/contact?service=${service.id}&sub=${encodeURIComponent(item.title)}`}>
              <span className="svc-core__i" aria-hidden="true">
                {pad(idx + 1)}
              </span>
              <span className="svc-core__t">{item.title}</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
};

const DetailedCoreServices = () => {
  return (
    <section id="core-services" className="ob-section svc-sec svc-core" aria-labelledby="core-services-title">
      <div className="ax-container">
        <div className="ob-head" data-reveal>
          <p className="ob-eyebrow">01 / What we build</p>
          <h2 id="core-services-title" className="ax-h2">
            Core Services
          </h2>
        </div>

        <div className="svc-core__grid" onPointerMove={trackGlow}>
          {DETAILED_SERVICES.map((service, index) => (
            <ServiceColumn key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailedCoreServices;
