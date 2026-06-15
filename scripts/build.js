const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const mappings = [
  {
    source: path.join(ROOT, '.agents', 'skills', 'codebase-compass'),
    target: path.join(DIST, 'agents', 'skills', 'codebase-compass'),
  },
  {
    source: path.join(ROOT, '.claude', 'skills', 'codebase-compass'),
    target: path.join(DIST, 'claude', 'skills', 'codebase-compass'),
  },
  {
    source: path.join(ROOT, '.codex', 'skills', 'codebase-compass'),
    target: path.join(DIST, 'codex', 'skills', 'codebase-compass'),
  },
  {
    source: path.join(ROOT, '.opencode', 'skills', 'codebase-compass'),
    target: path.join(DIST, 'opencode', 'skills', 'codebase-compass'),
  },
  {
    source: path.join(ROOT, '.opencode', 'opencode.json'),
    target: path.join(DIST, 'opencode', 'opencode.json'),
  },
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyMapping({ source, target }) {
  if (!fs.existsSync(source)) {
    console.warn(`Source not found, skipping: ${path.relative(ROOT, source)}`);
    return;
  }

  ensureDir(path.dirname(target));
  fs.cpSync(source, target, { recursive: true, force: true });
  console.log(`Copied ${path.relative(ROOT, source)} → ${path.relative(ROOT, target)}`);
}

console.log('Building codebase-compass distribution...\n');
ensureDir(DIST);
mappings.forEach(copyMapping);
console.log('\nBuild complete.');
