"use client";

// Obsidian redesign: the lifecycle wrapper for the walk-in WebGL scene. Loaded by
// WalkInHero through next/dynamic with ssr: false, so three and troika never run on the
// server. One scene per mount; the effect's cleanup disposes all of it.
import { useEffect, useRef } from "react";
import { createWalkInScene, hasWebGL } from "./walkInScene";

export default function WalkInCanvas({ trackRef, onFrame, onReady, onFail }) {
  const hostRef = useRef(null);
  // Callbacks in refs, so a parent re-render never rebuilds the scene
  const cb = useRef({ onFrame, onReady, onFail });
  useEffect(() => {
    cb.current = { onFrame, onReady, onFail };
  });

  useEffect(() => {
    const host = hostRef.current;
    const track = trackRef?.current;
    if (!host || !track) return undefined;
    if (!hasWebGL()) {
      cb.current.onFail?.();
      return undefined;
    }
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    let dispose;
    try {
      dispose = createWalkInScene(host, {
        track,
        isTouch,
        onFrame: (p) => cb.current.onFrame?.(p),
        onReady: () => cb.current.onReady?.(),
      });
    } catch (e) {
      console.error("Walk-in scene failed to start:", e);
      cb.current.onFail?.();
    }
    return () => dispose?.();
  }, [trackRef]);

  return <div ref={hostRef} className="wh-canvas" aria-hidden="true" />;
}
