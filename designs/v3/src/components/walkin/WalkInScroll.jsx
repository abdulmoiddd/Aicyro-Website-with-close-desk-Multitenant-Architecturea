"use client";

// Walk-in: the public site's scroll feel. Lenis eases the native scroll (sticky
// scenes and framer-motion's useScroll keep working, since Lenis drives the real
// window scroll), and a hairline at the top of the viewport shows how far in you are.
// Off under prefers-reduced-motion; pauses whenever a dialog or menu locks the body.
import { useEffect } from "react";
import { useRouter } from "next/router";
import { motion, useScroll, useSpring } from "framer-motion";

export default function WalkInScroll() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis;
    let observer;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        autoRaf: true,
        lerp: 0.11,
        smoothWheel: true,
        allowNestedScroll: true,
        prevent: (node) =>
          !!node.closest?.('[data-lenis-prevent], [role="dialog"], [aria-modal="true"], .ax-nav__sheet, .cdw'),
      });

      // Modals, the phone menu and the splash lock the page with body overflow:hidden
      const sync = () => {
        const locked = getComputedStyle(document.body).overflow === "hidden";
        if (locked) lenis.stop();
        else lenis.start();
      };
      observer = new MutationObserver(sync);
      observer.observe(document.body, { attributes: true, attributeFilter: ["style", "class"] });
      sync();
    });

    const onRoute = () => lenis?.resize();
    router.events.on("routeChangeComplete", onRoute);

    return () => {
      cancelled = true;
      router.events.off("routeChangeComplete", onRoute);
      observer?.disconnect();
      lenis?.destroy();
    };
  }, [router.events]);

  return <motion.div className="wk-progress" style={{ scaleX }} aria-hidden="true" />;
}
