// The Insights posts: one list read by the index grid (bloggrid.jsx) and by the article
// template (article.jsx), which frames the same picture as the article's cover.
// readTime is the figure each article states in its own byline.
export const blogPosts = [
  {
    id: 1,
    title: "The Survival Protocol: Cybersecurity as Financial Defense",
    date: "December 26, 2025",
    category: "Blog",
    readTime: "8 min read",
    image: "https://dummyimages.netlify.app/blog/blog1.png",
    link: "/blogs/blog3",
  },
  {
    id: 2,
    title:
      "AI-Powered Cyber Threats in 2025: What Every Business Leader Needs to Know",
    date: "December 26, 2025",
    category: "Blog",
    readTime: "10 min read",
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
    readTime: "8 min read",
    image: "https://dummyimages.netlify.app/services/HDSaaS%20development.jpg",
    link: "/blogs/blog5",
  },
  {
    id: 4,
    title:
      "The Future of AI Automation: How It’s Transforming Business Operations in 2025",
    date: "December 26, 2025",
    category: "Blog",
    readTime: "7 min read",
    image: "https://dummyimages.netlify.app/services/HDQA%20&%20Automation.jpg",
    link: "/blogs/blog6",
  },
  {
    id: 5,
    title:
      "AI-Powered Workflows: How Automation Is Revolutionizing Business in 2025",
    date: "December 26, 2025",
    category: "Blog",
    readTime: "6 min read",
    image: "https://dummyimages.netlify.app/services/HDCloud%20&%20DevOps.jpg",
    link: "/blogs/blog7",
  },
  {
    id: 6,
    title: "AI vs. Manual Work: The Hard Truth About Time and Costs in 2025",
    date: "December 26, 2025",
    category: "Blog",
    readTime: "5 min read",
    image: "https://dummyimages.netlify.app/services/HDApp%20Development.jpg",
    link: "/blogs/blog8",
  },
  {
    id: 7,
    title: "The 2025 Shift: Why AI Automation is No Longer Optional",
    date: "Jan 22, 2026",
    category: "Blog",
    readTime: "6 min read",
    image: "https://dummyimages.netlify.app/services/HDAI%20Solutions%20.jpg",
    link: "/blogs/blog11",
  },
  {
    id: 8,
    title: "The Velocity Trap: Why Manual Testing is Obsolete in 2026",
    date: "Jan 9, 2026",
    category: "Blog",
    readTime: "7 min read",
    image:
      "https://dummyimages.netlify.app/services/HDCybersecurity%20&%20Data%20Protection.jpg",
    link: "/blogs/blog12",
  },
  {
    id: 9,
    title: "Scale vs. Stall: The Cloud Architecture Defining 2026",
    date: "Jan 10, 2026",
    category: "Blog",
    readTime: "8 min read",
    image: "https://dummyimages.netlify.app/services/HDWeb%20Development.jpg",
    link: "/blogs/blog13",
  },
  {
    id: 10,
    title: "Beyond Digital Presence: Why ‘Just a Website’ Fails in 2026",
    date: "Jan 11, 2026",
    category: "Blog",
    readTime: "6 min read",
    image: "https://dummyimages.netlify.app/services/HDWeb%20Development.jpg",
    link: "/blogs/blog14",
  },
  {
    id: 11,
    title: "The Silent Reshaping: Real-World Asset Tokenization in 2026",
    date: "Jan 12, 2026",
    category: "Blog",
    readTime: "9 min read",
    image: "https://dummyimages.netlify.app/services/HDBlockchain.jpg",
    link: "/blogs/blog15",
  },
  {
    id: 12,
    title: "The App Trap: Why Most Fail After Launch in 2026",
    date: "Jan 13, 2026",
    category: "Blog",
    readTime: "7 min read",
    image: "https://dummyimages.netlify.app/services/HDApp%20Development.jpg",
    link: "/blogs/blog16",
  },
];

// The index entry for a route, e.g. postFor("/blogs/blog3").
export const postFor = (path) =>
  blogPosts.find((post) => post.link === String(path || "").replace(/\/$/, ""));

// Cursor-tracking glow for .ob-card children of a list (writes --mx / --my).
export const trackGlow = (e) => {
  const card = e.target.closest?.(".ob-card");
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - r.left}px`);
  card.style.setProperty("--my", `${e.clientY - r.top}px`);
};
