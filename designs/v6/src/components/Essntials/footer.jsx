// src/components/Essntials/footer.jsx
// Walk-in redesign: the exit. A lit room at the foot of every public page: the
// company line large beside the booking actions, the same link columns, then a giant
// wordmark that slides sideways as you reach the bottom, and the legal row.
// Every link and address is unchanged.
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Assets
import logo from "../../assets/logo.png";
import logowhite from "../../assets/logowhite.png";

const Footer = () => {
  // State to track theme for the Logo switch
  const [theme, setTheme] = useState("light");
  const footRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: footRef, offset: ["start end", "end end"] });
  const markX = useTransform(scrollYProgress, [0, 1], ["18%", "-4%"]);

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
    <footer className="ax-foot" ref={footRef}>
      <div className="ax-container">
        <div className="ax-foot__top">
          <p className="ax-foot__statement">
            Aicyro provides AI-powered cybersecurity, automation, and custom software solutions for modern businesses.
          </p>
          <p className="ax-foot__cta">
            <Link href="/contact" className="ax-btn">
              Book Free Consultation <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </p>
        </div>

        <div className="ax-foot__cols">
          <div>
            <Link href="/" aria-label="Aicyro Solutions, home">
              {/* Light theme shows the dark-ink logo file, dark theme the light one (as before) */}
              <Image src={theme === "light" ? logowhite : logo} alt="Aicyro Solutions" className="ax-nav__logo" />
            </Link>
            <p className="ax-foot__about">Custom software, AI and security, built in sprints you can see.</p>
          </div>

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

      <motion.p className="ax-foot__mark" style={reduce ? undefined : { x: markX }} aria-hidden="true">
        Aicyro Aicyro
      </motion.p>

      <div className="ax-container">
        <div className="ax-foot__legal">
          <p>© {new Date().getFullYear()} Aicyro.</p>
          <ul>
            <li><Link href="/sitemap">Sitemap</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
