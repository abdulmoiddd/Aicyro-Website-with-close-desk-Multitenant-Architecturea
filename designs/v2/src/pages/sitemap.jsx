import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Blocks,
  Boxes,
  BrainCircuit,
  Briefcase,
  Cloud,
  ExternalLink,
  Globe,
  Home,
  Info,
  Layers,
  Mail,
  Newspaper,
  ScrollText,
  Search,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";
import Seo from "../components/Essntials/Seo";

// Redesign v3 (Aurora Studio): a page hero with jump links, then each group in its own
// composition (main pages as a bento of cards, services as an icon card grid, portfolio
// and blogs as glass link indexes, legal and the sitemap formats side by side). The
// lists and every href are unchanged; the icons are decorative.
const MAIN_ICONS = { "/": Home, "/about": Info, "/services": Layers, "/portfolio": Briefcase, "/blogs": Newspaper, "/contact": Mail };
const SERVICE_ICONS = {
  "/services/saas-development": Boxes,
  "/services/cybersecurity-data-protection": ShieldCheck,
  "/services/ai-solutions": BrainCircuit,
  "/services/cloud-devops": Cloud,
  "/services/app-development": Smartphone,
  "/services/web-development": Globe,
  "/services/blockchain": Blocks,
  "/services/qa-automation": BadgeCheck,
};

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

  const jumps = [
    { id: "sm-main", label: "Main" },
    { id: "sm-services", label: "Services" },
    { id: "sm-portfolio", label: "Portfolio" },
    { id: "sm-blogs", label: "Blogs" },
    { id: "sm-legal", label: "Legal" },
  ];

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
        <section className="ax-pagehero" aria-labelledby="sm-title">
          <span className="ax-gridbg" aria-hidden="true" />
          <div className="ax-container ax-pagehero__inner">
            <nav aria-label="Breadcrumb" className="ax-rise" style={{ "--i": 0 }}>
              <ul className="ax-crumbs">
                <li><Link href="/">Home</Link></li>
                <li aria-current="page">Sitemap</li>
              </ul>
            </nav>
            <p className="ax-eyebrow ax-rise" style={{ "--i": 1 }}>
              <span>All pages</span>
            </p>
            <h1 id="sm-title" className="ax-h1--s ax-rise" style={{ "--i": 2 }}>
              <span className="ax-grad">Sitemap</span>
            </h1>
            <p className="ax-lead ax-rise" style={{ "--i": 3 }}>
              Aicyro Solutions · <span className="text-ink">aicyro.com</span>
            </p>
            <nav aria-label="Jump to a group" className="ax-rise" style={{ "--i": 4 }}>
              <ul className="ms-jump">
                {jumps.map((j) => (
                  <li key={j.id}>
                    <a href={`#${j.id}`}>{j.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>

        {/* Main Pages: a bento of cards */}
        <section className="ax-section pt-0" aria-labelledby="sm-main">
          <div className="ax-container">
            <div className="ax-head">
              <h2 id="sm-main" className="ax-h2 ms-anchor">Main</h2>
            </div>
            <ul className="ax-bento">
              {pages.main.map((page, i) => {
                const Icon = MAIN_ICONS[page.url] || Layers;
                return (
                  <li key={page.url} className="grid" data-reveal style={{ "--i": i }}>
                    <Link href={page.url} className="ax-card ax-spot">
                      <span className="ms-card__top">
                        <span className="ax-icon-tile" aria-hidden="true">
                          <Icon />
                        </span>
                        <ArrowUpRight size={20} className="ms-card__go" aria-hidden="true" />
                      </span>
                      <b className="ms-card__name">{page.name}</b>
                      <span className="ms-card__desc">{page.description}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Services: an icon card grid */}
        <section className="ax-band" aria-labelledby="sm-services">
          <div className="ax-container">
            <div className="ax-head">
              <h2 id="sm-services" className="ax-h2 ms-anchor">Services</h2>
            </div>
            <ul className="ms-cards" style={{ "--cols": 4 }}>
              {pages.services.map((service, i) => {
                const Icon = SERVICE_ICONS[service.url] || Layers;
                return (
                  <li key={service.url} data-reveal style={{ "--i": i % 4 }}>
                    <Link href={service.url} className="ax-card ax-spot">
                      <span className="ms-card__top">
                        <span className="ax-icon-tile ax-icon-tile--solid" aria-hidden="true">
                          <Icon />
                        </span>
                        <ArrowUpRight size={20} className="ms-card__go" aria-hidden="true" />
                      </span>
                      <b className="ms-card__name">{service.name}</b>
                      <span className="ms-card__desc">{service.description}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Portfolio: a three-column glass index */}
        <section className="ax-section" aria-labelledby="sm-portfolio">
          <div className="ax-container">
            <div className="ax-head">
              <h2 id="sm-portfolio" className="ax-h2 ms-anchor">Portfolio</h2>
            </div>
            <ul className="ms-index" data-reveal>
              {pages.portfolio.map((project) => (
                <li key={project.url}>
                  <Link href={project.url}>
                    <b>{project.name}</b>
                    <span>{project.description}</span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Blogs: a sticky head beside a two-column index */}
        <section className="ax-section" aria-labelledby="sm-blogs">
          <div className="ax-container ax-split ax-split--wide items-start">
            <div className="ms-stick">
              <span className="ax-icon-tile" aria-hidden="true">
                <Newspaper />
              </span>
              <h2 id="sm-blogs" className="ax-h2 ms-anchor">Blogs</h2>
            </div>
            <ul className="ms-index" style={{ "--cols": 2 }} data-reveal>
              {pages.blogs.map((blog) => (
                <li key={blog.url}>
                  <Link href={blog.url}>
                    <b>{blog.name}</b>
                    <span>{blog.description}</span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Legal, then the sitemap formats */}
        <section className="ax-band" aria-labelledby="sm-legal">
          <div className="ax-container ax-split ax-split--even items-start">
            <div className="grid gap-8">
              <h2 id="sm-legal" className="ax-h2 ms-anchor">Legal</h2>
              <ul className="ms-cards" style={{ "--cols": 2 }}>
                {pages.legal.map((item) => (
                  <li key={item.url}>
                    <Link href={item.url} className="ax-card ax-spot">
                      <span className="ms-card__top">
                        <span className="ax-icon-tile" aria-hidden="true">
                          <ScrollText />
                        </span>
                        <ArrowUpRight size={20} className="ms-card__go" aria-hidden="true" />
                      </span>
                      <b className="ms-card__name">{item.name}</b>
                      <span className="ms-card__desc">{item.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* XML & HTML Sitemap Links */}
            <div className="ax-panel ms-formats">
              <p className="ax-h3 font-display font-bold">Sitemap formats</p>
              <ul>
                <li>
                  <Link href="/sitemap.xml">
                    <span>XML Sitemap</span>
                    <ExternalLink size={18} aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap">
                    <span>Interactive Sitemap</span>
                    <Search size={18} aria-hidden="true" />
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
