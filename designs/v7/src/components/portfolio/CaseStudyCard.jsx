import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { pad2, tidyTag } from "./utils";

// Obsidian: one project in the portfolio index, a glass card that is one link to the
// case study. The screenshot sits framed inside the card and zooms slightly on hover;
// the index number, discipline chip, title, the challenge and the facts follow.
// The lead card is the split-screen feature (picture seven columns, story five).
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
  number,
}) => {
  const safeProjectUrl = projectUrl
    ? projectUrl.startsWith("http") || projectUrl.startsWith("/")
      ? projectUrl
      : `/${projectUrl}`
    : "#";

  const facts = [
    ["Client", client],
    ["Location", place],
    ["Duration", duration],
  ].filter(([, value]) => value);

  return (
    <Link href={safeProjectUrl} className={`pf-card ob-card${lead ? " pf-card--lead" : ""}`}>
      {imageSrc && (
        <figure className="ax-shot pf-card__media">
          <img
            src={imageSrc}
            alt=""
            width="1920"
            height="1080"
            loading={lead ? "eager" : "lazy"}
            fetchPriority={lead ? "high" : undefined}
            decoding="async"
          />
          <span className="pf-card__go" aria-hidden="true">
            <ArrowUpRight size={22} />
          </span>
        </figure>
      )}

      <div className="pf-card__body">
        <div className="pf-card__top">
          {number ? (
            <span className="pf-card__num" aria-hidden="true">
              {pad2(number)}
            </span>
          ) : null}
          {tag && <span className="ax-chip">{tidyTag(tag)}</span>}
        </div>

        <h3 className={lead ? "pf-card__title pf-card__title--lead" : "pf-card__title"}>{title}</h3>

        {problem && (
          <p className="pf-card__text">
            <b>The challenge.</b> {problem}
          </p>
        )}

        {(solution || result) && (
          <dl className="pf-card__story">
            {solution && (
              <div>
                <dt>Solution</dt>
                <dd>{solution}</dd>
              </div>
            )}
            {result && (
              <div className="pf-card__result">
                <dt>Result</dt>
                <dd>{result}</dd>
              </div>
            )}
          </dl>
        )}

        {facts.length > 0 && (
          <dl className="pf-card__facts">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <span className="pf-card__more">
          View Case Study
          <ArrowUpRight size={18} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
};

export default CaseStudyCard;
