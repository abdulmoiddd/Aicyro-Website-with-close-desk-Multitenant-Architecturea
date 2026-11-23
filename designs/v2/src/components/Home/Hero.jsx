"use client";

// Redesign v3.1: the full-screen home hero (ui-ux-pro-max "Hero-Centric" pattern + 21st
// spotlight/grid hero and floating product frames). It fills the first screen (100dvh,
// sliding under the floating nav): the CMS copy on the left (heroSection), a 3D stage of
// the first three case-study pictures on the right (Firebase "Protfolio") that tilts with
// the pointer, a cursor-following glow, and the client-logo marquee plus a scroll cue
// pinned to the bottom edge. Colours come only from the globals.css theme variables.
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";
import {
  ArrowRight,
  ArrowDown,
  Bot,
  Briefcase,
  Cloud,
  FileText,
  Layers,
  MonitorSmartphone,
  ShieldCheck,
} from "lucide-react";
import ClientLoo from "./clienlogos";

// The studio's service lines (same names as the services section), shown as chips
// and, when no case-study picture is available, as an orbit around the stage.
const DISCIPLINES = [
  { label: "AI & Machine Learning", Icon: Bot },
  { label: "SaaS Products", Icon: Layers },
  { label: "Cybersecurity", Icon: ShieldCheck },
  { label: "Cloud & DevOps", Icon: Cloud },
  { label: "Web & Mobile", Icon: MonitorSmartphone },
];

const HeroPage = () => {
  const router = useRouter();
  const heroRef = useRef(null);

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
  const [shots, setShots] = useState([]);
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    const heroDbRef = ref(database, "heroSection");
    const off = onValue(heroDbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setHeroData({ ...defaultData, ...data });
      }
    });
    return () => off && off();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The stage: the first three case studies that have a picture (read only)
  useEffect(() => {
    const projectsRef = ref(database, "Protfolio");
    const off = onValue(
      projectsRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setShots([]);
          setProjectCount(0);
          return;
        }
        const all = Object.values(snapshot.val() || {});
        setProjectCount(all.length);
        const list = all
          .sort((a, b) => a.id - b.id)
          .map((p) => ({
            title: p.title || "",
            tag: p.category || p.tag || "",
            src: p.imageSrc || p.imageUrl || "",
            url: p.projectUrl || "",
          }))
          .filter((p) => p.src)
          .slice(0, 3);
        setShots(list);
      },
      () => setShots([])
    );
    return () => off && off();
  }, []);

  // Pointer glow and stage tilt (desktop pointers only; off under reduced motion)
  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onMove = (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        el.style.setProperty("--mx", `${x}px`);
        el.style.setProperty("--my", `${y}px`);
        el.style.setProperty("--px", (x / r.width - 0.5).toFixed(3));
        el.style.setProperty("--py", (y / r.height - 0.5).toFixed(3));
      });
    };
    const onLeave = () => {
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const hrefFor = (url) =>
    url ? (url.startsWith("http") || url.startsWith("/") ? url : `/${url}`) : "/portfolio";

  const scrollToNext = () => {
    const next = heroRef.current?.nextElementSibling;
    if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section ref={heroRef} className="ax-hero" aria-labelledby="hero-title">
      <span className="ax-hero__glow" aria-hidden="true" />
      <span className="ax-hero__orb ax-hero__orb--a" aria-hidden="true" />
      <span className="ax-hero__orb ax-hero__orb--b" aria-hidden="true" />
      <span className="ax-gridbg ax-hero__grid-bg" aria-hidden="true" />

      <div className="ax-container ax-hero__inner">
        <div className="ax-hero__copy">
          {heroData.welcomeText && (
            <p className="ax-eyebrow ax-rise" style={{ "--i": 0 }}>
              <span>{heroData.welcomeText}</span>
            </p>
          )}

          <h1 id="hero-title" className="ax-hero__title ax-rise" style={{ "--i": 1 }}>
            <span>{heroData.headingLine1}</span>
            <span className="ax-grad">{heroData.headingLine2}</span>
          </h1>

          <p className="ax-lead ax-rise" style={{ "--i": 2 }}>
            {heroData.subheading}
          </p>

          <div className="ax-hero__actions ax-rise" style={{ "--i": 3 }}>
            <button type="button" onClick={() => router.push("/contact")} className="ax-btn ax-hero__cta">
              {heroData.primaryCta}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => router.push("/resources/mvp-blueprint")}
              className="ax-btn ax-btn--quiet"
            >
              <FileText size={18} aria-hidden="true" />
              {heroData.secondaryCta}
            </button>
          </div>

          <ul className="ax-hero__disciplines ax-rise" style={{ "--i": 4 }} aria-label="What we build">
            {DISCIPLINES.map(({ label, Icon }) => (
              <li key={label}>
                <Icon size={16} aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="ax-hero__visual ax-rise" style={{ "--i": 3 }}>
          {shots.length > 0 ? (
            <div className="ax-hero__scene">
              {shots.map((shot, i) => (
                <Link
                  key={shot.src}
                  href={hrefFor(shot.url)}
                  className={`ax-hero__card ax-hero__card--${i + 1}`}
                  aria-label={`Case study: ${shot.title}`}
                >
                  <figure className="ax-shot">
                    <img
                      src={shot.src}
                      alt=""
                      width={1200}
                      height={750}
                      loading={i === 0 ? "eager" : "lazy"}
                      fetchPriority={i === 0 ? "high" : undefined}
                      decoding="async"
                    />
                  </figure>
                  {shot.title && (
                    <span className="ax-hero__card-label">
                      {shot.tag && <em>{shot.tag}</em>}
                      {shot.title}
                    </span>
                  )}
                </Link>
              ))}

              {projectCount > 0 && (
                <Link href="/portfolio" className="ax-hero__badge">
                  <span className="ax-icon-tile ax-icon-tile--solid" aria-hidden="true">
                    <Briefcase />
                  </span>
                  <span>
                    <b>{projectCount}</b> case studies
                    <small>See the portfolio</small>
                  </span>
                </Link>
              )}
            </div>
          ) : (
            <div className="ax-hero__orbit" aria-hidden="true">
              <span className="ax-hero__core" />
              {DISCIPLINES.map(({ label, Icon }, i) => (
                <span key={label} className="ax-hero__planet" style={{ "--n": i, "--count": DISCIPLINES.length }}>
                  <Icon />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="ax-hero__foot">
        <button type="button" className="ax-hero__scroll" onClick={scrollToNext}>
          <span>Scroll to explore</span>
          <ArrowDown size={16} aria-hidden="true" />
        </button>
        <div className="ax-container hm-hero-clients">
          <ClientLoo />
        </div>
      </div>
    </section>
  );
};

export default HeroPage;
