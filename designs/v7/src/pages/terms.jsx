import React, { useState, useEffect } from "react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";
import Seo from "../components/Essntials/Seo";
import Link from "next/link";
import { motion, MotionConfig, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, Download, MessageSquareText } from "lucide-react";

const TermsConditions = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // --- STATE FOR BUTTON VISIBILITY ---
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  // --- SCROLL LISTENER TO HANDLE APPEAR/DISAPPEAR ---
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const distanceToBottom = docHeight - (scrollY + windowHeight);

      // Show button if scrolled down more than 300px AND NOT at the bottom (200px buffer)
      if (scrollY > 300 && distanceToBottom > 200) {
        setShowFloatingButton(true);
      } else {
        setShowFloatingButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check in case user reloads mid-page
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- CONTENTS: mark the section in view (aria-current on its link). DOM only, no state ---
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    const links = new Map(
      Array.from(document.querySelectorAll(".rs-toc a[href^='#']")).map((a) => [
        a.getAttribute("href").slice(1),
        a,
      ]),
    );
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => a.removeAttribute("aria-current"));
          links.get(entry.target.id)?.setAttribute("aria-current", "true");
        }),
      { rootMargin: "-25% 0px -65% 0px" },
    );
    links.forEach((_, id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // --- PRINT HANDLER ---
  const handlePrint = () => {
    window.print();
  };

  // --- CONTENT DATA ---
  const allSections = [
    {
      id: "intro",
      title: "Introduction",
      content:
        "Welcome to AICYRO. By using our website or any of our services, you agree to the Terms & Conditions outlined below. Please read them carefully.",
    },
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content:
        "By accessing AICYRO’s website or engaging our services, you acknowledge that you have read and agreed to these Terms. If you do not agree, please discontinue use of our site and services.",
    },
    {
      id: "services",
      title: "2. Services We Provide",
      content: "AICYRO offers technology and digital services including:",
      list: [
        "SaaS Development",
        "Cybersecurity & Data Protection",
        "AI Solutions",
        "QA & Automation",
        "Cloud & DevOps",
        "Web & App Development",
        "Blockchain Solutions",
      ],
      footer: "We may update or expand our services at any time.",
    },
    {
      id: "use-of-website",
      title: "3. Use of Website",
      content: "You agree not to:",
      list: [
        "Misuse or disrupt the website",
        "Attempt unauthorized access",
        "Copy or redistribute content without permission",
        "Use our platform for illegal or harmful activities",
      ],
      footer: "All website content belongs to AICYRO.",
    },
    {
      id: "client-responsibilities",
      title: "4. Client Responsibilities",
      content: "Clients must:",
      list: [
        "Provide accurate information and required assets",
        "Approve deliverables in a timely manner",
        "Follow payment terms",
        "Respect confidentiality obligations",
      ],
      footer:
        "AICYRO is not responsible for delays caused by incomplete client feedback.",
    },
    {
      id: "payments",
      title: "5. Payments & Refunds",
      content:
        "Payments must be completed as stated in the proposal or contract.",
      footer:
        "Due to the nature of digital services, all payments are non-refundable, unless agreed otherwise in writing.",
    },
    {
      id: "intellectual-property",
      title: "6. Intellectual Property",
      content:
        "AICYRO retains ownership of internal tools, frameworks, and reusable components.",
      list: [
        "Clients own final, paid deliverables unless restricted by agreement.",
        "We may display non-confidential work in our portfolio unless an NDA prohibits this.",
      ],
    },
    {
      id: "confidentiality",
      title: "7. Confidentiality",
      content:
        "Both parties agree to protect sensitive information shared during the project.",
      footer: "Confidential data will not be disclosed unless required by law.",
    },
    {
      id: "third-party",
      title: "8. Third-Party Tools",
      content:
        "AICYRO may use third-party platforms (e.g., AWS, analytics, DevOps tools).",
      footer:
        "We are not responsible for issues caused by these external systems.",
    },
    {
      id: "liability",
      title: "9. Limitation of Liability",
      content: "AICYRO is not liable for:",
      list: [
        "Loss of data, revenue, or profits",
        "Client-side security issues",
        "Downtime from third-party providers",
        "Misuse of delivered software",
      ],
      footer:
        "Our maximum liability is limited to the amount paid for the specific project.",
    },
    {
      id: "termination",
      title: "10. Termination",
      content: "AICYRO may pause or terminate services if:",
      list: [
        "Payments are overdue",
        "Terms are violated",
        "Misuse is detected",
      ],
      footer: "Clients may also request termination as per their contract.",
    },
    {
      id: "updates",
      title: "11. Updates to Terms",
      content:
        "We may update these Terms anytime. Continued use of our site or services means you accept the updated Terms.",
    },
  ];

  return (
    <>
      <Seo
        title="Terms & Conditions - AICYRO"
        description="Read the Terms & Conditions for using AICYRO's services and website."
        url="/terms"
      />

      {/* --- PRINT STYLES (system colours: paper white, ink black on any theme) --- */}
      <style jsx global>{`
        @media print {
          header,
          nav,
          footer,
          button,
          input,
          .no-print {
            display: none !important;
          }
          body,
          main {
            background-color: Canvas !important;
            color: CanvasText !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          p,
          h1,
          h2,
          h3,
          li,
          span,
          ul {
            color: CanvasText !important;
            text-shadow: none !important;
          }
          .fixed {
            display: none !important;
          }
        }
      `}</style>

      {/* --- Reading Progress Bar (scroll-linked, decorative) --- */}
      <motion.div className="rs-readbar no-print" style={{ scaleX }} aria-hidden="true" />

      <Navbar />

      <main id="main">
        {/* --- Header Section --- */}
        <section className="ob-banner ob-ambient rs-hero" aria-labelledby="legal-title">
          <div className="ax-container">
            <div className="ob-banner__inner">
              <p className="ob-eyebrow" data-reveal>
                Legal
              </p>
              <h1 id="legal-title" className="ob-banner__title" data-reveal style={{ "--i": 1 }}>
                Terms &amp; Conditions
              </h1>

              <p className="ob-banner__lead" data-reveal style={{ "--i": 2 }}>
                Welcome to AICYRO. By using our website or any of our services, you
                agree to the Terms &amp; Conditions outlined below. Please read them
                carefully.
              </p>

              <div className="rs-hero__meta" data-reveal style={{ "--i": 3 }}>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="ax-btn ax-btn--quiet ax-btn--sm no-print"
                >
                  <Download size={16} aria-hidden="true" /> Download PDF
                </button>
                <span className="ax-chip">Last Updated: December 29, 2025</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- Contents beside the text --- */}
        <section className="rs-legal-wrap" aria-label="Terms and Conditions">
          <div className="ax-container rs-legal">
            <nav className="rs-toc no-print" aria-label="Sections">
              <p className="rs-kicker" aria-hidden="true">
                Sections
              </p>
              <ol>
                {allSections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="ax-prose">
              {allSections.map((section) => (
                <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
                  {/* Title */}
                  <h2 id={`${section.id}-title`}>{section.title}</h2>

                  {/* Content */}
                  {section.content && <p>{section.content}</p>}

                  {/* List */}
                  {section.list && (
                    <ul>
                      {section.list.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {/* Footer note */}
                  {section.footer && (
                    <p className="rs-legal__note">{section.footer}</p>
                  )}
                </section>
              ))}

              {/* --- Back Link --- */}
              <p className="no-print rs-legal__back">
                <Link href="/" className="ax-link">
                  <ArrowLeft size={16} aria-hidden="true" /> Back to Home
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* --- FLOATING CONTACT BUTTON (RIGHT CENTER, SCROLL TRIGGERED) --- */}
      <MotionConfig reducedMotion="user">
        <div className="rs-float no-print">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            // Controls: Visible if scrolled down AND not at bottom
            animate={{
              opacity: showFloatingButton ? 1 : 0,
              x: showFloatingButton ? 0 : 50,
              pointerEvents: showFloatingButton ? "auto" : "none",
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rs-float__inner"
          >
            {/* Text Label on Top */}
            <p className="rs-float__label">Want to know more?</p>

            {/* Action Button */}
            <Link href="/contact" className="ax-btn" tabIndex={showFloatingButton ? 0 : -1}>
              <span>Contact Us</span>
              <MessageSquareText size={18} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </MotionConfig>

      <Footer />
    </>
  );
};

export default TermsConditions;
