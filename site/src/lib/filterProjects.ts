import type { Filters, Project, SortKey } from "./types";

const SORTERS: Record<SortKey, (left: Project, right: Project) => number> = {
  health: (left, right) => right.health - left.health,
  stars: (left, right) => right.stars - left.stars,
  easiest: (left, right) => left.complexity - right.complexity,
};

export const DEFAULT_FILTERS: Filters = {
  query: "",
  language: "all",
  interest: "all",
  tier: "all",
  minimumHealth: 0,
  sort: "health",
};

export function filterProjects(projects: Project[], filters: Filters): Project[] {
  const query = filters.query.trim().toLowerCase();
  return projects
    .filter((project) => filters.language === "all" || project.language === filters.language)
    .filter((project) => filters.interest === "all" || project.interests.includes(filters.interest))
    .filter((project) => filters.tier === "all" || project.tier === filters.tier)
    .filter((project) => project.health >= filters.minimumHealth)
    .filter((project) => !query || `${project.name} ${project.description ?? ""}`.toLowerCase().includes(query))
    .sort(SORTERS[filters.sort]);
}

export function uniqueValues(values: Iterable<string | null>): string[] {
  return [...new Set([...values].filter((value): value is string => value !== null))].sort();
}
