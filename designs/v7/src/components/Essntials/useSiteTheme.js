// The public site's light/dark mode. ThemeProvider (src/Closedesk/ThemeProvider.jsx)
// applies the mode saved under "closeDesk-theme" as data-theme on <html> and listens for
// "closeDesk-theme-change"; this hook reads that attribute and writes the preference.
import { useCallback, useSyncExternalStore } from "react";

const THEME_KEY = "closeDesk-theme";
const THEME_EVENT = "closeDesk-theme-change";

const read = () => ((document.documentElement.getAttribute("data-theme") || "").endsWith("dark") ? "dark" : "light");
const subscribe = (onChange) => {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};

export default function useSiteTheme() {
  // Server render assumes light, the provider's default
  const theme = useSyncExternalStore(subscribe, read, () => "light");

  const toggle = useCallback(() => {
    const next = read() === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, next);
      localStorage.setItem("theme", next); // the site's older key, kept in step
    } catch (e) {
      /* storage blocked: still switch for this page */
    }
    document.documentElement.setAttribute("data-theme", next === "dark" ? "dark" : "light");
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  return { theme, toggle };
}
