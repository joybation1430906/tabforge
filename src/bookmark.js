const fs = require('fs');
const path = require('path');
const os = require('os');

const BOOKMARKS_FILE = path.join(os.homedir(), '.tabforge', 'bookmarks.json');

function ensureBookmarksFile() {
  const dir = path.dirname(BOOKMARKS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BOOKMARKS_FILE)) fs.writeFileSync(BOOKMARKS_FILE, '[]');
}

function loadBookmarks() {
  ensureBookmarksFile();
  return JSON.parse(fs.readFileSync(BOOKMARKS_FILE, 'utf8'));
}

function saveBookmarks(bookmarks) {
  ensureBookmarksFile();
  fs.writeFileSync(BOOKMARKS_FILE, JSON.stringify(bookmarks, null, 2));
}

function addBookmark(name, url, tags = []) {
  const bookmarks = loadBookmarks();
  if (bookmarks.find(b => b.name === name)) {
    throw new Error(`Bookmark '${name}' already exists`);
  }
  const bookmark = { name, url, tags, createdAt: new Date().toISOString() };
  bookmarks.push(bookmark);
  saveBookmarks(bookmarks);
  return bookmark;
}

function removeBookmark(name) {
  const bookmarks = loadBookmarks();
  const idx = bookmarks.findIndex(b => b.name === name);
  if (idx === -1) throw new Error(`Bookmark '${name}' not found`);
  bookmarks.splice(idx, 1);
  saveBookmarks(bookmarks);
}

function findBookmarks(tag) {
  const bookmarks = loadBookmarks();
  if (!tag) return bookmarks;
  return bookmarks.filter(b => b.tags.includes(tag));
}

module.exports = { ensureBookmarksFile, loadBookmarks, addBookmark, removeBookmark, findBookmarks };
