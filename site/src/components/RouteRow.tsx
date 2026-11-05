import { conditionsFor, formatAgo, formatDuration, formatStars, summarizeSignals } from "../lib/formatProject";
import type { Project } from "../lib/types";
import "./RouteRow.css";

interface RouteRowProps {
  project: Project;
  nextRoute: Project | undefined;
}

export function RouteRow({ project, nextRoute }: RouteRowProps) {
  const { signals } = project;
  return (
    <li className="route-row">
      <div className="route-row__main">
        <h3 className="route-row__name">
          <a href={project.url} target="_blank" rel="noreferrer">
            {project.name}
          </a>
        </h3>
        {project.description && <p className="route-row__description">{project.description}</p>}
        <p className="route-row__note">{summarizeSignals(signals)}</p>
        {nextRoute && (
          <p className="route-row__note">
            Next up in {project.language}:{" "}
            <a href={nextRoute.url} target="_blank" rel="noreferrer">
              {nextRoute.name}
            </a>
          </p>
        )}
      </div>
      <dl className="route-row__facts">
        <div>
          <dt>Language</dt>
          <dd>{project.language ?? "Not set"}</dd>
        </div>
        <div>
          <dt>Starters</dt>
          <dd>{signals.goodFirstIssues}</dd>
        </div>
        <div>
          <dt>PRs merge in</dt>
          <dd>{formatDuration(signals.medianDaysToMerge)}</dd>
        </div>
        <div>
          <dt>Last merge</dt>
          <dd>{formatAgo(signals.daysSinceLastMerge)}</dd>
        </div>
        <div>
          <dt>Stars</dt>
          <dd>{formatStars(project.stars)}</dd>
        </div>
        <div>
          <dt>Conditions</dt>
          <dd className="route-row__conditions" data-conditions={conditionsFor(project.health)}>
            {conditionsFor(project.health)} <span className="route-row__score">{project.health}</span>
          </dd>
        </div>
      </dl>
    </li>
  );
}
