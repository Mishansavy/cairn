import { useEffect, useRef, useState } from "react";
import type { Grade } from "../data/grades";
import { siteConfig } from "../data/siteConfig";
import { findNextRoute } from "../lib/findNextRoute";
import type { Project } from "../lib/types";
import { Pagination } from "./Pagination";
import { RouteRow } from "./RouteRow";
import "./GradeSection.css";

interface GradeSectionProps {
  grade: Grade;
  routes: Project[];
  allProjects: Project[];
}

const COLUMN_LABELS = ["Language", "Starters", "PRs merge in", "Last merge", "Stars", "Conditions"];

export function GradeSection({ grade, routes, allProjects }: GradeSectionProps) {
  const [page, setPage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const resultSignature = `${routes.length}:${routes[0]?.name}`;

  // Filters or sorting changed the result set, so the old page number no longer applies.
  useEffect(() => setPage(1), [resultSignature]);

  const pageCount = Math.max(1, Math.ceil(routes.length / siteConfig.routesPerPage));
  const firstIndex = (page - 1) * siteConfig.routesPerPage;
  const pageRoutes = routes.slice(firstIndex, firstIndex + siteConfig.routesPerPage);

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    sectionRef.current?.scrollIntoView({ block: "start" });
  };

  return (
    <section ref={sectionRef} className="grade-section" data-tier={grade.tier} aria-labelledby={`grade-${grade.tier}`}>
      <header className="grade-section__band">
        <span className="grade-section__number">{grade.number}</span>
        <div>
          <h2 className="grade-section__title" id={`grade-${grade.tier}`}>
            {grade.title}
          </h2>
          <p className="grade-section__summary">{grade.summary}</p>
        </div>
      </header>
      {routes.length === 0 ? (
        <p className="grade-section__empty">No routes at this grade match your filters.</p>
      ) : (
        <>
          <div className="grade-section__columns" aria-hidden="true">
            <span>Route</span>
            {COLUMN_LABELS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <ol className="grade-section__routes">
            {pageRoutes.map((project) => (
              <RouteRow key={project.name} project={project} nextRoute={findNextRoute(project, allProjects)} />
            ))}
          </ol>
        </>
      )}
      {pageCount > 1 && (
        <Pagination
          page={page}
          pageCount={pageCount}
          firstItem={firstIndex + 1}
          lastItem={firstIndex + pageRoutes.length}
          totalItems={routes.length}
          onChange={changePage}
        />
      )}
    </section>
  );
}
