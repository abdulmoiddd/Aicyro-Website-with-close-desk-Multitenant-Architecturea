import React, { useState, useEffect } from "react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";
import Seo from "../../components/Essntials/Seo";
import CaseStudy, { CaseStudyLoading, CaseStudyError, CaseStudyGallery } from "../../components/portfolio/CaseStudy";

// --- FIREBASE IMPORTS ---
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";

// --- MOCK DATA FOR CHARTS (AI/Vision Context) ---
const sessionData = [
  { time: "00:00", confidence: 65, engagement: 70 },
  { time: "02:00", confidence: 72, engagement: 75 },
  { time: "04:00", confidence: 68, engagement: 82 },
  { time: "06:00", confidence: 85, engagement: 88 },
  { time: "08:00", confidence: 90, engagement: 85 },
  { time: "10:00", confidence: 88, engagement: 92 },
  { time: "12:00", confidence: 95, engagement: 90 },
];

const skillMetrics = [
  { subject: "Vocal Tone", A: 85, fullMark: 100 },
  { subject: "Facial Expr.", A: 92, fullMark: 100 },
  { subject: "Posture", A: 78, fullMark: 100 },
  { subject: "Eye Contact", A: 88, fullMark: 100 },
  { subject: "Gesture Usage", A: 70, fullMark: 100 },
  { subject: "Pacing", A: 82, fullMark: 100 },
];

// --- MOCK GALLERY (Fallback if no data in Firebase) ---
const mockGallery = [
  {
    id: 1,
    src: "https://dummyimages.netlify.app/portfolioimagaes/Body%20langyage/1.jpg",
    label: "Facial Mapping",
  },
  {
    id: 2,
    src: "https://dummyimages.netlify.app/portfolioimagaes/Body%20langyage/2.jpg",
    label: "Code Analysis",
  },
  {
    id: 3,
    src: "https://dummyimages.netlify.app/portfolioimagaes/Body%20langyage/3.jpg",
    label: "Data Stream",
  },
  {
    id: 4,
    src: "https://dummyimages.netlify.app/portfolioimagaes/Body%20langyage/4.jpg",
    label: "Security Grid",
  },
  {
    id: 5,
    src: "https://dummyimages.netlify.app/portfolioimagaes/Body%20langyage/5.jpg",
    label: "Heatmap View",
  },
  {
    id: 6,
    src: "https://dummyimages.netlify.app/portfolioimagaes/Body%20langyage/6.jpg",
    label: "Heatmap View",
  },
  // {
  //   id: 7,
  //   src: "https://dummyimages.netlify.app/portfolioimagaes/Body%20langyage/7.jpg",
  //   label: "Heatmap View",
  // },
];

// The page's charts, drawn by the shared template (components/portfolio/CaseStudy.jsx)
const charts = [
  { title: "Real-time Sentiment", note: "Confidence vs Engagement over session duration", kind: "area", data: sessionData, x: "time", series: [{ key: "confidence", tone: "accent" }, { key: "engagement", tone: "soft" }] },
  { title: "Communication Breakdown", note: "Multimodal Analysis Results", kind: "radar", data: skillMetrics, x: "subject", series: [{ key: "A", name: "User" }] },
];

const BodyLanguageProject = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the Carousel
  const [activeImage, setActiveImage] = useState(0);

  // --- FETCH DATA ---
  useEffect(() => {
    const portfolioRef = ref(database, "Protfolio/body-language-ai");

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

  // --- LOADING STATE ---
  if (loading) {
    return (
      <>
        <Navbar />
        <CaseStudyLoading label="Analyzing Models..." />
        <Footer />
      </>
    );
  }

  // --- ERROR STATE ---
  if (error || !data) {
    return (
      <>
        <Navbar />
        <CaseStudyError message={error || "Data unavailable"} />
        <Footer />
      </>
    );
  }

  // Determine images to use (Firebase data or Mock)
  const galleryImages = data.gallery || mockGallery;

  return (
    <>
      <Seo
        title={data.title || "AI Body Language Analysis"}
        description={
          data.overview
            ? data.overview.slice(0, 160)
            : "AI-powered communication analysis system."
        }
        url="/portfolio/body-language-ai"
      />
      <Navbar />
      <CaseStudy
        projectKey="body-language-ai"
        data={data}
        crumb="Analysis AI"
        tagFallback="Computer Vision"
        heads={{
          overview: "System Architecture",
          scope: "Detection Capabilities",
          metrics: "Performance Metrics",
          tech: "Core Technologies",
          deliverables: "Key Deliverables",
        }}
        charts={charts}
        galleryHead="Visual Data Log"
        gallery={
          <CaseStudyGallery
            images={galleryImages}
            active={activeImage}
            onSelect={(index) => setActiveImage(index)}
            onHover={(index) => setActiveImage(index)}
            label="Visual Data Log"
          />
        }
      />
      <Footer />
    </>
  );
};

export default BodyLanguageProject;
