// Obsidian · services: the cursor-tracking border glow for .ob-card (www.css reads --mx / --my).
// Bound once on a container with onPointerMove; only the card under the pointer is updated.
export const trackGlow = (e) => {
  const card = e.target?.closest?.(".ob-card");
  if (!card || !e.currentTarget.contains(card)) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - r.left}px`);
  card.style.setProperty("--my", `${e.clientY - r.top}px`);
};

// "1" -> "01"
export const pad = (n) => String(n).padStart(2, "0");
