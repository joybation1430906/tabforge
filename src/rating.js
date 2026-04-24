const fs = require('fs');
const path = require('path');
const os = require('os');

const RATINGS_FILE = path.join(os.homedir(), '.tabforge', 'ratings.json');

function ensureRatingsFile() {
  const dir = path.dirname(RATINGS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(RATINGS_FILE)) fs.writeFileSync(RATINGS_FILE, JSON.stringify([]));
}

function loadRatings() {
  ensureRatingsFile();
  return JSON.parse(fs.readFileSync(RATINGS_FILE, 'utf8'));
}

function saveRatings(ratings) {
  ensureRatingsFile();
  fs.writeFileSync(RATINGS_FILE, JSON.stringify(ratings, null, 2));
}

function addRating(name, score, note = '') {
  if (score < 1 || score > 5) throw new Error('Rating must be between 1 and 5');
  const ratings = loadRatings();
  const existing = ratings.findIndex(r => r.name === name);
  const entry = { name, score, note, updatedAt: new Date().toISOString() };
  if (existing >= 0) {
    ratings[existing] = entry;
  } else {
    ratings.push({ ...entry, createdAt: entry.updatedAt });
  }
  saveRatings(ratings);
  return entry;
}

function removeRating(name) {
  const ratings = loadRatings();
  const next = ratings.filter(r => r.name !== name);
  if (next.length === ratings.length) throw new Error(`Rating not found: ${name}`);
  saveRatings(next);
}

function getRating(name) {
  const ratings = loadRatings();
  return ratings.find(r => r.name === name) || null;
}

function listRatings() {
  return loadRatings();
}

function topRated(limit = 5) {
  return loadRatings()
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

module.exports = { ensureRatingsFile, loadRatings, saveRatings, addRating, removeRating, getRating, listRatings, topRated };
