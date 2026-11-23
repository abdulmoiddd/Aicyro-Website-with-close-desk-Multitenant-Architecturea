import React, { useState, useEffect } from "react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";
import Seo from "../../components/Essntials/Seo";
import CaseStudy, { CaseStudyLoading, CaseStudyError, CaseStudyGallery } from "../../components/portfolio/CaseStudy";

// --- FIREBASE IMPORTS ---
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";

// --- MOCK DATA FOR CHARTS ---
const leadsData = [
  { month: "Jan", manual: 120, ai: 140 },
  { month: "Feb", manual: 115, ai: 280 },
  { month: "Mar", manual: 125, ai: 450 },
  { month: "Apr", manual: 110, ai: 620 },
  { month: "May", manual: 130, ai: 890 },
  { month: "Jun", manual: 120, ai: 1150 },
];

const efficiencyData = [
  { task: "Lead Qual.", manual: 45, ai: 2 },
  { task: "Data Entry", manual: 30, ai: 0.5 },
  { task: "Emailing", manual: 60, ai: 5 },
  { task: "Scheduling", manual: 25, ai: 1 },
];

// --- MOCK GALLERY ---
const mockGallery = [
  {
    id: 1,
    src: "https://dummyimages.netlify.app/portfolioimagaes/Body%20langyage/1.jpg",
    label: "CRM Dashboard",
    desc: "Real-time pipeline monitoring",
  },
  {
    id: 2,
    src: "https://dummyimages.netlify.app/portfolioimagaes/Body%20langyage/2.jpg",
    label: "Lead Scoring",
    desc: "AI-driven probability metrics",
  },
  {
    id: 3,
    src: "https://dummyimages.netlify.app/portfolioimagaes/Body%20langyage/3.jpg",
    label: "Email Sequence",
    desc: "Automated follow-up flows",
  },
  {
    id: 4,
    src: "https://dummyimages.netlify.app/portfolioimagaes/Body%20langyage/4.jpg",
    label: "Bot Analytics",
    desc: "Conversational conversion tracking",
  },
  {
    id: 5,
    src: "https://dummyimages.netlify.app/portfolioimagaes/Body%20langyage/5.jpg",
    label: "Data Pipeline",
    desc: "Integration nodes",
  },
];

// The page's charts, drawn by the shared template (components/portfolio/CaseStudy.jsx)
const charts = [
  { title: "Processing Capacity", note: "Leads Processed: Manual vs AI", kind: "area", data: leadsData, x: "month", series: [{ key: "ai", stackId: "1", tone: "accent" }, { key: "manual", stackId: "2", tone: "quiet" }] },
  { title: "Time Saved (Mins/Task)", note: "Drastic reduction in manual overhead", kind: "bar", layout: "vertical", data: efficiencyData, x: "task", yWidth: 96, barGap: 2, series: [{ key: "manual", tone: "quiet", barSize: 12 }, { key: "ai", tone: "accent", barSize: 12 }] },
];

const SalesAutomationProject = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carousel State
  const [activeImage, setActiveImage] = useState(0);

  // --- FETCH DATA ---
  useEffect(() => {
    const portfolioRef = ref(database, "Protfolio/sales-ai-automation");
    const unsubscribe = onValue(
      portfolioRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
          setLoading(false);
        } else {
          console.warn("No data found");
          setError("Project content not found.");
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firebase Read Error:", err);
        setError("Failed to load project data.");
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  // --- CAROUSEL LOGIC ---
  const galleryImages = data?.gallery || mockGallery;

  const handleNext = () => {
    setActiveImage((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrev = () => {
    setActiveImage(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length,
    );
  };

  // --- LOADING / ERROR STATES ---
  if (loading) {
    return (
      <>
        <Navbar />
        <CaseStudyLoading label="Automating..." />
        <Footer />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Navbar />
        <CaseStudyError message={error || "Data unavailable"} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Seo
        title={data.title || "AI Sales Automation"}
        description={data.overview ? data.overview.slice(0, 160) : "AI Sales."}
        url="/portfolio/sales-automation"
      />
      <Navbar />
      <CaseStudy
        projectKey="sales-ai-automation"
        data={data}
        tagFallback="Workflow Automation"
        heads={{
          overview: "Automation Workflow",
          scope: "System Modules",
          metrics: "Automation Impact",
          tech: "Tech Stack",
          deliverables: "Key Deliverables",
        }}
        charts={charts}
        gallery={
          <CaseStudyGallery
            images={galleryImages}
            active={activeImage}
            onSelect={(index) => setActiveImage(index)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        }
      />
      <Footer />
    </>
  );
};

export default SalesAutomationProject;
