import type { Filters, SortKey } from "../lib/types";
import { SelectField } from "./SelectField";
import "./FilterBar.css";
import "./FormControl.css";

interface FilterBarProps {
  filters: Filters;
  languages: string[];
  interests: string[];
  onChange: <Key extends keyof Filters>(key: Key, value: Filters[Key]) => void;
}

const CONDITIONS_OPTIONS = [
  { value: "0", label: "Any" },
  { value: "70", label: "Fair or better" },
  { value: "85", label: "Prime only" },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "health", label: "Best conditions" },
  { value: "easiest", label: "Easiest first" },
  { value: "stars", label: "Most stars" },
];

export function FilterBar({ filters, languages, interests, onChange }: FilterBarProps) {
  return (
    <section className="filter-bar" aria-label="Find a route">
      <label className="form-control filter-bar__search">
        <span className="form-control__label">Search</span>
        <input
          className="form-control__input"
          type="search"
          placeholder="Name or description"
          value={filters.query}
          onChange={(event) => onChange("query", event.target.value)}
        />
      </label>
      <SelectField
        label="Language"
        value={filters.language}
        options={[{ value: "all", label: "All languages" }, ...languages.map((name) => ({ value: name, label: name }))]}
        onChange={(value) => onChange("language", value)}
      />
      <SelectField
        label="Interest"
        value={filters.interest}
        options={[{ value: "all", label: "All interests" }, ...interests.map((name) => ({ value: name, label: name }))]}
        onChange={(value) => onChange("interest", value)}
      />
      <SelectField
        label="Conditions"
        value={String(filters.minimumHealth)}
        options={CONDITIONS_OPTIONS}
        onChange={(value) => onChange("minimumHealth", Number(value))}
      />
      <SelectField
        label="Sort"
        value={filters.sort}
        options={SORT_OPTIONS}
        onChange={(value) => onChange("sort", value as SortKey)}
      />
    </section>
  );
}
