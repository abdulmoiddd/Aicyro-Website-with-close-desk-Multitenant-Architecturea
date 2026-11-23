import Navbar from "../components/Essntials/Navbar";
import Aboutstart from "../components/Aboutus/Aboutstart";

import Footer from "../components/Essntials/footer";
import Seo from "../components/Essntials/Seo";
import Vision from "../components/Aboutus/vision"
import Mission, { Commitment } from "../components/Aboutus/Mission"
import Whyus from "../components/Aboutus/whyus"
import AboutusCTA from "@/components/Aboutus/AboutusCTA";

// Aurora redesign: the studio's story in four beats. The aurora Banner; mission and
// vision as a pair of tinted cards with the commitment beneath; why Aicyro as a
// bento of icon cards on a band; the gradient CTA close.
const AboutPage = () => {
  return (
    <>
      <Seo
        title="About Aicyro Solutions | Trusted AI & Software Development Partner"
        description="Learn how Aicyro Solutions helps businesses solve complex challenges through AI-driven, secure, and scalable software engineering."
        url="/about"
        keywords="About Aicyro, Aicyro team, software agency, AI company, cybersecurity company, SaaS experts"
      />
      <Navbar />
      <main id="main">
        <Aboutstart />
        <section className="ax-section about-mv" aria-label="Mission and vision">
          <div className="ax-container">
            <div className="ax-bento">
              <Mission />
              <Vision />
              <Commitment />
            </div>
          </div>
        </section>
        <Whyus />
        <AboutusCTA />
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;
