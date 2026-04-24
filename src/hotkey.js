const fs = require('fs');
const path = require('path');
const os = require('os');

const HOTKEYS_FILE = path.join(os.homedir(), '.tabforge', 'hotkeys.json');

function ensureHotkeysFile() {
  const dir = path.dirname(HOTKEYS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(HOTKEYS_FILE)) fs.writeFileSync(HOTKEYS_FILE, JSON.stringify([]));
}

function loadHotkeys() {
  ensureHotkeysFile();
  return JSON.parse(fs.readFileSync(HOTKEYS_FILE, 'utf8'));
}

function saveHotkeys(hotkeys) {
  ensureHotkeysFile();
  fs.writeFileSync(HOTKEYS_FILE, JSON.stringify(hotkeys, null, 2));
}

function addHotkey(key, target, type = 'session') {
  const hotkeys = loadHotkeys();
  const existing = hotkeys.find(h => h.key === key);
  if (existing) throw new Error(`Hotkey '${key}' already exists`);
  const hotkey = { key, target, type, createdAt: new Date().toISOString() };
  hotkeys.push(hotkey);
  saveHotkeys(hotkeys);
  return hotkey;
}

function removeHotkey(key) {
  const hotkeys = loadHotkeys();
  const idx = hotkeys.findIndex(h => h.key === key);
  if (idx === -1) throw new Error(`Hotkey '${key}' not found`);
  const [removed] = hotkeys.splice(idx, 1);
  saveHotkeys(hotkeys);
  return removed;
}

function getHotkey(key) {
  const hotkeys = loadHotkeys();
  return hotkeys.find(h => h.key === key) || null;
}

function listHotkeys() {
  return loadHotkeys();
}

module.exports = {
  ensureHotkeysFile,
  loadHotkeys,
  saveHotkeys,
  addHotkey,
  removeHotkey,
  getHotkey,
  listHotkeys
};
