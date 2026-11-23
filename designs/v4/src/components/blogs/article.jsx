// Hallmark redesign: the one article template shared by every post in /blogs.
// Banner hero (title, lead, byline), the body in .ax-prose beside a contents rail,
// then the article's own call to action as a band. Styles: src/styles/www/blogs.css.
import React from "react";

// Banner hero: the title, its lead and the byline facts (parted by hairlines).
export const ArticleHero = ({ title, lead, byline = [] }) => (
  <header className="blog-banner">
    <div className="ax-container blog-article">
      <div className="blog-article__rail" aria-hidden="true" />
      <div className="blog-banner__copy">
        <h1 className="ax-h1--s">{title}</h1>
        {lead ? <p className="ax-lead">{lead}</p> : null}
        {byline.length ? (
          <ul className="blog-byline">
            {byline.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  </header>
);

// The body: a sticky contents rail (desktop) beside the prose at 68ch.
export const ArticleBody = ({ toc = [], tocLabel = "On this page", author, children }) => (
  <div className="ax-section blog-body">
    <div className="ax-container blog-article">
      <aside className="blog-article__rail">
        <div className="blog-toc">
          {toc.length ? (
            <nav aria-label={tocLabel}>
              <p className="blog-toc__label">{tocLabel}</p>
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
            <div className="blog-toc__author">
              <p>{author.label || "Author"}</p>
              <p>{author.name}</p>
              {author.role ? <p>{author.role}</p> : null}
            </div>
          ) : null}
        </div>
      </aside>
      <article className="ax-prose blog-prose">{children}</article>
    </div>
  </div>
);

// A section head inside the prose, with the anchor the contents rail points at.
export const SectionHeading = ({ id, children }) => <h2 id={id}>{children}</h2>;

// A callout: one tinted well, an inline icon beside its title.
export const Callout = ({ title, icon: Icon, children }) => (
  <aside className="blog-callout">
    {title ? (
      <h3 className="blog-callout__title">
        {Icon ? <Icon size={20} aria-hidden="true" /> : null}
        {title}
      </h3>
    ) : null}
    {children}
  </aside>
);

// Named items: a term and its line, in hairline rows.
export const Facts = ({ children }) => <dl className="blog-facts">{children}</dl>;
export const Fact = ({ term, children }) => (
  <div>
    <dt>{term}</dt>
    <dd>{children}</dd>
  </div>
);

// Short items in two columns parted by hairlines.
export const Pairs = ({ items = [] }) => (
  <ul className="blog-pairs">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

// The article's own call to action, a band after the body.
export const ArticleCta = ({ id = "cta", title, lead, children, actions, note }) => (
  <section id={id} className="ax-band blog-cta" aria-labelledby={`${id}-title`}>
    <div className="ax-container ax-split">
      <div className="blog-cta__body">
        <h2 id={`${id}-title`} className="ax-h2">
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
  </section>
);
