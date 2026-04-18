const fs = require('fs');
const path = require('path');
const os = require('os');

const TAGS_FILE = path.join(os.homedir(), '.tabforge', 'tags.json');

function ensureTagsFile() {
  const dir = path.dirname(TAGS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(TAGS_FILE)) fs.writeFileSync(TAGS_FILE, JSON.stringify({}));
}

function loadTags() {
  ensureTagsFile();
  return JSON.parse(fs.readFileSync(TAGS_FILE, 'utf8'));
}

function saveTags(tags) {
  ensureTagsFile();
  fs.writeFileSync(TAGS_FILE, JSON.stringify(tags, null, 2));
}

function addTag(sessionName, tag) {
  const tags = loadTags();
  if (!tags[sessionName]) tags[sessionName] = [];
  if (!tags[sessionName].includes(tag)) {
    tags[sessionName].push(tag);
  }
  saveTags(tags);
  return tags[sessionName];
}

function removeTag(sessionName, tag) {
  const tags = loadTags();
  if (!tags[sessionName]) return [];
  tags[sessionName] = tags[sessionName].filter(t => t !== tag);
  if (tags[sessionName].length === 0) delete tags[sessionName];
  saveTags(tags);
  return tags[sessionName] || [];
}

function getTagsForSession(sessionName) {
  const tags = loadTags();
  return tags[sessionName] || [];
}

function findSessionsByTag(tag) {
  const tags = loadTags();
  return Object.entries(tags)
    .filter(([, t]) => t.includes(tag))
    .map(([name]) => name);
}

function clearTagsForSession(sessionName) {
  const tags = loadTags();
  delete tags[sessionName];
  saveTags(tags);
}

module.exports = { ensureTagsFile, loadTags, saveTags, addTag, removeTag, getTagsForSession, findSessionsByTag, clearTagsForSession };
