import React, { useState, useEffect } from "react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";
import Seo from "../../components/Essntials/Seo";
import CaseStudy, { CaseStudyLoading, CaseStudyError } from "../../components/portfolio/CaseStudy";

// --- FIREBASE IMPORTS ---
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";

// --- MOCK DATA FOR CHARTS (Visual Flair) ---
// In a real scenario, you could fetch this from Firebase too
const performanceData = [
  { name: "Jan", speed: 4000, efficiency: 2400 },
  { name: "Feb", speed: 3000, efficiency: 1398 },
  { name: "Mar", speed: 2000, efficiency: 9800 },
  { name: "Apr", speed: 2780, efficiency: 3908 },
  { name: "May", speed: 1890, efficiency: 4800 },
  { name: "Jun", speed: 2390, efficiency: 3800 },
  { name: "Jul", speed: 3490, efficiency: 4300 },
];

const throughputData = [
  { name: "Legacy", value: 30 },
  { name: "New Core", value: 85 },
];

// The page's charts, drawn by the shared template (components/portfolio/CaseStudy.jsx)
const charts = [
  { title: "System Efficiency", note: "Post-implementation metrics", kind: "area", data: performanceData, x: "name", series: [{ key: "speed", tone: "accent" }] },
  { title: "Throughput Increase", note: "Legacy vs. New Architecture", kind: "bar", layout: "vertical", data: throughputData, x: "name", yWidth: 80, highlight: 1, series: [{ key: "value", barSize: 24 }], figure: { value: "+183%", label: "Improvement" } },
];

const Blockchain = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    const portfolioRef = ref(database, "Protfolio/kaira");

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
        <CaseStudyLoading label="Initializing Core..." />
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
        title={data.title || "Blockchain Solutions"}
        description={
          data.overview ? data.overview.slice(0, 160) : "Blockchain services."
        }
        url="/portfolio/blockchain"
      />
      <Navbar />
      <CaseStudy
        projectKey="kaira"
        data={data}
        crumb={data.title}
        tagFallback="Case Study"
        heads={{
          overview: "The Challenge & Solution",
          scope: "Project Scope",
          metrics: "Impact Analysis",
          tech: "Technologies Used",
          deliverables: "Key Deliverables",
        }}
        charts={charts}
      />
      <Footer />
    </>
  );
};

export default Blockchain;
