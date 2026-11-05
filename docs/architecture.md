# Cairn architecture

Cairn lists GitHub projects graded from beginner to expert. A weekly job collects and scores the data, and a static site presents it.

## Data pipeline (`pipeline/`)

`main.py` runs one GraphQL search per language and star band (10 languages, 4 bands), keeps projects pushed in the last 60 days with more than two open `good first issue` issues, and writes `data/projects.json`.

Each project gets three computed values in `scoring.py`:

- **Health (0 to 100):** recency of the last merge (30), median days to merge (20), share of merged PRs from outside the team (25), a CONTRIBUTING guide (10), and open beginner issues (15). It is calculated from the last 30 merged PRs.
- **Tier:** projects are ranked by a complexity score (repository size, language count, open issues) and split into quartiles. Tiers are relative to the current sample.
- **Interests:** topics and description words matched against a fixed keyword map. Projects with no match get `general`.

Only the Python standard library is used. The job needs a `GITHUB_TOKEN`.

## Site (`site/`)

Vite, React and TypeScript. The site imports `data/projects.json` at build time, so a data refresh needs a redeploy.

- `src/hooks/useFilters.ts` holds filter state, option lists, matching projects and per-grade counts.
- `src/lib/` holds filtering, formatting and the next-route lookup.
- `src/data/` holds the grade definitions and site config (name, page size).
- Each grade section paginates its own routes, 10 per page.
- Styling uses tokens from `src/styles/tokens.css`. The theme is light only.

"Next up" on a route is the healthiest project one grade higher in the same language.

## Automation (`.github/workflows/`)

- `ci.yml` runs on every pull request and push to `main`: lint (ruff and actionlint), pipeline tests, and the site type-check and build. `make lint`, `make test` and `make build` run the same steps locally.
- `refresh-data.yml` runs the pipeline every Monday at 03:00 UTC and commits the data file to the `data` branch, not `main`, so `main` only changes through reviewed pull requests.
- `deploy-pages.yml` builds the site from `main`, overlays `data/projects.json` from the `data` branch, and publishes to GitHub Pages. It runs after a push to `main` that touches `site/` or `data/`, and after a successful refresh.
- Actions are pinned to commit SHAs and each job gets only the permissions it needs. Dependabot proposes updates monthly for actions and weekly for site dependencies.

## Branch protection

`main` requires a pull request, one approving review from a code owner, and passing `Lint`, `Pipeline` and `Site` checks. Force pushes and branch deletion are blocked. The repository admin can bypass these rules.

## Known limits

- Health scores bunch near the top because discovery already filters to active projects.
- Self-merged repositories score low on outside contributions, even when active.
- Many routes share the same "next up" project.
