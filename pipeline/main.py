import argparse
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

from discover import search_repositories
from scoring import assign_tiers, score_repository

LANGUAGES = ["Python", "JavaScript", "TypeScript", "Go", "Rust", "Java", "C++", "C#", "Ruby", "PHP"]
STAR_BANDS = ["20..200", "200..2000", "2000..20000", ">20000"]
OUTPUT_PATH = Path(__file__).resolve().parent.parent / "data" / "projects.json"


def build_search_string(language: str, star_band: str, pushed_since: str) -> str:
    return (
        f"language:{language} stars:{star_band} good-first-issues:>2 "
        f"pushed:>={pushed_since} archived:false fork:false is:public sort:updated"
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--per-cell", type=int, default=5, help="repositories per language and star band")
    arguments = parser.parse_args()

    pushed_since = (datetime.now(timezone.utc) - timedelta(days=60)).strftime("%Y-%m-%d")
    repositories_by_name = {}
    for language in LANGUAGES:
        for star_band in STAR_BANDS:
            search_string = build_search_string(language, star_band, pushed_since)
            for repository in search_repositories(search_string, arguments.per_cell):
                repositories_by_name[repository["nameWithOwner"]] = repository

    projects = [score_repository(repository) for repository in repositories_by_name.values()]
    assign_tiers(projects)
    projects.sort(key=lambda project: project["health"], reverse=True)
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps({"generatedAt": datetime.now(timezone.utc).isoformat(), "projects": projects}, indent=2))
    print(f"wrote {len(projects)} projects to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
