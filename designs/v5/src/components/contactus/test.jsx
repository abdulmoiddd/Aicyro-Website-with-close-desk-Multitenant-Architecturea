import React from "react";
import Link from "next/link";

// Hallmark redesign: a band after the form. The question, its line and the way
// to book a call; the form above keeps the page's one filled button.
const ContactCTA = () => {
  return (
    <section className="ax-band" aria-labelledby="contact-call-title">
      <div className="ax-container ax-split about-close">
        <h2 id="contact-call-title" className="ax-h2" data-reveal>
          Have a complex challenge?
        </h2>

        <div className="grid gap-8 justify-items-start" data-reveal style={{ "--i": 1 }}>
          <p className="ax-lead">
            We specialize in solving the problems that others can’t. Let’s discuss your architecture, bottlenecks, and growth goals.
          </p>
          <Link href="/MeetingScheduler" className="ax-btn ax-btn--quiet">
            Let’s Build Your Solution
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
