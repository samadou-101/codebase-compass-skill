#!/usr/bin/env node

const { runInstall } = require('../src/install');

const args = process.argv.slice(2);
const command = args[0];

function showHelp() {
  console.log(`
Codebase-Compass — installable agent skill

Usage:
  npx codebase-compass install

Installs the Codebase-Compass skill into the current project, choosing the
appropriate agent configuration (.opencode, .claude, .codex, or .agents).
If no agent config is detected, it defaults to .agents.
`);
}

async function main() {
  if (command === 'install') {
    await runInstall();
  } else {
    showHelp();
    process.exit(command ? 1 : 0);
  }
}

main().catch((error) => {
  console.error(`\nError: ${error.message}`);
  process.exit(1);
});
