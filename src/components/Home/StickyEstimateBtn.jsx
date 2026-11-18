import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Calculator } from "lucide-react";

// Hallmark redesign: a quiet, single-line pill docked at the bottom right, stacked
// above the chatbot launcher, so it never sits on the content column. It appears
// once the visitor has scrolled past the first screen, and never on the estimator
// itself. The route is unchanged; "Get an Estimate" stays in the link's name for
// screen readers. Hidden under 48rem, as before (was hidden md:block).
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
    <Link href="/resources/project-estimate" className="rs-pill" data-shown={past ? "true" : "false"} tabIndex={past ? undefined : -1} aria-hidden={past ? undefined : true}>
      <Calculator size={16} aria-hidden="true" />
      <span className="sr-only">Get an Estimate: </span>
      <span>Project Cost Calculator</span>
    </Link>
  );
};

export default StickyEstimateBtn;
