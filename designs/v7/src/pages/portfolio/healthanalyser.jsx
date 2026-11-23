import React, { useState, useEffect } from "react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";
import Seo from "../../components/Essntials/Seo";
import CaseStudy, { CaseStudyLoading, CaseStudyError } from "../../components/portfolio/CaseStudy";

// --- FIREBASE IMPORTS ---
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";

// --- MOCK DATA FOR CHARTS (Health/Wellness Context) ---

// Chart 1: Biometric Trends (Stress vs Sleep Quality)
// Shows inverse correlation: Better sleep = Lower stress
const wellnessData = [
  { day: "Mon", stress: 85, sleep: 45 },
  { day: "Tue", stress: 78, sleep: 55 },
  { day: "Wed", stress: 65, sleep: 68 },
  { day: "Thu", stress: 72, sleep: 60 },
  { day: "Fri", stress: 55, sleep: 75 },
  { day: "Sat", stress: 40, sleep: 88 },
  { day: "Sun", stress: 35, sleep: 92 },
];

// Chart 2: Multimodal Input Contribution
// Shows how much weight each AI modality carries in the final diagnosis
const modalityData = [
  { source: "Voice Tone", value: 35 },
  { source: "Facial Expr.", value: 40 },
  { source: "HRV/Vitals", value: 25 },
];

// The page's charts, drawn by the shared template (components/portfolio/CaseStudy.jsx)
const charts = [
  { title: "Wellness Correlation", note: "Stress Levels (Red) vs Sleep Quality (Purple)", kind: "composed", data: wellnessData, x: "day", legend: true, series: [{ key: "sleep", name: "Sleep Quality", mark: "area", tone: "accent" }, { key: "stress", name: "Burnout Risk", mark: "line", tone: "danger" }] },
  { title: "Diagnostic Confidence", note: "Weight of AI Modalities in Final Score", kind: "bar", layout: "vertical", data: modalityData, x: "source", yWidth: 96, highlight: "ramp", rampBase: 0.6, rampStep: 0.2, series: [{ key: "value", name: "Contribution %", barSize: 20 }] },
];

const HealthAnalyzerProject = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    // Pointing to the specific node in your schema
    const portfolioRef = ref(database, "Protfolio/health-analyzer");

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
        <CaseStudyLoading label="Analyzing Vitals..." />
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
        title={data.title || "AI Health Analyzer"}
        description={
          data.overview
            ? data.overview.slice(0, 160)
            : "Multimodal AI for stress and sleep analysis."
        }
        url="/portfolio/health-analyzer"
      />
      <Navbar />
      <CaseStudy
        projectKey="health-analyzer"
        data={data}
        crumb={"Health AI"}
        tagFallback="Digital Health"
        heads={{
          overview: "Project Overview",
          scope: "Diagnostic Features",
          metrics: "Patient Insights",
          tech: "Tech Stack",
          deliverables: "Key Deliverables",
        }}
        charts={charts}
      />
      <Footer />
    </>
  );
};

export default HealthAnalyzerProject;
