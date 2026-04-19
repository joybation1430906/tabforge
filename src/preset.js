const fs = require('fs');
const path = require('path');
const os = require('os');

const PRESETS_DIR = path.join(os.homedir(), '.tabforge', 'presets');

function ensurePresetsDir() {
  if (!fs.existsSync(PRESETS_DIR)) fs.mkdirSync(PRESETS_DIR, { recursive: true });
}

function savePreset(name, data) {
  ensurePresetsDir();
  const file = path.join(PRESETS_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function loadPreset(name) {
  const file = path.join(PRESETS_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function listPresets() {
  ensurePresetsDir();
  return fs.readdirSync(PRESETS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deletePreset(name) {
  const file = path.join(PRESETS_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return false;
  fs.unlinkSync(file);
  return true;
}

function renamePreset(oldName, newName) {
  const data = loadPreset(oldName);
  if (!data) return false;
  savePreset(newName, data);
  deletePreset(oldName);
  return true;
}

module.exports = { ensurePresetsDir, savePreset, loadPreset, listPresets, deletePreset, renamePreset };
