// Redesign v3 (Aurora Studio): the one article template shared by every post in /blogs.
// Page hero (crumbs, series eyebrow, title with an optional gradient phrase, lead, meta row),
// the post's cover from the blog index, the body in .ax-prose beside a sticky contents rail
// (wide screens) or a contents drawer (narrow screens), related posts, then the article's
// own call to action as an .ax-cta. Styles: src/styles/www/blogs.css.
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronDown,
  Clock,
  PenLine,
} from "lucide-react";
import { blogPosts, PostCard, PostCover } from "./bloggrid";

// The index entry for the current route (cover picture, related posts).
const useCurrentPost = () => {
  const { pathname } = useRouter();
  return blogPosts.find((p) => p.link === pathname);
};

// Wraps one phrase of a plain-text title in the brand gradient, when it is given and present.
const GradTitle = ({ title, grad }) => {
  if (typeof title !== "string" || !grad || !title.includes(grad)) return title;
  const at = title.indexOf(grad);
  return (
    <>
      {title.slice(0, at)}
      <span className="ax-grad">{grad}</span>
      {title.slice(at + grad.length)}
    </>
  );
};

// A byline fact gets an icon by what it is: the author, the date, the read time.
const isEl = (item, type) => React.isValidElement(item) && item.type === type;
const isReadTime = (item) => typeof item === "string" && /min read/i.test(item);
const MetaIcon = ({ item }) => {
  if (isEl(item, "b")) return <PenLine size={16} aria-hidden="true" />;
  if (isEl(item, "time")) return <Calendar size={16} aria-hidden="true" />;
  if (isReadTime(item)) return <Clock size={16} aria-hidden="true" />;
  return null;
};

