// src/pages/_app.jsx
// Merged app shell:
//  - Public pages: the Aicyro website UI (Poppins, splash logo animation,
//    default SEO head, Google OAuth provider for the meeting scheduler).
//  - Internal routes (/lg Pulse dashboard, /logs, /embed, /e2e-report): the
//    Closedesk multi-tenant engine shell, exactly as in "New Final".
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Poppins, Bricolage_Grotesque, Instrument_Sans, Space_Grotesk, DM_Sans } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "@/styles/globals.css";
import Favicon from "../assets/favicon.png";
import LogoAnimation from "../components/LogoAnimation";
import RootLayout from "./layout";
import WalkInScroll from "../components/walkin/WalkInScroll";
import ThemeProvider from "../Closedesk/ThemeProvider";
import GlobalActivityTracker from "../Closedesk/GlobalActivityTracker";

// Tracking, tracing and logging
import { trackVisit } from "../lib/activityTracker";
import { isInternalPath } from "../lib/routeScopes";
import { generateCorrelationId } from "../lib/tracer";
import { createWebsiteLogger } from "../lib/loggerPresets";

const DEFAULT_TITLE = "Advanced AI & Cybersecurity Solutions | Aicyro ";
const DEFAULT_DESC = "Aicyro Solutions is a SaaS development company...";
const DEFAULT_KEYWORDS = "SaaS development company, Cyber security experts...";

// Public website font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

// Closedesk fonts: used by the Pulse dashboard and the chatbot widget
// (closedesk.css reads --font-site-display / --font-site-body).
const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-site-display",
});

const bodyFont = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-site-body",
});

// Public website "Walk-in" faces (www.css reads --font-walk-display / --font-walk-body).
// The Pulse dashboard and the super admin portal keep the Closedesk faces above.
const walkDisplay = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  variable: "--font-walk-display",
});

const walkBody = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-walk-body",
});

// Super admin portal (login and inbox): rendered with the frozen pre-redesign kit
// (src/styles/www-legacy.css) so the public redesign never restyles it.
const ADMIN_PREFIXES = ["/mes", "/messages"];
const isAdminPath = (p) => ADMIN_PREFIXES.some((x) => p === x || (p || "").startsWith(`${x}/`));

const routerLogger = createWebsiteLogger("AppRouter");

// Class on <html> that scopes the Closedesk base/site styles to internal routes,
// so they never restyle the public website. Also set before paint in _document.
const INTERNAL_ROOT_CLASS = "cd-root";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(false);

  const isInternalRoute = isInternalPath(router.pathname);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle(INTERNAL_ROOT_CLASS, isInternalRoute);
  }, [isInternalRoute]);

  // Splash logo animation: public pages only, once per browser session
  useEffect(() => {
    if (isInternalRoute) {
      setShowSplash(false);
      return;
    }
    try {
      const hasVisited = sessionStorage.getItem("aicyro_visited");
      if (!hasVisited) {
        setShowSplash(true);
        sessionStorage.setItem("aicyro_visited", "true");
      }
    } catch (e) {}
  }, [isInternalRoute]);

  // Visit tracking and navigation logging (public pages only)
  useEffect(() => {
    if (isInternalRoute) return;

    if (router.isReady) {
      const initialPageTxId = generateCorrelationId();
      routerLogger.info("navigation", "page_loaded", {
        correlation: { correlation_id: initialPageTxId },
        context: { endpoint: router.pathname },
      });
      trackVisit(router.pathname, initialPageTxId);
    }

    const handleRouteChange = (url) => {
      if (isInternalPath(url)) return;
      const routeTxId = generateCorrelationId();
      routerLogger.info("navigation", "page_loaded", {
        correlation: { correlation_id: routeTxId },
        context: { endpoint: url },
      });
      trackVisit(url, routeTxId);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.isReady, router.pathname, isInternalRoute, router.events]);

  // One reveal for the public site (www.css): [data-reveal] fades in once when it
  // enters the viewport. Content is visible without script (the hidden state is
  // scoped under html.js) and at once under reduced motion.
  useEffect(() => {
    if (isInternalRoute || typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -10% 0px" }
    );
    // A framed picture (.ax-shot) whose image fails, or has not arrived after 15s,
    // drops out so its card or section falls back to type, never an empty frame.
    const timers = [];
    const dropFrame = (img) => (img.closest(".ax-shot") || img).setAttribute("data-img-failed", "");
    const watchImg = (img) => {
      if (img.dataset.axWatched) return;
      img.dataset.axWatched = "1";
      if (img.complete) {
        if (img.naturalWidth === 0) dropFrame(img);
        return;
      }
      img.addEventListener("error", () => dropFrame(img), { once: true });
      img.addEventListener("load", () => (img.closest(".ax-shot") || img).removeAttribute("data-img-failed"), { once: true });
      if (img.loading !== "lazy") timers.push(setTimeout(() => !img.complete && dropFrame(img), 15000));
    };
    const scan = (root) => {
      root.querySelectorAll?.("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
      root.querySelectorAll?.(".ax-shot img, img[data-drop-on-fail]").forEach(watchImg);
      if (root.matches?.(".ax-shot img, img[data-drop-on-fail]")) watchImg(root);
    };
    scan(document);
    const mo = new MutationObserver((records) =>
      records.forEach((r) => r.addedNodes.forEach((n) => n.nodeType === 1 && (n.matches?.("[data-reveal]") ? (io.observe(n), scan(n)) : scan(n))))
    );
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [isInternalRoute, router.asPath]);

  const fontVars = `${displayFont.variable} ${bodyFont.variable} ${poppins.variable} ${walkDisplay.variable} ${walkBody.variable}`;
  const isAdminRoute = isAdminPath(router.pathname);

  // Internal routes render exactly as in the multi-tenant engine.
  if (isInternalRoute) {
    return (
      <ThemeProvider>
        <Head>
          <link rel="icon" href={Favicon.src} />
        </Head>
        {/* Font variables only; display: contents keeps the layout untouched */}
        <div className={fontVars} style={{ display: "contents" }}>
          <RootLayout>
            <Component {...pageProps} />
          </RootLayout>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <Head>
        <title>{DEFAULT_TITLE}</title>
        <meta name="description" content={DEFAULT_DESC} />
        <meta name="keywords" content={DEFAULT_KEYWORDS} />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <link rel="icon" href={Favicon.src} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&display=swap" rel="stylesheet" />
      </Head>

      {showSplash && <LogoAnimation onComplete={() => setShowSplash(false)} />}

      <ThemeProvider>
        {/* Font variables reach the chatbot widget, which renders in the layout */}
        {/* .www scopes the public website's Walk-in system (src/styles/www.css);
            the super admin portal keeps the frozen kit under .www-legacy */}
        <div className={`${isAdminRoute ? "www-legacy" : "www"} ${fontVars}`}>
          <RootLayout className={poppins.className}>
            <GlobalActivityTracker />
            {!isAdminRoute && <WalkInScroll />}
            <Component {...pageProps} />
          </RootLayout>
        </div>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
