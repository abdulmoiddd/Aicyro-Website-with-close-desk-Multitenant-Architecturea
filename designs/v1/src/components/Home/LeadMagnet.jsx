// Aurora redesign, the home page's close (2026-11-19, by request): a split brand-gradient
// band. Left: the free audit offer, its line, the three areas it names (security,
// performance, automation) and the actions (contact, the site's job; email as the quiet
// second). Right: two columns of the studio's own case-study screenshots (CMS Protfolio)
// drifting in opposite directions; decorative, hidden from screen readers, and still
// under reduced motion. Tiles keep their glass frame if an image fails.
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";
import { ArrowRight, Gauge, Mail, ShieldCheck, Sparkles, Workflow } from "lucide-react";

const AREAS = [
  { label: "Security", Icon: ShieldCheck },
  { label: "Performance", Icon: Gauge },
  { label: "Automation", Icon: Workflow },
];

const LeadMagnet = () => {
  const [shots, setShots] = useState([]);

  useEffect(() => {
    const off = onValue(
      ref(database, "Protfolio"),
      (snapshot) => {
        if (!snapshot.exists()) return;
        const list = Object.values(snapshot.val())
          .sort((a, b) => a.id - b.id)
          .map((p) => ({ src: p.imageSrc || p.imageUrl, title: p.title }))
          .filter((p) => p.src)
          .slice(0, 8);
        setShots(list);
      },
      () => setShots([]),
    );
    return () => off && off();
  }, []);

  // Two columns; each list is doubled so the drift loops without a seam
  const colA = shots.filter((_, i) => i % 2 === 0);
  const colB = shots.filter((_, i) => i % 2 === 1);

  return (
    <section className="hm-close" aria-labelledby="audit-title">
      <div className="ax-container">
        <div className="hm-cta" data-reveal>
          <div className="hm-cta__copy">
            <p className="hm-cta__eyebrow">
              <Sparkles size={16} aria-hidden="true" />
              Free audit
            </p>
            <h2 id="audit-title" className="ax-h2">
              Get a Free AI &amp; Cybersecurity Audit
            </h2>
            <p className="ax-lead">
              We review your current systems and provide actionable insights to
              improve security, performance, and automation.
            </p>

            <ul className="hm-cta__areas" aria-label="What the audit looks at">
              {AREAS.map(({ label, Icon }) => (
                <li key={label}>
                  <Icon size={16} aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>

            <div className="hm-cta__actions">
              <Link href="/contact" className="ax-btn ax-btn--light ax-btn--lg">
                Claim Free Audit
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a href="mailto:info@aicyro.com" className="ax-btn ax-btn--outline-light ax-btn--lg">
                <Mail size={18} aria-hidden="true" />
                info@aicyro.com
              </a>
            </div>
          </div>

          <div className="hm-cta__gallery" aria-hidden="true">
            {[colA, colB].map((col, c) => (
              <div key={c} className={`hm-cta__col${c === 1 ? " hm-cta__col--down" : ""}`}>
                <div className="hm-cta__track">
                  {(col.length ? [...col, ...col] : Array.from({ length: 6 }, () => null)).map((s, i) => (
                    <div key={i} className="hm-cta__tile">
                      {s && (
                        <img
                          src={s.src}
                          alt=""
                          width={640}
                          height={400}
                          loading="lazy"
                          decoding="async"
                          data-drop-on-fail=""
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
