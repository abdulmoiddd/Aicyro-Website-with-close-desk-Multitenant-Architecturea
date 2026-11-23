"use client";

// Aurora redesign, full-screen hero (2026-11-19, by request): one viewport tall under the
// glass nav. The words still come from the CMS (heroSection): the label as a pill, the
// headline with its second line in the brand blend, the sentence, both actions and a
// trust row from the site's own claims. Beside it, the studio console steps through the
// six real practices on its own (5s each) until the visitor picks one or presses pause;
// it holds while hovered or focused and never moves under reduced motion. The client
// logos run along the bottom edge (moved here from the why section).
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  CloudCog,
  Code2,
  FileText,
  MonitorSmartphone,
  Pause,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import ClientLoo from "./clienlogos";

const STEP_MS = 5000;

// The six practices, with the words used in the services section below
const CONSOLE = [
  {
    id: "ai",
    label: "AI & ML",
    Icon: Bot,
    command: "aicyro build --practice ai-ml",
    title: "AI & Machine Learning Solutions",
    text: "Intelligent systems that automate workflows and unlock growth.",
    stack: ["Python", "PyTorch", "TensorFlow", "OpenAI"],
  },
  {
    id: "saas",
    label: "SaaS",
    Icon: Rocket,
    command: "aicyro build --practice saas",
    title: "SaaS Product Development",
    text: "Launch and scale your SaaS product faster with modern architecture.",
    stack: ["Next.js", "React", "PostgreSQL", "Tailwind CSS"],
  },
  {
    id: "custom",
    label: "Custom software",
    Icon: Code2,
    command: "aicyro build --practice custom",
    title: "Custom Software Development",
    text: "Tailor-made platforms designed to improve operations and customer experience.",
    stack: ["JavaScript", "React", "MongoDB", "GitHub"],
  },
  {
    id: "apps",
    label: "Web & mobile",
    Icon: MonitorSmartphone,
    command: "aicyro build --practice web-mobile",
    title: "Web & Mobile App Development",
    text: "High-performance apps built for speed, usability, and cross-platform compatibility.",
    stack: ["React", "Next.js", "JavaScript", "Tailwind CSS"],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    Icon: CloudCog,
    command: "aicyro deploy --practice cloud",
    title: "Cloud & DevOps Engineering",
    text: "Secure infrastructure and deployment pipelines for 99.9% uptime.",
    stack: ["GitHub", "PostgreSQL", "MongoDB", "Python"],
  },
  {
    id: "security",
    label: "Cybersecurity",
    Icon: ShieldCheck,
    command: "aicyro audit --practice security",
    title: "Cybersecurity Services",
    text: "Protect your systems, users, and data with enterprise-grade security protocols.",
    stack: ["Threat review", "Access control", "Data protection"],
  },
];

// A label typed in capitals in the CMS reads as a sentence; any other label is kept as typed
const toSentence = (s = "") =>
  s && s === s.toUpperCase() ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

