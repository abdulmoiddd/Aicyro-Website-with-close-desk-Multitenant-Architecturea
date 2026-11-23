"use client";

// HQ tour · floor 05, the showroom (case studies).
// The first projects from the CMS are on show as wall monitors: a slim bezel, the product
// on the screen, a stand, and the brief on a plaque beneath (category, title, summary,
// key result). The monitors step out as you reach them and lift on hover.
// Same Firebase read as before (Protfolio, sorted by id). A screen that fails to load
// drops away (see _app) and the plaque stays.
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, ArrowRight, ArrowUpRight } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";

const SHOW = 4;
const toHref = (url) => (url ? (url.startsWith("http") || url.startsWith("/") ? url : `/${url}`) : null);

const CaseStudySection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onValue(
      ref(database, "Protfolio"),
      (snapshot) => {
        if (snapshot.exists()) {
          const arr = Object.values(snapshot.val());
          arr.sort((a, b) => a.id - b.id);
          setProjects(arr.slice(0, SHOW));
        } else {
          setProjects([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firebase read error:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div id="hq-showroom" className="ax-section" role="status" aria-live="polite">
        <div className="ax-container hm-loading">
          <Loader2 size={24} className="animate-spin keep-motion" aria-hidden="true" />
          <span className="sr-only">Loading case studies…</span>
        </div>
      </div>
    );
  }
  if (projects.length === 0) return null;

  return (
    <section id="hq-showroom" className="hq-section hq-showroom" aria-labelledby="cases-title">
      <div className="ax-container">
        <div className="hq-head hq-head--split">
          <div className="hq-head">
            <p className="hq-floor-label"><span>05</span> Showroom</p>
            <h2 id="cases-title" className="hq-h2">See How We Help Companies Scale &amp; Succeed</h2>
          </div>
          <Link href="/portfolio" className="ax-btn ax-btn--quiet hq-btn">
            View All Projects <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <ul className="hq-monitors">
          {projects.map((project, i) => {
            const title = project.title || "Untitled Project";
            const href = toHref(project.projectUrl);
            const img = project.imageSrc || project.imageUrl || "";
            const category = project.category || project.tag || "";
            return (
              <li key={project.id || i} className="hq-monitor" data-reveal style={{ "--i": i }}>
                <div className="hq-monitor__screen">
                  <span className="hq-monitor__cam" aria-hidden="true" />
                  {img ? (
                    <figure className="ax-shot hq-monitor__shot">
                      <img src={img} alt={`Screen from ${title}`} width={1920} height={1080} loading="lazy" decoding="async" />
                    </figure>
                  ) : (
                    <span className="hq-monitor__blank" aria-hidden="true">{title}</span>
                  )}
                </div>
                <span className="hq-monitor__stand" aria-hidden="true" />
                <div className="hq-monitor__plaque">
                  <p className="hq-monitor__meta">
                    <span>Exhibit {String(i + 1).padStart(2, "0")}</span>
                    {category && <span>{category}</span>}
                  </p>
                  <h3 className="hq-monitor__title">
                    {href ? (
                      <Link href={href} className="hq-monitor__link">
                        {title} <ArrowUpRight className="hq-monitor__arrow" aria-hidden="true" />
                      </Link>
                    ) : (
                      title
                    )}
                  </h3>
                  {project.description && <p className="hq-monitor__summary">{project.description}</p>}
                  {project.results && (
                    <p className="hq-monitor__result"><b>Key result</b> {project.results}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default CaseStudySection;
