import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";

// Redesign v3 (Aurora Studio): one project in the /portfolio bento. The whole card is
// the link to the case study (hover lift + pointer spotlight). The picture is hotlinked
// from a slow host: when it fails, _app.jsx hides the frame and the card reads as type.
// `wide` lays the picture beside the words on large screens; `tag` is the CMS category.
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
  tag,
  lead = false,
  wide = false,
  index = 0,
}) => {
  const safeProjectUrl = projectUrl
    ? projectUrl.startsWith("http") || projectUrl.startsWith("/")
      ? projectUrl
      : `/${projectUrl}`
    : "#";

  return (
    <Link
      href={safeProjectUrl}
      className={`ax-card ax-spot pf-card${wide ? " pf-card--wide" : ""}`}
      data-reveal
      style={{ "--i": index % 3 }}
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

      <div className="pf-card__body">
        {tag && <span className="ax-chip pf-card__tag">{tag}</span>}

        <h3 className={wide ? "pf-card__title pf-card__title--wide" : "pf-card__title"}>{title}</h3>

        {problem && (
          <p className="pf-card__text">
            <b>The challenge.</b> {problem}
          </p>
        )}

        {(solution || result || client) && (
          <dl className="pf-card__facts">
            {solution && (
              <div>
                <dt>Solution</dt>
                <dd>{solution}</dd>
              </div>
            )}
            {result && (
              <div>
                <dt>Result</dt>
                <dd>{result}</dd>
              </div>
            )}
            {client && (
              <div>
                <dt>Client</dt>
                <dd>{client}</dd>
              </div>
            )}
          </dl>
        )}

        <div className="pf-card__foot">
          {(place || duration) && (
            <dl className="pf-card__meta">
              {place && (
                <div>
                  <dt className="pf-sr">Location</dt>
                  <dd>
                    <MapPin size={15} aria-hidden="true" />
                    {place}
                  </dd>
                </div>
              )}
              {duration && (
                <div>
                  <dt className="pf-sr">Duration</dt>
                  <dd>
                    <Clock size={15} aria-hidden="true" />
                    {duration}
                  </dd>
                </div>
              )}
            </dl>
          )}
          <span className="pf-card__more">
            View Case Study
            <ArrowRight size={16} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CaseStudyCard;
