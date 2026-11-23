"use client";

// Obsidian redesign: one Lenis instance for the public site, driven by the GSAP ticker so
// ScrollTrigger (the walk-in hero, the statement reveal, the count-ups) reads the same
// scroll position every frame. Off under reduced motion; paused while a dialog or the
// phone menu locks the page (body overflow hidden). Cleaned up on unmount.
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenisInstance = null;

/** The running Lenis instance, or null (reduced motion, not mounted). */
export const getLenis = () => lenisInstance;

/** Scroll to an element or y offset, smoothly when Lenis runs, natively otherwise. */
export function scrollToTarget(target, { offset = 0, immediate = false, onComplete } = {}) {
  if (typeof window === "undefined") return;
  const lenis = lenisInstance;
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate, duration: immediate ? 0 : 1.6, onComplete });
    return;
  }
  const y =
    typeof target === "number"
      ? target
      : (target?.getBoundingClientRect?.().top ?? 0) + window.scrollY + offset;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: y, behavior: immediate || reduce ? "auto" : "smooth" });
  if (onComplete) setTimeout(onComplete, immediate || reduce ? 0 : 900);
}

export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Nested scrollers keep native scrolling: the chatbot, dialogs, the phone menu
      prevent: (node) =>
        !!node?.closest?.(".cdw, [role='dialog'], [aria-modal='true'], .ob-nav__sheet, [data-lenis-prevent]"),
    });
    lenisInstance = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    let stopped = false;
    const tick = (time) => {
      // A dialog or menu that locks the page also pauses the smooth scroll behind it
      const locked = document.body.style.overflow === "hidden";
      if (locked && !stopped) {
        lenis.stop();
        stopped = true;
      } else if (!locked && stopped) {
        lenis.start();
        stopped = false;
      }
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onReduce = (e) => {
      if (e.matches) lenis.stop();
    };
    reduce.addEventListener?.("change", onReduce);

    return () => {
      reduce.removeEventListener?.("change", onReduce);
      gsap.ticker.remove(tick);
      lenis.off?.("scroll", onScroll);
      lenis.destroy();
      if (lenisInstance === lenis) lenisInstance = null;
    };
  }, []);

  return null;
}
