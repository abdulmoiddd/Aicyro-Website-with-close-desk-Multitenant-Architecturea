// Redesign v3 (Aurora Studio): the one case-study template the fifteen /portfolio/<slug>
// pages share. Each page still loads its own Protfolio/<key> record and keeps
// its own words (section heads, chart titles, loader line); this file only
// decides how a loaded record is shown: page hero, framed picture with the facts,
// overview split, scope bento, gallery, deliverables and stack, previous and next, CTA.
// Pictures are hotlinked from a slow host; a failed frame is hidden by _app.jsx and
// every section still reads without it.
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  Brain,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock,
  Cpu,
  Database,
  ExternalLink,
  Eye,
  HeartPulse,
  MapPin,
  Mic,
  Moon,
  Network,
  ScanFace,
  Search,
  Sparkles,
  Target,
  TriangleAlert,
  Users,
  Video,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  BarChart,
  ComposedChart,
  RadarChart,
  Area,
  Bar,
  Line,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import PortfolioCTA from "./PortfolioCTA";

// CMS key -> route, in the CMS id order (01 to 15); drives previous and next.
export const CASE_STUDY_ROUTES = [
  ["body-language-ai", "/portfolio/bodylanguage"],
  ["sales-ai-automation", "/portfolio/saleautomation"],
  ["ai-tutor", "/portfolio/aitutor"],
  ["robotics-control", "/portfolio/robotics"],
  ["auto-scholar", "/portfolio/autoscholor"],
  ["health-analyzer", "/portfolio/healthanalyser"],
  ["kaira", "/portfolio/kaira"],
  ["nyctourism", "/portfolio/nyctourism"],
  ["Shady", "/portfolio/shady"],
  ["JBB", "/portfolio/jbb"],
  ["Politico", "/portfolio/politico"],
  ["Cove", "/portfolio/cove"],
  ["HPL", "/portfolio/hpl"],
  ["GO", "/portfolio/go"],
  ["ZIPZAP", "/portfolio/zipzap"],
];

// "Kaira - AI Financial Wellness Coach" -> "Kaira"
export const shortTitle = (title = "") => title.split(/\s[-:]\s|:\s/)[0].trim() || title;

// An all-caps CMS tag ("EXPERT SERVICES") is shown in sentence case (gate 67).
export const tidyTag = (tag) =>
  tag && tag === tag.toUpperCase() && /[A-Z]{2}/.test(tag)
    ? tag.charAt(0) + tag.slice(1).toLowerCase()
    : tag;

// "…" for the loader lines that were written with three dots.
const tidyDots = (text = "") => text.replace(/\.\.\.$/, "…");

// The title in two parts, so one phrase can carry the brand gradient; joined they
// are the CMS title, character for character.
// "Kaira - AI Financial Wellness Coach" -> ["Kaira - ", "AI Financial Wellness Coach"]
// "Personalized AI Tutor" -> ["Personalized ", "AI Tutor"]
const splitTitle = (title = "") => {
  const m = title.match(/^(.+?)(\s[-:]\s|:\s)(.+)$/);
  if (m) return [m[1] + m[2], m[3]];
  const words = title.split(" ");
  if (words.length < 3) return ["", title];
  return [words.slice(0, -2).join(" ") + " ", words.slice(-2).join(" ")];
};

// The CMS meta icons (Protfolio/<key>/meta[].icon) as lucide icons
const META_ICONS = {
  map: MapPin,
  clock: Clock,
  users: Users,
  brain: Brain,
  book: BookOpen,
  target: Target,
  search: Search,
  network: Network,
  scan: ScanFace,
  video: Video,
  mic: Mic,
  heart: HeartPulse,
  moon: Moon,
  bot: Bot,
  cpu: Cpu,
  eye: Eye,
  zap: Zap,
  db: Database,
};
const FACT_ICONS = { Location: MapPin, "Team size": Users, Duration: Clock };

