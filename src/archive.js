const fs = require('fs');
const path = require('path');
const os = require('os');

const ARCHIVE_DIR = path.join(os.homedir(), '.tabforge', 'archive');

function ensureArchiveDir() {
  if (!fs.existsSync(ARCHIVE_DIR)) fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
}

function archiveSession(name, data) {
  ensureArchiveDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${name}_${timestamp}.json`;
  const filepath = path.join(ARCHIVE_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify({ name, archivedAt: new Date().toISOString(), ...data }, null, 2));
  return filename;
}

function listArchives() {
  ensureArchiveDir();
  return fs.readdirSync(ARCHIVE_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(ARCHIVE_DIR, f), 'utf8'));
      return { file: f, name: data.name, archivedAt: data.archivedAt };
    })
    .sort((a, b) => new Date(b.archivedAt) - new Date(a.archivedAt));
}

function loadArchive(filename) {
  const filepath = path.join(ARCHIVE_DIR, filename);
  if (!fs.existsSync(filepath)) throw new Error(`Archive not found: ${filename}`);
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function deleteArchive(filename) {
  const filepath = path.join(ARCHIVE_DIR, filename);
  if (!fs.existsSync(filepath)) throw new Error(`Archive not found: ${filename}`);
  fs.unlinkSync(filepath);
}

function clearArchives() {
  ensureArchiveDir();
  const files = fs.readdirSync(ARCHIVE_DIR).filter(f => f.endsWith('.json'));
  files.forEach(f => fs.unlinkSync(path.join(ARCHIVE_DIR, f)));
  return files.length;
}

module.exports = { ensureArchiveDir, archiveSession, listArchives, loadArchive, deleteArchive, clearArchives };
