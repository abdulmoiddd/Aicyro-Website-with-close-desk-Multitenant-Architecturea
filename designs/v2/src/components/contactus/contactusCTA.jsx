import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Redesign v3 (Aurora Studio): not rendered at present (commented out in
// pages/contact.jsx); restyled as the kit's CTA band so it matches if the owner
// turns it back on. The Calendly link is unchanged.
const ContactCTA = () => {
  return (
    <section className="ax-section" aria-labelledby="contact-cta-title">
      <div className="ax-container">
        <div className="ax-cta">
          <h2 id="contact-cta-title" className="ax-cta__title">
            Have a <span className="ax-grad">complex challenge?</span>
          </h2>
          <p className="ax-lead">
            We specialize in solving the problems that others can’t. Let’s discuss your architecture, bottlenecks, and growth goals.
          </p>
          <div className="ax-cta__actions">
            <Link href="https://calendly.com/moidsekhry/30min" className="ax-btn">
              Let’s Build Your Solution
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
