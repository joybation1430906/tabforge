const fs = require('fs');
const path = require('path');
const { loadSession } = require('./session');

/**
 * Export a session to a YAML file at a given destination path.
 */
function exportSession(sessionName, destPath) {
  const session = loadSession(sessionName);
  if (!session) {
    throw new Error(`Session "${sessionName}" not found.`);
  }

  const yaml = sessionToYaml(session);
  const outPath = destPath || `${sessionName}.yaml`;
  fs.writeFileSync(outPath, yaml, 'utf8');
  return outPath;
}

/**
 * Convert a session object back to YAML string.
 */
function sessionToYaml(session) {
  const lines = [];
  lines.push(`name: ${session.name}`);

  if (session.browser) {
    lines.push(`browser: ${session.browser}`);
  }

  if (session.groups && session.groups.length > 0) {
    lines.push('groups:');
    for (const group of session.groups) {
      lines.push(`  - name: ${group.name}`);
      if (group.tabs && group.tabs.length > 0) {
        lines.push('    tabs:');
        for (const tab of group.tabs) {
          if (typeof tab === 'string') {
            lines.push(`      - url: ${tab}`);
          } else {
            lines.push(`      - url: ${tab.url}`);
            if (tab.title) lines.push(`        title: ${tab.title}`);
            if (tab.pinned) lines.push(`        pinned: ${tab.pinned}`);
          }
        }
      }
    }
  } else if (session.tabs && session.tabs.length > 0) {
    lines.push('tabs:');
    for (const tab of session.tabs) {
      if (typeof tab === 'string') {
        lines.push(`  - url: ${tab}`);
      } else {
        lines.push(`  - url: ${tab.url}`);
        if (tab.title) lines.push(`    title: ${tab.title}`);
        if (tab.pinned) lines.push(`    pinned: ${tab.pinned}`);
      }
    }
  }

  return lines.join('\n') + '\n';
}

module.exports = { exportSession, sessionToYaml };
