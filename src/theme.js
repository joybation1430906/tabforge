const fs = require('fs');
const path = require('path');
const os = require('os');

const THEMES_DIR = path.join(os.homedir(), '.tabforge', 'themes');

function ensureThemesDir() {
  if (!fs.existsSync(THEMES_DIR)) fs.mkdirSync(THEMES_DIR, { recursive: true });
}

function saveTheme(name, data) {
  ensureThemesDir();
  const file = path.join(THEMES_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function loadTheme(name) {
  const file = path.join(THEMES_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function listThemes() {
  ensureThemesDir();
  return fs.readdirSync(THEMES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deleteTheme(name) {
  const file = path.join(THEMES_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return false;
  fs.unlinkSync(file);
  return true;
}

function applyTheme(session, theme) {
  if (!theme) return session;
  return { ...session, theme: theme.name, colors: theme.colors };
}

module.exports = { ensureThemesDir, saveTheme, loadTheme, listThemes, deleteTheme, applyTheme };
