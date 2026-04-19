const fs = require('fs');
const path = require('path');
const os = require('os');

const DRAFTS_DIR = path.join(os.homedir(), '.tabforge', 'drafts');

function ensureDraftsDir() {
  if (!fs.existsSync(DRAFTS_DIR)) {
    fs.mkdirSync(DRAFTS_DIR, { recursive: true });
  }
}

function saveDraft(name, content) {
  ensureDraftsDir();
  const file = path.join(DRAFTS_DIR, `${name}.yaml`);
  fs.writeFileSync(file, content, 'utf8');
  return file;
}

function loadDraft(name) {
  const file = path.join(DRAFTS_DIR, `${name}.yaml`);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf8');
}

function listDrafts() {
  ensureDraftsDir();
  return fs.readdirSync(DRAFTS_DIR)
    .filter(f => f.endsWith('.yaml'))
    .map(f => f.replace('.yaml', ''));
}

function deleteDraft(name) {
  const file = path.join(DRAFTS_DIR, `${name}.yaml`);
  if (!fs.existsSync(file)) return false;
  fs.unlinkSync(file);
  return true;
}

function draftExists(name) {
  return fs.existsSync(path.join(DRAFTS_DIR, `${name}.yaml`));
}

module.exports = { ensureDraftsDir, saveDraft, loadDraft, listDrafts, deleteDraft, draftExists, DRAFTS_DIR };
