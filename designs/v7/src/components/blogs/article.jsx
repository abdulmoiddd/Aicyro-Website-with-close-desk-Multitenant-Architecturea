// Obsidian: the one long-read template shared by every post in /blogs.
// Banner hero (Insights label, display title, lead, mono byline, framed cover), a reading
// progress hairline, the body in .ax-prose (about 70ch) beside a sticky contents rail
// that marks the section in view, then the article's own call to action as a glass panel.
// Styles: src/styles/www/blogs.css.
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import { postFor } from "./posts";

// Banner hero: the title, its lead, the byline facts, and the post's picture as a framed cover.
// The cover is the picture the Insights index shows for this route (or the cover prop);
// if it fails to load, the frame drops out (.ax-shot, see _app.jsx).
export const ArticleHero = ({ title, lead, byline = [], cover }) => {
  const { pathname } = useRouter();
  const image = cover || postFor(pathname)?.image;

  return (
    <>
      <div className="blog-progress" aria-hidden="true" />
      <header className="ob-banner ob-ambient blog-banner">
        <div className="ax-container blog-banner__grid">
          <div className="blog-banner__copy">
            <Link href="/blogs" className="blog-back" data-reveal>
              <ArrowLeft size={16} aria-hidden="true" />
              <span className="ob-eyebrow">Insights</span>
            </Link>
            <h1 className="blog-banner__title" data-reveal style={{ "--i": 1 }}>
              {title}
            </h1>
            {lead ? (
              <p className="ax-lead blog-banner__lead" data-reveal style={{ "--i": 2 }}>
                {lead}
              </p>
            ) : null}
            {byline.length ? (
              <ul className="blog-byline" data-reveal style={{ "--i": 3 }}>
                {byline.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>

          {image ? (
            <figure className="ax-shot blog-cover" data-reveal style={{ "--i": 4 }}>
              <Image
                src={image}
                alt=""
                width={1600}
                height={900}
                priority
                sizes="(max-width: 1440px) 100vw, 1320px"
              />
            </figure>
          ) : null}
        </div>
      </header>
    </>
  );
};

// Which contents entry is in view: the last heading that has crossed the upper 40%.
const useActiveSection = (ids) => {
  const [active, setActive] = useState(null);
  const key = ids.join("|");

  useEffect(() => {
    const list = key ? key.split("|") : [];
    if (!list.length || typeof IntersectionObserver === "undefined") return undefined;
    const els = list.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return undefined;
    // Fires whenever a heading crosses the upper 40% band of the viewport.
    const io = new IntersectionObserver(
      () => {
        const above = els.filter((el) => el.getBoundingClientRect().top < window.innerHeight * 0.4);
        setActive(above.length ? above[above.length - 1].id : null);
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);

  return active;
};

// The body: a sticky contents rail (desktop) beside the prose at about 70ch.
export const ArticleBody = ({ toc = [], tocLabel = "On this page", author, children }) => {
  const active = useActiveSection(toc.map((link) => link.id));

  return (
    <div className="blog-body">
      <div className="ax-container blog-article">
        <aside className="blog-article__rail">
          <div className="blog-toc">
            {toc.length ? (
              <nav aria-label={tocLabel}>
                <p className="blog-toc__label">{tocLabel}</p>
                <ol>
                  {toc.map((link, i) => (
                    <li key={link.id}>
                      <a
                        href={`#${link.id}`}
                        aria-current={active === link.id ? "location" : undefined}
                      >
                        <span className="blog-toc__num" aria-hidden="true">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}
            {author ? (
              <div className="blog-toc__author">
                <span className="blog-toc__avatar" aria-hidden="true">
                  {String(author.name || "A").trim().charAt(0)}
                </span>
                <div>
                  <p>{author.label || "Author"}</p>
                  <p>{author.name}</p>
                  {author.role ? <p>{author.role}</p> : null}
                </div>
              </div>
            ) : null}
          </div>
        </aside>
        <article className="ax-prose blog-prose">{children}</article>
      </div>
    </div>
  );
};

// A section head inside the prose, with the anchor the contents rail points at.
export const SectionHeading = ({ id, children }) => <h2 id={id}>{children}</h2>;

// A callout: a glass card, the icon in a lit tile beside its title.
export const Callout = ({ title, icon: Icon, children }) => (
  <aside className="blog-callout">
    {title ? (
      <h3 className="blog-callout__title">
        {Icon ? (
          <span className="blog-callout__icon" aria-hidden="true">
            <Icon size={18} />
          </span>
        ) : null}
        {title}
      </h3>
    ) : null}
    <div className="blog-callout__body">{children}</div>
  </aside>
);

// Named items: a term and its line, in numbered hairline rows.
export const Facts = ({ children }) => <dl className="blog-facts">{children}</dl>;
export const Fact = ({ term, children }) => (
  <div>
    <dt>{term}</dt>
    <dd>{children}</dd>
  </div>
);

// Short items as lit tiles, two across.
export const Pairs = ({ items = [] }) => (
  <ul className="blog-pairs">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

// The article's own call to action: a glass panel with the ambient glow, after the body.
export const ArticleCta = ({ id = "cta", title, lead, children, actions, note }) => (
  <section id={id} className="blog-cta" aria-labelledby={`${id}-title`}>
    <div className="ax-container">
      <div className="blog-cta__panel ob-ambient" data-reveal>
        <div className="blog-cta__body">
          <h2 id={`${id}-title`} className="blog-cta__title">
            {title}
          </h2>
          {lead ? <p className="ax-lead">{lead}</p> : null}
        </div>
        <div className="blog-cta__body">
          {children}
          {actions ? <div className="blog-cta__actions">{actions}</div> : null}
          {note ? <p className="blog-cta__note">{note}</p> : null}
        </div>
      </div>
    </div>
  </section>
);
