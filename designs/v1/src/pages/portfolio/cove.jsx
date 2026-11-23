import React, { useState, useEffect } from "react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";
import Seo from "../../components/Essntials/Seo";
import CaseStudy, { CaseStudyLoading, CaseStudyError } from "../../components/portfolio/CaseStudy";

// --- FIREBASE IMPORTS ---
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";

// --- MOCK DATA FOR CHARTS (Real Estate/Space Context) ---
const occupancyData = [
  { name: "Jan", occupancy: 65, inquiries: 120 },
  { name: "Feb", occupancy: 72, inquiries: 145 },
  { name: "Mar", occupancy: 78, inquiries: 180 },
  { name: "Apr", occupancy: 85, inquiries: 210 },
  { name: "May", occupancy: 92, inquiries: 250 },
  { name: "Jun", occupancy: 96, inquiries: 310 },
  { name: "Jul", occupancy: 98, inquiries: 340 },
];

const satisfactionStats = [
  { name: "Market Avg", value: 3.8 },
  { name: "Cove Spaces", value: 4.9 },
];

// The page's charts, drawn by the shared template (components/portfolio/CaseStudy.jsx)
const charts = [
  { title: "Occupancy Trend", note: "Unit utilization %", kind: "area", data: occupancyData, x: "name", series: [{ key: "occupancy", tone: "accent" }] },
  { title: "Tenant Satisfaction", note: "Rating out of 5.0", kind: "bar", layout: "vertical", data: satisfactionStats, x: "name", yWidth: 90, highlight: 1, series: [{ key: "value", barSize: 24 }], figure: { value: "4.9", label: "Star Rating" } },
];

const CoveProject = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    // Pointing to "Protfolio/Cove"
    const portfolioRef = ref(database, "Protfolio/Cove");

    const unsubscribe = onValue(
      portfolioRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
          setLoading(false);
        } else {
          console.warn("No data found at 'Protfolio/Cove'");
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
        <CaseStudyLoading label="Opening Doors..." />
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
        title={data.title || "Cove Living"}
        description={
          data.overview
            ? data.overview.slice(0, 160)
            : "Modern living solutions."
        }
        url="/portfolio/cove"
      />
      <Navbar />
      <CaseStudy
        projectKey="Cove"
        data={data}
        crumb={data.title}
        tagFallback="SMART LIVING"
        heads={{
          overview: "Space Overview",
          scope: "Features & Scope",
          metrics: "Property Metrics",
          tech: "Smart Infrastructure",
          deliverables: "Completed Units",
        }}
        charts={charts}
      />
      <Footer />
    </>
  );
};

export default CoveProject;