const HeroPage = () => {
  const router = useRouter();

  const defaultData = {
    welcomeText: "TRUSTED BY STARTUPS & ENTERPRISES",
    headingLine1: "Custom AI-Driven Software Solutions",
    headingLine2: "That Help Businesses Scale Faster",
    subheading:
      "Aicyro builds secure, scalable web, mobile, and AI-powered applications for startups, SMBs, and enterprises worldwide.",
    primaryCta: "Get a Free Strategy Call",
    secondaryCta: "Get MVP Blueprint",
  };

  const [heroData, setHeroData] = useState(defaultData);
  const [active, setActive] = useState(0);
  // Playback: on after mount (unless reduced motion), off for good once the visitor takes over
  const [playing, setPlaying] = useState(false);
  const [held, setHeld] = useState(false); // hover or focus inside the console

  useEffect(() => {
    const heroRef = ref(database, "heroSection");
    const off = onValue(heroRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setHeroData({ ...defaultData, ...data });
      }
    });
    return () => off && off();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start playing after mount unless the visitor prefers reduced motion
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setTimeout(() => setPlaying(true), 0);
    return () => clearTimeout(id);
  }, []);

  // Step to the next practice while playing, not held, and the tab is visible
  useEffect(() => {
    if (!playing || held) return;
    const id = setTimeout(() => {
      if (document.visibilityState === "visible") setActive((i) => (i + 1) % CONSOLE.length);
    }, STEP_MS);
    return () => clearTimeout(id);
  }, [playing, held, active]);

  // On phones the tab list scrolls sideways: keep the active tab in view without moving the page
  useEffect(() => {
    const tab = document.getElementById(`console-tab-${CONSOLE[active].id}`);
    const rail = tab?.parentElement;
    if (!tab || !rail || rail.scrollWidth <= rail.clientWidth) return;
    rail.scrollTo({ left: tab.offsetLeft - rail.clientWidth / 2 + tab.offsetWidth / 2, behavior: "smooth" });
  }, [active]);

  const pick = (i) => {
    setPlaying(false);
    setActive(i);
  };

  const onTabKey = (event, index) => {
    const last = CONSOLE.length - 1;
    let next = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    pick(next);
    document.getElementById(`console-tab-${CONSOLE[next].id}`)?.focus();
  };

  const item = CONSOLE[active];
  const isLive = playing && !held;

  return (
    <section className="ax-hero ax-aurora" aria-labelledby="hero-title">
      <span className="ax-hero__spot" aria-hidden="true" />

      <div className="ax-container ax-hero__grid">
        <div className="ax-hero__copy">
          {heroData.welcomeText && (
            <p className="ax-eyebrow" data-reveal>
              <span className="ax-eyebrow__dot">
                <Sparkles aria-hidden="true" />
              </span>
              {toSentence(heroData.welcomeText)}
            </p>
          )}

          <h1 id="hero-title" className="ax-hero__title" data-reveal style={{ "--i": 1 }}>
            <span>{heroData.headingLine1}</span>
            <span className="ax-gradient-text">{heroData.headingLine2}</span>
          </h1>

          <p className="ax-lead" data-reveal style={{ "--i": 2 }}>
            {heroData.subheading}
          </p>

          <div className="ax-hero__actions" data-reveal style={{ "--i": 3 }}>
            <button type="button" onClick={() => router.push("/contact")} className="ax-btn ax-btn--lg">
              {heroData.primaryCta}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => router.push("/resources/mvp-blueprint")}
              className="ax-btn ax-btn--quiet ax-btn--lg"
            >
              <FileText size={18} aria-hidden="true" />
              {heroData.secondaryCta}
            </button>
          </div>

          <ul className="ax-hero__trust" data-reveal style={{ "--i": 4 }}>
            <li>
              <CheckCircle2 size={16} aria-hidden="true" />
              Security from day one
            </li>
            <li>
              <CheckCircle2 size={16} aria-hidden="true" />
              2-week agile sprints
            </li>
            <li>
              <CheckCircle2 size={16} aria-hidden="true" />
              Web, mobile &amp; cloud
            </li>
          </ul>
        </div>

        <div className="ax-hero__stage" data-reveal style={{ "--i": 3 }}>
          {/* Decorative badges; the same facts are in the console and the trust row */}
          <div className="ax-hero__badge ax-hero__badge--top" aria-hidden="true">
            <span className="ax-icon-tile ax-icon-tile--solid">
              <item.Icon />
            </span>
            <span>
              <small>Now building</small>
              <strong>{item.label}</strong>
            </span>
          </div>
          <div className="ax-hero__badge ax-hero__badge--bottom" aria-hidden="true">
            <span className="ax-icon-tile">
              <ShieldCheck />
            </span>
            <span>
              <small>Built in</small>
              <strong>Security from day one</strong>
            </span>
          </div>

          <div
            className="ax-console"
            data-playing={isLive ? "true" : "false"}
            style={{ "--console-step": `${STEP_MS}ms` }}
            onMouseEnter={() => setHeld(true)}
            onMouseLeave={() => setHeld(false)}
            onFocus={() => setHeld(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false);
            }}
          >
            <div className="ax-console__inner">
              <div className="ax-console__bar">
                <span className="ax-console__dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="ax-console__file">aicyro-studio</span>
                <span className="ax-console__status">Ready</span>
                <button
                  type="button"
                  className="ax-console__toggle"
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? "Pause the service tour" : "Play the service tour"}
                >
                  {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
                </button>
              </div>

              <div className="ax-console__body">
                <div className="ax-console__side" role="tablist" aria-label="What we build" aria-orientation="vertical">
                  {CONSOLE.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      role="tab"
                      id={`console-tab-${c.id}`}
                      aria-selected={active === i}
                      aria-controls="console-panel"
                      tabIndex={active === i ? 0 : -1}
                      onClick={() => pick(i)}
                      onKeyDown={(e) => onTabKey(e, i)}
                    >
                      <c.Icon aria-hidden="true" />
                      {c.label}
                    </button>
                  ))}
                </div>

                <div
                  className="ax-console__main"
                  id="console-panel"
                  role="tabpanel"
                  aria-labelledby={`console-tab-${item.id}`}
                >
                  <div className="ax-console__prompt">
                    <span aria-hidden="true">&gt;_</span>
                    <span>
                      {item.command}
                      <span className="ax-console__caret" aria-hidden="true" />
                    </span>
                    <button type="button" onClick={() => router.push("/contact")} className="ax-btn ax-btn--sm">
                      Start a project
                    </button>
                  </div>
                  <div className="ax-console__out" key={item.id}>
                    <p>
                      <strong>{item.title}</strong>
                    </p>
                    <p>{item.text}</p>
                    <ul aria-label="Built with">
                      {item.stack.map((s) => (
                        <li key={s} className="ax-chip ax-chip--accent">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ax-hero__foot">
        <div className="ax-container">
          <ClientLoo />
        </div>
      </div>
    </section>
  );
};

export default HeroPage;
