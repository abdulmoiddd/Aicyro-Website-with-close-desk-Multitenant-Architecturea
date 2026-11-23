// src/pages/layout.jsx
// Public pages: Aicyro website overlays (cookie banner, sticky estimate button)
// plus the Closedesk multi-tenant chatbot widget for Aicyro's own tenant.
// Internal routes (dashboard, logs, embeds, reports) render their children only.
import { useRouter } from "next/router";
import AicyroChatbot from "@/Closedesk/Chatbot/AicyroChatbot";
import Sticky from "../components/Home/StickyEstimateBtn";
import CookieConsentBanner from "../components/Essntials/CookieConsentBanner";
import { isInternalPath } from "@/lib/routeScopes";

// The marketing site is Aicyro's own (default) tenant.
const SITE_TENANT_ID = "default";

export default function RootLayout({ children }) {
  const router = useRouter();

  if (isInternalPath(router.pathname)) {
    return <>{children}</>;
  }

  return (
    // A plain wrapper: each page renders its own <main id="main">
    <div>
      {children}

      <CookieConsentBanner />
      <AicyroChatbot tenantId={SITE_TENANT_ID} />
      <Sticky />
    </div>
  );
}
