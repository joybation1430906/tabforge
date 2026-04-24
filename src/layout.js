const fs = require('fs');
const path = require('path');
const os = require('os');

const LAYOUTS_DIR = path.join(os.homedir(), '.tabforge', 'layouts');

function ensureLayoutsDir() {
  if (!fs.existsSync(LAYOUTS_DIR)) {
    fs.mkdirSync(LAYOUTS_DIR, { recursive: true });
  }
  return LAYOUTS_DIR;
}

function saveLayout(name, layout) {
  ensureLayoutsDir();
  const file = path.join(LAYOUTS_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(layout, null, 2));
  return layout;
}

function loadLayout(name) {
  const file = path.join(LAYOUTS_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function listLayouts() {
  ensureLayoutsDir();
  return fs.readdirSync(LAYOUTS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deleteLayout(name) {
  const file = path.join(LAYOUTS_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return false;
  fs.unlinkSync(file);
  return true;
}

function renameLayout(oldName, newName) {
  const layout = loadLayout(oldName);
  if (!layout) return false;
  saveLayout(newName, { ...layout, name: newName });
  deleteLayout(oldName);
  return true;
}

module.exports = {
  ensureLayoutsDir,
  saveLayout,
  loadLayout,
  listLayouts,
  deleteLayout,
  renameLayout,
  LAYOUTS_DIR
};
