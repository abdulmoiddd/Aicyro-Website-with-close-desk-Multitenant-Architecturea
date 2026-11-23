import React from "react";
import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";

// Aurora redesign: the booking block after the form, on a tinted band. A tinted
// card with the solid calendar tile, the question and its line on one side and
// the way to book a call on the other.
const ContactCTA = () => {
  return (
    <section className="ax-band" aria-labelledby="contact-call-title">
      <div className="ax-container">
        <div className="ax-card ax-card--tint about-book" data-reveal>
          <span className="ax-icon-tile ax-icon-tile--solid about-book__tile">
            <CalendarClock aria-hidden="true" />
          </span>
          <div className="about-book__text">
            <p className="ax-eyebrow">Book a call</p>
            <h2 id="contact-call-title" className="ax-h2">
              Have a complex challenge?
            </h2>
            <p className="ax-lead">
              We specialize in solving the problems that others can’t. Let’s discuss your architecture, bottlenecks, and growth goals.
            </p>
          </div>
          <div className="about-book__action">
            <Link href="/MeetingScheduler" className="ax-btn ax-btn--lg">
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
