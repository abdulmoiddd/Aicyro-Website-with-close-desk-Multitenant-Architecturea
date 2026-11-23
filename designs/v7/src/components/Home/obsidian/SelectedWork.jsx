"use client";

// Obsidian home: selected work. Staggered split-screen case studies (picture one side,
// story the other, alternating), the CMS images zooming slightly on hover, discipline tags
// and the measured outcome set large. Same Firebase read as before (Protfolio, sorted by
// id, first three); loading, empty and error states kept.
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { database } from "../../../lib/firebase12";

const toHref = (url) => (url ? (url.startsWith("http") || url.startsWith("/") ? url : `/${url}`) : null);

const tagsOf = (p) =>
  String(p.category || p.tag || "")
    .split(/[,|/·]/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 3);

export default function SelectedWork() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    const unsubscribe = onValue(
      ref(database, "Protfolio"),
      (snapshot) => {
        if (snapshot.exists()) {
          const list = Object.values(snapshot.val());
          list.sort((a, b) => a.id - b.id);
          setProjects(list.slice(0, 3));
        } else {
          setProjects([]);
        }
        setStatus("ready");
      },
      (error) => {
        console.error("Firebase read error:", error);
        setStatus("error");
      }
    );
    return () => unsubscribe();
  }, []);

  if (status === "ready" && projects.length === 0) return null;

  return (
    <section className="ob-section ob-work" aria-labelledby="work-title">
      <div className="ax-container">
        <div className="ob-head ob-head--row">
          <div>
            <p className="ob-eyebrow">03 / Selected work</p>
            <h2 id="work-title" className="ax-h2">
              See How We Help Companies Scale &amp; Succeed
            </h2>
          </div>
          <Link href="/portfolio" className="ax-btn ax-btn--quiet">
            View All Projects
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        {status === "loading" && (
          <div className="ob-work__skeleton" role="status" aria-live="polite">
            <span className="sr-only">Loading case studies…</span>
            {[0, 1].map((i) => (
              <div key={i} className="ob-skel" aria-hidden="true" />
            ))}
          </div>
        )}

        {status === "error" && (
          <p className="ax-body" role="status">
            The case studies could not load right now. <Link href="/portfolio" className="ax-link">Open the portfolio</Link>.
          </p>
        )}

        {status === "ready" && (
          <ol className="ob-work__list">
            {projects.map((p, i) => {
              const href = toHref(p.projectUrl);
              const img = p.imageSrc || p.imageUrl || "";
              const title = p.title || "Untitled Project";
              const tags = tagsOf(p);
              return (
                <li key={p.id || i} className="ob-case" data-flip={i % 2 === 1 ? "true" : "false"}>
                  <figure className="ob-case__media" data-reveal>
                    {img ? (
                      <img
                        src={img}
                        alt={`Screen from ${title}`}
                        width={1600}
                        height={1000}
                        loading="lazy"
                        decoding="async"
                        data-drop-on-fail=""
                      />
                    ) : null}
                    <span className="ob-case__index" aria-hidden="true">
                      0{i + 1}
                    </span>
                  </figure>

                  <div className="ob-case__body" data-reveal style={{ "--i": 1 }}>
                    {tags.length > 0 && (
                      <ul className="ob-case__tags" aria-label="Disciplines">
                        {tags.map((t) => (
                          <li key={t} className="ax-chip">
                            {t}
                          </li>
                        ))}
                      </ul>
                    )}
                    <h3 className="ob-case__title">
                      {href ? (
                        <Link href={href} className="ob-case__link">
                          {title}
                          <ArrowUpRight size={22} aria-hidden="true" />
                        </Link>
                      ) : (
                        title
                      )}
                    </h3>
                    {p.description && <p className="ax-body">{p.description}</p>}

                    {(p.problem || p.solution) && (
                      <dl className="ob-case__dl">
                        {p.problem && (
                          <div>
                            <dt>Challenge</dt>
                            <dd>{p.problem}</dd>
                          </div>
                        )}
                        {p.solution && (
                          <div>
                            <dt>Solution</dt>
                            <dd>{p.solution}</dd>
                          </div>
                        )}
                      </dl>
                    )}

                    {p.results && (
                      <p className="ob-case__result">
                        <span>Key Result</span>
                        {p.results}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
