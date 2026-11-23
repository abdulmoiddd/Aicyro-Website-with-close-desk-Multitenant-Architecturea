import React, { useState, useEffect } from "react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";
import Seo from "../../components/Essntials/Seo";
import CaseStudy, { CaseStudyLoading, CaseStudyError } from "../../components/portfolio/CaseStudy";

// --- FIREBASE IMPORTS ---
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";

// --- MOCK DATA FOR CHARTS (EdTech/DKT Context) ---

// Chart 1: Knowledge Tracing (Predicted vs Actual Mastery)
const masteryData = [
  { step: 1, probability: 0.2, actual: 0 },
  { step: 5, probability: 0.35, actual: 0.3 },
  { step: 10, probability: 0.45, actual: 0.5 },
  { step: 15, probability: 0.6, actual: 0.7 },
  { step: 20, probability: 0.75, actual: 0.8 },
  { step: 25, probability: 0.85, actual: 0.9 },
  { step: 30, probability: 0.92, actual: 0.95 },
];

// Chart 2: Adaptive Difficulty Distribution (How the AI adjusted questions)
const difficultyData = [
  { level: "Easy", count: 15, time: 2 },
  { level: "Medium", count: 45, time: 5 },
  { level: "Hard", count: 20, time: 8 },
  { level: "Expert", count: 5, time: 12 },
];

// The page's charts, drawn by the shared template (components/portfolio/CaseStudy.jsx)
const charts = [
  { title: "Knowledge Tracing (DKT)", note: "Predicted Mastery vs Actual Performance", kind: "composed", data: masteryData, x: "step", xLabel: "Interactions", legend: true, series: [{ key: "probability", name: "Predicted Mastery", mark: "area", tone: "accent" }, { key: "actual", name: "Actual Performance", mark: "line", tone: "success" }] },
  { title: "Adaptive Difficulty", note: "Questions served by difficulty level", kind: "bar", data: difficultyData, x: "level", highlight: "ramp", rampBase: 0.6, rampStep: 0.1, series: [{ key: "count", name: "Questions Served", barSize: 30 }] },
];

const AiTutorProject = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    // Pointing to the specific node in your schema
    const portfolioRef = ref(database, "Protfolio/ai-tutor");

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
        <CaseStudyLoading label="Loading Knowledge Model..." />
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
        title={data.title || "Personalized AI Tutor"}
        description={
          data.overview
            ? data.overview.slice(0, 160)
            : "Adaptive intelligent tutoring system using Deep Knowledge Tracing."
        }
        url="/portfolio/ai-tutor"
      />
      <Navbar />
      <CaseStudy
        projectKey="ai-tutor"
        data={data}
        crumb={"AI Tutor"}
        tagFallback="EdTech AI"
        heads={{
          overview: "Project Overview",
          scope: "Educational Modules",
          metrics: "Student Mastery Metrics",
          tech: "Tech Stack",
          deliverables: "Key Deliverables",
        }}
        charts={charts}
      />
      <Footer />
    </>
  );
};

export default AiTutorProject;
