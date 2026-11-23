"use client";

// Aurora redesign, interactive showcase (2026-11-19, by request): the first six case
// studies from the CMS (Protfolio, sorted by id) as a numbered index on the left; hovering
// or focusing a row crossfades its screenshot and details into the large preview on the
// right. Every row is the case-study link itself. Under 60rem the preview gives way to
// stacked image cards. Same Firebase read, loading and empty states as before.
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, ArrowRight, ArrowUpRight, Briefcase, Clock, MapPin, Users } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12"; // Adjust path if needed

const COUNT = 6;

// A tag typed in capitals in the CMS ("EXPERT SERVICES") reads as a sentence
const toSentence = (s = "") =>
  s && s === s.toUpperCase() ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

const CaseStudySection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  // --- FIREBASE FETCHING ---
  useEffect(() => {
    const projectsRef = ref(database, "Protfolio");

    const unsubscribe = onValue(
      projectsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const fetchedData = snapshot.val();
          const projectsArray = Object.values(fetchedData);
          // Sort by ID and keep the first few for the homepage
          projectsArray.sort((a, b) => a.id - b.id);
          setProjects(projectsArray.slice(0, COUNT));
        } else {
          setProjects([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firebase read error:", error);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="ax-section" role="status" aria-live="polite">
        <div className="ax-container hm-loading">
          <Loader2 size={24} className="animate-spin keep-motion" aria-hidden="true" />
          <span className="sr-only">Loading case studies…</span>
        </div>
      </div>
    );
  }

  // If no data, hide section safely
  if (!loading && projects.length === 0) return null;

  // Safe data mapping (the CMS fields that exist: title, tag, description, image, details, techStack)
  const cards = projects.map((project, index) => {
    const url = project.projectUrl;
    const href = url ? (url.startsWith("http") || url.startsWith("/") ? url : `/${url}`) : null;
    const d = project.details || {};
    return {
      key: project.id || index,
      no: String(index + 1).padStart(2, "0"),
      title: project.title || "Untitled Project",
      category: toSentence(project.category || project.tag || ""),
      summary: project.description || "",
      challenge: project.problem || "",
      solution: project.solution || "",
      stats: project.results || "",
      imageSrc: project.imageSrc || project.imageUrl || "",
      href,
      facts: [
        d.country && { Icon: MapPin, label: "Location", value: d.country },
        d.developers && { Icon: Users, label: "Team", value: d.developers },
        d.duration && { Icon: Clock, label: "Duration", value: d.duration },
      ].filter(Boolean),
      stack: Array.isArray(project.techStack) ? project.techStack.slice(0, 4) : [],
    };
  });

  const current = cards[Math.min(active, cards.length - 1)];

  return (
    <section className="ax-section hm-work" aria-labelledby="cases-title">
      <div className="ax-container">
        <div className="ax-head ax-head--split">
          <div className="grid gap-4 justify-items-start">
            <p className="ax-eyebrow">
              <Briefcase aria-hidden="true" />
              Selected work
            </p>
            <h2 id="cases-title" className="ax-h2">
              See How We Help Companies Scale &amp; <span className="ax-gradient-text">Succeed</span>
            </h2>
          </div>
          <Link href="/portfolio" className="ax-btn ax-btn--quiet hm-head-end">
            View All Projects
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className="hm-work__grid">
          {/* The index: each row is the case-study link; hover or focus previews it */}
          <ol className="hm-work__list">
            {cards.map((c, i) => {
              const RowTag = c.href ? Link : "div";
              return (
                <li key={c.key} data-reveal style={{ "--i": i }}>
                  <RowTag
                    {...(c.href ? { href: c.href } : {})}
                    className="hm-work__row"
                    data-active={active === i ? "true" : "false"}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                  >
                    <span className="hm-work__no" aria-hidden="true">{c.no}</span>
                    <span className="hm-work__text">
                      <span className="hm-work__title">{c.title}</span>
                      {c.category && <span className="hm-work__tag">{c.category}</span>}
                    </span>
                    {c.href && (
                      <span className="hm-work__go" aria-hidden="true">
                        <ArrowUpRight size={18} />
                      </span>
                    )}
                  </RowTag>

                  {/* Phones and tablets: the row opens into its own card */}
                  <div className="hm-work__mobile">
                    {c.imageSrc && (
                      <figure className="ax-shot">
                        <img
                          src={c.imageSrc}
                          alt={`Screen from ${c.title}`}
                          width={1920}
                          height={1080}
                          loading="lazy"
                          decoding="async"
                        />
                      </figure>
                    )}
                    {c.summary && <p className="ax-body">{c.summary}</p>}
                  </div>
                </li>
              );
            })}
          </ol>

          {/* The preview: every screenshot stacked, the active one shown */}
          <div className="hm-work__preview" data-reveal style={{ "--i": 2 }}>
            <div className="hm-work__stage">
              <span className="hm-work__stage-name" aria-hidden="true">{current.title}</span>
              {cards.map((c, i) =>
                c.imageSrc ? (
                  <figure key={c.key} className="ax-shot hm-work__shot" data-active={active === i ? "true" : "false"}>
                    <img
                      src={c.imageSrc}
                      alt={active === i ? `Screen from ${c.title}` : ""}
                      width={1920}
                      height={1080}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                ) : null,
              )}
              {current.category && <span className="ax-chip hm-work__badge">{current.category}</span>}
            </div>

            <div className="hm-work__info" key={current.key}>
              <h3 className="ax-h3">{current.title}</h3>
              {current.summary && <p className="ax-body">{current.summary}</p>}

              {current.facts.length > 0 && (
                <ul className="hm-work__facts" aria-label="Project facts">
                  {current.facts.map((f) => (
                    <li key={f.label} className="ax-chip">
                      <f.Icon size={14} aria-hidden="true" />
                      <span className="sr-only">{f.label}: </span>
                      {f.value}
                    </li>
                  ))}
                </ul>
              )}

              {(current.challenge || current.solution || current.stats) && (
                <dl className="ax-dl">
                  {current.challenge && (
                    <>
                      <dt>Challenge</dt>
                      <dd>{current.challenge}</dd>
                    </>
                  )}
                  {current.solution && (
                    <>
                      <dt>Solution</dt>
                      <dd>{current.solution}</dd>
                    </>
                  )}
                  {current.stats && (
                    <>
                      <dt>Key Result</dt>
                      <dd>{current.stats}</dd>
                    </>
                  )}
                </dl>
              )}

              <div className="hm-work__foot">
                {current.stack.length > 0 && (
                  <ul className="hm-work__stack" aria-label="Built with">
                    {current.stack.map((s) => (
                      <li key={s} className="ax-chip ax-chip--accent">{s}</li>
                    ))}
                  </ul>
                )}
                {current.href && (
                  <Link href={current.href} className="ax-btn ax-btn--sm" tabIndex={-1} aria-hidden="true">
                    View case study
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudySection;
