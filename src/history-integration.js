/**
 * Wraps launcher to automatically record launches in history.
 */
const { openTab } = require('./launcher');
const { parseSessionConfig } = require('./parser');
const { recordLaunch } = require('./history');
const fs = require('fs');

async function launchWithHistory(configPath, options = {}) {
  const raw = fs.readFileSync(configPath, 'utf8');
  const config = parseSessionConfig(raw);
  const urls = config.tabs.map(t => (typeof t === 'string' ? t : t.url));

  const results = [];
  for (const url of urls) {
    try {
      await openTab(url, options);
      results.push({ url, ok: true });
    } catch (err) {
      results.push({ url, ok: false, error: err.message });
    }
  }

  const launched = results.filter(r => r.ok).map(r => r.url);
  if (launched.length > 0) {
    recordLaunch(configPath, launched);
  }

  const failed = results.filter(r => !r.ok);
  if (failed.length > 0) {
    failed.forEach(f => console.warn(`Warning: failed to open ${f.url}: ${f.error}`));
  }

  return results;
}

module.exports = { launchWithHistory };
