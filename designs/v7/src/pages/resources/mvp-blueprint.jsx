import React, { useState, useEffect } from "react";
import Head from "next/head";
import { ArrowRight, FileText, Check, CircleCheck, Download } from "lucide-react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";

// Firebase
import { ref, push, serverTimestamp } from "firebase/database";
import { database } from "../../lib/firebase12";

// Next.js dynamic import for client-side only rendering of PDF components
import dynamic from "next/dynamic";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false },
);

// --- Expanded Multi-Page PDF Styles ---
const pdfStyles = StyleSheet.create({
  page: { padding: 40, backgroundColor: "#f8fafc", fontFamily: "Helvetica" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    borderBottom: "3px solid #2563eb",
    paddingBottom: 15,
  },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoImage: { width: 35, height: 35, marginRight: 10 },
  logoText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0f172a",
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 11,
    color: "#3b82f6",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  subtitle: { fontSize: 12, color: "#64748b", marginBottom: 25 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 12,
    marginTop: 15,
    borderLeft: "4px solid #3b82f6",
    paddingLeft: 8,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    border: "1px solid #cbd5e1",
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 11,
    color: "#475569",
    marginBottom: 8,
    lineHeight: 1.5,
  },
  listItem: {
    fontSize: 11,
    color: "#475569",
    marginBottom: 6,
    lineHeight: 1.5,
  },
  callout: {
    backgroundColor: "#eff6ff",
    borderLeft: "4px solid #3b82f6",
    padding: 12,
    marginBottom: 15,
  },
  calloutText: {
    fontSize: 11,
    color: "#1e40af",
    fontWeight: "bold",
    marginBottom: 4,
  },
  button: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "8px 12px",
    borderRadius: 4,
    textAlign: "center",
    fontSize: 10,
    marginTop: 10,
    textDecoration: "none",
    width: 200,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#94a3b8",
    borderTop: "1px solid #cbd5e1",
    paddingTop: 10,
  },
});

// --- Expanded Interactive PDF Blueprint Component ---
const AicyroBlueprintPDF = ({ userName }) => (
  <Document>
    {/* PAGE 1 */}
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <View style={pdfStyles.logoContainer}>
          <Text style={pdfStyles.logoText}>AICYRO</Text>
        </View>
        <Text style={pdfStyles.tagline}>MVP Launch Blueprint</Text>
      </View>

      <Text style={pdfStyles.title}>Blueprint for {userName || "Founder"}</Text>
      <Text style={pdfStyles.subtitle}>
        Your step-by-step framework to build, validate, and scale.
      </Text>

      <Text style={pdfStyles.sectionTitle}>
        Phase 1: Architecture & Foundations
      </Text>
      <View style={pdfStyles.card}>
        <Text style={pdfStyles.cardTitle}>Tech Stack Definition</Text>
        <Text style={pdfStyles.listItem}>
          Frontend: React components structured for modular interfaces.
        </Text>
        <Text style={pdfStyles.listItem}>
          Backend: Firebase database for real-time syncing and updates.
        </Text>
        <Text style={pdfStyles.listItem}>
          State Management: Optimized hooks for predictable data flow.
        </Text>
      </View>
      <View style={pdfStyles.callout}>
        <Text style={pdfStyles.calloutText}>Crucial UX Directive:</Text>
        <Text style={pdfStyles.paragraph}>
          Do not remove the side live preview element. A continuous, real-time
          preview keeps users engaged and visually anchors the data
          transformations.
        </Text>
      </View>

      <Text style={pdfStyles.sectionTitle}>
        Phase 2: Dashboard Visuals & KPI Framework
      </Text>
      <View style={pdfStyles.card}>
        <Text style={pdfStyles.cardTitle}>Essential Data Visualizations</Text>
        <Text style={pdfStyles.listItem}>
          KPI Cards: Top-level metrics placed prominently at the top.
        </Text>
        <Text style={pdfStyles.listItem}>
          Trend Graphs: Line or bar charts showing performance over time.
        </Text>
        <Text style={pdfStyles.listItem}>
          Pie Charts: Categorization breakdowns for quick snapshot insights.
        </Text>
        <Link src="https://aicyro.pro" style={pdfStyles.button}>
          Access Dashboard Specs
        </Link>
      </View>
      <Text style={pdfStyles.footer}>
        © 2026 AICYRO Solutions. Page 1 of 2.
      </Text>
    </Page>

    {/* PAGE 2 */}
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.logoText}>AICYRO</Text>
      </View>

      <Text style={pdfStyles.sectionTitle}>
        Phase 3: Form Endpoints & Lead Routing
      </Text>
      <Text style={pdfStyles.paragraph}>
        The conversion engine relies heavily on how incoming leads are stored
        and validated.
      </Text>
      <View style={pdfStyles.card}>
        <Text style={pdfStyles.cardTitle}>Implementation & Technical Plan</Text>
        <Text style={pdfStyles.listItem}>
          Wire application forms directly to dedicated API routes.
        </Text>
        <Text style={pdfStyles.listItem}>
          Optimize database lead storage to ensure zero drop-off.
        </Text>
        <Text style={pdfStyles.listItem}>
          Implement automated routing rules for incoming requests on
          aicyro.pro.
        </Text>
      </View>

      <Text style={pdfStyles.sectionTitle}>
        Phase 4: Compliance & Legal Infrastructure
      </Text>
      <View style={pdfStyles.card}>
        <Text style={pdfStyles.cardTitle}>
          Policies Validation (Effective June 8, 2026)
        </Text>
        <Text style={pdfStyles.listItem}>
          Terms of Service: Clearly defining user agreements and platform
          liabilities.
        </Text>
        <Text style={pdfStyles.listItem}>
          Cookie Policy: Active tracking consent mechanisms and local storage
          guidelines.
        </Text>
        <Link src="https://aicyro.pro" style={pdfStyles.button}>
          Review Live Policies
        </Link>
      </View>

      <Text style={pdfStyles.footer}>
        © 2026 AICYRO Solutions. Page 2 of 2.
      </Text>
    </Page>
  </Document>
);

