// src/components/Essntials/Navbar.jsx
// Redesign v3 (Aurora Studio): a floating glass pill. Wordmark, five destinations with a
// hover pill that glides between them, a services mega panel with icons and a
// consultation card, the theme switch and Contact. Same links, same theme logic as before.
import React, { useState, useRef, useEffect, useId } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Blocks,
  ChevronDown,
  Cloud,
  Code2,
  Layers,
  Menu,
  Moon,
  ShieldCheck,
  Smartphone,
  Sun,
  TestTube2,
  X,
} from "lucide-react";

// --- ASSETS ---
import Logo from "../../assets/logo.png";
import logoWhite from "../../assets/logowhite.png";

// --- Navigation data (unchanged destinations) ---
const services = [
  { name: "SaaS Development", to: "/services/saas-development", desc: "Scalable cloud software.", Icon: Layers },
  { name: "Cybersecurity", to: "/services/cybersecurity-data-protection", desc: "Protect your data.", Icon: ShieldCheck },
  { name: "AI Solutions", to: "/services/ai-solutions", desc: "Intelligent automation.", Icon: Bot },
  { name: "QA & Automation", to: "/services/qa-automation", desc: "Bug-free deployment.", Icon: TestTube2 },
  { name: "Cloud & DevOps", to: "/services/cloud-devops", desc: "Infrastructure management.", Icon: Cloud },
  { name: "Web Development", to: "/services/web-development", desc: "Modern frontend solutions.", Icon: Code2 },
  { name: "App Development", to: "/services/app-development", desc: "iOS and Android apps.", Icon: Smartphone },
  { name: "Blockchain", to: "/services/blockchain", desc: "Decentralized ledgers.", Icon: Blocks },
];

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Services", to: "/services", subLinks: services },
  { name: "Portfolio", to: "/portfolio" },
  { name: "Blogs", to: "/blogs" },
  { name: "About", to: "/about" },
];

