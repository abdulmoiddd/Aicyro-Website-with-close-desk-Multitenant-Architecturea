// Obsidian: the one case-study template the fifteen /portfolio/<slug> pages share.
// Each page still loads its own Protfolio/<key> record and keeps its own words
// (section heads, chart titles, loader line); this file only decides how a loaded
// record is shown: an ambient banner with the title, discipline chips and the facts set
// as large figures, the product shot in a frame, numbered editorial sections (overview,
// scope cards, gallery, deliverables and stack), then the next project and the close.
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
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
import { shortTitle, tidyTag, pad2, splitFigure, trackGlow } from "./utils";

export { shortTitle, tidyTag };

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

// "…" for the loader lines that were written with three dots.
const tidyDots = (text = "") => text.replace(/\.\.\.$/, "…");

/* ------------------------------------------------------------------ states */

export const CaseStudyLoading = ({ label }) => (
  <main id="main" className="pf-state ob-ambient" aria-busy="true">
    <span className="pf-spinner keep-motion" aria-hidden="true" />
    <p className="ax-meta pf-state__label" role="status">
      {tidyDots(label)}
    </p>
  </main>
);

export const CaseStudyError = ({ message }) => (
  <main id="main" className="pf-state ob-ambient">
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

// Previous and next: the next project as a large card over its own screenshot,
// the previous one beside it, then the way back to the index.
const CaseStudyPager = ({ currentKey }) => {
  const [titles, setTitles] = useState({});
  const [images, setImages] = useState({});

  useEffect(() => {
    const off = onValue(ref(database, "Protfolio"), (snapshot) => {
      if (!snapshot.exists()) return;
      const next = {};
      const pics = {};
      Object.entries(snapshot.val()).forEach(([key, p]) => {
        next[key] = shortTitle(p?.title || key);
        pics[key] = p?.imageUrl || p?.imageSrc || "";
      });
      setTitles(next);
      setImages(pics);
    });
    return () => off && off();
  }, []);

  const i = CASE_STUDY_ROUTES.findIndex(([key]) => key === currentKey);
  if (i < 0) return null;
  const n = CASE_STUDY_ROUTES.length;
  const prev = CASE_STUDY_ROUTES[(i - 1 + n) % n];
  const next = CASE_STUDY_ROUTES[(i + 1) % n];
  const nextImage = images[next[0]];

  return (
    <nav className="pf-sec pf-next" aria-label="More case studies">
      <div className="ax-container" onPointerMove={trackGlow}>
        <div className="pf-pager">
          <Link href={prev[1]} className="pf-pager__link pf-pager__link--prev ob-card" rel="prev" data-reveal>
            <span className="pf-pager__label">
              <ChevronLeft size={16} aria-hidden="true" /> Previous case study
            </span>
            <b className="pf-pager__title">{titles[prev[0]] || " "}</b>
            <span className="pf-pager__num" aria-hidden="true">
              {pad2(((i - 1 + n) % n) + 1)}
            </span>
          </Link>
          <Link
            href={next[1]}
            className="pf-pager__link pf-pager__link--next ob-card"
            rel="next"
            data-reveal
            style={{ "--i": 1 }}
          >
            {nextImage ? (
              <img
                className="pf-pager__img"
                src={nextImage}
                alt=""
                width="1920"
                height="1080"
                loading="lazy"
                decoding="async"
                data-drop-on-fail=""
              />
            ) : null}
            <span className="pf-pager__label">
              Next case study <ChevronRight size={16} aria-hidden="true" />
            </span>
            <b className="pf-pager__title">{titles[next[0]] || " "}</b>
            <span className="pf-pager__go" aria-hidden="true">
              <ArrowUpRight size={24} />
            </span>
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

// A fact value set as a figure: the leading number large, the unit small beside it.
const Figure = ({ value }) => {
  const f = splitFigure(value);
  if (f.text !== undefined) return <span className="pf-fig__text">{f.text}</span>;
  return (
    <>
      <span className="pf-fig__num">{f.num}</span>
      {f.gap}
      <span className="pf-fig__unit">{f.unit}</span>
    </>
  );
};

// Numbered mono eyebrows ("01 / Overview"), counted in render order.
const makeCounter = () => {
  let n = 0;
  return (label) => {
    n += 1;
    return `${pad2(n)} / ${label}`;
  };
};

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

  // The category leads the discipline chips; the rest of the record is set as figures.
  const category = facts.find(([label]) => label === "Category")?.[1];
  const figures = facts.filter(([label]) => label !== "Category");

  const image = data.imageUrl || data.imageSrc;
  const scope = Array.isArray(data.scope) ? data.scope : [];
  const deliverables = Array.isArray(data.deliverables) ? data.deliverables : [];
  const techStack = Array.isArray(data.techStack) ? data.techStack : [];
  const disciplines = [category, ...techStack.slice(0, 3)].filter(Boolean);

  // Challenge, solution and result, when the record carries them.
  const story = [
    ["Challenge", data.problem || details.problem],
    ["Solution", data.solution || details.solution],
    ["Result", data.result || data.results || details.result],
  ].filter(([, value]) => value);

  const label = makeCounter();
  const position = CASE_STUDY_ROUTES.findIndex(([key]) => key === projectKey);

  return (
    <main id="main" className="pf-case">
      {/* Banner: breadcrumb, the title, its disciplines, its one line, then the facts as figures */}
      <header className="ob-banner ob-ambient pf-case-hero">
        <div className="ax-container pf-case-hero__inner">
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

          <div className="pf-case-hero__head">
            <p className="ob-eyebrow" data-reveal>
              {position >= 0 ? `Case study / ${pad2(position + 1)}` : "Case study"}
            </p>
            <h1 className="ob-banner__title pf-case-hero__title" data-reveal style={{ "--i": 1 }}>
              {data.title}
            </h1>
          </div>

          <div className="pf-case-hero__intro" data-reveal style={{ "--i": 2 }}>
            {disciplines.length > 0 && (
              <ul className="pf-chips" aria-label="Disciplines">
                {disciplines.map((d, index) => (
                  <li key={`${d}-${index}`} className={index === 0 && category ? "ax-chip pf-chip--accent" : "ax-chip"}>
                    {d}
                  </li>
                ))}
              </ul>
            )}
            {data.description && <p className="ob-banner__lead">{data.description}</p>}
            {isExternal(data.projectUrl) && (
              <div className="ob-banner__actions">
                <a href={data.projectUrl} className="ax-btn" target="_blank" rel="noopener noreferrer">
                  View the live project
                  <ExternalLink size={18} aria-hidden="true" />
                </a>
              </div>
            )}
          </div>

          {figures.length > 0 && (
            <dl className="pf-figures" data-count={figures.length}>
              {figures.map(([name, value], index) => (
                <div key={name} className="pf-fig" data-reveal style={{ "--i": index + 2 }}>
                  <dt>{name}</dt>
                  <dd>
                    <Figure value={value} />
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </header>

      {/* Showcase: the product screenshot in a frame */}
      {image && (
        <div className="pf-showcase">
          <div className="ax-container">
            <figure className="ax-shot pf-frame" data-reveal>
              <div className="pf-frame__bar" aria-hidden="true">
                <i />
                <i />
                <i />
                <span>{shortTitle(data.title)}</span>
              </div>
              <img src={image} alt={data.title} width="1920" height="1080" fetchPriority="high" decoding="async" />
            </figure>
          </div>
        </div>
      )}

      {/* Overview: the head held beside the prose; challenge, solution and result when present */}
      {(data.overview || story.length > 0) && (
        <section className="pf-sec" aria-labelledby={data.overview ? "cs-overview" : undefined} aria-label={data.overview ? undefined : "Overview"}>
          <div className="ax-container">
            {data.overview && (
              <div className="pf-overview">
                <div className="pf-overview__head">
                  <p className="ob-eyebrow">{label("Overview")}</p>
                  <h2 id="cs-overview" className="ax-h2">
                    {heads.overview}
                  </h2>
                </div>
                <p className="pf-overview__text" data-reveal>
                  {data.overview}
                </p>
              </div>
            )}
            {story.length > 0 && (
              <dl className="pf-story">
                {story.map(([name, value], index) => (
                  <div
                    key={name}
                    className={name === "Result" ? "pf-story__item pf-story__item--result" : "pf-story__item"}
                    data-reveal
                    style={{ "--i": index }}
                  >
                    <dt>
                      <span aria-hidden="true">{pad2(index + 1)}</span> {name}
                    </dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>
      )}

      {/* Scope: the modules as numbered glass cards */}
      {scope.length > 0 && (
        <section className="pf-sec pf-sec--ruled" aria-labelledby="cs-scope">
          <div className="ax-container">
            <div className="pf-head">
              <p className="ob-eyebrow">{label("Scope")}</p>
              <h2 id="cs-scope" className="ax-h2">
                {heads.scope}
              </h2>
            </div>
            <ul className="pf-scope" onPointerMove={trackGlow}>
              {scope.map((item, index) => (
                <li key={index} data-reveal style={{ "--i": index % 3 }}>
                  <div className="pf-scope__card ob-card">
                    <span className="pf-scope__num" aria-hidden="true">
                      {pad2(index + 1)}
                    </span>
                    <span className="pf-scope__text">{item}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Page-specific gallery */}
      {gallery && (
        <section
          className="pf-sec pf-sec--ruled pf-gallery-section"
          aria-labelledby={galleryHead ? "cs-gallery" : undefined}
          aria-label={galleryHead ? undefined : "Gallery"}
        >
          <div className="ax-container">
            <div className="pf-head">
              <p className="ob-eyebrow">{label("Gallery")}</p>
              {galleryHead && (
                <h2 id="cs-gallery" className="ax-h2">
                  {galleryHead}
                </h2>
              )}
            </div>
            {gallery}
          </div>
        </section>
      )}

      {/* Metrics: the page's charts on a change of paper */}
      {SHOW_ILLUSTRATIVE_METRICS && charts.length > 0 && (
        <section className="ax-band" aria-labelledby="cs-metrics">
          <div className="ax-container">
            <div className="pf-head">
              <h2 id="cs-metrics" className="ax-h2">
                {heads.metrics}
              </h2>
            </div>
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
        <section className="pf-sec pf-sec--ruled pf-lists-section">
          <div className="ax-container pf-lists">
            {deliverables.length > 0 && (
              <div className="pf-list">
                <div className="pf-head pf-head--tight">
                  <p className="ob-eyebrow">{label("Delivered")}</p>
                  <h2 id="cs-deliverables" className="ax-h2">
                    {heads.deliverables}
                  </h2>
                </div>
                <ol className="pf-deliver">
                  {deliverables.map((item, index) => (
                    <li key={index} data-reveal style={{ "--i": index }}>
                      <span className="pf-deliver__num" aria-hidden="true">
                        {pad2(index + 1)}
                      </span>
                      <span className="pf-deliver__text">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {techStack.length > 0 && (
              <div className="pf-list pf-list--stack" data-reveal style={{ "--i": 1 }}>
                <div className="pf-head pf-head--tight">
                  <p className="ob-eyebrow">{label("Stack")}</p>
                  <h2 id="cs-tech" className="ax-h2">
                    {heads.tech}
                  </h2>
                </div>
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

// A switcher over a page's gallery: the chosen picture large in a frame, the rest as
// buttons. State and handlers stay in the page that owns them.
export const CaseStudyGallery = ({ images, active, onSelect, onHover, onPrev, onNext, label = "Gallery" }) => {
  const current = images[active] || images[0];
  if (!current) return null;
  return (
    <div className="pf-gallery">
      <figure className="ax-shot pf-frame pf-gallery__main">
        <div className="pf-frame__bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>{current.label}</span>
        </div>
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
            <span className="ax-meta ax-num pf-gallery__count">
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
              <span className="pf-thumb__pic">
                <img src={img.src} alt="" width="1920" height="1080" loading="lazy" decoding="async" data-drop-on-fail="" />
              </span>
              <span className="pf-thumb__label">
                <span className="pf-thumb__num" aria-hidden="true">
                  {pad2(index + 1)}
                </span>
                {img.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CaseStudy;
