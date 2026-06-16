## ADDED Requirements

### Requirement: Skill bundles dashboard CSS as an asset
The `codebase-compass` skill SHALL include a file named `assets/dashboard.css` located next to `SKILL.md` at the skill root.

#### Scenario: Asset exists in skill distribution
- **WHEN** the skill is built with `npm run build`
- **THEN** `dist/<agent>/skills/codebase-compass/assets/dashboard.css` exists for every supported agent

### Requirement: SKILL.md references the CSS asset
`SKILL.md` SHALL instruct the executing agent to copy `assets/dashboard.css` into `codebase-compass/00-codebase-view/styles.css` instead of inlining CSS.

#### Scenario: Dashboard creation uses asset
- **WHEN** the agent creates the dashboard shell for a topic
- **THEN** `codebase-compass/00-codebase-view/styles.css` is populated from the skill’s `assets/dashboard.css`

### Requirement: Asset is included in the npm package
The published `codebase-compass` package SHALL include the dashboard CSS asset so that `npx codebase-compass install` and `npx codebase-compass update` can copy it into installed skills.

#### Scenario: npm package contains asset
- **WHEN** `npm pack` is run after `npm run build`
- **THEN** the tarball contains `dist/<agent>/skills/codebase-compass/assets/dashboard.css` for every supported agent
