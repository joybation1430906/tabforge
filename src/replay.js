const fs = require('fs');
const path = require('path');
const os = require('os');

const REPLAY_DIR = path.join(os.homedir(), '.tabforge', 'replays');

function ensureReplayDir() {
  if (!fs.existsSync(REPLAY_DIR)) {
    fs.mkdirSync(REPLAY_DIR, { recursive: true });
  }
}

function getReplayPath(name) {
  return path.join(REPLAY_DIR, `${name}.json`);
}

function saveReplay(name, data) {
  ensureReplayDir();
  fs.writeFileSync(getReplayPath(name), JSON.stringify(data, null, 2));
}

function loadReplay(name) {
  const p = getReplayPath(name);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function listReplays() {
  ensureReplayDir();
  return fs.readdirSync(REPLAY_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deleteReplay(name) {
  const p = getReplayPath(name);
  if (!fs.existsSync(p)) return false;
  fs.unlinkSync(p);
  return true;
}

function recordReplay(name, steps) {
  const replay = {
    name,
    steps,
    createdAt: new Date().toISOString(),
    stepCount: steps.length
  };
  saveReplay(name, replay);
  return replay;
}

function renameReplay(oldName, newName) {
  const data = loadReplay(oldName);
  if (!data) return false;
  data.name = newName;
  saveReplay(newName, data);
  deleteReplay(oldName);
  return true;
}

module.exports = {
  ensureReplayDir,
  getReplayPath,
  saveReplay,
  loadReplay,
  listReplays,
  deleteReplay,
  recordReplay,
  renameReplay
};
