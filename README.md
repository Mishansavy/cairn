# Cairn

A guidebook to open source. Cairn lists active GitHub projects that welcome new contributors and grades each one from beginner to expert, so you can find a project that fits and see a harder one to move to next.

Live site: https://mishansavy.github.io/cairn/

## What you get

- Four grades, from first merged PR to deep work on large systems.
- Filters for language and interest, plus a minimum "conditions" level.
- Conditions for each project, computed from GitHub data: how recently pull requests were merged, how fast, how many come from outside the team, and whether a contributing guide exists.
- A "next up" project one grade higher in the same language.

Grades and conditions are computed, not hand picked. Grades are relative to the projects in the current sample, so "beginner" means easier than the rest of the list, not easy in absolute terms. `docs/architecture.md` has the scoring details.

## Run it locally

```bash
cd site
npm install
npm run dev
```

The site reads `data/projects.json` and needs no token. To regenerate the data, run `GITHUB_TOKEN=<token> python3 pipeline/main.py` from the repository root.

## How the data stays fresh

A GitHub Actions workflow runs the pipeline every Monday at 03:00 UTC, commits the new data, and redeploys the site to GitHub Pages.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Wrong grades and scoring ideas are especially useful. Everyone taking part is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE)
