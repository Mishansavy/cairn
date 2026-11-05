import { GRADES } from "../data/grades";
import type { Project, Tier } from "../lib/types";
import { GradeSection } from "./GradeSection";
import "./RouteGuide.css";

interface RouteGuideProps {
  matchingProjects: Project[];
  allProjects: Project[];
  selectedTier: Tier | "all";
  onReset: () => void;
}

export function RouteGuide({ matchingProjects, allProjects, selectedTier, onReset }: RouteGuideProps) {
  const visibleGrades = GRADES.filter((grade) => selectedTier === "all" || grade.tier === selectedTier);
  const routesByTier = (tier: Tier) => matchingProjects.filter((project) => project.tier === tier);

  if (visibleGrades.every((grade) => routesByTier(grade.tier).length === 0)) {
    return (
      <div className="route-guide__empty">
        <p>No routes match these filters.</p>
        <button type="button" onClick={onReset}>
          Clear filters
        </button>
      </div>
    );
  }
  return (
    <div aria-live="polite">
      {visibleGrades.map((grade) => (
        <GradeSection key={grade.tier} grade={grade} routes={routesByTier(grade.tier)} allProjects={allProjects} />
      ))}
    </div>
  );
}
