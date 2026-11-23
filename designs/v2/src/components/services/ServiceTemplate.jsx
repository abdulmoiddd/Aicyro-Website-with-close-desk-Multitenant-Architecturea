// Redesign v3 (Aurora Studio): one template for the eight service pages.
// Each page still loads its own CMS record (Servicessubpages/<Name> in aicyroweb)
// and keeps its loading, error and scroll logic; this file only decides how the
// record shows: a page hero (breadcrumbs, the service label as the eyebrow, the
// title with one gradient phrase, the CMS line, the contents), then the CMS
// sections as a varied run of compositions (card grids, a numbered timeline,
// a client-story bento, myths beside facts), ending on an ax-cta close.
// Colours come only from the globals.css theme variables (see www.css).
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ArrowRight,
  ArrowDownRight,
  Check,
  X,
  CircleDot,
  CircleCheck,
  CircleX,
  Sparkles,
} from "lucide-react";
import Navbar from "../Essntials/Navbar";
import Footer from "../Essntials/footer";

/* ------------------------------------------------------------ reading the CMS text */
// The CMS writes each section as plain lines: paragraphs, bullets, check marks,
// cross marks and "1. Title" numbered items. The markers become icons or rules.
const MARKS = [
  [String.fromCodePoint(0x2022), "dot"], // bullet
  [String.fromCodePoint(0x2714), "check"], // heavy check mark
  [String.fromCodePoint(0x2713), "check"], // check mark
  [String.fromCodePoint(0x274c), "cross"], // cross mark
];

const readLine = (raw) => {
  const t = raw.trim();
  if (!t) return { type: "gap" };
  for (const [m, mark] of MARKS) {
    if (t.startsWith(m)) return { type: "item", mark, text: t.slice(m.length).replace(/^[️\s]+/, "") };
  }
  const n = t.match(/^(\d+)\.\s*(.+)$/);
  if (n) return { type: "num", n: n[1], text: n[2] };
  return { type: "para", text: t };
};

const parse = (content) => {
  const intro = [];
  const steps = [];
  let into = intro;
  let list = null;
  String(content || "")
    .split("\n")
    .map(readLine)
    .forEach((l) => {
      if (l.type === "num") {
        steps.push({ n: l.n, title: l.text, blocks: [] });
        into = steps[steps.length - 1].blocks;
        list = null;
      } else if (l.type === "gap") {
        list = null;
      } else if (l.type === "item") {
        if (!list || list.mark !== l.mark) {
          list = { type: "list", mark: l.mark, items: [] };
          into.push(list);
        }
        list.items.push(l.text);
      } else {
        list = null;
        into.push({ type: "para", text: l.text });
      }
    });
  return { intro, steps };
};

// A run of blocks as groups: the paragraphs that lead into a list, then the list.
// Paragraphs after the last list are the coda.
const group = (blocks) => {
  const groups = [];
  let paras = [];
  blocks.forEach((b) => {
    if (b.type === "para") paras.push(b.text);
    else {
      groups.push({ paras, list: b });
      paras = [];
    }
  });
  return { groups, coda: paras };
};

const kindOf = (section, parsed, g) => {
  if (section.id === "cta") return "close";
  if (parsed.steps.length >= 2) return "steps";
  if (g.groups.some((x) => x.list.mark === "cross")) return "versus";
  if (/story/i.test(section.id || "")) return "case";
  if (g.groups.length === 0) return "lede";
  const one = g.groups.length === 1 ? g.groups[0] : null;
  if (one && one.list.mark === "check" && one.paras.length <= 1 && g.coda.length) return "statement";
  if (one && one.paras.length === 0 && g.coda.length === 0) return "grid";
  return g.groups.length >= 2 ? "columns" : "split";
};

const LEFT = new Set(["lede", "split", "steps"]);

