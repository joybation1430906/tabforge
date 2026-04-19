const fs = require('fs');
const path = require('path');
const os = require('os');

const BADGES_FILE = path.join(os.homedir(), '.tabforge', 'badges.json');

function ensureBadgesFile() {
  const dir = path.dirname(BADGES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BADGES_FILE)) fs.writeFileSync(BADGES_FILE, JSON.stringify([]));
}

function loadBadges() {
  ensureBadgesFile();
  return JSON.parse(fs.readFileSync(BADGES_FILE, 'utf8'));
}

function saveBadges(badges) {
  ensureBadgesFile();
  fs.writeFileSync(BADGES_FILE, JSON.stringify(badges, null, 2));
}
Badge(name, url, label) {
  const badges = loadBadges();
  if (badges.find(b => b.name === name)) throw new Error(`Badge '${name}' already exists`);
  const badge = { name, url, label: label || name, createdAt: new Date().toISOString() };
  badges.push(badge);
  saveBadges(badges);
  return badge;
}

function removeBadge(name) {
  const badges = loadBadges();
  const idx = badges.findIndex(b => b.name === name);
  if (idx === -1) throw new Error(`Badge '${name}' not found`);
  const [removed] = badges.splice(idx, 1);
  saveBadges(badges);
  return removed;
}

function getBadge(name) {
  const badges = loadBadges();
  const badge = badges.find(b => b.name === name);
  if (!badge) throw new Error(`Badge '${name}' not found`);
  return badge;
}

function listBadges() {
  return loadBadges();
}

module.exports = { ensureBadgesFile, loadBadges, saveBadges, addBadge, removeBadge, getBadge, listBadges };
