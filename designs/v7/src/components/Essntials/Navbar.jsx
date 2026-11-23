// src/components/Essntials/Navbar.jsx
// Obsidian redesign: a floating glass bar. Wordmark, four destinations (Work, Capabilities
// with the services disclosure, About, Contact), the light/dark switch and a high-contrast pill; a full-screen
// drawer on phones. On the home page it stays out of the way during the walk-in entry and
// slides in once the visitor starts scrolling (pass `revealAfter`, in px). Keyboard focus
// always brings it back. The super admin portal keeps the frozen bar (legacy/LegacyNavbar).
import React, { useState, useRef, useEffect, useId } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, Moon, Sun, X } from "lucide-react";

import Logo from "../../assets/logo.png";
import LogoInk from "../../assets/logowhite.png"; // the dark-ink logo, for light themes
import useSiteTheme from "./useSiteTheme";

// --- Navigation data (same destinations as before) ---
export const SERVICES = [
  { name: "SaaS Development", to: "/services/saas-development", desc: "Scalable cloud software." },
  { name: "Cybersecurity", to: "/services/cybersecurity-data-protection", desc: "Protect your data." },
  { name: "AI Solutions", to: "/services/ai-solutions", desc: "Intelligent automation." },
  { name: "QA & Automation", to: "/services/qa-automation", desc: "Bug-free deployment." },
  { name: "Cloud & DevOps", to: "/services/cloud-devops", desc: "Infrastructure management." },
  { name: "Web Development", to: "/services/web-development", desc: "Modern frontend solutions." },
  { name: "App Development", to: "/services/app-development", desc: "iOS and Android apps." },
  { name: "Blockchain", to: "/services/blockchain", desc: "Decentralized ledgers." },
];

const NAV = [
  { name: "Work", to: "/portfolio" },
  { name: "Capabilities", to: "/services", subLinks: SERVICES },
  { name: "About", to: "/about" },
  { name: "Contact", to: "/contact" },
];

// The drawer also lists the journal
const SHEET = [NAV[0], NAV[1], NAV[2], { name: "Insights", to: "/blogs" }, NAV[3]];

// `overlay`: the bar floats over the page's first screen (home). Otherwise a spacer keeps
// the page's content clear of the fixed bar, as the old sticky bar did.
const Navbar = ({ revealAfter = null, overlay = false }) => {
  const router = useRouter();
  const panelId = useId();
  const timeoutRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(revealAfter != null);
  const { theme, toggle: toggleTheme } = useSiteTheme();
  const isDark = theme === "dark";

  // Scroll state: glass deepens after 24px; on the home page the bar waits for the walk-in
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(revealAfter != null && y < revealAfter);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [revealAfter]);

  // Escape closes; a route change closes everything
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setDropdown(false);
        setOpen(false);
      }
    };
    const onRoute = () => {
      setDropdown(false);
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    router.events?.on("routeChangeStart", onRoute);
    return () => {
      window.removeEventListener("keydown", onKey);
      router.events?.off("routeChangeStart", onRoute);
    };
  }, [router.events]);

  // Lock the page behind the drawer
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const enter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdown(true);
  };
  const leave = () => {
    timeoutRef.current = setTimeout(() => setDropdown(false), 180);
  };

  const isActive = (path) => {
    if (!router?.pathname) return false;
    if (path === "/") return router.pathname === "/";
    return router.pathname.startsWith(path);
  };

  return (
    <>
      <a className="ax-skip" href="#main">
        Skip to content
      </a>
      <nav
        className="ob-nav"
        aria-label="Main"
        data-hidden={hidden && !open ? "true" : "false"}
        data-scrolled={scrolled ? "true" : "false"}
      >
        <div className="ob-nav__bar">
          <Link href="/" className="ob-nav__brand" aria-label="Aicyro, home" onClick={() => setOpen(false)}>
            <Image src={isDark ? Logo : LogoInk} alt="" priority className="ob-nav__logo" />
          </Link>

          <ul className="ob-nav__links">
            {NAV.map((link) =>
              link.subLinks ? (
                <li key={link.name} className="ob-nav__item" onMouseEnter={enter} onMouseLeave={leave}>
                  <button
                    type="button"
                    className="ob-nav__link"
                    aria-expanded={dropdown}
                    aria-controls={panelId}
                    aria-current={isActive(link.to) ? "page" : undefined}
                    onClick={() => setDropdown((v) => !v)}
                  >
                    {link.name}
                    <ChevronDown size={15} aria-hidden="true" />
                  </button>
                  {dropdown && (
                    <div className="ob-nav__panel" id={panelId}>
                      <ul>
                        {link.subLinks.map((s) => (
                          <li key={s.name}>
                            <Link href={s.to}>
                              {s.name}
                              <span>{s.desc}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="ob-nav__panel-foot">
                        <Link href={link.to} className="ax-link">
                          All capabilities
                        </Link>
                        <Link href="/resources/project-estimate" className="ax-link">
                          Estimate a project
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              ) : (
                <li key={link.name}>
                  <Link
                    href={link.to}
                    className="ob-nav__link"
                    aria-current={isActive(link.to) ? "page" : undefined}
                  >
                    {link.name}
                  </Link>
                </li>
              )
            )}
          </ul>

          <div className="ob-nav__end">
            <button
              type="button"
              onClick={toggleTheme}
              className="ax-icon-btn ob-nav__theme"
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              aria-pressed={isDark}
              title={isDark ? "Light theme" : "Dark theme"}
            >
              {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button>
            <Link href="/contact" className="ax-btn ax-btn--sm">
              Start a project
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="ax-icon-btn ob-nav__menu-btn"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls={`${panelId}-sheet`}
            >
              {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </nav>
      {!overlay && <div className="ob-nav-spacer" aria-hidden="true" />}

      <div
        id={`${panelId}-sheet`}
        className="ob-nav__sheet"
        data-open={open ? "true" : "false"}
        aria-hidden={!open}
        inert={!open}
      >
        <ul>
          {SHEET.map((link, i) => (
            <li key={link.name} style={{ "--i": i }}>
              {link.subLinks ? (
                <>
                  <button type="button" aria-expanded={subOpen} onClick={() => setSubOpen((v) => !v)}>
                    <span>{link.name}</span>
                    <ChevronDown size={22} aria-hidden="true" />
                  </button>
                  {subOpen && (
                    <ul>
                      <li>
                        <Link href={link.to} onClick={() => setOpen(false)}>
                          All capabilities
                        </Link>
                      </li>
                      {link.subLinks.map((s) => (
                        <li key={s.name}>
                          <Link href={s.to} onClick={() => setOpen(false)}>
                            {s.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  href={link.to}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.to) ? "page" : undefined}
                >
                  {link.name}
                  <ArrowUpRight size={22} aria-hidden="true" />
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="ob-nav__sheet-foot">
          <Link href="/contact" className="ax-btn" onClick={() => setOpen(false)}>
            Start a project
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <p>info@aicyro.com</p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
