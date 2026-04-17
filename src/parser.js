const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

/**
 * Parses a YAML session config file and returns a validated session object.
 * @param {string} filePath - Path to the YAML config file
 * @returns {object} Parsed and validated session config
 */
function parseSessionConfig(filePath) {
  const absPath = path.resolve(filePath);

  if (!fs.existsSync(absPath)) {
    throw new Error(`Config file not found: ${absPath}`);
  }

  const raw = fs.readFileSync(absPath, 'utf8');
  let config;

  try {
    config = yaml.load(raw);
  } catch (err) {
    throw new Error(`Failed to parse YAML: ${err.message}`);
  }

  return validateConfig(config);
}

/**
 * Validates the structure of a parsed config object.
 * @param {object} config
 * @returns {object} Validated config
 */
function validateConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new Error('Config must be a non-empty YAML object');
  }

  if (!config.session || typeof config.session !== 'string') {
    throw new Error('Config must have a "session" name (string)');
  }

  if (!Array.isArray(config.tabs) || config.tabs.length === 0) {
    throw new Error('Config must have a non-empty "tabs" array');
  }

  config.tabs.forEach((tab, i) => {
    if (!tab.url || typeof tab.url !== 'string') {
      throw new Error(`Tab at index ${i} must have a valid "url" string`);
    }
    try {
      new URL(tab.url);
    } catch {
      throw new Error(`Tab at index ${i} has an invalid URL: "${tab.url}"`);
    }
  });

  return {
    session: config.session,
    browser: config.browser || 'chrome',
    tabs: config.tabs.map((tab) => ({
      url: tab.url,
      title: tab.title || null,
      pinned: tab.pinned || false,
    })),
  };
}

module.exports = { parseSessionConfig, validateConfig };
