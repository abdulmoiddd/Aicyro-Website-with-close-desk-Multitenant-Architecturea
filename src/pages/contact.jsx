import Footer from "../components/Essntials/footer";
import Seo from "../components/Essntials/Seo";
import Contactform from "../components/contactus/contactform"
import Navbar from "@/components/Essntials/Navbar";
import ContactCTA from "@/components/contactus/contactusCTA";
import Test from "@/components/contactus/test";
import LeadMagnet from "@/components/Home/MVPBlueprint";

// Hallmark redesign: contact is the job. The banner and the form lead (the ways
// to reach Aicyro beside the fields), then booking a call, then the blueprint.
const ContactPage = () => {
  return (
    <>
      <Seo
        title="Contact Aicyro Solutions | Book a Strategy Call"
        description="Talk with Aicyro Solutions about AI, cybersecurity, SaaS, and scalable software development. Book a strategy call today."
        url="/contact"
        keywords="Contact Aicyro, get in touch, software project inquiry, AI consulting, SaaS consulting, cybersecurity consulting"
      />
      <Navbar />
      <main id="main">
        <Contactform />
        <Test />
        <LeadMagnet />
        {/* <ContactCTA /> */}
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;
