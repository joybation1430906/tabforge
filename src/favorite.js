const fs = require('fs');
const path = require('path');
const os = require('os');

const FAVORITES_FILE = path.join(os.homedir(), '.tabforge', 'favorites.json');

function ensureFavoritesFile() {
  const dir = path.dirname(FAVORITES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(FAVORITES_FILE)) fs.writeFileSync(FAVORITES_FILE, '[]');
}

function loadFavorites() {
  ensureFavoritesFile();
  return JSON.parse(fs.readFileSync(FAVORITES_FILE, 'utf8'));
}

function saveFavorites(favorites) {
  ensureFavoritesFile();
  fs.writeFileSync(FAVORITES_FILE, JSON.stringify(favorites, null, 2));
}

function addFavorite(name, url, tags = []) {
  const favorites = loadFavorites();
  if (favorites.find(f => f.name === name)) throw new Error(`Favorite '${name}' already exists`);
  const entry = { name, url, tags, createdAt: new Date().toISOString() };
  favorites.push(entry);
  saveFavorites(favorites);
  return entry;
}

function removeFavorite(name) {
  const favorites = loadFavorites();
  const idx = favorites.findIndex(f => f.name === name);
  if (idx === -1) throw new Error(`Favorite '${name}' not found`);
  const [removed] = favorites.splice(idx, 1);
  saveFavorites(favorites);
  return removed;
}

function getFavorite(name) {
  const favorites = loadFavorites();
  const fav = favorites.find(f => f.name === name);
  if (!fav) throw new Error(`Favorite '${name}' not found`);
  return fav;
}

function searchFavorites(query) {
  const favorites = loadFavorites();
  const q = query.toLowerCase();
  return favorites.filter(f =>
    f.name.toLowerCase().includes(q) ||
    f.url.toLowerCase().includes(q) ||
    f.tags.some(t => t.toLowerCase().includes(q))
  );
}

module.exports = { ensureFavoritesFile, loadFavorites, saveFavorites, addFavorite, removeFavorite, getFavorite, searchFavorites };
