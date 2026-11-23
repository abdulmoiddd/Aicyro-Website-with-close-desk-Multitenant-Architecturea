// Redesign v3: the MVP blueprint teaser. As a band (default) it sits between sections on
// the blog index, contact and SaaS pages as a glowing promo card. With variant="tile"
// it is one of the three planning tools on the home page.
import React from "react";
import { FileText, ArrowRight } from "lucide-react";

const TITLE = "The Ultimate MVP Launch Blueprint";
const LABEL = "For founders & product teams";
const TEXT =
  "Stop guessing and start shipping. Get the step-by-step roadmap to validate your idea, prioritize features, and launch a product your users will actually love.";
const NOTE = "Free for a limited time. No credit card required.";

const LeadMagnet = ({ variant = "band" }) => {
  if (variant === "tile") {
    return (
      <li className="ax-card ax-spot hm-tool" data-reveal style={{ "--i": 2 }}>
        <span className="ax-icon-tile" aria-hidden="true">
          <FileText />
        </span>
        <h3 className="ax-h3">{TITLE}</h3>
        <p className="ax-body">{NOTE}</p>
        <a href="/resources/mvp-blueprint" className="ax-btn ax-btn--quiet">
          <span>Get the Blueprint</span>
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </li>
    );
  }

  return (
    <section className="ax-section hm-promo-sec" aria-labelledby="mvp-blueprint-title">
      <div className="ax-container">
        <div className="hm-promo" data-reveal>
          <span className="ax-gridbg" aria-hidden="true" />
          <div className="hm-promo__head">
            <p className="ax-eyebrow">
              <span>{LABEL}</span>
            </p>
            <h2 id="mvp-blueprint-title" className="ax-h2">{TITLE}</h2>
          </div>

          <div className="hm-promo__body">
            <p className="ax-lead">{TEXT}</p>
            <a href="/resources/mvp-blueprint" className="ax-btn">
              <FileText size={20} aria-hidden="true" />
              <span>Get the Blueprint</span>
            </a>
            <p className="ax-meta">{NOTE}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
