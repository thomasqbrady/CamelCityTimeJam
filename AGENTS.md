# Repository Guidelines

## Project Structure & Module Organization
- `gdd.md`: primary Game Design Document for Camel City Time Jam.
- `reference/`: supporting visual/material assets (for example, `reference/generated.png`).
- `LICENSE`: project license information.

This repository is currently documentation-first. If implementation code is added, keep it explicit:
- `src/` for game/runtime code
- `tests/` for automated tests
- `assets/` for production-ready art/audio used by builds

## Build, Test, and Development Commands
There is no build pipeline committed yet. Use lightweight validation commands while iterating on docs/assets:
- `ls -la` to verify expected files are present.
- `rg --files` to quickly inspect repository contents.
- `git status` to review local changes before commits.

When a codebase is introduced, add project scripts (for example `npm test` or `make build`) and document them here.

## Coding Style & Naming Conventions
- Markdown: use clear section headings, short paragraphs, and concise bullet lists.
- Filenames: use lowercase with hyphens where practical (example: `level-flow.md`).
- Keep binary/reference outputs in `reference/`; avoid scattering generated files at repository root.
- Prefer ASCII in docs unless non-ASCII is required for historical names/quotes.

## Testing Guidelines
Current scope is content quality:
- Verify links, headings, and factual consistency in `gdd.md`.
- Validate that referenced assets exist at the stated paths.

If/when test frameworks are added:
- Place tests under `tests/`.
- Name tests by behavior (example: `test_time_warp_intro.*`).
- Include a basic smoke test path in CI before merging.

## Commit & Pull Request Guidelines
Git history currently starts with a single `Initial commit`; adopt a consistent convention now:
- Commit messages in imperative mood, concise scope-first style (example: `docs: refine chapter 2 pacing`).
- Keep commits focused; avoid mixing asset drops with unrelated text rewrites.

PRs should include:
- Clear summary of what changed and why.
- Linked issue/task when applicable.
- Before/after screenshots for visual asset updates.
- Notes on follow-up work or known gaps.

## Security & Configuration Tips
- Do not commit secrets, tokens, or private jam credentials.
- Keep large raw exports out of git unless required; prefer optimized assets for collaboration.