// --- Theme switch (same storage key and attribute as before) ---
const ThemeToggle = ({ theme, toggleTheme }) => {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="ax-icon-btn"
      aria-label="Toggle Theme"
      aria-pressed={isDark}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}
    </button>
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const panelId = useId();
  const reduceMotion = useReducedMotion();

  // --- THEME STATE ---
  const [theme, setTheme] = useState("light");

  // The shared ThemeProvider (src/Closedesk/ThemeProvider.jsx) applies the public site's
  // mode from "closeDesk-theme" on every route and listens for "closeDesk-theme-change";
  // the website's own key "theme" is kept in step so both agree.
  const THEME_KEY = "closeDesk-theme";
  const THEME_EVENT = "closeDesk-theme-change";

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) || localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
      // Carry a choice saved under the old key over to the provider's key
      if (localStorage.getItem(THEME_KEY) !== savedTheme) {
        localStorage.setItem(THEME_KEY, savedTheme);
        window.dispatchEvent(new Event(THEME_EVENT));
      }
    } else {
      setTheme("light");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  const router = useRouter();
  const timeoutRef = useRef(null);

  const handleMouseEnter = (menuName) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(menuName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  // Stronger shadow once the page scrolls under the pill
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the disclosure on Escape and when the route changes
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };
    const onRoute = () => {
      setActiveDropdown(null);
      setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    router.events?.on("routeChangeStart", onRoute);
    return () => {
      window.removeEventListener("keydown", onKey);
      router.events?.off("routeChangeStart", onRoute);
    };
  }, [router.events]);

  // Lock page scroll behind the phone menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileMenuOpen]);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const toggleMobileSubMenu = (menuName) => {
    setMobileSubMenuOpen((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const isActive = (path) => {
    if (!router?.pathname) return false;
    if (path === "/") return router.pathname === "/";
    return router.pathname.startsWith(path);
  };

  // The gliding hover pill behind the hovered link
  const hoverPill = (name) =>
    hovered === name ? (
      <motion.span
        layoutId="ax-nav-hover"
        className="ax-nav__hover"
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
        aria-hidden="true"
      />
    ) : null;

  return (
    <nav className="ax-nav" aria-label="Main" data-scrolled={scrolled ? "true" : "false"}>
      <a className="ax-skip" href="#main">
        Skip to content
      </a>
      <div className="ax-nav__row">
        <div className="ax-nav__brand">
          <Link href="/" aria-label="Aicyro, home" onClick={() => setIsMobileMenuOpen(false)}>
            <Image
              // Light theme shows the dark-ink logo file, dark theme the light one (as before)
              src={theme === "light" ? logoWhite : Logo}
              alt="Company Logo"
              priority
              className="ax-nav__logo"
            />
          </Link>
        </div>

        <ul className="ax-nav__links" onMouseLeave={() => setHovered(null)}>
          {navLinks.map((link) =>
            link.subLinks ? (
              <li
                key={link.name}
                className="ax-nav__item"
                onMouseEnter={() => {
                  handleMouseEnter(link.name);
                  setHovered(link.name);
                }}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  className="ax-nav__link"
                  aria-expanded={activeDropdown === link.name}
                  aria-controls={panelId}
                  aria-current={isActive(link.to) ? "page" : undefined}
                  onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                  onFocus={() => setHovered(link.name)}
                >
                  {hoverPill(link.name)}
                  {link.name}
                  <ChevronDown size={16} aria-hidden="true" />
                </button>
                <AnimatePresence>
                  {activeDropdown === link.name && (
                    <motion.div
                      className="ax-nav__panel"
                      id={panelId}
                      initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ul>
                        {link.subLinks.map(({ name, to, desc, Icon }) => (
                          <li key={name}>
                            <Link href={to}>
                              <i aria-hidden="true">
                                <Icon size={20} />
                              </i>
                              {name}
                              <span>{desc}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="ax-nav__promo">
                        <div className="ax-nav__panel-foot">
                          <p>Not sure which service fits?</p>
                          <p className="ax-meta">Tell us about your product and we will map the right team to it.</p>
                        </div>
                        <div className="ax-nav__panel-foot">
                          <Link href="/contact" className="ax-btn ax-btn--sm">
                            Book Free Consultation
                          </Link>
                          <Link href={link.to} className="ax-link">
                            All services
                            <ArrowRight size={16} aria-hidden="true" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ) : (
              <li key={link.name} onMouseEnter={() => setHovered(link.name)}>
                <Link
                  href={link.to}
                  className="ax-nav__link"
                  aria-current={isActive(link.to) ? "page" : undefined}
                  onFocus={() => setHovered(link.name)}
                >
                  {hoverPill(link.name)}
                  {link.name}
                </Link>
              </li>
            )
          )}
        </ul>

        <div className="ax-nav__end">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <Link href="/contact" className="ax-btn ax-btn--sm">
            Contact Us
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={toggleMenu}
            className="ax-icon-btn ax-nav__menu-btn"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && <div className="ax-nav__scrim" onClick={toggleMenu} aria-hidden="true" />}
      <div className="ax-nav__sheet" data-open={isMobileMenuOpen}>
        <ul>
          {navLinks.map((link) => (
            <li key={link.name}>
              {link.subLinks ? (
                <>
                  <button
                    type="button"
                    className="ax-nav__sheet-toggle"
                    aria-expanded={!!mobileSubMenuOpen[link.name]}
                    onClick={() => toggleMobileSubMenu(link.name)}
                  >
                    <span>{link.name}</span>
                    <ChevronDown size={20} aria-hidden="true" />
                  </button>
                  {mobileSubMenuOpen[link.name] && (
                    <ul>
                      <li>
                        <Link href={link.to} onClick={toggleMenu}>
                          All services
                        </Link>
                      </li>
                      {link.subLinks.map((s) => (
                        <li key={s.name}>
                          <Link href={s.to} onClick={toggleMenu}>
                            {s.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link href={link.to} onClick={toggleMenu} aria-current={isActive(link.to) ? "page" : undefined}>
                  {link.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <Link href="/contact" className="ax-btn" onClick={toggleMenu}>
          Contact Us
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
