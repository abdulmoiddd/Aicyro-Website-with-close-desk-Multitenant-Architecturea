import React, { useState, useEffect } from "react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";
import Seo from "../../components/Essntials/Seo";
import CaseStudy, { CaseStudyLoading, CaseStudyError } from "../../components/portfolio/CaseStudy";

// --- FIREBASE IMPORTS ---
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";

// --- MOCK DATA FOR CHARTS (Political/Civic Context) ---
const engagementData = [
  { name: "Week 1", engagement: 15000, reach: 45000 },
  { name: "Week 2", engagement: 22000, reach: 52000 },
  { name: "Week 3", engagement: 18000, reach: 49000 },
  { name: "Week 4", engagement: 35000, reach: 78000 },
  { name: "Week 5", engagement: 42000, reach: 95000 },
  { name: "Election Day", engagement: 85000, reach: 120000 },
];

const sentimentStats = [
  { name: "Neutral", value: 30 },
  { name: "Positive", value: 65 },
];

// The page's charts, drawn by the shared template (components/portfolio/CaseStudy.jsx)
const charts = [
  { title: "Civic Engagement", note: "Active participants over time", kind: "area", data: engagementData, x: "name", series: [{ key: "engagement", tone: "accent" }] },
  { title: "Public Sentiment", note: "Positive vs Neutral Feedback", kind: "bar", layout: "vertical", data: sentimentStats, x: "name", yWidth: 80, highlight: 1, series: [{ key: "value", barSize: 24 }], figure: { value: "65%", label: "Positive Approval" } },
];

const PoliticoProject = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    // Pointing to "Protfolio/Politico"
    const portfolioRef = ref(database, "Protfolio/Politico");

    const unsubscribe = onValue(
      portfolioRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
          setLoading(false);
        } else {
          console.warn("No data found at 'Protfolio/Politico'");
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
        <CaseStudyLoading label="Tabulating Data..." />
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
        title={data.title || "Politico Platform"}
        description={
          data.overview ? data.overview.slice(0, 160) : "Civic tech solutions."
        }
        url="/portfolio/politico"
      />
      <Navbar />
      <CaseStudy
        projectKey="Politico"
        data={data}
        crumb={data.title}
        tagFallback="DIGITAL DEMOCRACY"
        heads={{
          overview: "Campaign Overview",
          scope: "Key Initiatives",
          metrics: "Engagement Analytics",
          tech: "Tech Infrastructure",
          deliverables: "Rollout Strategy",
        }}
        charts={charts}
      />
      <Footer />
    </>
  );
};

export default PoliticoProject;