// Bento spans for the scope cards on the 6-column grid: cycles of six
// (wide + one, one + wide, half + half); the last partial cycle always fills.
const scopeSpan = (i, n) => {
  const PATTERN = ["is-wide", "", "", "is-wide", "is-half", "is-half"];
  const whole = Math.floor(n / 6) * 6;
  if (i < whole) return PATTERN[i % 6];
  const r = n - whole;
  const j = i - whole;
  if (r === 1) return "is-full";
  if (r === 2) return "is-half";
  if (r === 3) return "";
  if (r === 4) return PATTERN[j];
  return j < 4 ? PATTERN[j] : "is-full";
};

/* ------------------------------------------------------------------ states */

export const CaseStudyLoading = ({ label }) => (
  <main id="main" className="pf-state" aria-busy="true">
    <div className="ax-container pf-state__inner">
      <div className="pf-state__card ax-panel">
        <span className="pf-spinner keep-motion" aria-hidden="true" />
        <p className="ax-meta" role="status">
          {tidyDots(label)}
        </p>
      </div>
      <div className="pf-state__ghost" aria-hidden="true">
        <span className="pf-skel pf-skel--line" />
        <span className="pf-skel pf-skel--title" />
        <span className="pf-skel pf-skel--shot" />
      </div>
    </div>
  </main>
);

export const CaseStudyError = ({ message }) => (
  <main id="main" className="pf-state">
    <div className="ax-container pf-state__inner">
      <div className="pf-state__card ax-panel">
        <span className="ax-icon-tile" aria-hidden="true">
          <TriangleAlert />
        </span>
        <p className="pf-state__error" role="alert">
          {message}
        </p>
        <Link href="/portfolio" className="ax-btn ax-btn--quiet">
          <ChevronLeft size={18} aria-hidden="true" />
          Back to Portfolio
        </Link>
      </div>
    </div>
  </main>
);

/* ------------------------------------------------------------------ charts */

const TONES = {
  accent: { stroke: "var(--color-accent)", fill: "var(--color-accent)", area: 0.16 },
  soft: { stroke: "var(--color-accent)", fill: "var(--color-accent)", area: 0.06 },
  quiet: { stroke: "var(--color-ink-2)", fill: "var(--color-muted)", area: 0.1 },
  success: { stroke: "var(--color-success)", fill: "var(--color-success)", area: 0.12 },
  danger: { stroke: "var(--color-danger)", fill: "var(--color-danger)", area: 0.12 },
};

const TICK = { fill: "var(--color-ink-2)", fontSize: 13 };
const GRID = "var(--color-rule)";
const TOOLTIP = {
  contentStyle: {
    background: "var(--color-paper)",
    border: "1px solid var(--color-rule)",
    borderRadius: 8,
    color: "var(--color-ink)",
    fontSize: 14,
  },
  itemStyle: { color: "var(--color-ink)" },
  labelStyle: { color: "var(--color-ink-2)" },
};
const LEGEND = { verticalAlign: "top", height: 36, iconSize: 10, wrapperStyle: { fontSize: 14 } };

const barCells = (chart, s) => {
  if (chart.highlight === undefined) return null;
  return chart.data.map((_, i) =>
    chart.highlight === "ramp" ? (
      <Cell key={`cell-${i}`} fill={TONES.accent.fill} fillOpacity={(chart.rampBase ?? 0.6) + i * (chart.rampStep || 0.1)} />
    ) : (
      <Cell key={`cell-${i}`} fill={i === chart.highlight ? TONES.accent.fill : TONES.quiet.fill} />
    ),
  );
};

const renderSeries = (chart) =>
  chart.series.map((s) => {
    const tone = TONES[s.tone || "accent"];
    const mark = s.mark || (chart.kind === "bar" ? "bar" : "area");
    if (mark === "line")
      return (
        <Line
          key={s.key}
          type="monotone"
          dataKey={s.key}
          name={s.name}
          stroke={tone.stroke}
          strokeWidth={2}
          dot={{ r: 3, fill: tone.stroke }}
          isAnimationActive={false}
        />
      );
    if (mark === "bar")
      return (
        <Bar
          key={s.key}
          dataKey={s.key}
          name={s.name}
          fill={tone.fill}
          barSize={s.barSize}
          radius={chart.layout === "vertical" ? [0, 4, 4, 0] : [4, 4, 0, 0]}
          isAnimationActive={false}
        >
          {barCells(chart, s)}
        </Bar>
      );
    return (
      <Area
        key={s.key}
        type="monotone"
        dataKey={s.key}
        name={s.name}
        stackId={s.stackId}
        stroke={tone.stroke}
        fill={tone.fill}
        fillOpacity={tone.area}
        strokeWidth={2}
        isAnimationActive={false}
      />
    );
  });

