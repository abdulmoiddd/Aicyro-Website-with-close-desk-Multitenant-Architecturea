import React from "react";
import Link from "next/link";

// Hallmark redesign: not rendered at present (commented out in pages/contact.jsx);
// restyled to the kit so it matches if the owner turns it back on.
const ContactCTA = () => {
  return (
    <section className="ax-band" aria-labelledby="contact-cta-title">
      <div className="ax-container ax-split about-close">
        <h2 id="contact-cta-title" className="ax-h2">
          Have a complex challenge?
        </h2>

        <div className="grid gap-8 justify-items-start">
          <p className="ax-lead">
            We specialize in solving the problems that others can’t. Let’s discuss your architecture, bottlenecks, and growth goals.
          </p>
          <Link href="https://calendly.com/moidsekhry/30min" className="ax-btn">
            Let’s Build Your Solution
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
