import React from "react";
import Link from "next/link";
import { ArrowUpRight, Layers, ShieldCheck, Bot, TestTube2, Cloud, Code2, Smartphone, Blocks } from "lucide-react";

// Redesign v3 (Aurora Studio): the eight service pages as a bento of link cards.
// Names, lines and icons are the same as the services menu in the nav.
const SERVICES = [
  { name: "SaaS Development", to: "/services/saas-development", desc: "Scalable cloud software.", Icon: Layers },
  { name: "Cybersecurity", to: "/services/cybersecurity-data-protection", desc: "Protect your data.", Icon: ShieldCheck },
  { name: "AI Solutions", to: "/services/ai-solutions", desc: "Intelligent automation.", Icon: Bot },
  { name: "QA & Automation", to: "/services/qa-automation", desc: "Bug-free deployment.", Icon: TestTube2 },
  { name: "Cloud & DevOps", to: "/services/cloud-devops", desc: "Infrastructure management.", Icon: Cloud },
  { name: "Web Development", to: "/services/web-development", desc: "Modern frontend solutions.", Icon: Code2 },
  { name: "App Development", to: "/services/app-development", desc: "iOS and Android apps.", Icon: Smartphone },
  { name: "Blockchain", to: "/services/blockchain", desc: "Decentralized ledgers.", Icon: Blocks },
];

const ServicesBento = () => (
  <section id="all-services" className="ax-section svc-all" aria-labelledby="all-services-title">
    <div className="ax-container">
      <div className="ax-head ax-head--center" data-reveal>
        <p className="ax-eyebrow">
          <span>What we do</span>
        </p>
        <h2 id="all-services-title" className="ax-h2">
          Explore our <span className="ax-grad">services</span>
        </h2>
      </div>

      <ul className="ax-bento svc-all__grid">
        {SERVICES.map(({ name, to, desc, Icon }, i) => {
          const featured = i < 2;
          return (
            <li key={to} className={featured ? "is-half" : ""} data-reveal style={{ "--i": i }}>
              <Link href={to} className={`ax-card ax-spot svc-all__card ${featured ? "svc-all__card--lg" : ""}`.trim()}>
                <span className={`ax-icon-tile ${featured ? "ax-icon-tile--solid" : ""}`.trim()} aria-hidden="true">
                  <Icon />
                </span>
                <div className="svc-all__text">
                  <h3 className="ax-h3">{name}</h3>
                  <span className="ax-meta">{desc}</span>
                </div>
                <span className="svc-all__go" aria-hidden="true">
                  <ArrowUpRight size={18} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);

export default ServicesBento;
