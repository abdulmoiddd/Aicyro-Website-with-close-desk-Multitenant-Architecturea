import React, { useState, useEffect } from "react";
import CaseStudyCard from "./CaseStudyCard";
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";

// Hallmark redesign: the work is the page. The auto-scrolling marquee became a
// grid: the first project set large, the rest two across, every screenshot at
// size. The CMS read, the sort, and the loading and empty states are unchanged.
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
  });

  const [first, ...rest] = projectsData;

  return (
    <section className="pf-work" aria-labelledby="case-studies-title" aria-busy={loading}>
      <div className="ax-container">
        <div className="ax-head ax-head--split pf-work__head">
          <h2 id="case-studies-title" className="ax-h2">
            Case Studies
          </h2>
          <p className="ax-lead">Explore our proven track record.</p>
        </div>

        {loading ? (
          <div className="pf-work__loading">
            <p className="ax-meta" role="status">
              Loading Case Studies…
            </p>
            <div className="pf-grid" aria-hidden="true">
              {Array.from({ length: 4 }, (_, i) => (
                <span key={i} className="pf-skel" />
              ))}
            </div>
          </div>
        ) : projectsData.length === 0 ? (
          <p className="pf-work__empty ax-lead">No case studies available.</p>
        ) : (
          <>
            <CaseStudyCard key={`${first.id}-lead`} lead {...cardProps(first)} />
            {rest.length > 0 && (
              <ul className="pf-grid" role="list">
                {rest.map((project, index) => (
                  <li key={`${project.id}-${index}`}>
                    <CaseStudyCard index={index} {...cardProps(project)} />
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
