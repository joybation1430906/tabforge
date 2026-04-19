const fs = require('fs');
const path = require('path');
const os = require('os');

const FLOWS_DIR = path.join(os.homedir(), '.tabforge', 'flows');

function ensureFlowsDir() {
  if (!fs.existsSync(FLOWS_DIR)) fs.mkdirSync(FLOWS_DIR, { recursive: true });
}

function saveFlow(name, flow) {
  ensureFlowsDir();
  const file = path.join(FLOWS_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(flow, null, 2));
}

function loadFlow(name) {
  const file = path.join(FLOWS_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function listFlows() {
  ensureFlowsDir();
  return fs.readdirSync(FLOWS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deleteFlow(name) {
  const file = path.join(FLOWS_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return false;
  fs.unlinkSync(file);
  return true;
}

function renameFlow(oldName, newName) {
  const flow = loadFlow(oldName);
  if (!flow) return false;
  saveFlow(newName, flow);
  deleteFlow(oldName);
  return true;
}

module.exports = { ensureFlowsDir, saveFlow, loadFlow, listFlows, deleteFlow, renameFlow };
