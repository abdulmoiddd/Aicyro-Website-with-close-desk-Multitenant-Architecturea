// Aurora redesign: the one article template shared by every post in /blogs.
// A centred Banner header (eyebrow, title, lead, meta row) with the post's cover from the
// index in a framed shot, the body in .ax-prose beside a sticky contents card, then the
// article's own call to action as an ax-cta gradient card. Styles: src/styles/www/blogs.css.
import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  BookOpen,
  CalendarDays,
  Clock,
  ListTree,
  UserRound,
  Bookmark,
  Check,
} from "lucide-react";
import { blogPosts } from "./bloggrid";

// Icons for the byline facts, in the order every post passes them:
// author, date, read time, series.
const BYLINE_ICONS = [UserRound, CalendarDays, Clock, Bookmark];

// The cover the index shows for this post (matched by route), if there is one.
const useCover = () => {
  const router = useRouter();
  const path = router?.pathname || "";
  return blogPosts.find((post) => post.link === path) || null;
};

// Banner header: eyebrow, the title, its lead and the byline facts as a meta row.
export const ArticleHero = ({ title, lead, byline = [] }) => {
  const cover = useCover();

  return (
    <header className="ax-banner ax-aurora blog-hero">
      <div className="ax-container">
        <p className="ax-eyebrow">
          <BookOpen aria-hidden="true" />
          {cover?.category || "Blog"}
        </p>
        <h1 className="ax-h1--s">{title}</h1>
        {lead ? <p className="ax-lead">{lead}</p> : null}
        {byline.length ? (
          <ul className="blog-byline">
            {byline.map((item, i) => {
              const Icon = BYLINE_ICONS[i];
              return (
                <li key={i}>
                  {Icon ? <Icon size={16} aria-hidden="true" /> : null}
                  {item}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
      {cover?.image ? (
        <div className="ax-container ax-container--narrow">
          <figure className="ax-shot blog-cover">
            <span className="blog-shot__ph" aria-hidden="true">
              <BookOpen />
            </span>
            <Image
              src={cover.image}
              alt=""
              width={1200}
              height={630}
              priority
              sizes="(max-width: 1040px) 100vw, 1040px"
            />
          </figure>
        </div>
      ) : null}
    </header>
  );
};

// The body: a sticky contents card (desktop) beside the prose at a reading measure.
export const ArticleBody = ({ toc = [], tocLabel = "On this page", author, children }) => (
  <div className="ax-section blog-body">
    <div className="ax-container blog-article">
      <aside className="blog-article__rail">
        <div className="blog-toc">
          {toc.length ? (
            <nav aria-label={tocLabel} className="ax-card blog-toc__card">
              <p className="blog-toc__label">
                <ListTree size={16} aria-hidden="true" />
                {tocLabel}
              </p>
              <ol>
                {toc.map((link) => (
                  <li key={link.id}>
                    <a href={`#${link.id}`}>{link.label}</a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          {author ? (
            <div className="ax-card blog-toc__author">
              <span className="ax-icon-tile" aria-hidden="true">
                <UserRound />
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

// A section head inside the prose, with the anchor the contents card points at.
export const SectionHeading = ({ id, children }) => <h2 id={id}>{children}</h2>;

// A callout: a tinted card, an icon tile beside its title.
export const Callout = ({ title, icon: Icon, children }) => (
  <aside className="ax-card ax-card--tint blog-callout">
    {title ? (
      <h3 className="blog-callout__title">
        {Icon ? (
          <span className="ax-icon-tile ax-icon-tile--solid" aria-hidden="true">
            <Icon />
          </span>
        ) : null}
        {title}
      </h3>
    ) : null}
    {children}
  </aside>
);

// Named items: a term and its line, each a soft card row.
export const Facts = ({ children }) => <dl className="blog-facts">{children}</dl>;
export const Fact = ({ term, children }) => (
  <div>
    <dt>{term}</dt>
    <dd>{children}</dd>
  </div>
);

// Short items in two columns, each a small card with a check mark.
export const Pairs = ({ items = [] }) => (
  <ul className="blog-pairs">
    {items.map((item, i) => (
      <li key={i}>
        <Check size={16} aria-hidden="true" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

// The article's own call to action: a gradient ax-cta card after the body.
export const ArticleCta = ({ id = "cta", title, lead, children, actions, note }) => (
  <section id={id} className="ax-section blog-cta" aria-labelledby={`${id}-title`}>
    <div className="ax-container">
      <div className="ax-cta" data-reveal>
        <h2 id={`${id}-title`} className="ax-h2">
          {title}
        </h2>
        {lead ? <p className="ax-lead">{lead}</p> : null}
        {children}
        {actions ? <div className="ax-cta__actions">{actions}</div> : null}
        {note ? <p className="blog-cta__note">{note}</p> : null}
      </div>
    </div>
  </section>
);
