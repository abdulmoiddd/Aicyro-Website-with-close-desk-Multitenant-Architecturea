import Navbar from "../components/Essntials/Navbar";
import Aboutstart from "../components/Aboutus/Aboutstart";

import Footer from "../components/Essntials/footer";
import Seo from "../components/Essntials/Seo";
import Vision from "../components/Aboutus/vision"
import Mission from "../components/Aboutus/Mission"
import Whyus from "../components/Aboutus/whyus"
import AboutusCTA from "@/components/Aboutus/AboutusCTA";

// Hallmark redesign: the studio's story in five beats. Banner, who we are
// (split), the vision (statement band), why Aicyro (rows), the close (band).
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
        <Mission />
        <Vision />
        <Whyus />
        <AboutusCTA />
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;
