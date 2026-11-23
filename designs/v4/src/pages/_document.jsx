// src/pages/_document.jsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* --- Google Search Console Verification --- */}
        <meta name="google-site-verification" content="RU9Mmnrs0B-77ZemnbfT7X6KPyc9AF_AszHUc8m9mYo" />
      </Head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                document.documentElement.classList.add("js");
                try {
                  var path = window.location.pathname || "";
                  // Internal (Closedesk) routes: scope the engine's base/site styles to them.
                  // Keep in sync with src/lib/routeScopes.js.
                  var internal = ["/lg", "/logs", "/embed", "/e2e-report"].some(function (p) {
                    return path === p || path.indexOf(p + "/") === 0;
                  });
                  if (internal) document.documentElement.classList.add("cd-root");
                  if (path.indexOf("/lg") === 0) return;
                  var theme = localStorage.getItem("closeDesk-theme") || "light";
                  if (theme === "dark") {
                    document.documentElement.setAttribute("data-theme", "dark");
                  } else {
                    document.documentElement.removeAttribute("data-theme");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}