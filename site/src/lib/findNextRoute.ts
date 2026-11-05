import { TIERS, type Project } from "./types";

export function findNextRoute(project: Project, projects: Project[]): Project | undefined {
  const nextTier = TIERS[TIERS.indexOf(project.tier) + 1];
  return projects
    .filter((candidate) => candidate.tier === nextTier && candidate.language === project.language)
    .sort((left, right) => right.health - left.health)[0];
}
