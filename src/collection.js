const fs = require('fs');
const path = require('path');
const os = require('os');

const COLLECTIONS_DIR = path.join(os.homedir(), '.tabforge', 'collections');

function ensureCollectionsDir() {
  if (!fs.existsSync(COLLECTIONS_DIR)) {
    fs.mkdirSync(COLLECTIONS_DIR, { recursive: true });
  }
  return COLLECTIONS_DIR;
}

function saveCollection(name, urls) {
  ensureCollectionsDir();
  const file = path.join(COLLECTIONS_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify({ name, urls, createdAt: new Date().toISOString() }, null, 2));
  return { name, urls };
}

function loadCollection(name) {
  const file = path.join(COLLECTIONS_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function listCollections() {
  ensureCollectionsDir();
  return fs.readdirSync(COLLECTIONS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deleteCollection(name) {
  const file = path.join(COLLECTIONS_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return false;
  fs.unlinkSync(file);
  return true;
}

function addUrlToCollection(name, url) {
  const col = loadCollection(name) || { name, urls: [], createdAt: new Date().toISOString() };
  if (!col.urls.includes(url)) col.urls.push(url);
  saveCollection(name, col.urls);
  return col;
}

function removeUrlFromCollection(name, url) {
  const col = loadCollection(name);
  if (!col) return null;
  col.urls = col.urls.filter(u => u !== url);
  saveCollection(name, col.urls);
  return col;
}

module.exports = { ensureCollectionsDir, saveCollection, loadCollection, listCollections, deleteCollection, addUrlToCollection, removeUrlFromCollection };
