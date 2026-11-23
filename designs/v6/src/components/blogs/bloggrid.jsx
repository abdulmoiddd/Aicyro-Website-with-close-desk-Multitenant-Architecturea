import React from "react";
// Hallmark redesign: the posts as a three-across grid of the owner's images and titles.
import Image from "next/image";
import Link from "next/link";

const blogPosts = [
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

const BlogGrid = () => {
  return (
    <section className="ax-section" aria-labelledby="blog-index-title">
      <div className="ax-container">
        <div className="ax-head">
          <h2 id="blog-index-title" className="ax-h2">
            Our Knowledge Hub
          </h2>
        </div>

        <ul className="blog-grid">
          {blogPosts.map((post, i) => (
            <li key={post.id} data-reveal style={{ "--i": i % 3 }}>
              <Link href={post.link} className="blog-card">
                <figure className="ax-shot">
                  <Image
                    src={post.image}
                    alt=""
                    width={800}
                    height={500}
                    sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                  />
                </figure>
                <h3 className="ax-h3">{post.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default BlogGrid;
