"use client";

// Aurora redesign: a zig-zag bento of the six services on a band, the first one
// featured, then the technologies the studio builds with (teckstack.jsx) as a strip.
import React from "react";
import {
  Code2,
  Bot,
  Rocket,
  MonitorSmartphone,
  CloudCog,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";
import TechStack from "./teckstack";

// Column spans for the zig-zag: 7/5, 5/7, 6/6
const SPANS = ["ax-span-7", "ax-span-5", "ax-span-5", "ax-span-7", "ax-span-6", "ax-span-6"];

const services = [
  {
    id: 1,
    title: "Custom Software Development",
    desc: "Tailor-made platforms designed to improve operations and customer experience.",
    icon: <Code2 size={24} aria-hidden="true" />,
  },
  {
    id: 2,
    title: "AI & Machine Learning Solutions",
    desc: "Intelligent systems that automate workflows and unlock growth.",
    icon: <Bot size={24} aria-hidden="true" />,
  },
  {
    id: 3,
    title: "SaaS Product Development",
    desc: "Launch and scale your SaaS product faster with modern architecture.",
    icon: <Rocket size={24} aria-hidden="true" />,
  },
  {
    id: 4,
    title: "Web & Mobile App Development",
    desc: "High-performance apps built for speed, usability, and cross-platform compatibility.",
    icon: <MonitorSmartphone size={24} aria-hidden="true" />,
  },
  {
    id: 5,
    title: "Cloud & DevOps Engineering",
    desc: "Secure infrastructure and deployment pipelines for 99.9% uptime.",
    icon: <CloudCog size={24} aria-hidden="true" />,
  },
  {
    id: 6,
    title: "Cybersecurity Services",
    desc: "Protect your systems, users, and data with enterprise-grade security protocols.",
    icon: <ShieldCheck size={24} aria-hidden="true" />,
  }
];

const ServicesSection = () => {
  return (
    <section className="ax-band" aria-labelledby="services-title">
      <div className="ax-container">
        <div className="ax-head ax-head--split">
          <div className="grid gap-4 justify-items-start">
            <p className="ax-eyebrow">
              <Layers3 aria-hidden="true" />
              What we build
            </p>
            <h2 id="services-title" className="ax-h2">End-to-End Technical Expertise</h2>
          </div>
          <Link href="/services" className="ax-btn ax-btn--quiet hm-head-end">
            All services
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <ul className="ax-bento">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </ul>

        <TechStack />
      </div>
    </section>
  );
};

// --- Sub-Component: one service ---
const ServiceCard = ({ service, index }) => {
  const feature = index === 0;
  return (
    <li
      className={`ax-card ax-card--hover hm-svc ${feature ? "hm-svc--feature" : ""} ${SPANS[index]}`}
      data-reveal
      style={{ "--i": index }}
    >
      <span className={`ax-icon-tile ${feature ? "ax-icon-tile--solid" : ""}`}>{service.icon}</span>
      <span className="hm-num" aria-hidden="true">0{service.id}</span>
      <h3 className="ax-h3">{service.title}</h3>
      <p className="ax-body">{service.desc}</p>
      {feature && <span className="hm-svc__lines" aria-hidden="true" />}
    </li>
  );
};

export default ServicesSection;
