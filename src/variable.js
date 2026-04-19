const fs = require('fs');
const path = require('path');
const os = require('os');

const VARIABLES_FILE = path.join(os.homedir(), '.tabforge', 'variables.json');

function ensureVariablesFile() {
  const dir = path.dirname(VARIABLES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VARIABLES_FILE)) fs.writeFileSync(VARIABLES_FILE, '{}');
}

function loadVariables() {
  ensureVariablesFile();
  return JSON.parse(fs.readFileSync(VARIABLES_FILE, 'utf8'));
}

function saveVariables(vars) {
  ensureVariablesFile();
  fs.writeFileSync(VARIABLES_FILE, JSON.stringify(vars, null, 2));
}

function setVariable(key, value) {
  const vars = loadVariables();
  vars[key] = value;
  saveVariables(vars);
  return vars[key];
}

function getVariable(key) {
  const vars = loadVariables();
  return vars[key];
}

function removeVariable(key) {
  const vars = loadVariables();
  if (!(key in vars)) return false;
  delete vars[key];
  saveVariables(vars);
  return true;
}

function listVariables() {
  return loadVariables();
}

function interpolate(str, extra = {}) {
  const vars = { ...loadVariables(), ...extra };
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return key in vars ? vars[key] : `{{${key}}}`;
  });
}

module.exports = { ensureVariablesFile, loadVariables, saveVariables, setVariable, getVariable, removeVariable, listVariables, interpolate };
