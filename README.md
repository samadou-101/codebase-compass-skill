# Codebase-Compass

Convert any unknown codebase into a structured, navigable knowledge system and an interactive HTML dashboard — with every claim traced back to real source files.

Codebase-Compass is an installable agent skill for [opencode](https://opencode.ai), [Claude Code](https://claude.ai/code), [Codex](https://openai.com/codex), and Open Agents (`.agents`). Once installed in a project, it reads the repository in **read-only** mode and generates detailed topic cards plus a browsable dashboard under `codebase-compass/`.

## What gets generated

```text
codebase-compass/
  <topic>/
    <topic>.md                 # Detailed knowledge card
  codebase-view/
    index.html                  # Browsable dashboard shell
    styles.css                  # Dashboard styles
    script.js                   # Dashboard logic
    manifest.json               # Registry of topics
    sections/
      <topic>.html              # Dashboard section
```

## Installation

### Quick install (recommended)

Run the installer in the project you want to analyze:

```bash
npx codebase-compass install
```

The installer will:

- Detect which agent configuration already exists in the project (`.opencode`, `.claude`, `.codex`, or `.agents`).
- Ask you to pick one if multiple are detected.
- Install the Codebase-Compass skill into that agent's project-local skills directory.
- For opencode, merge the `/codebase-compass` and `/codebase-compass-all` command blocks into `.opencode/opencode.json`.

If no agent configuration is detected, it defaults to `.agents/skills/`.

After installation, restart your agent if needed.

### Manual install

#### Open agents / `.agents`

```bash
cp -r .agents/skills/codebase-compass ~/.agents/skills/
```

#### Claude Code

```bash
cp -r .claude/skills/codebase-compass ~/.claude/skills/
```

#### Codex

```bash
cp -r .codex/skills/codebase-compass ~/.codex/skills/
```

#### opencode

```bash
mkdir -p ~/.config/opencode/skills
cp -r .opencode/skills/codebase-compass ~/.config/opencode/skills/
```

Then copy the `command` section from `.opencode/opencode.json` into `~/.config/opencode/opencode.json` and restart opencode.

## Usage

Once installed, use the skill inside your agent:

- `/codebase-compass <topic>` — analyze one topic, e.g. `/codebase-compass request-flow`
- `/codebase-compass-all` — analyze the full catalog

## Topic catalog

| Topic | Description |
|-------|-------------|
| `overview` | High-level system purpose and structure |
| `folder-structure` | Directory layout and conventions |
| `module-map` | Modules and their responsibilities |
| `dependency-graph` | Internal and external dependencies |
| `bootstrapping` | Application startup and initialization |
| `entrypoints` | CLI, HTTP, job, and event entry points |
| `request-flow` | HTTP request lifecycle |
| `data-flow` | Data movement and transformation |
| `async-jobs` | Background/async job processing |
| `logging` | Logging system |
| `error-handling` | Error handling patterns |
| `validation` | Input validation |
| `testing` | Test structure and conventions |
| `security` | Security controls and concerns |
| `auth` | Authentication |
| `authorization` | Authorization |
| `secrets` | Secrets management |
| `threat-model` | Threat model |
| `database-schema` | Database/schema layer |
| `repositories` | Repository/data access patterns |
| `transactions` | Transaction management |
| `caching` | Caching strategy |
| `api-overview` | API surface (REST, GraphQL, RPC, etc.) |
| `external-integrations` | Third-party integrations |
| `deployment` | Deployment configuration |
| `ci-cd` | CI/CD pipelines |
| `observability` | Metrics, tracing, monitoring |
| `performance` | Performance patterns and concerns |
| `domain-model` | Core domain entities and relationships |
| `business-rules` | Business rules and invariants |
| `feature-breakdown` | Major features and how they are implemented |

## Important rules

- **Read-only analysis:** Codebase-Compass never modifies the source code being analyzed.
- **Traceability:** Every claim in the generated markdown links back to a real source file.
- **Safe output:** All generated files are written under the `codebase-compass/` directory.
- **Graceful handling:** If a topic does not apply to the repository, a short note is produced explaining what was checked.

## Development

```bash
# Build distribution files for all supported agents
npm run build

# Publish to npm
npm publish
```

## Requirements

- Node.js >= 18.0.0

## License

MIT
