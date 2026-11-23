"use client";

// The Tour · stop 05, the archive (case studies).
// The projects are filed down the left wall as big index entries; on the right a single
// lit frame stays with you and shows the picture of the entry you are standing at,
// wiping from one to the next as you walk down the list. On narrow screens each entry
// carries its own picture. Same Firebase read as before (Protfolio, sorted by id).
// A picture that fails drops away (see _app) and the entry stays as type.
import React, { useState, useEffect, useRef } from "react";
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
    const projectsRef = ref(database, "Protfolio");
    const unsubscribe = onValue(
      projectsRef,
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
      <div id="stop-archive" className="ax-section" role="status" aria-live="polite">
        <div className="ax-container hm-loading">
          <Loader2 size={24} className="animate-spin keep-motion" aria-hidden="true" />
          <span className="sr-only">Loading case studies…</span>
        </div>
      </div>
    );
  }
  if (projects.length === 0) return null;

  const cards = projects.map((project, index) => ({
    key: project.id || index,
    title: project.title || "Untitled Project",
    category: project.category || project.tag || "",
    summary: project.description || "",
    stats: project.results || "",
    imageSrc: project.imageSrc || project.imageUrl || "",
    href: toHref(project.projectUrl),
  }));

  return <Archive cards={cards} />;
};

const Archive = ({ cards }) => {
  const [active, setActive] = useState(0);
  const itemRefs = useRef([]);

  // The entry under the middle of the screen is the one on show
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const mid = window.innerHeight * 0.5;
      let now = 0;
      itemRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= mid) now = i;
      });
      setActive((a) => (a === now ? a : now));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section id="stop-archive" className="tr-archive" aria-labelledby="cases-title">
      <div className="ax-container">
        <div className="tr-head tr-head--split">
          <div className="tr-head">
            <p className="tr-sign"><span className="tr-sign__num">05</span>The archive</p>
            <h2 id="cases-title" className="tr-h2">See How We Help Companies Scale &amp; Succeed</h2>
          </div>
          <Link href="/portfolio" className="ax-btn ax-btn--quiet tr-btn">
            View All Projects <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className="tr-archive__grid">
          <ol className="tr-archive__list">
            {cards.map((c, i) => (
              <li
                key={c.key}
                ref={(el) => (itemRefs.current[i] = el)}
                className={`tr-archive__item${i === active ? " is-active" : ""}`}
              >
                {c.imageSrc && (
                  <figure className="ax-shot tr-archive__thumb">
                    <img src={c.imageSrc} alt={`Screen from ${c.title}`} width={1920} height={1080} loading="lazy" decoding="async" />
                  </figure>
                )}
                <p className="tr-archive__meta">
                  <span className="ax-num">{String(i + 1).padStart(2, "0")}</span>
                  {c.category && <span>{c.category}</span>}
                </p>
                <h3 className="tr-archive__title">
                  {c.href ? (
                    <Link href={c.href} className="tr-archive__link">
                      {c.title}
                      <ArrowUpRight className="tr-archive__arrow" aria-hidden="true" />
                    </Link>
                  ) : (
                    c.title
                  )}
                </h3>
                {c.summary && <p className="tr-archive__summary">{c.summary}</p>}
                {c.stats && (
                  <p className="tr-archive__result">
                    <b>Key Result</b> {c.stats}
                  </p>
                )}
              </li>
            ))}
          </ol>

          {/* the frame that walks with you (wide screens) */}
          <div className="tr-archive__frame" aria-hidden="true">
            <div className="tr-archive__frame-in">
              {cards.map((c, i) =>
                c.imageSrc ? (
                  <figure key={c.key} className={`ax-shot tr-archive__pic${i === active ? " is-on" : ""}`}>
                    <img src={c.imageSrc} alt="" width={1920} height={1080} decoding="async" />
                  </figure>
                ) : null
              )}
              <span className="tr-archive__label tr-sign">
                <span className="tr-sign__num">{String(active + 1).padStart(2, "0")}</span>
                {cards[active]?.title}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudySection;
