"use client";

// HQ tour · the view out of the office windows: the same sky, sun or moon and city as the
// hero street, seen through floor-to-ceiling glass (mullions and a sill in the facade
// material). Sits behind a floor's content. Day in light themes, night in dark themes.
import React from "react";

const BLOCKS = [
  { x: "2%", w: "7%", h: "38%" }, { x: "10%", w: "5%", h: "56%" }, { x: "16%", w: "8%", h: "30%" },
  { x: "26%", w: "6%", h: "46%" }, { x: "33%", w: "9%", h: "26%" }, { x: "44%", w: "5%", h: "60%" },
  { x: "50%", w: "8%", h: "34%" }, { x: "60%", w: "6%", h: "50%" }, { x: "67%", w: "9%", h: "28%" },
  { x: "78%", w: "5%", h: "44%" }, { x: "84%", w: "8%", h: "32%" }, { x: "93%", w: "6%", h: "52%" },
];

export default function CityView({ className = "" }) {
  return (
    <div className={`hq-view ${className}`} aria-hidden="true">
      <span className="hq-view__sky" />
      <span className="hq-view__orb" />
      <span className="hq-view__city">
        {BLOCKS.map((b, i) => (
          <i key={i} style={{ "--x": b.x, "--w": b.w, "--h": b.h }} />
        ))}
      </span>
      <span className="hq-view__glass" />
      <span className="hq-view__sill" />
    </div>
  );
}
