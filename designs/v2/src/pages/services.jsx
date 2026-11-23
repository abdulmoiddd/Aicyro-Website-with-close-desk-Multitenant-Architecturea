import Footer from "../components/Essntials/footer";
import Seo from "../components/Essntials/Seo";
import ServicesIntro from "@/components/services/ServicesIntro";
import Navbar from "@/components/Essntials/Navbar";
import CoreServices from "@/components/services/detailcoreservices";
import AdditionalCapabilities from "@/components/services/AdditionalCapabilities";
import ProcessSection from "@/components/services/ProcessSection";
import ServicesBento from "@/components/services/ServicesBento";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Redesign v3 (Aurora Studio): page hero, the eight services as a bento, the core
// practice cards, the capabilities switcher, the workflow timeline, then the close.

const ServicesPage = () => {
  return (
    <>
      <Seo
        title="AI, SaaS & Secure Software Development Services | Aicyro"
        description="Custom AI, SaaS, web, and secure software development services designed to scale, protect, and grow modern businesses globally."
        url="/services"
        keywords="Aicyro services, SaaS development, AI integration, cybersecurity services, cloud architecture, web development, app development"
      />
      <Navbar />
      <main id="main">
        <ServicesIntro />
        <ServicesBento />
        <CoreServices />
        <AdditionalCapabilities />
        <ProcessSection />

        <section className="ax-section svc-index-cta" aria-labelledby="services-cta-title">
          <div className="ax-container">
            <div className="ax-cta" data-reveal>
              <p className="ax-eyebrow">
                <span>Next step</span>
              </p>
              <h2 id="services-cta-title" className="ax-cta__title">
                Let’s talk about <span className="ax-grad">your project</span>
              </h2>
              <p className="ax-lead">Book a free consultation with the Aicyro team.</p>
              <div className="ax-cta__actions">
                <Link href="/contact" className="ax-btn">
                  Book Free Consultation
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link href="/portfolio" className="ax-btn ax-btn--quiet">
                  See our work
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ServicesPage;
