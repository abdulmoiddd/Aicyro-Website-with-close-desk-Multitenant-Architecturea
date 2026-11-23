import React, { useState, useEffect } from "react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";
import Seo from "../../components/Essntials/Seo";
import CaseStudy, { CaseStudyLoading, CaseStudyError } from "../../components/portfolio/CaseStudy";

// --- FIREBASE IMPORTS ---
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";

// --- MOCK DATA FOR CHARTS (NLP/Research Context) ---

// Chart 1: Retrieval Precision (Keyword vs SciBERT)
const accuracyData = [
  { metric: "Precision@10", keyword: 45, semantic: 82 },
  { metric: "Recall@10", keyword: 30, semantic: 78 },
  { metric: "F1 Score", keyword: 36, semantic: 80 },
];

// Chart 2: Time to Insight (Manual Review vs AI)
const timeData = [
  { task: "Paper Discovery", manual: 120, ai: 5 }, // minutes
  { task: "Reading/Filtering", manual: 300, ai: 15 },
  { task: "Insight Extraction", manual: 180, ai: 10 },
  { task: "Citation Check", manual: 60, ai: 2 },
];

// The page's charts, drawn by the shared template (components/portfolio/CaseStudy.jsx)
const charts = [
  { title: "Semantic Search vs Keyword", note: "SciBERT Embeddings Performance", kind: "bar", data: accuracyData, x: "metric", barGap: 4, legend: true, series: [{ key: "keyword", name: "Keyword Search", tone: "quiet" }, { key: "semantic", name: "SciBERT Search", tone: "accent" }] },
  { title: "Literature Review Speed", note: "Time (Minutes) per Research Question", kind: "area", data: timeData, x: "task", xAngle: -15, legend: true, series: [{ key: "manual", name: "Manual Time", tone: "quiet" }, { key: "ai", name: "AutoScholar", tone: "accent" }] },
];

const AutoScholarProject = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    // Pointing to the specific node in your schema
    const portfolioRef = ref(database, "Protfolio/auto-scholar");

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
        <CaseStudyLoading label="Indexing Corpus..." />
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

  return (
    <>
      <Seo
        title={data.title || "AutoScholar AI"}
        description={
          data.overview
            ? data.overview.slice(0, 160)
            : "Autonomous research assistant using SciBERT and LangChain."
        }
        url="/portfolio/auto-scholar"
      />
      <Navbar />
      <CaseStudy
        projectKey="auto-scholar"
        data={data}
        crumb={"AutoScholar"}
        tagFallback="NLP Research"
        heads={{
          overview: "Research Architecture",
          scope: "Core Features",
          metrics: "Retrieval Performance",
          tech: "Tech Stack",
          deliverables: "Key Deliverables",
        }}
        charts={charts}
      />
      <Footer />
    </>
  );
};

export default AutoScholarProject;
