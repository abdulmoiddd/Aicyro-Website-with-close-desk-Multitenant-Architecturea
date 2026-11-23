// Redesign v3: the AI readiness teaser. As a band (default) it sits between sections on
// blog and service pages as a glowing promo card. With variant="tile" it is one of the
// three planning tools on the home page.
import React from "react";
import Link from "next/link";
import { BarChart3, ArrowRight } from "lucide-react";

const TITLE = "Is Your Business Ready for AI?";
const LABEL = "Free assessment tool";
const TEXT = (
  <>
    Don’t invest in AI until you know your “Readiness Score.” Take our 2-minute
    assessment to uncover hidden opportunities, data gaps, and your estimated ROI.
  </>
);

// The home tile carries the second sentence only.
const TILE_TEXT =
  "Take our 2-minute assessment to uncover hidden opportunities, data gaps, and your estimated ROI.";

const AIReadinessTeaser = ({ variant = "band" }) => {
  if (variant === "tile") {
    return (
      <li className="ax-card ax-spot hm-tool" data-reveal style={{ "--i": 0 }}>
        <span className="ax-icon-tile" aria-hidden="true">
          <BarChart3 />
        </span>
        <h3 className="ax-h3">{TITLE}</h3>
        <p className="ax-body">{TILE_TEXT}</p>
        <Link href="/resources/ai-readiness" className="ax-btn ax-btn--quiet">
          <span>Calculate My Score</span>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </li>
    );
  }

  return (
    <section className="ax-section hm-promo-sec" aria-labelledby="ai-readiness-title">
      <div className="ax-container">
        <div className="hm-promo" data-reveal>
          <span className="ax-gridbg" aria-hidden="true" />
          <div className="hm-promo__head">
            <p className="ax-eyebrow">
              <span>{LABEL}</span>
            </p>
            <h2 id="ai-readiness-title" className="ax-h2">{TITLE}</h2>
          </div>

          <div className="hm-promo__body">
            <p className="ax-lead">{TEXT}</p>
            <Link href="/resources/ai-readiness" className="ax-btn">
              <BarChart3 size={20} aria-hidden="true" />
              <span>Calculate My Score</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIReadinessTeaser;
