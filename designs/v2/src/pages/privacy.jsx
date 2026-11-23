import React, { useState, useEffect } from "react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";
import Seo from "../components/Essntials/Seo";
import Link from "next/link";
import { motion, MotionConfig, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, CalendarClock, ChevronDown, Download, ListTree, MessageSquareText } from "lucide-react";

// Redesign v3 (Aurora Studio): a page hero, then the contents (sticky glass card on wide
// screens, a disclosure on small ones) beside the policy in .ax-prose. Every sentence,
// the print handler, the reading bar and the floating contact button are unchanged.
const PrivacyPolicy = () => {
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

  // --- CONTENTS: mark the section being read (display only) ---
  const [activeId, setActiveId] = useState(null);
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    const els = Array.from(document.querySelectorAll(".ms-legal .ax-prose > section[id]"));
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (seen[0]) setActiveId(seen[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    els.forEach((el) => io.observe(el));
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
      title: "1. Introduction",
      content:
        "Welcome to Aicyro AI (“Company,” “we,” “us,” or “our”). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, disclose, and safeguard information when you visit or interact with our website (the “Website”).",
      footer:
        "This policy applies to users worldwide, including those located in the European Union, United States, and other jurisdictions with data protection laws. By using our Website, you agree to the practices described herein.",
    },
    {
      id: "controller",
      title: "2. Who We Are (Data Controller)",
      content:
        "For the purposes of applicable data protection laws, including the General Data Protection Regulation (GDPR), Aicyro AI acts as the Data Controller for personal data collected through this Website.",
      footer:
        "If you have questions regarding this policy or your personal data, please refer to Section 16 (Contact Us).",
    },
    {
      id: "collection-voluntary",
      title: "3.1 Information You Provide Voluntarily",
      content:
        "We may collect personal information that you choose to provide when you contact us, request services, or subscribe to communications. This includes:",
      list: [
        "Full name",
        "Email address",
        "Phone number",
        "Company name",
        "Message content or inquiry details",
      ],
    },
    {
      id: "collection-auto",
      title: "3.2 Information Collected Automatically",
      content:
        "When you visit the Website, certain information is collected automatically using cookies, server logs, and similar technologies:",
      list: [
        "IP address",
        "Browser type and version",
        "Device information and operating system",
        "Pages visited and interaction data",
        "Referring and exit URLs",
        "Date and time of access",
      ],
    },
    {
      id: "usage",
      title: "4. How We Use Your Information",
      content:
        "We process personal data to operate, maintain, and improve our Website. Specific purposes include:",
      list: [
        "Responding to inquiries and support requests",
        "Providing information about our services",
        "Monitoring performance, usage trends, and security",
        "Complying with legal and regulatory obligations",
        "Preventing fraud, abuse, or unauthorized access",
      ],
      footer: "We do not sell personal data.",
    },
    {
      id: "ai-transparency",
      title: "5. AI & Automated Processing Transparency",
      content:
        "As an AI-focused company, transparency is important to us. Personal data submitted through the Website is not used to train or improve AI models unless explicitly stated and consent is obtained.",
      list: [
        "We do not engage in automated decision-making that produces legal effects on users via this Website.",
        "Any AI-related processing is subject to appropriate human oversight and security safeguards.",
      ],
    },
    {
      id: "cookies",
      title: "6. Cookies and Tracking Technologies",
      content:
        "We use cookies and similar technologies to ensure proper Website functionality and to analyze usage.",
      list: [
        "Essential cookies: Required for core functionality.",
        "Analytics cookies: Help us understand Website performance.",
        "Third-party cookies: Set by trusted service providers.",
      ],
      footer:
        "You may manage or disable cookies through your browser settings, though this may affect certain Website features.",
    },
    {
      id: "legal-bases",
      title: "7. Legal Bases for Processing (GDPR)",
      content: "Where GDPR applies, we rely on the following lawful bases:",
      list: [
        "Consent: Where you have given clear permission.",
        "Contractual necessity: To respond to service inquiries.",
        "Legitimate interests: To operate and improve our Website.",
        "Legal obligation: To comply with applicable laws.",
      ],
    },
    {
      id: "retention",
      title: "8. Data Retention",
      content:
        "We retain personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When data is no longer needed, it is securely deleted or anonymized.",
    },
    {
      id: "sharing",
      title: "9. Data Sharing and Third-Party Services",
      content:
        "We may share personal data with trusted third parties only when necessary. All providers must maintain appropriate security measures.",
      list: [
        "Website hosting and infrastructure providers (e.g., Netlify)",
        "Analytics and performance monitoring services",
        "Legal or regulatory authorities, when required by law",
      ],
    },
    {
      id: "international",
      title: "10. International Data Transfers",
      content:
        "Your information may be transferred to and processed in countries outside your country of residence. When such transfers occur, we implement appropriate safeguards to ensure compliance with applicable data protection laws.",
    },
    {
      id: "rights-gdpr",
      title: "11.1 Your Privacy Rights (GDPR)",
      content: "Residents of the EU/EEA have the right to:",
      list: [
        "Access your personal data",
        "Correct inaccurate or incomplete data",
        "Request deletion of your data",
        "Restrict or object to processing",
        "Request data portability",
        "Withdraw consent at any time",
      ],
      footer:
        "You also have the right to lodge a complaint with your local data protection authority.",
    },
    {
      id: "rights-ccpa",
      title: "11.2 Your Privacy Rights (CCPA/CPRA)",
      content: "California residents have the right to:",
      list: [
        "Know what personal data is collected",
        "Request deletion of personal data",
        "Opt out of the sale or sharing of personal data (we do not sell data)",
        "Not be discriminated against for exercising privacy rights",
      ],
    },
    {
      id: "security",
      title: "12. Security Measures",
      content:
        "We implement reasonable administrative, technical, and organizational safeguards designed to protect personal data. However, no system is completely secure, and we cannot guarantee absolute security.",
    },
    {
      id: "children",
      title: "13. Children’s Privacy",
      content:
        "Our Website is not intended for children under the age of 13, and we do not knowingly collect personal data from children.",
    },
    {
      id: "links",
      title: "14. Third-Party Links",
      content:
        "Our Website may contain links to third-party websites. We are not responsible for the privacy practices or content of external sites.",
    },
    {
      id: "changes",
      title: "15. Changes to This Privacy Policy",
      content:
        "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated “Last Updated” date. Continued use of the Website constitutes acceptance of the revised policy.",
    },
    {
      id: "contact",
      title: "16. Contact Us",
      content:
        "If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us.",
      list: [
        "Email: privacy@aicyro.ai",
        "Website: https://aicyro.com/",
      ],
    },
  ];

  return (
    <>
      <Seo
        title="Privacy Policy - Aicyro AI"
        description="Learn how Aicyro AI collects, protects, and handles your data, including our AI transparency and security policies."
        url="/privacy"
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
      <motion.div className="ms-readbar no-print" style={{ scaleX }} aria-hidden="true" />

      <Navbar />

      <main id="main">
        {/* --- Header Section --- */}
        <section className="ax-pagehero" aria-labelledby="legal-title">
          <span className="ax-gridbg" aria-hidden="true" />
          <div className="ax-container ax-pagehero__inner">
            <nav aria-label="Breadcrumb" className="ax-rise" style={{ "--i": 0 }}>
              <ul className="ax-crumbs">
                <li><Link href="/">Home</Link></li>
                <li aria-current="page">Privacy Policy</li>
              </ul>
            </nav>
            <p className="ax-eyebrow ax-rise" style={{ "--i": 1 }}>
              <span>Legal</span>
            </p>
            <h1 id="legal-title" className="ax-h1--s ax-rise" style={{ "--i": 2 }}>
              Privacy <span className="ax-grad">Policy</span>
            </h1>

            <p className="ax-lead ax-rise" style={{ "--i": 3 }}>
              Aicyro AI respects your privacy. This policy explains how we collect,
              use, and protect your data when you visit our website.
            </p>

            <div className="ms-meta ax-rise" style={{ "--i": 4 }}>
              <button
                type="button"
                onClick={handlePrint}
                className="ax-btn ax-btn--quiet ax-btn--sm no-print"
              >
                <Download size={16} aria-hidden="true" /> Download PDF
              </button>
              <span className="ax-chip">
                <CalendarClock size={14} aria-hidden="true" /> Last Updated: January 20, 2026
              </span>
              <span className="ax-chip">
                <CalendarClock size={14} aria-hidden="true" /> Effective Date: January 20, 2026
              </span>
            </div>
          </div>
        </section>

        {/* --- Contents beside the text --- */}
        <section className="ax-section pt-0" aria-label="Privacy Policy">
          <div className="ax-container ms-legal">
            <details className="ms-toc-m no-print">
              <summary>
                <ListTree size={18} aria-hidden="true" />
                <span>On this page</span>
                <ChevronDown size={18} className="ms-toc-m__chev" aria-hidden="true" />
              </summary>
              <nav aria-label="Sections">
                <ol>
                  {allSections.map((section) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`}>{section.title}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            </details>

            <nav className="ms-toc no-print" aria-label="Sections">
              <p className="ms-toc__label">
                <ListTree size={14} aria-hidden="true" /> On this page
              </p>
              <ol>
                {allSections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      aria-current={activeId === section.id ? "true" : undefined}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="ms-legal__body">
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
                      <p className="ms-note">{section.footer}</p>
                    )}
                  </section>
                ))}

                {/* --- Back Link --- */}
                <p className="no-print ms-back">
                  <Link href="/" className="ax-link">
                    <ArrowLeft size={16} aria-hidden="true" /> Back to Home
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- FLOATING CONTACT BUTTON (RIGHT CENTER, SCROLL TRIGGERED) --- */}
      <MotionConfig reducedMotion="user">
        <div className="ms-float no-print">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            // Controls: Visible if scrolled down AND not at bottom
            animate={{
              opacity: showFloatingButton ? 1 : 0,
              x: showFloatingButton ? 0 : 50,
              pointerEvents: showFloatingButton ? "auto" : "none",
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="ms-float__inner"
          >
            {/* Text Label on Top */}
            <p className="ms-float__label">Questions about data?</p>

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

export default PrivacyPolicy;
