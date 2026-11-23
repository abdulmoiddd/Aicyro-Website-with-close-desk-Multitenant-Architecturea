"use client";

// Redesign v3: a bento of the six services on a tinted band (two wide tiles), each with
// an icon tile and the pointer spotlight, then the tech-stack marquee (teckstack.jsx).
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
import { ArrowRight } from "lucide-react";
import TechStack from "./teckstack";

const services = [
  {
    id: 1,
    title: "Custom Software Development",
    desc: "Tailor-made platforms designed to improve operations and customer experience.",
    icon: <Code2 aria-hidden="true" />,
  },
  {
    id: 2,
    title: "AI & Machine Learning Solutions",
    desc: "Intelligent systems that automate workflows and unlock growth.",
    icon: <Bot aria-hidden="true" />,
  },
  {
    id: 3,
    title: "SaaS Product Development",
    desc: "Launch and scale your SaaS product faster with modern architecture.",
    icon: <Rocket aria-hidden="true" />,
  },
  {
    id: 4,
    title: "Web & Mobile App Development",
    desc: "High-performance apps built for speed, usability, and cross-platform compatibility.",
    icon: <MonitorSmartphone aria-hidden="true" />,
  },
  {
    id: 5,
    title: "Cloud & DevOps Engineering",
    desc: "Secure infrastructure and deployment pipelines for 99.9% uptime.",
    icon: <CloudCog aria-hidden="true" />,
  },
  {
    id: 6,
    title: "Cybersecurity Services",
    desc: "Protect your systems, users, and data with enterprise-grade security protocols.",
    icon: <ShieldCheck aria-hidden="true" />,
  }
];

// Bento rhythm: wide, narrow / narrow, wide / half, half
const SHAPE = ["is-wide", "", "", "is-wide", "is-half", "is-half"];

const ServicesSection = () => {
  return (
    <section className="ax-band" aria-labelledby="services-title">
      <div className="ax-container">
        <div className="ax-head ax-head--split">
          <div className="hm-head-stack">
            <p className="ax-eyebrow">
              <span>Services</span>
            </p>
            <h2 id="services-title" className="ax-h2">
              End-to-End <span className="ax-grad">Technical Expertise</span>
            </h2>
          </div>
          <Link href="/services" className="ax-btn ax-btn--quiet hm-head-end">
            All services
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <ul className="ax-bento hm-services">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} shape={SHAPE[index]} />
          ))}
        </ul>

        <TechStack />
      </div>
    </section>
  );
};

// --- Sub-Component: one service ---
const ServiceCard = ({ service, index, shape }) => {
  return (
    <li className={`ax-card ax-spot hm-service ${shape}`} data-reveal style={{ "--i": index }}>
      <span className="ax-icon-tile">{service.icon}</span>
      <h3 className="ax-h3">{service.title}</h3>
      <p className="ax-body">{service.desc}</p>
      <span className="hm-service__ghost" aria-hidden="true">
        {service.icon}
      </span>
    </li>
  );
};

export default ServicesSection;
