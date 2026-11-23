"use client";

// HQ tour · floor 09, the way out (elevator doors).
// The tour ends at the lift. As you walk up, the floor display counts to 09, the two
// steel doors slide apart, and inside the lit car is the free audit offer with its one
// action (contact). Pure translate and opacity, from one scroll value (--p, see hq.css).
// Reduced motion: the doors open, the offer in place.
import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronUp } from "lucide-react";
import useScrollVar from "./hq/useScrollVar";
import CityView from "./hq/CityView";

const LeadMagnet = () => {
  const sceneRef = useRef(null);
  useScrollVar(sceneRef, ["start start", "end end"]);

  return (
    <section ref={sceneRef} id="hq-exit" className="hq-lift" aria-labelledby="audit-title">
      <div className="hq-lift__stage">
        <CityView className="hq-view--lobby" />
        <div className="hq-lift__frame">
          <div className="hq-lift__display" aria-hidden="true">
            <ChevronUp size={16} />
            <span>09</span>
            <em>Free audit</em>
          </div>

          <div className="hq-lift__car">
            <div className="hq-lift__offer">
              <p className="hq-floor-label"><span>09</span> The way out</p>
              <h2 id="audit-title" className="hq-lift__title">Get a Free AI &amp; Cybersecurity Audit</h2>
              <p className="ax-lead hq-lift__lead">
                We review your current systems and provide actionable insights to
                improve security, performance, and automation.
              </p>
              <Link href="/contact" className="ax-btn hq-btn hq-lift__btn">
                Claim Free Audit <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <span className="hq-lift__door hq-lift__door--l" aria-hidden="true" />
            <span className="hq-lift__door hq-lift__door--r" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
