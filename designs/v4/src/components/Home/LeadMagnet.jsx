"use client";

// Walk-in · room 09, the way out (scroll-expansion door).
// The screen holds still on a dark wall with one arched door in it. As you scroll the two
// leaves swing open and the doorway grows until it fills the screen, and you are standing
// in the last lit room: the free audit offer and its one action (contact).
// Choreographed in walkin.css from one scroll value (--p). Reduced motion: the room, open.
import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import useScrollVar from "./walkin/useScrollVar";

const LeadMagnet = () => {
  const sceneRef = useRef(null);
  useScrollVar(sceneRef, ["start start", "end end"]);

  return (
    <section ref={sceneRef} id="room-exit" className="wk-exit" aria-labelledby="audit-title">
      <div className="wk-exit__stage">
        <p className="wk-exit__wall" aria-hidden="true">One more door</p>

        <div className="wk-exit__room">
          <div className="wk-exit__floor" aria-hidden="true" />
          <div className="ax-container wk-exit__content">
            <p className="ax-eyebrow"><b>09</b> The way out</p>
            <h2 id="audit-title" className="wk-exit__title">
              Get a Free AI &amp; Cybersecurity Audit
            </h2>
            <p className="ax-lead wk-exit__lead">
              We review your current systems and provide actionable insights to
              improve security, performance, and automation.
            </p>
            <Link href="/contact" className="ax-btn wk-exit__btn">
              Claim Free Audit <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>

          <span className="wk-exit__leaf wk-exit__leaf--l" aria-hidden="true" />
          <span className="wk-exit__leaf wk-exit__leaf--r" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
