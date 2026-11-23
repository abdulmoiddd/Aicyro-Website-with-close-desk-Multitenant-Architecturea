"use client";

// Redesign v3 (Aurora Studio): a page hero with the search field, the featured post as a
// large split card, the category filter over a card grid, and the digest as the closing CTA.
// Same data, same filter state.
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Essntials/Navbar";
import Footer from "@/components/Essntials/footer";
import { Search, Calendar, Clock, ArrowRight, Newspaper } from "lucide-react";

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

// Category chip, date and read time as separate facts.
const PostMeta = ({ post }) => (
  <p className="blog-card__meta">
    <span className="ax-chip">{post.category}</span>
    <span className="blog-card__date">
      <Calendar size={16} aria-hidden="true" /> {post.date}
    </span>
    <span className="blog-card__date">
      <Clock size={16} aria-hidden="true" /> {post.readTime}
    </span>
  </p>
);

// The picture, over a gradient tile that shows if it is missing or fails.
const Cover = ({ post, sizes }) => (
  <div className="blog-cover">
    <span className="blog-cover__tile" aria-hidden="true">
      <Newspaper size={28} />
    </span>
    {post.image ? (
      <figure className="ax-shot">
        <Image src={post.image} alt="" width={800} height={500} sizes={sizes} />
      </figure>
    ) : null}
  </div>
);

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
        <header className="ax-pagehero">
          <span className="ax-gridbg" aria-hidden="true" />
          <div className="ax-container ax-head ax-head--split blog-listhero">
            <div className="ax-pagehero__inner">
              <nav aria-label="Breadcrumb">
                <ul className="ax-crumbs">
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/blogs">Blog</Link>
                  </li>
                </ul>
              </nav>
              <p className="ax-eyebrow ax-rise">
                <span>Aicyro Blog</span>
              </p>
              <h1 className="ax-h1 ax-rise" style={{ "--i": 1 }}>
                Insights &amp; <span className="ax-grad">Perspectives.</span>
              </h1>
              <p className="ax-lead ax-rise" style={{ "--i": 2 }}>
                Deep dives into technology, design, and the future of digital
                products.
              </p>
            </div>

            <div className="blog-search ax-rise" style={{ "--i": 3 }}>
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
          <section className="ax-section blog-after-hero" aria-labelledby="featured-title">
            <div className="ax-container">
              <article className="ax-card ax-spot blog-feature ax-rise">
                <Cover post={featuredPost} sizes="(max-width: 960px) 100vw, 55vw" />
                <div className="blog-feature__body">
                  <p className="ax-eyebrow">
                    <span>Featured</span>
                  </p>
                  <PostMeta post={featuredPost} />
                  <h2 id="featured-title" className="ax-h2 blog-feature__title">
                    {featuredPost.title}
                  </h2>
                  <p className="ax-body">{featuredPost.excerpt}</p>
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
        <section className="ax-section" aria-label="Articles">
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

            {filteredPosts.length ? (
              <ul className="blog-grid">
                {filteredPosts.map((post, index) => (
                  <li key={post.id} data-reveal style={{ "--i": index % 3 }}>
                    <article className="ax-card ax-spot blog-card">
                      <Cover
                        post={post}
                        sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                      />
                      <div className="blog-card__body">
                        <PostMeta post={post} />
                        <h3 className="ax-h3">{post.title}</h3>
                        <p className="ax-body">{post.excerpt}</p>
                        <p className="blog-card__author">Aicyro Team</p>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="ax-well blog-empty">
                <Newspaper size={24} aria-hidden="true" />
                <p className="ax-body">No articles in {activeCategory} yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="ax-section" aria-labelledby="digest-title">
          <div className="ax-container">
            <div className="ax-cta">
              <h2 id="digest-title" className="ax-cta__title">
                Join our monthly <span className="ax-grad">digest</span>
              </h2>
              <p className="ax-lead">
                Get the latest articles, tutorials, and free resources delivered
                straight to your inbox. No spam, we promise.
              </p>
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
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Blog3;
