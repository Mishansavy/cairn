import { useMemo, useState } from "react";
import { projectDataset } from "../data/loadProjects";
import { DEFAULT_FILTERS, filterProjects, uniqueValues } from "../lib/filterProjects";
import { TIERS, type Filters, type Tier } from "../lib/types";

export function useFilters() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const { projects } = projectDataset;

  const options = useMemo(
    () => ({
      languages: uniqueValues(projects.map((project) => project.language)),
      interests: uniqueValues(projects.flatMap((project) => project.interests)),
    }),
    [projects],
  );
  // Tier is applied at display time so each grade can show its own count.
  const matchingProjects = useMemo(() => filterProjects(projects, { ...filters, tier: "all" }), [projects, filters]);

  const routeCounts = useMemo(
    () =>
      Object.fromEntries(
        TIERS.map((tier) => [tier, matchingProjects.filter((project) => project.tier === tier).length]),
      ) as Record<Tier, number>,
    [matchingProjects],
  );

  const updateFilter = <Key extends keyof Filters>(key: Key, value: Filters[Key]) =>
    setFilters((current) => ({ ...current, [key]: value }));

  return { filters, options, matchingProjects, routeCounts, updateFilter, resetFilters: () => setFilters(DEFAULT_FILTERS) };
}
