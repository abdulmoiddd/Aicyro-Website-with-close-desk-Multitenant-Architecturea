import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowRight, Calculator } from "lucide-react";

// Redesign v3 (Aurora Studio): a glass pill with a gradient icon tile, docked at the
// bottom right and stacked above the chatbot launcher, so it never sits on the content
// column. It appears once the visitor has scrolled past the first screen, and never on
// the estimator itself. The route is unchanged; "Get an Estimate" stays in the link's
// name for screen readers. Hidden under 48rem, as before.
const StickyEstimateBtn = () => {
  const router = useRouter();
  const [past, setPast] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setPast(window.scrollY > window.innerHeight * 0.8));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [router.asPath]);

  if (router.pathname === "/resources/project-estimate") return null;

  return (
    <Link href="/resources/project-estimate" className="ms-pill" data-shown={past ? "true" : "false"} tabIndex={past ? undefined : -1} aria-hidden={past ? undefined : true}>
      <span className="ms-pill__tile" aria-hidden="true">
        <Calculator size={18} />
      </span>
      <span className="sr-only">Get an Estimate: </span>
      <span>Project Cost Calculator</span>
      <ArrowRight size={16} className="ms-pill__go" aria-hidden="true" />
    </Link>
  );
};

export default StickyEstimateBtn;
