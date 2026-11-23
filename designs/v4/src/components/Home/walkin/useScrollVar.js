"use client";

// Walk-in · one scroll listener per scene, written into a CSS custom property (--p, 0 to 1)
// on the scene's element, so the choreography lives in CSS (calc and clamp on --p) and
// works in every browser. Smoothed with a spring; under reduced motion --p is pinned to 1
// (the final, readable state) and the element gets .is-still.
import { useEffect } from "react";
import { useScroll, useSpring, useMotionValueEvent, useReducedMotion } from "framer-motion";

export default function useScrollVar(ref, offset = ["start end", "end start"], name = "--p") {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.35 });

  useMotionValueEvent(p, "change", (v) => {
    if (reduce) return;
    ref.current?.style.setProperty(name, v.toFixed(4));
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.style.setProperty(name, "1");
      el.classList.add("is-still");
    } else {
      el.classList.remove("is-still");
      el.style.setProperty(name, scrollYProgress.get().toFixed(4));
    }
  }, [reduce, ref, name, scrollYProgress]);

  return reduce;
}
