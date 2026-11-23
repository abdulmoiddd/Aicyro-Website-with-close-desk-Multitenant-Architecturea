import React from "react";
// Obsidian: the Insights index as an editorial journal. The first post leads as a wide
// story (picture beside the headline), the rest follow as glass cards in a three-across
// grid: framed picture that zooms on hover, mono index / category / date / read-time
// labels, the headline, an arrow. Posts live in ./posts.js. Styles: src/styles/www/blogs.css.
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { blogPosts, trackGlow } from "./posts";

const pad = (n) => String(n).padStart(2, "0");

const BlogGrid = () => {
  return (
    <section className="ax-section blog-index" aria-labelledby="blog-index-title">
      <div className="ax-container">
        <div className="blog-index__head">
          <p className="ob-eyebrow" data-reveal>
            {pad(blogPosts.length)} articles
          </p>
          <h2
            id="blog-index-title"
            className="ax-h2"
            data-reveal
            style={{ "--i": 1 }}
          >
            Our Knowledge Hub
          </h2>
        </div>

        <ul className="blog-grid" onPointerMove={trackGlow}>
          {blogPosts.map((post, i) => {
            const lead = i === 0;
            return (
              <li
                key={post.id}
                className={lead ? "blog-grid__lead" : undefined}
                data-reveal
                style={{ "--i": lead ? 0 : (i - 1) % 3 }}
              >
                <Link
                  href={post.link}
                  className={`ob-card blog-card${lead ? " blog-card--lead" : ""}`}
                >
                  <figure className="ax-shot blog-card__media">
                    <Image
                      src={post.image}
                      alt=""
                      width={lead ? 1600 : 800}
                      height={lead ? 1000 : 500}
                      priority={lead}
                      sizes={
                        lead
                          ? "(max-width: 960px) 100vw, 60vw"
                          : "(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                      }
                    />
                  </figure>

                  <div className="blog-card__body">
                    <p className="blog-card__meta">
                      <span className="blog-card__index">{pad(i + 1)}</span>
                      <span>{post.category}</span>
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </p>
                    <h3 className={lead ? "blog-card__title--lead" : "ax-h3"}>
                      {post.title}
                    </h3>
                    <span className="blog-card__go" aria-hidden="true">
                      <ArrowUpRight size={lead ? 22 : 18} />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default BlogGrid;
