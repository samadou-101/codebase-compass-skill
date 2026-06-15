const fs = require('fs');
const path = require('path');
const { pickAgent } = require('./prompt');

const AGENTS = [
  {
    key: 'opencode',
    label: 'opencode',
    marker: '.opencode',
    sourceSkillDir: path.join(__dirname, '..', 'dist', 'opencode', 'skills', 'codebase-compass'),
    targetSkillDir: (root) => path.join(root, '.opencode', 'skills', 'codebase-compass'),
  },
  {
    key: 'claude',
    label: 'Claude Code',
    marker: '.claude',
    sourceSkillDir: path.join(__dirname, '..', 'dist', 'claude', 'skills', 'codebase-compass'),
    targetSkillDir: (root) => path.join(root, '.claude', 'skills', 'codebase-compass'),
  },
  {
    key: 'codex',
    label: 'Codex',
    marker: '.codex',
    sourceSkillDir: path.join(__dirname, '..', 'dist', 'codex', 'skills', 'codebase-compass'),
    targetSkillDir: (root) => path.join(root, '.codex', 'skills', 'codebase-compass'),
  },
  {
    key: 'agents',
    label: 'Open agents / .agents',
    marker: '.agents',
    sourceSkillDir: path.join(__dirname, '..', 'dist', 'agents', 'skills', 'codebase-compass'),
    targetSkillDir: (root) => path.join(root, '.agents', 'skills', 'codebase-compass'),
  },
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyRecursive(source, target) {
  ensureDir(path.dirname(target));
  fs.cpSync(source, target, { recursive: true, force: true });
}

function detectAgents(targetRoot) {
  return AGENTS.filter((agent) => fs.existsSync(path.join(targetRoot, agent.marker)));
}

function readJson(filePath, defaultValue = {}) {
  if (!fs.existsSync(filePath)) {
    return defaultValue;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Failed to parse JSON at ${filePath}: ${error.message}`);
  }
}

function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function mergeOpencodeConfig(targetRoot) {
  const sourcePath = path.join(__dirname, '..', 'dist', 'opencode', 'opencode.json');
  const targetPath = path.join(targetRoot, '.opencode', 'opencode.json');

  if (!fs.existsSync(sourcePath)) {
    throw new Error('Distribution opencode.json not found. Run `npm run build` first.');
  }

  const sourceConfig = readJson(sourcePath);
  const targetConfig = readJson(targetPath, { $schema: 'https://opencode.ai/config.json' });

  // Override command entries for codebase-compass.
  targetConfig.command = targetConfig.command || {};
  if (sourceConfig.command) {
    for (const [key, value] of Object.entries(sourceConfig.command)) {
      targetConfig.command[key] = value;
    }
  }

  // Ensure the local skills path is registered without removing others.
  targetConfig.skills = targetConfig.skills || {};
  targetConfig.skills.paths = targetConfig.skills.paths || [];
  const localSkillsPath = '.opencode/skills';
  if (!targetConfig.skills.paths.includes(localSkillsPath)) {
    targetConfig.skills.paths.push(localSkillsPath);
  }

  writeJson(targetPath, targetConfig);
  console.log(`  Merged commands into ${path.relative(targetRoot, targetPath)}`);
}

async function installAgent(targetRoot, agent) {
  if (!fs.existsSync(agent.sourceSkillDir)) {
    throw new Error(
      `Distribution files for ${agent.label} not found at ${agent.sourceSkillDir}. Run \`npm run build\` first.`
    );
  }

  const targetSkillDir = agent.targetSkillDir(targetRoot);
  copyRecursive(agent.sourceSkillDir, targetSkillDir);
  console.log(`  Installed skill to ${path.relative(targetRoot, targetSkillDir)}`);

  if (agent.key === 'opencode') {
    mergeOpencodeConfig(targetRoot);
  }
}

async function runInstall(targetRoot = process.cwd()) {
  console.log(`Installing Codebase-Compass into ${targetRoot}\n`);

  const detected = detectAgents(targetRoot);
  let selectedAgent;

  if (detected.length === 0) {
    selectedAgent = AGENTS.find((a) => a.key === 'agents');
    console.log('No agent configuration detected. Defaulting to .agents.\n');
  } else if (detected.length === 1) {
    selectedAgent = detected[0];
    console.log(`Detected ${selectedAgent.label} configuration.\n`);
  } else {
    selectedAgent = await pickAgent(detected);
    console.log('');
  }

  await installAgent(targetRoot, selectedAgent);

  console.log(`\nCodebase-Compass installed for ${selectedAgent.label}.`);
  console.log('Usage: /codebase-compass <topic> or /codebase-compass-all');
}

module.exports = { runInstall, AGENTS, detectAgents, installAgent };
