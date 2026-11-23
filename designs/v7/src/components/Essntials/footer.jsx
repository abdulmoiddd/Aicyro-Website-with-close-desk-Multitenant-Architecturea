// src/components/Essntials/footer.jsx
// Obsidian redesign: an architectural footer. Four columns (brand summary with the booking
// action, navigation, capabilities, contact and social), the wordmark in outline across the
// width, then the legal row. Every link and address from the previous footer is kept; the
// social profiles come from the site's Organization schema. The super admin portal keeps
// the frozen footer (legacy/LegacyFooter).
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import logo from "../../assets/logo.png";
import logoInk from "../../assets/logowhite.png";
import useSiteTheme from "./useSiteTheme";

const SOCIAL = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/aicyro-solutions" },
  { name: "X", href: "https://x.com/aicyro" },
  { name: "Instagram", href: "https://www.instagram.com/aicyro" },
  { name: "Facebook", href: "https://www.facebook.com/aicyro" },
];

const Footer = () => {
  const { theme } = useSiteTheme();
  return (
    <footer className="ob-foot">
      <div className="ax-container">
        <div className="ob-foot__grid">
          <div className="ob-foot__brand">
            <Link href="/" aria-label="Aicyro Solutions, home">
              <Image src={theme === "dark" ? logo : logoInk} alt="Aicyro Solutions" className="ob-nav__logo" />
            </Link>
            <p>
              Aicyro provides AI-powered cybersecurity, automation, and custom software solutions for modern
              businesses.
            </p>
            <p>
              <Link href="/contact" className="ax-btn ax-btn--quiet">
                Book Free Consultation
              </Link>
            </p>
          </div>

          <div>
            <h2>Navigate</h2>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/portfolio">Work</Link></li>
              <li><Link href="/services">Capabilities</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/blogs">Insights</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h2>Capabilities</h2>
            <ul>
              <li><Link href="/services/ai-solutions">AI Solutions &amp; Automation</Link></li>
              <li><Link href="/services/cybersecurity-data-protection">Cybersecurity Services</Link></li>
              <li><Link href="/services/saas-development">Custom Software Development</Link></li>
              <li><Link href="/resources/project-estimate">Project Estimator</Link></li>
              <li><Link href="/free-website-audit">Free Website Audit</Link></li>
            </ul>
          </div>

          <div>
            <h2>Contact</h2>
            <ul>
              <li><a href="mailto:info@aicyro.com">info@aicyro.com</a></li>
              <li><a href="mailto:contact@aicyro.com">contact@aicyro.com</a></li>
              {SOCIAL.map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.name}
                    <ArrowUpRight size={14} aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="ob-foot__mark" aria-hidden="true">
        AICYRO
      </p>

      <div className="ax-container">
        <div className="ob-foot__legal">
          <p>© {new Date().getFullYear()} Aicyro Solutions. Islamabad, Pakistan.</p>
          <ul>
            <li><Link href="/sitemap">Sitemap</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/cookie">Cookies</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
