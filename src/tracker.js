const fs = require('fs');
const path = require('path');
const os = require('os');

const TRACKER_DIR = path.join(os.homedir(), '.tabforge');
const TRACKER_FILE = path.join(TRACKER_DIR, 'tracker.json');

function ensureTrackerFile() {
  if (!fs.existsSync(TRACKER_DIR)) fs.mkdirSync(TRACKER_DIR, { recursive: true });
  if (!fs.existsSync(TRACKER_FILE)) fs.writeFileSync(TRACKER_FILE, JSON.stringify([]));
}

function loadTracker() {
  ensureTrackerFile();
  return JSON.parse(fs.readFileSync(TRACKER_FILE, 'utf8'));
}

function saveTracker(entries) {
  ensureTrackerFile();
  fs.writeFileSync(TRACKER_FILE, JSON.stringify(entries, null, 2));
}

function trackUrl(url, meta = {}) {
  const entries = loadTracker();
  const existing = entries.find(e => e.url === url);
  if (existing) {
    existing.visits = (existing.visits || 1) + 1;
    existing.lastSeen = new Date().toISOString();
    Object.assign(existing, meta);
  } else {
    entries.push({
      url,
      visits: 1,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      ...meta
    });
  }
  saveTracker(entries);
  return entries.find(e => e.url === url);
}

function getTracked(url) {
  const entries = loadTracker();
  return entries.find(e => e.url === url) || null;
}

function listTracked() {
  return loadTracker();
}

function removeTracked(url) {
  const entries = loadTracker();
  const filtered = entries.filter(e => e.url !== url);
  saveTracker(filtered);
  return filtered.length < entries.length;
}

function clearTracker() {
  saveTracker([]);
}

function topTracked(limit = 10) {
  const entries = loadTracker();
  return entries
    .slice()
    .sort((a, b) => (b.visits || 0) - (a.visits || 0))
    .slice(0, limit);
}

module.exports = {
  ensureTrackerFile,
  loadTracker,
  saveTracker,
  trackUrl,
  getTracked,
  listTracked,
  removeTracked,
  clearTracker,
  topTracked
};
