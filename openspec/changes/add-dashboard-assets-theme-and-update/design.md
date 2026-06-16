## Context

Codebase-Compass is an installable agent skill that generates a navigable knowledge system under `codebase-compass/` in the target project. The dashboard shell (`index.html`, `styles.css`, `script.js`) is created by the skill at runtime. Until now, the canonical styles were embedded in SKILL.md as inline examples, and only a dark theme was described. This change moves the stylesheet into the skill’s `assets/` directory (per the Agent Skills standard), adds a light/dark theme, and introduces a selective CLI update path.

## Goals / Non-Goals

**Goals:**
- Maintain dashboard styles as a single source of truth inside the skill (`assets/dashboard.css`).
- Support light and dark themes with a consistent purple accent.
- Default the dashboard to light mode while remembering the user’s explicit choice.
- Provide `npx codebase-compass update` to refresh skill files (`SKILL.md`, `assets/`, and opencode commands) without touching generated analysis output.
- Keep the update operation idempotent by comparing file contents before writing.
- Ensure OpenSpec development tooling stays out of git and the published npm package.

**Non-Goals:**
- Auto-updating existing generated `codebase-compass/` dashboards when `update` runs.
- Adding a build step for the CSS (it remains plain CSS).
- Supporting per-topic custom styles.
- Changing the dashboard layout or information architecture beyond the theme toggle.

## Decisions

### 1. Store canonical CSS in `assets/dashboard.css`

The Agent Skills specification allows `assets/` for static resources such as templates and data files. Treating the dashboard stylesheet as an asset lets SKILL.md reference it by relative path instead of inlining a large CSS block. It also makes style updates ship with the skill package.

**Alternative considered:** Keep CSS inline in SKILL.md. Rejected because inline CSS is hard to maintain, cannot be reused, and does not demonstrate the Agent Skills asset convention.

### 2. Use CSS custom properties + `data-theme` attribute

The stylesheet defines variables on `:root` for the default (light) theme and overrides them via `[data-theme="dark"]`. The toggle button in `index.html` sets the attribute, and `script.js` persists the choice to `localStorage`.

**Alternative considered:** Two separate stylesheets or a `<link media="(prefers-color-scheme: dark)">` block. Rejected because a single stylesheet with custom properties is simpler, avoids an extra network request, and still allows manual override independent of OS preference.

### 3. Default to light mode

`:root` carries the light palette. On first load the script sets `data-theme="light"` unless a saved preference exists. This satisfies the product preference for a lighter default while respecting returning users.

### 4. Mirror `assets/` on update

`npx codebase-compass update` copies `SKILL.md` and the contents of `assets/` only when their bytes differ from the target. It also removes target assets that no longer exist in the source so the installed skill stays a faithful mirror.

**Alternative considered:** Copy only changed files and never delete. Rejected because stale assets (e.g., a renamed or removed CSS file) would linger in installed skills.

### 5. Merge `opencode.json` only when the result changes

For opencode, the update command reads the existing target `.opencode/opencode.json`, merges the command blocks and `skills.paths` exactly like `install`, compares the merged JSON to the current file, and writes only if different. This preserves unrelated user settings while keeping commands in sync.

### 6. Exclude OpenSpec tooling from git via root `.gitignore`

`.opencode/commands/` and `.opencode/skills/openspec-*/` are development-only. Adding them to the root `.gitignore` keeps them out of GitHub while preserving `.opencode/skills/codebase-compass/` and `.opencode/opencode.json`, which are real skill sources. The npm package is already safe because `package.json` uses a whitelist (`files: ["bin/", "src/", "dist/"]`) and `dist/` is built only from the codebase-compass skill copies.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Existing dashboards stay on old CSS after `update` because `update` intentionally skips `codebase-compass/` output. | Document clearly in README and AGENTS.md that users must regenerate the dashboard (or manually replace `styles.css`) to pick up theme changes. |
| Agents may not reliably locate `assets/dashboard.css` relative to SKILL.md. | Use a clear relative path in SKILL.md (`assets/dashboard.css`) and verify with the target agents during implementation. |
| `update` could overwrite local modifications a user made to the installed SKILL.md. | Document that `update` mirrors the latest published skill; users who customize the installed skill should not run `update` blindly. |
| Light theme contrast may not match all generated section content. | Use accessible contrast ratios for text and test both themes on a sample dashboard. |

## Migration Plan

1. Merge the change.
2. Run `npm run build` to populate `dist/` with the new assets.
3. Run `npm version minor` (or edit `package.json` to `0.2.0`).
4. Publish with `npm publish`.
5. Update `AGENTS.md` so contributors know about `assets/` and the `update` command.

Rollback: revert the commit and republish the previous version. Installed skills are not auto-updated, so rollback only affects new installs/updates.

## Open Questions

- None at this time.
