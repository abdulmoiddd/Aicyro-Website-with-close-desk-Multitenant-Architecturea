import React, { useState, useEffect } from "react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";
import Seo from "../../components/Essntials/Seo";
import CaseStudy, { CaseStudyLoading, CaseStudyError } from "../../components/portfolio/CaseStudy";

// --- FIREBASE IMPORTS ---
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";

// --- MOCK DATA FOR CHARTS (Privacy/Security Context) ---
const threatData = [
  { name: "00:00", threats: 12, secured: 12 },
  { name: "04:00", threats: 18, secured: 18 },
  { name: "08:00", threats: 45, secured: 44 },
  { name: "12:00", threats: 80, secured: 80 },
  { name: "16:00", threats: 55, secured: 55 },
  { name: "20:00", threats: 30, secured: 30 },
  { name: "23:59", threats: 20, secured: 20 },
];

const encryptionStats = [
  { name: "Standard", value: 40 }, // Security Score
  { name: "Shady Protocol", value: 99 }, // Security Score
];

// The page's charts, drawn by the shared template (components/portfolio/CaseStudy.jsx)
const charts = [
  { title: "Threat Mitigation", note: "Intrusion attempts blocked", kind: "area", data: threatData, x: "name", series: [{ key: "secured", tone: "accent" }] },
  { title: "Protocol Integrity", note: "Encryption strength rating", kind: "bar", layout: "vertical", data: encryptionStats, x: "name", yWidth: 110, highlight: 1, series: [{ key: "value", barSize: 24 }], figure: { value: "AES-256", label: "Standard Applied" } },
];

const Shady = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    // Pointing to "Protfolio/Shady"
    const portfolioRef = ref(database, "Protfolio/Shady");

    const unsubscribe = onValue(
      portfolioRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
          setLoading(false);
        } else {
          console.warn("No data found at 'Protfolio/Shady'");
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
        <CaseStudyLoading label="Encrypting Connection..." />
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
        title={data.title || "Shady Project"}
        description={
          data.overview ? data.overview.slice(0, 160) : "Privacy solutions."
        }
        url="/portfolio/shady"
      />
      <Navbar />
      <CaseStudy
        projectKey="Shady"
        data={data}
        crumb={data.title}
        tagFallback="SECURITY PROTOCOLS"
        heads={{
          overview: "Mission Brief",
          scope: "System Scope",
          metrics: "Live Telemetry",
          tech: "Core Technologies",
          deliverables: "Executed Deliverables",
        }}
        charts={charts}
      />
      <Footer />
    </>
  );
};

export default Shady;
