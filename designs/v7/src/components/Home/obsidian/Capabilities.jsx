"use client";

// Obsidian home: core capabilities as an asymmetric bento (three columns). Each card is
// one link to its service page; a radial glow follows the cursor along the card borders
// (pointer position written to --mx / --my). The technologies strip runs beneath.
// Services and copy are the previous home services section's.
import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Code2, Bot, Rocket, MonitorSmartphone, CloudCog, ShieldCheck } from "lucide-react";
import TechStack from "../teckstack";

const CAPS = [
  {
    key: "ai",
    title: "AI & Machine Learning Solutions",
    desc: "Intelligent systems that automate workflows and unlock growth.",
    icon: Bot,
    href: "/services/ai-solutions",
    area: "ai",
    visual: "nodes",
  },
  {
    key: "custom",
    title: "Custom Software Development",
    desc: "Tailor-made platforms designed to improve operations and customer experience.",
    icon: Code2,
    href: "/services",
    area: "custom",
  },
  {
    key: "saas",
    title: "SaaS Product Development",
    desc: "Launch and scale your SaaS product faster with modern architecture.",
    icon: Rocket,
    href: "/services/saas-development",
    area: "saas",
  },
  {
    key: "apps",
    title: "Web & Mobile App Development",
    desc: "High-performance apps built for speed, usability, and cross-platform compatibility.",
    icon: MonitorSmartphone,
    href: "/services/web-development",
    area: "apps",
  },
  {
    key: "sec",
    title: "Cybersecurity Services",
    desc: "Protect your systems, users, and data with enterprise-grade security protocols.",
    icon: ShieldCheck,
    href: "/services/cybersecurity-data-protection",
    area: "sec",
    visual: "shield",
  },
  {
    key: "cloud",
    title: "Cloud & DevOps Engineering",
    desc: "Secure infrastructure and deployment pipelines for 99.9% uptime.",
    icon: CloudCog,
    href: "/services/cloud-devops",
    area: "cloud",
    visual: "uptime",
  },
];

function Visual({ kind }) {
  if (kind === "nodes") {
    // A small network: three layers of nodes and their links
    const L = [
      [40, [40, 90, 140]],
      [150, [25, 65, 105, 145]],
      [260, [55, 95, 135]],
      [360, [90]],
    ];
    const links = [];
    for (let i = 0; i < L.length - 1; i++)
      L[i][1].forEach((y1) => L[i + 1][1].forEach((y2) => links.push([L[i][0], y1, L[i + 1][0], y2])));
    return (
      <svg className="ob-bento__visual ob-bento__visual--nodes" viewBox="0 0 400 170" aria-hidden="true">
        {links.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
        {L.map(([x, ys]) => ys.map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={x === 360 ? 7 : 4} />))}
      </svg>
    );
  }
  if (kind === "shield") {
    return (
      <div className="ob-bento__visual ob-bento__visual--shield" aria-hidden="true">
        <span />
        <span />
        <span />
        <ShieldCheck size={34} />
      </div>
    );
  }
  if (kind === "uptime") {
    return (
      <div className="ob-bento__visual ob-bento__visual--uptime" aria-hidden="true">
        <b>99.9%</b>
        <span>uptime target</span>
        <i>
          {Array.from({ length: 28 }, (_, i) => (
            <em key={i} />
          ))}
        </i>
      </div>
    );
  }
  return null;
}

export default function Capabilities() {
  const gridRef = useRef(null);

  const onPointerMove = (e) => {
    const grid = gridRef.current;
    if (!grid) return;
    grid.querySelectorAll(".ob-card").forEach((card) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  };

  return (
    <section className="ob-section" aria-labelledby="caps-title">
      <div className="ax-container">
        <div className="ob-head">
          <p className="ob-eyebrow">02 / Capabilities</p>
          <h2 id="caps-title" className="ax-h2">
            End-to-End Technical Expertise
          </h2>
          <p className="ax-lead">
            One team from first sketch to production scale: product engineering, applied AI, cloud and security under
            one roof.
          </p>
        </div>

        <ul ref={gridRef} className="ob-bento" onPointerMove={onPointerMove}>
          {CAPS.map(({ key, title, desc, icon: Icon, href, area, visual }, i) => (
            <li key={key} className={`ob-card ob-bento__item ob-bento__item--${area}`} data-reveal style={{ "--i": i }}>
              <div className="ob-bento__top">
                <span className="ob-bento__icon">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <span className="ob-bento__num" aria-hidden="true">
                  0{i + 1}
                </span>
              </div>
              {visual && <Visual kind={visual} />}
              <div className="ob-bento__copy">
                <h3>
                  <Link href={href} className="ob-bento__link">
                    {title}
                  </Link>
                </h3>
                <p>{desc}</p>
              </div>
              <ArrowUpRight className="ob-bento__arrow" size={20} aria-hidden="true" />
            </li>
          ))}
        </ul>

        <TechStack />
      </div>
    </section>
  );
}
