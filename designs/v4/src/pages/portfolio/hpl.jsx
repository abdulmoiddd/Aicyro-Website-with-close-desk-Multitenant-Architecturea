import React, { useState, useEffect } from "react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";
import Seo from "../../components/Essntials/Seo";
import CaseStudy, { CaseStudyLoading, CaseStudyError } from "../../components/portfolio/CaseStudy";

// --- FIREBASE IMPORTS ---
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";

// --- MOCK DATA FOR CHARTS (Corporate/Enterprise Context) ---
const growthData = [
  { name: "2019", users: 1.2, transactions: 45 },
  { name: "2020", users: 2.5, transactions: 78 },
  { name: "2021", users: 3.8, transactions: 120 },
  { name: "2022", users: 5.2, transactions: 180 },
  { name: "2023", users: 7.5, transactions: 250 },
  { name: "2024", users: 9.8, transactions: 340 },
];

const segmentStats = [
  { name: "Retail", value: 65 },
  { name: "Corporate", value: 35 },
];

// The page's charts, drawn by the shared template (components/portfolio/CaseStudy.jsx)
const charts = [
  { title: "Digital Adoption", note: "Active users (Millions)", kind: "area", data: growthData, x: "name", series: [{ key: "users", tone: "accent" }] },
  { title: "Market Split", note: "Retail vs Corporate (%)", kind: "bar", layout: "vertical", data: segmentStats, x: "name", yWidth: 80, highlight: 1, series: [{ key: "value", barSize: 24 }], figure: { value: "2.5M+", label: "Active Accounts" } },
];

const HPLProject = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    // Pointing to "Protfolio/HPL"
    const portfolioRef = ref(database, "Protfolio/HPL");

    const unsubscribe = onValue(
      portfolioRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
          setLoading(false);
        } else {
          console.warn("No data found at 'Protfolio/HPL'");
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
        <CaseStudyLoading label="Loading Assets..." />
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
        title={data.title || "HPL Enterprise"}
        description={
          data.overview ? data.overview.slice(0, 160) : "Corporate solutions."
        }
        url="/portfolio/hpl"
      />
      <Navbar />
      <CaseStudy
        projectKey="HPL"
        data={data}
        crumb={data.title}
        tagFallback="ENTERPRISE SOLUTIONS"
        heads={{
          overview: "Executive Summary",
          scope: "Project Scope",
          metrics: "Performance Metrics",
          tech: "Core Technologies",
          deliverables: "Key Deliverables",
        }}
        charts={charts}
      />
      <Footer />
    </>
  );
};

export default HPLProject;
