import Footer from "../components/Essntials/footer";
import Seo from "../components/Essntials/Seo";
import Contactform from "../components/contactus/contactform"
import Navbar from "@/components/Essntials/Navbar";
import ContactCTA from "@/components/contactus/contactusCTA";
import Test from "@/components/contactus/test";
import LeadMagnet from "@/components/Home/MVPBlueprint";

// Aurora redesign: contact is the job. The aurora banner and the form lead (the
// ways to reach Aicyro as icon cards beside the panel), then the booking card on
// a band, then the blueprint teaser.
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
