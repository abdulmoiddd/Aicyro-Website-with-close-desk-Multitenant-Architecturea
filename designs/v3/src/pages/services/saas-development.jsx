import React, { useState, useEffect } from "react";
import Navbar from "../../components/Essntials/Navbar";
import Footer from "../../components/Essntials/footer";
import Seo from "../../components/Essntials/Seo";
import MVPBlueprint from "../../components/Home/MVPBlueprint";

// --- FIREBASE IMPORTS ---
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";

// Hallmark redesign: the shared service template (Banner, then the CMS sections
// as a varied run of compositions, ending on the contact action).
import { ServiceBody, ServiceStatus } from "@/components/services/ServiceTemplate";

const SaaSDevelopment = () => {
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FIREBASE DATA FETCHING ---
  useEffect(() => {
    const serviceRef = ref(database, "Servicessubpages/SaaSDevelopment");
    const unsubscribe = onValue(
      serviceRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setServiceData(snapshot.val());
          setLoading(false);
        } else {
          setError("Content not found");
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firebase read error:", err);
        setError("Failed to load content");
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  // Helper to scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) return <ServiceStatus state="loading" />;

  if (error || !serviceData) return <ServiceStatus state="error" message={error} />;

  return (
    <>
      <Seo
        title={serviceData.Title}
        description={serviceData["Meta Description"]}
        url="/services/saasdevelopment"
      />

      <Navbar />

      <main id="main">
        <ServiceBody
          title="The SaaS Scalability Playbook 2025"
          label="SaaS Engineering"
          serviceData={serviceData}
          onJump={scrollToSection}
          teaser={<MVPBlueprint />}
        />
      </main>

      <Footer />
    </>
  );
};

export default SaaSDevelopment;
