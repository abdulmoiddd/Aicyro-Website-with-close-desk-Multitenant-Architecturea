import React, { useState, useEffect } from "react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";
import Seo from "../../components/Essntials/Seo";
import CaseStudy, { CaseStudyLoading, CaseStudyError } from "../../components/portfolio/CaseStudy";

// --- FIREBASE IMPORTS ---
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";

// --- MOCK DATA FOR CHARTS (Business/Retail Context) ---
const revenueData = [
  { name: "Q1", revenue: 45000, traffic: 12000 },
  { name: "Q2", revenue: 52000, traffic: 15000 },
  { name: "Q3", revenue: 48000, traffic: 18000 },
  { name: "Q4", revenue: 75000, traffic: 32000 },
];

const conversionStats = [
  { name: "Industry Avg", value: 2.5 },
  { name: "JBB Platform", value: 5.8 },
];

// The page's charts, drawn by the shared template (components/portfolio/CaseStudy.jsx)
const charts = [
  { title: "Revenue Trajectory", note: "Quarterly performance", kind: "area", data: revenueData, x: "name", series: [{ key: "revenue", tone: "accent" }] },
  { title: "Conversion Rate", note: "Platform vs Industry Standard", kind: "bar", layout: "vertical", data: conversionStats, x: "name", yWidth: 100, highlight: 1, series: [{ key: "value", barSize: 24 }], figure: { value: "2.3x", label: "Performance Uplift" } },
];

const JbbProject = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    // Pointing to "Protfolio/JBB"
    const portfolioRef = ref(database, "Protfolio/JBB");

    const unsubscribe = onValue(
      portfolioRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
          setLoading(false);
        } else {
          console.warn("No data found at 'Protfolio/JBB'");
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
        <CaseStudyLoading label="Polishing Assets..." />
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
        title={data.title || "JBB Project"}
        description={
          data.overview ? data.overview.slice(0, 160) : "Business solutions."
        }
        url="/portfolio/jbb"
      />
      <Navbar />
      <CaseStudy
        projectKey="JBB"
        data={data}
        crumb={data.title}
        tagFallback="PREMIUM SOLUTIONS"
        heads={{
          overview: "Executive Summary",
          scope: "Strategic Scope",
          metrics: "Growth Metrics",
          tech: "Tech Ecosystem",
          deliverables: "Key Milestones",
        }}
        charts={charts}
      />
      <Footer />
    </>
  );
};

export default JbbProject;
