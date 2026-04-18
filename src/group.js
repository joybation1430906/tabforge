const fs = require('fs');
const path = require('path');
const os = require('os');

const GROUPS_DIR = path.join(os.homedir(), '.tabforge', 'groups');

function ensureGroupsDir() {
  if (!fs.existsSync(GROUPS_DIR)) {
    fs.mkdirSync(GROUPS_DIR, { recursive: true });
  }
  return GROUPS_DIR;
}

function saveGroup(name, urls) {
  ensureGroupsDir();
  const filePath = path.join(GROUPS_DIR, `${name}.json`);
  const data = { name, urls, createdAt: new Date().toISOString() };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return data;
}

function loadGroup(name) {
  const filePath = path.join(GROUPS_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function listGroups() {
  ensureGroupsDir();
  return fs.readdirSync(GROUPS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(GROUPS_DIR, f), 'utf8'));
      return { name: data.name, count: data.urls.length, createdAt: data.createdAt };
    });
}

function deleteGroup(name) {
  const filePath = path.join(GROUPS_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}

function addUrlToGroup(name, url) {
  const group = loadGroup(name);
  if (!group) throw new Error(`Group '${name}' not found`);
  if (!group.urls.includes(url)) group.urls.push(url);
  saveGroup(name, group.urls);
  return group;
}

module.exports = { ensureGroupsDir, saveGroup, loadGroup, listGroups, deleteGroup, addUrlToGroup };
