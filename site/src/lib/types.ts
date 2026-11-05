export const TIERS = ["beginner", "intermediate", "advanced", "expert"] as const;
export type Tier = (typeof TIERS)[number];

export interface ProjectSignals {
  daysSinceLastMerge: number | null;
  medianDaysToMerge: number | null;
  externalMergeShare: number;
  goodFirstIssues: number;
  helpWantedIssues: number;
  hasContributingGuide: boolean;
}

export interface Project {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  topics: string[];
  interests: string[];
  tier: Tier;
  complexity: number;
  health: number;
  signals: ProjectSignals;
}

export interface ProjectDataset {
  generatedAt: string;
  projects: Project[];
}

export type SortKey = "health" | "stars" | "easiest";

export interface Filters {
  query: string;
  language: string;
  interest: string;
  tier: Tier | "all";
  minimumHealth: number;
  sort: SortKey;
}
