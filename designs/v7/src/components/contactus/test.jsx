import React from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

// Obsidian redesign: the booking panel after the form. One wide glass card over a
// soft accent glow: the question and its icon tile on the left, the line and the
// way to book a call on the right.
const trackGlow = (e) => {
  const card = e.currentTarget;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - r.left}px`);
  card.style.setProperty("--my", `${e.clientY - r.top}px`);
};

const ContactCTA = () => {
  return (
    <section className="ab-section ct-book" aria-labelledby="contact-call-title">
      <div className="ax-container">
        <div className="ob-card ct-book__card" onPointerMove={trackGlow} data-reveal>
          <div className="ct-book__head">
            <span className="ab-icon">
              <CalendarDays size={22} aria-hidden="true" />
            </span>
            <p className="ob-eyebrow">02 / Strategy call</p>
            <h2 id="contact-call-title" className="ax-h2">
              Have a complex challenge?
            </h2>
          </div>

          <div className="ct-book__body">
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
