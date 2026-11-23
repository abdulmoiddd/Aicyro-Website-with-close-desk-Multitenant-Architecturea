"use client";

// The Tour · stop 09, the exit.
// The last thing at the end of the hall is a lit EXIT sign. It grows toward you as you walk
// up to it, its running arrow slides out of the plate, and under it the free audit offer
// and its one action (contact) step forward. Choreographed in tour.css from one scroll
// value (--p). Reduced motion: the sign and the offer, in place.
import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, DoorOpen } from "lucide-react";
import useScrollVar from "./tour/useScrollVar";

const LeadMagnet = () => {
  const sceneRef = useRef(null);
  useScrollVar(sceneRef, ["start end", "end end"]);

  return (
    <section ref={sceneRef} id="stop-exit" className="tr-exit" aria-labelledby="audit-title">
      <div className="tr-exit__stage">
        <div className="tr-exit__sign" aria-hidden="true">
          <DoorOpen className="tr-exit__door" />
          <span className="tr-exit__word">Exit</span>
          <ArrowRight className="tr-exit__arrow" />
        </div>

        <div className="ax-container tr-exit__offer">
          <p className="tr-sign"><span className="tr-sign__num">09</span>The way out</p>
          <h2 id="audit-title" className="tr-exit__title">Get a Free AI &amp; Cybersecurity Audit</h2>
          <p className="ax-lead tr-exit__lead">
            We review your current systems and provide actionable insights to
            improve security, performance, and automation.
          </p>
          <Link href="/contact" className="ax-btn tr-btn tr-exit__btn">
            Claim Free Audit <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
