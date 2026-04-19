const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function diffSessions(sessionA, sessionB) {
  const urlsA = new Set((sessionA.tabs || []).map(t => t.url));
  const urlsB = new Set((sessionB.tabs || []).map(t => t.url));

  const added = [...urlsB].filter(u => !urlsA.has(u));
  const removed = [...urlsA].filter(u => !urlsB.has(u));
  const kept = [...urlsA].filter(u => urlsB.has(u));

  return { added, removed, kept };
}

function formatDiff(diff, nameA, nameB) {
  const lines = [];
  lines.push(`Diff: ${nameA} → ${nameB}`);
  lines.push('');
  if (diff.removed.length) {
    lines.push('Removed:');
    diff.removed.forEach(u => lines.push(`  - ${u}`));
  }
  if (diff.added.length) {
    lines.push('Added:');
    diff.added.forEach(u => lines.push(`  + ${u}`));
  }
  if (diff.kept.length) {
    lines.push('Unchanged:');
    diff.kept.forEach(u => lines.push(`    ${u}`));
  }
  if (!diff.added.length && !diff.removed.length) {
    lines.push('No differences found.');
  }
  return lines.join('\n');
}

function diffFromFiles(fileA, fileB) {
  const sessionA = yaml.load(fs.readFileSync(fileA, 'utf8'));
  const sessionB = yaml.load(fs.readFileSync(fileB, 'utf8'));
  return diffSessions(sessionA, sessionB);
}

module.exports = { diffSessions, formatDiff, diffFromFiles };
