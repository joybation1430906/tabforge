const fs = require('fs');
const path = require('path');

const SHORTCUTS_FILE = path.join(process.env.HOME || '.', '.tabforge', 'shortcuts.json');

function ensureShortcutsFile() {
  const dir = path.dirname(SHORTCUTS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(SHORTCUTS_FILE)) fs.writeFileSync(SHORTCUTS_FILE, JSON.stringify({}));
}

function loadShortcuts() {
  ensureShortcutsFile();
  return JSON.parse(fs.readFileSync(SHORTCUTS_FILE, 'utf8'));
}

function saveShortcuts(shortcuts) {
  ensureShortcutsFile();
  fs.writeFileSync(SHORTCUTS_FILE, JSON.stringify(shortcuts, null, 2));
}

function addShortcut(key, target, description = '') {
  const shortcuts = loadShortcuts();
  if (shortcuts[key]) throw new Error(`Shortcut '${key}' already exists`);
  shortcuts[key] = { target, description, createdAt: new Date().toISOString() };
  saveShortcuts(shortcuts);
  return shortcuts[key];
}

function removeShortcut(key) {
  const shortcuts = loadShortcuts();
  if (!shortcuts[key]) throw new Error(`Shortcut '${key}' not found`);
  delete shortcuts[key];
  saveShortcuts(shortcuts);
}

function getShortcut(key) {
  const shortcuts = loadShortcuts();
  return shortcuts[key] || null;
}

function listShortcuts() {
  return loadShortcuts();
}

module.exports = { ensureShortcutsFile, loadShortcuts, saveShortcuts, addShortcut, removeShortcut, getShortcut, listShortcuts };
