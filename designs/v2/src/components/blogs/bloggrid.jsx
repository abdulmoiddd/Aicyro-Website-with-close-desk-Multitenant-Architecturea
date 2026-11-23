import React from "react";
// Redesign v3 (Aurora Studio): the blog index. The owner's first post leads as a large
// split card, the rest follow as a card grid (picture, category chip, date, title, read link).
// The post list is exported so the article template can show a cover and related posts.
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Newspaper } from "lucide-react";

export const blogPosts = [
  {
    id: 1,
    title: "The Survival Protocol: Cybersecurity as Financial Defense",
   date: "December 26, 2025",
    category: "Blog",
    image: "https://dummyimages.netlify.app/blog/blog1.png",
    link: "/blogs/blog3",
  },
  {
    id: 2,
    title:
      "AI-Powered Cyber Threats in 2025: What Every Business Leader Needs to Know",
    date: "December 26, 2025",
    category: "Blog",
    image:
      "https://dummyimages.netlify.app/services/HDCybersecurity%20&%20Data%20Protection.jpg",
    link: "/blogs/blog4",
  },
  {
    id: 3,
    title:
      "AI-Powered Growth: Why Intelligent Platforms Are a Must for Modern Businesses in 2025",
    date: "December 26, 2025",
    category: "Blog",
    image: "https://dummyimages.netlify.app/services/HDSaaS%20development.jpg",
    link: "/blogs/blog5",
  },
  {
    id: 4,
    title:
      "The Future of AI Automation: How It’s Transforming Business Operations in 2025",
    date: "December 26, 2025",
    category: "Blog",
    image: "https://dummyimages.netlify.app/services/HDQA%20&%20Automation.jpg",
    link: "/blogs/blog6",
  },
  {
    id: 5,
    title:
      "AI-Powered Workflows: How Automation Is Revolutionizing Business in 2025",
    date: "December 26, 2025",
    category: "Blog",
    image: "https://dummyimages.netlify.app/services/HDCloud%20&%20DevOps.jpg",
    link: "/blogs/blog7",
  },
  {
    id: 6,
    title: "AI vs. Manual Work: The Hard Truth About Time and Costs in 2025",
    date: "December 26, 2025",
    category: "Blog",
    image: "https://dummyimages.netlify.app/services/HDApp%20Development.jpg",
    link: "/blogs/blog8",
  },
   {
    id: 7,
    title: "The 2025 Shift: Why AI Automation is No Longer Optional",
    date: "Jan 22, 2026",
    category: "Blog",
    image: "https://dummyimages.netlify.app/services/HDAI%20Solutions%20.jpg",
    link: "/blogs/blog11",
}, {
    id: 8,
    title: "The Velocity Trap: Why Manual Testing is Obsolete in 2026",
    date: "Jan 9, 2026",
    category: "Blog",
    image: "https://dummyimages.netlify.app/services/HDCybersecurity%20&%20Data%20Protection.jpg",
    link: "/blogs/blog12",
}, {
    id: 9,
    title: "Scale vs. Stall: The Cloud Architecture Defining 2026",
    date: "Jan 10, 2026",
    category: "Blog",
    image: "https://dummyimages.netlify.app/services/HDWeb%20Development.jpg",
    link: "/blogs/blog13",
}, {
    id: 10,
    title: "Beyond Digital Presence: Why ‘Just a Website’ Fails in 2026",
    date: "Jan 11, 2026",
    category: "Blog",
    image: "https://dummyimages.netlify.app/services/HDWeb%20Development.jpg",
    link: "/blogs/blog14",
}, {
    id: 11,
    title: "The Silent Reshaping: Real-World Asset Tokenization in 2026",
    date: "Jan 12, 2026",
    category: "Blog",
    image: "https://dummyimages.netlify.app/services/HDBlockchain.jpg",
    link: "/blogs/blog15",
}, {
    id: 12,
    title: "The App Trap: Why Most Fail After Launch in 2026",
    date: "Jan 13, 2026",
    category: "Blog",
    image: "https://dummyimages.netlify.app/services/HDApp%20Development.jpg",
    link: "/blogs/blog16",
},
];

// The picture of a post; a gradient cover tile sits beneath it and shows when there is
// no picture or it fails to load (_app.jsx hides a failed .ax-shot).
export const PostCover = ({ post, sizes, priority = false }) => (
  <div className="blog-cover">
    <span className="blog-cover__tile" aria-hidden="true">
      <Newspaper size={28} />
    </span>
    {post.image ? (
      <figure className="ax-shot">
        <Image
          src={post.image}
          alt=""
          width={800}
          height={500}
          sizes={sizes}
          priority={priority}
        />
      </figure>
    ) : null}
  </div>
);

const PostMeta = ({ post }) => (
  <p className="blog-card__meta">
    <span className="ax-chip">{post.category}</span>
    <span className="blog-card__date">
      <Calendar size={16} aria-hidden="true" />
      {post.date}
    </span>
  </p>
);

// One post as a card: the whole card is the link.
export const PostCard = ({ post, headingLevel = 3 }) => {
  const H = `h${headingLevel}`;
  return (
    <Link href={post.link} className="ax-card ax-spot blog-card">
      <PostCover
        post={post}
        sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
      />
      <div className="blog-card__body">
        <PostMeta post={post} />
        <H className="ax-h3">{post.title}</H>
        <span className="ax-link blog-card__more">
          Read article
          <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
};

const BlogGrid = () => {
  const [featured, ...rest] = blogPosts;

  return (
    <section className="ax-section blog-after-hero" aria-labelledby="blog-index-title">
      <div className="ax-container">
        <div className="ax-head ax-head--split">
          <h2 id="blog-index-title" className="ax-h2">
            Our <span className="ax-grad">Knowledge Hub</span>
          </h2>
          <p className="ax-meta blog-count">
            {blogPosts.length} articles
          </p>
        </div>

        {featured ? (
          <Link
            href={featured.link}
            className="ax-card ax-spot blog-feature"
            data-reveal
          >
            <PostCover
              post={featured}
              sizes="(max-width: 960px) 100vw, 55vw"
            />
            <div className="blog-feature__body">
              <p className="blog-card__meta">
                <span className="ax-eyebrow">
                  <span>Featured</span>
                </span>
                <span className="ax-chip">{featured.category}</span>
              </p>
              <h3 className="ax-h2 blog-feature__title">{featured.title}</h3>
              <p className="blog-card__date">
                <Calendar size={16} aria-hidden="true" />
                {featured.date}
              </p>
              <span className="ax-btn blog-feature__btn">
                Read article
                <ArrowRight size={18} aria-hidden="true" />
              </span>
            </div>
          </Link>
        ) : null}

        <ul className="blog-grid">
          {rest.map((post, i) => (
            <li key={post.id} data-reveal style={{ "--i": i % 3 }}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default BlogGrid;
