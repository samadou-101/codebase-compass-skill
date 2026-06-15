# Codebase-Compass

Codebase-Compass converts any unknown codebase into a structured knowledge system and an interactive HTML dashboard, while keeping every claim traceable to real source files.

## What gets generated

- `codebase-compass/<topic>/<topic>.md` — detailed knowledge card
- `codebase-compass/codebase-view/sections/<topic>.html` — dashboard section
- `codebase-compass/codebase-view/manifest.json` — registry of topics
- `codebase-compass/codebase-view/index.html` — browsable dashboard shell
- `codebase-compass/codebase-view/styles.css` — dashboard styles
- `codebase-compass/codebase-view/script.js` — dashboard logic

## Install for different agents

### Open agents / `.agents`

```bash
cp -r .agents/skills/codebase-compass ~/.agents/skills/
```

### Claude Code

```bash
cp -r .claude/skills/codebase-compass ~/.claude/skills/
```

### Codex

```bash
cp -r .codex/skills/codebase-compass ~/.codex/skills/
```

### opencode

The skill and command config are already in `.opencode/`.

To use them globally, copy the skill folder and merge the command block into your global config:

```bash
mkdir -p ~/.config/opencode/skills
cp -r .opencode/skills/codebase-compass ~/.config/opencode/skills/
```

Then copy the `command` section from `.opencode/opencode.json` into `~/.config/opencode/opencode.json`.

**After editing opencode config, restart opencode** for the changes to take effect.

## Usage

- `/codebase-compass <topic>` — analyze one topic, e.g. `/codebase-compass request-flow`
- `/codebase-compass-all` — analyze the full catalog

## Important rules

- The skill is **read-only** with respect to the repository being analyzed.
- It only writes into the `codebase-compass/` output directory.
- Every claim in generated markdown must link back to real source files.
- If a topic does not apply to the repo, the skill still produces a short note explaining what was checked.
