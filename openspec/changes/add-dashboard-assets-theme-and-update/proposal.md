## Why

Codebase-Compass currently generates dashboard CSS inline in SKILL.md instructions. This makes the styles hard to maintain, prevents users from getting style updates without regenerating their entire dashboard, and limits the dashboard to a single dark theme. We want to extract the dashboard styles into a proper Agent Skills `assets/` folder, add a polished light/dark theme toggle, and provide a selective `npx codebase-compass update` command so users can refresh the skill and its assets without touching their generated `codebase-compass/` output.

## What Changes

- Add an `assets/` folder to the `codebase-compass` skill containing `dashboard.css` (the canonical dashboard stylesheet).
- Update SKILL.md instructions to copy `assets/dashboard.css` into `codebase-compass/00-codebase-view/styles.css` instead of inlining CSS.
- Add light and dark themes to the dashboard:
  - CSS custom properties for the full palette.
  - Default to light mode.
  - Manual toggle in the sidebar header, persisted to `localStorage`.
  - Keep the existing purple accent (`#7c4dff` / `#9c7cff`) while softening the dark background.
- Add `npx codebase-compass update`:
  - Detects agent configs the same way `install` does.
  - Selectively copies `SKILL.md` and `assets/` only if their content changed.
  - Mirrors the source `assets/` directory into the target skill directory (override existing, add new, remove stale).
  - For opencode, merges command blocks and `skills.paths` into `.opencode/opencode.json` only if the merged result differs from the current file.
  - Never touches generated `codebase-compass/` output files.
- Exclude the OpenSpec development tooling (`.opencode/commands/`, `.opencode/skills/openspec-*`) from git, since it is only used to build the skill and must not be published.
- Update `AGENTS.md` to document the new `update` command and the asset-based theming.
- Bump package version to `0.2.0`.

## Capabilities

### New Capabilities

- `dashboard-theming`: Light/dark theme support for the generated HTML dashboard, including CSS custom properties, a user toggle, and `localStorage` persistence.
- `skill-asset-packaging`: Bundle static dashboard resources in the Agent Skills standard `assets/` directory and reference them from SKILL.md.
- `cli-update-command`: Selectively update an installed skill's `SKILL.md`, assets, and opencode command configuration without touching generated analysis output.

### Modified Capabilities

- None.

## Impact

- The `codebase-compass` npm package and all four agent skill copies (`.opencode`, `.claude`, `.codex`, `.agents`).
- Generated dashboards will default to light mode after regeneration.
- Existing `codebase-compass/` output directories are intentionally left untouched by `update`; users must regenerate the dashboard to pick up new styles.
