const fs = require('fs');
const path = require('path');
const os = require('os');

const ANNOTATIONS_FILE = path.join(os.homedir(), '.tabforge', 'annotations.json');

function ensureAnnotationsFile() {
  const dir = path.dirname(ANNOTATIONS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(ANNOTATIONS_FILE)) fs.writeFileSync(ANNOTATIONS_FILE, JSON.stringify({}));
}

function loadAnnotations() {
  ensureAnnotationsFile();
  return JSON.parse(fs.readFileSync(ANNOTATIONS_FILE, 'utf8'));
}

function saveAnnotations(annotations) {
  ensureAnnotationsFile();
  fs.writeFileSync(ANNOTATIONS_FILE, JSON.stringify(annotations, null, 2));
}

function addAnnotation(target, note, tags = []) {
  const annotations = loadAnnotations();
  const id = `ann_${Date.now()}`;
  annotations[id] = { id, target, note, tags, createdAt: new Date().toISOString() };
  saveAnnotations(annotations);
  return annotations[id];
}

function removeAnnotation(id) {
  const annotations = loadAnnotations();
  if (!annotations[id]) throw new Error(`Annotation '${id}' not found`);
  delete annotations[id];
  saveAnnotations(annotations);
}

function getAnnotationsForTarget(target) {
  const annotations = loadAnnotations();
  return Object.values(annotations).filter(a => a.target === target);
}

function listAnnotations() {
  return Object.values(loadAnnotations());
}

function searchAnnotations(query) {
  const q = query.toLowerCase();
  return listAnnotations().filter(
    a => a.note.toLowerCase().includes(q) ||
         a.target.toLowerCase().includes(q) ||
         (a.tags || []).some(t => t.toLowerCase().includes(q))
  );
}

module.exports = {
  ensureAnnotationsFile,
  loadAnnotations,
  saveAnnotations,
  addAnnotation,
  removeAnnotation,
  getAnnotationsForTarget,
  listAnnotations,
  searchAnnotations
};