// Never the same composition twice in a row, never two head-left ones in a row,
// and the statement once a page.
const plan = (sections) => {
  const out = [];
  let statements = 0;
  sections.forEach((section, i) => {
    const parsed = parse(section.content);
    // A lone "1. Title" line is not a sequence: it reads back as a paragraph.
    const flat = [
      ...parsed.intro,
      ...parsed.steps.flatMap((s) => [{ type: "para", text: `${s.n}. ${s.title}` }, ...s.blocks]),
    ];
    const g = group(parsed.steps.length >= 2 ? parsed.intro : flat);
    let kind = kindOf(section, parsed, g);
    if (kind === "statement" && statements > 0) kind = "split";
    if (kind === "statement") statements += 1;
    const prev = out[i - 1]?.kind;
    const next = sections[i + 1];
    const nextIsSteps = next && next.id !== "cta" && parse(next.content).steps.length >= 2;
    if (kind === "split" && nextIsSteps) kind = "columns";
    if (prev && (prev === kind || (LEFT.has(prev) && LEFT.has(kind)))) {
      if (kind === "split" || kind === "lede") kind = "columns";
      else if (kind === "columns" || kind === "grid") kind = "split";
    }
    out.push({ section, parsed, g, kind });
  });
  return out;
};

// "58% cloud cost reduction", "4× faster deployments": a list of the owner's own
// figures, each leading its line, sets as figures.
const FIGURE = /^([\d.,]+\s?(?:%|×|x)?)\s+(.+)$/;
const asFigures = (list) =>
  list.items.length >= 2 &&
  list.items.length <= 4 &&
  list.items.every((t) => {
    const m = t.match(FIGURE);
    return m && /[%×x]/.test(m[1]);
  });

/* ------------------------------------------------------------ labels */
// The service's short name for the breadcrumb (the same names as the nav).
const SERVICE_NAMES = new Map([
  ["/services/ai-solutions", "AI Solutions"],
  ["/services/app-development", "App Development"],
  ["/services/blockchain", "Blockchain"],
  ["/services/cloud-devops", "Cloud & DevOps"],
  ["/services/cybersecurity-data-protection", "Cybersecurity"],
  ["/services/qa-automation", "QA & Automation"],
  ["/services/saas-development", "SaaS Development"],
  ["/services/web-development", "Web Development"],
]);

// A short eyebrow above each CMS section, from the section's own id.
const EYEBROWS = new Map([
  ["intro", "Introduction"],
  ["reality", "Reality check"],
  ["problem", "The problem"],
  ["story", "Client story"],
  ["response", "Response"],
  ["action", "What we did"],
  ["framework", "Framework"],
  ["architecture", "Architecture"],
  ["truth", "Reality check"],
  ["actionable", "Takeaways"],
  ["insights", "Takeaways"],
  ["advantage", "Why it matters"],
  ["approach", "Our approach"],
  ["solution", "The solution"],
  ["cta", "Next step"],
]);

const MARK_ICON = { dot: CircleDot, check: CircleCheck, cross: CircleX };

// Bento spans so every row of the 6-column grid is full.
const span = (i, n) => {
  if (n === 1) return "is-full";
  if (n % 3 === 0) return "";
  if (n % 3 === 2) return i < 2 ? "is-half" : "";
  return i < 4 ? "is-half" : "";
};

const pad = (n) => String(n).padStart(2, "0");

// The h1: an array sets one line each with the last in the gradient; a string
// paints the `accent` phrase when the title holds it.
const renderTitle = (title, accent) => {
  if (Array.isArray(title)) {
    return title.map((t, i) => (
      <span key={i} className={`svc-hero__line ${i === title.length - 1 && title.length > 1 ? "ax-grad" : ""}`.trim()}>
        {t}
      </span>
    ));
  }
  const s = String(title || "");
  const at = accent ? s.indexOf(accent) : -1;
  if (at < 0) return s;
  return (
    <>
      {s.slice(0, at)}
      <span className="ax-grad">{accent}</span>
      {s.slice(at + accent.length)}
    </>
  );
};

// "Build Smarter. Convert Faster.": the last sentence of a two-sentence title in the gradient.
const gradTail = (title) => {
  const s = String(title || "").trim();
  const m = s.match(/^(.+?[.!?])\s+(\S.*)$/);
  if (!m) return s;
  return (
    <>
      {m[1]} <span className="ax-grad">{m[2]}</span>
    </>
  );
};

/* ------------------------------------------------------------ small parts */
const Para = ({ text, className = "" }) => (
  <p className={`${/:$/.test(text) ? "svc-cap" : "svc-p"} ${className}`.trim()}>{text}</p>
);

