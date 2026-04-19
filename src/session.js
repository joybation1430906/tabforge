const fs = require('fs');
const path = require('path');
const os = require('os');

const SESSION_DIR = path.join(os.homedir(), '.tabforge', 'sessions');

function ensureSessionDir() {
  if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
  }
}

function saveSession(name, tabs) {
  ensureSessionDir();
  const sessionFile = path.join(SESSION_DIR, `${name}.json`);
  const data = {
    name,
    savedAt: new Date().toISOString(),
    tabs,
  };
  fs.writeFileSync(sessionFile, JSON.stringify(data, null, 2));
  return sessionFile;
}

function loadSession(name) {
  const sessionFile = path.join(SESSION_DIR, `${name}.json`);
  if (!fs.existsSync(sessionFile)) {
    throw new Error(`Session "${name}" not found.`);
  }
  const raw = fs.readFileSync(sessionFile, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(`Session "${name}" is corrupted and could not be parsed.`);
  }
}

function listSessions() {
  ensureSessionDir();
  return fs.readdirSync(SESSION_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deleteSession(name) {
  const sessionFile = path.join(SESSION_DIR, `${name}.json`);
  if (!fs.existsSync(sessionFile)) {
    throw new Error(`Session "${name}" not found.`);
  }
  fs.unlinkSync(sessionFile);
}

function renameSession(oldName, newName) {
  const oldFile = path.join(SESSION_DIR, `${oldName}.json`);
  const newFile = path.join(SESSION_DIR, `${newName}.json`);
  if (!fs.existsSync(oldFile)) {
    throw new Error(`Session "${oldName}" not found.`);
  }
  if (fs.existsSync(newFile)) {
    throw new Error(`A session named "${newName}" already exists.`);
  }
  const data = loadSession(oldName);
  data.name = newName;
  fs.writeFileSync(newFile, JSON.stringify(data, null, 2));
  fs.unlinkSync(oldFile);
}

module.exports = { saveSession, loadSession, listSessions, deleteSession, renameSession, SESSION_DIR };
