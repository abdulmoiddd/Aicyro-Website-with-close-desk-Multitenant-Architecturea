"use client";

// Obsidian home: the closing conversion banner. The free audit offer from the previous
// close, full width over the hero's architecture (accent glow, perspective grid), with a
// magnetic primary action to contact and the booking alternative.
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Magnetic from "../../motion/Magnetic";

export default function ClosingCTA() {
  return (
    <section className="ob-close ob-ambient" aria-labelledby="audit-title">
      <div className="ax-container ob-close__inner">
        <p className="ob-eyebrow">07 / Start here</p>
        <h2 id="audit-title" className="ob-close__title" data-reveal>
          Get a Free AI &amp; Cybersecurity Audit
        </h2>
        <p className="ax-lead" data-reveal style={{ "--i": 1 }}>
          We review your current systems and provide actionable insights to improve security, performance, and
          automation.
        </p>
        <div className="ob-close__actions" data-reveal style={{ "--i": 2 }}>
          <Magnetic strength={0.35}>
            <Link href="/contact" className="ax-btn ob-close__btn">
              Claim Free Audit
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </Magnetic>
          <Magnetic strength={0.25}>
            <Link href="/contact" className="ax-btn ax-btn--quiet ob-close__btn">
              Book Free Consultation
            </Link>
          </Magnetic>
        </div>
        <p className="ob-close__note">
          Or write to <a href="mailto:info@aicyro.com">info@aicyro.com</a>
        </p>
      </div>
    </section>
  );
}
