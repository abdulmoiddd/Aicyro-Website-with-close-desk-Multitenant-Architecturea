// Obsidian redesign: one template for the eight service pages.
// Each page still loads its own CMS record (Servicessubpages/<Name> in aicyroweb)
// and keeps its loading, error and scroll logic; this file only decides how the
// record shows: an ambient hero with the service name, its line and the contents
// card, then the CMS sections as a varied run of compositions (glass cards, rails,
// hairline rows), ending on the contact action.
import React from "react";
import Link from "next/link";
import { Check, X, ArrowRight, ArrowDownRight } from "lucide-react";
import Navbar from "../Essntials/Navbar";
import Footer from "../Essntials/footer";
import { trackGlow, pad } from "./glow";

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

/* ------------------------------------------------------------ small parts */
const Para = ({ text, className = "" }) => (
  <p className={`${/:$/.test(text) ? "svc-cap" : "svc-p"} ${className}`.trim()}>{text}</p>
);

// Check and cross marks sit in a small round badge; bullets become an accent tick.
const Mark = ({ mark }) => {
  if (mark === "check")
    return (
      <span className="svc-tick" aria-hidden="true">
        <Check size={14} strokeWidth={2.5} />
      </span>
    );
  if (mark === "cross")
    return (
      <span className="svc-tick svc-tick--x" aria-hidden="true">
        <X size={14} strokeWidth={2.5} />
      </span>
    );
  return null;
};

