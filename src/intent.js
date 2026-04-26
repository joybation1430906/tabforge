const fs = require('fs');
const path = require('path');
const os = require('os');

const INTENTS_DIR = path.join(os.homedir(), '.tabforge', 'intents');

function ensureIntentsDir() {
  if (!fs.existsSync(INTENTS_DIR)) {
    fs.mkdirSync(INTENTS_DIR, { recursive: true });
  }
}

function getIntentPath(name) {
  return path.join(INTENTS_DIR, `${name}.json`);
}

function saveIntent(name, intent) {
  ensureIntentsDir();
  fs.writeFileSync(getIntentPath(name), JSON.stringify(intent, null, 2));
}

function loadIntent(name) {
  const p = getIntentPath(name);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function listIntents() {
  ensureIntentsDir();
  return fs.readdirSync(INTENTS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deleteIntent(name) {
  const p = getIntentPath(name);
  if (!fs.existsSync(p)) return false;
  fs.unlinkSync(p);
  return true;
}

function renameIntent(oldName, newName) {
  const intent = loadIntent(oldName);
  if (!intent) return false;
  saveIntent(newName, { ...intent, name: newName });
  deleteIntent(oldName);
  return true;
}

module.exports = {
  ensureIntentsDir,
  getIntentPath,
  saveIntent,
  loadIntent,
  listIntents,
  deleteIntent,
  renameIntent,
};
