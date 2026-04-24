const fs = require('fs');
const path = require('path');
const os = require('os');

const SNAPSHOTS_DIR = path.join(os.homedir(), '.tabforge', 'snapshots');

function ensureSnapshotsDir() {
  if (!fs.existsSync(SNAPSHOTS_DIR)) {
    fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
  }
}

function getSnapshotPath(name) {
  return path.join(SNAPSHOTS_DIR, `${name}.json`);
}

function saveSnapshot(name, data) {
  ensureSnapshotsDir();
  const snapshot = {
    name,
    createdAt: new Date().toISOString(),
    tabs: data.tabs || [],
    meta: data.meta || {}
  };
  fs.writeFileSync(getSnapshotPath(name), JSON.stringify(snapshot, null, 2));
  return snapshot;
}

function loadSnapshot(name) {
  const p = getSnapshotPath(name);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function listSnapshots() {
  ensureSnapshotsDir();
  return fs.readdirSync(SNAPSHOTS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(SNAPSHOTS_DIR, f), 'utf8'));
      return { name: data.name, createdAt: data.createdAt, tabCount: (data.tabs || []).length };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function deleteSnapshot(name) {
  const p = getSnapshotPath(name);
  if (!fs.existsSync(p)) return false;
  fs.unlinkSync(p);
  return true;
}

function renameSnapshot(oldName, newName) {
  const snapshot = loadSnapshot(oldName);
  if (!snapshot) return false;
  snapshot.name = newName;
  fs.writeFileSync(getSnapshotPath(newName), JSON.stringify(snapshot, null, 2));
  fs.unlinkSync(getSnapshotPath(oldName));
  return true;
}

module.exports = { ensureSnapshotsDir, getSnapshotPath, saveSnapshot, loadSnapshot, listSnapshots, deleteSnapshot, renameSnapshot };
