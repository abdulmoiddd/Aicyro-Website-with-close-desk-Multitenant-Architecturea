import React, { useState, useEffect } from "react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";
import Seo from "../../components/Essntials/Seo";
import CaseStudy, { CaseStudyLoading, CaseStudyError } from "../../components/portfolio/CaseStudy";

// --- FIREBASE IMPORTS ---
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";

// --- MOCK DATA FOR CHARTS (FinTech/Speed Context) ---
const transactionData = [
  { name: "10ms", volume: 200, speed: 98 },
  { name: "20ms", volume: 450, speed: 95 },
  { name: "30ms", volume: 800, speed: 92 },
  { name: "40ms", volume: 1200, speed: 90 },
  { name: "50ms", volume: 1800, speed: 88 },
  { name: "60ms", volume: 2400, speed: 85 },
];

const costComparison = [
  { name: "Traditional", value: 2.5 }, // Fee in $
  { name: "ZIPZAP", value: 0.15 }, // Fee in $
];

// The page's charts, drawn by the shared template (components/portfolio/CaseStudy.jsx)
const charts = [
  { title: "Processing Load", note: "Volume vs Latency (ms)", kind: "area", data: transactionData, x: "name", series: [{ key: "volume", tone: "accent" }] },
  { title: "Transaction Fees", note: "Traditional vs ZIPZAP ($)", kind: "bar", layout: "vertical", data: costComparison, x: "name", yWidth: 90, highlight: 1, series: [{ key: "value", barSize: 24 }], figure: { value: "-94%", label: "Fee Reduction" } },
];

const ZipZap = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    // Pointing to "Protfolio/ZIPZAP"
    const portfolioRef = ref(database, "Protfolio/ZIPZAP");

    const unsubscribe = onValue(
      portfolioRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
          setLoading(false);
        } else {
          console.warn("No data found at 'Protfolio/ZIPZAP'");
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
        <CaseStudyLoading label="Powering Up..." />
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
        title={data.title || "ZIPZAP Payments"}
        description={
          data.overview ? data.overview.slice(0, 160) : "Fintech solutions."
        }
        url="/portfolio/zipzap"
      />
      <Navbar />
      <CaseStudy
        projectKey="ZIPZAP"
        data={data}
        crumb={data.title}
        tagFallback="NEXT-GEN FINTECH"
        heads={{
          overview: "The Solution",
          scope: "Project Scope",
          metrics: "Performance Data",
          tech: "Tech Stack",
          deliverables: "Core Deliverables",
        }}
        charts={charts}
      />
      <Footer />
    </>
  );
};

export default ZipZap;
