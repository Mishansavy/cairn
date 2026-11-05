import { FilterBar } from "./components/FilterBar";
import { GradeKey } from "./components/GradeKey";
import { RouteGuide } from "./components/RouteGuide";
import { SiteHeader } from "./components/SiteHeader";
import { projectDataset } from "./data/loadProjects";
import { useFilters } from "./hooks/useFilters";

export function App() {
  const { filters, options, matchingProjects, routeCounts, updateFilter, resetFilters } = useFilters();
  return (
    <main className="page">
      <SiteHeader generatedAt={projectDataset.generatedAt} projectCount={projectDataset.projects.length} />
      <GradeKey selectedTier={filters.tier} routeCounts={routeCounts} onSelect={(tier) => updateFilter("tier", tier)} />
      <FilterBar filters={filters} languages={options.languages} interests={options.interests} onChange={updateFilter} />
      <RouteGuide
        matchingProjects={matchingProjects}
        allProjects={projectDataset.projects}
        selectedTier={filters.tier}
        onReset={resetFilters}
      />
    </main>
  );
}