const List = ({ list, size = "", chips = false }) => {
  if (asFigures(list)) {
    return (
      <div className="ax-stats svc-figures" style={{ "--cols": list.items.length }}>
        {list.items.map((t, i) => {
          const [, fig, label] = t.match(FIGURE);
          return (
            <p key={i}>
              <b>{fig}</b>
              <span className="ax-meta">{label}</span>
            </p>
          );
        })}
      </div>
    );
  }
  if (chips && list.mark === "dot" && list.items.every((t) => t.length <= 40)) {
    return (
      <ul className="svc-chips">
        {list.items.map((t, i) => (
          <li key={i} className="ax-chip">
            {t}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className={`svc-list svc-list--${list.mark} ${size}`.trim()}>
      {list.items.map((t, i) => (
        <li key={i}>
          <span className="svc-list__mark" aria-hidden="true">
            {list.mark === "check" ? <Check size={14} strokeWidth={3} /> : null}
            {list.mark === "cross" ? <X size={14} strokeWidth={3} /> : null}
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
};

const Group = ({ g, size }) => (
  <div className="svc-group">
    {g.paras.map((p, i) => (
      <Para key={i} text={p} />
    ))}
    <List list={g.list} size={size} />
  </div>
);

// A group as a card: an icon tile for the kind of list, then the group.
const GroupCard = ({ g, i = 0, as: Tag = "div", className = "" }) => {
  const Icon = MARK_ICON[g.list.mark] || CircleDot;
  return (
    <Tag className={`ax-card ax-spot svc-gcard ${className}`.trim()} data-reveal style={{ "--i": i }}>
      <span className="ax-icon-tile" aria-hidden="true">
        <Icon />
      </span>
      <Group g={g} />
    </Tag>
  );
};

const Coda = ({ coda, className = "svc-coda" }) =>
  coda.length ? (
    <div className={className}>
      {coda.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  ) : null;

const ContactAction = ({ className = "svc-action" }) => (
  <div className={className}>
    <Link href="/contact" className="ax-btn">
      Book Free Consultation
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  </div>
);

const Eyebrow = ({ id }) =>
  EYEBROWS.has(id) ? (
    <p className="ax-eyebrow">
      <span>{EYEBROWS.get(id)}</span>
    </p>
  ) : null;

const Head = ({ section, line, center = false }) => (
  <div className={`ax-head ${center ? "ax-head--center" : ""}`.trim()} data-reveal>
    <Eyebrow id={section.id} />
    <h2 id={`${section.id}-title`} className="ax-h2">
      {section.title}
    </h2>
    {line ? <p className="ax-lead">{line}</p> : null}
  </div>
);

const SideHead = ({ section, children }) => (
  <div className="svc-split__head" data-reveal>
    <Eyebrow id={section.id} />
    <h2 id={`${section.id}-title`} className="ax-h2">
      {section.title}
    </h2>
    {children}
  </div>
);

/* ------------------------------------------------------------ compositions */
const Section = ({ section, band = false, extra = "", children }) => (
  <section
    id={section.id}
    aria-labelledby={`${section.id}-title`}
    className={`${band ? "ax-band" : "ax-section"} svc-sec ${extra}`.trim()}
  >
    <div className="ax-container">{children}</div>
  </section>
);

// Head on the left, held while the groups run on the right as cards.
const SplitComp = ({ section, g, action }) => (
  <Section section={section}>
    <div className="svc-split">
      <SideHead section={section} />
      <div className="svc-split__body">
        {g.groups.map((x, i) => (
          <GroupCard key={i} g={x} i={i} />
        ))}
        <Coda coda={g.coda} />
        {action}
      </div>
    </div>
  </Section>
);

// Paragraphs only: the head beside a panel, the first claim set large.
const LedeComp = ({ section, g, action }) => {
  const paras = g.coda;
  const lead = paras.findIndex((p) => !/:$/.test(p));
  return (
    <Section section={section}>
      <div className="svc-split">
        <SideHead section={section} />
        <div className="svc-split__body">
          <div className="ax-panel svc-lede" data-reveal>
            {paras.map((p, i) => (
              <p key={i} className={i === lead ? "svc-lede__claim" : /:$/.test(p) ? "svc-cap" : "svc-lede__p"}>
                {p}
              </p>
            ))}
          </div>
          {action}
        </div>
      </div>
    </Section>
  );
};

// Head on top, the groups as a bento of cards.
const ColumnsComp = ({ section, g, action }) => (
  <Section section={section}>
    <Head section={section} />
    <ul className="ax-bento svc-cards">
      {g.groups.map((x, i) => (
        <GroupCard key={i} as="li" g={x} i={i} className={span(i, g.groups.length)} />
      ))}
    </ul>
    <Coda coda={g.coda} className="svc-coda svc-coda--wide" />
    {action}
  </Section>
);

// The client story on a tinted band: each stage of the story as a card, the
// last (the outcome) lit, and the moral set large at the foot.
const CaseComp = ({ section, g, action }) => (
  <Section section={section} band extra="svc-case-sec">
    <Head section={section} />
    <ol className="ax-bento svc-case">
      {g.groups.map((x, i) => {
        const last = i === g.groups.length - 1 && g.groups.length > 1;
        return (
          <li
            key={i}
            className={`ax-card ax-spot svc-case__card ${last ? "svc-case__card--out" : ""} ${g.groups.length > 1 ? "svc-case__card--n" : ""} ${span(i, g.groups.length)}`.trim()}
            data-reveal
            style={{ "--i": i }}
          >
            {g.groups.length > 1 ? (
              <span className="svc-case__step ax-num" aria-hidden="true">
                {pad(i + 1)}
              </span>
            ) : null}
            {x.paras.length ? (
              <div className="svc-case__lead">
                {x.paras.map((p, j) => (
                  <p key={j} className={j === x.paras.length - 1 ? "svc-case__cap" : "svc-p"}>
                    {p}
                  </p>
                ))}
              </div>
            ) : null}
            <List list={x.list} />
          </li>
        );
      })}
    </ol>
    <Coda coda={g.coda} className="svc-moral" />
    {action}
  </Section>
);

// The framework: a numbered timeline, the head held on the left.
const StepsComp = ({ section, parsed, action }) => {
  const g = group(parsed.intro);
  const line = [...g.coda, ...g.groups.flatMap((x) => x.paras)].join(" ");
  return (
    <Section section={section} extra="svc-sec--l">
      <div className="svc-split svc-split--wide">
        <SideHead section={section}>{line ? <p className="ax-lead">{line}</p> : null}</SideHead>
        <div className="svc-split__body">
          <ol className="svc-steps">
            {parsed.steps.map((s, i) => {
              const sg = group(s.blocks);
              return (
                <li key={i} data-reveal style={{ "--i": i }}>
                  <span className="ax-icon-tile ax-icon-tile--solid svc-steps__num ax-num" aria-hidden="true">
                    {pad(s.n)}
                  </span>
                  <div className="ax-card ax-spot svc-steps__card">
                    <h3 className="ax-h3">{s.title}</h3>
                    <div className="svc-steps__body">
                      {sg.groups.map((x, j) => (
                        <div key={j} className="svc-group">
                          {x.paras.map((p, k) => (
                            <p key={k} className="svc-p">
                              {p}
                            </p>
                          ))}
                          <List list={x.list} chips />
                        </div>
                      ))}
                      {sg.coda.map((p, k) => (
                        <p key={k} className="svc-p">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          {action}
        </div>
      </div>
    </Section>
  );
};

// What no one tells you: the myths in a quiet card beside what holds in a lit one.
const VersusComp = ({ section, g, action }) => {
  const crosses = g.groups.filter((x) => x.list.mark === "cross");
  const rest = g.groups.filter((x) => x.list.mark !== "cross");
  return (
    <Section section={section}>
      <Head section={section} center />
      <div className="svc-versus">
        <div className="ax-card svc-versus__card svc-versus__card--myth" data-reveal style={{ "--i": 0 }}>
          <span className="ax-icon-tile" aria-hidden="true">
            <CircleX />
          </span>
          {crosses.map((x, i) => (
            <Group key={i} g={x} size="svc-list--big" />
          ))}
        </div>
        <div className="ax-card ax-spot svc-versus__card svc-versus__card--fact" data-reveal style={{ "--i": 1 }}>
          <span className="ax-icon-tile ax-icon-tile--solid" aria-hidden="true">
            <CircleCheck />
          </span>
          {rest.map((x, i) => (
            <Group key={i} g={x} size="svc-list--big" />
          ))}
        </div>
      </div>
      <Coda coda={g.coda} className="svc-coda svc-coda--wide svc-coda--center" />
      {action}
    </Section>
  );
};

// A short list of advice: a numbered card grid.
const GridComp = ({ section, g, action }) => {
  const items = g.groups[0].list.items;
  return (
    <Section section={section}>
      <Head section={section} />
      <ul className="ax-bento svc-tips">
        {items.map((t, i) => (
          <li key={i} className={`ax-card ax-spot svc-tips__card ${span(i, items.length)}`.trim()} data-reveal style={{ "--i": i }}>
            <span className="ax-icon-tile svc-tips__num ax-num" aria-hidden="true">
              {pad(i + 1)}
            </span>
            <p>{t}</p>
          </li>
        ))}
      </ul>
      {action}
    </Section>
  );
};

// The checks in a panel beside the head, then the closing sentence as the page's statement.
const StatementComp = ({ section, g, action }) => {
  const x = g.groups[0];
  return (
    <Section section={section} extra="svc-sec--l">
      <div className="svc-split svc-split--even">
        <SideHead section={section}>
          {x.paras.map((p, i) => (
            <p key={i} className="ax-lead">
              {p}
            </p>
          ))}
        </SideHead>
        <div className="ax-panel svc-checks" data-reveal style={{ "--i": 1 }}>
          <List list={x.list} size="svc-list--big" />
        </div>
      </div>
      <div className="svc-statement" data-reveal>
        <Sparkles size={28} aria-hidden="true" />
        {g.coda.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {action}
    </Section>
  );
};

// The CMS's own call to action, set as the closing ax-cta: the offers as chips,
// then the contact action.
const CloseComp = ({ section, g }) => {
  const first = g.groups[0];
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="ax-section svc-sec svc-close">
      <div className="ax-container">
        <div className="ax-cta" data-reveal>
          <Eyebrow id={section.id} />
          <h2 id={`${section.id}-title`} className="ax-cta__title">
            {gradTail(section.title)}
          </h2>
          {first?.paras.map((p, i) => (
            <p key={i} className="ax-lead">
              {p}
            </p>
          ))}
          {first ? (
            <ul className="svc-offers">
              {first.list.items.map((t, i) => (
                <li key={i}>
                  <Check size={16} strokeWidth={3} aria-hidden="true" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {g.groups.slice(1).map((x, i) => (
            <Group key={i} g={x} />
          ))}
          <Coda coda={g.coda} className="svc-close__coda" />
          <ContactAction className="ax-cta__actions" />
        </div>
      </div>
    </section>
  );
};

// Pages whose CMS record has no call to action still close on one.
const EndCta = () => (
  <section className="ax-section svc-close" aria-labelledby="svc-cta-title">
    <div className="ax-container">
      <div className="ax-cta" data-reveal>
        <p className="ax-eyebrow">
          <span>Next step</span>
        </p>
        <h2 id="svc-cta-title" className="ax-cta__title">
          Let’s talk about <span className="ax-grad">your project</span>
        </h2>
        <p className="ax-lead">Book a free consultation with the Aicyro team.</p>
        <ContactAction className="ax-cta__actions" />
      </div>
    </div>
  </section>
);

const COMPS = {
  split: SplitComp,
  lede: LedeComp,
  columns: ColumnsComp,
  case: CaseComp,
  steps: StepsComp,
  versus: VersusComp,
  grid: GridComp,
  statement: StatementComp,
  close: CloseComp,
};

const imgSrc = (h) => {
  const s = String(h || "").trim();
  if (!s) return "";
  return /^(https?:|data:|\/)/.test(s) ? s : `/${s}`;
};

/* ------------------------------------------------------------ the page body */
// title: the page's h1 words (accent: the phrase painted in the gradient);
// label: the service's short label, now the eyebrow; teaser: a lead magnet
// placed before the last section.
export const ServiceBody = ({ title, accent, label, serviceData, onJump, teaser = null }) => {
  const router = useRouter();
  const name = SERVICE_NAMES.get(router?.pathname) || label;
  const sections = Array.isArray(serviceData?.Sections)
    ? serviceData.Sections
    : Object.values(serviceData?.Sections || {});
  const run = plan(sections);
  const hasClose = run.some((r) => r.kind === "close");
  const picture = imgSrc(serviceData?.HeaderImage);

  return (
    <>
      <section className="ax-pagehero svc-hero" aria-labelledby="svc-title">
        <span className="ax-gridbg" aria-hidden="true" />
        <div className="ax-container svc-hero__grid">
          <div className="ax-pagehero__inner">
            <nav aria-label="Breadcrumb" className="ax-rise">
              <ul className="ax-crumbs">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/services">Services</Link>
                </li>
                {name ? <li aria-current="page">{name}</li> : null}
              </ul>
            </nav>
            {label ? (
              <p className="ax-eyebrow ax-rise" style={{ "--i": 1 }}>
                <span>{label}</span>
              </p>
            ) : null}
            <h1 id="svc-title" className="ax-h1--s ax-rise" style={{ "--i": 2 }}>
              {renderTitle(title, accent)}
            </h1>
            {serviceData["Meta Description"] ? (
              <p className="ax-lead ax-rise" style={{ "--i": 3 }}>
                {serviceData["Meta Description"]}
              </p>
            ) : null}
            <div className="ax-pagehero__actions ax-rise" style={{ "--i": 4 }}>
              <Link href="/contact" className="ax-btn">
                Book Free Consultation
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              {sections[0]?.id ? (
                <button type="button" className="ax-btn ax-btn--quiet" onClick={() => onJump(sections[0].id)}>
                  Start reading
                  <ArrowDownRight size={18} aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>

          {(picture || sections.length > 0) && (
            <div className="svc-hero__aside ax-rise" style={{ "--i": 3 }}>
              {picture ? (
                <figure className="ax-shot svc-hero__shot">
                  <img src={picture} alt="" width={1200} height={900} decoding="async" />
                </figure>
              ) : null}
              {sections.length > 0 && (
                <nav className="svc-toc" aria-labelledby="svc-contents">
                  <h2 id="svc-contents" className="svc-toc__title">
                    Contents
                  </h2>
                  <ol>
                    {sections.map((section, idx) => (
                      <li key={idx}>
                        <button type="button" onClick={() => onJump(section.id)}>
                          <span className="svc-toc__n ax-num" aria-hidden="true">
                            {pad(idx + 1)}
                          </span>
                          <span className="svc-toc__t">{section.title}</span>
                          <ArrowDownRight size={16} aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
            </div>
          )}
        </div>
      </section>

      {run.map((r, i) => {
        const Comp = COMPS[r.kind] || SplitComp;
        const last = i === run.length - 1;
        return (
          <React.Fragment key={r.section.id || i}>
            {teaser && last ? teaser : null}
            <Comp section={r.section} parsed={r.parsed} g={r.g} action={null} />
          </React.Fragment>
        );
      })}
      {teaser && run.length === 0 ? teaser : null}
      {!hasClose ? <EndCta /> : null}
    </>
  );
};

/* ------------------------------------------------------------ loading and error */
export const ServiceStatus = ({ state, message }) => (
  <>
    <Navbar />
    <main id="main">
      <section className="ax-pagehero svc-status" aria-busy={state === "loading"}>
        <span className="ax-gridbg" aria-hidden="true" />
        <div className="ax-container">
          {state === "loading" ? (
            <div className="svc-skel">
              <p role="status" className="svc-status__row">
                <span className="svc-spinner keep-motion" aria-hidden="true" />
                <span className="ax-meta">Loading…</span>
              </p>
              <div className="svc-skel__hero" aria-hidden="true">
                <span className="svc-skel__bar svc-skel__bar--s" />
                <span className="svc-skel__bar svc-skel__bar--h" />
                <span className="svc-skel__bar svc-skel__bar--h2" />
                <span className="svc-skel__bar" />
                <span className="svc-skel__bar svc-skel__bar--m" />
              </div>
              <div className="svc-skel__cards" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
          ) : (
            <div className="ax-panel svc-status__error">
              <span className="ax-icon-tile" aria-hidden="true">
                <CircleX />
              </span>
              <p role="alert" className="ax-lead text-danger">
                {message}
              </p>
              <div className="ax-pagehero__actions">
                <Link href="/services" className="ax-btn ax-btn--quiet">
                  All services
                </Link>
                <Link href="/contact" className="ax-btn">
                  Book Free Consultation
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default ServiceBody;
