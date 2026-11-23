"use client";
// Hallmark redesign: a Banner hero over the flip-book, restyled on the paper tokens.
// The book, its pages and the previous/next controls work as before.
import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import Navbar from "@/components/Essntials/Navbar"; // Ensure this path matches your file structure
import Footer from "@/components/Essntials/footer";
import { Rocket } from "lucide-react";
import LeadMagnet from "@/components/Home/AIReadinessTeaser";

// --- THE PAGE COMPONENT ---
const Page = React.forwardRef((props, ref) => {
  return (
    <div className="demoPage blog-page" ref={ref}>
      <div
        className={`blog-page__inner${props.cover ? " blog-page__cover" : ""}`}
      >
        {props.children}

        <span className="blog-page__num">Page {props.number}</span>
      </div>
    </div>
  );
});
Page.displayName = "Page";

// --- MAIN LAYOUT ---

export default function NewsletterViewer() {
  const bookRef = useRef(null);

  const pages = [
    {
      id: 1,
      type: "cover",
      title: "Monthly insights",
      subtitle: "August 2025 Edition",
      desc: "Strategic Analysis & AI Trends",
    },
    {
      id: 2,
      type: "content",
      title: "Executive Summary",
      desc: "An overview of the rapid shifts in SaaS adoption across enterprise sectors.",
    },
    {
      id: 3,
      type: "content",
      title: "Q1 Performance",
      desc: "Analyzing the metrics that defined the first quarter growth trajectory.",
    },
    {
      id: 4,
      type: "content",
      title: "Market Trends",
      desc: "Emerging patterns in AI utilization and consumer behavior.",
    },
    {
      id: 5,
      type: "content",
      title: "Our Projects",
      desc: "A showcase of recent deliverables and success stories.",
    },
    {
      id: 6,
      type: "cover",
      title: "Aicyro Solutions",
      subtitle: "www.aicyro.com",
      desc: "Thank you for reading",
    },
  ];

  return (
    <>
      <Navbar />

      <main id="main">
        <header className="blog-banner">
          <div className="ax-container blog-banner__copy">
            <h1 className="ax-h1">Digital Library</h1>
            <p className="ax-lead">Flip to explore our latest reports</p>
          </div>
        </header>

        {/* FLIPBOOK */}
        <section className="ax-section" aria-label="Monthly insights, August 2025 Edition">
          <div className="ax-container blog-book">
            <div className="blog-book__frame">
              <HTMLFlipBook
                width={400}
                height={550}
                size="stretch"
                minWidth={300}
                maxWidth={500}
                minHeight={400}
                maxHeight={700}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                className="flip-book"
                ref={bookRef}
              >
                {pages.map((page, index) => (
                  <Page
                    number={index + 1}
                    key={page.id}
                    cover={page.type === "cover"}
                  >
                    {page.type === "cover" ? (
                      <>
                        <Rocket size={24} aria-hidden="true" />
                        <h2>{page.title}</h2>
                        <p className="blog-page__sub">{page.subtitle}</p>
                        <p>{page.desc}</p>
                      </>
                    ) : (
                      <>
                        <h3>{page.title}</h3>
                        <p>{page.desc}</p>
                        <p>
                          Detailed analytics and performance metrics for the{" "}
                          {page.title} section.
                        </p>
                      </>
                    )}
                  </Page>
                ))}
              </HTMLFlipBook>
            </div>

            {/* CONTROLS */}
            <div className="blog-book__controls">
              <button
                type="button"
                onClick={() => bookRef.current.pageFlip().flipPrev()}
                className="ax-btn ax-btn--quiet"
              >
                Previous page
              </button>

              <button
                type="button"
                onClick={() => bookRef.current.pageFlip().flipNext()}
                className="ax-btn"
              >
                Next page
              </button>
            </div>
          </div>
        </section>

        <LeadMagnet />
      </main>

      <Footer />
    </>
  );
}
