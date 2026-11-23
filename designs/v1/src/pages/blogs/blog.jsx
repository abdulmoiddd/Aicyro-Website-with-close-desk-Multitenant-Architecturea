"use client";

// Aurora redesign: a centred Banner hero with the search field, the featured post as a
// large image card, the category filter (ax-tabs) over a grid of post cards, and the digest band.
// Same data, same filter state.
import React, { useState } from "react";
import Navbar from "@/components/Essntials/Navbar";
import Footer from "@/components/Essntials/footer";
import Image from "next/image";
import {
  Search,
  Calendar,
  Clock,
  BookOpen,
  Sparkles,
  Mail,
  UserRound,
} from "lucide-react";

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
  <p className="blog-list__meta">
    <span className="ax-chip ax-chip--accent">{post.category}</span>
    <span className="inline-flex items-center gap-1">
      <Calendar size={16} aria-hidden="true" /> {post.date}
    </span>
    <span className="inline-flex items-center gap-1">
      <Clock size={16} aria-hidden="true" /> {post.readTime}
    </span>
  </p>
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
        <header className="ax-banner ax-aurora blog-banner">
          <div className="ax-container">
            <p className="ax-eyebrow">
              <BookOpen aria-hidden="true" />
              Blog
            </p>
            <h1 className="ax-h1">Insights &amp; Perspectives.</h1>
            <p className="ax-lead">
              Deep dives into technology, design, and the future of digital
              products.
            </p>

            <div className="ax-banner__actions">
              <div className="ax-field blog-search">
                <label htmlFor="blog-search" className="ax-label">
                  Search articles
                </label>
                <div className="blog-search__box">
                  <Search size={18} aria-hidden="true" />
                  <input
                    id="blog-search"
                    type="text"
                    placeholder="Search articles…"
                    className="ax-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Post */}
        {activeCategory === "All" && featuredPost && (
          <section className="ax-section" aria-labelledby="featured-title">
            <div className="ax-container">
              <article className="ax-card ax-card--flush blog-feature" data-reveal>
                <figure className="ax-shot blog-feature__shot">
                  <Image
                    src={featuredPost.image}
                    alt=""
                    width={1200}
                    height={800}
                    priority
                    sizes="(max-width: 960px) 100vw, 55vw"
                  />
                </figure>
                <div className="ax-card__body blog-feature__body">
                  <p className="ax-eyebrow">
                    <Sparkles aria-hidden="true" />
                    Featured
                  </p>
                  <PostMeta post={featuredPost} />
                  <h2 id="featured-title" className="ax-h2">
                    {featuredPost.title}
                  </h2>
                  <p className="ax-lead">{featuredPost.excerpt}</p>
                  <div>
                    <button type="button" className="ax-btn">
                      Read Full Story
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
            <div className="blog-filter">
              <div className="ax-tabs" role="group" aria-label="Filter by category">
                {CATEGORIES.map((cat, index) => (
                  <button
                    key={index}
                    type="button"
                    className="ax-tab"
                    aria-pressed={activeCategory === cat}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <ul className="blog-grid">
              {filteredPosts.map((post, index) => (
                <li key={post.id}>
                  <article
                    className="ax-card ax-card--flush ax-card--hover blog-card"
                    data-reveal
                    style={{ "--i": index }}
                  >
                    <figure className="ax-shot blog-card__shot">
                      <Image
                        src={post.image}
                        alt=""
                        width={800}
                        height={500}
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                      />
                    </figure>
                    <div className="ax-card__body blog-card__body">
                      <PostMeta post={post} />
                      <h3 className="ax-h3">{post.title}</h3>
                      <p className="ax-body">{post.excerpt}</p>
                      <p className="ax-card__foot blog-list__author">
                        <UserRound size={16} aria-hidden="true" />
                        Aicyro Team
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="ax-band" aria-labelledby="digest-title">
          <div className="ax-container ax-split">
            <div className="blog-digest">
              <p className="ax-eyebrow">
                <Mail aria-hidden="true" />
                Newsletter
              </p>
              <h2 id="digest-title" className="ax-h2">
                Join our monthly digest
              </h2>
              <p className="ax-lead">
                Get the latest articles, tutorials, and free resources delivered
                straight to your inbox. No spam, we promise.
              </p>
            </div>
            <div className="ax-panel blog-digest">
              <div className="ax-field">
                <label htmlFor="digest-email" className="ax-label">
                  Email
                </label>
                <input
                  id="digest-email"
                  type="email"
                  placeholder="name@email.com"
                  className="ax-input"
                />
              </div>
              <button type="button" className="ax-btn ax-btn--block">
                Subscribe Now
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Blog3;
