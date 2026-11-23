// src/pages/cookie.jsx
// Obsidian redesign: an ob-banner head over the ambient glow, then the legal text set as
// .ax-prose beside a sticky contents list that marks the section in view. Every sentence
// is unchanged; the section ids exist only for the contents links.
import React, { useEffect } from "react";
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
  // Contents: mark the section in view (aria-current on its link). DOM only, no state.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    const links = new Map(
      Array.from(document.querySelectorAll(".rs-toc a[href^='#']")).map((a) => [
        a.getAttribute("href").slice(1),
        a,
      ]),
    );
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => a.removeAttribute("aria-current"));
          links.get(entry.target.id)?.setAttribute("aria-current", "true");
        }),
      { rootMargin: "-25% 0px -65% 0px" },
    );
    links.forEach((_, id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
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
        <header className="ob-banner ob-ambient rs-hero">
          <div className="ax-container">
            <div className="ob-banner__inner">
              <p className="ob-eyebrow" data-reveal>
                Legal
              </p>
              <h1 className="ob-banner__title" data-reveal style={{ "--i": 1 }}>
                Cookie Policy
              </h1>
              <div className="rs-hero__meta" data-reveal style={{ "--i": 2 }}>
                <span className="ax-chip">Strict Corporate Policy</span>
                <span className="ax-chip">Effective Date: July 6, 2026</span>
              </div>
            </div>
          </div>
        </header>

        <section className="rs-legal-wrap" aria-label="Cookie Policy">
          <div className="ax-container rs-legal">
            <nav className="rs-toc" aria-label="Sections">
              <p className="rs-kicker" aria-hidden="true">
                Sections
              </p>
              <ol>
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>{s.title}</a>
                  </li>
                ))}
              </ol>
            </nav>

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
                <p className="rs-legal__note">
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
                  <strong className="block text-lg">AICYRO Solutions</strong>
                  <span>
                    <span className="text-ink-2">Email: </span>
                    <a href="mailto:info@aicyro.com">info@aicyro.com</a>
                  </span>
                </address>
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
