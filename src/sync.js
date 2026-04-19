const fs = require('fs');
const path = require('path');
const os = require('os');

const SYNC_DIR = path.join(os.homedir(), '.tabforge', 'sync');
const SYNC_FILE = path.join(SYNC_DIR, 'sync.json');

function ensureSyncDir() {
  if (!fs.existsSync(SYNC_DIR)) fs.mkdirSync(SYNC_DIR, { recursive: true });
  if (!fs.existsSync(SYNC_FILE)) fs.writeFileSync(SYNC_FILE, JSON.stringify({ remotes: [] }, null, 2));
}

function loadSync() {
  ensureSyncDir();
  return JSON.parse(fs.readFileSync(SYNC_FILE, 'utf8'));
}

function saveSync(data) {
  ensureSyncDir();
  fs.writeFileSync(SYNC_FILE, JSON.stringify(data, null, 2));
}

function addRemote(name, url) {
  const data = loadSync();
  if (data.remotes.find(r => r.name === name)) throw new Error(`Remote '${name}' already exists`);
  data.remotes.push({ name, url, addedAt: new Date().toISOString() });
  saveSync(data);
  return data.remotes;
}

function removeRemote(name) {
  const data = loadSync();
  const idx = data.remotes.findIndex(r => r.name === name);
  if (idx === -1) throw new Error(`Remote '${name}' not found`);
  data.remotes.splice(idx, 1);
  saveSync(data);
  return data.remotes;
}

function listRemotes() {
  return loadSync().remotes;
}

function getRemote(name) {
  const remote = loadSync().remotes.find(r => r.name === name);
  if (!remote) throw new Error(`Remote '${name}' not found`);
  return remote;
}

module.exports = { ensureSyncDir, loadSync, saveSync, addRemote, removeRemote, listRemotes, getRemote };
