# Contributing to Cairn

Cairn grades GitHub projects from beginner to expert so new contributors can find a fit. Contributions to the site, the scoring and the data pipeline are all welcome.

## Set up

You need Python 3.12 and Node 22.

```bash
cd site
npm install
npm run dev
```

The site reads `data/projects.json` and runs without a token. To regenerate the data, set a GitHub token with no extra scopes:

```bash
GITHUB_TOKEN=<your token> python3 pipeline/main.py
```

`docs/architecture.md` explains how the pipeline, the scoring and the site fit together.

## Where to start

- **Interest keywords:** `INTEREST_TOPICS` in `pipeline/scoring.py`. A project with no match falls into "general", so better keywords help directly.
- **Grade descriptions:** `site/src/data/grades.ts`.
- **Bugs and layout problems:** anything you find on a phone or in a different browser.
- **Scoring changes:** the health weights and the complexity formula are open to debate. Open an issue first and show the effect on a few real projects before sending a PR.

## Pull requests

1. Keep a PR to one change.
2. Run `npm run build` in `site/`. It type-checks as well as builds.
3. Do not edit `data/projects.json` by hand. A weekly job refreshes it.
4. Write commit messages in the imperative, under 15 words.

By opening a PR you agree your contribution is released under the MIT license in `LICENSE`. There is no CLA.

## Code style

- Names say what the thing is. Write `for pull_request in merged`, not `for pr in merged`.
- Comments are one line and explain why, not what.
- Colours, font sizes, spacing and radii are tokens in `site/src/styles/tokens.css`. Do not hardcode them in components.
- Surfaces are separated with 1px borders. No shadows.
- One component per file. Page files only compose.

## Reporting a wrong grade

If a project's tier or health looks wrong, open an issue with the repository name and what you expected. Those reports are the best input for improving the scoring.