// --- Main Page Component ---
const MVPBlueprint = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Founder",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const leadsRef = ref(database, "leadMagnets/mvpBlueprint");
      await push(leadsRef, {
        ...formData,
        timestamp: serverTimestamp(),
        source: "mvp-blueprint-page",
        status: "new",
      });

      fetch("/api/send-blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setSubmitted(true);
      setLoading(false);
    } catch (error) {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const checklistItems = [
    "KPI Dashboard Mapping",
    "Firebase Schema Validation",
    "Legal Infrastructure Setup",
    "Lead Routing Checklists",
  ];

  return (
    <>
      <Head>
        <title>Download the MVP Launch Blueprint | Aicyro Solutions</title>
      </Head>

      <Navbar />

      {/* Obsidian redesign: the offer and its form side by side over the ambient glow,
          the action in the first screen. (The old commented-out live-preview mock was
          a drawn interface of grey bars; it is not carried over.) */}
      <main id="main">
        <section className="ob-ambient rs-offer" aria-labelledby="mvp-title">
          <div className="ax-container rs-offer__grid">
            <div className="rs-offer__copy">
              <p className="ob-eyebrow" data-reveal>
                <FileText size={14} aria-hidden="true" />
                <span>Free Resource for Founders</span>
              </p>

              <h1 id="mvp-title" className="ob-banner__title" data-reveal style={{ "--i": 1 }}>
                Stop Guessing. <br />
                Start Shipping.
              </h1>

              <p className="ob-banner__lead" data-reveal style={{ "--i": 2 }}>
                Get the ultimate <strong>MVP Launch Blueprint</strong> used to
                deploy reliable components in record time.
              </p>

              <ul className="rs-list" aria-label="What the blueprint covers" data-reveal style={{ "--i": 3 }}>
                {checklistItems.map((item, idx) => (
                  <li key={idx}>
                    <span className="rs-list__num" aria-hidden="true">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                    <Check size={18} aria-hidden="true" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="rs-offer__panel ob-card rs-panel" data-reveal style={{ "--i": 2 }}>
              {!submitted ? (
                <form onSubmit={handleSubmit} className="rs-form">
                  <div className="rs-form__head">
                    <h2 className="rs-form__title">Get Instant Access</h2>
                    <p className="ax-meta">
                      Enter details to get your 2-page PDF blueprint.
                    </p>
                  </div>
                  <div className="ax-field">
                    <label htmlFor="mvp-name" className="ax-label">Name</label>
                    <input
                      id="mvp-name"
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      className="ax-input"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="ax-field">
                    <label htmlFor="mvp-email" className="ax-label">Email</label>
                    <input
                      id="mvp-email"
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      className="ax-input"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                    className="ax-btn ax-btn--block"
                  >
                    {loading ? "Processing…" : "Generate Blueprint"}
                    {!loading && <ArrowRight size={18} aria-hidden="true" />}
                  </button>
                </form>
              ) : (
                <div className="rs-done" role="status">
                  <span className="rs-badge" aria-hidden="true">
                    <CircleCheck size={30} strokeWidth={1.5} />
                  </span>
                  <h2 className="rs-form__title">Success!</h2>
                  {isClient && (
                    <PDFDownloadLink
                      document={<AicyroBlueprintPDF userName={formData.name} />}
                      fileName="Aicyro_MVP_Blueprint.pdf"
                      className="ax-btn ax-btn--block"
                    >
                      {({ loading }) =>
                        loading ? (
                          "Generating Multi-page PDF…"
                        ) : (
                          <>
                            <Download size={18} aria-hidden="true" />
                            Download Blueprint
                          </>
                        )
                      }
                    </PDFDownloadLink>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default MVPBlueprint;
