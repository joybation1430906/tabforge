import fs from 'fs';
import path from 'path';
import os from 'os';

const RECENT_FILE = path.join(os.homedir(), '.tabforge', 'recent.json');
const MAX_RECENT = 20;

export function ensureRecentFile() {
  const dir = path.dirname(RECENT_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(RECENT_FILE)) fs.writeFileSync(RECENT_FILE, JSON.stringify([]));
}

export function loadRecent() {
  ensureRecentFile();
  return JSON.parse(fs.readFileSync(RECENT_FILE, 'utf8'));
}

export function saveRecent(entries) {
  ensureRecentFile();
  fs.writeFileSync(RECENT_FILE, JSON.stringify(entries, null, 2));
}

export function recordRecent(name, type = 'session') {
  const entries = loadRecent();
  const filtered = entries.filter(e => !(e.name === name && e.type === type));
  filtered.unshift({ name, type, openedAt: new Date().toISOString() });
  saveRecent(filtered.slice(0, MAX_RECENT));
}

export function getRecent(limit = 10) {
  return loadRecent().slice(0, limit);
}

export function clearRecent() {
  saveRecent([]);
}

export function removeRecent(name, type = 'session') {
  const entries = loadRecent();
  saveRecent(entries.filter(e => !(e.name === name && e.type === type)));
}
