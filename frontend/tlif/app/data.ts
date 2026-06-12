import { Grantee, ScoreEntry } from "./types";

export const INITIAL_GRANTEES: Grantee[] = [];

export const SCORE_DATA: ScoreEntry[] = [];

export const SCORE_WEIGHTS = [0.10, 0.15, 0.20, 0.15, 0.15, 0.10, 0.15];

export const SCORE_HEADERS = [
  { label: "Alignment", weight: "10%" },
  { label: "Contribution", weight: "15%" },
  { label: "Innovation", weight: "20%" },
  { label: "Outcomes", weight: "15%" },
  { label: "Budget", weight: "15%" },
  { label: "Stakeholders", weight: "10%" },
  { label: "Students", weight: "15%" },
];

export function calcTotal(scores: number[]): number {
  return Math.round(
    scores.reduce((a, v, i) => a + v * SCORE_WEIGHTS[i], 0) / 4 * 100
  );
}