// Page hero: crumbs, the series as the eyebrow, the title, its lead and the byline facts.
export const ArticleHero = ({ title, lead, byline = [], grad, eyebrow }) => {
  const post = useCurrentPost();

  // The series name (the last plain-text byline fact that is not the read time) rides
  // in the eyebrow; the other facts stay in the meta row.
  const last = byline[byline.length - 1];
  const series =
    eyebrow ||
    (byline.length > 1 && typeof last === "string" && !isReadTime(last)
      ? last
      : null);
  const facts = series && !eyebrow ? byline.slice(0, -1) : byline;

  return (
    <header className="ax-pagehero blog-hero">
      <span className="ax-gridbg" aria-hidden="true" />
      <div className="ax-container blog-article">
        <div className="blog-article__rail" aria-hidden="true" />
        <div className="ax-pagehero__inner blog-hero__inner">
          <nav aria-label="Breadcrumb">
            <ul className="ax-crumbs">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/blogs">Blog</Link>
              </li>
              <li aria-current="page" className="blog-crumb-current">
                {typeof title === "string" ? title : "Article"}
              </li>
            </ul>
          </nav>

          <p className="ax-eyebrow ax-rise">
            <span>{series || "Blog"}</span>
          </p>

          <h1 className="ax-h1--s blog-hero__title ax-rise" style={{ "--i": 1 }}>
            <GradTitle title={title} grad={grad} />
          </h1>

          {lead ? (
            <p className="ax-lead ax-rise" style={{ "--i": 2 }}>
              {lead}
            </p>
          ) : null}

          {facts.length ? (
            <ul className="blog-meta ax-rise" style={{ "--i": 3 }}>
              {facts.map((item, i) => (
                <li key={i}>
                  <MetaIcon item={item} />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {post ? (
        <div className="ax-container ax-rise" style={{ "--i": 4 }}>
          <div className="blog-hero__cover">
            <PostCover
              post={post}
              sizes="(max-width: 1280px) 100vw, 1200px"
              priority
            />
          </div>
        </div>
      ) : null}
    </header>
  );
};

// Highlights the contents link of the section being read (wide-screen rail).
const useActiveSection = (ids) => {
  const [active, setActive] = useState(null);
  const key = ids.join("|");
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return active;
};

const TocList = ({ toc, active }) => (
  <ol>
    {toc.map((link) => (
      <li key={link.id}>
        <a
          href={`#${link.id}`}
          aria-current={active === link.id ? "location" : undefined}
        >
          {link.label}
        </a>
      </li>
    ))}
  </ol>
);

// The body: a sticky contents rail (wide screens) beside the prose at 70ch.
export const ArticleBody = ({ toc = [], tocLabel = "On this page", author, children }) => {
  const active = useActiveSection(toc.map((t) => t.id));

  return (
    <div className="ax-section blog-body">
      <div className="ax-container blog-article">
        <aside className="blog-article__rail">
          <div className="blog-toc">
            {toc.length ? (
              <nav aria-label={tocLabel}>
                <p className="blog-toc__label">{tocLabel}</p>
                <TocList toc={toc} active={active} />
              </nav>
            ) : null}
            {author ? (
              <div className="blog-toc__author">
                <span className="ax-icon-tile ax-icon-tile--solid" aria-hidden="true">
                  <PenLine />
                </span>
                <div>
                  <p>{author.label || "Author"}</p>
                  <p>{author.name}</p>
                  {author.role ? <p>{author.role}</p> : null}
                </div>
              </div>
            ) : null}
            <Link href="/blogs" className="ax-link blog-toc__back">
              <ArrowLeft size={16} aria-hidden="true" />
              All articles
            </Link>
          </div>
        </aside>

        <div className="blog-article__main">
          {toc.length ? (
            <details className="blog-toc-m">
              <summary>
                {tocLabel}
                <ChevronDown size={18} aria-hidden="true" />
              </summary>
              <nav aria-label={`${tocLabel} (compact)`}>
                <TocList toc={toc} active={active} />
              </nav>
            </details>
          ) : null}
          <article className="ax-prose blog-prose">{children}</article>
        </div>
      </div>
    </div>
  );
};

// A section head inside the prose, with the anchor the contents rail points at.
export const SectionHeading = ({ id, children }) => <h2 id={id}>{children}</h2>;

// A callout: a glass well with an icon tile beside its title.
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
    {children}
  </aside>
);

// Named items: a term and its line, each in its own small card.
export const Facts = ({ children }) => <dl className="blog-facts">{children}</dl>;
export const Fact = ({ term, children }) => (
  <div>
    <dt>{term}</dt>
    <dd>{children}</dd>
  </div>
);

// Short items as a two-column set of tiles.
export const Pairs = ({ items = [] }) => (
  <ul className="blog-pairs">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

// Three more posts from the index, starting after the current one.
const RelatedPosts = () => {
  const post = useCurrentPost();
  const at = post ? blogPosts.indexOf(post) : -1;
  const pool = blogPosts.filter((p) => p !== post);
  const start = at < 0 ? 0 : at % Math.max(pool.length, 1);
  const picks = [0, 1, 2]
    .map((n) => pool[(start + n) % pool.length])
    .filter(Boolean);
  if (!picks.length) return null;

  return (
    <section className="ax-section blog-related" aria-labelledby="related-title">
      <div className="ax-container">
        <div className="ax-head ax-head--split">
          <div className="blog-related__head">
            <p className="ax-eyebrow">
              <span>Keep reading</span>
            </p>
            <h2 id="related-title" className="ax-h2">
              More from the <span className="ax-grad">blog</span>
            </h2>
          </div>
          <Link href="/blogs" className="ax-link blog-related__all">
            All articles
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <ul className="blog-grid">
          {picks.map((p, i) => (
            <li key={p.id} data-reveal style={{ "--i": i }}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

// Related posts, then the article's own call to action as the closing band.
export const ArticleCta = ({ id = "cta", title, lead, children, actions, note }) => (
  <>
    <RelatedPosts />
    <section id={id} className="ax-section blog-cta" aria-labelledby={`${id}-title`}>
      <div className="ax-container">
        <div className="ax-cta" data-reveal>
          <h2 id={`${id}-title`} className="ax-cta__title">
            {title}
          </h2>
          {lead ? <p className="ax-lead">{lead}</p> : null}
          {children ? <div className="blog-cta__extra">{children}</div> : null}
          {actions ? <div className="ax-cta__actions">{actions}</div> : null}
          {note ? <p className="blog-cta__note">{note}</p> : null}
        </div>
      </div>
    </section>
  </>
);
