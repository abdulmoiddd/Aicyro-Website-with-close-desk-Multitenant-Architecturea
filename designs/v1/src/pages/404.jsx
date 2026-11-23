import React from "react";
import Head from "next/head";
import Link from "next/link";
import { ArrowRight, Briefcase, Compass, Layers, Newspaper, Users } from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";
import Favicon from "../assets/favicon.png";

// Aurora redesign: a big gradient number on the aurora stage, the way back, and
// the helpful links as cards. The words and routes are unchanged.
const HELPFUL_LINKS = [
  { name: "Services", href: "/services", icon: Layers },
  { name: "Portfolio", href: "/portfolio", icon: Briefcase },
  { name: "About Us", href: "/about", icon: Users },
  { name: "Blogs", href: "/blogs", icon: Newspaper },
];

const NotFoundPage = () => {
  return (
    <>
      <Head>
        <title>Page Not Found | Aicyro Solutions</title>
        <meta
          name="description"
          content="The page you are looking for might have been removed or is temporarily unavailable."
        />
        <link rel="icon" href={Favicon.src} />
      </Head>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main id="main">
        <section className="ax-aurora ut-stage" aria-labelledby="nf-title">
          <div className="ax-container ax-container--narrow">
            <div className="ut-lost">
              {/* Main 404 Display */}
              <h1 className="ut-404">404</h1>

              <span className="ax-eyebrow">
                <Compass aria-hidden="true" />
                Lost the trail
              </span>

              {/* Professional Copy */}
              <h2 id="nf-title" className="ax-h2">
                Page not found
              </h2>
              <p className="ax-lead">
                The page you are looking for might have been removed, had its name
                changed, or is temporarily unavailable.
              </p>

              {/* Action Area */}
              <div className="ut-actions">
                <Link href="/" className="ax-btn">
                  Go to Homepage
                </Link>
                <Link href="/contact" className="ax-btn ax-btn--quiet">
                  Contact Support
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <nav className="ut-quick" aria-labelledby="nf-links">
              <h3 id="nf-links" className="ax-eyebrow ut-quick__label">
                Helpful Links
              </h3>
              <ul className="ax-bento">
                {HELPFUL_LINKS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name} className="ax-span-6" data-reveal style={{ "--i": i }}>
                      <Link href={item.href} className="ax-card ut-linkcard h-full">
                        <span className="ax-icon-tile">
                          <Icon aria-hidden="true" />
                        </span>
                        <span className="ut-linkcard__text">
                          <b>{item.name}</b>
                        </span>
                        <span className="ut-go">
                          <ArrowRight aria-hidden="true" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default NotFoundPage;
