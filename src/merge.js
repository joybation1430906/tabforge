const { parseSessionConfig } = require('./parser');
const fs = require('fs');
const path = require('path');

/**
 * Merge two or more session configs into one.
 * Later sessions override earlier ones for top-level keys;
 * tabs arrays are concatenated and deduplicated by url.
 */
function mergeSessions(sessions) {
  if (!sessions || sessions.length === 0) return null;
  if (sessions.length === 1) return sessions[0];

  const base = { ...sessions[0] };

  for (let i = 1; i < sessions.length; i++) {
    const s = sessions[i];
    // Merge top-level scalar keys (name, browser, profile, etc.)
    for (const key of Object.keys(s)) {
      if (key === 'tabs') continue;
      base[key] = s[key];
    }
    // Merge tabs: concatenate, deduplicate by url
    const existingUrls = new Set((base.tabs || []).map(t => t.url));
    for (const tab of s.tabs || []) {
      if (!existingUrls.has(tab.url)) {
        base.tabs = base.tabs || [];
        base.tabs.push(tab);
        existingUrls.add(tab.url);
      }
    }
  }

  return base;
}

/**
 * Load and merge session YAML files from given file paths.
 */
function mergeFromFiles(filePaths) {
  const sessions = filePaths.map(fp => {
    const raw = fs.readFileSync(path.resolve(fp), 'utf8');
    return parseSessionConfig(raw);
  });
  return mergeSessions(sessions);
}

/**
 * Return a summary of what changed when merging (added tabs, overridden keys).
 */
function describeMerge(base, overlay) {
  const changes = [];
  for (const key of Object.keys(overlay)) {
    if (key === 'tabs') continue;
    if (base[key] !== overlay[key]) {
      changes.push(`  key "${key}": ${JSON.stringify(base[key])} -> ${JSON.stringify(overlay[key])}`);
    }
  }
  const baseUrls = new Set((base.tabs || []).map(t => t.url));
  const added = (overlay.tabs || []).filter(t => !baseUrls.has(t.url));
  for (const tab of added) {
    changes.push(`  tab added: ${tab.url}`);
  }
  return changes;
}

module.exports = { mergeSessions, mergeFromFiles, describeMerge };
