import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock, MapPin } from "lucide-react";

// Aurora redesign: one project in the portfolio bento. The whole card is the
// link to the case study; the screenshot sits in a frame on top (or beside the
// words on the lead card) and drops away if it fails, leaving a complete text card.

// An all-caps CMS tag ("EXPERT SERVICES") is shown in sentence case.
const tidyTag = (tag) =>
  tag && tag === tag.toUpperCase() && /[A-Z]{2}/.test(tag) ? tag.charAt(0) + tag.slice(1).toLowerCase() : tag;

const CaseStudyCard = ({
  title,
  problem,
  imageSrc,
  client,
  solution,
  result,
  projectUrl,
  place,
  duration,
  category,
  lead = false,
  wide = false,
  index = 0,
}) => {
  const safeProjectUrl = projectUrl
    ? projectUrl.startsWith("http") || projectUrl.startsWith("/")
      ? projectUrl
      : `/${projectUrl}`
    : "#";

  const tag = tidyTag(category);

  return (
    <Link
      href={safeProjectUrl}
      className={`ax-card ax-card--flush pf-card${lead ? " pf-card--lead" : ""}${wide ? " pf-card--wide" : ""}`}
      data-reveal
      style={{ "--i": lead ? 0 : index % 3 }}
    >
      {imageSrc && (
        <figure className="ax-shot pf-card__shot">
          <img
            src={imageSrc}
            alt=""
            width="1920"
            height="1080"
            loading={lead ? "eager" : "lazy"}
            fetchPriority={lead ? "high" : undefined}
            decoding="async"
          />
        </figure>
      )}

      <div className="ax-card__body pf-card__body">
        <div className="pf-card__top">
          {tag ? <span className="ax-chip ax-chip--accent">{tag}</span> : <span />}
          <span className="pf-card__go" aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </div>

        <h3 className={lead ? "ax-h2 pf-card__title pf-card__title--lead" : "ax-h3 pf-card__title"}>{title}</h3>

        {problem && (
          <p className="ax-body pf-card__text">
            <b>The challenge.</b> {problem}
          </p>
        )}

        {(solution || result || place || duration || client) && (
          <dl className="pf-card__facts">
            {solution && (
              <div className="pf-fact pf-fact--wide">
                <dt>Solution</dt>
                <dd>{solution}</dd>
              </div>
            )}
            {result && (
              <div className="pf-fact pf-fact--wide">
                <dt>Result</dt>
                <dd>{result}</dd>
              </div>
            )}
            {client && (
              <div className="pf-fact">
                <dt>Client</dt>
                <dd>{client}</dd>
              </div>
            )}
            {place && (
              <div className="pf-fact">
                <dt>
                  <MapPin size={14} aria-hidden="true" />
                  Location
                </dt>
                <dd>{place}</dd>
              </div>
            )}
            {duration && (
              <div className="pf-fact">
                <dt>
                  <Clock size={14} aria-hidden="true" />
                  Duration
                </dt>
                <dd>{duration}</dd>
              </div>
            )}
          </dl>
        )}

        <span className="ax-card__foot pf-card__more">
          View Case Study
          <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
};

export default CaseStudyCard;
