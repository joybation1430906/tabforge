const fs = require('fs');
const path = require('path');
const os = require('os');

const PLUGINS_DIR = path.join(os.homedir(), '.tabforge', 'plugins');

function ensurePluginsDir() {
  if (!fs.existsSync(PLUGINS_DIR)) fs.mkdirSync(PLUGINS_DIR, { recursive: true });
}

function savePlugin(name, plugin) {
  ensurePluginsDir();
  const file = path.join(PLUGINS_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(plugin, null, 2));
}

function loadPlugin(name) {
  const file = path.join(PLUGINS_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function listPlugins() {
  ensurePluginsDir();
  return fs.readdirSync(PLUGINS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deletePlugin(name) {
  const file = path.join(PLUGINS_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return false;
  fs.unlinkSync(file);
  return true;
}

function enablePlugin(name) {
  const plugin = loadPlugin(name);
  if (!plugin) return false;
  plugin.enabled = true;
  savePlugin(name, plugin);
  return true;
}

function disablePlugin(name) {
  const plugin = loadPlugin(name);
  if (!plugin) return false;
  plugin.enabled = false;
  savePlugin(name, plugin);
  return true;
}

module.exports = { ensurePluginsDir, savePlugin, loadPlugin, listPlugins, deletePlugin, enablePlugin, disablePlugin };
