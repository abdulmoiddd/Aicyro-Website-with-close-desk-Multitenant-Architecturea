# Website redesign: handoff

The public Aicyro website was fully redesigned with Hallmark on the shared CloseDesk system. The Pulse dashboard (`/lg`), `/logs`, `/embed` and the chatbot widget were not touched. A copy of the project from before the redesign is in `../Final Aicyro website (pre-redesign snapshot)/`. `MERGE_NOTES.md` describes how the redesign is built.

```
Redesign  full · about 75 public pages, plus the nav, footer and site-wide overlays
Before    1089 FAIL · 156 REFLEX (whole-site lint)
After     0 FAIL · 0 REFLEX in the public-site files (static); 11 WARN, all confirmed or explained
Kept      every link, form field, handler, Firebase read and write, /api call, SEO tag, the splash, the cookie logic and the theme switch
Changed   the system and the composition: shape, hero, sections and chrome
Dropped   decoration only: glows, orbs, gradients, badge pills, marquees, fake stat gauges and stock or generated faces
Compare   .hallmark/compare.html (before and after; the "before" first screens are covered by the splash)
```

## Needs your action
1. **Firebase security (urgent).** Anyone can read the `aicyroweb` database at its root without logging in. That includes `login`, `users`, `leads`, `prospects`, `inquiries` and `user_cookies`. Tighten its security rules.
2. **Case-study charts are hidden.** Every chart and result figure on the 15 case-study pages is sample data: the code labels it "MOCK DATA FOR CHARTS". Some charts don't match their project. For example, Cove shows "Tenant Satisfaction" and Shady Rays shows "Threat Mitigation". The charts are switched off with one flag, `SHOW_ILLUSTRATIVE_METRICS` in `src/components/portfolio/CaseStudy.jsx`, and the data is still in each page. Replace the data with real figures before you switch the flag on.
3. **Image hosting.** Every case-study and testimonial image is hotlinked from `dummyimages.netlify.app`. That host was unreachable for long stretches today, and `kaira.jpg` alone is 858 KB. While an image fails, its frame now drops away and the card shows its text. Move the images to your own storage at web size.
4. **`NEXT_PUBLIC_GOOGLE_CLIENT_ID` is missing.** Without it, `/MeetingScheduler` crashes on load. It already did before the redesign.

## Check these facts (kept exactly as found)
- **Client logos:** the artwork shows cove, cubix, KAIRA, SHADYRAYS and POLITICO PRO, but the names in the code (read out to screen readers) are The Verge, MongoDB, Upwork, The Standard and Politico.
- **Testimonials (CMS):**
  - James Carter writes "our hospital in the USA", but his location is "London, UK".
  - Two testimonials had generated faces (pravatar and gravatar), which are no longer shown.
  - Mohammad Hossam's location field holds his job title.
- **Figures:**
  - Home and services: "99.9% uptime" and "70% of breaches happen due to missed configuration steps".
  - SaaS service page: 58%, 4× and 99.98%.
  - The percentages in the blog posts, listed in the blog group's report.
- **Dates:** several service headlines say "2025" while the CMS copy says 2026. Blog dates also differ between the index data and the bylines of `blog4` to `blog7` and `blog11`.
- **CMS content:**
  - Cove's description ends mid-sentence ("…multi-model AI apps. Now").
  - Kaira's team size is 6 in one field and 5 in another.
  - The sales-automation gallery reuses the body-language images.
- **Copy you could improve:**
  - The home headline (11 words over four lines) and several section heads would pass unchanged on any agency's site, for example "End-to-End Technical Expertise" and "Client Feedback & Reviews". A line that names your 15 shipped projects would fit only Aicyro.
  - "Where does your data is stored ?" is quoted verbatim and is ungrammatical.
- **Not wired, as before:**
  - `blog.jsx`: its search, "Read Full Story" and digest form do nothing.
  - The security checklist shows "Submitted" even when the write fails.
  - Two thank-you pages claim emails were sent; those requests are fire-and-forget.
- **Contact info:** your CMS `contactSection.infoContent` holds hours, a map and social links. Neither the old page nor the new one shows them.

## Copy changed by the copy rules
- **Blogs:** every line is listed in `.hallmark/copy-changes-blogs.txt`. That covers 70 dashes and four buzzwords; for example the title "…to Streamline Your Business Tasks…" became "…to Simplify Your Business Tasks…".
- **Elsewhere:**
  - Eyebrow labels were cut or turned into headings, including "Our Story", "What We Deliver" and "TRUSTED BY STARTUPS & ENTERPRISES" (that one is still in the CMS).
  - Tracked capitals became sentence case.
  - Arrows were removed from links, middle dots from meta lines.
  - Straight quotes became curly.
  - "empowers" became "lets", "robust" was cut or became "reliable", "seamless" became "predictable" or "continuous", and "unlock" became "get" or "create".
  - "future-proof" was cut, and the "We don't just…" lines were cut.
  - "All rights reserved" was cut.
- **Dashes in your service-page CMS copy** are now set as commas and colons when the page displays them. The text in Firebase is unchanged.
