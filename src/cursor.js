const fs = require('fs');
const path = require('path');
const os = require('os');

const CURSORS_DIR = path.join(os.homedir(), '.tabforge', 'cursors');

function ensureCursorsDir() {
  if (!fs.existsSync(CURSORS_DIR)) {
    fs.mkdirSync(CURSORS_DIR, { recursive: true });
  }
}

function getCursorPath(name) {
  return path.join(CURSORS_DIR, `${name}.json`);
}

function saveCursor(name, position) {
  ensureCursorsDir();
  const data = { name, position, updatedAt: new Date().toISOString() };
  fs.writeFileSync(getCursorPath(name), JSON.stringify(data, null, 2));
  return data;
}

function loadCursor(name) {
  const p = getCursorPath(name);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function deleteCursor(name) {
  const p = getCursorPath(name);
  if (!fs.existsSync(p)) return false;
  fs.unlinkSync(p);
  return true;
}

function listCursors() {
  ensureCursorsDir();
  return fs.readdirSync(CURSORS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(CURSORS_DIR, f), 'utf8'));
      return data;
    });
}

function resetCursor(name) {
  return saveCursor(name, 0);
}

module.exports = {
  ensureCursorsDir,
  saveCursor,
  loadCursor,
  deleteCursor,
  listCursors,
  resetCursor,
  CURSORS_DIR,
};
