import React, { useState, useEffect, useMemo } from "react";
import CaseStudyCard from "./CaseStudyCard";
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";

// Redesign v3 (Aurora Studio): the work as a bento. A row of category chips filters
// the cards on the client (categories are the CMS `tag` of each record; no new data).
// The CMS read, the sort, and the loading and empty states are unchanged in behaviour.

// An all-caps CMS tag ("EXPERT SERVICES") is shown in sentence case.
const tidyTag = (tag) =>
  tag && tag === tag.toUpperCase() && /[A-Z]{2}/.test(tag)
    ? tag.charAt(0) + tag.slice(1).toLowerCase()
    : tag;

// Bento spans for n cards on the 6-column grid: cycles of five
// (one wide + one, then three) and a last partial row that always fills.
const bentoSpan = (i, n) => {
  const whole = Math.floor(n / 5) * 5;
  if (i < whole) {
    const cycle = Math.floor(i / 5);
    const wideAt = cycle % 2 === 0 ? 0 : 1;
    return i % 5 === wideAt ? "wide" : "";
  }
  const r = n - whole;
  const j = i - whole;
  if (r === 1) return "full";
  if (r === 2) return "half";
  if (r === 3) return "";
  return j === 0 ? "wide" : j === 1 ? "" : "half";
};

const SPAN_CLASS = { wide: "is-wide", full: "is-full", half: "is-half", "": "" };

const CaseStudiesSection = () => {
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // --- FIREBASE FETCH ---
  useEffect(() => {
    const projectsRef = ref(database, "Protfolio");
    const unsubscribe = onValue(
      projectsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const fetchedData = snapshot.val();
          const projectsArray = Object.values(fetchedData);
          projectsArray.sort((a, b) => a.id - b.id);
          setProjectsData(projectsArray);
        } else {
          setProjectsData([]);
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

  const cardProps = (project) => ({
    title: project.title,
    imageSrc: project.imageSrc,
    projectUrl: project.projectUrl,
    problem: project.problem || project.details?.problem || project.description,
    client: project.client || project.details?.client,
    solution: project.solution || project.details?.solution,
    result: project.result || project.details?.result,
    place: project.details?.country,
    duration: project.details?.duration,
    tag: tidyTag(project.tag),
  });

  // Categories in the order they first appear, each with its count
  const categories = useMemo(() => {
    const seen = new Map();
    projectsData.forEach((p) => {
      const t = tidyTag(p.tag);
      if (t) seen.set(t, (seen.get(t) || 0) + 1);
    });
    return [...seen.entries()];
  }, [projectsData]);

  const shown = filter === "all" ? projectsData : projectsData.filter((p) => tidyTag(p.tag) === filter);

  return (
    <section className="ax-section pf-work" aria-labelledby="case-studies-title" aria-busy={loading}>
      <div className="ax-container">
        <div className="ax-head ax-head--split pf-work__head">
          <h2 id="case-studies-title" className="ax-h2">
            Case <span className="ax-grad">Studies</span>
          </h2>
          <p className="ax-lead">Explore our proven track record.</p>
        </div>

        {loading ? (
          <div className="pf-work__loading">
            <p className="ax-meta" role="status">
              Loading Case Studies…
            </p>
            <ul className="ax-bento" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <li key={i} className={SPAN_CLASS[bentoSpan(i, 5)]}>
                  <span className="pf-skel" />
                </li>
              ))}
            </ul>
          </div>
        ) : projectsData.length === 0 ? (
          <p className="ax-well pf-work__empty ax-lead">No case studies available.</p>
        ) : (
          <>
            {categories.length > 1 && (
              <div className="pf-filter" role="group" aria-label="Filter case studies by category">
                <button
                  type="button"
                  className="pf-filter__btn"
                  aria-pressed={filter === "all"}
                  onClick={() => setFilter("all")}
                >
                  All
                  <span className="pf-filter__n ax-num">{projectsData.length}</span>
                </button>
                {categories.map(([name, count]) => (
                  <button
                    key={name}
                    type="button"
                    className="pf-filter__btn"
                    aria-pressed={filter === name}
                    onClick={() => setFilter(name)}
                  >
                    {name}
                    <span className="pf-filter__n ax-num">{count}</span>
                  </button>
                ))}
              </div>
            )}

            <p className="pf-sr" role="status" aria-live="polite">
              {filter === "all" ? `Showing all ${shown.length} case studies` : `Showing ${shown.length} ${filter} case studies`}
            </p>

            <ul className="ax-bento pf-bento" role="list">
              {shown.map((project, index) => {
                const span = bentoSpan(index, shown.length);
                return (
                  <li key={`${filter}-${project.id}-${index}`} className={SPAN_CLASS[span]}>
                    <CaseStudyCard
                      index={index}
                      lead={index === 0 && filter === "all"}
                      wide={span === "wide" || span === "full"}
                      {...cardProps(project)}
                    />
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </section>
  );
};

export default CaseStudiesSection;
