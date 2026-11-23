import React, { useState, useEffect } from "react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";
import Seo from "../../components/Essntials/Seo";
import CaseStudy, { CaseStudyLoading, CaseStudyError } from "../../components/portfolio/CaseStudy";

// --- FIREBASE IMPORTS ---
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";

// --- MOCK DATA FOR CHARTS (Gov/Enterprise Context) ---
const processingData = [
  { name: "Jan", manual: 45, digital: 10 },
  { name: "Feb", manual: 42, digital: 25 },
  { name: "Mar", manual: 38, digital: 45 },
  { name: "Apr", manual: 30, digital: 68 },
  { name: "May", manual: 20, digital: 95 },
  { name: "Jun", manual: 15, digital: 110 },
  { name: "Jul", manual: 8, digital: 145 },
];

const efficiencyStats = [
  { name: "Legacy System", value: 45 }, // Time taken in mins
  { name: "GO Platform", value: 5 }, // Time taken in mins
];

// The page's charts, drawn by the shared template (components/portfolio/CaseStudy.jsx)
const charts = [
  { title: "Process Digitization", note: "Manual vs Digital Requests", kind: "area", data: processingData, x: "name", series: [{ key: "digital", tone: "accent" }] },
  { title: "Processing Speed", note: "Minutes per transaction", kind: "bar", layout: "vertical", data: efficiencyStats, x: "name", yWidth: 90, highlight: 1, series: [{ key: "value", barSize: 24 }], figure: { value: "9x", label: "Faster Execution" } },
];

const GoProject = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    // Pointing to "Protfolio/GO"
    const portfolioRef = ref(database, "Protfolio/GO");

    const unsubscribe = onValue(
      portfolioRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
          setLoading(false);
        } else {
          console.warn("No data found at 'Protfolio/GO'");
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
        <CaseStudyLoading label="Securing Connection..." />
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
        title={data.title || "Government Operations"}
        description={
          data.overview
            ? data.overview.slice(0, 160)
            : "Digital transformation services."
        }
        url="/portfolio/go"
      />
      <Navbar />
      <CaseStudy
        projectKey="GO"
        data={data}
        crumb={data.title}
        tagFallback="PUBLIC SECTOR"
        heads={{
          overview: "Operational Overview",
          scope: "Key Objectives",
          metrics: "Performance Metrics",
          tech: "Infrastructure",
          deliverables: "Key Deliverables",
        }}
        charts={charts}
      />
      <Footer />
    </>
  );
};

export default GoProject;
