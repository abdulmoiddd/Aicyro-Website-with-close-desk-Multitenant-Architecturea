import React, { useState, useEffect } from "react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";
import Seo from "../../components/Essntials/Seo";
import CaseStudy, { CaseStudyLoading, CaseStudyError } from "../../components/portfolio/CaseStudy";

// --- FIREBASE IMPORTS ---
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";

// --- MOCK DATA FOR CHARTS (Robotics/RL Context) ---

// Chart 1: RL Training Curve (Mean Reward over Episodes)
const trainingData = [
  { episode: 0, reward: -150 },
  { episode: 500, reward: -80 },
  { episode: 1000, reward: -20 },
  { episode: 1500, reward: 45 },
  { episode: 2000, reward: 120 },
  { episode: 2500, reward: 180 },
  { episode: 3000, reward: 210 },
  { episode: 3500, reward: 225 },
];

// Chart 2: Success Rate Comparison (Rigid Script vs AI Policy)
const successRateData = [
  { scenario: "Static Object", script: 95, ai: 98 },
  { scenario: "Moving Target", script: 40, ai: 85 },
  { scenario: "Obstructed", script: 15, ai: 72 },
  { scenario: "New Object", script: 0, ai: 90 },
];

const charts = [
  {
    title: "Policy Convergence",
    note: "Mean Reward per Episode (Training Phase)",
    kind: "area",
    data: trainingData,
    x: "episode",
    series: [{ key: "reward", tone: "accent" }],
  },
  {
    title: "Sim-to-Real Transfer",
    note: "Success Rate: Scripted vs RL Policy",
    kind: "bar",
    data: successRateData,
    x: "scenario",
    barGap: 2,
    legend: true,
    series: [
      { key: "script", name: "Hard-coded", tone: "quiet", barSize: 20 },
      { key: "ai", name: "RL Policy", tone: "accent", barSize: 20 },
    ],
  },
];

const RoboticsControlProject = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    // Pointing to the specific node in your schema
    const portfolioRef = ref(database, "Protfolio/robotics-control");

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
        <CaseStudyLoading label="Initializing Physics Engine..." />
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
        title={data.title || "AI Robotics Control"}
        description={
          data.overview
            ? data.overview.slice(0, 160)
            : "Reinforcement learning for robotic manipulation."
        }
        url="/portfolio/robotics-control"
      />
      <Navbar />
      <CaseStudy
        projectKey="robotics-control"
        data={data}
        crumb="Robotics"
        tagFallback="Reinforcement Learning"
        heads={{
          overview: "Project Overview",
          scope: "Capabilities & Modules",
          metrics: "Performance Metrics",
          tech: "Tech Stack",
          deliverables: "Key Deliverables",
        }}
        charts={charts}
      />
      <Footer />
    </>
  );
};

export default RoboticsControlProject;
