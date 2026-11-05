import unittest
from datetime import datetime, timezone

import scoring

NOW = datetime(2026, 11, 5, tzinfo=timezone.utc)


def make_pull_request(created_at: str, merged_at: str, association: str) -> dict:
    return {"createdAt": created_at, "mergedAt": merged_at, "authorAssociation": association}


def make_repository(pull_requests: list[dict], starter_issues: int = 3, has_guide: bool = True) -> dict:
    return {
        "mergedPullRequests": {"nodes": pull_requests},
        "contributingGuide": {"id": "guide"} if has_guide else None,
        "goodFirstIssues": {"totalCount": starter_issues},
    }


class HealthTest(unittest.TestCase):
    def test_signals_measure_recency_speed_and_outside_share(self):
        repository = make_repository(
            [
                make_pull_request("2026-11-01T00:00:00Z", "2026-11-03T00:00:00Z", "NONE"),
                make_pull_request("2026-11-02T00:00:00Z", "2026-11-03T12:00:00Z", "MEMBER"),
            ]
        )
        signals = scoring.health_signals(repository, NOW)
        self.assertEqual(signals["daysSinceLastMerge"], 1.5)
        self.assertEqual(signals["medianDaysToMerge"], 1.8)
        self.assertEqual(signals["externalMergeShare"], 0.5)

    def test_project_without_merged_pull_requests_scores_zero(self):
        repository = make_repository([])
        signals = scoring.health_signals(repository, NOW)
        self.assertEqual(scoring.health_score(repository, signals), 0)

    def test_active_welcoming_project_scores_full_marks(self):
        repository = make_repository([make_pull_request("2026-11-02T12:00:00Z", "2026-11-03T00:00:00Z", "NONE")])
        signals = scoring.health_signals(repository, NOW)
        self.assertEqual(scoring.health_score(repository, signals), 100)

    def test_self_merged_project_loses_outside_contribution_points(self):
        repository = make_repository([make_pull_request("2026-11-02T12:00:00Z", "2026-11-03T00:00:00Z", "OWNER")])
        signals = scoring.health_signals(repository, NOW)
        self.assertEqual(scoring.health_score(repository, signals), 75)


class TierTest(unittest.TestCase):
    def test_quartiles_split_projects_evenly_across_tiers(self):
        projects = [{"complexity": complexity / 10, "tier": None} for complexity in range(8)]
        scoring.assign_tiers(projects)
        tiers = [project["tier"] for project in projects]
        self.assertEqual(tiers, ["beginner"] * 2 + ["intermediate"] * 2 + ["advanced"] * 2 + ["expert"] * 2)


class InterestTest(unittest.TestCase):
    def test_topics_and_description_words_both_match(self):
        self.assertCountEqual(scoring.interests(["kubernetes"], "A game engine"), ["games", "infrastructure"])

    def test_unmatched_project_falls_back_to_general(self):
        self.assertEqual(scoring.interests([], "Pure arithmetic helpers"), ["general"])


if __name__ == "__main__":
    unittest.main()
