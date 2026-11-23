// HQ tour · one motion feel for the whole home page. Every scroll-linked scene smooths its
// scroll progress with the same spring, so all scenes glide at the same pace, and the
// eases match the CSS (--wk-ease). Transform and opacity only; no filters on moving parts.
export const SCROLL_SPRING = { stiffness: 70, damping: 20, mass: 0.55, restDelta: 0.0005 };
export const EASE = [0.22, 1, 0.36, 1];
