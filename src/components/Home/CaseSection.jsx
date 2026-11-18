"use client";

// Hallmark redesign: a showcase. The hero lists the shipped work by name; this section
// shows the first three case studies as pictures, the CMS images at size, one lead
// and two beside it. Same Firebase read (Protfolio, sorted by id, first three).
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12"; // Adjust path if needed

const CaseStudySection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FIREBASE FETCHING ---
  useEffect(() => {
    const projectsRef = ref(database, "Protfolio");

    const unsubscribe = onValue(
      projectsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const fetchedData = snapshot.val();
          const projectsArray = Object.values(fetchedData);
          // Sort by ID and limit to 3 items for the homepage
          projectsArray.sort((a, b) => a.id - b.id);
          setProjects(projectsArray.slice(0, 3));
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

  // Safe Data Mapping (the CMS fields that exist: title, tag, description, image)
  const cards = projects.map((project, index) => ({
    key: project.id || index,
    title: project.title || "Untitled Project",
    category: project.category || project.tag || "",
    summary: project.description || "",
    challenge: project.problem || "",
    solution: project.solution || "",
    stats: project.results || "",
    imageSrc: project.imageSrc || project.imageUrl || "",
    url: project.projectUrl,
  }));

  const [lead, ...rest] = cards;

  return (
    <section className="ax-section" aria-labelledby="cases-title">
      <div className="ax-container">
        <div className="ax-head ax-head--split">
          <h2 id="cases-title" className="ax-h2">
            See How We Help Companies Scale &amp; Succeed
          </h2>
          <Link href="/portfolio" className="ax-btn ax-btn--quiet hm-head-end">
            View All Projects
          </Link>
        </div>

        <div className="hm-show">
          <CaseStudyCard data={lead} index={0} isLead />
          {rest.length > 0 && (
            <div className="hm-show__side">
              {rest.map((data, i) => (
                <CaseStudyCard key={data.key} data={data} index={i + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// --- SUB-COMPONENT: one case study, its picture at size ---
const CaseStudyCard = ({ data, index, isLead = false }) => {
  const href = data.url
    ? data.url.startsWith("http") || data.url.startsWith("/")
      ? data.url
      : `/${data.url}`
    : null;

  return (
    <article
      className={`hm-case${isLead ? " hm-case--lead" : ""}`}
      data-reveal
      style={{ "--i": index }}
    >
      {data.imageSrc && (
        <figure className="ax-shot">
          <img
            src={data.imageSrc}
            alt={`Screen from ${data.title}`}
            width={1920}
            height={1080}
            loading="lazy"
            decoding="async"
          />
        </figure>
      )}

      <h3 className="ax-h3">
        {href ? (
          <Link href={href} className="hm-case__link">
            {data.title}
          </Link>
        ) : (
          data.title
        )}
      </h3>

      {data.category && <p className="ax-meta">{data.category}</p>}
      {data.summary && <p className="ax-body">{data.summary}</p>}

      {(data.challenge || data.solution || data.stats) && (
        <dl className="ax-dl">
          {data.challenge && (
            <>
              <dt>Challenge</dt>
              <dd>{data.challenge}</dd>
            </>
          )}
          {data.solution && (
            <>
              <dt>Solution</dt>
              <dd>{data.solution}</dd>
            </>
          )}
          {data.stats && (
            <>
              <dt>Key Result</dt>
              <dd>{data.stats}</dd>
            </>
          )}
        </dl>
      )}
    </article>
  );
};

export default CaseStudySection;
