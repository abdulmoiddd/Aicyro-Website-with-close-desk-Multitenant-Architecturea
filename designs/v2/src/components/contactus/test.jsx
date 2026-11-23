import React from "react";
import Link from "next/link";
import { CalendarClock, ArrowRight } from "lucide-react";

// Redesign v3 (Aurora Studio): a booking card after the form. The question with one
// phrase in the brand gradient, its line and the way to book a call; the form above
// keeps the page's one filled button, so this action stays quiet.
const ContactCTA = () => {
  return (
    <section className="ax-section" aria-labelledby="contact-call-title">
      <div className="ax-container">
        <div className="ax-card ax-spot ab-call" data-reveal>
          <span className="ax-gridbg" aria-hidden="true" />
          <div className="ab-call__head">
            <span className="ax-icon-tile ax-icon-tile--solid">
              <CalendarClock aria-hidden="true" />
            </span>
            <h2 id="contact-call-title" className="ax-h2">
              Have a <span className="ax-grad">complex challenge?</span>
            </h2>
          </div>

          <div className="ab-call__body">
            <p className="ax-lead">
              We specialize in solving the problems that others can’t. Let’s discuss your architecture, bottlenecks, and growth goals.
            </p>
            <Link href="/MeetingScheduler" className="ax-btn ax-btn--quiet">
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
