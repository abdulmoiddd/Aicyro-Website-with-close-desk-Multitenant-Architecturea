"use client";

// Obsidian: an ambient banner with the search field, the featured post as a wide story
// (picture beside the headline), the category filter as pill toggles over a grid of glass
// cards, and the digest as a lit panel. Same data, same filter state.
// Styles: src/styles/www/blogs.css.
import React, { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Essntials/Navbar";
import Footer from "@/components/Essntials/footer";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import { trackGlow } from "@/components/blogs/posts";

// --- MOCK DATA ---
const BLOG_POSTS = [
  {
    id: 1,
    title: "The Future of Web Development: Beyond Next.js 14",
    excerpt:
      "Exploring the new frontiers of server components, partial prerendering, and what it means for the developer experience in 2026.",
    category: "Development",
    date: "Jan 05, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 2,
    title: "Mastering Tailwind CSS Architectures",
    excerpt:
      "How to organize your styles for large scale applications without losing your mind.",
    category: "Design",
    date: "Jan 02, 2026",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2555&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 3,
    title: "The Psychology of UI Animation",
    excerpt:
      "Why micro-interactions matter more than you think for user retention.",
    category: "UX/UI",
    date: "Dec 28, 2025",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 4,
    title: "Serverless Databases: A Comprehensive Guide",
    excerpt:
      "Comparing the top players in the market and which one suits your startup.",
    category: "Backend",
    date: "Dec 15, 2025",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=2668&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 5,
    title: "AI Integration in React Apps",
    excerpt:
      "Building a custom chatbot using the OpenAI API and React streams.",
    category: "AI",
    date: "Dec 10, 2025",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop",
    featured: false,
  },
];

const CATEGORIES = ["All", "Development", "Design", "UX/UI", "Backend", "AI"];


// Category, date and read time as separate mono facts (no dots between them).
const PostMeta = ({ post }) => (
  <p className="blog-card__meta">
    <span className="blog-card__cat">{post.category}</span>
    <span>
      <Calendar size={14} aria-hidden="true" /> {post.date}
    </span>
    <span>
      <Clock size={14} aria-hidden="true" /> {post.readTime}
    </span>
  </p>
);

// A framed picture; if it fails to load the frame drops out (.ax-shot, see _app.jsx).
const PostShot = ({ post, lead = false }) =>
  post.image ? (
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
  ) : null;

// --- COMPONENTS ---

const Blog3 = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts =
    activeCategory === "All"
      ? BLOG_POSTS.filter((post) => !post.featured)
      : BLOG_POSTS.filter(
          (post) => post.category === activeCategory && !post.featured
        );

  const featuredPost = BLOG_POSTS.find((post) => post.featured);

  return (
    <>
      <Navbar />

      <main id="main">
        {/* Header Section */}
        <header className="ob-banner ob-ambient blog-hero">
          <div className="ax-container blog-hero__split">
            <div className="ob-banner__inner">
              <h1 className="ob-banner__title blog-hero__title" data-reveal>
                Insights &amp; Perspectives.
              </h1>
              <p className="ob-banner__lead" data-reveal style={{ "--i": 1 }}>
                Deep dives into technology, design, and the future of digital
                products.
              </p>
            </div>

            <div className="blog-search" data-reveal style={{ "--i": 2 }}>
              <Search size={18} aria-hidden="true" />
              <input
                type="text"
                aria-label="Search articles"
                placeholder="Search articles…"
                className="ax-input"
              />
            </div>
          </div>
        </header>

        {/* Featured Post */}
        {activeCategory === "All" && featuredPost && (
          <section className="ax-section blog-feature" aria-labelledby="featured-title">
            <div className="ax-container">
              <article className="ob-card blog-card blog-card--lead" data-reveal onPointerMove={trackGlow}>
                <PostShot post={featuredPost} lead />
                <div className="blog-card__body">
                  <PostMeta post={featuredPost} />
                  <h2 id="featured-title" className="blog-card__title--lead">
                    {featuredPost.title}
                  </h2>
                  <p className="ax-lead">{featuredPost.excerpt}</p>
                  <div>
                    <button type="button" className="ax-btn ax-btn--quiet">
                      Read Full Story
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </section>
        )}

        {/* Category Filter and the posts */}
        <section className="ax-section blog-index" aria-label="Articles">
          <div className="ax-container">
            <div className="blog-filter" role="group" aria-label="Filter by category">
              {CATEGORIES.map((cat, index) => (
                <button
                  key={index}
                  type="button"
                  aria-pressed={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <ul className="blog-grid" onPointerMove={trackGlow}>
              {filteredPosts.map((post, index) => (
                <li key={post.id} data-reveal style={{ "--i": index % 3 }}>
                  <article className="ob-card blog-card">
                    <PostShot post={post} />
                    <div className="blog-card__body">
                      <PostMeta post={post} />
                      <h3 className="ax-h3">{post.title}</h3>
                      <p className="blog-card__excerpt">{post.excerpt}</p>
                      <p className="blog-card__author">Aicyro Team</p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="blog-cta" aria-labelledby="digest-title">
          <div className="ax-container">
            <div className="blog-cta__panel ob-ambient" data-reveal>
              <div className="blog-cta__body">
                <h2 id="digest-title" className="blog-cta__title">
                  Join our monthly digest
                </h2>
                <p className="ax-lead">
                  Get the latest articles, tutorials, and free resources delivered
                  straight to your inbox. No spam, we promise.
                </p>
              </div>
              <div className="blog-cta__body">
                <div className="blog-digest">
                  <input
                    type="email"
                    aria-label="Email"
                    placeholder="name@email.com"
                    className="ax-input"
                  />
                  <button type="button" className="ax-btn">
                    Subscribe Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Blog3;
