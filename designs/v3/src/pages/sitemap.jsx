import React from "react";
import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";
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

      {/* Hallmark redesign: an index of every route, set in hairline columns. The
          lists and every href are unchanged; the glows and staggered entrance are gone. */}
      <main id="main">
        {/* Header */}
        <header className="ax-container rs-banner">
          <h1 className="ax-h1">Sitemap</h1>
          <p className="ax-lead">
            Aicyro Solutions · <span className="text-ink">aicyro.com</span>
          </p>
        </header>

        {/* Main Pages: rows, name then line */}
        <section className="ax-section pt-10" aria-labelledby="sm-main">
          <div className="ax-container ax-split--wide ax-split items-start">
            <h2 id="sm-main" className="ax-h2">Main</h2>
            <ul className="ax-rows">
              {pages.main.map((page) => (
                <li key={page.url} className="!p-0 !block">
                  <Link href={page.url} className="ax-row px-0 !py-5">
                    <b className="font-semibold">{page.name}</b>
                    <span className="text-ink-2">{page.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Services: the lead index, larger titles */}
        <section className="ax-band" aria-labelledby="sm-services">
          <div className="ax-container">
            <div className="ax-head">
              <h2 id="sm-services" className="ax-h2">Services</h2>
            </div>
            <ul className="rs-index rs-index--lead" style={{ "--cols": 2 }}>
              {pages.services.map((service) => (
                <li key={service.url}>
                  <Link href={service.url}>
                    <b>{service.name}</b>
                    <span>{service.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Portfolio: three columns */}
        <section className="ax-section" aria-labelledby="sm-portfolio">
          <div className="ax-container">
            <div className="ax-head">
              <h2 id="sm-portfolio" className="ax-h2">Portfolio</h2>
            </div>
            <ul className="rs-index">
              {pages.portfolio.map((project) => (
                <li key={project.url}>
                  <Link href={project.url}>
                    <b>{project.name}</b>
                    <span>{project.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Blogs: head beside a dense index */}
        <section className="ax-section" aria-labelledby="sm-blogs">
          <div className="ax-container ax-split--wide ax-split items-start">
            <h2 id="sm-blogs" className="ax-h2">Blogs</h2>
            <ul className="rs-index" style={{ "--cols": 2 }}>
              {pages.blogs.map((blog) => (
                <li key={blog.url}>
                  <Link href={blog.url}>
                    <b>{blog.name}</b>
                    <span>{blog.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Legal, then the sitemap formats */}
        <section className="ax-band" aria-labelledby="sm-legal">
          <div className="ax-container ax-split--even ax-split items-start">
            <div className="grid gap-8">
              <h2 id="sm-legal" className="ax-h2">Legal</h2>
              <ul className="ax-rows">
                {pages.legal.map((item) => (
                  <li key={item.url} className="!p-0 !block">
                    <Link href={item.url} className="ax-row !grid-cols-1 px-0">
                      <b className="font-semibold">{item.name}</b>
                      <span className="text-ink-2">{item.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* XML & HTML Sitemap Links */}
            <div className="grid gap-4 content-start">
              <p className="ax-h3 font-display font-bold">Sitemap formats</p>
              <ul className="grid gap-3">
                <li>
                  <Link href="/sitemap.xml" className="ax-link inline-flex items-center gap-2">
                    <span>XML Sitemap</span>
                    <ExternalLink size={18} aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap" className="ax-link inline-flex items-center gap-2">
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
