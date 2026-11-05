import math
import re
from datetime import datetime, timezone
from statistics import median

EXTERNAL_ASSOCIATIONS = {"NONE", "FIRST_TIME_CONTRIBUTOR", "FIRST_TIMER", "CONTRIBUTOR"}
TIERS = ["beginner", "intermediate", "advanced", "expert"]

INTEREST_TOPICS = {
    "web": {"web", "frontend", "backend", "react", "vue", "nextjs", "django", "flask", "api", "http", "website", "browser", "css", "html"},
    "machine-learning": {"machine-learning", "deep-learning", "ai", "llm", "nlp", "pytorch", "tensorflow", "agent", "agents", "model", "models", "neural"},
    "devtools": {"cli", "developer-tools", "devtools", "linter", "compiler", "testing", "build-tool", "automation", "tool", "tools", "framework", "library", "sdk", "editor"},
    "infrastructure": {"kubernetes", "docker", "devops", "cloud", "database", "observability", "networking", "server", "cluster", "infrastructure", "storage"},
    "games": {"game", "game-engine", "gamedev", "games", "gaming", "minecraft"},
    "mobile": {"android", "ios", "flutter", "react-native", "mobile", "app"},
    "security": {"security", "cryptography", "pentesting", "privacy", "vulnerability", "auth"},
    "data": {"data-engineering", "analytics", "visualization", "etl", "dataframe", "data", "dashboard", "charts"},
    "education": {"education", "learning", "tutorial", "course", "practice", "beginners"},
    "science": {"science", "scientific", "bioinformatics", "astronomy", "physics", "chemistry", "research"},
}


def _parse(timestamp: str) -> datetime:
    return datetime.fromisoformat(timestamp.replace("Z", "+00:00"))


def _clamp(value: float) -> float:
    return max(0.0, min(1.0, value))


def _linear_decay(value: float, best: float, worst: float) -> float:
    return _clamp((worst - value) / (worst - best))


def _normalize(value: float, low: float, high: float) -> float:
    return _clamp((value - low) / (high - low))


def health_signals(repository: dict, now: datetime) -> dict:
    merged = repository["mergedPullRequests"]["nodes"]
    if not merged:
        return {"daysSinceLastMerge": None, "medianDaysToMerge": None, "externalMergeShare": 0.0}
    days_to_merge = [
        (_parse(pull_request["mergedAt"]) - _parse(pull_request["createdAt"])).total_seconds() / 86400
        for pull_request in merged
    ]
    last_merge = max(_parse(pull_request["mergedAt"]) for pull_request in merged)
    external = sum(1 for pull_request in merged if pull_request["authorAssociation"] in EXTERNAL_ASSOCIATIONS)
    return {
        "daysSinceLastMerge": round((now - last_merge).total_seconds() / 86400, 1),
        "medianDaysToMerge": round(median(days_to_merge), 1),
        "externalMergeShare": round(external / len(merged), 2),
    }


def health_score(repository: dict, signals: dict) -> int:
    if signals["daysSinceLastMerge"] is None:
        return 0
    components = [
        (30, _linear_decay(signals["daysSinceLastMerge"], 3, 90)),
        (20, _linear_decay(signals["medianDaysToMerge"], 1, 30)),
        (25, _clamp(signals["externalMergeShare"] / 0.5)),
        (10, 1.0 if repository["contributingGuide"] else 0.0),
        (15, _clamp(repository["goodFirstIssues"]["totalCount"] / 3)),
    ]
    return round(sum(weight * score for weight, score in components))


def complexity_score(repository: dict) -> float:
    return round(
        0.6 * _normalize(math.log10(repository["diskUsage"] + 1), 2, 6.5)
        + 0.25 * _normalize(repository["languages"]["totalCount"], 1, 10)
        + 0.15 * _normalize(math.log10(repository["openIssues"]["totalCount"] + 1), 0, 3.5),
        2,
    )


def assign_tiers(projects: list[dict]) -> None:
    # Quartile ranks keep all four tiers populated whatever the sample looks like.
    ranked = sorted(projects, key=lambda project: project["complexity"])
    for position, project in enumerate(ranked):
        project["tier"] = TIERS[position * len(TIERS) // len(ranked)]


def interests(topics: list[str], description: str | None) -> list[str]:
    words = set(topics) | set(re.findall(r"[a-z]+", (description or "").lower()))
    matched = [interest for interest, keywords in INTEREST_TOPICS.items() if words & keywords]
    return matched or ["general"]


def score_repository(repository: dict, now: datetime | None = None) -> dict:
    now = now or datetime.now(timezone.utc)
    signals = health_signals(repository, now)
    topics = [node["topic"]["name"] for node in repository["repositoryTopics"]["nodes"]]
    return {
        "name": repository["nameWithOwner"],
        "url": repository["url"],
        "description": repository["description"],
        "language": (repository["primaryLanguage"] or {}).get("name"),
        "stars": repository["stargazerCount"],
        "topics": topics,
        "interests": interests(topics, repository["description"]),
        "tier": None,
        "complexity": complexity_score(repository),
        "health": health_score(repository, signals),
        "signals": {
            **signals,
            "goodFirstIssues": repository["goodFirstIssues"]["totalCount"],
            "helpWantedIssues": repository["helpWantedIssues"]["totalCount"],
            "hasContributingGuide": repository["contributingGuide"] is not None,
        },
    }
