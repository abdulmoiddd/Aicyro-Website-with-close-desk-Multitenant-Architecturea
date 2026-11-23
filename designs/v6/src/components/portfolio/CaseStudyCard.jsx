import React from "react";
import Link from "next/link";

// Hallmark redesign: one project in the portfolio grid. The whole card is the
// link to the case study; the screenshot is shown at size, never zoomed.
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
  lead = false,
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
      className={`pf-card${lead ? " pf-card--lead" : ""}`}
      data-reveal
      style={{ "--i": lead ? 0 : index % 2 }}
    >
      {imageSrc && (
        <figure className="ax-shot pf-shot">
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
        <h3 className={lead ? "pf-card__title pf-card__title--lead" : "pf-card__title ax-h3"}>{title}</h3>

        {problem && (
          <p className="pf-card__text">
            <b>The challenge.</b> {problem}
          </p>
        )}

        {(solution || result || place || duration || client) && (
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
            {place && (
              <div>
                <dt>Location</dt>
                <dd>{place}</dd>
              </div>
            )}
            {duration && (
              <div>
                <dt>Duration</dt>
                <dd>{duration}</dd>
              </div>
            )}
          </dl>
        )}

        <span className="pf-card__more">View Case Study</span>
      </div>
    </Link>
  );
};

export default CaseStudyCard;
