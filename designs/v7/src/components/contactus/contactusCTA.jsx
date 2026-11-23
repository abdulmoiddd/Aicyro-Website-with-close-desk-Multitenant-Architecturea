import React from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

// Obsidian redesign: not rendered at present (commented out in pages/contact.jsx);
// restyled to the same booking card as contactus/test.jsx so it matches if the
// owner turns it back on.
const ContactCTA = () => {
  return (
    <section className="ab-section ct-book" aria-labelledby="contact-cta-title">
      <div className="ax-container">
        <div className="ob-card ct-book__card" data-reveal>
          <div className="ct-book__head">
            <span className="ab-icon">
              <CalendarDays size={22} aria-hidden="true" />
            </span>
            <h2 id="contact-cta-title" className="ax-h2">
              Have a complex challenge?
            </h2>
          </div>

          <div className="ct-book__body">
            <p className="ax-lead">
              We specialize in solving the problems that others can’t. Let’s discuss your architecture, bottlenecks, and growth goals.
            </p>
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
