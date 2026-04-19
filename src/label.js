const fs = require('fs');
const path = require('path');
const os = require('os');

const LABELS_FILE = path.join(os.homedir(), '.tabforge', 'labels.json');

function ensureLabelsFile() {
  const dir = path.dirname(LABELS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(LABELS_FILE)) fs.writeFileSync(LABELS_FILE, JSON.stringify({}));
}

function loadLabels() {
  ensureLabelsFile();
  return JSON.parse(fs.readFileSync(LABELS_FILE, 'utf8'));
}

function saveLabels(labels) {
  ensureLabelsFile();
  fs.writeFileSync(LABELS_FILE, JSON.stringify(labels, null, 2));
}

function addLabel(name, color = 'default', description = '') {
  const labels = loadLabels();
  if (labels[name]) throw new Error(`Label '${name}' already exists`);
  labels[name] = { color, description, createdAt: new Date().toISOString() };
  saveLabels(labels);
  return labels[name];
}

function removeLabel(name) {
  const labels = loadLabels();
  if (!labels[name]) throw new Error(`Label '${name}' not found`);
  delete labels[name];
  saveLabels(labels);
}

function getLabel(name) {
  const labels = loadLabels();
  if (!labels[name]) throw new Error(`Label '${name}' not found`);
  return { name, ...labels[name] };
}

function listLabels() {
  const labels = loadLabels();
  return Object.entries(labels).map(([name, data]) => ({ name, ...data }));
}

function updateLabel(name, updates) {
  const labels = loadLabels();
  if (!labels[name]) throw new Error(`Label '${name}' not found`);
  labels[name] = { ...labels[name], ...updates };
  saveLabels(labels);
  return labels[name];
}

module.exports = { ensureLabelsFile, loadLabels, saveLabels, addLabel, removeLabel, getLabel, listLabels, updateLabel };
