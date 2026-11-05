import { GRADES } from "../data/grades";
import type { Tier } from "../lib/types";
import "./GradeKey.css";

interface GradeKeyProps {
  selectedTier: Tier | "all";
  routeCounts: Record<Tier, number>;
  onSelect: (tier: Tier | "all") => void;
}

export function GradeKey({ selectedTier, routeCounts, onSelect }: GradeKeyProps) {
  return (
    <section className="grade-key" aria-label="Grades">
      <h2 className="grade-key__heading">Grades</h2>
      <ol className="grade-key__list">
        {GRADES.map((grade) => (
          <li key={grade.tier}>
            <button
              type="button"
              className="grade-key__item"
              data-tier={grade.tier}
              aria-pressed={selectedTier === grade.tier}
              onClick={() => onSelect(selectedTier === grade.tier ? "all" : grade.tier)}
            >
              <span className="grade-key__number">{grade.number}</span>
              <span className="grade-key__title">{grade.title}</span>
              <span className="grade-key__summary">{grade.summary}</span>
              <span className="grade-key__count">{routeCounts[grade.tier]} routes</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
