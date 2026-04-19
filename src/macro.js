const fs = require('fs');
const path = require('path');
const os = require('os');

const MACROS_DIR = path.join(os.homedir(), '.tabforge', 'macros');

function ensureMacrosDir() {
  if (!fs.existsSync(MACROS_DIR)) fs.mkdirSync(MACROS_DIR, { recursive: true });
}

function saveMacro(name, steps) {
  ensureMacrosDir();
  const file = path.join(MACROS_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify({ name, steps, createdAt: new Date().toISOString() }, null, 2));
}

function loadMacro(name) {
  const file = path.join(MACROS_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function listMacros() {
  ensureMacrosDir();
  return fs.readdirSync(MACROS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deleteMacro(name) {
  const file = path.join(MACROS_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return false;
  fs.unlinkSync(file);
  return true;
}

function runMacro(name, runner) {
  const macro = loadMacro(name);
  if (!macro) throw new Error(`Macro '${name}' not found`);
  for (const step of macro.steps) {
    runner(step);
  }
  return macro;
}

module.exports = { ensureMacrosDir, saveMacro, loadMacro, listMacros, deleteMacro, runMacro };
