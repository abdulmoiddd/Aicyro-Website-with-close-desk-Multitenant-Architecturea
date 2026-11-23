// src/pages/cookie.jsx
// Redesign v3 (Aurora Studio): a page hero, then the contents (sticky glass card on
// wide screens, a disclosure on small ones) beside the policy in .ax-prose. Every
// sentence is unchanged; the section ids exist only for the contents links.
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock, ChevronDown, ListTree } from "lucide-react";
import Seo from "../components/Essntials/Seo";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";

const SECTIONS = [
  { id: "zero-tracking", title: "1. Our Zero-Tracking Commitment" },
  { id: "personalization", title: "2. How We Use Deal Personalization Cookies" },
  { id: "categories", title: "3. Categories of Cookies We Maintain" },
  { id: "control", title: "4. Your Control & Revocation Rights" },
  { id: "contact", title: "5. Contact Our Privacy Team" },
];

export default function CookiePolicy() {
  // Contents: mark the section being read (display only)
  const [activeId, setActiveId] = useState(null);
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    const els = Array.from(document.querySelectorAll(".ms-legal .ax-prose > section[id]"));
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (seen[0]) setActiveId(seen[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Seo
        title="Strict Cookie Policy | Aicyro"
        description="Learn how Aicyro strictly uses first-party cookies solely for deal personalization and core functionality without invasive third-party tracking."
      />

      <Navbar />

      <main id="main">
        <section className="ax-pagehero" aria-labelledby="cookie-title">
          <span className="ax-gridbg" aria-hidden="true" />
          <div className="ax-container ax-pagehero__inner">
            <nav aria-label="Breadcrumb" className="ax-rise" style={{ "--i": 0 }}>
              <ul className="ax-crumbs">
                <li><Link href="/">Home</Link></li>
                <li aria-current="page">Cookie Policy</li>
              </ul>
            </nav>
            <p className="ax-eyebrow ax-rise" style={{ "--i": 1 }}>
              <span>Strict Corporate Policy</span>
            </p>
            <h1 id="cookie-title" className="ax-h1--s ax-rise" style={{ "--i": 2 }}>
              Cookie <span className="ax-grad">Policy</span>
            </h1>
            <div className="ms-meta ax-rise" style={{ "--i": 3 }}>
              <span className="ax-chip">
                <CalendarClock size={14} aria-hidden="true" /> Effective Date: July 6, 2026
              </span>
            </div>
          </div>
        </section>

        <section className="ax-section pt-0" aria-label="Cookie Policy">
          <div className="ax-container ms-legal">
            <details className="ms-toc-m">
              <summary>
                <ListTree size={18} aria-hidden="true" />
                <span>On this page</span>
                <ChevronDown size={18} className="ms-toc-m__chev" aria-hidden="true" />
              </summary>
              <nav aria-label="Sections">
                <ol>
                  {SECTIONS.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`}>{s.title}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            </details>

            <nav className="ms-toc" aria-label="Sections">
              <p className="ms-toc__label">
                <ListTree size={14} aria-hidden="true" /> On this page
              </p>
              <ol>
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} aria-current={activeId === s.id ? "true" : undefined}>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="ms-legal__body">
            <div className="ax-prose">
              <section id="zero-tracking">
                <h2>1. Our Zero-Tracking Commitment</h2>
                <p>
                  At AICYRO, we operate under a strict privacy-first architecture.
                  Unlike conventional platforms,{" "}
                  <strong>
                    we do not use third-party advertising cookies, cross-site
                    trackers, or data-harvesting scripts
                  </strong>{" "}
                  (such as Meta Pixels or ad retargeting networks).
                </p>
                <p>
                  Our website uses cookies exclusively to ensure system security and
                  to customize specific AI automation deal offers based on your
                  self-selected industry and business needs.
                </p>
              </section>

              <section id="personalization">
                <h2>2. How We Use Deal Personalization Cookies</h2>
                <p>
                  When you opt into deal personalization via our consent banner, we
                  store a secure, first-party cookie containing only non-sensitive
                  workflow choices:
                </p>
                <ul>
                  <li>
                    <strong>Industry Sector:</strong> Adapts AI chatbot demo
                    templates and live previews to your sector.
                  </li>
                  <li>
                    <strong>Automation Goals:</strong> Tailors proposed package
                    tiers and integration spotlights (e.g., n8n, CRM sync).
                  </li>
                  <li>
                    <strong>Discount & Offer Tier:</strong> Locks in promotional
                    pricing customized for your business scale.
                  </li>
                </ul>
                <p className="ms-note">
                  All personalization data stays on your local browser and is
                  strictly protected with <code>SameSite=Strict</code> and{" "}
                  <code>Secure</code> flags.
                </p>
              </section>

              <section id="categories">
                <h2>3. Categories of Cookies We Maintain</h2>

                <h3>A. Essential System Cookies</h3>
                <p>
                  Required for basic website functioning, user authentication
                  sessions, and DDoS load balancing. These do not store personal
                  profiles.
                </p>

                <h3>B. Deal Personalization Cookies (Opt-In Only)</h3>
                <p>
                  Stored only when you explicitly select your industry preferences
                  on our banner. These expire automatically after 30 days or can be
                  cleared instantly from your browser settings.
                </p>
              </section>

              <section id="control">
                <h2>4. Your Control & Revocation Rights</h2>
                <p>
                  You maintain 100% control over your stored preferences. You can
                  clear or disable cookies at any time through your browser&apos;s
                  privacy settings without losing access to core website features.
                </p>
              </section>

              <section id="contact">
                <h2>5. Contact Our Privacy Team</h2>
                <address className="ax-well">
                  <strong className="block mb-2 text-lg">AICYRO Solutions</strong>
                  <span className="text-ink-2">Email: </span>
                  <a href="mailto:info@aicyro.com">info@aicyro.com</a>
                </address>
              </section>
            </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
