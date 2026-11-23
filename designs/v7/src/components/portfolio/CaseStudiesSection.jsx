import React, { useState, useEffect } from "react";
import CaseStudyCard from "./CaseStudyCard";
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";
import { pad2, trackGlow } from "./utils";

// Obsidian: the work is the page. The first project as a split-screen feature card,
// the rest as glass cards two across (offset columns on wide screens), every card one
// link with a cursor-tracking border glow. The CMS read, the sort, and the loading and
// empty states are unchanged.
const CaseStudiesSection = () => {
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);

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
    tag: project.tag,
  });

  const [first, ...rest] = projectsData;

  return (
    <section id="case-studies" className="pf-work" aria-labelledby="case-studies-title" aria-busy={loading}>
      <div className="ax-container" onPointerMove={trackGlow}>
        <div className="pf-work__head">
          <div className="pf-work__title">
            <p className="ob-eyebrow">
              {loading || projectsData.length === 0 ? "Index" : `Index / ${pad2(projectsData.length)} projects`}
            </p>
            <h2 id="case-studies-title" className="ax-h2">
              Case Studies
            </h2>
          </div>
          <p className="ax-lead">Explore our proven track record.</p>
        </div>

        {loading ? (
          <div className="pf-work__loading">
            <p className="ax-meta" role="status">
              Loading Case Studies…
            </p>
            <span className="pf-skel pf-skel--lead" aria-hidden="true" />
            <div className="pf-grid pf-grid--skel" aria-hidden="true">
              {Array.from({ length: 4 }, (_, i) => (
                <span key={i} className="pf-skel" />
              ))}
            </div>
          </div>
        ) : projectsData.length === 0 ? (
          <p className="pf-work__empty ax-lead">No case studies available.</p>
        ) : (
          <>
            <div className="pf-lead" data-reveal>
              <CaseStudyCard key={`${first.id}-lead`} lead number={1} {...cardProps(first)} />
            </div>
            {rest.length > 0 && (
              <ul className="pf-grid" role="list">
                {rest.map((project, index) => (
                  <li key={`${project.id}-${index}`} data-reveal style={{ "--i": index % 2 }}>
                    <CaseStudyCard number={index + 2} {...cardProps(project)} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default CaseStudiesSection;