const ChartPlot = ({ chart, width, height }) => {
  if (chart.kind === "radar") {
    const s = chart.series[0];
    return (
      <RadarChart width={width} height={height} cx="50%" cy="50%" outerRadius="70%" data={chart.data}>
        <PolarGrid stroke={GRID} />
        <PolarAngleAxis dataKey={chart.x} tick={TICK} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Tooltip {...TOOLTIP} />
        <Radar
          name={s.name}
          dataKey={s.key}
          stroke={TONES.accent.stroke}
          fill={TONES.accent.fill}
          fillOpacity={0.25}
          isAnimationActive={false}
        />
      </RadarChart>
    );
  }

  const Chart = chart.kind === "bar" ? BarChart : chart.kind === "composed" ? ComposedChart : AreaChart;
  const horizontal = chart.layout === "vertical";

  return (
    <Chart width={width} height={height} data={chart.data} layout={horizontal ? "vertical" : "horizontal"} barGap={chart.barGap} margin={{ top: 8, right: 8, bottom: chart.xLabel ? 16 : 0, left: 0 }}>
      {!horizontal && <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />}
      {horizontal ? (
        <>
          <XAxis type="number" hide />
          <YAxis dataKey={chart.x} type="category" width={chart.yWidth || 96} tick={TICK} axisLine={false} tickLine={false} />
        </>
      ) : (
        <>
          <XAxis
            dataKey={chart.x}
            tick={TICK}
            axisLine={false}
            tickLine={false}
            interval={chart.xAngle ? 0 : "preserveEnd"}
            angle={chart.xAngle || 0}
            textAnchor={chart.xAngle ? "end" : "middle"}
            height={chart.xAngle ? 56 : 30}
            label={chart.xLabel ? { value: chart.xLabel, position: "insideBottom", offset: -12, fill: "var(--color-ink-2)", fontSize: 13 } : undefined}
          />
          <YAxis hide />
        </>
      )}
      <Tooltip {...TOOLTIP} cursor={chart.kind === "bar" ? { fill: "var(--color-paper-2)" } : { stroke: GRID }} />
      {chart.legend && <Legend {...LEGEND} />}
      {renderSeries(chart)}
    </Chart>
  );
};

// The plot's own size, measured here (ResponsiveContainer sometimes kept its
// first, tiny measurement while the dev stylesheet was still arriving).
const usePlotSize = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const read = () => setSize({ width: Math.floor(el.clientWidth), height: Math.floor(el.clientHeight) });
    read();
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size];
};

export const ChartFigure = ({ chart }) => {
  const [plotRef, size] = usePlotSize();
  return (
  <figure className="pf-chart">
    <figcaption className="pf-chart__cap">
      <h3 className="ax-h3">{chart.title}</h3>
      {chart.note && <p className="ax-meta">{chart.note}</p>}
    </figcaption>
    <div className="pf-chart__plot" ref={plotRef}>
      {size.width > 0 && size.height > 0 && <ChartPlot chart={chart} width={size.width} height={size.height} />}
    </div>
    {chart.figure && (
      <p className="pf-chart__figure">
        <b>{chart.figure.value}</b>
        <span>{chart.figure.label}</span>
      </p>
    )}
  </figure>
  );
};

/* ------------------------------------------------------------------ pager */

