// Aurora redesign (was Hallmark): the MVP blueprint teaser. As a band (default) it sits between
// sections on the blog index, contact and SaaS pages: the head beside the line and
// the action. With variant="tile" it is one of the three planning tools on the home
// page: the title, the terms line and the action (screen word budget, gate 58).
import React from "react";
import Link from "next/link";
import { FileText } from "lucide-react";

const TITLE = "The Ultimate MVP Launch Blueprint";
const LABEL = "For founders & product teams";
const TEXT =
  "Stop guessing and start shipping. Get the step-by-step roadmap to validate your idea, prioritize features, and launch a product your users will actually love.";
const NOTE = "Free for a limited time. No credit card required.";

const LeadMagnet = ({ variant = "band" }) => {
  if (variant === "tile") {
    return (
      <li>
        <span className="ax-icon-tile">
          <FileText aria-hidden="true" />
        </span>
        <h3 className="ax-h3">{TITLE}</h3>
        <p className="ax-body">{NOTE}</p>
        {/* Updated link anchor to point to a download or resource page */}
        <Link href="/resources/mvp-blueprint" className="ax-btn ax-btn--quiet">
          <FileText size={18} aria-hidden="true" />
          <span>Get the Blueprint</span>
        </Link>
      </li>
    );
  }

  return (
    <section className="ax-section" aria-labelledby="mvp-blueprint-title">
      <div className="ax-container">
      <div className="hm-teaser" data-reveal>
        <div className="hm-teaser__head">
          <p className="ax-eyebrow">
            <FileText aria-hidden="true" />
            {LABEL}
          </p>
          <h2 id="mvp-blueprint-title" className="ax-h2">{TITLE}</h2>
        </div>

        <div className="hm-teaser__body">
          <p className="ax-lead">{TEXT}</p>
          {/* Updated link anchor to point to a download or resource page */}
          <Link href="/resources/mvp-blueprint" className="ax-btn">
            <FileText size={20} aria-hidden="true" />
            <span>Get the Blueprint</span>
          </Link>
          <p className="ax-meta">{NOTE}</p>
        </div>
      </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
