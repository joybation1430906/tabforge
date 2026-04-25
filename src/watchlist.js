const fs = require('fs');
const path = require('path');
const os = require('os');

const WATCHLIST_DIR = path.join(os.homedir(), '.tabforge');
const WATCHLIST_FILE = path.join(WATCHLIST_DIR, 'watchlist.json');

function ensureWatchlistFile() {
  if (!fs.existsSync(WATCHLIST_DIR)) fs.mkdirSync(WATCHLIST_DIR, { recursive: true });
  if (!fs.existsSync(WATCHLIST_FILE)) fs.writeFileSync(WATCHLIST_FILE, JSON.stringify([]));
}

function loadWatchlist() {
  ensureWatchlistFile();
  return JSON.parse(fs.readFileSync(WATCHLIST_FILE, 'utf8'));
}

function saveWatchlist(list) {
  ensureWatchlistFile();
  fs.writeFileSync(WATCHLIST_FILE, JSON.stringify(list, null, 2));
}

function addToWatchlist(url, label = '') {
  const list = loadWatchlist();
  if (list.find(e => e.url === url)) throw new Error(`URL already in watchlist: ${url}`);
  const entry = { url, label: label || url, addedAt: new Date().toISOString(), notified: false };
  list.push(entry);
  saveWatchlist(list);
  return entry;
}

function removeFromWatchlist(url) {
  const list = loadWatchlist();
  const next = list.filter(e => e.url !== url);
  if (next.length === list.length) throw new Error(`URL not found in watchlist: ${url}`);
  saveWatchlist(next);
}

function getWatchlist() {
  return loadWatchlist();
}

function markNotified(url) {
  const list = loadWatchlist();
  const entry = list.find(e => e.url === url);
  if (!entry) throw new Error(`URL not found: ${url}`);
  entry.notified = true;
  entry.notifiedAt = new Date().toISOString();
  saveWatchlist(list);
}

function clearWatchlist() {
  saveWatchlist([]);
}

module.exports = {
  ensureWatchlistFile,
  loadWatchlist,
  saveWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  markNotified,
  clearWatchlist
};
