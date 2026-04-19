const fs = require('fs');
const path = require('path');
const os = require('os');

const LOG_DIR = path.join(os.homedir(), '.tabforge');
const LOG_FILE = path.join(LOG_DIR, 'activity.log');
const MAX_ENTRIES = 200;

function ensureLogFile() {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
  if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, JSON.stringify([]));
}

function loadLog() {
  ensureLogFile();
  try {
    return JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveLog(entries) {
  ensureLogFile();
  fs.writeFileSync(LOG_FILE, JSON.stringify(entries, null, 2));
}

function recordLog(action, details = {}) {
  const entries = loadLog();
  const entry = { timestamp: new Date().toISOString(), action, ...details };
  entries.unshift(entry);
  if (entries.length > MAX_ENTRIES) entries.splice(MAX_ENTRIES);
  saveLog(entries);
  return entry;
}

function getLog(limit = 20) {
  return loadLog().slice(0, limit);
}

function clearLog() {
  saveLog([]);
}

function filterLog(action) {
  return loadLog().filter(e => e.action === action);
}

module.exports = { ensureLogFile, loadLog, saveLog, recordLog, getLog, clearLog, filterLog };
