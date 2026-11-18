// Hallmark redesign: the one case-study template the fifteen /portfolio/<slug>
// pages share. Each page still loads its own Protfolio/<key> record and keeps
// its own words (section heads, chart titles, loader line); this file only
// decides how a loaded record is shown.
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
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

/* ------------------------------------------------------------------ states */

export const CaseStudyLoading = ({ label }) => (
  <main id="main" className="pf-state" aria-busy="true">
    <span className="pf-spinner keep-motion" aria-hidden="true" />
    <p className="ax-meta" role="status">
      {tidyDots(label)}
    </p>
  </main>
);

export const CaseStudyError = ({ message }) => (
  <main id="main" className="pf-state">
    <p className="pf-state__error" role="alert">
      {message}
    </p>
    <Link href="/portfolio" className="ax-btn ax-btn--quiet">
      <ChevronLeft size={18} aria-hidden="true" />
      Back to Portfolio
    </Link>
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

const CaseStudyPager = ({ currentKey }) => {
  const [titles, setTitles] = useState({});

  useEffect(() => {
    const off = onValue(ref(database, "Protfolio"), (snapshot) => {
      if (!snapshot.exists()) return;
      const next = {};
      Object.entries(snapshot.val()).forEach(([key, p]) => {
        next[key] = shortTitle(p?.title || key);
      });
      setTitles(next);
    });
    return () => off && off();
  }, []);

  const i = CASE_STUDY_ROUTES.findIndex(([key]) => key === currentKey);
  if (i < 0) return null;
  const n = CASE_STUDY_ROUTES.length;
  const prev = CASE_STUDY_ROUTES[(i - 1 + n) % n];
  const next = CASE_STUDY_ROUTES[(i + 1) % n];

  return (
    <nav className="ax-section" aria-label="More case studies">
      <div className="ax-container">
        <div className="pf-pager">
          <Link href={prev[1]} className="pf-pager__link" rel="prev">
            <span className="ax-meta">
              <ChevronLeft size={16} aria-hidden="true" /> Previous case study
            </span>
            <b>{titles[prev[0]] || " "}</b>
          </Link>
          <Link href={next[1]} className="pf-pager__link pf-pager__link--next" rel="next">
            <span className="ax-meta">
              Next case study <ChevronRight size={16} aria-hidden="true" />
            </span>
            <b>{titles[next[0]] || " "}</b>
          </Link>
        </div>
        <p className="pf-pager__all">
          <Link href="/portfolio" className="ax-link">
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
  const details = data.details || {};

  const facts = [
    ["Location", metaValue("location") || details.country],
    ["Team size", metaValue("team size") || details.developers],
    ["Duration", metaValue("duration") || details.duration],
    ...meta
      .filter((m) => m && !["location", "team size", "duration"].includes((m.label || "").toLowerCase()))
      .map((m) => [m.label, m.value]),
    ["Category", tidyTag(data.tag || tagFallback)],
  ].filter(([, value]) => value);

  const image = data.imageUrl || data.imageSrc;
  const scope = Array.isArray(data.scope) ? data.scope : [];
  const deliverables = Array.isArray(data.deliverables) ? data.deliverables : [];
  const techStack = Array.isArray(data.techStack) ? data.techStack : [];

  return (
    <main id="main">
      {/* Banner: the title, its one line and the facts */}
      <header className="pf-banner">
        <div className="ax-container pf-banner__grid">
          <div className="pf-banner__copy">
            <nav aria-label="Breadcrumb" className="pf-crumbs">
              <ol>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/portfolio">Portfolio</Link>
                </li>
                <li aria-current="page">{crumb || shortTitle(data.title)}</li>
              </ol>
            </nav>
            <h1 className="ax-h1--s">{data.title}</h1>
            {data.description && <p className="ax-lead">{data.description}</p>}
            {isExternal(data.projectUrl) && (
              <p className="pf-banner__action">
                <a href={data.projectUrl} className="ax-btn ax-btn--quiet" target="_blank" rel="noopener noreferrer">
                  View the live project
                  <ExternalLink size={18} aria-hidden="true" />
                </a>
              </p>
            )}
          </div>
          {facts.length > 0 && (
            <dl className="pf-facts">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </header>

      {/* Showcase: the product screenshot at size */}
      {image && (
        <div className="pf-showcase">
          <div className="ax-container">
            <figure className="ax-shot pf-shot">
              <img src={image} alt={data.title} width="1920" height="1080" fetchPriority="high" decoding="async" />
            </figure>
          </div>
        </div>
      )}

      {/* Overview and scope: what was built, the head beside the prose, then the modules as a grid of titles */}
      {(data.overview || scope.length > 0) && (
        <section className="ax-section pf-overview-section" aria-labelledby={data.overview ? "cs-overview" : "cs-scope"}>
          <div className="ax-container">
            {data.overview && (
              <div className="pf-overview">
                <h2 id="cs-overview" className="ax-h2">
                  {heads.overview}
                </h2>
                <p className="pf-overview__text" data-reveal>
                  {data.overview}
                </p>
              </div>
            )}
            {scope.length > 0 && (
              <div className="pf-scope-block">
                <h2 id="cs-scope" className="ax-h2 pf-section-head">
                  {heads.scope}
                </h2>
                <ul className="pf-scope">
                  {scope.map((item, index) => (
                    <li key={index} data-reveal style={{ "--i": index }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Page-specific gallery */}
      {gallery && (
        <section className="ax-section pf-gallery-section" aria-labelledby={galleryHead ? "cs-gallery" : undefined} aria-label={galleryHead ? undefined : "Gallery"}>
          <div className="ax-container">
            {galleryHead && (
              <h2 id="cs-gallery" className="ax-h2 pf-section-head">
                {galleryHead}
              </h2>
            )}
            {gallery}
          </div>
        </section>
      )}

      {/* Metrics: the page's charts on a change of paper */}
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

      {/* Deliverables and the stack, side by side */}
      {(deliverables.length > 0 || techStack.length > 0) && (
        <section className="ax-section pf-lists-section">
          <div className="ax-container pf-lists">
            {deliverables.length > 0 && (
              <div className="pf-list">
                <h2 id="cs-deliverables" className="ax-h2">
                  {heads.deliverables}
                </h2>
                <ul className="pf-deliver">
                  {deliverables.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {techStack.length > 0 && (
              <div className="pf-list">
                <h2 id="cs-tech" className="ax-h2">
                  {heads.tech}
                </h2>
                <ul className="pf-stack">
                  {techStack.map((tech, index) => (
                    <li key={index}>{tech}</li>
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
// buttons. State and handlers stay in the page that owns them.
export const CaseStudyGallery = ({ images, active, onSelect, onHover, onPrev, onNext, label = "Gallery" }) => {
  const current = images[active] || images[0];
  if (!current) return null;
  return (
    <div className="pf-gallery">
      <figure className="ax-shot pf-shot">
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
              <img src={img.src} alt="" width="1920" height="1080" loading="lazy" decoding="async" />
              <span>{img.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CaseStudy;
