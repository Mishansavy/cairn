import type { ProjectSignals } from "./types";

export type Conditions = "prime" | "fair" | "poor";

export function conditionsFor(health: number): Conditions {
  if (health >= 85) return "prime";
  if (health >= 70) return "fair";
  return "poor";
}

export function formatStars(stars: number): string {
  return stars >= 1000 ? `${(stars / 1000).toFixed(stars >= 10000 ? 0 : 1)}k` : String(stars);
}

export function summarizeSignals(signals: ProjectSignals): string {
  return [
    `${Math.round(signals.externalMergeShare * 100)}% of merged PRs from outside the team`,
    signals.hasContributingGuide ? "contributing guide" : "no contributing guide",
  ].join(" · ");
}

export function formatAgo(days: number | null): string {
  if (days === null) return "none";
  return days < 1 ? "today" : `${Math.round(days)}d ago`;
}

export function formatDuration(days: number | null): string {
  if (days === null) return "none";
  return days < 1 ? "under 1d" : `${Math.round(days)}d`;
}
