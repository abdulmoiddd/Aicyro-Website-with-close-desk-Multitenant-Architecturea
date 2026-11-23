import React, { useState, useEffect } from "react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";
import Seo from "../../components/Essntials/Seo";
import CaseStudy, { CaseStudyLoading, CaseStudyError } from "../../components/portfolio/CaseStudy";

// --- FIREBASE IMPORTS ---
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";

// --- MOCK DATA FOR CHARTS (Tourism Context) ---
const trafficData = [
  { name: "Jan", visitors: 1200, bookings: 400 },
  { name: "Feb", visitors: 1900, bookings: 700 },
  { name: "Mar", visitors: 3200, bookings: 1200 },
  { name: "Apr", visitors: 2800, bookings: 1100 },
  { name: "May", visitors: 4500, bookings: 2100 },
  { name: "Jun", visitors: 5800, bookings: 3200 },
  { name: "Jul", visitors: 7200, bookings: 4500 },
];

const adoptionData = [
  { name: "Web Only", value: 35 },
  { name: "Mobile App", value: 92 },
];

// The page's charts, drawn by the shared template (components/portfolio/CaseStudy.jsx)
const charts = [
  { title: "Visitor Engagement", note: "Monthly active sessions", kind: "area", data: trafficData, x: "name", series: [{ key: "visitors", tone: "accent" }] },
  { title: "Adoption Rate", note: "Mobile App vs. Web", kind: "bar", layout: "vertical", data: adoptionData, x: "name", yWidth: 90, highlight: 1, series: [{ key: "value", barSize: 24 }], figure: { value: "92%", label: "Mobile Conversion" } },
];

const NycTourism = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    // Pointing to "Protfolio/nyctourism"
    const portfolioRef = ref(database, "Protfolio/nyctourism");

    const unsubscribe = onValue(
      portfolioRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
          setLoading(false);
        } else {
          console.warn("No data found at 'Protfolio/nyctourism'");
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
        <CaseStudyLoading label="Loading Experience..." />
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
        title={data.title || "NYC Tourism Platform"}
        description={
          data.overview ? data.overview.slice(0, 160) : "Tourism services."
        }
        url="/portfolio/nyctourism"
      />
      <Navbar />
      <CaseStudy
        projectKey="nyctourism"
        data={data}
        crumb={data.title}
        tagFallback="DIGITAL EXPERIENCE"
        heads={{
          overview: "The Vision",
          scope: "Project Scope",
          metrics: "Platform Analytics",
          tech: "Tech Stack",
          deliverables: "Key Deliverables",
        }}
        charts={charts}
      />
      <Footer />
    </>
  );
};

export default NycTourism;
