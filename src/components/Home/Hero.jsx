"use client";

// Hallmark redesign: the home hero. The words come from the CMS (heroSection): the
// headline across the width in two lines, then the sentence and both actions on one row.
// Colours come only from the globals.css theme variables (see www.css, hero block).
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";
import { FileText } from "lucide-react";

const HeroPage = () => {
  const router = useRouter();

  const defaultData = {
    welcomeText: "TRUSTED BY STARTUPS & ENTERPRISES",
    headingLine1: "Custom AI-Driven Software Solutions",
    headingLine2: "That Help Businesses Scale Faster",
    subheading:
      "Aicyro builds secure, scalable web, mobile, and AI-powered applications for startups, SMBs, and enterprises worldwide.",
    primaryCta: "Get a Free Strategy Call",
    secondaryCta: "Get MVP Blueprint",
  };

  const [heroData, setHeroData] = useState(defaultData);

  useEffect(() => {
    const heroRef = ref(database, "heroSection");
    const off = onValue(heroRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setHeroData({ ...defaultData, ...data });
      }
    });
    return () => off && off();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="ax-hero" aria-labelledby="hero-title">
      <div className="ax-container ax-hero__grid">
        <h1 id="hero-title" className="ax-hero__title">
          <span>{heroData.headingLine1}</span>
          <span>{heroData.headingLine2}</span>
        </h1>

        <div className="ax-hero__copy">
          <p className="ax-lead">{heroData.subheading}</p>

          <div className="ax-hero__actions">
            <button type="button" onClick={() => router.push("/contact")} className="ax-btn">
              {heroData.primaryCta}
            </button>
            <button
              type="button"
              onClick={() => router.push("/resources/mvp-blueprint")}
              className="ax-btn ax-btn--quiet"
            >
              <FileText size={18} aria-hidden="true" />
              {heroData.secondaryCta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPage;
