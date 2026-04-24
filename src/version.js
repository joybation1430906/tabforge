const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.TABFORGE_DATA_DIR || path.join(require('os').homedir(), '.tabforge');
const VERSIONS_DIR = path.join(DATA_DIR, 'versions');

function ensureVersionsDir() {
  if (!fs.existsSync(VERSIONS_DIR)) {
    fs.mkdirSync(VERSIONS_DIR, { recursive: true });
  }
}

function getVersionPath(name) {
  return path.join(VERSIONS_DIR, `${name}.json`);
}

function loadVersions(name) {
  ensureVersionsDir();
  const vpath = getVersionPath(name);
  if (!fs.existsSync(vpath)) return [];
  try {
    return JSON.parse(fs.readFileSync(vpath, 'utf8'));
  } catch {
    return [];
  }
}

function saveVersions(name, versions) {
  ensureVersionsDir();
  fs.writeFileSync(getVersionPath(name), JSON.stringify(versions, null, 2));
}

function pushVersion(name, data, label = '') {
  const versions = loadVersions(name);
  const entry = {
    index: versions.length,
    label: label || `v${versions.length + 1}`,
    timestamp: new Date().toISOString(),
    data,
  };
  versions.push(entry);
  saveVersions(name, versions);
  return entry;
}

function getVersion(name, index) {
  const versions = loadVersions(name);
  if (index < 0 || index >= versions.length) return null;
  return versions[index];
}

function getLatestVersion(name) {
  const versions = loadVersions(name);
  if (!versions.length) return null;
  return versions[versions.length - 1];
}

function deleteVersionHistory(name) {
  const vpath = getVersionPath(name);
  if (fs.existsSync(vpath)) fs.unlinkSync(vpath);
}

module.exports = {
  ensureVersionsDir,
  getVersionPath,
  loadVersions,
  saveVersions,
  pushVersion,
  getVersion,
  getLatestVersion,
  deleteVersionHistory,
};
