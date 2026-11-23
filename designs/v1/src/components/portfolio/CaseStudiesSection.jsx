import React, { useState, useEffect } from "react";
import { FolderKanban, Loader2 } from "lucide-react";
import CaseStudyCard from "./CaseStudyCard";
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";

// Aurora redesign: the work as a bento of image cards. The first project is a wide
// lead card; the rest fill rows of two (7 and 5 columns, alternating) and three.
// The CMS read, the sort, and the loading and empty states are unchanged.

// Column spans for the cards after the lead: rows of 2 and 3 in turn, and the
// last row always filled (1 card = full width, 2 = half and half).
const bentoSpans = (count) => {
  const spans = [];
  let row = 0;
  while (spans.length < count) {
    const left = count - spans.length;
    const want = row % 2 === 0 ? 2 : 3;
    const size = Math.min(want, left);
    if (size === 1) spans.push(12);
    else if (size === 2) spans.push(...(want === 2 ? (row % 4 === 0 ? [7, 5] : [5, 7]) : [6, 6]));
    else spans.push(4, 4, 4);
    row += 1;
  }
  return spans;
};

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
    category: project.category || project.tag,
  });

  const [first, ...rest] = projectsData;
  const spans = bentoSpans(rest.length);

  return (
    <section className="ax-section pf-work" aria-labelledby="case-studies-title" aria-busy={loading}>
      <div className="ax-container">
        <div className="ax-head ax-head--split">
          <div className="pf-head-start">
            <p className="ax-eyebrow">
              <FolderKanban aria-hidden="true" />
              Selected projects
            </p>
            <h2 id="case-studies-title" className="ax-h2">
              Case Studies
            </h2>
          </div>
          <p className="ax-lead">Explore our proven track record.</p>
        </div>

        {loading ? (
          <div className="pf-work__loading">
            <p className="ax-meta pf-status" role="status">
              <Loader2 size={18} className="animate-spin keep-motion" aria-hidden="true" />
              Loading Case Studies…
            </p>
            <div className="ax-bento" aria-hidden="true">
              <span className="pf-skel ax-span-12" />
              <span className="pf-skel ax-span-7" />
              <span className="pf-skel ax-span-5" />
            </div>
          </div>
        ) : projectsData.length === 0 ? (
          <div className="ax-card pf-empty">
            <span className="ax-icon-tile">
              <FolderKanban aria-hidden="true" />
            </span>
            <p className="ax-lead">No case studies available.</p>
          </div>
        ) : (
          <ul className="ax-bento pf-grid" role="list">
            <li className="ax-span-12">
              <CaseStudyCard key={`${first.id}-lead`} lead {...cardProps(first)} />
            </li>
            {rest.map((project, index) => (
              <li key={`${project.id}-${index}`} className={`ax-span-${spans[index]}`}>
                <CaseStudyCard index={index} wide={spans[index] >= 7} {...cardProps(project)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default CaseStudiesSection;