const PagerCard = ({ entry, dir, cards, titles }) => {
  const info = cards[entry[0]] || {};
  const isNext = dir === "next";
  return (
    <Link
      href={entry[1]}
      className={`ax-card ax-spot pf-pager__card${isNext ? " pf-pager__card--next" : ""}`}
      rel={dir}
    >
      {info.image && (
        <figure className="ax-shot pf-pager__shot">
          <img src={info.image} alt="" width="1920" height="1080" loading="lazy" decoding="async" />
        </figure>
      )}
      <span className="pf-pager__body">
        <span className="ax-meta pf-pager__dir">
          {isNext ? (
            <>
              Next case study <ChevronRight size={16} aria-hidden="true" />
            </>
          ) : (
            <>
              <ChevronLeft size={16} aria-hidden="true" /> Previous case study
            </>
          )}
        </span>
        <b className="pf-pager__title">{titles[entry[0]] || " "}</b>
        {info.tag && <span className="ax-chip pf-pager__tag">{info.tag}</span>}
      </span>
    </Link>
  );
};


const CaseStudyPager = ({ currentKey }) => {
  const [titles, setTitles] = useState({});
  const [cards, setCards] = useState({});

  useEffect(() => {
    const off = onValue(ref(database, "Protfolio"), (snapshot) => {
      if (!snapshot.exists()) return;
      const next = {};
      const more = {};
      Object.entries(snapshot.val()).forEach(([key, p]) => {
        next[key] = shortTitle(p?.title || key);
        more[key] = { image: p?.imageSrc || p?.imageUrl || "", tag: tidyTag(p?.tag) || "" };
      });
      setTitles(next);
      setCards(more);
    });
    return () => off && off();
  }, []);

  const i = CASE_STUDY_ROUTES.findIndex(([key]) => key === currentKey);
  if (i < 0) return null;
  const n = CASE_STUDY_ROUTES.length;
  const prev = CASE_STUDY_ROUTES[(i - 1 + n) % n];
  const next = CASE_STUDY_ROUTES[(i + 1) % n];

  return (
    <nav className="ax-section pf-pager-section" aria-label="More case studies">
      <div className="ax-container">
        <div className="pf-pager">
          <PagerCard entry={prev} dir="prev" cards={cards} titles={titles} />
          <PagerCard entry={next} dir="next" cards={cards} titles={titles} />
        </div>
        <p className="pf-pager__all">
          <Link href="/portfolio" className="ax-link">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Portfolio
          </Link>
        </p>
      </div>
    </nav>
  );
};

/* ------------------------------------------------------------------ page */

const isExternal = (url) => typeof url === "string" && /^https?:\/\//.test(url);

/**
 * The case-study page body.
 * heads: the page's own section heads { overview, scope, metrics, tech, deliverables }
 * charts: [chart specs] for the page's metrics section
 * gallery: an optional node (CaseStudyGallery) shown after the overview
 */
// Hallmark 46a: the charts and their figures are sample data (each page labels its
// chart data "MOCK DATA FOR CHARTS"), so they are not shown as results. Set this to
// true only once every page's chart data is replaced with the project's real figures.
const SHOW_ILLUSTRATIVE_METRICS = false;

