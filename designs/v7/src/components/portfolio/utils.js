// Obsidian portfolio helpers, kept free of chart code so the /portfolio index
// does not pull recharts in through CaseStudy.jsx.

// "Kaira - AI Financial Wellness Coach" -> "Kaira"
export const shortTitle = (title = "") => title.split(/\s[-:]\s|:\s/)[0].trim() || title;

// An all-caps CMS tag ("EXPERT SERVICES") is shown in sentence case (gate 67).
export const tidyTag = (tag) =>
  tag && tag === tag.toUpperCase() && /[A-Z]{2}/.test(tag)
    ? tag.charAt(0) + tag.slice(1).toLowerCase()
    : tag;

// "07" style index for card and section numbers.
export const pad2 = (n) => String(n).padStart(2, "0");

// "6 developers" -> { num: "6", unit: "developers" } so the figure can be set large.
// Values without a leading number come back as { text }.
export const splitFigure = (value) => {
  const m = /^(\d+(?:[.,]\d+)?\+?%?)(\s+)(.+)$/.exec(String(value ?? ""));
  return m ? { num: m[1], gap: m[2], unit: m[3] } : { text: value };
};

// Cursor-tracking border glow for every .ob-card under the element the handler is on
// (www.css draws it from --mx / --my). Fine pointers only.
export const trackGlow = (e) => {
  if (e.pointerType && e.pointerType !== "mouse") return;
  e.currentTarget.querySelectorAll(".ob-card").forEach((card) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
};
