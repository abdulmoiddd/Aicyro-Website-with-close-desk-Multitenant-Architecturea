// src/pages/index.jsx
// Obsidian redesign (2026-11-23): the 360° walk-in scroll hero, then the editorial
// statement, capabilities bento, selected work, process, proof, planning tools and the
// closing audit offer. SEO head, schema and the Apollo tracker are unchanged.
import { useEffect, useState } from "react";
import Head from "next/head";
import Favicon from "../assets/favicon.png";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";
import Popupform from "@/components/Form/Popupform";

import WalkInHero from "@/components/hero/WalkInHero";
import Statement from "@/components/Home/obsidian/Statement";
import Capabilities from "@/components/Home/obsidian/Capabilities";
import SelectedWork from "@/components/Home/obsidian/SelectedWork";
import ProcessSection from "@/components/Home/ProcessSection";
import Proof from "@/components/Home/obsidian/Proof";
import EstimatorTeaser from "@/components/Home/EstimatorTeaser";
import ClosingCTA from "@/components/Home/obsidian/ClosingCTA";

const HomePage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // The bar waits until the visitor starts walking in (a third of the first screen)
  const [revealAfter, setRevealAfter] = useState(320);

  useEffect(() => {
    const set = () => setRevealAfter(Math.round(window.innerHeight * 0.35));
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  return (
    <div className="ob-home">
      <Head>
        <meta
          name="google-site-verification"
          content="H3IiET-R1ROp6Mc2C-542EEtOVyXboeB1knzQkRVOx0"
        />
        <link rel="icon" href={Favicon.src} />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="language" content="English" />
        <title>
          Custom Software & AI Development Company | Aicyro Solutions
        </title>
        <meta
          name="description"
          content="Aicyro builds secure custom software, AI solutions, SaaS platforms, and cloud applications for startups and enterprises. Book a free consultation today."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="keywords"
          content="custom software development company, AI software development services, SaaS development agency, web and mobile app development, cybersecurity solutions provider, Aicyro Solutions, Cloud Architecture, Software Agency"
        />
        <meta name="author" content="Aicyro Solutions" />
        <link rel="canonical" href="https://aicyro.com/" />

        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Custom Software & AI Development Company | Aicyro Solutions"
        />
        <meta
          property="og:description"
          content="Aicyro builds secure custom software, AI solutions, SaaS platforms, and cloud applications for startups and enterprises. Book a free consultation today."
        />
        <meta property="og:url" content="https://aicyro.com/" />
        <meta property="og:image" content="https://aicyro.com/og-image.png" />
        <meta property="og:site_name" content="Aicyro Solutions" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Custom Software & AI Development Company | Aicyro Solutions"
        />
        <meta
          name="twitter:description"
          content="Aicyro builds secure custom software, AI solutions, SaaS platforms, and cloud applications for startups and enterprises. Book a free consultation today."
        />
        <meta name="twitter:image" content="https://aicyro.com/og-image.png" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Aicyro Solutions",
              url: "https://aicyro.com/",
              logo: "https://aicyro.com/logo.png",
              slogan: "Revolutionizing Intelligence Security Innovation",
              description:
                "Aicyro builds secure custom software, AI solutions, SaaS platforms, and cloud applications for startups and enterprises.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "PK",
                addressRegion: "Islamabad Capital Territory",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+92-51-6122768",
                contactType: "customer service",
                areaServed: "World",
                availableLanguage: ["English"],
              },
              sameAs: [
                "https://www.linkedin.com/company/aicyro-solutions",
                "https://www.facebook.com/aicyro",
                "https://x.com/aicyro",
                "https://www.instagram.com/aicyro",
              ],
            }),
          }}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              function initApollo() {
                var n=Math.random().toString(36).substring(7), o=document.createElement("script");
                o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n;
                o.async=!0;
                o.defer=!0;
                o.onload=function(){window.trackingFunctions.onLoad({appId:"68b8d2452a128f00197e7840"})};
                document.head.appendChild(o);
              }
              initApollo();
            `,
          }}
        />
      </Head>

      <Navbar overlay revealAfter={revealAfter} />
      <main id="main">
        <WalkInHero contentId="content" />
        <Statement />
        <Capabilities />
        <SelectedWork />
        <ProcessSection />
        <Proof />
        <EstimatorTeaser />
        <ClosingCTA />
      </main>
      <Footer />

      <Popupform isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
};

export default HomePage;
