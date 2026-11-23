// Aurora redesign (was Hallmark): one template for the eight service pages.
// Each page still loads its own CMS record (Servicessubpages/<Name> in aicyroweb)
// and keeps its loading, error and scroll logic; this file only decides how the
// record shows: an Aurora banner with the service name, its line and the contents,
// then the CMS sections as a varied run of card compositions, ending on the
// contact action (the CMS's own call to action sets as the gradient CTA band).
import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowDown,
  BookOpen,
  Check,
  CircleCheck,
  CircleX,
  Layers3,
  Lightbulb,
  ListChecks,
  MessageSquare,
  Quote,
  Scale,
  Sparkles,
  Workflow,
  X,
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

/* ------------------------------------------------------------ layout helpers */
const pad = (n) => String(n).padStart(2, "0");

// Bento spans for n cards: rows of three, the last row filled (4 → 2 by 2, 7 → 4 then 3).
const spansFor = (n) => {
  if (n <= 1) return ["ax-span-12"];
  if (n === 2) return ["ax-span-6", "ax-span-6"];
  if (n === 4) return ["ax-span-6", "ax-span-6", "ax-span-6", "ax-span-6"];
  if (n === 7) return ["ax-span-3", "ax-span-3", "ax-span-3", "ax-span-3", "ax-span-4", "ax-span-4", "ax-span-4"];
  const out = Array.from({ length: n }, () => "ax-span-4");
  const rest = n % 3;
  if (rest === 1) out[n - 1] = "ax-span-12";
  if (rest === 2) {
    out[n - 1] = "ax-span-6";
    out[n - 2] = "ax-span-6";
  }
  return out;
};

const MARK_ICON = { dot: ListChecks, check: CircleCheck, cross: CircleX };

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
          {list.mark === "check" && (
            <span className="svc-list__mark" aria-hidden="true">
              <Check size={14} strokeWidth={3} aria-hidden="true" />
            </span>
          )}
          {list.mark === "cross" && (
            <span className="svc-list__mark" aria-hidden="true">
              <X size={14} strokeWidth={3} aria-hidden="true" />
            </span>
          )}
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
};