const List = ({ list, size = "", chips = false }) => {
  if (asFigures(list)) {
    // The wrapper is a size container: in a narrow card the figures stack as rows.
    return (
      <div className="svc-figures-wrap">
        <div className="svc-figures" style={{ "--cols": list.items.length }}>
          {list.items.map((t, i) => {
            const [, fig, label] = t.match(FIGURE);
            return (
              <p key={i}>
                <b>{fig}</b>
                <span>{label}</span>
              </p>
            );
          })}
        </div>
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
          <Mark mark={list.mark} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
};

const Group = ({ g, size, className = "svc-group" }) => (
  <div className={className}>
    {g.paras.map((p, i) => (
      <Para key={i} text={p} />
    ))}
    <List list={g.list} size={size} />
  </div>
);

const Coda = ({ coda, className = "svc-coda" }) =>
  coda.length ? (
    <div className={className}>
      {coda.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  ) : null;

const ContactAction = () => (
  <div className="svc-action">
    <Link href="/contact" className="ax-btn">
      Book Free Consultation
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  </div>
);

// The section's place in the page as a mono counter ("03 / 08"), the homepage's eyebrow.
const Eyebrow = ({ n, total }) =>
  n ? (
    <p className="ob-eyebrow" aria-hidden="true">
      {pad(n)} / {pad(total)}
    </p>
  ) : null;

const Head = ({ id, title, line, n, total }) => (
  <div className="ob-head svc-head" data-reveal>
    <Eyebrow n={n} total={total} />
    <h2 id={`${id}-title`} className="ax-h2">
      {title}
    </h2>
    {line ? <p className="ax-lead">{line}</p> : null}
  </div>
);

// The held head of the side-by-side compositions.
const SideHead = ({ section, n, total, children }) => (
  <div className="svc-split__head" data-reveal>
    <Eyebrow n={n} total={total} />
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
    className={`svc-sec ${band ? "svc-sec--band" : ""} ${extra}`.replace(/\s+/g, " ").trim()}
  >
    <div className="ax-container">{children}</div>
  </section>
);

// Head on the left, held while the groups run on the right between hairlines.
const SplitComp = ({ section, g, action, n, total }) => (
  <Section section={section}>
    <div className="svc-split">
      <SideHead section={section} n={n} total={total} />
      <div className="svc-split__body">
        {g.groups.map((x, i) => (
          <div key={i} data-reveal style={{ "--i": i }}>
            <Group g={x} />
          </div>
        ))}
        <Coda coda={g.coda} />
        {action}
      </div>
    </div>
  </Section>
);

// Paragraphs only: the head beside the text, the first claim set large.
const LedeComp = ({ section, g, action, n, total }) => {
  const paras = g.coda;
  const lead = paras.findIndex((p) => !/:$/.test(p));
  return (
    <Section section={section}>
      <div className="svc-split">
        <SideHead section={section} n={n} total={total} />
        <div className="svc-split__body svc-lede" data-reveal style={{ "--i": 1 }}>
          {paras.map((p, i) => (
            <p key={i} className={i === lead ? "svc-lede__claim" : /:$/.test(p) ? "svc-cap" : "svc-lede__p"}>
              {p}
            </p>
          ))}
          {action}
        </div>
      </div>
    </Section>
  );
};

// Head on top, the groups side by side as glass cards, each with its index.
const ColumnsComp = ({ section, g, action, n, total }) => (
  <Section section={section}>
    <Head id={section.id} title={section.title} n={n} total={total} />
    <div className="svc-cols" style={{ "--n": Math.min(Math.max(g.groups.length, 1), 3) }}>
      {g.groups.map((x, i) => (
        <div key={i} className="ob-card svc-col" data-reveal style={{ "--i": i }}>
          <span className="svc-col__num" aria-hidden="true">
            {pad(i + 1)}
          </span>
          <Group g={x} />
        </div>
      ))}
    </div>
    <Coda coda={g.coda} className="svc-coda svc-coda--wide" />
    {action}
  </Section>
);

// The client story on the band: each stage of the story as a glass row (the caption
// beside its list), the moral set large at the foot.
const CaseComp = ({ section, g, action, n, total }) => (
  <Section section={section} band>
    <Head id={section.id} title={section.title} n={n} total={total} />
    <ol className="svc-case">
      {g.groups.map((x, i) => (
        <li key={i} className="ob-card svc-case__row" data-reveal style={{ "--i": i }}>
          <div className="svc-case__lead">
            <span className="svc-case__num" aria-hidden="true">
              {pad(i + 1)}
            </span>
            {x.paras.length
              ? x.paras.map((p, j) => (
                  <p key={j} className={j === x.paras.length - 1 ? "svc-case__cap" : "svc-p"}>
                    {p}
                  </p>
                ))
              : null}
          </div>
          <List
            list={x.list}
            size={
              x.list.items.length % 3 === 0
                ? "svc-list--cols svc-list--3"
                : x.list.items.length % 2 === 0
                  ? "svc-list--cols"
                  : ""
            }
          />
        </li>
      ))}
    </ol>
    <Coda coda={g.coda} className="svc-moral" />
    {action}
  </Section>
);

// The framework: a real ordered list on a vertical rail, the head held on the left.
const StepsComp = ({ section, parsed, action, n, total }) => {
  const g = group(parsed.intro);
  const line = [...g.coda, ...g.groups.flatMap((x) => x.paras)].join(" ");
  return (
    <Section section={section} extra="svc-sec--steps">
      <div className="svc-split svc-split--wide">
        <SideHead section={section} n={n} total={total}>
          {line ? <p className="ax-lead">{line}</p> : null}
        </SideHead>
        <div className="svc-split__body">
          <ol className="svc-steps">
            {parsed.steps.map((s, i) => {
              const sg = group(s.blocks);
              return (
                <li key={i} className="svc-step" data-reveal style={{ "--i": i }}>
                  <span className="svc-step__num" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  <div className="ob-card svc-step__card">
                    <h3 className="svc-step__title">{s.title}</h3>
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

// What no one tells you: the myths (dimmed, crossed) beside what holds (lit, checked).
const VersusComp = ({ section, g, action, n, total }) => {
  const crosses = g.groups.filter((x) => x.list.mark === "cross");
  const rest = g.groups.filter((x) => x.list.mark !== "cross");
  return (
    <Section section={section}>
      <Head id={section.id} title={section.title} n={n} total={total} />
      <div className="svc-versus">
        <div className="ob-card svc-versus__side svc-versus__side--myth" data-reveal>
          {crosses.map((x, i) => (
            <Group key={i} g={x} size="svc-list--big" />
          ))}
        </div>
        <div className="ob-card svc-versus__side svc-versus__side--truth" data-reveal style={{ "--i": 1 }}>
          {rest.map((x, i) => (
            <Group key={i} g={x} size="svc-list--big" />
          ))}
        </div>
      </div>
      <Coda coda={g.coda} className="svc-coda svc-coda--wide" />
      {action}
    </Section>
  );
};

// A short list of advice: a bento of tiles across the width, each with its index.
// Up to five run in one row; longer lists wrap in rows of three or four.
const tileCols = (count) => (count <= 5 ? count : count % 3 === 0 ? 3 : 4);

const GridComp = ({ section, g, action, n, total }) => (
  <Section section={section}>
    <Head id={section.id} title={section.title} n={n} total={total} />
    <ul className="svc-tiles" style={{ "--cols": tileCols(g.groups[0].list.items.length) }}>
      {g.groups[0].list.items.map((t, i) => (
        <li key={i} className="ob-card svc-tile" data-reveal style={{ "--i": i }}>
          <span className="svc-tile__num" aria-hidden="true">
            {pad(i + 1)}
          </span>
          <span className="svc-tile__text">{t}</span>
        </li>
      ))}
    </ul>
    {action}
  </Section>
);

// The checks beside the head, then the closing sentence as the page's one statement.
const StatementComp = ({ section, g, action, n, total }) => {
  const x = g.groups[0];
  return (
    <Section section={section} extra="svc-sec--statement">
      <div className="svc-split svc-split--even">
        <SideHead section={section} n={n} total={total}>
          {x.paras.map((p, i) => (
            <p key={i} className="ax-lead">
              {p}
            </p>
          ))}
        </SideHead>
        <div className="ob-card svc-statement__card" data-reveal style={{ "--i": 1 }}>
          <List list={x.list} size="svc-list--big" />
        </div>
      </div>
      <div className="svc-statement" data-reveal>
        {g.coda.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {action}
    </Section>
  );
};

// The CMS's own call to action: one large glass panel over the ambient glow and grid
// floor, the offers beside the head, then the contact action.
const CloseComp = ({ section, g, n, total }) => {
  const first = g.groups[0];
  return (
    <Section section={section} extra="svc-close ob-ambient">
      <div className="ob-card svc-close__panel" data-reveal>
        <div className="svc-close__head">
          <Eyebrow n={n} total={total} />
          <h2 id={`${section.id}-title`} className="ax-h2 svc-close__title">
            {section.title}
          </h2>
          {first?.paras.map((p, i) => (
            <p key={i} className="ax-lead">
              {p}
            </p>
          ))}
        </div>
        <div className="svc-close__body">
          {first ? <List list={first.list} size="svc-list--big" /> : null}
          {g.groups.slice(1).map((x, i) => (
            <Group key={i} g={x} />
          ))}
          <Coda coda={g.coda} className="svc-close__coda" />
          <ContactAction />
        </div>
      </div>
    </Section>
  );
};

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

/* ------------------------------------------------------------ the page body */
// title: the page's h1 words; label: the service's short name, now the hero's eyebrow;
// teaser: a lead magnet placed before the close, framed as a glass panel.
export const ServiceBody = ({ title, label, serviceData, onJump, teaser = null }) => {
  const sections = Array.isArray(serviceData?.Sections)
    ? serviceData.Sections
    : Object.values(serviceData?.Sections || {});
  const run = plan(sections);
  const hasClose = run.some((r) => r.kind === "close");
  const total = run.length;

  return (
    <div className="svc-page" onPointerMove={trackGlow}>
      <section className="ob-banner ob-ambient svc-hero svc-hero--detail" aria-labelledby="svc-title">
        <div className="ax-container svc-hero__grid">
          <div className="ob-banner__inner">
            {label ? (
              <p className="ob-eyebrow" data-reveal>
                {label}
              </p>
            ) : null}
            <h1 id="svc-title" className="ob-banner__title svc-hero__title" data-reveal style={{ "--i": 1 }}>
              {Array.isArray(title)
                ? title.map((t, i) => (
                    <span key={i} className="svc-hero__line">
                      {t}
                    </span>
                  ))
                : title}
            </h1>
            <p className="ob-banner__lead" data-reveal style={{ "--i": 2 }}>
              {serviceData["Meta Description"]}
            </p>
            <div className="ob-banner__actions" data-reveal style={{ "--i": 3 }}>
              <Link href="/contact" className="ax-btn">
                Book Free Consultation
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
          {sections.length > 0 && (
            <nav className="ob-card svc-toc" aria-labelledby="svc-contents" data-reveal style={{ "--i": 3 }}>
              <div className="svc-toc__head">
                <h2 id="svc-contents" className="svc-toc__title">
                  Contents
                </h2>
                <span className="svc-toc__count" aria-hidden="true">
                  {pad(sections.length)}
                </span>
              </div>
              <ol>
                {sections.map((section, idx) => (
                  <li key={idx}>
                    <button type="button" onClick={() => onJump(section.id)}>
                      <span className="svc-toc__n" aria-hidden="true">
                        {pad(idx + 1)}
                      </span>
                      <span className="svc-toc__t">{section.title}</span>
                      <ArrowDownRight size={16} aria-hidden="true" className="svc-toc__arrow" />
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </div>
      </section>

      {run.map((r, i) => {
        const Comp = COMPS[r.kind] || SplitComp;
        const last = i === run.length - 1;
        const action = last && !hasClose ? <ContactAction /> : null;
        return (
          <React.Fragment key={r.section.id || i}>
            {teaser && last ? <div className="svc-teaser">{teaser}</div> : null}
            <Comp section={r.section} parsed={r.parsed} g={r.g} action={action} n={i + 1} total={total} />
          </React.Fragment>
        );
      })}
      {teaser && run.length === 0 ? <div className="svc-teaser">{teaser}</div> : null}
    </div>
  );
};

/* ------------------------------------------------------------ loading and error */
export const ServiceStatus = ({ state, message }) => (
  <>
    <Navbar />
    <main id="main">
      <section className="ob-banner ob-ambient svc-hero svc-status" aria-busy={state === "loading"}>
        <div className="ax-container">
          {state === "loading" ? (
            <div className="svc-status__wrap">
              <p role="status" className="svc-status__row">
                <span className="svc-spinner keep-motion" aria-hidden="true" />
                <span className="svc-status__label">Loading…</span>
              </p>
              <div className="svc-skel" aria-hidden="true">
                <span className="svc-skel__bar svc-skel__bar--eyebrow" />
                <span className="svc-skel__bar svc-skel__bar--title" />
                <span className="svc-skel__bar svc-skel__bar--title svc-skel__bar--short" />
                <span className="svc-skel__bar svc-skel__bar--lead" />
                <span className="svc-skel__bar svc-skel__bar--lead svc-skel__bar--short" />
              </div>
            </div>
          ) : (
            <div className="ob-card svc-status__error">
              <span className="svc-tick svc-tick--x svc-tick--l" aria-hidden="true">
                <X size={18} strokeWidth={2.5} />
              </span>
              <p role="alert" className="ax-lead text-danger">
                {message}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default ServiceBody;
