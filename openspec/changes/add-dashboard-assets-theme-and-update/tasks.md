## 1. Create dashboard CSS asset

- [x] 1.1 Create `assets/dashboard.css` in `.opencode/skills/codebase-compass/` with light/dark palettes, purple accent, scrollbar variables, and all existing section styles.
- [x] 1.2 Copy `assets/dashboard.css` to `.claude/skills/codebase-compass/`, `.codex/skills/codebase-compass/`, and `.agents/skills/codebase-compass/`.

## 2. Update SKILL.md instructions

- [x] 2.1 Update the output structure section in all four `SKILL.md` files to mention the `assets/` directory.
- [x] 2.2 Replace the inline CSS example in Step 7 with an instruction to copy `assets/dashboard.css` into `codebase-compass/00-codebase-view/styles.css`.
- [x] 2.3 Update Step 7 `index.html` example to include the theme toggle button in the sidebar header.
- [x] 2.4 Update Step 7 `script.js` requirements to include theme toggle logic and `localStorage` persistence.

## 3. Implement CLI update command

- [x] 3.1 Add a content-aware copy helper (`copyIfChanged`) that compares file buffers before writing.
- [x] 3.2 Add an `updateAgent` function in `src/install.js` that mirrors `SKILL.md` and `assets/` into the target skill directory.
- [x] 3.3 Refactor `mergeOpencodeConfig` into a reusable helper and add a conditional-write variant that only writes when the merged result differs.
- [x] 3.4 Add `runUpdate` in `src/install.js` with the same agent detection/prompt logic as `runInstall`.
- [x] 3.5 Wire the `update` subcommand into `bin/codebase-compass.js` and update help text.
- [x] 3.6 Export the new functions from `src/install.js` for testability.

## 4. Exclude OpenSpec tooling from git

- [x] 4.1 Add `.opencode/commands/` and `.opencode/skills/openspec-*/` to the root `.gitignore`.
- [x] 4.2 Verify that `.opencode/skills/codebase-compass/` and `.opencode/opencode.json` remain tracked.

## 5. Documentation and versioning

- [x] 5.1 Update `AGENTS.md` to document `npx codebase-compass update` and the new asset-based dashboard theming.
- [x] 5.2 Update `README.md` with the `update` command, light/dark theme note, and asset folder convention.
- [x] 5.3 Bump `package.json` version to `0.2.0`.

## 6. Build and verify

- [x] 6.1 Run `npm run build` and confirm `dist/<agent>/skills/codebase-compass/assets/dashboard.css` exists for every agent.
- [x] 6.2 Run `npm pack --dry-run` and confirm OpenSpec tooling is not included in the tarball.
- [x] 6.3 Manually test `node bin/codebase-compass.js update` in a test project to verify SKILL.md/assets/opencode.json are updated and `codebase-compass/` output is untouched.
- [x] 6.4 Open a generated `index.html` and verify light mode by default, dark mode toggle, and `localStorage` persistence.
