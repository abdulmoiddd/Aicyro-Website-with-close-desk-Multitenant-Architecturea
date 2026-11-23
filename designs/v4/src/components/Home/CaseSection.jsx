"use client";

// Walk-in · room 05, the exhibit (stacking cards).
// The first case studies from the CMS hang one after another on the wall. Each card is
// pinned as you reach it; the next one rises over it, leaning toward you, and lands flat,
// while the cards beneath tip back, shrink and dim like a deck. A counter and rail show
// the place in the stack. Same Firebase read as before (Protfolio, sorted by id).
// When a picture fails, its frame drops away (see _app) and the card stays as type.
// Reduced motion: the cards are a plain column.
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Loader2, ArrowRight, ArrowUpRight } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { database } from "../../lib/firebase12";

const SHOW = 4;

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
          const projectsArray = Object.values(snapshot.val());
          projectsArray.sort((a, b) => a.id - b.id);
          setProjects(projectsArray.slice(0, SHOW));
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
      <div id="room-work" className="ax-section" role="status" aria-live="polite">
        <div className="ax-container hm-loading">
          <Loader2 size={24} className="animate-spin keep-motion" aria-hidden="true" />
          <span className="sr-only">Loading case studies…</span>
        </div>
      </div>
    );
  }

  if (projects.length === 0) return null;

  // Safe data mapping (the CMS fields that exist)
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

  return (
    <section id="room-work" className="wk-exhibit" aria-labelledby="cases-title">
      <div className="ax-container wk-exhibit__head">
        <div className="ax-head">
          <p className="ax-eyebrow"><b>05</b> The work</p>
          <h2 id="cases-title" className="ax-h2">
            See How We Help Companies Scale &amp; Succeed
          </h2>
        </div>
        <Link href="/portfolio" className="ax-btn ax-btn--quiet hm-head-end">
          View All Projects <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>

      <ExhibitStack cards={cards} />
    </section>
  );
};

// --- the stack: mounted once the data is in, so its scroll target exists ---
const ExhibitStack = ({ cards }) => {
  const stackRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });

  return (
    <ol
      ref={stackRef}
      className={`ax-container wk-exhibit__stack${reduce ? " is-still" : ""}`}
      style={{ "--n": cards.length }}
    >
      {cards.map((data, i) => (
        <ExhibitCard
          key={data.key}
          data={data}
          index={i}
          total={cards.length}
          progress={scrollYProgress}
          still={!!reduce}
        />
      ))}
    </ol>
  );
};

// --- one case study, pinned in the stack ---
const ExhibitCard = ({ data, index, total, progress, still }) => {
  const href = data.url
    ? data.url.startsWith("http") || data.url.startsWith("/")
      ? data.url
      : `/${data.url}`
    : null;

  // The card is covered by the ones after it: from its own landing to the end of the stack
  const landed = index / total;
  const depth = total - 1 - index;
  const scale = useTransform(progress, [landed, 1], [1, 1 - depth * 0.06]);
  const rotateX = useTransform(progress, [landed, 1], [0, depth ? 8 : 0]);
  const overlay = useTransform(progress, [landed, 1], [0, depth * 0.18]);

  return (
    <li className="wk-exhibit__slot" style={{ "--i": index }}>
      <motion.article
        className="wk-exhibit__card"
        style={still ? undefined : { scale, rotateX }}
      >
        {data.imageSrc && (
          <figure className="ax-shot wk-exhibit__shot">
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

        <div className="wk-exhibit__body">
          <p className="wk-exhibit__count ax-num" aria-hidden="true">
            <b>{String(index + 1).padStart(2, "0")}</b> / {String(total).padStart(2, "0")}
          </p>
          {data.category && <p className="wk-exhibit__tag">{data.category}</p>}
          <h3 className="wk-exhibit__title">
            {href ? (
              <Link href={href} className="wk-exhibit__link">
                {data.title}
              </Link>
            ) : (
              data.title
            )}
          </h3>
          {data.summary && <p className="ax-body wk-exhibit__summary">{data.summary}</p>}

          {(data.challenge || data.solution || data.stats) && (
            <dl className="wk-exhibit__facts">
              {data.challenge && (
                <div>
                  <dt>Challenge</dt>
                  <dd>{data.challenge}</dd>
                </div>
              )}
              {data.solution && (
                <div>
                  <dt>Solution</dt>
                  <dd>{data.solution}</dd>
                </div>
              )}
              {data.stats && (
                <div>
                  <dt>Key Result</dt>
                  <dd>{data.stats}</dd>
                </div>
              )}
            </dl>
          )}

          {href && (
            <span className="wk-exhibit__more" aria-hidden="true">
              View case study <ArrowUpRight size={18} />
            </span>
          )}
        </div>

        {!still && <motion.span className="wk-exhibit__dim" style={{ opacity: overlay }} aria-hidden="true" />}
      </motion.article>
    </li>
  );
};

export default CaseStudySection;