// One group as a card: an icon tile for its kind of list, its lead-in, the list.
const GroupCard = ({ g, size, className = "", index = 0, tint = false }) => {
  const Icon = MARK_ICON[g.list.mark] || ListChecks;
  return (
    <div
      className={`ax-card svc-group svc-group--card ${tint ? "ax-card--tint" : ""} ${className}`.trim()}
      data-reveal
      style={{ "--i": index }}
    >
      <span className={`ax-icon-tile ${tint ? "ax-icon-tile--solid" : ""}`.trim()} aria-hidden="true">
        <Icon aria-hidden="true" />
      </span>
      {g.paras.map((p, i) => (
        <Para key={i} text={p} />
      ))}
      <List list={g.list} size={size} />
    </div>
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

// The page-end contact action (pages whose CMS record has no call-to-action section):
// a compact gradient band that closes the page.
const ContactAction = () => (
  <div className="ax-cta svc-endcta" data-reveal>
    <p className="svc-close__eyebrow">
      <MessageSquare size={16} aria-hidden="true" />
      Get in touch
    </p>
    <div className="ax-cta__actions">
      <Link href="/contact" className="ax-btn ax-btn--light ax-btn--lg">
        Book Free Consultation
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </div>
  </div>
);

const Eyebrow = ({ icon: Icon, children }) => (
  <p className="ax-eyebrow">
    <Icon aria-hidden="true" />
    {children}
  </p>
);

const Head = ({ id, title, line, eyebrow = null, align = "" }) => (
  <div className={`ax-head ${align}`.trim()}>
    <div className="svc-head__lead">
      {eyebrow}
      <h2 id={`${id}-title`} className="ax-h2">
        {title}
      </h2>
    </div>
    {line ? <p className="ax-lead">{line}</p> : null}
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

// Head held on the left, the groups as cards on the right.
const SplitComp = ({ section, g, action }) => (
  <Section section={section}>
    <div className="svc-split">
      <div className="svc-split__head">
        <h2 id={`${section.id}-title`} className="ax-h2">
          {section.title}
        </h2>
      </div>
      <div className="svc-split__body">
        {g.groups.map((x, i) => (
          <GroupCard key={i} g={x} index={i} tint={i === 0 && g.groups.length > 1} />
        ))}
        <Coda coda={g.coda} className="svc-coda svc-coda--card" />
      </div>
    </div>
    {action}
  </Section>
);

// Paragraphs only: one tinted panel, the head beside the text, the first claim set larger.
const LedeComp = ({ section, g, action }) => {
  const paras = g.coda;
  const lead = paras.findIndex((p) => !/:$/.test(p));
  return (
    <Section section={section}>
      <div className="svc-lede" data-reveal>
        <div className="svc-lede__head">
          <span className="ax-icon-tile ax-icon-tile--solid" aria-hidden="true">
            <Sparkles aria-hidden="true" />
          </span>
          <h2 id={`${section.id}-title`} className="ax-h2">
            {section.title}
          </h2>
        </div>
        <div className="svc-lede__body">
          {paras.map((p, i) => (
            <p key={i} className={i === lead ? "svc-lede__claim" : /:$/.test(p) ? "svc-cap" : "svc-lede__p"}>
              {p}
            </p>
          ))}
        </div>
      </div>
      {action}
    </Section>
  );
};

// Head on top, the groups as a bento of cards.
const ColumnsComp = ({ section, g, action }) => {
  const spans = spansFor(g.groups.length);
  return (
    <Section section={section}>
      <Head id={section.id} title={section.title} />
      <div className="ax-bento svc-bento">
        {g.groups.map((x, i) => (
          <GroupCard key={i} g={x} index={i} className={spans[i]} tint={i === 0 && g.groups.length > 1} />
        ))}
      </div>
      <Coda coda={g.coda} className="svc-coda svc-coda--card svc-coda--wide" />
      {action}
    </Section>
  );
};

// The client story, on a band: each stage of the story as a numbered card,
// the moral set large on a tinted card at the foot.
const CaseComp = ({ section, g, action }) => (
  <Section section={section} band>
    <Head
      id={section.id}
      title={section.title}
      align="ax-head--center"
      eyebrow={<Eyebrow icon={BookOpen}>Case study</Eyebrow>}
    />
    <ol className="svc-case">
      {g.groups.map((x, i) => (
        <li key={i} className="ax-card svc-case__card" data-reveal style={{ "--i": i }}>
          <div className="svc-case__lead">
            <span className="svc-num" aria-hidden="true">
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
            size={`svc-list--tiles ${x.list.items.length % 3 === 0 ? "svc-list--3" : x.list.items.length % 2 === 0 ? "svc-list--2" : ""}`}
          />
        </li>
      ))}
    </ol>
    {g.coda.length ? (
      <div className="svc-moral" data-reveal>
        <Quote className="svc-moral__mark" aria-hidden="true" />
        <Coda coda={g.coda} className="svc-moral__text" />
      </div>
    ) : null}
    {action}
  </Section>
);

// The framework: numbered step cards in a bento, the head centred above.
const StepsComp = ({ section, parsed, action }) => {
  const g = group(parsed.intro);
  const line = [...g.coda, ...g.groups.flatMap((x) => x.paras)].join(" ");
  const spans = spansFor(parsed.steps.length);
  return (
    <Section section={section} extra="svc-sec--steps">
      <Head
        id={section.id}
        title={section.title}
        line={line}
        align="ax-head--center"
        eyebrow={<Eyebrow icon={Workflow}>Our framework</Eyebrow>}
      />
      <ol className="ax-bento svc-steps">
        {parsed.steps.map((s, i) => {
          const sg = group(s.blocks);
          return (
            <li key={i} className={`ax-card svc-step ${spans[i]}`} data-reveal style={{ "--i": i }}>
              <span className={`svc-step__no ${i === 0 ? "svc-step__no--solid" : ""}`.trim()} aria-hidden="true">
                {pad(i + 1)}
              </span>
              <h3 className="ax-h3">{s.title}</h3>
              <div className="svc-step__body">
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
            </li>
          );
        })}
      </ol>
      {action}
    </Section>
  );
};

// What no one tells you: the myths on a quiet card beside what holds on a tinted one.
const VersusComp = ({ section, g, action }) => {
  const crosses = g.groups.filter((x) => x.list.mark === "cross");
  const rest = g.groups.filter((x) => x.list.mark !== "cross");
  return (
    <Section section={section}>
      <Head id={section.id} title={section.title} eyebrow={<Eyebrow icon={Scale}>Reality check</Eyebrow>} />
      <div className="svc-versus">
        <div className="ax-card svc-versus__card svc-versus__card--no" data-reveal>
          <span className="svc-versus__tile" aria-hidden="true">
            <CircleX aria-hidden="true" />
          </span>
          {crosses.map((x, i) => (
            <div key={i} className="svc-group">
              {x.paras.map((p, k) => (
                <Para key={k} text={p} />
              ))}
              <List list={x.list} size="svc-list--big" />
            </div>
          ))}
        </div>
        <div className="ax-card ax-card--tint svc-versus__card" data-reveal style={{ "--i": 1 }}>
          <span className="ax-icon-tile ax-icon-tile--solid" aria-hidden="true">
            <CircleCheck aria-hidden="true" />
          </span>
          {rest.map((x, i) => (
            <div key={i} className="svc-group">
              {x.paras.map((p, k) => (
                <Para key={k} text={p} />
              ))}
              <List list={x.list} size="svc-list--big" />
            </div>
          ))}
        </div>
      </div>
      <Coda coda={g.coda} className="svc-coda svc-coda--card svc-coda--wide" />
      {action}
    </Section>
  );
};

// A short list of advice: numbered icon cards across a bento.
const GridComp = ({ section, g, action }) => {
  const items = g.groups[0].list.items;
  const spans = spansFor(items.length);
  return (
    <Section section={section} band>
      <Head
        id={section.id}
        title={section.title}
        align="ax-head--center"
        eyebrow={<Eyebrow icon={Lightbulb}>Takeaways</Eyebrow>}
      />
      <ul className="ax-bento svc-grid">
        {items.map((t, i) => (
          <li key={i} className={`ax-card ax-card--hover svc-grid__card ${spans[i]}`} data-reveal style={{ "--i": i }}>
            <span className="ax-icon-tile" aria-hidden="true">
              <Lightbulb aria-hidden="true" />
            </span>
            <span className="svc-grid__no" aria-hidden="true">
              {pad(i + 1)}
            </span>
            <p className="svc-grid__text">{t}</p>
          </li>
        ))}
      </ul>
      {action}
    </Section>
  );
};

// The checks on a card beside the head; the closing sentence as the page's statement.
// When this is the page's last section it carries the contact action, so the
// statement and the action close the page together on the gradient band.
const StatementComp = ({ section, g, action }) => {
  const x = g.groups[0];
  return (
    <Section section={section} extra="svc-sec--statement">
      <div className="svc-split svc-split--even">
        <div className="svc-split__head">
          <h2 id={`${section.id}-title`} className="ax-h2">
            {section.title}
          </h2>
          {x.paras.map((p, i) => (
            <p key={i} className="ax-lead">
              {p}
            </p>
          ))}
        </div>
        <div className="ax-card svc-statement__card" data-reveal>
          <List list={x.list} size="svc-list--big" />
        </div>
      </div>
      {action ? (
        <div className="ax-cta svc-statement svc-statement--cta" data-reveal>
          {g.coda.map((p, i) => (
            <p key={i} className="svc-statement__text">
              {p}
            </p>
          ))}
          <div className="ax-cta__actions">
            <Link href="/contact" className="ax-btn ax-btn--light">
              Book Free Consultation
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="svc-statement" data-reveal>
          {g.coda.map((p, i) => (
            <p key={i} className="svc-statement__text">
              {p}
            </p>
          ))}
        </div>
      )}
    </Section>
  );
};

// The CMS's own call to action: the gradient CTA band with the offers and the contact action.
const CloseComp = ({ section, g }) => {
  const first = g.groups[0];
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="ax-section svc-sec svc-close">
      <div className="ax-container">
        <div className="ax-cta" data-reveal>
          <p className="svc-close__eyebrow">
            <MessageSquare size={16} aria-hidden="true" />
            Get in touch
          </p>
          <h2 id={`${section.id}-title`} className="ax-h2">
            {section.title}
          </h2>
          {first?.paras.map((p, i) => (
            <p key={i} className="ax-lead">
              {p}
            </p>
          ))}
          {first ? <List list={first.list} size="svc-list--offers" /> : null}
          {g.groups.slice(1).map((x, i) => (
            <div key={i} className="svc-group">
              {x.paras.map((p, k) => (
                <Para key={k} text={p} />
              ))}
              <List list={x.list} size="svc-list--offers" />
            </div>
          ))}
          <Coda coda={g.coda} className="svc-close__coda" />
          <div className="ax-cta__actions">
            <Link href="/contact" className="ax-btn ax-btn--light">
              Book Free Consultation
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
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
// title: the page's h1 words; label: the service's short name, set as the banner's
// eyebrow; teaser: a lead magnet placed before the last section.
export const ServiceBody = ({ title, label, serviceData, onJump, teaser = null }) => {
  const sections = Array.isArray(serviceData?.Sections)
    ? serviceData.Sections
    : Object.values(serviceData?.Sections || {});
  const run = plan(sections);
  const hasClose = run.some((r) => r.kind === "close");

  return (
    <>
      <section className="ax-banner ax-aurora svc-banner" aria-labelledby="svc-title">
        <div className="ax-container">
          {label ? (
            <p className="ax-eyebrow">
              <Layers3 aria-hidden="true" />
              {label}
            </p>
          ) : null}
          <h1 id="svc-title" className="ax-h1--s">
            {Array.isArray(title) ? title.map((t, i) => <span key={i} className="svc-banner__line">{t}</span>) : title}
          </h1>
          <p className="ax-lead">{serviceData["Meta Description"]}</p>
          <div className="ax-banner__actions">
            <Link href="/contact" className="ax-btn">
              Book Free Consultation
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>

          {sections.length > 0 && (
            <nav className="svc-toc ax-glass" aria-labelledby="svc-contents">
              <h2 id="svc-contents" className="svc-toc__title">
                Contents
              </h2>
              <ol>
                {sections.map((section, idx) => (
                  <li key={idx}>
                    <button type="button" onClick={() => onJump(section.id)}>
                      <span className="svc-toc__no" aria-hidden="true">
                        {pad(idx + 1)}
                      </span>
                      <span className="svc-toc__label">{section.title}</span>
                      <ArrowDown size={16} aria-hidden="true" />
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
            {teaser && last ? teaser : null}
            <Comp section={r.section} parsed={r.parsed} g={r.g} action={action} />
          </React.Fragment>
        );
      })}
      {teaser && run.length === 0 ? teaser : null}
    </>
  );
};

/* ------------------------------------------------------------ loading and error */
export const ServiceStatus = ({ state, message }) => (
  <>
    <Navbar />
    <main id="main">
      <section className="ax-banner ax-aurora svc-status" aria-busy={state === "loading"}>
        <div className="ax-container">
          {state === "loading" ? (
            <p role="status" className="ax-card svc-status__card">
              <span className="svc-spinner keep-motion" aria-hidden="true" />
              <span className="ax-meta">Loading…</span>
            </p>
          ) : (
            <p role="alert" className="ax-card svc-status__card svc-status__card--error">
              <span className="ax-lead text-danger">{message}</span>
            </p>
          )}
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default ServiceBody;
