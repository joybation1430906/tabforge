const fs = require('fs');
const path = require('path');

const STATUS_FILE = path.join(process.env.HOME || '.', '.tabforge', 'status.json');

function ensureStatusFile() {
  const dir = path.dirname(STATUS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(STATUS_FILE)) fs.writeFileSync(STATUS_FILE, JSON.stringify({}));
}

function loadStatus() {
  ensureStatusFile();
  return JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
}

function saveStatus(data) {
  ensureStatusFile();
  fs.writeFileSync(STATUS_FILE, JSON.stringify(data, null, 2));
}

function setStatus(key, value) {
  const data = loadStatus();
  data[key] = { value, updatedAt: new Date().toISOString() };
  saveStatus(data);
  return data[key];
}

function getStatus(key) {
  const data = loadStatus();
  return data[key] || null;
}

function removeStatus(key) {
  const data = loadStatus();
  if (!data[key]) return false;
  delete data[key];
  saveStatus(data);
  return true;
}

function listStatus() {
  return loadStatus();
}

function clearStatus() {
  saveStatus({});
}

module.exports = {
  ensureStatusFile,
  loadStatus,
  saveStatus,
  setStatus,
  getStatus,
  removeStatus,
  listStatus,
  clearStatus
};
