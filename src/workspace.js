const fs = require('fs');
const path = require('path');
const os = require('os');

const WORKSPACES_DIR = path.join(os.homedir(), '.tabforge', 'workspaces');

function ensureWorkspacesDir() {
  if (!fs.existsSync(WORKSPACES_DIR)) {
    fs.mkdirSync(WORKSPACES_DIR, { recursive: true });
  }
  return WORKSPACES_DIR;
}

function saveWorkspace(name, data) {
  ensureWorkspacesDir();
  const file = path.join(WORKSPACES_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify({ name, ...data, updatedAt: new Date().toISOString() }, null, 2));
  return file;
}

function loadWorkspace(name) {
  const file = path.join(WORKSPACES_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function listWorkspaces() {
  ensureWorkspacesDir();
  return fs.readdirSync(WORKSPACES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deleteWorkspace(name) {
  const file = path.join(WORKSPACES_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return false;
  fs.unlinkSync(file);
  return true;
}

function renameWorkspace(oldName, newName) {
  const workspace = loadWorkspace(oldName);
  if (!workspace) return false;
  saveWorkspace(newName, { ...workspace, name: newName });
  deleteWorkspace(oldName);
  return true;
}

module.exports = { ensureWorkspacesDir, saveWorkspace, loadWorkspace, listWorkspaces, deleteWorkspace, renameWorkspace };
