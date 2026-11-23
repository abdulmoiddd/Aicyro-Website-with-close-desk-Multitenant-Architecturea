import React from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Search } from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";
import Seo from "../components/Essntials/Seo";

const SitemapPage = () => {
  // Page structure data
  const pages = {
    main: [
      { name: "Home", url: "/", description: "Aicyro Solutions homepage" },
      { name: "About", url: "/about", description: "Learn about Aicyro Solutions" },
      { name: "Services", url: "/services", description: "Our service offerings" },
      { name: "Portfolio", url: "/portfolio", description: "Our project portfolio" },
      { name: "Blogs", url: "/blogs", description: "Latest insights and articles" },
      { name: "Contact", url: "/contact", description: "Get in touch with us" },
    ],
    services: [
      {
        name: "SaaS Development",
        url: "/services/saas-development",
        description: "Scalable SaaS products with security built-in.",
      },
      {
        name: "Cybersecurity & Data Protection",
        url: "/services/cybersecurity-data-protection",
        description: "Cyber security experts for data protection and compliance.",
      },
      {
        name: "AI Solutions",
        url: "/services/ai-solutions",
        description: "Artificial Intelligence and Machine Learning solutions.",
      },
      {
        name: "Cloud & DevOps",
        url: "/services/cloud-devops",
        description: "Cloud infrastructure, CI/CD, and platform reliability.",
      },
      {
        name: "App Development",
        url: "/services/app-development",
        description: "Mobile application design and development.",
      },
      {
        name: "Web Development",
        url: "/services/web-development",
        description: "Modern web applications with secure architectures.",
      },
      {
        name: "Blockchain",
        url: "/services/blockchain",
        description: "Decentralized solutions and smart contracts.",
      },
      {
        name: "QA & Automation",
        url: "/services/qa-automation",
        description: "Automated testing and quality engineering.",
      },
    ],
    portfolio: [
      { name: "AI Tutor", url: "/portfolio/aitutor", description: "AI-powered educational platform." },
      { name: "AutoScholar", url: "/portfolio/autoscholor", description: "Scholarship management automation." },
      { name: "Body Language", url: "/portfolio/bodylanguage", description: "Behavioral analysis system." },
      { name: "Cove.ai", url: "/portfolio/cove", description: "Visual AI collaboration workspace." },
      { name: "Go Grocer", url: "/portfolio/go", description: "On-demand grocery and delivery." },
      { name: "Health Analyser", url: "/portfolio/healthanalyser", description: "Medical data analysis tool." },
      { name: "HPL Games", url: "/portfolio/hpl", description: "Gaming and engagement platform." },
      { name: "JBB & Associates", url: "/portfolio/jbb", description: "CPA & business advisory platform." },
      { name: "Kaira", url: "/portfolio/kaira", description: "AI financial wellness coach." },
      { name: "NYC Tourism", url: "/portfolio/nyctourism", description: "Tourism experience platform." },
      { name: "POLITICO Pro", url: "/portfolio/politico", description: "Policy intelligence platform." },
      { name: "Robotics", url: "/portfolio/robotics", description: "Robotics and automation showcase." },
      { name: "Sale Automation", url: "/portfolio/saleautomation", description: "Sales workflow automation." },
      { name: "Shady Rays", url: "/portfolio/shady", description: "High-performance eyewear ecommerce." },
      { name: "ZipZap", url: "/portfolio/zipzap", description: "Payments and finance experience." },
    ],
    blogs: [
      { name: "Blog 1", url: "/blogs/aivsmanual", description: "Comparing automated AI versus manual processes." },
      { name: "Blog 2", url: "/blogs/blog", description: "General updates and news." },
      { name: "Blog 3", url: "/blogs/blog3", description: "Insights on technology trends." },
      { name: "Blog 4", url: "/blogs/blog4", description: "Development best practices." },
      { name: "Blog 5", url: "/blogs/blog5", description: "Cybersecurity tips." },
      { name: "Blog 6", url: "/blogs/blog6", description: "Industry case studies." },
      { name: "Blog 7", url: "/blogs/blog7", description: "Digital transformation strategies." },
      { name: "Blog 8", url: "/blogs/blog8", description: "Cloud computing advances." },
      { name: "Blog 9", url: "/blogs/blog11", description: "Future of SaaS." },
      { name: "Blog 10", url: "/blogs/blog12", description: "Data privacy essentials." },
      { name: "Blog 11", url: "/blogs/blog13", description: "Tech stack comparisons." },
      { name: "Blog 12", url: "/blogs/blog14", description: "Agile methodologies." },
      { name: "Blog 13", url: "/blogs/blog15", description: "Startup growth hacks." },
      { name: "Blog 14", url: "/blogs/blog16", description: "Latest company announcements." },
    ],
    legal: [
      { name: "Privacy Policy", url: "/privacy", description: "How we handle your data." },
      { name: "Terms of Service", url: "/terms", description: "Rules for using our services." },
    ]
  };

  // Obsidian redesign: a banner with a jump index of the groups, then each group as a
  // numbered section of glass link cards. The lists and every href are unchanged.
  const pad = (n) => String(n).padStart(2, "0");
  const groups = [
    { id: "sm-main", title: "Main", count: pages.main.length },
    { id: "sm-services", title: "Services", count: pages.services.length },
    { id: "sm-portfolio", title: "Portfolio", count: pages.portfolio.length },
    { id: "sm-blogs", title: "Blogs", count: pages.blogs.length },
    { id: "sm-legal", title: "Legal", count: pages.legal.length },
  ];

  const card = (item) => (
    <li key={item.url}>
      <Link href={item.url}>
        <b>{item.name}</b>
        <span>{item.description}</span>
        <ArrowUpRight size={18} className="rs-index__arrow" aria-hidden="true" />
      </Link>
    </li>
  );

  const head = (index, id, title, count) => (
    <div className="rs-sec__head" data-reveal>
      <div>
        <p className="ob-eyebrow">{pad(index)}</p>
        <h2 id={id} className="ax-h2">
          {title}
        </h2>
      </div>
      <span className="rs-sec__count" aria-hidden="true">
        {pad(count)}
      </span>
    </div>
  );

  return (
    <>
      <Seo
        title="Sitemap | Aicyro Solutions"
        description="Complete HTML sitemap of Aicyro Solutions. SaaS development, cybersecurity, AI solutions, portfolio, and contact pages at aicyro.com."
        url="/sitemap"
        keywords="SaaS development company sitemap, cyber security experts sitemap, Aicyro Solutions sitemap"
      />

      {/* Navbar */}
      <Navbar />

      <main id="main">
        {/* Header */}
        <header className="ob-banner ob-ambient rs-hero">
          <div className="ax-container">
            <div className="ob-banner__inner">
              <p className="ob-eyebrow" data-reveal>
                Index
              </p>
              <h1 className="ob-banner__title" data-reveal style={{ "--i": 1 }}>
                Sitemap
              </h1>
              <p className="ob-banner__lead" data-reveal style={{ "--i": 2 }}>
                Aicyro Solutions · <span className="text-ink">aicyro.com</span>
              </p>
              <nav aria-label="Sitemap sections" data-reveal style={{ "--i": 3 }}>
                <ul className="rs-jump">
                  {groups.map((g) => (
                    <li key={g.id}>
                      <a href={`#${g.id}-section`}>
                        <b aria-hidden="true">{pad(g.count)}</b>
                        <span>{g.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Pages */}
        <section id="sm-main-section" className="rs-sec" aria-labelledby="sm-main">
          <div className="ax-container">
            {head(1, "sm-main", "Main", pages.main.length)}
            <ul className="rs-index" style={{ "--cols": 3 }}>
              {pages.main.map(card)}
            </ul>
          </div>
        </section>

        {/* Services: the lead index, larger titles */}
        <section id="sm-services-section" className="rs-sec" aria-labelledby="sm-services">
          <div className="ax-container">
            {head(2, "sm-services", "Services", pages.services.length)}
            <ul className="rs-index rs-index--lead" style={{ "--cols": 2 }}>
              {pages.services.map(card)}
            </ul>
          </div>
        </section>

        {/* Portfolio: three columns */}
        <section id="sm-portfolio-section" className="rs-sec" aria-labelledby="sm-portfolio">
          <div className="ax-container">
            {head(3, "sm-portfolio", "Portfolio", pages.portfolio.length)}
            <ul className="rs-index" style={{ "--cols": 3 }}>
              {pages.portfolio.map(card)}
            </ul>
          </div>
        </section>

        {/* Blogs: a dense index */}
        <section id="sm-blogs-section" className="rs-sec" aria-labelledby="sm-blogs">
          <div className="ax-container">
            {head(4, "sm-blogs", "Blogs", pages.blogs.length)}
            <ul className="rs-index" style={{ "--cols": 3 }}>
              {pages.blogs.map(card)}
            </ul>
          </div>
        </section>

        {/* Legal, then the sitemap formats */}
        <section id="sm-legal-section" className="rs-sec" aria-labelledby="sm-legal">
          <div className="ax-container">
            {head(5, "sm-legal", "Legal", pages.legal.length)}
            <ul className="rs-index" style={{ "--cols": 3 }}>
              {pages.legal.map(card)}
            </ul>

            {/* XML & HTML Sitemap Links */}
            <div className="rs-formats" data-reveal>
              <p className="rs-legend">Sitemap formats</p>
              <ul className="rs-index" style={{ "--cols": 3 }}>
                <li>
                  <Link href="/sitemap.xml">
                    <b>XML Sitemap</b>
                    <ExternalLink size={18} className="rs-index__arrow" aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap">
                    <b>Interactive Sitemap</b>
                    <Search size={18} className="rs-index__arrow" aria-hidden="true" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default SitemapPage;
