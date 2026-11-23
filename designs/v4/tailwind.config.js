// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   // Enables toggling dark mode manually via a class on the HTML tag
//   darkMode: "class",
//   content: [
//     "./src/pages/**/*.{js,jsx}",
//     "./src/components/**/*.{js,jsx}",
//     "./src/app/**/*.{js,jsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         // Mapping Tailwind classes (e.g., 'bg-primary') to your CSS variables
//         primary: "var(--bg-primary)",
//         secondary: "var(--bg-secondary)",
//         textMain: "var(--text-primary)",
//         textMuted: "var(--text-secondary)",
//         brand: "var(--brand-accent)",
//       },
//     },
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/pages/**/*.{js,jsx}", "./src/Closedesk/**/*.{js,jsx}", "./src/components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Mapping to your globals.css variables
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--foreground-muted)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent-blue)",
        card: "var(--card-bg)",
        gridLine: "var(--grid-line)",
        footer: "var(--footer-bg)",
        // Hallmark roles (tokens.css + closedesk.css); every one follows the tenant theme
        paper: "var(--color-paper)",
        "paper-2": "var(--color-paper-2)",
        "paper-3": "var(--color-paper-3)",
        ink: "var(--color-ink)",
        "ink-2": "var(--color-ink-2)",
        rule: "var(--color-rule)",
        signal: "var(--color-accent)",
        "signal-ink": "var(--color-accent-ink)",
        "signal-wash": "var(--color-accent-wash)",
        focus: "var(--color-focus)",
        success: "var(--color-success)",
        danger: "var(--color-danger)",
        warn: "var(--color-warn)",
        hover: "var(--color-hover)",
        selected: "var(--color-selected)",
      },
      fontFamily: {
        body: "var(--font-body)",
        display: "var(--font-display)",
        // Fallback keeps Tailwind's monospace stack on public pages (no --font-mono there)
        mono: "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace)",
      },
      // Public website type roles and rhythm (src/styles/tokens.css, www.css)
      fontSize: {
        display: "var(--text-display)",
        "display-s": "var(--text-display-s)",
        section: "var(--text-section)",
        title: "var(--text-title)",
        lead: "var(--text-lead)",
      },
      spacing: {
        "section-s": "var(--section-gap-s)",
        section: "var(--section-gap)",
        "section-l": "var(--section-gap-l)",
        gutter: "var(--gutter)",
        "nav-h": "var(--nav-h)",
      },
      maxWidth: {
        container: "var(--container)",
      },
      borderRadius: {
        frame: "var(--radius-frame)",
        panel: "var(--radius-panel)",
        control: "var(--radius-control)",
        chip: "var(--radius-chip)",
      },
      backgroundImage: {
        "card-gradient":
          "linear-gradient(to bottom, var(--card-gradient-start), var(--card-gradient-end))",
        "hero-spotlight":
          "radial-gradient(circle at top, var(--hero-from), var(--hero-via), var(--hero-to))",
      },
    },
  },
  plugins: [],
};

// //
// //
// //
// //

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   darkMode: "class",
//   content: ["./src/pages/**/*.{js,jsx}", "./src/Closedesk/**/*.{js,jsx}", "./src/components/**/*.{js,jsx}"],
//   theme: {
//     extend: {
//       colors: {
//         background: "var(--background)",
//         foreground: "var(--foreground)",
//         muted: "var(--foreground-muted)",
//         primary: "var(--primary)",
//         "primary-hover": "var(--primary-hover)",
//         secondary: "var(--secondary)",
//         card: "var(--card-bg)",
//         border: "var(--border-color)",
//       },
//     },
//   },
//   plugins: [],
// };
