import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Bug,
  Cloud,
  Globe,
  Link2,
  Rocket,
  ShieldCheck,
  Smartphone,
  Briefcase,
  Compass,
  ExternalLink,
  FileText,
  Home,
  Info,
  Layers,
  Mail,
  Map as MapIcon,
  Newspaper,
  Scale,
  Search,
} from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";
import Seo from "../components/Essntials/Seo";

// Icons for the main pages, in the order of pages.main
const MAIN_ICONS = [Home, Info, Layers, Briefcase, Newspaper, Mail];
// Icons for the services, in the order of pages.services
const SERVICE_ICONS = [Rocket, ShieldCheck, Bot, Cloud, Smartphone, Globe, Link2, Bug];

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

      {/* Aurora redesign: an Aurora banner, then every route as grouped link cards.
          The lists and every href are unchanged. */}
      <main id="main">
        {/* Header */}
        <header className="ax-banner ax-aurora">
          <div className="ax-container">
            <span className="ax-eyebrow">
              <MapIcon aria-hidden="true" />
              Site index
            </span>
            <h1 className="ax-h1--s">Sitemap</h1>
            <p className="ax-lead">
              Aicyro Solutions · <span className="text-ink font-semibold">aicyro.com</span>
            </p>
          </div>
        </header>

        {/* Main Pages: a bento of cards with icon tiles */}
        <section className="ax-section pt-0" aria-labelledby="sm-main">
          <div className="ax-container">
            <div className="ax-head">
              <span className="ax-eyebrow">
                <Compass aria-hidden="true" />
                Start here
              </span>
              <h2 id="sm-main" className="ax-h2">Main</h2>
            </div>
            <ul className="ax-bento">
              {pages.main.map((page, i) => {
                const Icon = MAIN_ICONS[i] || Compass;
                return (
                  <li key={page.url} data-reveal style={{ "--i": i }}>
                    <Link href={page.url} className="ax-card ut-linkcard h-full">
                      <span className="ax-icon-tile">
                        <Icon aria-hidden="true" />
                      </span>
                      <span className="ut-linkcard__text">
                        <b>{page.name}</b>
                        <span>{page.description}</span>
                      </span>
                      <span className="ut-go">
                        <ArrowRight aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Services: a centred head over four-up service cards */}
        <section className="ax-band" aria-labelledby="sm-services">
          <div className="ax-container">
            <div className="ax-head ax-head--center">
              <span className="ax-eyebrow">
                <Layers aria-hidden="true" />
                Our services
              </span>
              <h2 id="sm-services" className="ax-h2">Services</h2>
            </div>
            <ul className="ax-bento">
              {pages.services.map((service, i) => {
                const Icon = SERVICE_ICONS[i] || Layers;
                return (
                <li key={service.url} className="ax-span-3" data-reveal style={{ "--i": i % 4 }}>
                  <Link href={service.url} className="ax-card ut-svc h-full">
                    <span className="ax-icon-tile">
                      <Icon aria-hidden="true" />
                    </span>
                    <b>{service.name}</b>
                    <span>{service.description}</span>
                    <span className="ut-go">
                      <ArrowRight aria-hidden="true" />
                    </span>
                  </Link>
                </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Portfolio: a sticky head beside a three-column index of compact cards */}
        <section className="ax-section" aria-labelledby="sm-portfolio">
          <div className="ax-container ax-split ax-split--wide items-start">
            <div className="ut-sticky-head">
              <span className="ax-eyebrow">
                <Briefcase aria-hidden="true" />
                Case studies
              </span>
              <h2 id="sm-portfolio" className="ax-h2">Portfolio</h2>
            </div>
            <ul className="ut-index" style={{ "--cols": 3 }}>
              {pages.portfolio.map((project) => (
                <li key={project.url}>
                  <Link href={project.url}>
                    <span className="ut-linkcard__text">
                      <b>{project.name}</b>
                      <span>{project.description}</span>
                    </span>
                    <span className="ut-go">
                      <ArrowRight aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Blogs: a head over a three-column index with icon tiles */}
        <section className="ax-band" aria-labelledby="sm-blogs">
          <div className="ax-container">
            <div className="ax-head">
              <span className="ax-eyebrow">
                <Newspaper aria-hidden="true" />
                Insights
              </span>
              <h2 id="sm-blogs" className="ax-h2">Blogs</h2>
            </div>
            <ul className="ut-index" style={{ "--cols": 3 }}>
              {pages.blogs.map((blog) => (
                <li key={blog.url}>
                  <Link href={blog.url}>
                    <span className="ax-icon-tile ut-tile-s">
                      <FileText aria-hidden="true" />
                    </span>
                    <span className="ut-linkcard__text">
                      <b>{blog.name}</b>
                      <span>{blog.description}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Legal, then the sitemap formats */}
        <section className="ax-section" aria-labelledby="sm-legal">
          <div className="ax-container">
            <div className="ax-bento">
              <div className="ax-card ax-span-7" data-reveal>
                <span className="ax-icon-tile">
                  <Scale aria-hidden="true" />
                </span>
                <h2 id="sm-legal" className="ax-h3">Legal</h2>
                <ul className="ut-index ut-index--pair mt-2">
                  {pages.legal.map((item) => (
                    <li key={item.url}>
                      <Link href={item.url}>
                        <span className="ut-linkcard__text">
                          <b>{item.name}</b>
                          <span>{item.description}</span>
                        </span>
                        <span className="ut-go">
                          <ArrowRight aria-hidden="true" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* XML & HTML Sitemap Links */}
              <div className="ax-card ax-card--tint ax-span-5" data-reveal style={{ "--i": 1 }}>
                <span className="ax-icon-tile ax-icon-tile--solid">
                  <MapIcon aria-hidden="true" />
                </span>
                <p className="ax-h3">Sitemap formats</p>
                <ul className="ut-formats mt-2">
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
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default SitemapPage;
