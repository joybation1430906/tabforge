const fs = require('fs');
const path = require('path');

const CONTEXTS_DIR = path.join(process.env.HOME || '.', '.tabforge', 'contexts');

function ensureContextsDir() {
  if (!fs.existsSync(CONTEXTS_DIR)) {
    fs.mkdirSync(CONTEXTS_DIR, { recursive: true });
  }
}

function getContextPath(name) {
  return path.join(CONTEXTS_DIR, `${name}.json`);
}

function saveContext(name, data) {
  ensureContextsDir();
  fs.writeFileSync(getContextPath(name), JSON.stringify(data, null, 2));
}

function loadContext(name) {
  const p = getContextPath(name);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function listContexts() {
  ensureContextsDir();
  return fs.readdirSync(CONTEXTS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deleteContext(name) {
  const p = getContextPath(name);
  if (!fs.existsSync(p)) return false;
  fs.unlinkSync(p);
  return true;
}

function renameContext(oldName, newName) {
  const data = loadContext(oldName);
  if (!data) return false;
  saveContext(newName, { ...data, name: newName });
  deleteContext(oldName);
  return true;
}

module.exports = {
  ensureContextsDir,
  getContextPath,
  saveContext,
  loadContext,
  listContexts,
  deleteContext,
  renameContext,
};
