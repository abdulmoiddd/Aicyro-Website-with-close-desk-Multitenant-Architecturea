"use client";

// Hallmark redesign: a grid. Six services on a band, three across with the icon inline,
// then the technologies the studio builds with (teckstack.jsx) at the foot.
import React from "react";
import {
  Code2,
  Bot,
  Rocket,
  MonitorSmartphone,
  CloudCog,
  ShieldCheck,
} from "lucide-react";
import TechStack from "./teckstack";

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
        <div className="ax-head">
          <h2 id="services-title" className="ax-h2">End-to-End Technical Expertise</h2>
        </div>

        <ul className="hm-grid3">
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
  return (
    <li data-reveal style={{ "--i": index }}>
      <h3 className="ax-h3 hm-grid3__title">
        {service.icon}
        <span>{service.title}</span>
      </h3>
      <p className="ax-body">{service.desc}</p>
    </li>
  );
};

export default ServicesSection;
