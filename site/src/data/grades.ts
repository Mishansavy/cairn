import type { Tier } from "../lib/types";

export interface Grade {
  tier: Tier;
  number: number;
  title: string;
  summary: string;
}

export const GRADES: Grade[] = [
  { tier: "beginner", number: 1, title: "Beginner", summary: "Docs, typos, small fixes. Good for a first merged PR." },
  { tier: "intermediate", number: 2, title: "Intermediate", summary: "Bug fixes and small features in a codebase you can read in a weekend." },
  { tier: "advanced", number: 3, title: "Advanced", summary: "Multi-file changes, tests and design discussion with maintainers." },
  { tier: "expert", number: 4, title: "Expert", summary: "Large systems. Expect architecture and performance work." },
];
