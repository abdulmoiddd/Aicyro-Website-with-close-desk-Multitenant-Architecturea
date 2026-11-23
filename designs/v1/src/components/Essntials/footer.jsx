// src/components/Essntials/footer.jsx
// Aurora redesign: the brand column (logo, company line, actions, social), three link
// columns, the legal row and a large faded wordmark. Every link and address is unchanged;
// the social profiles are the ones the home page already lists in its Organization data.
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";

// Assets
import logo from "../../assets/logo.png";
import logowhite from "../../assets/logowhite.png";

const SOCIAL = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/aicyro-solutions",
    path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z",
  },
  {
    name: "X",
    href: "https://x.com/aicyro",
    path: "M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/aicyro",
    path: "M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/aicyro",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z",
  },
];

const Footer = () => {
  // State to track theme for the Logo switch
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    setTheme(currentTheme);

    // Watch for changes (when the Navbar toggles the theme)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
          setTheme(document.documentElement.getAttribute("data-theme") || "light");
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="ax-foot">
      <div className="ax-container">
        <div className="ax-foot__top">
          <div className="ax-foot__brand">
            <Link href="/" aria-label="Aicyro Solutions, home">
              <Image src={theme === "light" ? logowhite : logo} alt="Aicyro Solutions" className="ax-nav__logo" />
            </Link>
            <p className="ax-foot__statement">
              Aicyro provides AI-powered cybersecurity, automation, and custom software solutions for modern businesses.
            </p>
            <div className="ax-foot__cta">
              <Link href="/contact" className="ax-btn ax-btn--sm">
                Book Free Consultation
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a href="mailto:info@aicyro.com" className="ax-btn ax-btn--quiet ax-btn--sm">
                <Mail size={16} aria-hidden="true" />
                info@aicyro.com
              </a>
            </div>
            <ul className="ax-foot__social" aria-label="Aicyro on social media">
              {SOCIAL.map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Aicyro on ${s.name}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="ax-foot__cols">
            <div>
              <h2>Quick Links</h2>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/services">Services</Link></li>
                <li><Link href="/portfolio">Portfolio</Link></li>
                <li><Link href="/blogs">Blogs</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h2>Services</h2>
              <ul>
                <li><Link href="/services">AI Solutions &amp; Automation</Link></li>
                <li><Link href="/services">Cybersecurity Services</Link></li>
                <li><Link href="/services">Custom Software Development</Link></li>
              </ul>
            </div>

            <div>
              <h2>Contact</h2>
              <ul>
                <li><a href="mailto:info@aicyro.com">info@aicyro.com</a></li>
                <li><a href="mailto:contact@aicyro.com">contact@aicyro.com</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="ax-foot__legal">
          <p>© {new Date().getFullYear()} Aicyro.</p>
          <ul>
            <li><Link href="/sitemap">Sitemap</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        <p className="ax-foot__word" aria-hidden="true">aicyro</p>
      </div>
    </footer>
  );
};

export default Footer;
