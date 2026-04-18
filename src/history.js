const fs = require('fs');
const path = require('path');
const os = require('os');

const HISTORY_DIR = path.join(os.homedir(), '.tabforge');
const HISTORY_FILE = path.join(HISTORY_DIR, 'history.json');
const MAX_HISTORY = 50;

function ensureHistoryFile() {
  if (!fs.existsSync(HISTORY_DIR)) {
    fs.mkdirSync(HISTORY_DIR, { recursive: true });
  }
  if (!fs.existsSync(HISTORY_FILE)) {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify([]), 'utf8');
  }
}

function loadHistory() {
  ensureHistoryFile();
  const raw = fs.readFileSync(HISTORY_FILE, 'utf8');
  return JSON.parse(raw);
}

function saveHistory(entries) {
  ensureHistoryFile();
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(entries, null, 2), 'utf8');
}

function recordLaunch(configPath, urls) {
  const entries = loadHistory();
  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    configPath: path.resolve(configPath),
    urls,
    count: urls.length,
  };
  entries.unshift(entry);
  if (entries.length > MAX_HISTORY) entries.splice(MAX_HISTORY);
  saveHistory(entries);
  return entry;
}

function getHistory(limit = 10) {
  const entries = loadHistory();
  return entries.slice(0, limit);
}

function clearHistory() {
  saveHistory([]);
}

function deleteHistoryEntry(id) {
  const entries = loadHistory();
  const filtered = entries.filter(e => e.id !== id);
  if (filtered.length === entries.length) return false;
  saveHistory(filtered);
  return true;
}

module.exports = { recordLaunch, getHistory, clearHistory, deleteHistoryEntry, loadHistory };
