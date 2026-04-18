const fs = require('fs');
const path = require('path');
const os = require('os');

const ALIASES_FILE = path.join(os.homedir(), '.tabforge', 'aliases.json');

function ensureAliasesFile() {
  const dir = path.dirname(ALIASES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(ALIASES_FILE)) fs.writeFileSync(ALIASES_FILE, '{}');
}

function loadAliases() {
  ensureAliasesFile();
  return JSON.parse(fs.readFileSync(ALIASES_FILE, 'utf8'));
}

function saveAliases(aliases) {
  ensureAliasesFile();
  fs.writeFileSync(ALIASES_FILE, JSON.stringify(aliases, null, 2));
}

function addAlias(name, target) {
  if (!name || !target) throw new Error('Alias name and target are required');
  const aliases = loadAliases();
  aliases[name] = { target, createdAt: new Date().toISOString() };
  saveAliases(aliases);
  return aliases[name];
}

function removeAlias(name) {
  const aliases = loadAliases();
  if (!aliases[name]) throw new Error(`Alias '${name}' not found`);
  delete aliases[name];
  saveAliases(aliases);
}

function resolveAlias(name) {
  const aliases = loadAliases();
  return aliases[name] ? aliases[name].target : null;
}

function listAliases() {
  return loadAliases();
}

module.exports = { ensureAliasesFile, loadAliases, saveAliases, addAlias, removeAlias, resolveAlias, listAliases };