const CaseStudy = ({ projectKey, data, crumb, tagFallback, heads, charts = [], gallery, galleryHead }) => {
  const meta = Array.isArray(data.meta) ? data.meta : [];
  const metaValue = (label) => meta.find((m) => (m?.label || "").toLowerCase() === label)?.value;
  const metaIcon = (label) => META_ICONS[meta.find((m) => m?.label === label)?.icon];
  const details = data.details || {};

  // The record's facts; the category is the eyebrow above the title
  const facts = [
    ["Location", metaValue("location") || details.country],
    ["Team size", metaValue("team size") || details.developers],
    ["Duration", metaValue("duration") || details.duration],
    ...meta
      .filter((m) => m && !["location", "team size", "duration"].includes((m.label || "").toLowerCase()))
      .map((m) => [m.label, m.value]),
  ].filter(([, value]) => value);
  const category = tidyTag(data.tag || tagFallback);

  const image = data.imageUrl || data.imageSrc;
  const scope = Array.isArray(data.scope) ? data.scope : [];
  const deliverables = Array.isArray(data.deliverables) ? data.deliverables : [];
  const techStack = Array.isArray(data.techStack) ? data.techStack : [];
  const [titleHead, titleGrad] = splitTitle(data.title || "");

  return (
    <main id="main">
      {/* Page hero: breadcrumbs, the category, the title and its one line */}
      <section className="ax-pagehero pf-cs-hero" aria-labelledby="cs-title">
        <span className="ax-gridbg" aria-hidden="true" />
        <div className="ax-container ax-pagehero__inner">
          <nav aria-label="Breadcrumb" className="ax-rise" style={{ "--i": 0 }}>
            <ul className="ax-crumbs">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/portfolio">Portfolio</Link>
              </li>
              <li aria-current="page">{crumb || shortTitle(data.title)}</li>
            </ul>
          </nav>
          {category && (
            <p className="ax-eyebrow ax-rise" style={{ "--i": 1 }}>
              <span>{category}</span>
            </p>
          )}
          <h1 id="cs-title" className="ax-h1--s pf-cs-title ax-rise" style={{ "--i": 2 }}>
            {titleHead}
            <span className="ax-grad">{titleGrad}</span>
          </h1>
          {data.description && (
            <p className="ax-lead ax-rise" style={{ "--i": 3 }}>
              {data.description}
            </p>
          )}
          <div className="ax-pagehero__actions ax-rise" style={{ "--i": 4 }}>
            {isExternal(data.projectUrl) && (
              <a href={data.projectUrl} className="ax-btn" target="_blank" rel="noopener noreferrer">
                View the live project
                <ExternalLink size={18} aria-hidden="true" />
              </a>
            )}
            <Link href="/portfolio" className="ax-btn ax-btn--quiet">
              <ArrowLeft size={18} aria-hidden="true" />
              Back to Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* The product picture in a glass frame, then the record's facts as a card row */}
      {(image || facts.length > 0) && (
        <section className="pf-stage-section" aria-label="Project at a glance">
          <div className="ax-container">
            {image && (
              <div className="pf-stage ax-rise" style={{ "--i": 5 }}>
                <div className="pf-stage__frame">
                  <div className="pf-stage__bar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <span>{shortTitle(data.title)}</span>
                  </div>
                  <figure className="ax-shot pf-stage__shot">
                    <img src={image} alt={data.title} width="1920" height="1080" fetchPriority="high" decoding="async" />
                  </figure>
                </div>
              </div>
            )}
            {facts.length > 0 && (
              <dl className="pf-facts" style={{ "--n": Math.min(facts.length, 4) }}>
                {facts.map(([label, value], index) => {
                  const Icon = FACT_ICONS[label] || metaIcon(label) || Sparkles;
                  return (
                    <div key={label} className="pf-fact" data-reveal style={{ "--i": index }}>
                      <span className="ax-icon-tile pf-fact__icon" aria-hidden="true">
                        <Icon />
                      </span>
                      <span className="pf-fact__text">
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </span>
                    </div>
                  );
                })}
              </dl>
            )}
          </div>
        </section>
      )}

      {/* Overview: the page's head beside the record's overview */}
      {data.overview && (
        <section className="ax-section pf-overview-section" aria-labelledby="cs-overview">
          <div className="ax-container ax-split pf-overview">
            <div className="pf-overview__head">
              <p className="ax-eyebrow">
                <span>Overview</span>
              </p>
              <h2 id="cs-overview" className="ax-h2">
                {heads.overview}
              </h2>
            </div>
            <div className="ax-panel pf-overview__panel" data-reveal>
              <p className="pf-overview__text">{data.overview}</p>
            </div>
          </div>
        </section>
      )}

      {/* Scope: the modules as a bento of numbered cards */}
      {scope.length > 0 && (
        <section className="ax-section pf-scope-section" aria-labelledby="cs-scope">
          <div className="ax-container">
            <div className="ax-head ax-head--center">
              <p className="ax-eyebrow">
                <span>Scope</span>
              </p>
              <h2 id="cs-scope" className="ax-h2">
                {heads.scope}
              </h2>
            </div>
            <ul className="ax-bento pf-scope">
              {scope.map((item, index) => (
                <li key={index} className={`ax-card ax-spot pf-scope__card ${scopeSpan(index, scope.length)}`} data-reveal style={{ "--i": index % 3 }}>
                  <span className="pf-scope__num ax-num" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="ax-h3 pf-scope__title">{item}</h3>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Page-specific gallery */}
      {gallery && (
        <section className="ax-section pf-gallery-section" aria-labelledby={galleryHead ? "cs-gallery" : undefined} aria-label={galleryHead ? undefined : "Gallery"}>
          <div className="ax-container">
            {galleryHead && (
              <div className="ax-head">
                <p className="ax-eyebrow">
                  <span>Gallery</span>
                </p>
                <h2 id="cs-gallery" className="ax-h2">
                  {galleryHead}
                </h2>
              </div>
            )}
            {gallery}
          </div>
        </section>
      )}

      {/* Metrics: the page's charts on a band */}
      {SHOW_ILLUSTRATIVE_METRICS && charts.length > 0 && (
        <section className="ax-band" aria-labelledby="cs-metrics">
          <div className="ax-container">
            <h2 id="cs-metrics" className="ax-h2 pf-section-head">
              {heads.metrics}
            </h2>
            <div className="pf-charts">
              {charts.map((chart) => (
                <ChartFigure key={chart.title} chart={chart} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Deliverables and the stack, side by side on a band */}
      {(deliverables.length > 0 || techStack.length > 0) && (
        <section className="ax-band pf-lists-section">
          <div className={`ax-container pf-lists${deliverables.length > 0 && techStack.length > 0 ? "" : " pf-lists--one"}`}>
            {deliverables.length > 0 && (
              <div className="ax-panel pf-list" data-reveal style={{ "--i": 0 }}>
                <h2 id="cs-deliverables" className="ax-h3 pf-list__title">
                  {heads.deliverables}
                </h2>
                <ul className="pf-deliver">
                  {deliverables.map((item, index) => (
                    <li key={index}>
                      <CircleCheck size={20} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {techStack.length > 0 && (
              <div className="ax-panel pf-list" data-reveal style={{ "--i": 1 }}>
                <h2 id="cs-tech" className="ax-h3 pf-list__title">
                  {heads.tech}
                </h2>
                <ul className="pf-stack">
                  {techStack.map((tech, index) => (
                    <li key={index} className="ax-chip">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <CaseStudyPager currentKey={projectKey} />

      <PortfolioCTA />
    </main>
  );
};

/* ------------------------------------------------------------------ gallery */

// A switcher over a page's gallery: the chosen picture large, the rest as
// buttons. State and handlers stay in the page that owns them. A thumbnail whose
// picture fails keeps its label; the large frame drops out and the caption stays.
export const CaseStudyGallery = ({ images, active, onSelect, onHover, onPrev, onNext, label = "Gallery" }) => {
  const current = images[active] || images[0];
  if (!current) return null;
  return (
    <div className="pf-gallery">
      <div className="pf-gallery__stage">
        <figure key={current.src} className="ax-shot pf-gallery__shot">
          <img src={current.src} alt={current.label} width="1920" height="1080" loading="lazy" decoding="async" />
        </figure>
        <div className="pf-gallery__bar">
          <p className="pf-gallery__cap" aria-live="polite">
            <b>{current.label}</b>
            {current.desc && <span>{current.desc}</span>}
          </p>
          {onPrev && onNext && (
            <div className="pf-gallery__steps">
              <button type="button" className="ax-icon-btn" onClick={onPrev} aria-label="Previous image">
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <span className="ax-meta ax-num">
                {active + 1} of {images.length}
              </span>
              <button type="button" className="ax-icon-btn" onClick={onNext} aria-label="Next image">
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
      <ul className="pf-gallery__thumbs" aria-label={label}>
        {images.map((img, index) => (
          <li key={index}>
            <button
              type="button"
              className="pf-thumb"
              aria-pressed={index === active}
              onClick={() => onSelect(index)}
              onMouseEnter={onHover ? () => onHover(index) : undefined}
            >
              <span className="pf-thumb__frame">
                <img src={img.src} alt="" width="1920" height="1080" loading="lazy" decoding="async" data-drop-on-fail="" />
              </span>
              <span className="pf-thumb__label">{img.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CaseStudy;
